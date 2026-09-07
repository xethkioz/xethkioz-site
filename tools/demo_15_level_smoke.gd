extends SceneTree

var main_scene: Node
var current_map := 0
var frame_count := 0
var phase_frame := 0
var failures: Array[String] = []

func _initialize() -> void:
	var packed: PackedScene = load("res://scenes/Main.tscn")
	main_scene = packed.instantiate()
	root.add_child(main_scene)

func _process(_delta: float) -> bool:
	frame_count += 1
	phase_frame += 1
	if current_map == 0 and phase_frame >= 10:
		_start_map(1)
		return false
	if current_map >= 1 and current_map <= 15 and phase_frame == 10:
		_validate_current()
	if current_map >= 1 and current_map < 15 and phase_frame >= 14:
		_start_map(current_map+1)
	elif current_map == 15 and phase_frame >= 14:
		_validate_result()
		return true
	if frame_count > 600:
		push_error("15-level smoke timed out")
		quit(1)
		return true
	return false

func _start_map(id: int) -> void:
	current_map = id
	phase_frame = 0
	var state = main_scene.get("state")
	if typeof(state) == TYPE_DICTIONARY:
		state["current_map"] = id
		state["current_node"] = id
		if id >= 6:
			state["mentor_chosen"] = true
			state["selected_hero"] = 1
		main_scene.set("state",state)
	main_scene.set("current_map",id)
	if main_scene.has_method("_start_level"):
		main_scene.call("_start_level")
	else:
		failures.append("Main has no _start_level")

func _validate_current() -> void:
	var world = main_scene.get("world")
	if world == null or not is_instance_valid(world):
		failures.append("Map %d has no world" % current_map)
	if get_first_node_in_group("player") == null:
		failures.append("Map %d has no player" % current_map)
	if current_map in [5,10,15]:
		if get_nodes_in_group("boss").is_empty():
			failures.append("Boss map %d has no boss" % current_map)
	else:
		if bool(main_scene.get("boss_alive")):
			failures.append("Normal map %d incorrectly has boss_alive" % current_map)

func _validate_result() -> void:
	if failures.is_empty():
		print("Steam demo level smoke: 15/15 maps loaded; bosses 5/10/15 present")
		quit(0)
	else:
		for f in failures: push_error(f)
		quit(1)
