extends Node

const HudScript := preload("res://src/ui/hud_controller_production_compact.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	GameState.reset_new_game()
	var hud := HudScript.new()
	hud.name = "HudAccessibilitySmoke"
	add_child(hud)
	await get_tree().process_frame

	EventBus.player_progress_changed.emit(3, 25, 310)
	EventBus.player_health_changed.emit(28.0, 112.0)
	EventBus.player_mana_changed.emit(44.0, 88.0)
	await get_tree().process_frame

	var level_label := hud.get("hp_label") as Label
	var progress_label := hud.get("progress_label") as Label
	var hp_value := hud.get("hp_value_label") as Label
	var mana_value := hud.get("mana_value_label") as Label
	var hp_bar := hud.get("hp_bar") as ColorRect

	_expect_contains("level label", level_label.text if level_label else "", "NIVEL 3")
	_expect_contains("XP label", progress_label.text if progress_label else "", "25/310")
	_expect_contains("critical HP numeric", hp_value.text if hp_value else "", "HP 28/112")
	_expect_contains("critical HP text cue", hp_value.text if hp_value else "", "BAJA")
	_expect_contains("MP numeric", mana_value.text if mana_value else "", "MP 44/88")
	if hp_bar == null or hp_bar.size.x < 31.0 or hp_bar.size.x > 34.0:
		failures.append("critical HP bar width does not match 25%% health")

	EventBus.player_health_changed.emit(80.0, 112.0)
	await get_tree().process_frame
	if hp_value != null and hp_value.text.contains("BAJA"):
		failures.append("critical text cue remained after health recovered")

	hud.queue_free()
	GameState.reset_new_game()
	await get_tree().process_frame
	_finish()

func _expect_contains(label: String, actual: String, expected_fragment: String) -> void:
	if not actual.contains(expected_fragment):
		failures.append("%s missing '%s' in '%s'" % [label, expected_fragment, actual])

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_HUD_ACCESSIBILITY_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_HUD_ACCESSIBILITY_FAIL")
	get_tree().quit(1)
