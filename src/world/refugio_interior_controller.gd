extends Node2D

const BACKGROUND := preload("res://assets/production/interiors/refugio_elida.svg")
const PlayerScript := preload("res://src/player/player_controller_production.gd")
const XethkiozScript := preload("res://src/pets/xethkioz_companion_production.gd")
const FamiliarScript := preload("res://src/pets/familiar_companion_production.gd")
const NpcScript := preload("res://src/npc/npc_interactable_production.gd")
const QuestScript := preload("res://src/quest/quest_manager.gd")
const HudScript := preload("res://src/ui/hud_controller.gd")
const PromptScript := preload("res://src/ui/interaction_prompt.gd")
const PortalScript := preload("res://src/world/scene_portal.gd")
const HotspotScript := preload("res://src/world/interior_hotspot.gd")
const CraftingScript := preload("res://src/world/interior_crafting_spot.gd")
const TrainingCoreScript := preload("res://src/npc/training_core_production.gd")

const EXTERIOR_RETURN := Vector2(832, 1744)
const TRAINING_STATE := 11

var player: CharacterBody2D
var _active_familiar: Node2D
var _training_spawned := false

func _ready() -> void:
	_ensure_inputs()
	EventBus.demo_stage_changed.connect(_on_stage_changed)
	_build_background()
	_build_collisions()
	_spawn_player()
	_spawn_xethkioz()
	_spawn_active_familiar()
	_spawn_family()
	_spawn_hotspots()
	_spawn_exit()
	_spawn_ui_and_quest()
	_restore_player()
	EventBus.toast_requested.emit("Refugio de Elida · Zona segura")

func _ensure_inputs() -> void:
	var actions := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"attack": [KEY_J],
		"dash": [KEY_SHIFT],
		"interact": [KEY_C]
	}
	for action in actions.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		for keycode in actions[action]:
			var exists := false
			for current in InputMap.action_get_events(action):
				if current is InputEventKey and current.physical_keycode == keycode:
					exists = true
			if not exists:
				var event := InputEventKey.new()
				event.physical_keycode = keycode
				InputMap.action_add_event(action, event)

func _build_background() -> void:
	var sprite := Sprite2D.new()
	sprite.name = "RefugioBackground"
	sprite.texture = BACKGROUND
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = Vector2(320, 180)
	sprite.z_index = -30
	add_child(sprite)

func _build_collisions() -> void:
	_add_wall(Rect2(34, 32, 572, 20))
	_add_wall(Rect2(34, 32, 14, 290))
	_add_wall(Rect2(592, 32, 14, 290))
	_add_wall(Rect2(34, 322, 270, 18))
	_add_wall(Rect2(336, 322, 270, 18))
	_add_wall(Rect2(264, 45, 112, 78))
	_add_wall(Rect2(62, 76, 126, 82))
	_add_wall(Rect2(452, 76, 126, 82))
	_add_wall(Rect2(62, 177, 92, 47))
	_add_wall(Rect2(486, 177, 92, 47))
	_add_wall(Rect2(277, 186, 86, 43))
	_add_wall(Rect2(73, 248, 106, 42))
	_add_wall(Rect2(469, 246, 102, 45))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(PlayerScript)
	player.position = Vector2(320, 292)
	var collision := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)
	add_child(player)

func _spawn_xethkioz() -> void:
	var pet := Node2D.new()
	pet.name = "Xethkioz"
	pet.set_script(XethkiozScript)
	pet.position = player.position + Vector2(-26, 20)
	add_child(pet)

func _spawn_active_familiar() -> void:
	if GameState.active_familiar_id.is_empty() or not GameState.has_familiar(GameState.active_familiar_id):
		return
	var data := GameState.active_familiar_data()
	_active_familiar = Node2D.new()
	_active_familiar.name = "FamiliarActivo"
	_active_familiar.set_script(FamiliarScript)
	_active_familiar.position = player.position + Vector2(24, 20)
	_active_familiar.configure(GameState.active_familiar_id, str(data.get("display_name", "Familiar")), Color("8fc6a9"))
	add_child(_active_familiar)

func _spawn_family() -> void:
	_spawn_npc("elida", "Elida", Vector2(320, 145), 1, [
		"Acá siempre vas a tener un lugar donde volver. Un refugio no es esconderse: es saber desde dónde podés salir otra vez.",
		"El fogón mantiene caliente la casa y también las ideas. Descansá, prepará algo y hablá con los chicos."
	])
	_spawn_npc("gael", "Gael", Vector2(174, 242), 5, [
		"Desde acá se escucha el bosque distinto. Afuera todo parece más urgente de lo que realmente es."
	])
	_spawn_npc("fermin", "Fermín", Vector2(238, 244), 3, [
		"Impacto no es fuerza sin control. Si querés entrenar al Carpinchito, primero demostrame que sabés cuándo romper una defensa."
	])
	_spawn_npc("ashley", "Ashley", Vector2(292, 244), 2, [
		"La resonancia sirve para escuchar el combate antes de que empiece. Hay ritmos que sólo se entienden cuando dejás de correr."
	])
	_spawn_npc("isabella", "Isabella", Vector2(388, 244), 4, [
		"El caos no siempre está fuera de control. A veces solamente usa reglas que todavía no entendiste."
	])
	_spawn_npc("alexis", "Alexis", Vector2(458, 242), 0, [
		"Elida convirtió este lugar en punto de regreso mucho antes de que nosotros entendiéramos lo importante que iba a ser.",
		"Afuera te enseña el mundo. Acá adentro ordenás lo que aprendiste."
	])

func _spawn_npc(id_value: String, display_name: String, pos: Vector2, atlas_index: int, lines: Array[String]) -> Node2D:
	var npc := Node2D.new()
	npc.name = display_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure_production(id_value, display_name, lines, atlas_index)
	add_child(npc)
	return npc

func _spawn_hotspots() -> void:
	var archive := Node2D.new()
	archive.name = "ArchivoElida"
	archive.set_script(HotspotScript)
	archive.position = Vector2(122, 122)
	archive.label_text = "Revisar archivo"
	archive.speaker = "Archivo de Elida"
	archive.body = "Hay anotaciones de botánica, mezclas, criaturas y mapas incompletos. Varias páginas tienen marcas prismáticas que no estaban en el papel original."
	add_child(archive)

	var alchemy := Node2D.new()
	alchemy.name = "MesaAlquimia"
	alchemy.set_script(HotspotScript)
	alchemy.position = Vector2(126, 266)
	alchemy.label_text = "Mesa de alquimia"
	alchemy.speaker = "Elida"
	alchemy.body = "Todavía no conocés todas las fórmulas. Los ingredientes que traigas del mundo van a abrir nuevas mezclas y mejoras."
	add_child(alchemy)

	var hearth := Node2D.new()
	hearth.name = "FogonCocina"
	hearth.set_script(CraftingScript)
	hearth.position = Vector2(520, 268)
	add_child(hearth)

func _spawn_exit() -> void:
	var portal := Node2D.new()
	portal.name = "SalidaIzrdralar"
	portal.set_script(PortalScript)
	portal.position = Vector2(320, 307)
	portal.target_scene = "res://scenes/v34/GoldenRegion.tscn"
	portal.label_text = "Salir a Izrdralar"
	portal.return_world_position = EXTERIOR_RETURN
	portal.accent_color = Color("ff8c42")
	add_child(portal)

func _spawn_ui_and_quest() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudScript)
	add_child(hud)

	var assist := CanvasLayer.new()
	assist.name = "AssistHUD"
	assist.layer = 20
	add_child(assist)
	var prompt := Control.new()
	prompt.name = "InteractionPrompt"
	prompt.set_script(PromptScript)
	prompt.position = Vector2(218, 218)
	prompt.size = Vector2(204, 24)
	prompt.configure(player)
	assist.add_child(prompt)

	var quests := Node.new()
	quests.name = "QuestManager"
	quests.set_script(QuestScript)
	add_child(quests)

func _restore_player() -> void:
	player.health = player.max_health
	player.mana = player.max_mana
	EventBus.player_health_changed.emit(player.health, player.max_health)
	EventBus.player_mana_changed.emit(player.mana, player.max_mana)

func _on_stage_changed(stage_id: String) -> void:
	if stage_id != "fermin_training":
		return
	var snapshot := GameState.get_quest_snapshot()
	var already_defeated := 0
	if int(snapshot.get("state", -1)) == TRAINING_STATE:
		already_defeated = clampi(int(snapshot.get("training_defeated", 0)), 0, 3)
	_spawn_training_cores(3 - already_defeated)

func _spawn_training_cores(count: int) -> void:
	if _training_spawned or count <= 0:
		return
	_training_spawned = true
	var positions := [Vector2(420, 150), Vector2(448, 188), Vector2(420, 220)]
	for index in range(mini(count, positions.size())):
		var core := CharacterBody2D.new()
		core.name = "NucleoImpacto_%d" % (index + 1)
		core.collision_layer = 2
		core.collision_mask = 1 | 4
		core.set_script(TrainingCoreScript)
		core.position = positions[index]
		var collision := CollisionShape2D.new()
		var shape := CircleShape2D.new()
		shape.radius = 10.0
		collision.shape = shape
		collision.position = Vector2(0, 3)
		core.add_child(collision)
		add_child(core)
	EventBus.toast_requested.emit("Fermín · Prueba de Impacto activa")
