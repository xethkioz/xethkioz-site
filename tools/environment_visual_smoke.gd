extends SceneTree

var main_scene: Node
var frame_count := 0
var current_preview_map := 0
var capture_schedule := {
	90:1,
	145:2,
	200:3,
	255:4,
	310:5
}

func _initialize() -> void:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://build"))
	var packed: PackedScene = load("res://scenes/Main.tscn")
	main_scene = packed.instantiate()
	root.add_child(main_scene)

func _process(_delta: float) -> bool:
	frame_count += 1
	if frame_count == 15 and main_scene and main_scene.has_method("_new_game"):
		main_scene.call("_new_game")
	if frame_count == 30 and main_scene and main_scene.has_method("_finish_character_setup"):
		main_scene.call("_finish_character_setup")
	if capture_schedule.has(frame_count):
		var map_no := int(capture_schedule[frame_count])
		_start_preview(map_no)
	if frame_count in [115,170,225,280,335]:
		_capture(current_preview_map)
	if frame_count >= 350:
		quit(0)
	return false

func _start_preview(map_no: int) -> void:
	current_preview_map = map_no
	if not main_scene:
		return
	main_scene.set("current_map",map_no)
	if main_scene.has_method("_start_level"):
		main_scene.call("_start_level")

func _capture(map_no: int) -> void:
	if map_no <= 0:
		return
	RenderingServer.force_draw(false)
	var image: Image = root.get_texture().get_image()
	image.save_png(ProjectSettings.globalize_path("res://build/env_map_%02d.png" % map_no))
