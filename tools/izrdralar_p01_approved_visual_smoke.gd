extends Node

const PlayerScript := preload("res://src/player/player_controller_production_pass02.gd")
const APPROVED_ATLAS_PATH := "res://assets/production/characters/p01_approved/viajero_runtime_atlas.png"

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	GameState.reset_new_game()
	var player := CharacterBody2D.new()
	player.name = "P01ApprovedVisualPlayer"
	player.set_script(PlayerScript)
	add_child(player)
	await get_tree().process_frame
	player.set_physics_process(false)

	var legacy := player.get_node_or_null("ViajeroVisual") as Sprite2D
	if legacy == null:
		failures.append("legacy compatibility sprite missing")
	elif legacy.visible:
		failures.append("legacy 32x32 sprite must stay hidden when approved P01 visual is active")

	var approved := player.get_node_or_null("ViajeroApprovedVisual") as Node2D
	if approved == null:
		failures.append("ViajeroApprovedVisual missing from production player")
	else:
		_validate_approved_visual(approved)

	player.queue_free()
	await get_tree().process_frame
	_finish()

func _validate_approved_visual(approved: Node2D) -> void:
	var sprite := approved.get_node_or_null("ApprovedSprite") as Sprite2D
	if sprite == null:
		failures.append("approved P01 renderer missing ApprovedSprite")
		return
	if sprite.texture == null:
		failures.append("approved P01 sprite has no texture")
	else:
		if str(sprite.texture.resource_path) != APPROVED_ATLAS_PATH:
			failures.append("approved P01 renderer is not using the approved runtime atlas")
		if sprite.texture.get_width() != 392 or sprite.texture.get_height() != 72:
			failures.append("approved P01 atlas dimensions must be 392x72")
	if not sprite.region_enabled:
		failures.append("approved P01 sprite must use atlas regions")
	if sprite.region_rect.size != Vector2(56, 72):
		failures.append("approved P01 frame contract must be 56x72")
	if sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("approved P01 sprite must use nearest filtering")

	approved.call("update_from_player", 0.016, Vector2.DOWN, Vector2.ZERO, 118.0, 0.0, 0.0, 0.18, 0.0, 0.24, 0.0)
	_check_state_and_frame(approved, sprite, "idle", 0)
	approved.call("update_from_player", 0.016, Vector2.RIGHT, Vector2(90, 0), 118.0, 0.0, 0.0, 0.18, 0.0, 0.24, 0.0)
	_check_state_and_frame(approved, sprite, "move", 2)
	approved.call("update_from_player", 0.016, Vector2.RIGHT, Vector2(290, 0), 118.0, 0.10, 0.0, 0.18, 0.0, 0.24, 0.0)
	_check_state_and_frame(approved, sprite, "dash", 4)
	approved.call("update_from_player", 0.016, Vector2.RIGHT, Vector2.ZERO, 118.0, 0.0, 0.12, 0.18, 0.0, 0.24, 0.0)
	_check_state_and_frame(approved, sprite, "attack", 5)
	approved.call("update_from_player", 0.016, Vector2.DOWN, Vector2.ZERO, 118.0, 0.0, 0.0, 0.18, 0.14, 0.24, 0.0)
	_check_state_and_frame(approved, sprite, "burst", 6)
	approved.call("update_from_player", 0.016, Vector2.LEFT, Vector2.ZERO, 118.0, 0.0, 0.0, 0.18, 0.0, 0.24, 0.10)
	if str(approved.call("state_name")) != "hurt":
		failures.append("approved P01 renderer did not enter hurt state")
	approved.call("set_consumable_pose", 0.8)
	# Hurt has higher priority; clear it and verify consumable commitment separately.
	approved.call("update_from_player", 0.016, Vector2.LEFT, Vector2.ZERO, 118.0, 0.0, 0.0, 0.18, 0.0, 0.24, 0.0)
	approved.call("set_consumable_pose", 0.8)
	if str(approved.call("state_name")) != "consume":
		failures.append("approved P01 renderer did not enter consume state")

func _check_state_and_frame(approved: Node2D, sprite: Sprite2D, expected_state: String, expected_frame: int) -> void:
	if str(approved.call("state_name")) != expected_state:
		failures.append("P01 state %s was not reached" % expected_state)
	var expected_x := float(expected_frame * 56)
	if absf(sprite.region_rect.position.x - expected_x) > 0.01:
		failures.append("P01 state %s used atlas x %.1f instead of %.1f" % [expected_state, sprite.region_rect.position.x, expected_x])

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_P01_APPROVED_VISUAL_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P01_APPROVED_VISUAL_FAIL")
	get_tree().quit(1)
