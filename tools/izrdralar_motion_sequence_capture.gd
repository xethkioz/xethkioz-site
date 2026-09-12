extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const OUTPUT_DIR := "/tmp/izrdralar-motion-captures"
const CAPTURE_SIZE := Vector2i(640, 360)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	DirAccess.make_dir_recursive_absolute(OUTPUT_DIR)
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	for _frame in range(3):
		await get_tree().process_frame

	var player := runtime.get_node_or_null("Player") as CharacterBody2D
	var xethkioz := runtime.get_node_or_null("Xethkioz") as Node2D
	if player == null or xethkioz == null:
		failures.append("motion capture missing Player or Xethkioz")
		await _finish(runtime)
		return

	var camera := player.get_node_or_null("WorldCamera") as Camera2D
	if camera != null:
		camera.position_smoothing_enabled = false
		camera.reset_smoothing()

	player.global_position = Vector2(520, 610)
	xethkioz.global_position = player.global_position + Vector2(-34, 22)
	player.velocity = Vector2.ZERO
	player.set("facing", Vector2.RIGHT)

	var enemies := get_tree().get_nodes_in_group("enemies")
	for enemy_value in enemies:
		if enemy_value is Node and runtime.is_ancestor_of(enemy_value):
			enemy_value.set_physics_process(false)

	for _frame in range(3):
		await get_tree().physics_frame
	await _save_viewport("01_idle")

	var start_position := player.global_position
	var pet_start := xethkioz.global_position
	Input.action_press("move_right")
	for _frame in range(3):
		await get_tree().physics_frame
	await _save_viewport("02_accel_right")
	var accel_speed := player.velocity.length()
	if accel_speed <= 0.0 or accel_speed >= float(player.get("move_speed")):
		failures.append("movement sequence did not expose progressive acceleration")

	for _frame in range(8):
		await get_tree().physics_frame
	await _save_viewport("03_stride_right")
	var stride_position := player.global_position
	if stride_position.x <= start_position.x + 8.0:
		failures.append("movement sequence did not advance player to the right")

	Input.action_press("move_up")
	for _frame in range(6):
		await get_tree().physics_frame
	await _save_viewport("04_diagonal_turn")
	var diagonal_position := player.global_position
	if diagonal_position.x <= stride_position.x or diagonal_position.y >= stride_position.y:
		failures.append("diagonal turn did not move on both authored axes")

	var speed_before_brake := player.velocity.length()
	Input.action_release("move_right")
	Input.action_release("move_up")
	for _frame in range(3):
		await get_tree().physics_frame
	await _save_viewport("05_brake")
	if player.velocity.length() >= speed_before_brake:
		failures.append("movement sequence did not visibly decelerate after input release")

	for _frame in range(8):
		await get_tree().physics_frame
	if xethkioz.global_position.distance_to(pet_start) <= 4.0:
		failures.append("Xethkioz did not follow the player during movement sequence")

	var attack_enemy: CharacterBody2D = null
	for enemy_value in enemies:
		if enemy_value is CharacterBody2D and is_instance_valid(enemy_value) and runtime.is_ancestor_of(enemy_value):
			attack_enemy = enemy_value as CharacterBody2D
			break
	if attack_enemy == null:
		failures.append("movement sequence missing combat target")
		await _finish(runtime)
		return

	# Reuse the same geometry as the already validated combat capture. Keeping the
	# enemy at its authored physics position avoids a one-frame broadphase mismatch
	# after teleporting a CharacterBody2D immediately before the shape query.
	player.global_position = attack_enemy.global_position + Vector2(-27, 0)
	xethkioz.global_position = player.global_position + Vector2(-34, 22)
	player.velocity = Vector2.ZERO
	player.set("facing", Vector2.RIGHT)
	if camera != null:
		camera.reset_smoothing()
	for _frame in range(2):
		await get_tree().physics_frame

	var enemy_health_before := float(attack_enemy.get("health"))
	var attack_position_before := player.global_position
	player.call("_perform_melee_attack")
	var attack_position_after := player.global_position
	if attack_position_after.x <= attack_position_before.x:
		failures.append("melee sequence lost collision-aware forward micro-lunge")
	if float(attack_enemy.get("health")) >= enemy_health_before:
		failures.append("melee sequence did not apply real hit damage")
	await get_tree().physics_frame
	await _save_viewport("06_melee_contact")

	for _frame in range(4):
		await get_tree().physics_frame
	await _save_viewport("07_melee_followthrough")
	if float(player.get("_attack_pose_left")) <= 0.0:
		failures.append("melee pose ended before authored follow-through window")

	for _frame in range(10):
		await get_tree().physics_frame
	await _save_viewport("08_melee_recovery")
	if float(player.get("_attack_pose_left")) > 0.0:
		failures.append("melee pose did not return to movement-ready state")

	var player_health_before := float(player.get("health"))
	player.call("take_damage", 7.0)
	await get_tree().physics_frame
	await _save_viewport("09_hurt_reaction")
	if float(player.get("health")) >= player_health_before:
		failures.append("hurt sequence did not reduce player health")
	if float(player.get("_hit_flash_left")) <= 0.0:
		failures.append("hurt sequence missing authored visual reaction window")

	await _finish(runtime)

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
	var output_path := "%s/%s.png" % [OUTPUT_DIR, name_value]
	var save_error := image.save_png(output_path)
	if save_error != OK:
		failures.append("%s could not save PNG: %s" % [name_value, save_error])
	else:
		print("IZRDRALAR_MOTION_CAPTURE %s" % output_path)

func _finish(runtime: Node) -> void:
	Input.action_release("move_left")
	Input.action_release("move_right")
	Input.action_release("move_up")
	Input.action_release("move_down")
	Input.action_release("attack")
	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	for child in get_children():
		if child is Node2D:
			var child_name := str(child.name)
			if child_name.begins_with("WorldFeedbackFx"):
				child.queue_free()
	await get_tree().process_frame
	SaveService.delete_save()
	if failures.is_empty():
		print("IZRDRALAR_MOTION_SEQUENCE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_MOTION_SEQUENCE_FAIL")
	get_tree().quit(1)
