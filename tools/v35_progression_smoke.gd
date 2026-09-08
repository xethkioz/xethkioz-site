extends SceneTree

const QuestManagerScript := preload("res://src/quest/quest_manager.gd")

var _failed := false

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	InventoryService.reset()
	CharacterProfile.reset_default()

	var quests := Node.new()
	quests.name = "QuestManagerSmoke"
	quests.set_script(QuestManagerScript)
	root.add_child(quests)
	await process_frame

	# Alexis inicia investigación.
	EventBus.npc_interacted.emit("alexis")
	await process_frame
	_require(_quest_state() == 1, "Alexis must start Roots investigation")

	# Tres Brote Goblin completan la investigación inicial.
	for _i in range(3):
		EventBus.enemy_defeated.emit("brote_goblin", 0, Vector2.ZERO)
		await process_frame
	_require(_quest_state() == 2, "Three Brote Goblin defeats must return quest to Alexis")
	EventBus.npc_interacted.emit("alexis")
	await process_frame
	_require(_quest_state() == 3, "Alexis completion must send player to Val")
	_require(GameState.set_piece_count("brote_vivo") == 1, "Alexis must grant Brote Vivo piece 1")

	# Captura válida de Carpinchito y evaluación de Val.
	var captured := GameState.capture_familiar("carpinchito_cristal", "Carpinchito de Cristal", "impacto", "fermin")
	_require(captured, "Carpinchito must be capturable in smoke flow")
	await process_frame
	_require(_quest_state() == 5, "Carpinchito capture must request return to Val")
	EventBus.npc_interacted.emit("val")
	await process_frame
	_require(_quest_state() == 6, "Val assessment must unlock Sanctuary stage")
	_require(GameState.set_piece_count("brote_vivo") == 2, "Val must grant Brote Vivo piece 2")
	var familiar := GameState.familiar_data("carpinchito_cristal")
	_require(bool(familiar.get("assessed", false)), "Val must mark familiar as assessed")
	_require(str(familiar.get("affinity", "")) == "impacto", "Carpinchito affinity must be Impacto")
	_require(str(familiar.get("mentor_id", "")) == "fermin", "Carpinchito mentor recommendation must be Fermín")

	# Santuario y Boss 5.
	EventBus.enemy_defeated.emit("custodio_raices_menor", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 7, "Custodio Menor must expose Boss 5")
	_require(GameState.set_piece_count("brote_vivo") == 3, "Sanctuary must grant Brote Vivo piece 3")
	EventBus.enemy_defeated.emit("boss5_guardian_bosque_velado", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 8, "Boss 5 defeat must send player to Elida")

	# Refugio, mentoría inicial y cuarta pieza.
	EventBus.npc_interacted.emit("elida")
	await process_frame
	_require(_quest_state() == 9, "Elida must open mentor choice")
	EventBus.npc_interacted.emit("ashley")
	await process_frame
	_require(_quest_state() == 10, "First sibling mentor must advance to Familiar training")
	_require(GameState.selected_mentor == "ashley", "Chosen initial mentor must persist")
	_require(GameState.prism_step_unlocked, "First mentor must unlock Paso Prismático")
	_require(GameState.set_piece_count("brote_vivo") == 4, "First mentor must grant Brote Vivo piece 4")
	_require(GameState.has_set_bonus("brote_vivo", 4), "Brote Vivo F gate must be active at 4 pieces")

	# Fermín: prueba de Impacto y Rango I.
	EventBus.npc_interacted.emit("fermin")
	await process_frame
	_require(_quest_state() == 11, "Fermín must start Impact training")
	for _i in range(3):
		EventBus.enemy_defeated.emit("nucleo_entrenamiento_impacto", 0, Vector2.ZERO)
		await process_frame
	_require(_quest_state() == 12, "Three Impact cores must complete training test")
	EventBus.npc_interacted.emit("fermin")
	await process_frame
	_require(_quest_state() == 13, "Returning to Fermín must complete vertical slice")
	familiar = GameState.familiar_data("carpinchito_cristal")
	_require(int(familiar.get("training_rank", 0)) == 1, "Carpinchito must reach Rank I")
	_require(str(familiar.get("trained_with", "")) == "fermin", "Carpinchito must be trained by Fermín")
	_require(str(familiar.get("unlocked_ability", "")) == "embate_cristal", "Embate Cristal must unlock")

	# Guardado/carga integral: progreso, perfil, posición y familiar.
	CharacterProfile.configure("QA Viajero", 2, 4, 3, 2, 1)
	GameState.set_last_world_position(Vector2(912, 1536))
	var saved := SaveService.save_game({"intro_seen": true, "qa_smoke": true})
	_require(saved, "SaveService must write v3.5 smoke save")

	GameState.reset_new_game()
	InventoryService.reset()
	CharacterProfile.reset_default()
	var payload := SaveService.load_game()
	_require(not payload.is_empty(), "SaveService must load smoke save")
	_require(str(CharacterProfile.player_name) == "QA Viajero", "CharacterProfile must survive save/load")
	_require(GameState.last_world_position.distance_to(Vector2(912, 1536)) < 0.1, "World position must survive save/load")
	_require(GameState.set_piece_count("brote_vivo") == 4, "Brote Vivo progress must survive save/load")
	_require(int(GameState.get_quest_snapshot().get("state", -1)) == 13, "Quest state must survive save/load")
	familiar = GameState.familiar_data("carpinchito_cristal")
	_require(int(familiar.get("training_rank", 0)) == 1, "Familiar Rank I must survive save/load")
	_require(str(familiar.get("unlocked_ability", "")) == "embate_cristal", "Embate Cristal must survive save/load")

	SaveService.delete_save()
	if _failed:
		push_error("V3.5 progression/save smoke FAILED")
		quit(1)
		return
	print("V3.5 progression/save smoke PASSED · Brote Vivo 4/4 · Carpinchito Rank I · save round-trip OK")
	quit(0)

func _quest_state() -> int:
	return int(GameState.get_quest_snapshot().get("state", -1))

func _require(condition: bool, message: String) -> void:
	if condition:
		return
	_failed = true
	push_error("V3.5 SMOKE: %s" % message)
