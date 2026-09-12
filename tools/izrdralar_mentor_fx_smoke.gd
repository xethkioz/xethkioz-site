extends Node

const FxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")
const ProceduralSfx := preload("res://src/audio/izrdralar_procedural_sfx.gd")

const CASES := {
	"player_wave": "wave",
	"player_guard": "guard",
	"player_mark": "mark",
	"player_root": "root",
	"player_shot": "shot",
	"player_trap": "trap",
	"player_charge": "charge",
	"player_regen": "regen"
}

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	for effect_id_value in CASES.keys():
		var effect_id := str(effect_id_value)
		var expected_kind := str(CASES[effect_id])
		_check_fx(effect_id, expected_kind)
		_check_sfx(expected_kind)
	await get_tree().process_frame
	_finish()

func _check_fx(effect_id: String, expected_kind: String) -> void:
	var fx := FxFactory.spawn(self, effect_id, Vector2(64, 64), Vector2.RIGHT)
	if fx == null:
		failures.append("%s did not spawn" % effect_id)
		return
	if str(fx.get("_kind")) != expected_kind:
		failures.append("%s kind mismatch: %s" % [effect_id, str(fx.get("_kind"))])
	if float(fx.get("_duration")) <= 0.0:
		failures.append("%s has invalid duration" % effect_id)
	fx.queue_free()

func _check_sfx(kind: String) -> void:
	var stream := ProceduralSfx.build(kind)
	if stream == null:
		failures.append("%s has no procedural SFX" % kind)
		return
	if stream.format != AudioStreamWAV.FORMAT_16_BITS:
		failures.append("%s SFX is not PCM 16-bit" % kind)
	if stream.mix_rate != ProceduralSfx.MIX_RATE:
		failures.append("%s SFX mix rate mismatch" % kind)
	if stream.stereo:
		failures.append("%s SFX unexpectedly stereo" % kind)
	if stream.data.size() < 256:
		failures.append("%s SFX data too small" % kind)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_MENTOR_FX_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_MENTOR_FX_FAIL")
	get_tree().quit(1)
