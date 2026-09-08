extends Node2D

const BACKGROUND := preload("res://assets/production/interiors/refugio_elida.svg")
const PlayerScript := preload("res://src/player/player_controller_production.gd")
const XethkiozScript := preload("res://src/pets/xethkioz_companion_production.gd")
const FamiliarScript := preload("res://src/pets/familiar_companion_production.gd")
const StoryNpcScript := preload("res://src/npc/story_npc_v36.gd")
const QuestScript := preload("res://src/quest/quest_manager_v36.gd")
const HudScript := preload("res://src/ui/hud_controller.gd")
const PromptScript := preload("res://src/ui/interaction_prompt.gd")
const PortalScript := preload("res://src/world/scene_portal.gd")
const HotspotScript := preload("res://src/world/interior_hotspot.gd")
const CraftingScript := preload("res://src/world/interior_crafting_spot.gd")

const EXTERIOR_RETURN := Vector2(832, 1744)

var player: CharacterBody2D
var _active_familiar: Node2D

func _ready() -> void:
	_ensure_inputs()
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
	_spawn_story_npc("elida", "Elida", Vector2(320, 145), 1, "Sentate.")
	_spawn_story_npc("gael", "Gael", Vector2(174, 242), 5, "Hay cosas que se ven mejor cuando dejás de mirar el centro.")
	_spawn_story_npc("fermin", "Fermín", Vector2(238, 244), 3, "Yo sí te voy a enseñar a pegar más fuerte.")
	_spawn_story_npc("ashley", "Ashley", Vector2(292, 244), 2, "Elegir ritmo también es elegir cuándo no atacar.")
	_spawn_story_npc("isabella", "Isabella", Vector2(388, 244), 4, "Puedo hacer que algo explote después.")
	_spawn_story_npc("alexis", "Alexis", Vector2(458, 242), 0, "Afuera aprendés el mundo. Acá ordenás lo que aprendiste.")

func _spawn_story_npc(id_value: String, display_name: String, pos: Vector2, atlas_index: int, fallback_line: String) -> Node2D:
	var npc := Node2D.new()
	npc.name = "StoryNPC_%s" % id_value
	npc.set_script(StoryNpcScript)
	npc.position = pos
	npc.configure_story(id_value, display_name, atlas_index, fallback_line)
	add_child(npc)
	return npc

func _spawn_hotspots() -> void:
	var archive := Node2D.new()
	archive.name = "ArchivoElida"
	archive.set_script(HotspotScript)
	archive.position = Vector2(122, 122)
	archive.label_text = "Revisar archivo"
	archive.speaker = "Archivo de Elida"
	archive.body = "Cartas, recetas y mapas viejos conviven con anotaciones posteriores a la Fisura. Algunas historias de ríos y raíces describen los mismos fenómenos que Ivan registra con instrumentos."
	add_child(archive)

	var alchemy := Node2D.new()
	alchemy.name = "MesaAlquimia"
	alchemy.set_script(HotspotScript)
	alchemy.position = Vector2(126, 266)
	alchemy.label_text = "Mesa de alquimia"
	alchemy.speaker = "Elida"
	alchemy.body = "Las mezclas de Elida no reemplazan la exploración: cada receta nace de materiales y observaciones que el Viajero trae de afuera."
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
