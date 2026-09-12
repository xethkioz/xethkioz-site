class_name IzrdralarAmbientAudio
extends Node

# Original low-volume ambience synthesized at runtime for M01-M05.
# No external samples, XNB/XWB banks or reference-game audio are decoded.
# Six-second profiles use frequencies that complete whole cycles at the loop
# boundary, avoiding an audible click when AudioStreamWAV loops.

const MIX_RATE := 11025
const LOOP_SECONDS := 6.0

var map_id: String = "M01"
var _player: AudioStreamPlayer

func configure(map_value: String) -> void:
	map_id = map_value if not map_value.is_empty() else "M01"
	if is_inside_tree():
		_refresh_stream()

func _ready() -> void:
	if DisplayServer.get_name() == "headless":
		return
	_player = AudioStreamPlayer.new()
	_player.name = "IzrdralarAmbientPlayer"
	add_child(_player)
	_refresh_stream()

func _process(_delta: float) -> void:
	if not is_instance_valid(_player):
		return
	_player.volume_db = AccessibilityService.ambience_volume_db
	_player.stream_paused = not AccessibilityService.ambience_enabled
	if AccessibilityService.ambience_enabled and not _player.playing:
		_player.play()

func _refresh_stream() -> void:
	if not is_instance_valid(_player):
		return
	_player.stop()
	_player.stream = build_stream(map_id)
	_player.volume_db = AccessibilityService.ambience_volume_db
	if AccessibilityService.ambience_enabled and _player.stream != null:
		_player.play()
	_player.stream_paused = not AccessibilityService.ambience_enabled

static func build_stream(map_value: String) -> AudioStreamWAV:
	var profile := _profile(map_value)
	var sample_count := int(MIX_RATE * LOOP_SECONDS)
	var bytes := PackedByteArray()
	bytes.resize(sample_count * 2)

	var base_hz := float(profile["base_hz"])
	var second_hz := float(profile["second_hz"])
	var air_hz := float(profile["air_hz"])
	var gain := float(profile["gain"])
	var pulse_depth := float(profile["pulse_depth"])
	var pulse_hz := float(profile["pulse_hz"])
	var drift_depth := float(profile["drift_depth"])

	for index in range(sample_count):
		var t := float(index) / float(MIX_RATE)
		var pulse := 1.0 - pulse_depth + pulse_depth * (0.5 + 0.5 * sin(TAU * pulse_hz * t))
		var drift := 1.0 + drift_depth * sin(TAU * (1.0 / LOOP_SECONDS) * t)
		var low := sin(TAU * base_hz * t) * 0.58
		var body := sin(TAU * second_hz * t + 0.45) * 0.28
		var air := sin(TAU * air_hz * t + 1.1) * 0.10
		var shimmer := sin(TAU * (air_hz * 2.0) * t + 0.2) * 0.04
		var wave := (low + body + air + shimmer) * pulse * drift
		var sample_value := clampi(roundi(wave * gain * 32767.0), -32768, 32767)
		bytes.encode_s16(index * 2, sample_value)

	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_begin = 0
	stream.loop_end = sample_count
	stream.data = bytes
	return stream

static func _profile(map_value: String) -> Dictionary:
	match map_value:
		"M02":
			# Aldea del Alba: warm, stable and less ominous.
			return {"base_hz":84.0, "second_hz":126.0, "air_hz":252.0, "gain":0.040, "pulse_depth":0.14, "pulse_hz":1.0/3.0, "drift_depth":0.05}
		"M03":
			# Lago Encantado: wider harmonic spacing and more air.
			return {"base_hz":60.0, "second_hz":120.0, "air_hz":240.0, "gain":0.036, "pulse_depth":0.18, "pulse_hz":0.5, "drift_depth":0.08}
		"M04":
			# Ruinas/Santuario: low resonance with restrained instability.
			return {"base_hz":54.0, "second_hz":81.0, "air_hz":216.0, "gain":0.038, "pulse_depth":0.24, "pulse_hz":1.0/3.0, "drift_depth":0.10}
		"M05":
			# Corazón del Bosque: darkest profile and strongest breathing pulse.
			return {"base_hz":48.0, "second_hz":72.0, "air_hz":144.0, "gain":0.042, "pulse_depth":0.34, "pulse_hz":0.5, "drift_depth":0.12}
		_:
			# M01 Cuenca del Despertar: sparse, uncertain but not hostile.
			return {"base_hz":72.0, "second_hz":108.0, "air_hz":216.0, "gain":0.034, "pulse_depth":0.18, "pulse_hz":0.5, "drift_depth":0.07}
