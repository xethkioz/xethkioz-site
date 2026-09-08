extends SceneTree

const VIEWPORT_SIZE := Vector2i(640, 360)
const OUTPUT_DIR := "res://build/previews"
const BOOTSTRAP := "res://scenes/v34/GameBootstrap.tscn"
const GOLDEN_REGION := "res://scenes/v34/GoldenRegion.tscn"
const REFUGIO := "res://scenes/v34/RefugioInterior.tscn"

var _game_state: Node
var _character_profile: Node
var _event_bus: Node
var _fatal_error := false

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	root.size = VIEWPORT_SIZE
	root.content_scale_size = VIEWPORT_SIZE
	_game_state = root.get_node_or_null("GameState")
	_character_profile = root.get_node_or_null("CharacterProfile")
	_event_bus = root.get_node_or_null("EventBus")
	if not is_instance_valid(_game_state) or not is_instance_valid(_character_profile) or not is_instance_valid(_event_bus):
		_fail("Visual capture requires GameState, CharacterProfile and EventBus autoloads")
		return
	if not _character_profile.has_method("reset_default"):
		_fail("CharacterProfile.reset_default() is required by visual capture")
		return
	if not _game_state.has_method("reset_new_game"):
		_fail("GameState.reset_new_game() is required by visual capture")
		return

	var absolute_dir: String = ProjectSettings.globalize_path(OUTPUT_DIR)
	var err: Error = DirAccess.make_dir_recursive_absolute(absolute_dir)
	if err != OK and err != ERR_ALREADY_EXISTS:
		_fail("Could not create visual preview directory: %s" % error_string(err))
		return

	_character_profile.call("reset_default")
	_game_state.call("reset_new_game")
	await _capture_bootstrap()
	if _fatal_error:
		return
	await _capture_golden_region()
	if _fatal_error:
		return
	await _capture_refugio()
	if _fatal_error:
		return
	print("V3.5 visual capture complete: menu, creator, Cuenca, Lago, Boss 5, Refugio")
	quit(0)

func _capture_bootstrap() -> void:
	var scene: Node = await _mount_scene(BOOTSTRAP)
	if _fatal_error:
		return
	await _wait_frames(8)
	await _save_frame("v34_menu.png")
	if _fatal_error:
		return
	if scene.has_method("_show_creator"):
		scene.call("_show_creator")
		await _wait_frames(8)
		await _save_frame("v34_creator.png")
	else:
		_fail("GameBootstrap must expose _show_creator() for creator preview capture")

func _capture_golden_region() -> void:
	_game_state.call("reset_new_game")
	var scene: Node = await _mount_scene(GOLDEN_REGION)
	if _fatal_error:
		return
	await _wait_frames(24)
	var title_overlay: CanvasItem = scene.get_node_or_null("AssistHUD/ZoneTitleOverlay") as CanvasItem
	if is_instance_valid(title_overlay):
		title_overlay.visible = false
	var player: CharacterBody2D = scene.get_node_or_null("Player") as CharacterBody2D
	if not is_instance_valid(player):
		_fail("GoldenRegion visual capture could not find Player")
		return

	player.global_position = Vector2(768, 1760)
	_reset_player_camera(player)
	await _wait_frames(18)
	await _save_frame("v34_cuenca.png")
	if _fatal_error:
		return

	player.global_position = Vector2(742, 812)
	_reset_player_camera(player)
	await _wait_frames(24)
	await _save_frame("v34_lago.png")
	if _fatal_error:
		return

	await _capture_boss5(scene, player)

func _capture_boss5(scene: Node, player: CharacterBody2D) -> void:
	player.global_position = Vector2(2368, 286)
	_reset_player_camera(player)
	_event_bus.emit_signal("demo_stage_changed", "boss5")
	await _wait_frames(18)
	var boss: CharacterBody2D = scene.get_node_or_null("GuardianBosqueVelado") as CharacterBody2D
	if not is_instance_valid(boss):
		_fail("Boss 5 visual capture could not spawn GuardianBosqueVelado")
		return
	boss.set("health", float(boss.get("max_health")) * 0.55)
	boss.set("_pulse_cooldown", 0.0)
	await _wait_frames(12)
	# Keep the shot inside the telegraph window instead of after pulse resolution.
	if not bool(boss.get("_pulse_pending")):
		boss.set("_pulse_cooldown", 0.0)
		await _wait_frames(4)
	await _save_frame("v34_boss5.png")

func _capture_refugio() -> void:
	var scene: Node = await _mount_scene(REFUGIO)
	if _fatal_error:
		return
	await _wait_frames(24)
	var player: CharacterBody2D = scene.get_node_or_null("Player") as CharacterBody2D
	if not is_instance_valid(player):
		_fail("Refugio visual capture could not find Player")
		return
	player.global_position = Vector2(320, 284)
	await _wait_frames(12)
	await _save_frame("v34_refugio.png")

func _mount_scene(path: String) -> Node:
	if is_instance_valid(current_scene):
		current_scene.queue_free()
		await process_frame
	var packed: PackedScene = load(path) as PackedScene
	if packed == null:
		_fail("Visual capture could not load %s" % path)
		return root
	var scene: Node = packed.instantiate()
	root.add_child(scene)
	current_scene = scene
	await _wait_frames(4)
	return scene

func _reset_player_camera(player: CharacterBody2D) -> void:
	var camera: Camera2D = player.get_node_or_null("WorldCamera") as Camera2D
	if not is_instance_valid(camera):
		return
	camera.position_smoothing_enabled = false
	camera.reset_smoothing()

func _save_frame(filename: String) -> void:
	await RenderingServer.frame_post_draw
	var image: Image = root.get_texture().get_image()
	if image == null or image.is_empty():
		_fail("Visual capture returned an empty image for %s" % filename)
		return
	if image.get_width() != VIEWPORT_SIZE.x or image.get_height() != VIEWPORT_SIZE.y:
		image.resize(VIEWPORT_SIZE.x, VIEWPORT_SIZE.y, Image.INTERPOLATE_NEAREST)
	var path: String = ProjectSettings.globalize_path("%s/%s" % [OUTPUT_DIR, filename])
	var err: Error = image.save_png(path)
	if err != OK:
		_fail("Failed saving %s: %s" % [filename, error_string(err)])

func _wait_frames(count: int) -> void:
	for _i in range(count):
		await process_frame

func _fail(message: String) -> void:
	_fatal_error = true
	push_error(message)
	quit(1)
