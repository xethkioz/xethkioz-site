extends Node

const NavigationGraph := preload("res://src/world/izrdralar_navigation_graph.gd")
const ObjectiveScript := preload("res://src/world/izrdralar_route_objective.gd")
const RuntimeScene := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")

var failures: Array[String] = []
var navigation = NavigationGraph.new()

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	if not navigation.load_graph():
		_fail("navigation graph did not load")
		_finish()
		return

	await _validate_opening_and_choice()
	await _validate_branch_gate()
	await _validate_boss_and_stabilization()
	_validate_reload_after_stabilization()

	SaveService.delete_save()
	_finish()

func _validate_opening_and_choice() -> void:
	GameState.set_world_checkpoint("M01", "start", Vector2(192, 792))
	var opening := _objective({
		"id":"m01_opening_resonance",
		"name":"Eco del Despertar",
		"world_flag":"opening_flow_complete",
		"requires_flag":"m01_survived_opening"
	})
	opening.interact(null)
	await get_tree().process_frame
	if GameState.has_world_flag("opening_flow_complete"):
		_fail("M01 opening bypassed first-combat story gate")
	GameState.set_world_flag("m01_survived_opening")
	opening.interact(null)
	await get_tree().process_frame
	if not GameState.has_world_flag("opening_flow_complete"):
		_fail("M01 objective did not set opening_flow_complete after survival gate")
	if not navigation.can_traverse("M01", "M02", GameState.world_flags):
		_fail("M01 -> M02 did not unlock after opening objective")
	opening.queue_free()

	GameState.set_world_checkpoint("M02", "from_m01", Vector2(112, 560))
	var atlas := _objective({
		"id":"m02_prisma_atlas",
		"name":"Prisma-Atlas de Iván",
		"world_flag":"prisma_atlas_unlocked",
		"requires_flag":"opening_flow_complete"
	})
	atlas.interact(null)
	await get_tree().process_frame
	if not GameState.has_world_flag("prisma_atlas_unlocked"):
		_fail("M02 objective did not unlock Prisma-Atlas")
	if not navigation.can_traverse("M02", "M03", GameState.world_flags):
		_fail("M02 -> M03 choice did not unlock")
	if not navigation.can_traverse("M02", "M04", GameState.world_flags):
		_fail("M02 -> M04 choice did not unlock")
	atlas.queue_free()

func _validate_branch_gate() -> void:
	GameState.set_world_checkpoint("M03", "from_m02", Vector2(520, 900))
	var lake := _objective({
		"id":"m03_lake_resonance",
		"name":"Piedra Resonante del Lago",
		"world_flag":"lake_resolved",
		"requires_flag":"m03_lake_ready"
	})
	lake.interact(null)
	await get_tree().process_frame
	if GameState.has_world_flag("lake_resolved"):
		_fail("M03 resonance bypassed habitat/familiar story gate")
	GameState.set_world_flag("m03_lake_ready")
	lake.interact(null)
	await get_tree().process_frame
	if not GameState.has_world_flag("lake_resolved"):
		_fail("M03 objective did not set lake_resolved after story gate")
	if navigation.can_traverse("M03", "M05", GameState.world_flags):
		_fail("M05 opened after only Lago was resolved")
	lake.queue_free()

	GameState.set_world_checkpoint("M04", "from_m02", Vector2(112, 560))
	var ruins := _objective({
		"id":"m04_sanctuary_resonance",
		"name":"Núcleo del Santuario",
		"world_flag":"ruins_sanctuary_resolved",
		"requires_flag":"m04_sanctuary_ready"
	})
	ruins.interact(null)
	await get_tree().process_frame
	if GameState.has_world_flag("ruins_sanctuary_resolved"):
		_fail("M04 resonance bypassed puzzle/Custodio story gate")
	GameState.set_world_flag("m04_sanctuary_ready")
	ruins.interact(null)
	await get_tree().process_frame
	if not GameState.has_world_flag("ruins_sanctuary_resolved"):
		_fail("M04 objective did not set ruins_sanctuary_resolved after story gate")
	if not navigation.can_traverse("M03", "M05", GameState.world_flags):
		_fail("M03 -> M05 remained locked after both branches")
	if not navigation.can_traverse("M04", "M05", GameState.world_flags):
		_fail("M04 -> M05 remained locked after both branches")
	ruins.queue_free()

func _validate_boss_and_stabilization() -> void:
	GameState.set_world_checkpoint("M05", "from_m03", Vector2.ZERO)
	var runtime := RuntimeScene.instantiate()
	get_tree().root.add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame
	await get_tree().process_frame

	var objective := runtime.get_node_or_null("Objective_m05_stabilization")
	if objective == null:
		_fail("M05 stabilization objective was not authored")
	else:
		objective.interact(null)
		await get_tree().process_frame
		if GameState.has_world_flag("boss5_stabilized"):
			_fail("M05 stabilized before Boss 5 was defeated")
		if GameState.prism_step_unlocked:
			_fail("Prism Step unlocked before Boss 5 stabilization")

	var boss := runtime.get_node_or_null("Boss5Guardian")
	if boss == null:
		_fail("Boss 5 did not spawn in M05")
	else:
		boss.take_damage(9999.0)
		await get_tree().process_frame
		await get_tree().process_frame
		if not GameState.has_world_flag("boss5_defeated"):
			_fail("Boss 5 defeat did not persist boss5_defeated")

	if objective != null and is_instance_valid(objective):
		objective.interact(null)
		await get_tree().process_frame
	if not GameState.has_world_flag("boss5_stabilized"):
		_fail("ESTABILIZAR did not set boss5_stabilized")
	if not GameState.prism_step_unlocked:
		_fail("ESTABILIZAR did not unlock Prism Step")
	if navigation.can_traverse("M05", "M06", GameState.world_flags):
		_fail("M06 scope exit became active during Production Pass 01")
	if not navigation.can_traverse("M05", "M06", GameState.world_flags, true):
		_fail("M06 future edge is not resolvable after stabilization")

	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame

func _validate_reload_after_stabilization() -> void:
	GameState.set_world_checkpoint("M05", "from_m03", Vector2(256, 300))
	if not SaveService.save_game({"flow_smoke": "stabilized"}):
		_fail("final stabilized save failed")
		return
	GameState.reset_new_game()
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_fail("final stabilized save could not reload")
		return
	if GameState.current_map_id != "M05" or GameState.current_entry_id != "from_m03":
		_fail("M05 checkpoint did not survive reload")
	if not GameState.last_world_position.is_equal_approx(Vector2(256, 300)):
		_fail("M05 exact position did not survive reload")
	for flag_id in ["opening_flow_complete", "prisma_atlas_unlocked", "lake_resolved", "ruins_sanctuary_resolved", "boss5_defeated", "boss5_stabilized"]:
		if not GameState.has_world_flag(flag_id):
			_fail("reload lost progression flag: %s" % flag_id)
	if not GameState.prism_step_unlocked:
		_fail("reload lost Prism Step unlock")

func _objective(data: Dictionary) -> Node2D:
	var node := Node2D.new()
	node.set_script(ObjectiveScript)
	node.call("configure", data)
	add_child(node)
	return node

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_M01_M05_FLOW_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_M01_M05_FLOW_FAIL")
	get_tree().quit(1)
