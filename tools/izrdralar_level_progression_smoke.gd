extends Node

const PlayerScript := preload("res://src/player/player_controller_production.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	_ensure_runtime_inputs()
	GameState.reset_new_game()
	var player := CharacterBody2D.new()
	player.name = "ProgressionPlayer"
	player.set_script(PlayerScript)
	add_child(player)
	# This smoke verifies deterministic stat growth, not the per-frame mana regen.
	# Freeze physics immediately after _ready so frame timing cannot contaminate
	# the exact current-value assertions below.
	player.set_physics_process(false)
	await get_tree().process_frame

	_check_close("L1 max health", float(player.get("max_health")), 100.0)
	_check_close("L1 max mana", float(player.get("max_mana")), 80.0)
	_check_close("L1 attack", float(player.get("attack_damage")), 22.0)

	player.set("health", 50.0)
	player.set("mana", 40.0)
	GameState.add_xp(GameState.xp_to_next())
	if GameState.player_level != 2:
		failures.append("expected level 2, got %d" % GameState.player_level)
	_check_close("L2 max health", float(player.get("max_health")), 106.0)
	_check_close("L2 max mana", float(player.get("max_mana")), 84.0)
	_check_close("L2 attack", float(player.get("attack_damage")), 23.5)
	# Level-up grants only the newly earned capacity; it must not become a free full heal.
	_check_close("L2 current health delta", float(player.get("health")), 56.0)
	_check_close("L2 current mana delta", float(player.get("mana")), 44.0)

	GameState.add_xp(GameState.xp_to_next())
	if GameState.player_level != 3:
		failures.append("expected level 3, got %d" % GameState.player_level)
	_check_close("L3 max health", float(player.get("max_health")), 112.0)
	_check_close("L3 max mana", float(player.get("max_mana")), 88.0)
	_check_close("L3 attack", float(player.get("attack_damage")), 25.0)
	_check_close("L3 current health delta", float(player.get("health")), 62.0)
	_check_close("L3 current mana delta", float(player.get("mana")), 48.0)

	player.queue_free()
	GameState.reset_new_game()
	await get_tree().process_frame
	_finish()

func _ensure_runtime_inputs() -> void:
	for action in ["move_left", "move_right", "move_up", "move_down", "dash", "attack", "interact"]:
		if not InputMap.has_action(action):
			InputMap.add_action(action)

func _check_close(label: String, actual: float, expected: float) -> void:
	if absf(actual - expected) > 0.01:
		failures.append("%s %.2f != %.2f" % [label, actual, expected])

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_LEVEL_PROGRESSION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_LEVEL_PROGRESSION_FAIL")
	get_tree().quit(1)
