extends Node

const FERMIN_SCENE := preload("res://scenes/characters/P07FerminRuntime.tscn")
const DummyScript := preload("res://tools/fermin_seismic_dummy.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var fermin := FERMIN_SCENE.instantiate() as CharacterBody2D
	add_child(fermin)
	var ally := _make_dummy("Ally")
	var enemy_near := _make_dummy("EnemyNear")
	var enemy_far := _make_dummy("EnemyFar")
	await get_tree().process_frame

	_validate_identity(fermin)
	await _validate_movement(fermin, ally)
	await _validate_ground_slam(fermin, enemy_near, enemy_far)
	await _validate_rock_armor(fermin)
	await _validate_seismic_charge(fermin, enemy_near)
	await _validate_damage_recovery(fermin)

	if failures.is_empty():
		print("IZRDRALAR_P07_FERMIN_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P07_FERMIN_RUNTIME_FAIL")
	get_tree().quit(1)

func _make_dummy(name_value: String) -> Node2D:
	var dummy := Node2D.new()
	dummy.name = name_value
	dummy.set_script(DummyScript)
	add_child(dummy)
	return dummy

func _validate_identity(fermin: CharacterBody2D) -> void:
	if fermin == null:
		failures.append("P07 Fermin scene failed to instantiate")
		return
	if int(fermin.call("character_age")) != 13:
		failures.append("P07 Fermin age contract mismatch")
	if str(fermin.call("support_role")) != "Mentor de Fuerza e Impacto":
		failures.append("P07 role contract mismatch")
	if str(fermin.call("element_affinity")) != "Tierra / Densidad Sísmica":
		failures.append("P07 affinity contract mismatch")
	if str(fermin.call("bond_name")) != "Mozaruk":
		failures.append("P07 bond must remain Mozaruk")
	if str(fermin.call("support_state")) != "idle_sturdy":
		failures.append("P07 must start idle_sturdy")
	var visual := fermin.get_node_or_null("FerminRuntimeVisual") as Node2D
	if visual == null:
		failures.append("P07 runtime visual missing")
	elif str(visual.call("visual_contract_name")) != "P07_FERMIN_PROTOTYPE_RENDERER_NOT_FINAL_ART":
		failures.append("P07 renderer must remain explicitly provisional")

func _validate_movement(fermin: CharacterBody2D, ally: Node2D) -> void:
	fermin.global_position = Vector2.ZERO
	ally.global_position = Vector2(180, 0)
	fermin.call("set_support_enabled", true, ally)
	var origin := fermin.global_position
	await get_tree().create_timer(0.30).timeout
	var moved := fermin.global_position.distance_to(origin)
	if moved <= 1.0:
		failures.append("P07 walk_heavy_step support movement did not move")
	if moved >= 75.0:
		failures.append("P07 support movement teleported instead of accelerating")
	if str(fermin.call("support_state")) != "walk_heavy_step":
		failures.append("P07 movement did not enter walk_heavy_step")
	fermin.call("set_support_enabled", false, ally)
	fermin.global_position = Vector2.ZERO
	await get_tree().process_frame

func _validate_ground_slam(fermin: CharacterBody2D, enemy_near: Node2D, enemy_far: Node2D) -> void:
	enemy_near.global_position = fermin.global_position + Vector2(46, 0)
	enemy_far.global_position = fermin.global_position + Vector2(150, 0)
	enemy_near.set("health", 100.0)
	enemy_near.set("stun_left", 0.0)
	enemy_near.set("last_knockback_strength", 0.0)
	enemy_far.set("health", 100.0)
	if not bool(fermin.call("trigger_ground_slam", [enemy_near, enemy_far])):
		failures.append("P07 ground_slam failed to activate")
	await get_tree().process_frame
	if str(fermin.call("support_state")) != "ground_slam":
		failures.append("P07 ground_slam state missing")
	if float(enemy_near.get("health")) >= 100.0 or float(enemy_near.get("stun_left")) <= 0.0 or float(enemy_near.get("last_knockback_strength")) <= 0.0:
		failures.append("P07 ground_slam did not apply damage/stun/knockback to near target")
	if float(enemy_far.get("health")) < 100.0:
		failures.append("P07 ground_slam affected target outside radius")
	await get_tree().create_timer(0.76).timeout

func _validate_rock_armor(fermin: CharacterBody2D) -> void:
	if not bool(fermin.call("trigger_rock_armor")):
		failures.append("P07 rock_armor failed to activate")
	await get_tree().process_frame
	if str(fermin.call("support_state")) != "rock_armor":
		failures.append("P07 rock_armor state missing")
	if float(fermin.call("rock_armor_remaining")) <= 0.0:
		failures.append("P07 rock armor timer missing")
	var before := float(fermin.call("support_health"))
	fermin.call("receive_support_hit", 20.0)
	await get_tree().process_frame
	var lost := before - float(fermin.call("support_health"))
	if lost <= 0.0 or lost >= 20.0:
		failures.append("P07 rock armor did not mitigate incoming damage")
	await get_tree().create_timer(0.70).timeout

func _validate_seismic_charge(fermin: CharacterBody2D, enemy_near: Node2D) -> void:
	fermin.global_position = Vector2.ZERO
	enemy_near.global_position = Vector2(40, 0)
	enemy_near.set("health", 100.0)
	enemy_near.set("last_knockback_strength", 0.0)
	if not bool(fermin.call("trigger_seismic_charge", Vector2.RIGHT, [enemy_near])):
		failures.append("P07 seismic_charge failed to activate")
	var origin := fermin.global_position
	await get_tree().create_timer(0.28).timeout
	var moved := fermin.global_position.distance_to(origin)
	if moved <= 8.0:
		failures.append("P07 seismic_charge did not move Fermín")
	if moved >= 80.0:
		failures.append("P07 seismic_charge teleported instead of moving through physics")
	if str(fermin.call("support_state")) != "seismic_charge":
		failures.append("P07 seismic_charge state missing during charge")
	if float(enemy_near.get("health")) >= 100.0 or float(enemy_near.get("last_knockback_strength")) <= 0.0:
		failures.append("P07 seismic_charge did not hit/knockback crossed target")
	await get_tree().create_timer(0.30).timeout

func _validate_damage_recovery(fermin: CharacterBody2D) -> void:
	fermin.call("receive_support_hit", 14.0, fermin.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if str(fermin.call("support_state")) != "hurt":
		failures.append("P07 hurt state missing")
	await get_tree().create_timer(0.24).timeout
	fermin.call("receive_support_hit", 999.0)
	await get_tree().process_frame
	if str(fermin.call("support_state")) != "downed":
		failures.append("P07 downed state missing")
	await get_tree().create_timer(4.12).timeout
	if str(fermin.call("support_state")) == "downed":
		failures.append("P07 did not recover from temporary downed state")
	if float(fermin.call("support_health")) <= 0.0:
		failures.append("P07 recovered with invalid health")
