extends SceneTree

var main_scene: Node
var frames := 0
var phase := 0
var failures: Array[String] = []

func _initialize() -> void:
	var packed: PackedScene = load("res://scenes/Main.tscn")
	main_scene = packed.instantiate()
	root.add_child(main_scene)

func _process(_delta: float) -> bool:
	frames += 1

	if phase == 0 and frames >= 12:
		main_scene.call("_new_game")
		phase = 1; frames = 0
		return false

	if phase == 1 and frames == 8:
		var name_input = main_scene.get("character_name_input")
		if name_input == null:
			failures.append("Creator did not expose name input")
		else:
			name_input.text = "QA Viajero"
		main_scene.call("_finish_character_setup")
		phase = 2; frames = 0
		return false

	if phase == 2 and frames == 6:
		var st: Dictionary = main_scene.get("state")
		if bool(st.get("intro_seen",true)):
			failures.append("Intro was skipped after confirming creator")
		if main_scene.get("world") != null:
			failures.append("World started before intro completed")
		main_scene.call("_advance_intro_v20")
		main_scene.call("_advance_intro_v20")
		main_scene.call("_advance_intro_v20")
		phase = 3; frames = 0
		return false

	if phase == 3 and frames == 14:
		var st: Dictionary = main_scene.get("state")
		if not bool(st.get("intro_seen",false)):
			failures.append("Intro completion was not persisted")
		var player = get_first_node_in_group("player")
		if player == null:
			failures.append("Node 1 did not start after intro")
		else:
			if bool(st.get("double_jump_unlocked",false)):
				failures.append("Double jump is unlocked before Boss 5")
			if int(player.get("air_jumps")) != 0:
				failures.append("Node 1 player still has an air jump before unlock")

		main_scene.set("transition_finished_map",5)
		main_scene.set("transition_next_map",6)
		main_scene.call("_select_mentor",1)
		phase = 4; frames = 0
		return false

	if phase == 4 and frames == 8:
		var st: Dictionary = main_scene.get("state")
		if not bool(st.get("mentor_chosen",false)):
			failures.append("Mentor choice was not persisted")
		if bool(st.get("double_jump_unlocked",false)):
			failures.append("Mentor choice incorrectly auto-unlocked double jump")
		if main_scene.get("menu_layer") == null:
			failures.append("First Elida refuge did not open after mentor choice")

		main_scene.call("_unlock_double_jump_v20",null)
		phase = 5; frames = 0
		return false

	if phase == 5 and frames == 5:
		var st: Dictionary = main_scene.get("state")
		if not bool(st.get("double_jump_unlocked",false)):
			failures.append("Alexis training did not unlock double jump")
		st["current_map"] = 6; st["current_node"] = 6
		main_scene.set("state",st)
		main_scene.set("current_map",6)
		main_scene.call("_start_level")
		phase = 6; frames = 0
		return false

	if phase == 6 and frames == 14:
		var player = get_first_node_in_group("player")
		if player == null:
			failures.append("Node 6 did not create player")
		else:
			if not bool(player.get("double_jump_unlocked_v10")):
				failures.append("Node 6 player did not inherit double jump unlock")
		_finish()
		return true

	if frames > 240:
		push_error("Golden Slice production smoke timed out")
		quit(1)
		return true
	return false

func _finish() -> void:
	if failures.is_empty():
		print("Golden Slice production smoke: creator->intro->node1 and mentor->refuge->double-jump->node6 valid")
		quit(0)
	else:
		for f in failures:
			push_error(f)
		quit(1)
