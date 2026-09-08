extends SceneTree

const GOLDEN_REGION := "res://scenes/v34/GoldenRegion.tscn"

var _failed := false
var _save_service: Node
var _game_state: Node
var _inventory_service: Node
var _character_profile: Node
var _event_bus: Node
var _world: Node
var _quest_manager: Node

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
			_fail("Required autoload missing")
			quit(1)
			return

	_save_service.call("delete_save")
	_game_state.call("reset_new_game")
	_inventory_service.call("reset")
	_character_profile.call("reset_default")

	var packed: PackedScene = load(GOLDEN_REGION) as PackedScene
	_require(packed != null, "Could not load GoldenRegion.tscn")
	if _failed:
		quit(1)
		return
	_world = packed.instantiate()
	root.add_child(_world)
	current_scene = _world
	await _wait_frames(12)
	_quest_manager = _world.get_node_or_null("QuestManager")
	_require(is_instance_valid(_quest_manager), "GoldenRegion must instantiate QuestManager v3.6")
	_require(_quest_state() == 0, "New game must begin at SOBREVIVÍ")
	_require(int(_game_state.get("xethkioz_tail_stage")) == 3, "Izrdralar Xethkioz must begin with 3 tails")
	_require(not bool(_game_state.call("has_world_flag", "xethkioz_first_intercept")), "Xethkioz must not already be linked before intercept")

	# Cuenca: first enemy, Xethkioz intercept, second enemy, strange meter.
	_event_bus.emit_signal("enemy_defeated", "brote_goblin", 0, Vector2.ZERO)
	await _wait_frames(2)
	_require(_quest_state() == 1, "First Brote must trigger Xethkioz ambush state")
	_require(bool(_game_state.call("has_world_flag", "xethkioz_first_intercept")), "Xethkioz intercept flag must be set by encounter director")
	_event_bus.emit_signal("enemy_defeated", "slime_prismatico", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 2, "Ambush Slime must lead to strange meter objective")
	_game_state.call("set_world_flag", "strange_meter_collected", true)
	await process_frame
	_require(_quest_state() == 3, "Strange meter must lead to ????? at bridge")

	# Gustavo then Alexis.
	_event_bus.emit_signal("npc_interacted", "gustavo")
	await process_frame
	_require(_quest_state() == 4, "First Gustavo scene must lead to Alexis")
	_require(bool(_game_state.call("has_world_flag", "gustavo_bridge_warning_01")), "Bridge warning flag must persist")
	_event_bus.emit_signal("npc_interacted", "alexis")
	await process_frame
	_require(_quest_state() == 5, "Alexis recognition must send player to Aldea")
	_require(bool(_game_state.call("has_world_flag", "alexis_xethkioz_recognition")), "Alexis recognition flag must persist")

	# Ivan + local POIs -> Prisma-Atlas.
	_event_bus.emit_signal("npc_interacted", "ivan")
	await process_frame
	_require(_quest_state() == 6 or _quest_state() == 7, "Ivan must begin local Atlas registration")
	_game_state.call("discover_poi", "awakening", "Cuenca del Despertar")
	await process_frame
	_game_state.call("discover_poi", "initial_village", "Aldea del Alba")
	await process_frame
	if _quest_state() == 6:
		_event_bus.emit_signal("npc_interacted", "ivan")
		await process_frame
	_require(_quest_state() == 7, "Cuenca + Aldea must activate Prisma-Atlas routes")
	_require(bool(_game_state.call("has_world_flag", "atlas_boot")), "atlas_boot flag must persist")

	# Lago route: observation + habitat + voluntary bond + Val assessment.
	_event_bus.emit_signal("npc_interacted", "val")
	_event_bus.emit_signal("npc_interacted", "rola")
	_event_bus.emit_signal("npc_interacted", "mela")
	await process_frame
	_require(bool(_game_state.call("has_world_flag", "lake_habitat_observed")), "Val/Rola/Mela must unlock habitat reading")
	_game_state.call("set_world_flag", "lake_habitat_stable", true)
	var captured := bool(_game_state.call("capture_familiar", "carpinchito_cristal", "Carpinchito de Cristal", "impacto", "fermin"))
	_require(captured, "Carpinchito must form first common Familiar bond")
	await process_frame
	_require(bool(_game_state.call("has_world_flag", "familiar_first_bond")), "First Familiar bond flag must persist")
	_event_bus.emit_signal("npc_interacted", "val")
	await process_frame
	_require(bool(_game_state.call("has_world_flag", "route_lake_complete")), "Val assessment must complete Lake route")
	var familiar: Dictionary = _game_state.call("familiar_data", "carpinchito_cristal")
	_require(bool(familiar.get("assessed", false)), "Val must assess first Familiar")
	_require(str(familiar.get("affinity", "")) == "impacto", "Carpinchito affinity must be Impacto")
	_require(str(familiar.get("mentor_id", "")) == "fermin", "Carpinchito recommended mentor must be Fermín")

	# Ruins route may occur before or after Lake; here it completes second.
	_game_state.call("discover_lore", "lore_ivan_calc_17b", "Hoja de cálculo 17-B", 9)
	await process_frame
	_require(bool(_game_state.call("has_world_flag", "route_ruins_complete")), "Hoja 17-B must complete Ruins route")
	_require(_quest_state() == 8, "Lake + Ruins must converge on Sanctuary")

	# Sanctuary then Boss 5 physical defeat / purge separation.
	_event_bus.emit_signal("enemy_defeated", "custodio_raices_menor", 0, Vector2.ZERO)
	await process_frame
	_require(_quest_state() == 9, "Custodio must open Boss 5")
	_game_state.call("set_world_flag", "boss5_physical_defeated", true)
	await process_frame
	_require(_quest_state() == 10, "Physical Boss 5 victory must NOT finish encounter")
	_require(not bool(_game_state.call("has_world_flag", "boss5_purged")), "Boss cannot be treated as purged before interaction")
	_game_state.call("set_world_flag", "boss5_purged", true)
	await process_frame
	_require(_quest_state() == 11, "Boss purge must unlock bridge second-reading stage")
	_require(bool(_game_state.get("prism_step_unlocked")), "Boss purge must unlock Paso Prismático")

	# Gustavo second reading -> Refugio -> mentor choice -> shared trial.
	_event_bus.emit_signal("npc_interacted", "gustavo")
	await process_frame
	_require(_quest_state() == 12, "Second bridge reading must make Refugio the main objective")
	_event_bus.emit_signal("npc_interacted", "elida")
	await process_frame
	_require(_quest_state() == 13, "Elida must open mentor choice")
	_event_bus.emit_signal("npc_interacted", "ashley")
	await process_frame
	_require(_quest_state() == 14, "Mentor choice must open shared mentor trial")
	_require(str(_game_state.get("selected_mentor")) == "ashley", "Selected mentor must persist")
	_quest_manager.call("complete_mentor_trial", "ashley")
	await process_frame
	_require(_quest_state() == 15, "Mentor trial must close Golden demo arc")
	_require(bool(_game_state.call("has_world_flag", "mentor_first_solution")), "Mentor solution flag must persist")

	# Save/load v3.6: canonical flags, 3-tail stage, familiar, quest.
	_character_profile.call("configure", "QA Viajero", 2, 4, 3, 2, 1)
	_game_state.call("set_last_world_position", Vector2(912, 1536))
	var saved := bool(_save_service.call("save_game", {"intro_seen": true, "qa_v36": true}))
	_require(saved, "SaveService must write v3.6 smoke save")

	_game_state.call("reset_new_game")
	_inventory_service.call("reset")
	_character_profile.call("reset_default")
	var payload: Dictionary = _save_service.call("load_game")
	_require(not payload.is_empty(), "SaveService must load v3.6 smoke save")
	_require(str(_character_profile.get("player_name")) == "QA Viajero", "CharacterProfile must survive save/load")
	_require(int(_game_state.get("xethkioz_tail_stage")) == 3, "Xethkioz tail stage must survive save/load")
	_require(bool(_game_state.call("has_world_flag", "boss5_purged")), "Boss purge flag must survive save/load")
	_require(bool(_game_state.call("has_world_flag", "atlas_boot")), "Prisma-Atlas boot must survive save/load")
	var restored_position: Vector2 = _game_state.get("last_world_position")
	_require(restored_position.distance_to(Vector2(912, 1536)) < 0.1, "World position must survive save/load")
	var quest_snapshot: Dictionary = _game_state.call("get_quest_snapshot")
	_require(str(quest_snapshot.get("schema", "")) == "golden_v36", "Quest snapshot must use v3.6 schema")
	_require(int(quest_snapshot.get("state", -1)) == 15, "v3.6 quest state must survive save/load")
	familiar = _game_state.call("familiar_data", "carpinchito_cristal")
	_require(bool(familiar.get("assessed", false)), "Familiar assessment must survive save/load")

	_save_service.call("delete_save")
	if _failed:
		push_error("V3.6 progression/save smoke FAILED")
		quit(1)
		return
	print("V3.6 progression/save smoke PASSED · canonical prologue · Atlas branches · voluntary Familiar · Boss purge · mentor trial · save round-trip OK")
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
	push_error("V3.6 SMOKE: %s" % message)

func _fail(message: String) -> void:
	_failed = true
	push_error("V3.6 SMOKE: %s" % message)
