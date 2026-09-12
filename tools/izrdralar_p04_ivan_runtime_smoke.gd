extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M02", "from_m01", Vector2.ZERO)
	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	for _frame in range(5):
		await get_tree().process_frame

	var player := runtime.get_node_or_null("Player") as Node2D
	var ivan := runtime.get_node_or_null("Iván") as Node2D
	if player == null:
		failures.append("M02 missing Viajero Player")
	if ivan == null:
		failures.append("M02 missing Iván")
	else:
		await _validate_ivan(ivan, player)

	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	GameState.reset_new_game()
	SaveService.delete_save()
	_finish()

func _validate_ivan(ivan: Node2D, player: Node2D) -> void:
	if ivan.is_in_group("player"):
		failures.append("Iván must never replace the Viajero")
	if not ivan.is_in_group("ivan_scientist"):
		failures.append("Iván scientist runtime group missing")
	if ivan.get_script() == null or not str(ivan.get_script().resource_path).ends_with("ivan_scientist_runtime.gd"):
		failures.append("Iván is not using the specialized P04 runtime")

	var legacy := ivan.get_node_or_null("NpcVisual") as Sprite2D
	if legacy == null:
		failures.append("Iván compatibility NpcVisual missing")
	elif legacy.visible:
		failures.append("generic Iván atlas sprite must be hidden")

	var visual := ivan.get_node_or_null("IvanRuntimeVisual") as Node2D
	if visual == null:
		failures.append("IvanRuntimeVisual missing")
		return
	if str(visual.call("visual_contract_id")) != "P04_IVAN_QUANTUM_SCIENTIST_V1":
		failures.append("P04 visual contract id mismatch")
	if str(visual.call("state_name")) != "idle_calculating":
		failures.append("P04 default visual state must be idle_calculating")

	var profile: Dictionary = ivan.call("analysis_profile")
	if str(profile.get("resonant", "")) != "itzuke":
		failures.append("P04 canon link must be Itzuke")
	if bool(profile.get("player_fast_travel_granted", true)):
		failures.append("Iván quantum reposition must not grant player fast travel")
	if bool(profile.get("direct_player_input", true)):
		failures.append("Iván support runtime must not read direct player input")
	if bool(ivan.call("is_field_support_enabled")):
		failures.append("Iván temporary field support must be disabled by default")

	await _check_action(ivan, visual, "trigger_analyze_device", "analyze_device", 0.78)
	await _check_action(ivan, visual, "trigger_lightning_strike", "lightning_strike", 0.64)
	await _check_action(ivan, visual, "trigger_emp_field", "emp_field", 0.84)
	await _check_action(ivan, visual, "trigger_overclock_buff", "overclock_buff", 0.88)

	if player != null:
		var player_origin := player.global_position
		var ivan_origin := ivan.global_position
		var quantum_ok := bool(ivan.call("trigger_quantum_reposition", Vector2.RIGHT, 36.0))
		if not quantum_ok:
			failures.append("P04 quantum reposition failed to start")
		await get_tree().process_frame
		var quantum_distance := ivan.global_position.distance_to(ivan_origin)
		if quantum_distance < 6.0 or quantum_distance > 48.1:
			failures.append("P04 quantum reposition must remain a short Iván-only move")
		if player.global_position.distance_to(player_origin) > 0.01:
			failures.append("P04 quantum reposition moved the Viajero")
		if str(visual.call("state_name")) != "quantum_teleport":
			failures.append("P04 quantum reposition did not enter quantum_teleport state")
		await get_tree().create_timer(0.46).timeout

		var follow_origin := ivan.global_position
		player.global_position = follow_origin + Vector2(-330, 80)
		ivan.call("set_field_support_enabled", true, player)
		await get_tree().create_timer(0.24).timeout
		var moved := ivan.global_position.distance_to(follow_origin)
		if moved <= 1.0:
			failures.append("P04 support mode did not produce follow movement")
		if moved >= 80.0:
			failures.append("P04 support mode teleported instead of accelerating")
		if str(visual.call("state_name")) != "walk_fast":
			failures.append("P04 support movement did not enter walk_fast")
		ivan.call("set_field_support_enabled", false, player)

	ivan.call("receive_support_hit", 20.0, ivan.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if str(visual.call("state_name")) != "hurt":
		failures.append("P04 Iván did not enter hurt visual state")
	if float(ivan.call("support_health")) >= float(ivan.call("support_max_health")):
		failures.append("P04 support health did not decrease after hit")

func _check_action(ivan: Node2D, visual: Node2D, method_name: String, expected_state: String, wait_time: float) -> void:
	var activated := bool(ivan.call(method_name))
	if not activated:
		failures.append("P04 action failed to start: %s" % expected_state)
		return
	await get_tree().process_frame
	if str(ivan.call("support_state")) != expected_state:
		failures.append("P04 runtime state did not become %s" % expected_state)
	if str(visual.call("state_name")) != expected_state:
		failures.append("P04 visual state did not become %s" % expected_state)
	await get_tree().create_timer(wait_time).timeout

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_P04_IVAN_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P04_IVAN_RUNTIME_FAIL")
	get_tree().quit(1)
