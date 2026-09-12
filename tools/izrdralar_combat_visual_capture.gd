extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const OUTPUT_DIR := "/tmp/izrdralar-combat-captures"
const CAPTURE_SIZE := Vector2i(640, 360)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	DirAccess.make_dir_recursive_absolute(OUTPUT_DIR)
	await _capture_enemy_telegraph()
	await _capture_melee_hit()
	await _capture_boss_telegraph()
	SaveService.delete_save()
	if failures.is_empty():
		print("IZRDRALAR_COMBAT_VISUAL_CAPTURE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_COMBAT_VISUAL_CAPTURE_FAIL")
	get_tree().quit(1)

func _spawn_runtime(map_id: String, entry_id: String, flags: Array) -> Node:
	GameState.reset_new_game()
	for flag_value in flags:
		GameState.set_world_flag(str(flag_value))
	GameState.set_world_checkpoint(map_id, entry_id, Vector2.ZERO)
	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame
	return runtime

func _prepare_camera(player: Node2D) -> void:
	var camera := player.get_node_or_null("WorldCamera") as Camera2D
	if camera != null:
		camera.position_smoothing_enabled = false
		camera.reset_smoothing()

func _capture_enemy_telegraph() -> void:
	var runtime := await _spawn_runtime("M01", "start", [])
	var player := runtime.get_node_or_null("Player") as Node2D
	var enemies := get_tree().get_nodes_in_group("enemies")
	if player == null or enemies.is_empty():
		failures.append("enemy telegraph capture missing Player/enemy")
		await _dispose_runtime(runtime)
		return
	var enemy := enemies[0] as Node2D
	player.global_position = enemy.global_position + Vector2(38, 0)
	_prepare_camera(player)
	enemy.set_physics_process(false)
	enemy.call("_begin_attack")
	for _frame in range(3):
		await get_tree().process_frame
	await _save_viewport("M01_enemy_attack_telegraph")
	await _dispose_runtime(runtime)

func _capture_melee_hit() -> void:
	var runtime := await _spawn_runtime("M01", "start", [])
	var player := runtime.get_node_or_null("Player") as Node2D
	var enemies := get_tree().get_nodes_in_group("enemies")
	if player == null or enemies.is_empty():
		failures.append("melee capture missing Player/enemy")
		await _dispose_runtime(runtime)
		return
	var enemy := enemies[0] as Node2D
	enemy.set_physics_process(false)
	player.global_position = enemy.global_position + Vector2(-27, 0)
	player.set("facing", Vector2.RIGHT)
	_prepare_camera(player)
	player.call("_perform_melee_attack")
	await get_tree().process_frame
	await RenderingServer.frame_post_draw
	await _save_viewport("M01_melee_hit_feedback", false)
	await _dispose_runtime(runtime)

func _capture_boss_telegraph() -> void:
	var flags := ["opening_flow_complete", "prisma_atlas_unlocked", "lake_resolved", "ruins_sanctuary_resolved"]
	var runtime := await _spawn_runtime("M05", "from_m03", flags)
	var player := runtime.get_node_or_null("Player") as Node2D
	var bosses := get_tree().get_nodes_in_group("bosses")
	if player == null or bosses.is_empty():
		failures.append("Boss 5 telegraph capture missing Player/boss")
		await _dispose_runtime(runtime)
		return
	var boss := bosses[0] as Node2D
	player.global_position = boss.global_position + Vector2(0, 112)
	_prepare_camera(player)
	boss.set_physics_process(false)
	boss.call("_start_root_pulse")
	boss.queue_redraw()
	for _frame in range(4):
		await get_tree().process_frame
	await _save_viewport("M05_boss5_root_pulse_telegraph")
	await _dispose_runtime(runtime)

func _save_viewport(name_value: String, wait_for_draw: bool = true) -> void:
	if wait_for_draw:
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
		print("IZRDRALAR_COMBAT_CAPTURE %s" % path)

func _dispose_runtime(runtime: Node) -> void:
	runtime.queue_free()
	await get_tree().process_frame
	for child in get_children():
		if child is Node2D and child != runtime:
			var child_name := str(child.name)
			if child_name.begins_with("WorldFeedbackFx"):
				child.queue_free()
	await get_tree().process_frame
