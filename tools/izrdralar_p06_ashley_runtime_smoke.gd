extends Node

const ASHLEY_SCENE := preload("res://scenes/characters/P06AshleyRuntime.tscn")
const DummyScript := preload("res://tools/ashley_rhythm_dummy.gd")

var failures: Array[String] = []
var _beat_count := 0

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var ashley := ASHLEY_SCENE.instantiate() as CharacterBody2D
	add_child(ashley)
	var ally := _make_dummy("Ally")
	var enemy_near := _make_dummy("EnemyNear")
	var enemy_far := _make_dummy("EnemyFar")
	await get_tree().process_frame

	ashley.beat_pulse.connect(_on_beat)
	_validate_identity(ashley)
	await _validate_rhythm(ashley)
	await _validate_movement(ashley, ally)
	await _validate_actions(ashley, ally, enemy_near, enemy_far)
	await _validate_damage_recovery(ashley)

	if failures.is_empty():
		print("IZRDRALAR_P06_ASHLEY_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P06_ASHLEY_RUNTIME_FAIL")
	get_tree().quit(1)

func _make_dummy(name_value: String) -> Node2D:
	var dummy := Node2D.new()
	dummy.name = name_value
	dummy.set_script(DummyScript)
	add_child(dummy)
	return dummy

func _on_beat(_index: int) -> void:
	_beat_count += 1

func _validate_identity(ashley: CharacterBody2D) -> void:
	if ashley == null:
		failures.append("P06 Ashley scene failed to instantiate")
		return
	if int(ashley.call("character_age")) != 15:
		failures.append("P06 Ashley age contract mismatch")
	if str(ashley.call("support_role")) != "Mentora de Ritmo y Cadencia":
		failures.append("P06 role contract mismatch")
	if str(ashley.call("element_affinity")) != "Luz Lunar / Resonancia Rítmica":
		failures.append("P06 affinity contract mismatch")
	if str(ashley.call("bond_name")) != "Killaruna":
		failures.append("P06 bond must remain Killaruna")
	if str(ashley.call("support_state")) != "idle_rhythmic":
		failures.append("P06 must start idle_rhythmic")
	if absf(float(ashley.call("bpm")) - 96.0) > 0.001:
		failures.append("P06 BPM implementation value mismatch")
	var visual := ashley.get_node_or_null("AshleyRuntimeVisual") as Node2D
	if visual == null:
		failures.append("P06 runtime visual missing")
	elif str(visual.call("visual_contract_name")) != "P06_ASHLEY_PROTOTYPE_RENDERER_NOT_FINAL_ART":
		failures.append("P06 renderer must remain explicitly provisional")

func _validate_rhythm(ashley: CharacterBody2D) -> void:
	await get_tree().create_timer(float(ashley.call("beat_interval")) + 0.08).timeout
	if _beat_count <= 0:
		failures.append("P06 RhythmSystem did not emit beat pulse")
	var multiplier := float(ashley.call("rhythm_attack_multiplier"))
	if multiplier < 1.0:
		failures.append("P06 rhythm attack multiplier below neutral")

func _validate_movement(ashley: CharacterBody2D, ally: Node2D) -> void:
	ashley.global_position = Vector2.ZERO
	ally.global_position = Vector2(180, 0)
	ashley.call("set_support_enabled", true, ally)
	var origin := ashley.global_position
	await get_tree().create_timer(0.28).timeout
	var moved := ashley.global_position.distance_to(origin)
	if moved <= 1.0:
		failures.append("P06 walk_graceful support movement did not move")
	if moved >= 75.0:
		failures.append("P06 support movement teleported instead of accelerating")
	if str(ashley.call("support_state")) != "walk_graceful":
		failures.append("P06 movement did not enter walk_graceful")
	ashley.call("set_support_enabled", false, ally)
	ashley.global_position = Vector2.ZERO
	ally.global_position = Vector2(48, 0)
	await get_tree().process_frame

func _validate_actions(ashley: CharacterBody2D, ally: Node2D, enemy_near: Node2D, enemy_far: Node2D) -> void:
	ashley.call("set_support_target", ally)
	enemy_near.global_position = ashley.global_position + Vector2(72, 0)
	enemy_far.global_position = ashley.global_position + Vector2(240, 0)
	enemy_near.set("health", 100.0)
	if not bool(ashley.call("trigger_lunar_crescent", enemy_near)):
		failures.append("P06 lunar_crescent failed to activate")
	await get_tree().process_frame
	if str(ashley.call("support_state")) != "lunar_crescent":
		failures.append("P06 lunar_crescent state missing")
	if float(enemy_near.get("health")) >= 100.0:
		failures.append("P06 lunar_crescent did not damage valid target")
	await get_tree().create_timer(0.60).timeout

	if not bool(ashley.call("trigger_rhythm_cadence")):
		failures.append("P06 rhythm_cadence failed to activate")
	await get_tree().process_frame
	if str(ashley.call("support_state")) != "rhythm_cadence":
		failures.append("P06 rhythm_cadence state missing")
	if float(ashley.call("cadence_remaining")) <= 0.0:
		failures.append("P06 cadence timer missing")
	if float(ally.get("rhythm_buff_left")) <= 0.0 or float(ally.get("rhythm_multiplier")) <= 1.0:
		failures.append("P06 cadence did not buff compatible ally")
	await get_tree().create_timer(0.74).timeout

	enemy_near.set("health", 100.0)
	enemy_near.set("stun_left", 0.0)
	enemy_far.set("health", 100.0)
	enemy_far.set("stun_left", 0.0)
	enemy_near.global_position = ashley.global_position + Vector2(40, 0)
	enemy_far.global_position = ashley.global_position + Vector2(160, 0)
	if not bool(ashley.call("trigger_moon_phase_burst", [enemy_near, enemy_far])):
		failures.append("P06 moon_phase_burst failed to activate")
	await get_tree().process_frame
	if str(ashley.call("support_state")) != "moon_phase_burst":
		failures.append("P06 moon_phase_burst state missing")
	if float(enemy_near.get("health")) >= 100.0 or float(enemy_near.get("stun_left")) <= 0.0:
		failures.append("P06 moon_phase_burst did not affect near target")
	if float(enemy_far.get("health")) < 100.0 or float(enemy_far.get("stun_left")) > 0.0:
		failures.append("P06 moon_phase_burst affected target outside radius")
	await get_tree().create_timer(0.84).timeout

func _validate_damage_recovery(ashley: CharacterBody2D) -> void:
	var before := float(ashley.call("support_health"))
	ashley.call("receive_support_hit", 20.0, ashley.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if float(ashley.call("support_health")) >= before:
		failures.append("P06 hurt did not reduce health")
	if str(ashley.call("support_state")) != "hurt":
		failures.append("P06 hurt state missing")
	await get_tree().create_timer(0.22).timeout
	ashley.call("receive_support_hit", 999.0)
	await get_tree().process_frame
	if str(ashley.call("support_state")) != "downed":
		failures.append("P06 downed state missing")
	await get_tree().create_timer(3.72).timeout
	if str(ashley.call("support_state")) == "downed":
		failures.append("P06 did not recover from temporary downed state")
	if float(ashley.call("support_health")) <= 0.0:
		failures.append("P06 recovered with invalid health")
