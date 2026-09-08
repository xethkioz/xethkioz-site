extends SceneTree

const VIEWPORT_SIZE := Vector2i(640, 360)
const OUTPUT_DIR := "res://build/previews"
const BOOTSTRAP := "res://scenes/v34/GameBootstrap.tscn"
const GOLDEN_REGION := "res://scenes/v34/GoldenRegion.tscn"
const REFUGIO := "res://scenes/v34/RefugioInterior.tscn"

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	root.size = VIEWPORT_SIZE
	root.content_scale_size = VIEWPORT_SIZE
	var absolute_dir := ProjectSettings.globalize_path(OUTPUT_DIR)
	var err := DirAccess.make_dir_recursive_absolute(absolute_dir)
	if err != OK and err != ERR_ALREADY_EXISTS:
		push_error("Could not create visual preview directory: %s" % error_string(err))
		quit(1)
		return

	CharacterProfile.reset_defaults()
	GameState.reset_new_game()
	await _capture_bootstrap()
	await _capture_golden_region()
	await _capture_refugio()
	print("V3.4 visual capture complete: menu, creator, Cuenca, Lago, Refugio")
	quit(0)

func _capture_bootstrap() -> void:
	var scene := await _mount_scene(BOOTSTRAP)
	await _wait_frames(8)
	await _save_frame("v34_menu.png")
	if scene.has_method("_show_creator"):
		scene.call("_show_creator")
		await _wait_frames(8)
		await _save_frame("v34_creator.png")

func _capture_golden_region() -> void:
	GameState.reset_new_game()
	var scene := await _mount_scene(GOLDEN_REGION)
	await _wait_frames(24)
	var title_overlay := scene.get_node_or_null("AssistHUD/ZoneTitleOverlay")
	if is_instance_valid(title_overlay):
		title_overlay.visible = false
	var player := scene.get_node_or_null("Player") as CharacterBody2D
	if is_instance_valid(player):
		player.global_position = Vector2(768, 1760)
		_reset_player_camera(player)
	await _wait_frames(18)
	await _save_frame("v34_cuenca.png")

	if is_instance_valid(player):
		player.global_position = Vector2(742, 812)
		_reset_player_camera(player)
	await _wait_frames(24)
	await _save_frame("v34_lago.png")

func _capture_refugio() -> void:
	var scene := await _mount_scene(REFUGIO)
	await _wait_frames(24)
	var player := scene.get_node_or_null("Player") as CharacterBody2D
	if is_instance_valid(player):
		player.global_position = Vector2(320, 284)
	await _wait_frames(12)
	await _save_frame("v34_refugio.png")

func _mount_scene(path: String) -> Node:
	if is_instance_valid(current_scene):
		current_scene.queue_free()
		await process_frame
	var packed := load(path) as PackedScene
	if packed == null:
		push_error("Visual capture could not load %s" % path)
		quit(1)
		return root
	var scene := packed.instantiate()
	root.add_child(scene)
	current_scene = scene
	await _wait_frames(4)
	return scene

func _reset_player_camera(player: CharacterBody2D) -> void:
	var camera := player.get_node_or_null("WorldCamera") as Camera2D
	if not is_instance_valid(camera):
		return
	camera.position_smoothing_enabled = false
	camera.reset_smoothing()

func _save_frame(filename: String) -> void:
	await RenderingServer.frame_post_draw
	var image := root.get_texture().get_image()
	if image == null or image.is_empty():
		push_error("Visual capture returned an empty image for %s" % filename)
		quit(1)
		return
	if image.get_width() != VIEWPORT_SIZE.x or image.get_height() != VIEWPORT_SIZE.y:
		image.resize(VIEWPORT_SIZE.x, VIEWPORT_SIZE.y, Image.INTERPOLATE_NEAREST)
	var path := ProjectSettings.globalize_path("%s/%s" % [OUTPUT_DIR, filename])
	var err := image.save_png(path)
	if err != OK:
		push_error("Failed saving %s: %s" % [filename, error_string(err)])
		quit(1)

func _wait_frames(count: int) -> void:
	for _i in range(count):
		await process_frame
