extends Node2D

const BridgeScript := preload("res://src/world/izrdralar_level_up_feedback_bridge.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	GameState.reset_new_game()

	var player := Node2D.new()
	player.name = "LevelUpSmokePlayer"
	player.position = Vector2(120, 90)
	player.add_to_group("player")
	add_child(player)

	var bridge := Node.new()
	bridge.name = "LevelUpFeedbackBridge"
	bridge.set_script(BridgeScript)
	add_child(bridge)
	await get_tree().process_frame

	GameState.add_xp(GameState.xp_to_next())
	await get_tree().process_frame

	var feedback := get_node_or_null("LevelUpFeedback_L2")
	if feedback == null:
		failures.append("level 2 did not spawn in-world feedback")
	else:
		if int(feedback.get("level_value")) != 2:
			failures.append("level-up feedback has wrong level value")
		if feedback.global_position.distance_to(player.global_position + Vector2(0, -10)) > 0.1:
			failures.append("level-up feedback spawned away from player")

	var before_count := _feedback_count()
	GameState.add_xp(1)
	await get_tree().process_frame
	if _feedback_count() != before_count:
		failures.append("non-level XP spawned duplicate level-up feedback")

	GameState.reset_new_game()
	await get_tree().process_frame
	_finish()

func _feedback_count() -> int:
	var count := 0
	for child in get_children():
		if child.name.begins_with("LevelUpFeedback_L"):
			count += 1
	return count

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_LEVEL_UP_FEEDBACK_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_LEVEL_UP_FEEDBACK_FAIL")
	get_tree().quit(1)
