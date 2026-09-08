extends SceneTree

const GOLDEN_REGION := "res://scenes/v34/GoldenRegion.tscn"

var _failed := false
var _save_service: Node
var _game_state: Node
var _inventory_service: Node
var _character_profile: Node
var _event_bus: Node
var _world: Node

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	_save_service = root.get_node_or_null("SaveService")
	_game_state = root.get_node_or_null("GameState")
	_inventory_service = root.get_node_or_null("InventoryService")
	_character_profile = root.get_node_or_null("CharacterProfile")
	_event_bus = root.get_node_or_null("EventBus")
	for required in [_save_service, _game_state, _inventory_service, _character_profile, _event_bus]:
		if not is_instance_valid(required):
			_fail("Required autoload missing in progression smoke")
			quit(1)
			return

	_save_service.call("delete_save")
	_game_state.call("reset_new_game")
	_inventory_service.call("reset")
	_character_profile.call("reset_default")

	var packed: PackedScene = load(GOLDEN_REGION) as PackedScene
	if packed == null:
		_fail("Could not load GoldenRegion.tscn")
		quit(1)
		return
	_world = packed.instantiate()
	root.add_child(_world)
	current_scene = _world
	await _wait_frames(8)
	var quest_manager := _world.get_node_or_null("QuestManager")
	_require(is_instance_valid(quest_manager), "GoldenRegion must instantiate QuestManager")
	if _failed:
		quit(1)
		return

	# Alexis inicia investigación.
	_event_bus.emit_signal("npc_interacted", "alexis")
	await process_frame
	_require(_quest_state() == 1, "Alexis must start Roots investigation")

	# Tres Brote Goblin completan la investigación inicial.
	for _i in range(3):
		_event_bus.emit_signal("enemy_defeated", "brote_goblin", 0, Vector2.ZERO)
		await process_frame
	_require(_quest_state() == 2, "Three Brote Goblin defeats must return quest to Alexis")
	_event_bus.emit_signal("npc_interacted", "alexis")
	await process_frame
	_require(_quest_state() == 3, "Alexis completion must send player to Val")
	_require(int(_game_state.call("set_piece_count", "brote_vivo")) == 1, "Alexis must grant Brote Vivo piece 1")

	# Val abre el vínculo; captura y evaluación del Carpinchito.
	_event_bus.emit_signal("npc_interacted", "val")
	await process_frame
	_require(_quest_state() == 4, "First Val interaction must open capture stage")
	var captured := bool(_game_state.call("capture_familiar", "carpinchito_cristal", "Carpinchito de Cristal", "impacto", "fermin"))
	_require(captured, "Carpinchito must be capturable in smoke flow")
	await process_frame
	_require(_quest_state() == 5, "Carpinchito capture must request return to Val")
	_event_bus.emit_signal("npc_interacted", "val")
	await process_frame
	_require(_quest_state() == 6, "Val assessment must unlock Sanctuary stage")
	_require(int(_game_state.call("set_piece_count", "brote_vivo")) == 2, "Val must grant Brote Vivo piece 2")
	var familiar: Dictionary = _game_state.call("familiar_data", "carpinchito_cristal")
	_require(bool(familiar.get("assessed", false)), "Val must mark familiar as assessed")
	_require(str(familiar.get("affinity", "")) == "impacto", "Carpinchito affinity must be Impacto")
	_require(str(familiar.get("mentor_id", "")) == "fermin", "Carpinchito mentor recommendation must be Fermín")

	# Santuario y Boss 5.
	_event_bus.emit_signal("enemy_defeated", "custodio_raices_menor", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 7, "Custodio Menor must expose Boss 5")
	_require(int(_game_state.call("set_piece_count", "brote_vivo")) == 3, "Sanctuary must grant Brote Vivo piece 3")
	_event_bus.emit_signal("enemy_defeated", "boss5_guardian_bosque_velado", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 8, "Boss 5 defeat must send player to Elida")

	# Refugio, mentoría inicial y cuarta pieza.
	_event_bus.emit_signal("npc_interacted", "elida")
	await process_frame
	_require(_quest_state() == 9, "Elida must open mentor choice")
	_event_bus.emit_signal("npc_interacted", "ashley")
	await process_frame
	_require(_quest_state() == 10, "First sibling mentor must advance to Familiar training")
	_require(str(_game_state.get("selected_mentor")) == "ashley", "Chosen initial mentor must persist")
	_require(bool(_game_state.get("prism_step_unlocked")), "First mentor must unlock Paso Prismático")
	_require(int(_game_state.call("set_piece_count", "brote_vivo")) == 4, "First mentor must grant Brote Vivo piece 4")
	_require(bool(_game_state.call("has_set_bonus", "brote_vivo", 4)), "Brote Vivo F gate must be active at 4 pieces")

	# Fermín: prueba de Impacto y Rango I.
	_event_bus.emit_signal("npc_interacted", "fermin")
	await process_frame
	_require(_quest_state() == 11, "Fermín must start Impact training")
	for _i in range(3):
		_event_bus.emit_signal("enemy_defeated", "nucleo_entrenamiento_impacto", 0, Vector2.ZERO)
		await process_frame
	_require(_quest_state() == 12, "Three Impact cores must complete training test")
	_event_bus.emit_signal("npc_interacted", "fermin")
	await process_frame
	_require(_quest_state() == 13, "Returning to Fermín must complete vertical slice")
	familiar = _game_state.call("familiar_data", "carpinchito_cristal")
	_require(int(familiar.get("training_rank", 0)) == 1, "Carpinchito must reach Rank I")
	_require(str(familiar.get("trained_with", "")) == "fermin", "Carpinchito must be trained by Fermín")
	_require(str(familiar.get("unlocked_ability", "")) == "embate_cristal", "Embate Cristal must unlock")

	# Guardado/carga integral: progreso, perfil, posición y familiar.
	_character_profile.call("configure", "QA Viajero", 2, 4, 3, 2, 1)
	_game_state.call("set_last_world_position", Vector2(912, 1536))
	var saved := bool(_save_service.call("save_game", {"intro_seen": true, "qa_smoke": true}))
	_require(saved, "SaveService must write v3.5 smoke save")

	_game_state.call("reset_new_game")
	_inventory_service.call("reset")
	_character_profile.call("reset_default")
	var payload: Dictionary = _save_service.call("load_game")
	_require(not payload.is_empty(), "SaveService must load smoke save")
	_require(str(_character_profile.get("player_name")) == "QA Viajero", "CharacterProfile must survive save/load")
	var restored_position: Vector2 = _game_state.get("last_world_position")
	_require(restored_position.distance_to(Vector2(912, 1536)) < 0.1, "World position must survive save/load")
	_require(int(_game_state.call("set_piece_count", "brote_vivo")) == 4, "Brote Vivo progress must survive save/load")
	var quest_snapshot: Dictionary = _game_state.call("get_quest_snapshot")
	_require(int(quest_snapshot.get("state", -1)) == 13, "Quest state must survive save/load")
	familiar = _game_state.call("familiar_data", "carpinchito_cristal")
	_require(int(familiar.get("training_rank", 0)) == 1, "Familiar Rank I must survive save/load")
	_require(str(familiar.get("unlocked_ability", "")) == "embate_cristal", "Embate Cristal must survive save/load")

	_save_service.call("delete_save")
	if _failed:
		push_error("V3.5 progression/save smoke FAILED")
		quit(1)
		return
	print("V3.5 progression/save smoke PASSED · GoldenRegion real scene · Brote Vivo 4/4 · Carpinchito Rank I · save round-trip OK")
	quit(0)

func _quest_state() -> int:
	var snapshot: Dictionary = _game_state.call("get_quest_snapshot")
	return int(snapshot.get("state", -1))

func _wait_frames(count: int) -> void:
	for _i in range(count):
		await process_frame

func _require(condition: bool, message: String) -> void:
	if condition:
		return
	_failed = true
	push_error("V3.5 SMOKE: %s" % message)

func _fail(message: String) -> void:
	_failed = true
	push_error("V3.5 SMOKE: %s" % message)
