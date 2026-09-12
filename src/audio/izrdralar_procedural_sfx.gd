class_name IzrdralarProceduralSfx
extends RefCounted

# Minimal original SFX bank synthesized at runtime for the M01-M05 internal
# candidate. This intentionally does not decode or reuse the external XWB/XSB
# banks kept in Drive as reference material.

const MIX_RATE := 22050

static func build(kind: String) -> AudioStreamWAV:
	var spec := _spec(kind)
	if spec.is_empty():
		return null
	var duration := float(spec["duration"])
	var sample_count := maxi(1, int(round(duration * MIX_RATE)))
	var bytes := PackedByteArray()
	bytes.resize(sample_count * 2)
	var start_hz := float(spec["start_hz"])
	var end_hz := float(spec["end_hz"])
	var gain := float(spec["gain"])
	var harmonic := float(spec["harmonic"])
	var click_gain := float(spec.get("click", 0.0))

	for index in range(sample_count):
		var time_value := float(index) / float(MIX_RATE)
		var progress := clampf(time_value / maxf(duration, 0.001), 0.0, 1.0)
		# Integral of a linear frequency ramp. This keeps chirps smooth even at the
		# deliberately low 22.05 kHz rate used for compact pixel-action feedback.
		var phase := TAU * (start_hz * time_value + 0.5 * (end_hz - start_hz) * time_value * time_value / maxf(duration, 0.001))
		var attack := minf(1.0, progress * 18.0)
		var decay := pow(1.0 - progress, 2.2)
		var envelope := attack * decay
		var wave := sin(phase) + sin(phase * 2.01) * harmonic
		if click_gain > 0.0:
			wave += sin(phase * 4.03) * click_gain * pow(1.0 - progress, 7.0)
		var sample_value := clampi(roundi(wave * envelope * gain * 32767.0), -32768, 32767)
		bytes.encode_s16(index * 2, sample_value)

	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_DISABLED
	stream.data = bytes
	return stream

static func _spec(kind: String) -> Dictionary:
	match kind:
		"slash":
			return {"start_hz": 250.0, "end_hz": 520.0, "duration": 0.12, "gain": 0.23, "harmonic": 0.24, "click": 0.14}
		"hit":
			return {"start_hz": 180.0, "end_hz": 85.0, "duration": 0.10, "gain": 0.29, "harmonic": 0.30, "click": 0.22}
		"burst":
			return {"start_hz": 470.0, "end_hz": 205.0, "duration": 0.17, "gain": 0.21, "harmonic": 0.28, "click": 0.10}
		"hurt":
			return {"start_hz": 150.0, "end_hz": 70.0, "duration": 0.15, "gain": 0.22, "harmonic": 0.34, "click": 0.08}
		"pickup":
			return {"start_hz": 590.0, "end_hz": 920.0, "duration": 0.20, "gain": 0.16, "harmonic": 0.18, "click": 0.0}
		"death":
			return {"start_hz": 165.0, "end_hz": 42.0, "duration": 0.28, "gain": 0.19, "harmonic": 0.33, "click": 0.05}
		"line":
			return {"start_hz": 390.0, "end_hz": 690.0, "duration": 0.13, "gain": 0.13, "harmonic": 0.18, "click": 0.04}
		"ward", "rune":
			return {"start_hz": 330.0, "end_hz": 265.0, "duration": 0.16, "gain": 0.11, "harmonic": 0.22, "click": 0.0}
		"telegraph":
			return {"start_hz": 220.0, "end_hz": 300.0, "duration": 0.11, "gain": 0.065, "harmonic": 0.12, "click": 0.0}
		_:
			return {}
