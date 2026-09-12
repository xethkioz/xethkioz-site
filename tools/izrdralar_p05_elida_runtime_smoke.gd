extends Node

const ELIDA_SCENE := preload("res://scenes/characters/P05ElidaRuntime.tscn")
const DummyScript := preload("res://tools/elida_support_dummy.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var elida := ELIDA_SCENE.instantiate() as CharacterBody2D
	add_child(elida)
	var dummy := Node2D.new()
	dummy.name = "SupportDummy"
	dummy.set_script(DummyScript)
	add_child(dummy)
	await get_tree().process_frame

	_validate_identity(elida)
	await _validate_movement(elida, dummy)
	await _validate_actions(elida, dummy)
	await _validate_damage_recovery(elida)

	if failures.is_empty():
		print("IZRDRALAR_P05_ELIDA_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P05_ELIDA_RUNTIME_FAIL")
	get_tree().quit(1)

func _validate_identity(elida: CharacterBody2D) -> void:
	if elida == null:
		failures.append("P05 Elida scene failed to instantiate")
		return
	if str(elida.call("support_role")) != "Curadora / Soporte Principal":
		failures.append("P05 role contract mismatch")
	if str(elida.call("element_affinity")) != "Agua / Escudo Fluido":
		failures.append("P05 affinity contract mismatch")
	if str(elida.call("bond_name")) != "Okuninust":
		failures.append("P05 bond must remain Okuninust")
	if str(elida.call("support_state")) != "idle_peaceful":
		failures.append("P05 must start in idle_peaceful")
	var visual := elida.get_node_or_null("ElidaRuntimeVisual") as Node2D
	if visual == null:
		failures.append("P05 runtime visual missing")
	elif str(visual.call("visual_contract_name")) != "P05_ELIDA_PROTOTYPE_RENDERER_NOT_FINAL_ART":
		failures.append("P05 renderer must remain explicitly provisional")

func _validate_movement(elida: CharacterBody2D, dummy: Node2D) -> void:
	elida.global_position = Vector2.ZERO
	dummy.global_position = Vector2(180, 0)
	elida.call("set_support_enabled", true, dummy)
	var origin := elida.global_position
	await get_tree().create_timer(0.30).timeout
	var moved := elida.global_position.distance_to(origin)
	if moved <= 1.0:
		failures.append("P05 walk_calm support movement did not move")
	if moved >= 70.0:
		failures.append("P05 support movement teleported instead of accelerating")
	if str(elida.call("support_state")) != "walk_calm":
		failures.append("P05 movement did not enter walk_calm")
	elida.call("set_support_enabled", false, dummy)
	elida.global_position = Vector2.ZERO
	dummy.global_position = Vector2(48, 0)
	await get_tree().process_frame

func _validate_actions(elida: CharacterBody2D, dummy: Node2D) -> void:
	elida.call("set_support_target", dummy)
	dummy.set("health", 40.0)
	if not bool(elida.call("trigger_water_surge")):
		failures.append("P05 water_surge failed to activate")
	await get_tree().process_frame
	if str(elida.call("support_state")) != "water_surge":
		failures.append("P05 water_surge state missing")
	if float(dummy.get("health")) <= 40.0:
		failures.append("P05 water_surge did not heal target")
	await get_tree().create_timer(0.78).timeout

	if not bool(elida.call("trigger_hydro_shield")):
		failures.append("P05 hydro_shield failed to activate")
	await get_tree().process_frame
	if float(elida.call("shield_remaining")) <= 0.0:
		failures.append("P05 hydro_shield timer missing")
	if absf(float(elida.call("shield_damage_multiplier")) - 0.65) > 0.001:
		failures.append("P05 hydro_shield multiplier mismatch")
	if float(dummy.get("guard_left")) <= 0.0:
		failures.append("P05 hydro_shield did not bridge to compatible target")
	await get_tree().create_timer(0.74).timeout

	if not bool(elida.call("trigger_okuninust_blessing")):
		failures.append("P05 Okuninust blessing failed to activate")
	await get_tree().process_frame
	if float(elida.call("blessing_remaining")) <= 0.0:
		failures.append("P05 blessing timer missing")
	if float(dummy.get("status_immunity_left")) <= 0.0:
		failures.append("P05 blessing did not bridge status immunity")
	await get_tree().create_timer(0.88).timeout

	# Sanctuary is passive only while support mode is enabled and target is in range.
	dummy.set("health", 35.0)
	elida.call("set_support_enabled", true, dummy)
	await get_tree().create_timer(0.35).timeout
	elida.call("set_support_enabled", false, dummy)
	if float(dummy.get("health")) <= 35.0:
		failures.append("P05 SanctuaryArea did not regenerate nearby ally")

func _validate_damage_recovery(elida: CharacterBody2D) -> void:
	var before := float(elida.call("support_health"))
	elida.call("receive_support_hit", 20.0, elida.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if float(elida.call("support_health")) >= before:
		failures.append("P05 hurt did not reduce health")
	if str(elida.call("support_state")) != "hurt":
		failures.append("P05 hurt state missing")
	await get_tree().create_timer(0.24).timeout
	elida.call("receive_support_hit", 999.0)
	await get_tree().process_frame
	if str(elida.call("support_state")) != "downed":
		failures.append("P05 downed state missing")
	await get_tree().create_timer(4.30).timeout
	if str(elida.call("support_state")) == "downed":
		failures.append("P05 did not recover from temporary downed state")
	if float(elida.call("support_health")) <= 0.0:
		failures.append("P05 recovered with invalid health")
