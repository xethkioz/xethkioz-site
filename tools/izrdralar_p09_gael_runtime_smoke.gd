extends Node

const GAEL_SCENE := preload("res://scenes/characters/P09GaelRuntime.tscn")
const DummyScript := preload("res://tools/gael_stealth_dummy.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var gael := GAEL_SCENE.instantiate() as CharacterBody2D
	add_child(gael)
	var ally := _make_dummy("Ally")
	var enemy := _make_dummy("Enemy")
	var side_enemy := _make_dummy("SideEnemy")
	await get_tree().physics_frame

	_validate_identity(gael)
	await _validate_sprint(gael, ally)
	await _validate_veil_and_dodge(gael)
	await _validate_kahezer_dash(gael, enemy)
	await _validate_gale_precision(gael, enemy, side_enemy)
	await _validate_damage_recovery(gael)

	if failures.is_empty():
		print("IZRDRALAR_P09_GAEL_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P09_GAEL_RUNTIME_FAIL")
	get_tree().quit(1)

func _make_dummy(name_value: String) -> Node2D:
	var dummy := Node2D.new()
	dummy.name = name_value
	dummy.set_script(DummyScript)
	add_child(dummy)
	return dummy

func _reset_dummy(dummy: Node2D) -> void:
	dummy.call("reset_status")

func _validate_identity(gael: CharacterBody2D) -> void:
	if gael == null:
		failures.append("P09 Gael scene failed to instantiate")
		return
	if int(gael.call("character_age")) != 7:
		failures.append("P09 Gael age contract mismatch")
	if str(gael.call("support_role")) != "Mentor de Precisión, Movilidad y Acecho":
		failures.append("P09 role contract mismatch")
	if str(gael.call("element_affinity")) != "Viento / Acecho Místico":
		failures.append("P09 affinity contract mismatch")
	if str(gael.call("bond_name")) != "Kahezer":
		failures.append("P09 bond must remain Kahezer")
	if str(gael.call("support_state")) != "idle_stealth":
		failures.append("P09 must start idle_stealth")
	var visual := gael.get_node_or_null("GaelRuntimeVisual") as Node2D
	if visual == null:
		failures.append("P09 runtime visual missing")
	elif str(visual.call("visual_contract_name")) != "P09_GAEL_PROTOTYPE_RENDERER_NOT_FINAL_ART":
		failures.append("P09 renderer must remain explicitly provisional")

func _validate_sprint(gael: CharacterBody2D, ally: Node2D) -> void:
	gael.global_position = Vector2.ZERO
	ally.global_position = Vector2(220, 0)
	gael.call("set_support_enabled", true, ally)
	var origin: Vector2 = gael.global_position
	await get_tree().create_timer(0.24).timeout
	var moved: float = gael.global_position.distance_to(origin)
	if moved <= 2.0:
		failures.append("P09 sprint_wind support movement did not move")
	if moved >= 70.0:
		failures.append("P09 support movement teleported instead of accelerating")
	if str(gael.call("support_state")) != "sprint_wind":
		failures.append("P09 movement did not enter sprint_wind")
	gael.call("set_support_enabled", false, ally)
	gael.global_position = Vector2.ZERO
	await get_tree().physics_frame

func _validate_veil_and_dodge(gael: CharacterBody2D) -> void:
	var hp_before: float = float(gael.call("support_health"))
	if not bool(gael.call("trigger_shadow_veil")):
		failures.append("P09 shadow_veil failed to activate")
	await get_tree().process_frame
	if str(gael.call("support_state")) != "shadow_veil":
		failures.append("P09 shadow_veil state missing")
	if not bool(gael.call("is_veiled")) or not bool(gael.call("precision_ready")):
		failures.append("P09 veil did not enable evasion/precision contract")
	var landed: bool = bool(gael.call("receive_support_hit", 20.0, Vector2(24, 0)))
	if landed:
		failures.append("P09 veiled hit should resolve as DODGE/MISS")
	if float(gael.call("support_health")) != hp_before:
		failures.append("P09 shadow veil dodge still reduced health")
	if not bool(gael.call("last_dodge")) or int(gael.call("dodge_count")) != 1:
		failures.append("P09 dodge feedback/count contract failed")
	await get_tree().create_timer(0.42).timeout

func _validate_kahezer_dash(gael: CharacterBody2D, enemy: Node2D) -> void:
	gael.global_position = Vector2.ZERO
	enemy.global_position = Vector2(220, 0)
	if bool(gael.call("trigger_kahezer_dash", enemy)):
		failures.append("P09 Kahezer dash must reject targets outside authored range")
	if gael.global_position.distance_to(Vector2.ZERO) > 0.1:
		failures.append("P09 rejected dash changed position")
	enemy.global_position = Vector2(80, 0)
	if not bool(gael.call("trigger_kahezer_dash", enemy)):
		failures.append("P09 Kahezer dash failed on valid target")
	await get_tree().process_frame
	if str(gael.call("support_state")) != "kahezer_dash":
		failures.append("P09 kahezer_dash state missing")
	if gael.global_position.x <= enemy.global_position.x:
		failures.append("P09 Kahezer dash did not place Gael behind target")
	if absf(gael.global_position.distance_to(enemy.global_position) - 24.0) > 1.0:
		failures.append("P09 Kahezer dash behind-distance contract mismatch")
	if not bool(gael.call("precision_ready")):
		failures.append("P09 Kahezer dash must prime precision")
	await get_tree().create_timer(0.28).timeout

func _validate_gale_precision(gael: CharacterBody2D, enemy: Node2D, side_enemy: Node2D) -> void:
	_reset_dummy(enemy)
	_reset_dummy(side_enemy)
	enemy.global_position = gael.global_position + Vector2(-42, 0)
	side_enemy.global_position = gael.global_position + Vector2(0, 55)
	if not bool(gael.call("trigger_gale_blade", [enemy, side_enemy])):
		failures.append("P09 gale_blade failed to activate")
	await get_tree().process_frame
	if str(gael.call("support_state")) != "gale_blade":
		failures.append("P09 gale_blade state missing")
	if float(enemy.get("last_damage")) < 13.5:
		failures.append("P09 primed Gale Blade did not consume critical precision")
	if float(side_enemy.get("health")) < 100.0:
		failures.append("P09 Gale Blade damaged target outside fan cone")
	if not bool(gael.call("last_attack_critical")) or bool(gael.call("precision_ready")):
		failures.append("P09 critical flag/consumption contract failed")
	await get_tree().create_timer(0.38).timeout

	_reset_dummy(enemy)
	enemy.global_position = gael.global_position + Vector2(-42, 0)
	if not bool(gael.call("trigger_gale_blade", [enemy])):
		failures.append("P09 regular gale_blade failed to activate")
	await get_tree().process_frame
	if absf(float(enemy.get("last_damage")) - 8.0) > 0.1:
		failures.append("P09 unprimed Gale Blade damage mismatch")
	if bool(gael.call("last_attack_critical")):
		failures.append("P09 unprimed Gale Blade incorrectly marked critical")
	await get_tree().create_timer(0.38).timeout

func _validate_damage_recovery(gael: CharacterBody2D) -> void:
	if bool(gael.call("is_veiled")):
		await get_tree().create_timer(float(gael.call("veil_remaining")) + 0.08).timeout
	var hp_before: float = float(gael.call("support_health"))
	var landed: bool = bool(gael.call("receive_support_hit", 12.0, gael.global_position + Vector2.RIGHT * 20.0))
	await get_tree().process_frame
	if not landed or float(gael.call("support_health")) >= hp_before:
		failures.append("P09 normal hit did not reduce health after veil ended")
	if str(gael.call("support_state")) != "hurt":
		failures.append("P09 hurt state missing")
	await get_tree().create_timer(0.22).timeout
	gael.call("receive_support_hit", 999.0)
	await get_tree().process_frame
	if str(gael.call("support_state")) != "downed":
		failures.append("P09 downed state missing")
	await get_tree().create_timer(3.12).timeout
	if str(gael.call("support_state")) == "downed":
		failures.append("P09 did not recover from temporary downed state")
	if float(gael.call("support_health")) <= 0.0:
		failures.append("P09 recovered with invalid health")
