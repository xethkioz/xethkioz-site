extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const APPROVED_ATLAS_PATH := "res://assets/production/characters/p03_approved/alexis_runtime_atlas.png"

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	for _frame in range(4):
		await get_tree().process_frame

	var player := runtime.get_node_or_null("Player") as Node2D
	var alexis := runtime.get_node_or_null("Alexis") as Node2D
	if player == null:
		failures.append("M01 missing Viajero Player")
	if alexis == null:
		failures.append("M01 missing Alexis")
	else:
		await _validate_alexis(alexis, player)

	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	GameState.reset_new_game()
	SaveService.delete_save()
	_finish()

func _validate_alexis(alexis: Node2D, player: Node2D) -> void:
	if alexis.is_in_group("player"):
		failures.append("Alexis must never replace the Viajero as the player character")
	if alexis.get_script() == null or not str(alexis.get_script().resource_path).ends_with("alexis_guide_runtime.gd"):
		failures.append("Alexis is not using the specialized P03 runtime")

	var legacy := alexis.get_node_or_null("NpcVisual") as Sprite2D
	if legacy == null:
		failures.append("Alexis compatibility NpcVisual missing")
	elif legacy.visible:
		failures.append("generic Alexis atlas sprite must be hidden")

	var approved := alexis.get_node_or_null("AlexisApprovedVisual") as Node2D
	if approved == null:
		failures.append("AlexisApprovedVisual missing")
		return
	var sprite := approved.get_node_or_null("ApprovedSprite") as Sprite2D
	if sprite == null or sprite.texture == null:
		failures.append("P03 approved sprite/texture missing")
		return
	if str(sprite.texture.resource_path) != APPROVED_ATLAS_PATH:
		failures.append("P03 runtime is not using approved Alexis atlas")
	if sprite.texture.get_width() != 936 or sprite.texture.get_height() != 96:
		failures.append("P03 approved atlas must be 936x96")
	if not sprite.region_enabled or sprite.region_rect.size != Vector2(104, 96):
		failures.append("P03 approved frame contract must be 104x96")
	if sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("P03 approved sprite must use nearest filtering")

	if bool(alexis.call("is_field_support_enabled")):
		failures.append("Alexis temporary field support must be disabled by default")
	if player != null and alexis == player:
		failures.append("Alexis and Player resolved to the same actor")

	await _check_action(alexis, approved, "trigger_frost_strike", "frost_strike", 0.68)
	await _check_action(alexis, approved, "trigger_shadow_step", "shadow_step", 0.48)
	await _check_action(alexis, approved, "trigger_trap_place", "trap_place", 0.78)
	await _check_action(alexis, approved, "trigger_mentor_buff", "mentor_buff", 0.88)

	if player != null:
		var origin := alexis.global_position
		player.global_position = origin + Vector2(-320, 80)
		alexis.call("set_field_support_enabled", true, player)
		await get_tree().create_timer(0.24).timeout
		var moved := alexis.global_position.distance_to(origin)
		if moved <= 1.0:
			failures.append("P03 support mode did not produce heavy follow movement")
		if moved >= 80.0:
			failures.append("P03 support mode teleported instead of accelerating")
		if str(approved.call("state_name")) != "walk_heavy":
			failures.append("P03 support movement did not enter walk_heavy state")
		alexis.call("set_field_support_enabled", false, player)

	alexis.call("receive_support_hit", 20.0, alexis.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if str(approved.call("state_name")) != "hurt":
		failures.append("P03 Alexis did not enter hurt visual state")
	if float(alexis.call("support_health")) >= float(alexis.call("support_max_health")):
		failures.append("P03 support health did not decrease after hit")

func _check_action(alexis: Node2D, approved: Node2D, method_name: String, expected_state: String, wait_time: float) -> void:
	var activated := bool(alexis.call(method_name))
	if not activated:
		failures.append("P03 action failed to start: %s" % expected_state)
		return
	await get_tree().process_frame
	if str(alexis.call("support_state")) != expected_state:
		failures.append("P03 runtime state did not become %s" % expected_state)
	if str(approved.call("state_name")) != expected_state:
		failures.append("P03 visual state did not become %s" % expected_state)
	await get_tree().create_timer(wait_time).timeout

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_P03_ALEXIS_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P03_ALEXIS_RUNTIME_FAIL")
	get_tree().quit(1)
