extends Node

const AmbientScript := preload("res://src/audio/izrdralar_ambient_audio.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var hashes: Dictionary = {}
	var expected_samples := int(AmbientScript.MIX_RATE * AmbientScript.LOOP_SECONDS)
	var expected_bytes := expected_samples * 2

	for map_id in ["M01", "M02", "M03", "M04", "M05"]:
		var stream: AudioStreamWAV = AmbientScript.build_stream(map_id)
		if stream == null:
			failures.append("%s returned null ambience stream" % map_id)
			continue
		if stream.mix_rate != AmbientScript.MIX_RATE:
			failures.append("%s mix rate %d != %d" % [map_id, stream.mix_rate, AmbientScript.MIX_RATE])
		if stream.format != AudioStreamWAV.FORMAT_16_BITS:
			failures.append("%s is not 16-bit PCM" % map_id)
		if stream.stereo:
			failures.append("%s should remain mono" % map_id)
		if stream.loop_mode != AudioStreamWAV.LOOP_FORWARD:
			failures.append("%s loop mode is not forward" % map_id)
		if stream.loop_begin != 0 or stream.loop_end != expected_samples:
			failures.append("%s invalid loop boundaries %d..%d" % [map_id, stream.loop_begin, stream.loop_end])
		if stream.data.size() != expected_bytes:
			failures.append("%s data bytes %d != %d" % [map_id, stream.data.size(), expected_bytes])
		var stream_hash := hash(stream.data)
		if hashes.has(stream_hash):
			failures.append("%s ambience duplicated another map profile" % map_id)
		hashes[stream_hash] = map_id

	# Default/fallback must deliberately match M01, making unknown map ids safe.
	var fallback: AudioStreamWAV = AmbientScript.build_stream("UNKNOWN")
	var m01: AudioStreamWAV = AmbientScript.build_stream("M01")
	if hash(fallback.data) != hash(m01.data):
		failures.append("unknown map ambience does not fall back to M01")

	_finish()

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_AMBIENT_AUDIO_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_AMBIENT_AUDIO_FAIL")
	get_tree().quit(1)
