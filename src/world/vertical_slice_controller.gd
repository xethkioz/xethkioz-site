extends Node2D

const PlayerScript = preload("res://src/player/player_controller.gd")
const EnemyScript = preload("res://src/npc/enemy_controller.gd")
const NpcScript = preload("res://src/npc/npc_interactable.gd")
const PetScript = preload("res://src/pets/xethkioz_companion.gd")
const HudScript = preload("res://src/ui/hud_controller.gd")
const QuestScript = preload("res://src/quest/quest_manager.gd")
const ClockScript = preload("res://src/world/world_clock.gd")
const WeatherScript = preload("res://src/world/weather_controller.gd")
const GatherableScript = preload("res://src/world/gatherable.gd")
const CraftingStationScript = preload("res://src/world/crafting_station.gd")

var player: CharacterBody2D
var fog_overlay: ColorRect
var night_overlay: ColorRect

func _ready() -> void:
	_ensure_inputs()
	_build_greybox_world()
	_spawn_player()
	_spawn_xethkioz()
	_spawn_npcs()
	_spawn_resources()
	_spawn_enemies()
	_spawn_systems()
	EventBus.weather_changed.connect(_on_weather_changed)
	EventBus.time_changed.connect(_on_time_changed)
	EventBus.toast_requested.emit("Vertical Slice v3.3 — Cuenca del Despertar")

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
			var event := InputEventKey.new()
			event.physical_keycode = keycode
			InputMap.action_add_event(action, event)

func _build_greybox_world() -> void:
	var background := ColorRect.new()
	background.position = Vector2.ZERO
	background.size = Vector2(1280, 720)
	background.color = Color("1c322d")
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	background.z_index = -50
	add_child(background)
	_add_zone(Rect2(40, 70, 330, 220), Color("29493d"), "Cuenca del Despertar")
	_add_zone(Rect2(430, 60, 300, 250), Color("244958"), "Lago Encantado")
	_add_zone(Rect2(760, 80, 430, 260), Color("3f3a34"), "Ruinas vivas")
	_add_zone(Rect2(260, 380, 440, 250), Color("273c31"), "Bosque alterado")
	_add_zone(Rect2(760, 400, 360, 220), Color("312d39"), "Entrada de dungeon")
	_add_landmark(Vector2(165, 165), "Refugio / primer pueblo", Color("ffb56b"))
	_add_landmark(Vector2(560, 165), "Lago Encantado", Color("6ed4e8"))
	_add_landmark(Vector2(930, 495), "Cueva visible — cerrada", Color("b18cff"))
	_add_landmark(Vector2(1060, 220), "Ruta hacia Boss 5", Color("ff6b6b"))
	_add_boundaries()
	fog_overlay = ColorRect.new()
	fog_overlay.position = Vector2.ZERO
	fog_overlay.size = Vector2(1280, 720)
	fog_overlay.color = Color(0.62, 0.72, 0.82, 0.0)
	fog_overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE
	fog_overlay.z_index = 40
	add_child(fog_overlay)
	night_overlay = ColorRect.new()
	night_overlay.position = Vector2.ZERO
	night_overlay.size = Vector2(1280, 720)
	night_overlay.color = Color(0.08, 0.10, 0.24, 0.0)
	night_overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE
	night_overlay.z_index = 39
	add_child(night_overlay)

func _add_zone(rect: Rect2, color: Color, label_text: String) -> void:
	var zone := ColorRect.new()
	zone.position = rect.position
	zone.size = rect.size
	zone.color = color
	zone.mouse_filter = Control.MOUSE_FILTER_IGNORE
	zone.z_index = -30
	add_child(zone)
	var label := Label.new()
	label.position = rect.position + Vector2(10, 8)
	label.text = label_text
	label.add_theme_font_size_override("font_size", 10)
	label.add_theme_color_override("font_color", Color(0.9,0.93,0.9,0.75))
	label.z_index = -20
	add_child(label)

func _add_landmark(pos: Vector2, text: String, color: Color) -> void:
	var marker := Polygon2D.new()
	marker.position = pos
	marker.polygon = PackedVector2Array([Vector2(0,-8), Vector2(7,0), Vector2(0,8), Vector2(-7,0)])
	marker.color = color
	add_child(marker)
	var label := Label.new()
	label.position = pos + Vector2(12, -8)
	label.text = text
	label.add_theme_font_size_override("font_size", 9)
	label.add_theme_color_override("font_color", Color("f0f0f5"))
	add_child(label)

func _add_boundaries() -> void:
	_add_wall(Rect2(-20, -20, 1320, 20))
	_add_wall(Rect2(-20, 720, 1320, 20))
	_add_wall(Rect2(-20, 0, 20, 720))
	_add_wall(Rect2(1280, 0, 20, 720))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var shape_node := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	shape_node.shape = shape
	body.add_child(shape_node)
	add_child(body)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(PlayerScript)
	player.position = Vector2(190, 210)
	var shape_node := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 7.0
	capsule.height = 18.0
	shape_node.shape = capsule
	player.add_child(shape_node)
	var camera := Camera2D.new()
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 8.0
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = 1280
	camera.limit_bottom = 720
	player.add_child(camera)
	add_child(player)

func _spawn_xethkioz() -> void:
	var pet := Node2D.new()
	pet.name = "Xethkioz"
	pet.set_script(PetScript)
	pet.position = Vector2(165, 225)
	add_child(pet)

func _spawn_npcs() -> void:
	_spawn_npc("alexis", "Alexis", Vector2(250, 185), ["El bosque está cambiando. Necesito saber qué está alterando sus raíces."], Color("d58d5b"))
	_spawn_npc("ivan", "Ivan", Vector2(320, 240), ["El Prisma-Atlas todavía es un prototipo. Cada anomalía que registremos lo vuelve más preciso."], Color("74a7d8"))
	_spawn_npc("val", "Val", Vector2(560, 185), ["El lago calma a las criaturas. Cuando estés listo, te enseñaré a reconocer un vínculo verdadero."], Color("79b99a"))

func _spawn_npc(id_value: String, display_name: String, pos: Vector2, lines: Array[String], color: Color) -> void:
	var npc := Node2D.new()
	npc.name = display_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure(id_value, display_name, lines, color)
	add_child(npc)

func _spawn_resources() -> void:
	_spawn_gatherable("manzana_bruma", Vector2(105, 250), Color("b8d98a"))
	_spawn_gatherable("manzana_bruma", Vector2(305, 285), Color("b8d98a"))
	_spawn_gatherable("manzana_bruma", Vector2(455, 250), Color("b8d98a"))
	_spawn_gatherable("hongo_azul_rocio", Vector2(505, 215), Color("75b9e8"))
	var station := Node2D.new()
	station.name = "FogonRefugio"
	station.set_script(CraftingStationScript)
	station.position = Vector2(125, 205)
	add_child(station)

func _spawn_gatherable(item_id: String, pos: Vector2, color: Color) -> void:
	var gatherable := Node2D.new()
	gatherable.name = item_id
	gatherable.set_script(GatherableScript)
	gatherable.position = pos
	gatherable.configure(item_id, 1, "botanica", 3, color)
	add_child(gatherable)

func _spawn_enemies() -> void:
	var positions := [Vector2(420, 390), Vector2(520, 470), Vector2(660, 410), Vector2(870, 300), Vector2(1010, 360)]
	for i in positions.size():
		var enemy := CharacterBody2D.new()
		enemy.name = "BroteGoblin_%d" % i
		enemy.collision_layer = 2
		enemy.collision_mask = 1 | 4
		enemy.set_script(EnemyScript)
		enemy.position = positions[i]
		var shape_node := CollisionShape2D.new()
		var shape := CircleShape2D.new()
		shape.radius = 9.0
		shape_node.shape = shape
		enemy.add_child(shape_node)
		add_child(enemy)

func _spawn_systems() -> void:
	var quest := Node.new()
	quest.name = "QuestManager"
	quest.set_script(QuestScript)
	add_child(quest)
	var clock := Node.new()
	clock.name = "WorldClock"
	clock.set_script(ClockScript)
	add_child(clock)
	var weather := Node.new()
	weather.name = "WeatherController"
	weather.set_script(WeatherScript)
	add_child(weather)
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudScript)
	add_child(hud)

func _on_weather_changed(weather_id: String) -> void:
	if fog_overlay:
		fog_overlay.color.a = 0.17 if weather_id == "bruma_prismatica" else 0.0

func _on_time_changed(hour: float) -> void:
	if night_overlay:
		var darkness := 0.28 if hour >= 19.0 or hour < 6.0 else 0.0
		night_overlay.color.a = darkness
