extends Node2D

const PlayerScript = preload("res://src/player/player_controller.gd")
const EnemyScript = preload("res://src/npc/enemy_controller.gd")
const NpcScript = preload("res://src/npc/npc_interactable.gd")
const PetScript = preload("res://src/pets/xethkioz_companion.gd")
const FamiliarScript = preload("res://src/pets/familiar_companion.gd")
const CapturableScript = preload("res://src/pets/capturable_creature.gd")
const HudScript = preload("res://src/ui/hud_controller.gd")
const QuestScript = preload("res://src/quest/quest_manager.gd")
const ClockScript = preload("res://src/world/world_clock.gd")
const WeatherScript = preload("res://src/world/weather_controller.gd")
const GatherableScript = preload("res://src/world/gatherable.gd")
const CraftingStationScript = preload("res://src/world/crafting_station.gd")
const LoreScript = preload("res://src/world/lore_interactable.gd")

var player: CharacterBody2D
var fog_overlay: ColorRect
var night_overlay: ColorRect
var active_familiar: Node2D

func _ready() -> void:
	_ensure_inputs()
	_build_greybox_world()
	_spawn_player()
	_spawn_xethkioz()
	_spawn_active_familiar_if_any()
	_spawn_npcs()
	_spawn_resources()
	_spawn_lore_seeds()
	_spawn_capturable_creatures()
	_spawn_enemies()
	_spawn_systems()
	EventBus.weather_changed.connect(_on_weather_changed)
	EventBus.time_changed.connect(_on_time_changed)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.toast_requested.emit("Izrdralar · Cuenca del Despertar")

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

func _spawn_active_familiar_if_any() -> void:
	if GameState.active_familiar_id.is_empty():
		return
	var data := GameState.active_familiar_data()
	if data.is_empty():
		return
	_spawn_familiar_companion(GameState.active_familiar_id, str(data.get("display_name", "Familiar")))

func _spawn_familiar_companion(species_id: String, display_name: String) -> void:
	if is_instance_valid(active_familiar):
		active_familiar.queue_free()
	active_familiar = Node2D.new()
	active_familiar.name = "Familiar_%s" % species_id
	active_familiar.set_script(FamiliarScript)
	active_familiar.position = player.position + Vector2(-26, 24)
	active_familiar.configure(species_id, display_name, _familiar_color(species_id))
	add_child(active_familiar)

func _familiar_color(species_id: String) -> Color:
	match species_id:
		"carpinchito_cristal":
			return Color("8fd3c1")
		_:
			return Color("9fd6c0")

func _spawn_npcs() -> void:
	_spawn_npc(
		"alexis",
		"Alexis",
		Vector2(250, 185),
		["El bosque está cambiando. Necesito saber qué está alterando sus raíces."],
		Color("d58d5b"),
		[
			{"lore_id": "marca_tiempo_primigenio", "line": "Eso no es un reloj. Si vuelve a latir cuando Xethkioz se acerca, no lo fuerces. Hay cosas viejas que aprendí a no despertar."},
			{"lore_id": "nota_elida_raices", "line": "Elida escribió eso hace años. Pensé que hablaba en sentido figurado. Ahora no estoy tan seguro."}
		]
	)
	_spawn_npc(
		"ivan",
		"Ivan",
		Vector2(320, 240),
		["El Prisma-Atlas todavía es un prototipo. Cada anomalía que registremos lo vuelve más preciso."],
		Color("74a7d8"),
		[
			{"lore_id": "marca_tiempo_primigenio", "line": "Ese pulso no coincide con ningún reloj local. Guardé la frecuencia. No vuelvas a tocarlo hasta que pueda medir qué está intentando sincronizar."},
			{"lore_id": "carta_ivan_cielo", "line": "Encontraste mis cálculos viejos. Lo inquietante no es que haya energía arriba: es que la lectura se comporta como si existiera territorio donde nuestros instrumentos ven vacío."}
		]
	)
	_spawn_npc(
		"val",
		"Val",
		Vector2(545, 180),
		["El lago calma a las criaturas. Cuando estés listo, te enseñaré a reconocer un vínculo verdadero."],
		Color("79b99a"),
		[
			{"lore_id": "eco_lago", "line": "Ese segundo latido no era tuyo ni de Xethkioz. Recordalo: una resonancia puede parecer un vínculo y aun así estar imitando algo vivo."}
		]
	)
	_spawn_npc(
		"rola",
		"Rola",
		Vector2(605, 155),
		["Vi un Carpinchito de Cristal cerca de la orilla. No lo corras. Con una Manzana de Bruma suele acercarse solo."],
		Color("9ab6cf")
	)
	_spawn_npc(
		"mela",
		"Mela",
		Vector2(600, 205),
		["Primero dejá que te mire. Si Xethkioz no se pone tenso, la criatura tampoco debería asustarse."],
		Color("c7a0cf")
	)

func _spawn_npc(id_value: String, display_name: String, pos: Vector2, lines: Array[String], color: Color, rules: Array = []) -> void:
	var npc := Node2D.new()
	npc.name = display_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure(id_value, display_name, lines, color, rules)
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

func _spawn_capturable_creatures() -> void:
	if GameState.has_familiar("carpinchito_cristal"):
		return
	var creature := Node2D.new()
	creature.name = "CarpinchitoCristal"
	creature.set_script(CapturableScript)
	creature.position = Vector2(690, 205)
	creature.configure("carpinchito_cristal", "Carpinchito de Cristal", "impacto", "fermin", "manzana_bruma", Color("8fd3c1"))
	add_child(creature)

func _spawn_lore_seeds() -> void:
	_spawn_lore(
		"nota_elida_raices",
		"Nota doblada",
		"Elida",
		"Las raíces viejas recuerdan caminos que nadie cavó. Si un día dejan de beber agua y empiezan a beber luz, no las sigan solos.",
		Vector2(205, 140),
		Color("ffb56b")
	)
	_spawn_lore(
		"eco_lago",
		"Piedra resonante",
		"Lago Encantado",
		"La piedra está tibia. Al tocarla aparece un segundo latido: no pertenece al Viajero ni a Xethkioz, y desaparece apenas intentás seguirlo.",
		Vector2(650, 265),
		Color("6ed4e8")
	)
	_spawn_lore(
		"carta_ivan_cielo",
		"Hoja de cálculo",
		"Apuntes de Ivan",
		"Lectura 17-B: la anomalía no desciende. Una señal gemela asciende por encima de las nubes y mantiene masa aparente donde el radar insiste en marcar vacío.",
		Vector2(835, 145),
		Color("74a7d8")
	)
	_spawn_lore(
		"marca_tiempo_primigenio",
		"Reloj sin agujas",
		"Objeto desconocido",
		"No tiene agujas ni óxido. Cada ocho segundos emite un pulso que hace retroceder a Xethkioz. El sonido parece llegar una fracción antes de que el objeto vibre.",
		Vector2(1050, 170),
		Color("b18cff")
	)
	_spawn_lore(
		"cartel_descenso",
		"Cartel de mantenimiento",
		"Señal oxidada",
		"ACCESO SELLADO. Riesgo de presión y pérdida de orientación. Las galerías continúan descendiendo más allá del último nivel cartografiado.",
		Vector2(890, 500),
		Color("c7a56a")
	)

func _spawn_lore(id_value: String, title_value: String, speaker_value: String, body_value: String, pos: Vector2, color: Color) -> void:
	var clue := Node2D.new()
	clue.name = id_value
	clue.set_script(LoreScript)
	clue.position = pos
	clue.configure(id_value, title_value, speaker_value, body_value, color, 5)
	add_child(clue)

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

func _on_familiar_captured(species_id: String, display_name: String) -> void:
	_spawn_familiar_companion(species_id, display_name)

func _on_weather_changed(weather_id: String) -> void:
	if fog_overlay:
		fog_overlay.color.a = 0.17 if weather_id == "bruma_prismatica" else 0.0

func _on_time_changed(hour: float) -> void:
	if night_overlay:
		var darkness := 0.28 if hour >= 19.0 or hour < 6.0 else 0.0
		night_overlay.color.a = darkness
