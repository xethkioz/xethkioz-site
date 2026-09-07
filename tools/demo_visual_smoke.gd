extends SceneTree

var main_scene: Node
var frame_count := 0

func _initialize() -> void:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://build"))
	var packed: PackedScene = load("res://scenes/Main.tscn")
	main_scene = packed.instantiate()
	root.add_child(main_scene)

func _process(_delta: float) -> bool:
	frame_count += 1
	if frame_count == 35 and main_scene and main_scene.has_method("_show_overworld"):
		main_scene.call("_show_overworld")
	if frame_count == 80:
		_capture("demo_overworld_preview.png")
	if frame_count == 95 and main_scene and main_scene.has_method("_show_armory"):
		main_scene.call("_show_armory")
	if frame_count == 140:
		_capture("demo_armory_preview.png")
	if frame_count >= 155:
		quit(0)
	return false

func _capture(filename: String) -> void:
	RenderingServer.force_draw(false)
	var image: Image = root.get_texture().get_image()
	image.save_png(ProjectSettings.globalize_path("res://build/%s" % filename))
