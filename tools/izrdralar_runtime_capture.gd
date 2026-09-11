extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const OUTPUT_DIR := "/tmp/izrdralar-captures"
const CAPTURE_SIZE := Vector2i(640, 360)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	DirAccess.make_dir_recursive_absolute(OUTPUT_DIR)
	var cases := [
		{"name":"M01_cuenca_despertar","map":"M01","entry":"start","position":Vector2(690,520),"flags":[]},
		{"name":"M02_aldea_alba","map":"M02","entry":"from_m01","position":Vector2(520,500),"flags":["opening_flow_complete"]},
		{"name":"M03_lago_encantado","map":"M03","entry":"from_m02","position":Vector2(690,370),"flags":["opening_flow_complete","prisma_atlas_unlocked"]},
		{"name":"M04A_ruinas_vivas","map":"M04","entry":"from_m02","position":Vector2(310,330),"flags":["opening_flow_complete","prisma_atlas_unlocked"]},
		{"name":"M04B_santuario_raices","map":"M04","entry":"from_m02","position":Vector2(760,760),"flags":["opening_flow_complete","prisma_atlas_unlocked"]},
		{"name":"M05_corazon_bosque_velado","map":"M05","entry":"from_m03","position":Vector2(256,300),"flags":["opening_flow_complete","prisma_atlas_unlocked","lake_resolved","ruins_sanctuary_resolved"]}
	]

	for capture_case in cases:
		await _capture_case(capture_case)

	SaveService.delete_save()
	if failures.is_empty():
		print("IZRDRALAR_RUNTIME_CAPTURE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_RUNTIME_CAPTURE_FAIL")
	get_tree().quit(1)

func _capture_case(capture_case: Dictionary) -> void:
	GameState.reset_new_game()
	for flag_value in capture_case.get("flags", []):
		GameState.set_world_flag(str(flag_value))
	GameState.set_world_checkpoint(str(capture_case["map"]), str(capture_case["entry"]), Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame

	var player := runtime.get_node_or_null("Player") as Node2D
	if player == null:
		failures.append("%s missing Player" % capture_case["name"])
		runtime.queue_free()
		await get_tree().process_frame
		return

	player.global_position = capture_case["position"]
	GameState.set_world_checkpoint(str(capture_case["map"]), str(capture_case["entry"]), player.global_position)
	var camera := player.get_node_or_null("WorldCamera") as Camera2D
	if camera != null:
		camera.position_smoothing_enabled = false
		camera.reset_smoothing()

	for _frame in range(3):
		await get_tree().process_frame
	await RenderingServer.frame_post_draw

	var image := get_viewport().get_texture().get_image()
	if image == null or image.is_empty():
		failures.append("%s produced an empty viewport image" % capture_case["name"])
	else:
		var source_size := Vector2i(image.get_width(), image.get_height())
		if source_size == CAPTURE_SIZE * 2:
			image.resize(CAPTURE_SIZE.x, CAPTURE_SIZE.y, Image.INTERPOLATE_NEAREST)
		elif source_size != CAPTURE_SIZE:
			failures.append("%s unexpected framebuffer size %dx%d" % [capture_case["name"], source_size.x, source_size.y])
		if image.get_width() == CAPTURE_SIZE.x and image.get_height() == CAPTURE_SIZE.y:
			var output_path := "%s/%s.png" % [OUTPUT_DIR, capture_case["name"]]
			var save_error := image.save_png(output_path)
			if save_error != OK:
				failures.append("%s could not save PNG: %s" % [capture_case["name"], save_error])
			else:
				print("IZRDRALAR_CAPTURE %s source=%dx%d logical=640x360" % [output_path, source_size.x, source_size.y])

	runtime.queue_free()
	await get_tree().process_frame
