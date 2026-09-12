extends Node

const ISABELLA_SCENE := preload("res://scenes/characters/P08IsabellaRuntime.tscn")
const DummyScript := preload("res://tools/isabella_chaos_dummy.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var isabella := ISABELLA_SCENE.instantiate() as CharacterBody2D
	add_child(isabella)
	var ally := _make_dummy("Ally")
	var enemy_a := _make_dummy("EnemyA")
	var enemy_b := _make_dummy("EnemyB")
	var enemy_c := _make_dummy("EnemyC")
	var enemy_far := _make_dummy("EnemyFar")
	await get_tree().process_frame

	_validate_identity(isabella)
	await _validate_movement(isabella, ally)
	await _validate_controlled_chaos_cycle(isabella, enemy_a, enemy_b, enemy_c)
	await _validate_chaos_burst(isabella, enemy_a, enemy_far)
	await _validate_heller_fury_boundary(isabella, enemy_a, enemy_far)
	await _validate_damage_recovery(isabella)

	if failures.is_empty():
		print("IZRDRALAR_P08_ISABELLA_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P08_ISABELLA_RUNTIME_FAIL")
	get_tree().quit(1)

func _make_dummy(name_value: String) -> Node2D:
	var dummy := Node2D.new()
	dummy.name = name_value
	dummy.set_script(DummyScript)
	add_child(dummy)
	return dummy

func _reset_dummy(dummy: Node2D) -> void:
	dummy.call("reset_status")

func _validate_identity(isabella: CharacterBody2D) -> void:
	if isabella == null:
		failures.append("P08 Isabella scene failed to instantiate")
		return
	if int(isabella.call("character_age")) != 8:
		failures.append("P08 Isabella age contract mismatch")
	if str(isabella.call("support_role")) != "Mentora de Magia Caótica y Pirotecnia":
		failures.append("P08 role contract mismatch")
	if str(isabella.call("element_affinity")) != "Fuego / Caos Controlado":
		failures.append("P08 affinity must use current Fire/Controlled Chaos canon")
	if str(isabella.call("bond_name")) != "Heller":
		failures.append("P08 bond must remain Heller")
	if str(isabella.call("support_state")) != "idle_playful":
		failures.append("P08 must start idle_playful")
	var visual := isabella.get_node_or_null("IsabellaRuntimeVisual") as Node2D
	if visual == null:
		failures.append("P08 runtime visual missing")
	elif str(visual.call("visual_contract_name")) != "P08_ISABELLA_PROTOTYPE_RENDERER_NOT_FINAL_ART":
		failures.append("P08 renderer must remain explicitly provisional")

func _validate_movement(isabella: CharacterBody2D, ally: Node2D) -> void:
	isabella.global_position = Vector2.ZERO
	ally.global_position = Vector2(180, 0)
	isabella.call("set_support_enabled", true, ally)
	var origin := isabella.global_position
	await get_tree().create_timer(0.28).timeout
	var moved := isabella.global_position.distance_to(origin)
	if moved <= 1.0:
		failures.append("P08 walk_hop support movement did not move")
	if moved >= 75.0:
		failures.append("P08 support movement teleported instead of accelerating")
	if str(isabella.call("support_state")) != "walk_hop":
		failures.append("P08 movement did not enter walk_hop")
	isabella.call("set_support_enabled", false, ally)
	isabella.global_position = Vector2.ZERO
	await get_tree().process_frame

func _validate_controlled_chaos_cycle(isabella: CharacterBody2D, enemy_a: Node2D, enemy_b: Node2D, enemy_c: Node2D) -> void:
	for enemy in [enemy_a, enemy_b, enemy_c]:
		_reset_dummy(enemy)
		enemy.global_position = isabella.global_position + Vector2(46, 0)
	if not bool(isabella.call("trigger_spark_shot", enemy_a)):
		failures.append("P08 spark_shot burn pass failed to activate")
	await get_tree().process_frame
	if str(isabella.call("support_state")) != "spark_shot":
		failures.append("P08 spark_shot state missing")
	if float(enemy_a.get("health")) >= 100.0 or float(enemy_a.get("burn_left")) <= 0.0:
		failures.append("P08 first controlled-chaos effect must deal damage and burn")
	if str(isabella.call("last_secondary_effect")) != "burn":
		failures.append("P08 chaos cycle first effect mismatch")
	await get_tree().create_timer(0.38).timeout

	if not bool(isabella.call("trigger_spark_shot", enemy_b)):
		failures.append("P08 spark_shot stun pass failed to activate")
	await get_tree().process_frame
	if float(enemy_b.get("health")) >= 100.0 or float(enemy_b.get("stun_left")) <= 0.0:
		failures.append("P08 second controlled-chaos effect must deal damage and stun")
	if str(isabella.call("last_secondary_effect")) != "stun":
		failures.append("P08 chaos cycle second effect mismatch")
	await get_tree().create_timer(0.38).timeout

	if not bool(isabella.call("trigger_spark_shot", enemy_c)):
		failures.append("P08 spark_shot chain pass failed to activate")
	await get_tree().process_frame
	if int(enemy_c.get("chain_hits")) != 1 or float(enemy_c.get("last_chain_damage")) <= 0.0:
		failures.append("P08 third controlled-chaos effect must create a chain hit")
	if str(isabella.call("last_secondary_effect")) != "chain":
		failures.append("P08 chaos cycle third effect mismatch")
	if int(isabella.call("chaos_cursor")) != 3:
		failures.append("P08 controlled chaos cursor must advance deterministically")
	await get_tree().create_timer(0.38).timeout

func _validate_chaos_burst(isabella: CharacterBody2D, enemy_near: Node2D, enemy_far: Node2D) -> void:
	_reset_dummy(enemy_near)
	_reset_dummy(enemy_far)
	enemy_near.global_position = isabella.global_position + Vector2(55, 0)
	enemy_far.global_position = isabella.global_position + Vector2(130, 0)
	if not bool(isabella.call("trigger_chaos_burst", [enemy_near, enemy_far])):
		failures.append("P08 chaos_burst failed to activate")
	await get_tree().process_frame
	if str(isabella.call("support_state")) != "chaos_burst":
		failures.append("P08 chaos_burst state missing")
	if float(enemy_near.get("health")) >= 100.0:
		failures.append("P08 chaos_burst did not damage target inside radius")
	if float(enemy_far.get("health")) < 100.0:
		failures.append("P08 chaos_burst affected target outside radius")
	await get_tree().create_timer(0.67).timeout

func _validate_heller_fury_boundary(isabella: CharacterBody2D, enemy_near: Node2D, enemy_far: Node2D) -> void:
	_reset_dummy(enemy_near)
	_reset_dummy(enemy_far)
	enemy_near.global_position = isabella.global_position + Vector2(50, 0)
	enemy_far.global_position = isabella.global_position + Vector2(120, 0)
	if not bool(isabella.call("trigger_heller_fury", [enemy_near, enemy_far])):
		failures.append("P08 heller_fury failed to activate")
	await get_tree().process_frame
	if str(isabella.call("support_state")) != "heller_fury":
		failures.append("P08 heller_fury state missing")
	if float(enemy_near.get("health")) >= 100.0 or float(enemy_near.get("burn_left")) < 2.0:
		failures.append("P08 Heller Fury did not apply bounded fire/burn to inside target")
	if float(enemy_far.get("health")) < 100.0 or float(enemy_far.get("burn_left")) > 0.0:
		failures.append("P08 Heller Fury escaped its controlled boundary")
	await get_tree().create_timer(0.82).timeout

func _validate_damage_recovery(isabella: CharacterBody2D) -> void:
	isabella.call("receive_support_hit", 12.0, isabella.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if str(isabella.call("support_state")) != "hurt":
		failures.append("P08 hurt state missing")
	await get_tree().create_timer(0.22).timeout
	isabella.call("receive_support_hit", 999.0)
	await get_tree().process_frame
	if str(isabella.call("support_state")) != "downed":
		failures.append("P08 downed state missing")
	await get_tree().create_timer(3.32).timeout
	if str(isabella.call("support_state")) == "downed":
		failures.append("P08 did not recover from temporary downed state")
	if float(isabella.call("support_health")) <= 0.0:
		failures.append("P08 recovered with invalid health")
