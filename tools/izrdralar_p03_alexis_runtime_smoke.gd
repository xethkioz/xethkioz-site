extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const APPROVED_FRAME_PATHS: Array[String] = [
	"res://assets/production/characters/p03_approved/frames/idle_down.png",
	"res://assets/production/characters/p03_approved/frames/idle_up.png",
	"res://assets/production/characters/p03_approved/frames/idle_left.png",
	"res://assets/production/characters/p03_approved/frames/idle_right.png",
	"res://assets/production/characters/p03_approved/frames/walk_heavy.png",
	"res://assets/production/characters/p03_approved/frames/frost_strike.png",
	"res://assets/production/characters/p03_approved/frames/shadow_step.png",
	"res://assets/production/characters/p03_approved/frames/trap_place.png",
	"res://assets/production/characters/p03_approved/frames/mentor_buff.png"
]
const FRAME_SIZE := Vector2(52, 48)
const RUNTIME_SCALE := 2.0

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	_validate_frame_assets()
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

func _validate_frame_assets() -> void:
	for path in APPROVED_FRAME_PATHS:
		if not ResourceLoader.exists(path):
			failures.append("P03 approved frame missing: %s" % path)
			continue
		var texture := load(path) as Texture2D
		if texture == null:
			failures.append("P03 approved frame failed to load: %s" % path)
			continue
		if texture.get_width() != int(FRAME_SIZE.x) or texture.get_height() != int(FRAME_SIZE.y):
			failures.append("P03 frame must be 52x48: %s" % path)

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
	var current_path := str(sprite.texture.resource_path)
	if current_path not in APPROVED_FRAME_PATHS:
		failures.append("P03 runtime is not using an approved Alexis frame")
	if sprite.texture.get_width() != 52 or sprite.texture.get_height() != 48:
		failures.append("P03 runtime frame must be 52x48")
	if sprite.region_enabled:
		failures.append("P03 independent frame renderer must not use atlas regions")
	if sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("P03 approved sprite must use nearest filtering")
	if absf(float(approved.call("runtime_scale")) - RUNTIME_SCALE) > 0.001:
		failures.append("P03 runtime scale must be 2x")
	var reported_paths: Array = approved.call("approved_texture_paths")
	if reported_paths.size() != APPROVED_FRAME_PATHS.size():
		failures.append("P03 approved frame registry must expose nine states")
	else:
		for path in APPROVED_FRAME_PATHS:
			if path not in reported_paths:
				failures.append("P03 frame registry missing: %s" % path)

	if bool(alexis.call("is_field_support_enabled")):
		failures.append("Alexis temporary field support must be disabled by default")
	if player != null and alexis == player:
		failures.append("Alexis and Player resolved to the same actor")

	await _check_action(alexis, approved, "trigger_frost_strike", "frost_strike", APPROVED_FRAME_PATHS[5], 0.68)
	await _check_action(alexis, approved, "trigger_shadow_step", "shadow_step", APPROVED_FRAME_PATHS[6], 0.48)
	await _check_action(alexis, approved, "trigger_trap_place", "trap_place", APPROVED_FRAME_PATHS[7], 0.78)
	await _check_action(alexis, approved, "trigger_mentor_buff", "mentor_buff", APPROVED_FRAME_PATHS[8], 0.88)

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
		var walk_sprite := approved.get_node_or_null("ApprovedSprite") as Sprite2D
		if walk_sprite == null or walk_sprite.texture == null or str(walk_sprite.texture.resource_path) != APPROVED_FRAME_PATHS[4]:
			failures.append("P03 support movement did not use walk_heavy frame")
		alexis.call("set_field_support_enabled", false, player)

	alexis.call("receive_support_hit", 20.0, alexis.global_position + Vector2.RIGHT * 20.0)
	await get_tree().process_frame
	if str(approved.call("state_name")) != "hurt":
		failures.append("P03 Alexis did not enter hurt visual state")
	if float(alexis.call("support_health")) >= float(alexis.call("support_max_health")):
		failures.append("P03 support health did not decrease after hit")

func _check_action(alexis: Node2D, approved: Node2D, method_name: String, expected_state: String, expected_texture: String, wait_time: float) -> void:
	var activated := bool(alexis.call(method_name))
	if not activated:
		failures.append("P03 action failed to start: %s" % expected_state)
		return
	await get_tree().process_frame
	if str(alexis.call("support_state")) != expected_state:
		failures.append("P03 runtime state did not become %s" % expected_state)
	if str(approved.call("state_name")) != expected_state:
		failures.append("P03 visual state did not become %s" % expected_state)
	var sprite := approved.get_node_or_null("ApprovedSprite") as Sprite2D
	if sprite == null or sprite.texture == null or str(sprite.texture.resource_path) != expected_texture:
		failures.append("P03 visual state did not use expected texture for %s" % expected_state)
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
