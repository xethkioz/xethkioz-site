class_name IzrdralarStoryLayer
extends Node

const LoreScript := preload("res://src/world/lore_interactable_production.gd")
const GatherableScript := preload("res://src/world/gatherable_production.gd")
const CaptureScript := preload("res://src/pets/izrdralar_story_capture.gd")
const FamiliarScript := preload("res://src/pets/familiar_companion_production.gd")
const PuzzleScript := preload("res://src/world/izrdralar_resonance_toggle.gd")

var runtime: Node
var map_data: Dictionary = {}
var map_id := "M01"
var player: Node2D
var _active_familiar: Node2D
var _quest_signature := ""
var _quest_poll_left := 0.0

func _ready() -> void:
	call_deferred("_initialize")

func _process(delta: float) -> void:
	if runtime == null:
		return
	_quest_poll_left -= delta
	if _quest_poll_left <= 0.0:
		_quest_poll_left = 0.25
		_refresh_derived_flags()
		_update_quest()

func _initialize() -> void:
	runtime = get_parent()
	if runtime == null:
		return
	var raw_map_data: Variant = runtime.get("map_data")
	if raw_map_data is Dictionary:
		map_data = (raw_map_data as Dictionary).duplicate(true)
	map_id = str(runtime.get("map_id"))
	player = runtime.get("player") as Node2D
	_spawn_lore()
	_spawn_resources()
	_spawn_puzzles()
	_spawn_capture_targets()
	_spawn_active_familiar()
	if not EventBus.enemy_defeated.is_connected(_on_enemy_defeated):
		EventBus.enemy_defeated.connect(_on_enemy_defeated)
	if not EventBus.familiar_captured.is_connected(_on_familiar_captured):
		EventBus.familiar_captured.connect(_on_familiar_captured)
	_refresh_derived_flags()
	_update_quest(true)

func _spawn_lore() -> void:
	for lore_value in map_data.get("lore", []):
		if not (lore_value is Dictionary):
			continue
		var data: Dictionary = lore_value
		var lore := Node2D.new()
		lore.name = "Lore_%s" % str(data.get("id", "pista"))
		lore.set_script(LoreScript)
		lore.position = _vector_from_array(data.get("position", [0, 0]))
		var color_value := str(data.get("accent", "#8b5cf6"))
		lore.call(
			"configure",
			str(data.get("id", "pista")),
			str(data.get("title", "Pista")),
			str(data.get("speaker", "Registro")),
			str(data.get("body", "")),
			Color(color_value),
			int(data.get("total_hint", 8))
		)
		runtime.add_child(lore)

func _spawn_resources() -> void:
	for resource_value in map_data.get("resources", []):
		if not (resource_value is Dictionary):
			continue
		var data: Dictionary = resource_value
		var resource := Node2D.new()
		resource.name = "Resource_%s" % str(data.get("id", "item"))
		resource.set_script(GatherableScript)
		resource.position = _vector_from_array(data.get("position", [0, 0]))
		resource.call(
			"configure_production",
			str(data.get("id", "manzana_bruma")),
			int(data.get("amount", 1)),
			str(data.get("profession", "botanica")),
			int(data.get("xp", 3)),
			int(data.get("atlas", 0))
		)
		runtime.add_child(resource)

func _spawn_puzzles() -> void:
	for puzzle_value in map_data.get("resonance_toggles", []):
		if not (puzzle_value is Dictionary):
			continue
		var data: Dictionary = puzzle_value
		var toggle := Node2D.new()
		toggle.name = "Puzzle_%s_%s" % [str(data.get("puzzle_id", "puzzle")), str(data.get("id", "node"))]
		toggle.set_script(PuzzleScript)
		toggle.position = _vector_from_array(data.get("position", [0, 0]))
		toggle.call("configure", data)
		runtime.add_child(toggle)

func _spawn_capture_targets() -> void:
	for capture_value in map_data.get("capture_targets", []):
		if not (capture_value is Dictionary):
			continue
		var data: Dictionary = capture_value
		var species_id := str(data.get("id", "creature"))
		if GameState.has_familiar(species_id):
			continue
		var creature := Node2D.new()
		creature.name = "Capture_%s" % species_id
		creature.set_script(CaptureScript)
		creature.position = _vector_from_array(data.get("position", [0, 0]))
		creature.call("configure_story", data)
		runtime.add_child(creature)

func _spawn_active_familiar() -> void:
	if GameState.active_familiar_id.is_empty() or not GameState.has_familiar(GameState.active_familiar_id):
		return
	if is_instance_valid(_active_familiar):
		return
	if not is_instance_valid(player):
		player = runtime.get("player") as Node2D
	if not is_instance_valid(player):
		return
	var familiar_data := GameState.active_familiar_data()
	_active_familiar = Node2D.new()
	_active_familiar.name = "FamiliarActivo"
	_active_familiar.set_script(FamiliarScript)
	_active_familiar.position = player.position + Vector2(-24, 24)
	_active_familiar.call(
		"configure",
		GameState.active_familiar_id,
		str(familiar_data.get("display_name", "Familiar")),
		Color("8fc6a9")
	)
	runtime.add_child(_active_familiar)

func _on_familiar_captured(species_id: String, _display_name: String) -> void:
	if species_id == "carpinchito_cristal":
		_refresh_derived_flags()
		SaveService.save_game({"story_event": "first_familiar_bond"})
	call_deferred("_spawn_active_familiar")
	_update_quest(true)

func _on_enemy_defeated(enemy_id: String, _xp: int, _world_position: Vector2) -> void:
	var changed := false
	if map_id == "M01":
		if enemy_id == "brote_goblin":
			changed = _set_flag_once("m01_brote_defeated") or changed
		elif enemy_id == "slime_prismatico":
			changed = _set_flag_once("m01_slime_defeated") or changed
	elif map_id == "M04" and enemy_id == "custodio_raices_menor":
		changed = _set_flag_once("custodio_raices_defeated") or changed
	if _refresh_derived_flags():
		changed = true
	if changed:
		SaveService.save_game({"story_enemy": enemy_id})
	_update_quest(true)

func _refresh_derived_flags() -> bool:
	var changed := false
	if GameState.has_world_flag("m01_brote_defeated") and GameState.has_world_flag("m01_slime_defeated"):
		changed = _set_flag_once("m01_survived_opening") or changed
	if GameState.has_world_flag("carpinchito_habitat_ready") and GameState.has_familiar("carpinchito_cristal"):
		changed = _set_flag_once("m03_lake_ready") or changed
	if GameState.has_world_flag("sanctuary_puzzle_ready") and GameState.has_world_flag("custodio_raices_defeated"):
		changed = _set_flag_once("m04_sanctuary_ready") or changed
	return changed

func _set_flag_once(flag_id: String) -> bool:
	if GameState.has_world_flag(flag_id):
		return false
	GameState.set_world_flag(flag_id)
	return true

func _update_quest(force := false) -> void:
	var quest := _quest_for_state()
	var signature := "%s|%s|%s" % [str(quest.get("title", "")), str(quest.get("objective", "")), str(quest.get("completed", false))]
	if not force and signature == _quest_signature:
		return
	_quest_signature = signature
	EventBus.quest_changed.emit(str(quest.get("title", "Izrdralar")), str(quest.get("objective", "")), bool(quest.get("completed", false)))

func _quest_for_state() -> Dictionary:
	match map_id:
		"M01":
			if not GameState.has_world_flag("m01_survived_opening"):
				return {"title":"El Despertar", "objective":"Sobreviví: derrotá al Brote Goblin y al Slime Prismático.", "completed":false}
			if not GameState.has_world_flag("opening_flow_complete"):
				return {"title":"Eco del Despertar", "objective":"Examiná la Resonancia junto a las ruinas de 2150.", "completed":false}
			return {"title":"Aldea del Alba", "objective":"Seguí el rastro de Xethkioz hacia la Aldea.", "completed":false}
		"M02":
			if not GameState.has_world_flag("prisma_atlas_unlocked"):
				return {"title":"Prisma-Atlas I-01", "objective":"Hablá con Iván y sincronizá el Atlas.", "completed":false}
			if not GameState.has_world_flag("lake_resolved") and not GameState.has_world_flag("ruins_sanctuary_resolved"):
				return {"title":"Dos resonancias", "objective":"Elegí qué investigar primero: Lago Encantado o Ruinas Vivas.", "completed":false}
			if not GameState.has_world_flag("lake_resolved"):
				return {"title":"Dos resonancias", "objective":"La ruta de Ruinas está resuelta. Investigá ahora el Lago Encantado.", "completed":false}
			if not GameState.has_world_flag("ruins_sanctuary_resolved"):
				return {"title":"Dos resonancias", "objective":"La ruta del Lago está resuelta. Investigá ahora Ruinas y Santuario.", "completed":false}
			return {"title":"Corazón del Bosque", "objective":"Las dos rutas convergen. Buscá el acceso al Corazón del Bosque Velado.", "completed":false}
		"M03":
			if not GameState.has_world_flag("carpinchito_habitat_ready"):
				return {"title":"Primer vínculo", "objective":"Apagá dos focos prismáticos y dejá uno activo para estabilizar el hábitat.", "completed":false}
			if not GameState.has_familiar("carpinchito_cristal"):
				return {"title":"Primer vínculo", "objective":"Conseguí una Manzana de Bruma y acercate al Carpinchito sin forzar el vínculo.", "completed":false}
			if not GameState.has_world_flag("lake_resolved"):
				return {"title":"Piedra Resonante", "objective":"Registrá en el Prisma-Atlas el segundo latido del Lago.", "completed":false}
			return {"title":"Lago Encantado", "objective":"La frecuencia quedó registrada. Volvé a la Aldea o continuá si la otra ruta ya está resuelta.", "completed":true}
		"M04":
			if not GameState.has_world_flag("sanctuary_puzzle_ready"):
				return {"title":"Raíces que beben luz", "objective":"Orientá los cristales para liberar los canales del Santuario.", "completed":false}
			if not GameState.has_world_flag("custodio_raices_defeated"):
				return {"title":"Custodio de Raíz", "objective":"Derrotá al Custodio que mantiene cortada la Resonancia.", "completed":false}
			if not GameState.has_world_flag("ruins_sanctuary_resolved"):
				return {"title":"Núcleo del Santuario", "objective":"Estabilizá el Núcleo y fijá la segunda ruta en el Prisma-Atlas.", "completed":false}
			return {"title":"Santuario de las Raíces", "objective":"La ruta quedó fijada. Volvé a la Aldea o continuá si el Lago ya está resuelto.", "completed":true}
		"M05":
			if not GameState.has_world_flag("boss5_defeated"):
				return {"title":"Corazón del Bosque", "objective":"Derrotá al Guardián del Bosque Velado. Leé el terreno y sus telegraphs.", "completed":false}
			if not GameState.has_world_flag("boss5_stabilized"):
				return {"title":"ESTABILIZAR", "objective":"El Guardián cayó. Interactuá con el Corazón para estabilizarlo.", "completed":false}
			return {"title":"Paso Prismático", "objective":"El Corazón vuelve a latir con Izrdralar. La siguiente ruta queda preparada.", "completed":true}
		_:
			return {"title":"Izrdralar", "objective":"Explorá la Resonancia.", "completed":false}

func _vector_from_array(value: Variant) -> Vector2:
	if value is Array and value.size() >= 2:
		return Vector2(float(value[0]), float(value[1]))
	return Vector2.ZERO
