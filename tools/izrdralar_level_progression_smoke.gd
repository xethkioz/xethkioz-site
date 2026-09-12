extends Node

const PlayerScript := preload("res://src/player/player_controller_production.gd")
const RouteObjectiveScript := preload("res://src/world/izrdralar_route_objective.gd")
const BossScript := preload("res://src/npc/boss5_guardian.gd")
const LAYOUT_PATH := "res://data/regions/izrdralar_m01_m05_layouts.json"

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
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

	_check_core_inputs()
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
	await get_tree().process_frame
	_check_full_clear_route_pacing()
	GameState.reset_new_game()
	await get_tree().process_frame
	_finish()

func _check_full_clear_route_pacing() -> void:
	var layouts := _load_layouts()
	if layouts.is_empty():
		return

	var m01_required_xp := _enemy_xp(layouts, "M01", ["brote_goblin", "slime_prismatico"])
	var m03_xp := _enemy_xp(layouts, "M03")
	var m04_xp := _enemy_xp(layouts, "M04")
	var boss := BossScript.new()
	var boss_xp := int(boss.get("xp_reward"))
	boss.free()

	var opening_route_xp := m01_required_xp + RouteObjectiveScript.authored_xp_reward("m01_opening_resonance") + RouteObjectiveScript.authored_xp_reward("m02_prisma_atlas")
	var lake_route_xp := m03_xp + RouteObjectiveScript.authored_xp_reward("m03_lake_resonance")
	var ruins_route_xp := m04_xp + RouteObjectiveScript.authored_xp_reward("m04_sanctuary_resonance")
	var finale_xp := boss_xp + RouteObjectiveScript.authored_xp_reward("m05_stabilization")

	# Reference full-clear pacing. Optional M01 explorer/lore/POIs remain bonus XP;
	# these checks protect the authored baseline and route-order convergence.
	_check_int("opening route XP", opening_route_xp, 92)
	_check_int("lake route XP", lake_route_xp, 128)
	_check_int("ruins route XP", ruins_route_xp, 211)
	_check_int("M05 finale XP", finale_xp, 310)

	GameState.reset_new_game()
	GameState.add_xp(opening_route_xp)
	_check_progress_state("opening baseline", 1, 92)
	GameState.add_xp(lake_route_xp)
	_check_progress_state("lake-first midpoint", 2, 70)
	GameState.add_xp(ruins_route_xp)
	_check_progress_state("lake-first convergence", 3, 61)
	GameState.add_xp(finale_xp)
	_check_progress_state("lake-first finale", 4, 61)

	GameState.reset_new_game()
	GameState.add_xp(opening_route_xp)
	GameState.add_xp(ruins_route_xp)
	_check_progress_state("ruins-first midpoint", 2, 153)
	GameState.add_xp(lake_route_xp)
	_check_progress_state("ruins-first convergence", 3, 61)
	GameState.add_xp(finale_xp)
	_check_progress_state("ruins-first finale", 4, 61)

func _load_layouts() -> Dictionary:
	if not FileAccess.file_exists(LAYOUT_PATH):
		failures.append("layout JSON missing")
		return {}
	var file := FileAccess.open(LAYOUT_PATH, FileAccess.READ)
	if file == null:
		failures.append("layout JSON could not be opened")
		return {}
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not (parsed is Dictionary):
		failures.append("layout JSON invalid")
		return {}
	return parsed.get("maps", {})

func _enemy_xp(layouts: Dictionary, map_id: String, required_ids: Array = []) -> int:
	var total := 0
	var map_data: Dictionary = layouts.get(map_id, {})
	for raw_enemy in map_data.get("enemies", []):
		if not (raw_enemy is Dictionary):
			continue
		var enemy: Dictionary = raw_enemy
		var enemy_id := str(enemy.get("id", ""))
		if not required_ids.is_empty() and not required_ids.has(enemy_id):
			continue
		total += int(enemy.get("xp", 0))
	return total

func _check_progress_state(label: String, expected_level: int, expected_xp: int) -> void:
	if GameState.player_level != expected_level or GameState.player_xp != expected_xp:
		failures.append("%s level/xp %d/%d != %d/%d" % [label, GameState.player_level, GameState.player_xp, expected_level, expected_xp])

func _check_core_inputs() -> void:
	for action in ["move_left", "move_right", "move_up", "move_down", "dash", "attack", "interact"]:
		if not InputMap.has_action(action):
			failures.append("player did not register core input: %s" % action)
			continue
		if InputMap.action_get_events(action).is_empty():
			failures.append("player registered %s without default key event" % action)

func _check_int(label: String, actual: int, expected: int) -> void:
	if actual != expected:
		failures.append("%s %d != %d" % [label, actual, expected])

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
