extends Node2D

const ChunkScript := preload("res://src/world/production_chunk.gd")
const PlayerScript := preload("res://src/player/player_controller_production.gd")
const XethkiozScript := preload("res://src/pets/xethkioz_companion_production.gd")
const NpcScript := preload("res://src/npc/npc_interactable_production.gd")
const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")
const HudScript := preload("res://src/ui/hud_controller.gd")
const QuestScript := preload("res://src/quest/quest_manager.gd")
const ClockScript := preload("res://src/world/world_clock.gd")
const WeatherScript := preload("res://src/world/weather_controller.gd")

const MANIFEST_PATH := "res://data/regions/golden_region_v34.json"
const CHUNK_PIXELS := 512
const STREAM_RADIUS := 1

var manifest: Dictionary = {}
var player: CharacterBody2D
var active_chunks: Dictionary = {}
var _stream_timer := 0.0
var _world_size := Vector2(2560, 2048)

func _ready() -> void:
	_ensure_inputs()
	manifest = _load_manifest()
	_spawn_player()
	_spawn_xethkioz()
	_spawn_npcs()
	_spawn_enemies()
	_spawn_systems()
	_add_world_boundaries()
	_update_streaming(true)
	EventBus.toast_requested.emit("Izrdralar · Cuenca del Despertar")

func _process(delta: float) -> void:
	_stream_timer -= delta
	if _stream_timer <= 0.0:
		_stream_timer = 0.18
		_update_streaming(false)

func _load_manifest() -> Dictionary:
	if not FileAccess.file_exists(MANIFEST_PATH):
		push_error("Golden Region manifest missing: %s" % MANIFEST_PATH)
		return {}
	var file := FileAccess.open(MANIFEST_PATH, FileAccess.READ)
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		return parsed
	push_error("Golden Region manifest is invalid JSON")
	return {}

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

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(PlayerScript)
	player.position = _manifest_start_position()
	var collision := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)
	var camera := Camera2D.new()
	camera.name = "WorldCamera"
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 7.5
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(_world_size.x)
	camera.limit_bottom = int(_world_size.y)
	camera.zoom = Vector2.ONE
	player.add_child(camera)
	add_child(player)

func _spawn_xethkioz() -> void:
	var pet := Node2D.new()
	pet.name = "Xethkioz"
	pet.set_script(XethkiozScript)
	pet.position = player.position + Vector2(-30, 22)
	add_child(pet)

func _spawn_npcs() -> void:
	_spawn_npc("alexis", "Alexis", _world_pos(1, 3, 342, 190), 0, [
		"Despertaste en el borde de la Cuenca. Xethkioz no suele acercarse así a desconocidos.",
		"Antes de seguir hacia el bosque, necesito saber qué está alterando las raíces del sendero."
	])
	_spawn_npc("ivan", "Ivan", _world_pos(2, 3, 236, 204), 6, [
		"El Prisma-Atlas registra anomalías que el mapa común no puede mostrar.",
		"Cuando estabilice el módulo de fauna vas a poder registrar criaturas y puntos de interés."
	])
	_spawn_npc("val", "Val", _world_pos(1, 1, 164, 248), 7, [
		"No todas las criaturas quieren pelear. Algunas necesitan que entiendas su hábitat antes de acercarte.",
		"Si Xethkioz reacciona a una criatura, observá primero. El vínculo no se fuerza."
	])
	_spawn_npc("rola", "Rola", _world_pos(1, 1, 112, 286), 8, [
		"Hay huellas de Carpinchito cerca del agua. Las más frescas van hacia los juncos."
	])
	_spawn_npc("mela", "Mela", _world_pos(1, 1, 212, 300), 9, [
		"Quedate quieto un segundo. A veces se acercan cuando dejás de buscarlos."
	])

func _spawn_npc(id_value: String, display_name: String, pos: Vector2, atlas_index: int, lines: Array[String]) -> void:
	var npc := Node2D.new()
	npc.name = display_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure_production(id_value, display_name, lines, atlas_index)
	add_child(npc)

func _spawn_enemies() -> void:
	var definitions := [
		["brote_goblin", _world_pos(0,2,310,190), 42.0,52.0,8.0,24,0],
		["brote_goblin", _world_pos(0,1,360,280), 42.0,52.0,8.0,24,0],
		["explorador_goblin", _world_pos(2,2,170,170), 38.0,68.0,7.0,28,1],
		["slime_prismatico", _world_pos(2,1,310,250), 58.0,38.0,9.0,30,2],
		["escarabajo_corteza", _world_pos(2,0,215,305), 74.0,42.0,11.0,34,3],
		["espiritu_bruma", _world_pos(0,0,300,180), 46.0,58.0,9.0,32,4],
		["brote_goblin", _world_pos(3,2,380,330), 46.0,54.0,9.0,26,0],
		["explorador_goblin", _world_pos(3,1,120,330), 40.0,70.0,8.0,30,1],
		["drone_pampeano_roto", _world_pos(3,0,330,210), 72.0,44.0,12.0,38,5],
		["slime_prismatico", _world_pos(4,2,210,180), 62.0,40.0,10.0,32,2],
		["escarabajo_corteza", _world_pos(4,1,320,300), 80.0,44.0,12.0,38,3],
		["espiritu_bruma", _world_pos(4,0,150,330), 52.0,62.0,11.0,38,4]
	]
	for data in definitions:
		var enemy := CharacterBody2D.new()
		enemy.name = str(data[0])
		enemy.collision_layer = 2
		enemy.collision_mask = 1 | 4
		enemy.set_script(EnemyScript)
		enemy.position = data[1]
		var collision := CollisionShape2D.new()
		var shape := CircleShape2D.new()
		shape.radius = 9.0
		collision.shape = shape
		collision.position = Vector2(0, 3)
		enemy.add_child(collision)
		enemy.configure_production(str(data[0]), float(data[2]), float(data[3]), float(data[4]), int(data[5]), int(data[6]))
		add_child(enemy)

func _spawn_systems() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudScript)
	add_child(hud)
	var quests := Node.new()
	quests.name = "QuestManager"
	quests.set_script(QuestScript)
	add_child(quests)
	var clock := Node.new()
	clock.name = "WorldClock"
	clock.set_script(ClockScript)
	add_child(clock)
	var weather := Node.new()
	weather.name = "Weather"
	weather.set_script(WeatherScript)
	add_child(weather)

func _update_streaming(force: bool) -> void:
	if not is_instance_valid(player) or manifest.is_empty():
		return
	var center := Vector2i(floori(player.position.x / CHUNK_PIXELS), floori(player.position.y / CHUNK_PIXELS))
	var wanted: Dictionary = {}
	for y in range(center.y - STREAM_RADIUS, center.y + STREAM_RADIUS + 1):
		for x in range(center.x - STREAM_RADIUS, center.x + STREAM_RADIUS + 1):
			var coord := Vector2i(x, y)
			var key := _chunk_key(coord)
			if manifest.get("chunks", {}).has(key):
				wanted[key] = coord
	for key in wanted.keys():
		if not active_chunks.has(key):
			_load_chunk(wanted[key])
	for key in active_chunks.keys().duplicate():
		if not wanted.has(key):
			var chunk: Node = active_chunks[key]
			if is_instance_valid(chunk):
				chunk.queue_free()
			active_chunks.erase(key)
	if force:
		_stream_timer = 0.0

func _load_chunk(coord: Vector2i) -> void:
	var key := _chunk_key(coord)
	var data: Dictionary = manifest.get("chunks", {}).get(key, {})
	if data.is_empty():
		return
	var chunk := Node2D.new()
	chunk.name = "Chunk_%s" % key.replace(",", "_")
	chunk.set_script(ChunkScript)
	add_child(chunk)
	move_child(chunk, 0)
	chunk.configure(coord, data, int(manifest.get("world_seed", 21500809)))
	active_chunks[key] = chunk

func _add_world_boundaries() -> void:
	_add_wall(Rect2(-32, -32, _world_size.x + 64, 32))
	_add_wall(Rect2(-32, _world_size.y, _world_size.x + 64, 32))
	_add_wall(Rect2(-32, 0, 32, _world_size.y))
	_add_wall(Rect2(_world_size.x, 0, 32, _world_size.y))

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

func _manifest_start_position() -> Vector2:
	var chunk_data: Array = manifest.get("start_chunk", [1, 3])
	var local_data: Array = manifest.get("start_local_px", [256, 224])
	return Vector2(float(chunk_data[0] * CHUNK_PIXELS + local_data[0]), float(chunk_data[1] * CHUNK_PIXELS + local_data[1]))

func _world_pos(chunk_x: int, chunk_y: int, local_x: int, local_y: int) -> Vector2:
	return Vector2(chunk_x * CHUNK_PIXELS + local_x, chunk_y * CHUNK_PIXELS + local_y)

func _chunk_key(coord: Vector2i) -> String:
	return "%d,%d" % [coord.x, coord.y]
