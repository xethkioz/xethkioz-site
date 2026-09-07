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
	if frame_count == 30:
		_capture("v08_menu_preview.png")
	if frame_count == 38 and main_scene and main_scene.has_method("_new_game"):
		main_scene.call("_new_game")
	if frame_count == 70:
		_capture("v08_creator_preview.png")
	if frame_count == 78 and main_scene and main_scene.has_method("_finish_character_setup"):
		main_scene.call("_finish_character_setup")
	if frame_count == 150:
		_capture("v08_gameplay_preview.png")
	if frame_count >= 165:
		quit(0)
	return false

func _capture(filename: String) -> void:
	RenderingServer.force_draw(false)
	var image: Image = root.get_texture().get_image()
	image.save_png(ProjectSettings.globalize_path("res://build/%s" % filename))
