extends SceneTree

const VIEWPORT_SIZE := Vector2i(640, 360)
const OUTPUT_DIR := "res://build/previews/mentor"
const ROOM_SCENE := "res://scenes/v34/MentorTrialRoom.tscn"

var _game_state: Node
var _fatal := false

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	root.size = VIEWPORT_SIZE
	root.content_scale_size = VIEWPORT_SIZE
	_game_state = root.get_node_or_null("GameState")
	if not is_instance_valid(_game_state):
		_fail("Mentor visual capture requires GameState")
		return
	var absolute_dir := ProjectSettings.globalize_path(OUTPUT_DIR)
	var err := DirAccess.make_dir_recursive_absolute(absolute_dir)
	if err != OK and err != ERR_ALREADY_EXISTS:
		_fail("Could not create mentor preview directory")
		return

	for mentor in ["ashley", "fermin", "isabella", "gael"]:
		await _capture_mentor(mentor)
		if _fatal:
			return

	print("V3.6 mentor visual capture PASSED")
	quit(0)

func _capture_mentor(mentor: String) -> void:
	if is_instance_valid(current_scene):
		current_scene.queue_free()
		await _wait_frames(2)
	_game_state.call("reset_new_game")
	_game_state.call("choose_mentor", mentor)
	_game_state.call("set_world_flag", "xethkioz_first_intercept", true)
	_game_state.call("set_quest_snapshot", {
		"schema":"golden_v36",
		"state":14,
		"first_brote_defeated":true,
		"ambush_slime_defeated":true,
		"lake_rola_read":true,
		"lake_mela_read":true,
		"lake_val_started":true
	})
	var packed := load(ROOM_SCENE) as PackedScene
	if packed == null:
		_fail("Could not load mentor room")
		return
	var scene := packed.instantiate()
	root.add_child(scene)
	current_scene = scene
	await _wait_frames(20)
	var player := scene.get_node_or_null("Player") as CharacterBody2D
	if is_instance_valid(player):
		player.global_position = Vector2(320, 284)
	await _wait_frames(8)
	await RenderingServer.frame_post_draw
	var image := root.get_texture().get_image()
	if image == null or image.is_empty():
		_fail("Empty mentor capture for %s" % mentor)
		return
	if image.get_width() != VIEWPORT_SIZE.x or image.get_height() != VIEWPORT_SIZE.y:
		image.resize(VIEWPORT_SIZE.x, VIEWPORT_SIZE.y, Image.INTERPOLATE_NEAREST)
	var output := ProjectSettings.globalize_path("%s/v36_mentor_%s.png" % [OUTPUT_DIR, mentor])
	var save_err := image.save_png(output)
	if save_err != OK:
		_fail("Could not save %s mentor preview" % mentor)

func _wait_frames(count: int) -> void:
	for _i in range(count):
		await process_frame

func _fail(message: String) -> void:
	_fatal = true
	push_error("V3.6 MENTOR VISUAL: %s" % message)
	quit(1)
