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
		_capture("golden_menu.png")
	if frame_count == 38:
		main_scene.call("_new_game")
	if frame_count == 68:
		_capture("golden_creator.png")
	if frame_count == 76:
		main_scene.call("_finish_character_setup")
	if frame_count == 118:
		main_scene.call("show_family_dialogue","Alexis","La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.","Padre","Masculino")
	if frame_count == 145:
		_capture("golden_dialogue.png")
	if frame_count == 152:
		main_scene.set("transition_finished_map",5)
		main_scene.set("transition_next_map",6)
		main_scene.call("_show_map_transition_v16")
	if frame_count == 180:
		_capture("golden_transition.png")
	if frame_count == 188:
		main_scene.call("_show_elida_refuge_v16")
	if frame_count == 218:
		_capture("golden_refuge.png")
	if frame_count >= 230:
		quit(0)
	return false

func _capture(filename: String) -> void:
	RenderingServer.force_draw(false)
	var image: Image = root.get_texture().get_image()
	image.save_png(ProjectSettings.globalize_path("res://build/%s" % filename))
