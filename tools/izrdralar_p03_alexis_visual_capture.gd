extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const OUTPUT_DIR := "/tmp/izrdralar-p03-alexis-captures"
const CAPTURE_SIZE := Vector2i(640, 360)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	DirAccess.make_dir_recursive_absolute(OUTPUT_DIR)
	await _capture_idle_context()
	await _capture_walk_heavy()
	await _capture_action("trigger_frost_strike", "frost_strike", "P03_Alexis_frost_strike")
	await _capture_action("trigger_shadow_step", "shadow_step", "P03_Alexis_shadow_step")
	await _capture_action("trigger_trap_place", "trap_place", "P03_Alexis_trap_place")
	await _capture_action("trigger_mentor_buff", "mentor_buff", "P03_Alexis_mentor_buff")
	SaveService.delete_save()
	if failures.is_empty():
		print("IZRDRALAR_P03_ALEXIS_VISUAL_CAPTURE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_P03_ALEXIS_VISUAL_CAPTURE_FAIL")
	get_tree().quit(1)

func _spawn_runtime() -> Node:
	GameState.reset_new_game()
	GameState.set_world_flag("m01_controls_onboarding_complete")
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	for _frame in range(3):
		await get_tree().process_frame
	return runtime

func _prepare_context(runtime: Node) -> Dictionary:
	var player := runtime.get_node_or_null("Player") as Node2D
	var alexis := runtime.get_node_or_null("Alexis") as Node2D
	if player == null or alexis == null:
		failures.append("P03 capture missing Player/Alexis")
		return {}
	for enemy_value in get_tree().get_nodes_in_group("enemies"):
		if enemy_value is Node and runtime.is_ancestor_of(enemy_value):
			(enemy_value as Node).set_physics_process(false)
	player.global_position = alexis.global_position + Vector2(-120, 24)
	player.set("facing", Vector2.RIGHT)
	var camera := player.get_node_or_null("WorldCamera") as Camera2D
	if camera != null:
		camera.position_smoothing_enabled = false
		camera.reset_smoothing()
	var xethkioz := runtime.get_node_or_null("Xethkioz") as Node2D
	if xethkioz != null:
		xethkioz.global_position = player.global_position + Vector2(-34, 18)
	return {"player":player, "alexis":alexis}

func _capture_idle_context() -> void:
	var runtime := await _spawn_runtime()
	var context := _prepare_context(runtime)
	if context.is_empty():
		await _dispose_runtime(runtime)
		return
	var alexis := context["alexis"] as Node2D
	if str(alexis.call("support_state")) != "idle":
		failures.append("P03 idle capture did not start from idle")
	await get_tree().process_frame
	await _save_viewport("P03_Alexis_idle_with_Viajero_Xethkioz")
	await _dispose_runtime(runtime)

func _capture_walk_heavy() -> void:
	var runtime := await _spawn_runtime()
	var context := _prepare_context(runtime)
	if context.is_empty():
		await _dispose_runtime(runtime)
		return
	var player := context["player"] as Node2D
	var alexis := context["alexis"] as Node2D
	player.global_position = alexis.global_position + Vector2(-170, 28)
	alexis.call("set_field_support_enabled", true, player)
	await get_tree().create_timer(0.20).timeout
	if str(alexis.call("support_state")) != "walk_heavy":
		failures.append("P03 walk capture did not reach walk_heavy")
	await _save_viewport("P03_Alexis_walk_heavy")
	alexis.call("set_field_support_enabled", false, player)
	await _dispose_runtime(runtime)

func _capture_action(method_name: String, expected_state: String, capture_name: String) -> void:
	var runtime := await _spawn_runtime()
	var context := _prepare_context(runtime)
	if context.is_empty():
		await _dispose_runtime(runtime)
		return
	var alexis := context["alexis"] as Node2D
	var activated := bool(alexis.call(method_name))
	if not activated:
		failures.append("P03 capture action failed to activate: %s" % expected_state)
		await _dispose_runtime(runtime)
		return
	await get_tree().process_frame
	if str(alexis.call("support_state")) != expected_state:
		failures.append("P03 capture state mismatch: %s" % expected_state)
	await _save_viewport(capture_name)
	await _dispose_runtime(runtime)

func _save_viewport(name_value: String) -> void:
	await RenderingServer.frame_post_draw
	var image := get_viewport().get_texture().get_image()
	if image == null or image.is_empty():
		failures.append("%s produced empty viewport image" % name_value)
		return
	var source_size := Vector2i(image.get_width(), image.get_height())
	if source_size == CAPTURE_SIZE * 2:
		image.resize(CAPTURE_SIZE.x, CAPTURE_SIZE.y, Image.INTERPOLATE_NEAREST)
	elif source_size != CAPTURE_SIZE:
		failures.append("%s unexpected framebuffer size %dx%d" % [name_value, source_size.x, source_size.y])
		return
	var path := "%s/%s.png" % [OUTPUT_DIR, name_value]
	var save_error := image.save_png(path)
	if save_error != OK:
		failures.append("%s could not save PNG: %s" % [name_value, save_error])
	else:
		print("IZRDRALAR_P03_CAPTURE %s" % path)

func _dispose_runtime(runtime: Node) -> void:
	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	for child in get_children():
		if child is Node2D and child != runtime:
			var child_name := str(child.name)
			if child_name.begins_with("WorldFeedbackFx"):
				child.queue_free()
	await get_tree().process_frame
