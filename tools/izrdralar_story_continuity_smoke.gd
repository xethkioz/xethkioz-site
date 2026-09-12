extends Node

const RuntimeScene := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	InventoryService.reset()
	GameState.reset_new_game()

	await _validate_m01_story()
	await _validate_m03_first_familiar()
	await _validate_m04_sanctuary()

	SaveService.delete_save()
	InventoryService.reset()
	_finish()

func _validate_m01_story() -> void:
	GameState.reset_new_game()
	InventoryService.reset()
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	var runtime := await _spawn_runtime()
	if runtime == null:
		_fail("M01 runtime did not instantiate")
		return

	_assert_node(runtime, "StoryLayer", "M01 story layer")
	_assert_node(runtime, "Alexis", "M01 Alexis")
	_assert_node(runtime, "?????", "M01 ????? / Gustavo")
	_assert_node(runtime, "Lore_medidor_sin_bateria", "M01 batteryless meter lore")
	_assert_node(runtime, "Lore_nota_doble_trueno", "M01 thunder note lore")

	if GameState.has_world_flag("m01_survived_opening"):
		_fail("M01 survival flag existed before opening enemies")
	EventBus.enemy_defeated.emit("brote_goblin", 0, Vector2.ZERO)
	await get_tree().process_frame
	if GameState.has_world_flag("m01_survived_opening"):
		_fail("M01 survival gate completed after only Brote Goblin")
	EventBus.enemy_defeated.emit("slime_prismatico", 0, Vector2.ZERO)
	await get_tree().process_frame
	if not GameState.has_world_flag("m01_survived_opening"):
		_fail("M01 survival gate did not complete after Brote + Slime")

	await _free_runtime(runtime)

func _validate_m03_first_familiar() -> void:
	GameState.reset_new_game()
	InventoryService.reset()
	GameState.set_world_flag("opening_flow_complete")
	GameState.set_world_flag("prisma_atlas_unlocked")
	GameState.set_world_checkpoint("M03", "from_m02", Vector2.ZERO)
	var runtime := await _spawn_runtime()
	if runtime == null:
		_fail("M03 runtime did not instantiate")
		return

	for npc_name in ["Val", "Rola", "Mela", "?????"]:
		_assert_node(runtime, npc_name, "M03 NPC %s" % npc_name)
	_assert_node(runtime, "Lore_piedra_resonante", "M03 resonant stone lore")
	var north := runtime.get_node_or_null("Puzzle_carpinchito_habitat_foco_norte")
	var center := runtime.get_node_or_null("Puzzle_carpinchito_habitat_foco_centro")
	var south := runtime.get_node_or_null("Puzzle_carpinchito_habitat_foco_sur")
	if north == null or center == null or south == null:
		_fail("M03 habitat puzzle did not spawn all three prism focuses")
	else:
		north.interact(null)
		await get_tree().process_frame
		if GameState.has_world_flag("carpinchito_habitat_ready"):
			_fail("M03 habitat solved after only one focus")
		south.interact(null)
		await get_tree().process_frame
		if not GameState.has_world_flag("carpinchito_habitat_ready"):
			_fail("M03 habitat did not solve with two off and center active")

	var capture := runtime.get_node_or_null("Capture_carpinchito_cristal")
	if capture == null:
		_fail("M03 Carpinchito de Cristal capture target missing")
	else:
		InventoryService.add_item("manzana_bruma", 1)
		await capture.interact(null)
		await get_tree().process_frame
		if not GameState.has_familiar("carpinchito_cristal"):
			_fail("M03 real bond sequence did not capture Carpinchito")
		if not GameState.has_world_flag("m03_lake_ready"):
			_fail("M03 first familiar did not unlock lake story readiness")
		if GameState.active_familiar_id != "carpinchito_cristal":
			_fail("M03 first familiar was not set active")

	await _free_runtime(runtime)

func _validate_m04_sanctuary() -> void:
	GameState.reset_new_game()
	InventoryService.reset()
	GameState.set_world_flag("opening_flow_complete")
	GameState.set_world_flag("prisma_atlas_unlocked")
	GameState.set_world_checkpoint("M04", "from_m02", Vector2.ZERO)
	var runtime := await _spawn_runtime()
	if runtime == null:
		_fail("M04 runtime did not instantiate")
		return

	_assert_node(runtime, "?????", "M04 ????? / Gustavo")
	_assert_node(runtime, "Lore_nota_elida_raices", "M04 Elida folded note")
	_assert_node(runtime, "Lore_hoja_17b_a0", "M04 Hoja 17-B / A-0")
	_assert_node(runtime, "Lore_sombra_anticipacion_santuario", "M04 anticipation shadow")

	var west := runtime.get_node_or_null("Puzzle_roots_sanctuary_cristal_oeste")
	var center := runtime.get_node_or_null("Puzzle_roots_sanctuary_cristal_centro")
	var east := runtime.get_node_or_null("Puzzle_roots_sanctuary_cristal_este")
	if west == null or center == null or east == null:
		_fail("M04 sanctuary puzzle did not spawn all three crystals")
	else:
		west.interact(null)
		await get_tree().process_frame
		if GameState.has_world_flag("sanctuary_puzzle_ready"):
			_fail("M04 sanctuary puzzle solved after one crystal")
		center.interact(null)
		await get_tree().process_frame
		if not GameState.has_world_flag("sanctuary_puzzle_ready"):
			_fail("M04 sanctuary crystals did not solve canonical orientation")

	var custodian := runtime.get_node_or_null("custodio_raices_menor")
	if custodian == null:
		_fail("M04 Custodio de Raíz missing")
	else:
		custodian.take_damage(9999.0)
		await get_tree().process_frame
		await get_tree().process_frame
		if not GameState.has_world_flag("custodio_raices_defeated"):
			_fail("M04 Custodio defeat did not persist story flag")
		if not GameState.has_world_flag("m04_sanctuary_ready"):
			_fail("M04 puzzle + Custodio did not unlock sanctuary readiness")

	await _free_runtime(runtime)

func _spawn_runtime() -> Node:
	var runtime := RuntimeScene.instantiate()
	get_tree().root.add_child(runtime)
	for _frame in range(4):
		await get_tree().process_frame
	return runtime

func _free_runtime(runtime: Node) -> void:
	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	await get_tree().process_frame

func _assert_node(parent: Node, path: String, label: String) -> void:
	if parent.get_node_or_null(path) == null:
		_fail("%s missing (%s)" % [label, path])

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_STORY_CONTINUITY_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_STORY_CONTINUITY_FAIL")
	get_tree().quit(1)
