extends SceneTree

const SaveSystem = preload("res://scripts/save_system.gd")

func _initialize() -> void:
	var packed: PackedScene = load("res://scenes/Main.tscn")
	var main = packed.instantiate()
	root.add_child(main)
	main.state = SaveSystem.reset()
	main.state["player_name"] = "Playtest"
	main.state["mentor_chosen"] = false
	main.state["selected_hero"] = -1
	main.state["set_pieces"] = 0
	main.state["parenting_points"] = 0
	main.current_map = 1
	main.supplies = 80.0

	for expected_next in [2,3,4,5,6]:
		main.map_complete = false
		main._complete_map()
		if main.current_map != expected_next:
			push_error("Block progression failed: expected map %d, got %d" % [expected_next,main.current_map])
			quit(1)
			return

	if not bool(main.state.get("demo_complete",false)):
		push_error("Map 5 completion did not set demo_complete")
		quit(1)
		return
	if bool(main.state.get("mentor_chosen",false)):
		push_error("Mentor should still wait for player selection after Map 5")
		quit(1)
		return

	print("Izrdalar block progression: 1→2→3→4→5→6 valid; mentor selection pending")
	quit(0)
