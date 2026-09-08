extends SceneTree

var main_scene: Node
var frames := 0
var phase := 0
var failures: Array[String] = []
var mana_before := 0.0

func _initialize() -> void:
	var packed: PackedScene = load("res://scenes/Main.tscn")
	main_scene = packed.instantiate()
	root.add_child(main_scene)

func _process(_delta: float) -> bool:
	frames += 1
	if phase == 0 and frames >= 12:
		var st = main_scene.get("state")
		st["current_map"] = 1; st["current_node"] = 1; st["mentor_chosen"] = false; st["selected_hero"] = -1
		main_scene.set("state",st); main_scene.set("current_map",1); main_scene.call("_start_level")
		phase = 1; frames = 0
		return false
	if phase == 1 and frames == 18:
		_validate_map1()
		return false
	if phase == 1 and frames == 22:
		_test_apprentice_skill()
		return false
	if phase == 1 and frames == 28:
		_validate_skill_result()
		var st = main_scene.get("state")
		st["current_map"] = 5; st["current_node"] = 5; st["mentor_chosen"] = false
		main_scene.set("state",st); main_scene.set("current_map",5); main_scene.call("_start_level")
		phase = 2; frames = 0
		return false
	if phase == 2 and frames == 18:
		_validate_map5()
		_finish()
		return true
	if frames > 200:
		push_error("Golden Slice functional smoke timed out")
		quit(1)
		return true
	return false

func _validate_map1() -> void:
	var player = get_first_node_in_group("player")
	if player == null:
		failures.append("Map 1 has no player")
	else:
		if str(player.get("hero_class")) != "Aprendiz Prismático": failures.append("Map 1 player is not Aprendiz Prismático")
	var enemies = get_nodes_in_group("enemies")
	if enemies.size() < 4: failures.append("Map 1 has fewer than 4 enemies")
	var npc_count := 0
	var bad_npc_y := 0
	var world = main_scene.get("world")
	if world:
		var bg_count := 0
		for child in world.get_children():
			var script = child.get_script()
			if script and str(script.resource_path).ends_with("npc_actor.gd"):
				npc_count += 1
				if child.global_position.y < 250.0 or child.global_position.y > 650.0: bad_npc_y += 1
			if child is Sprite2D and int(child.z_index) == -100: bg_count += 1
		if bg_count != 3: failures.append("Map 1 expected exactly 3 background panels, got %d" % bg_count)
	if npc_count != 2: failures.append("Map 1 expected Alexis + Ashley, got %d NPCs" % npc_count)
	if bad_npc_y > 0: failures.append("Map 1 has story NPCs outside valid floor range")

func _test_apprentice_skill() -> void:
	var player = get_first_node_in_group("player")
	if player == null: return
	mana_before = float(player.get("mana"))
	player.call("_try_skill",0)

func _validate_skill_result() -> void:
	var player = get_first_node_in_group("player")
	if player == null: return
	var mana_after := float(player.get("mana"))
	var cds: Array = player.get("skill_cooldowns")
	if mana_after >= mana_before: failures.append("Apprentice Q did not spend mana")
	if cds.is_empty() or float(cds[0]) <= 0.0: failures.append("Apprentice Q did not start cooldown")

func _validate_map5() -> void:
	if get_nodes_in_group("boss").is_empty(): failures.append("Map 5 has no boss")
	var npc_count := 0
	var world = main_scene.get("world")
	if world:
		for child in world.get_children():
			var script = child.get_script()
			if script and str(script.resource_path).ends_with("npc_actor.gd"): npc_count += 1
	if npc_count != 1: failures.append("Map 5 should only stage Alexis before boss; got %d NPCs" % npc_count)

func _finish() -> void:
	if failures.is_empty():
		print("Golden Slice functional smoke: map1 NPCs/background/skills valid; map5 boss valid")
		quit(0)
	else:
		for f in failures: push_error(f)
		quit(1)
