extends Node2D

# IZRDRALAR 01-32 · GENERIC MAP CHAIN
# PLAYER ONLY. Each atlas node is generated from data/regions/izrdralar_map_chain_01_32.json.

const GenericChunkScript := preload("res://src/world/izrdralar_generic_chunk.gd")
const PlayerScript := preload("res://src/player/player_controller_production.gd")

const MANIFEST_PATH := "res://data/regions/izrdralar_map_chain_01_32.json"
const CHUNK_PIXELS := 512
const GATE_RADIUS := 76.0

var manifest: Dictionary = {}
var current_map: Dictionary = {}
var current_map_id := 1
var player: CharacterBody2D
var active_chunks: Array[Node] = []
var world_size := Vector2(1024, 1024)
var entry_gate_position := Vector2.ZERO
var exit_gate_position := Vector2.ZERO
var _zone_label: Label
var _gate_label: Label
var _map_label: Label
var _transition_locked := false

func _ready() -> void:
	_ensure_inputs()
	manifest = _load_manifest()
	if manifest.is_empty():
		push_error("IZRDRALAR MAP CHAIN: manifest missing or invalid")
		return
	current_map_id = _requested_map_id()
	current_map = _map_by_id(current_map_id)
	if current_map.is_empty():
		push_error("IZRDRALAR MAP CHAIN: map id %d missing" % current_map_id)
		return
	_build_current_map()
	EventBus.toast_requested.emit("IZRDRALAR · MAPA %02d/32 · %s" % [current_map_id, str(current_map.get("n", ""))])

func _process(_delta: float) -> void:
	if not is_instance_valid(player) or _transition_locked:
		return
	_update_proximity_hints()

func _unhandled_key_input(event: InputEvent) -> void:
	if not event is InputEventKey or not event.pressed or event.echo:
		return
	if event.physical_keycode == KEY_PAGEDOWN and current_map_id < 32:
		_go_to_map(current_map_id + 1, "forward")
	elif event.physical_keycode == KEY_PAGEUP and current_map_id > 1:
		_go_to_map(current_map_id - 1, "backward")
	elif event.physical_keycode == KEY_HOME and current_map_id != 1:
		_go_to_map(1, "forward")
	elif event.physical_keycode == KEY_END and current_map_id != 32:
		_go_to_map(32, "forward")

func _requested_map_id() -> int:
	var env_id := OS.get_environment("XETHKIOZ_MAP_ID")
	if not env_id.is_empty() and env_id.is_valid_int():
		return clampi(env_id.to_int(), 1, 32)
	if GameState.has_meta("izrdralar_map_id"):
		return clampi(int(GameState.get_meta("izrdralar_map_id", 1)), 1, 32)
	return 1

func _load_manifest() -> Dictionary:
	if not FileAccess.file_exists(MANIFEST_PATH):
		return {}
	var file := FileAccess.open(MANIFEST_PATH, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if parsed is Dictionary else {}

func _map_by_id(map_id: int) -> Dictionary:
	for item in manifest.get("maps", []):
		if item is Dictionary and int(item.get("id", 0)) == map_id:
			return item
	return {}

func _build_current_map() -> void:
	var size_data: Array = current_map.get("s", [2, 2])
	var width_chunks := maxi(1, int(size_data[0]))
	var height_chunks := maxi(1, int(size_data[1]))
	world_size = Vector2(width_chunks * CHUNK_PIXELS, height_chunks * CHUNK_PIXELS)
	_build_chunks(width_chunks, height_chunks)
	_build_world_boundaries()
	_build_zone_markers()
	_build_gate_markers()
	_spawn_player()
	_build_hud()

func _build_chunks(width_chunks: int, height_chunks: int) -> void:
	var seed_base := 21500000 + current_map_id * 7919
	for y in range(height_chunks):
		for x in range(width_chunks):
			var coord := Vector2i(x, y)
			var chunk := Node2D.new()
			chunk.name = "Map%02d_Chunk_%d_%d" % [current_map_id, x, y]
			chunk.set_script(GenericChunkScript)
			add_child(chunk)
			move_child(chunk, 0)
			chunk.configure(coord, _chunk_data(coord, width_chunks, height_chunks), seed_base)
			active_chunks.append(chunk)

func _chunk_data(coord: Vector2i, width_chunks: int, height_chunks: int) -> Dictionary:
	var exits := {
		"n": coord.y > 0,
		"e": coord.x < width_chunks - 1,
		"s": coord.y < height_chunks - 1,
		"w": coord.x > 0
	}
	_enable_outer_route(exits, coord, width_chunks, height_chunks, str(current_map.get("e", "west")))
	_enable_outer_route(exits, coord, width_chunks, height_chunks, str(current_map.get("x", "east")))
	return {"biome": _biome_for_chunk(coord), "exits": exits}

func _enable_outer_route(exits: Dictionary, coord: Vector2i, width_chunks: int, height_chunks: int, edge: String) -> void:
	match edge:
		"west":
			if coord.x == 0 and coord.y == (height_chunks >> 1):
				exits["w"] = true
		"east":
			if coord.x == width_chunks - 1 and coord.y == (height_chunks >> 1):
				exits["e"] = true
		"north":
			if coord.y == 0 and coord.x == (width_chunks >> 1):
				exits["n"] = true
		"south":
			if coord.y == height_chunks - 1 and coord.x == (width_chunks >> 1):
				exits["s"] = true

func _biome_for_chunk(coord: Vector2i) -> String:
	var biomes: Array = current_map.get("bi", ["forest"])
	if biomes.is_empty():
		return "forest"
	var index := posmod(coord.x + coord.y * 2 + current_map_id, biomes.size())
	return str(biomes[index])

func _build_world_boundaries() -> void:
	_add_wall(Rect2(-32, -32, world_size.x + 64, 32))
	_add_wall(Rect2(-32, world_size.y, world_size.x + 64, 32))
	_add_wall(Rect2(-32, 0, 32, world_size.y))
	_add_wall(Rect2(world_size.x, 0, 32, world_size.y))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.name = "WorldBoundary"
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _build_gate_markers() -> void:
	entry_gate_position = _edge_position(str(current_map.get("e", "west")))
	exit_gate_position = _edge_position(str(current_map.get("x", "east")))
	if current_map_id > 1:
		_add_gate_marker(entry_gate_position, "◀ MAPA %02d" % (current_map_id - 1), Color("6ed4e8"))
	if current_map_id < 32:
		_add_gate_marker(exit_gate_position, "MAPA %02d ▶" % (current_map_id + 1), Color("a855f7"))
	else:
		_add_gate_marker(exit_gate_position, "UMBRAL · FIN DE IZRDRALAR", Color("ffbf4d"))

func _edge_position(edge: String) -> Vector2:
	match edge:
		"west": return Vector2(72, world_size.y * 0.5)
		"east": return Vector2(world_size.x - 72, world_size.y * 0.5)
		"north": return Vector2(world_size.x * 0.5, 72)
		"south": return Vector2(world_size.x * 0.5, world_size.y - 72)
	return Vector2(72, world_size.y * 0.5)

func _inward_spawn(edge: String, gate_pos: Vector2) -> Vector2:
	var offset := Vector2.ZERO
	match edge:
		"west": offset = Vector2(58, 0)
		"east": offset = Vector2(-58, 0)
		"north": offset = Vector2(0, 58)
		"south": offset = Vector2(0, -58)
	return gate_pos + offset

func _add_gate_marker(pos: Vector2, text_value: String, color_value: Color) -> void:
	var marker := Node2D.new()
	marker.position = pos
	marker.z_index = 30
	var ring := Polygon2D.new()
	ring.polygon = PackedVector2Array([Vector2(-26, -18), Vector2(26, -18), Vector2(26, 18), Vector2(-26, 18)])
	ring.color = Color(color_value.r, color_value.g, color_value.b, 0.32)
	marker.add_child(ring)
	var label := Label.new()
	label.position = Vector2(-62, -35)
	label.size = Vector2(124, 18)
	label.text = text_value
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", 8)
	label.add_theme_color_override("font_color", color_value)
	marker.add_child(label)
	add_child(marker)

func _build_zone_markers() -> void:
	var zones: Array = current_map.get("z", [])
	var anchors := [Vector2(0.32, 0.38), Vector2(0.58, 0.55), Vector2(0.72, 0.32), Vector2(0.44, 0.73)]
	for index in range(zones.size()):
		var kind := str(zones[index])
		var uv: Vector2 = anchors[index % anchors.size()]
		var pos := Vector2(uv.x * world_size.x, uv.y * world_size.y)
		_add_zone_marker(index, pos, kind.replace("_", " ").capitalize(), kind)

func _add_zone_marker(index: int, pos: Vector2, label_text: String, kind: String) -> void:
	var marker := Node2D.new()
	marker.name = "Zone_%02d_%s" % [index + 1, kind]
	marker.position = pos
	marker.set_meta("zone_label", label_text)
	marker.set_meta("zone_kind", kind)
	marker.z_index = 20
	var plate := Polygon2D.new()
	plate.polygon = PackedVector2Array([Vector2(-48, -30), Vector2(48, -30), Vector2(48, 30), Vector2(-48, 30)])
	var c := _zone_color(kind)
	plate.color = Color(c.r, c.g, c.b, 0.19)
	marker.add_child(plate)
	var label := Label.new()
	label.position = Vector2(-62, -8)
	label.size = Vector2(124, 18)
	label.text = label_text.to_upper()
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", 8)
	label.add_theme_color_override("font_color", c)
	marker.add_child(label)
	add_child(marker)

func _zone_color(kind: String) -> Color:
	if kind.contains("boss"): return Color("ff6b5f")
	if kind.contains("refugio") or kind.contains("guardado") or kind.contains("descanso"): return Color("54e1ff")
	if kind.contains("secreto"): return Color("c686ff")
	if kind.contains("alexis") or kind.contains("revelacion") or kind.contains("guia"): return Color("ffbf4d")
	if kind.contains("historia") or kind.contains("vinculo"): return Color("8fcf78")
	if kind.contains("puzle") or kind.contains("runa") or kind.contains("santuario"): return Color("c7b0ff")
	return Color("6ed4e8")

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 4
	player.set_script(PlayerScript)
	var entry_mode := str(GameState.get_meta("izrdralar_entry", "forward"))
	if entry_mode == "backward" and current_map_id < 32:
		player.position = _inward_spawn(str(current_map.get("x", "east")), exit_gate_position)
	else:
		player.position = _inward_spawn(str(current_map.get("e", "west")), entry_gate_position)
	var collision := CollisionShape2D.new()
	collision.name = "PlayerCollision"
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
	camera.limit_right = int(world_size.x)
	camera.limit_bottom = int(world_size.y)
	player.add_child(camera)
	add_child(player)

func _build_hud() -> void:
	var canvas := CanvasLayer.new()
	canvas.layer = 100
	add_child(canvas)
	var panel := Panel.new()
	panel.position = Vector2(8, 8)
	panel.size = Vector2(306, 91)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.02, 0.03, 0.05, 0.91)
	style.border_color = Color("8b5cf6")
	style.set_border_width_all(1)
	style.set_corner_radius_all(5)
	panel.add_theme_stylebox_override("panel", style)
	canvas.add_child(panel)
	_map_label = Label.new()
	_map_label.position = Vector2(10, 7)
	_map_label.size = Vector2(286, 34)
	_map_label.text = _map_title_text()
	_map_label.add_theme_font_size_override("font_size", 10)
	_map_label.add_theme_color_override("font_color", Color("f0f0f5"))
	panel.add_child(_map_label)
	var info := Label.new()
	info.position = Vector2(10, 42)
	info.size = Vector2(286, 20)
	info.text = "WASD mover · SHIFT dash · J ataque · C usar portal"
	info.add_theme_font_size_override("font_size", 7)
	info.add_theme_color_override("font_color", Color("b8b8c4"))
	panel.add_child(info)
	var debug := Label.new()
	debug.position = Vector2(10, 60)
	debug.size = Vector2(286, 18)
	debug.text = "TEST: PageUp/PageDown saltar · Home M01 · End M32"
	debug.add_theme_font_size_override("font_size", 7)
	debug.add_theme_color_override("font_color", Color("787887"))
	panel.add_child(debug)
	_zone_label = Label.new()
	_zone_label.position = Vector2(8, 104)
	_zone_label.size = Vector2(306, 22)
	_zone_label.add_theme_font_size_override("font_size", 8)
	_zone_label.add_theme_color_override("font_color", Color("6ed4e8"))
	canvas.add_child(_zone_label)
	_gate_label = Label.new()
	_gate_label.position = Vector2(8, 128)
	_gate_label.size = Vector2(400, 22)
	_gate_label.add_theme_font_size_override("font_size", 8)
	_gate_label.add_theme_color_override("font_color", Color("f0f0f5"))
	canvas.add_child(_gate_label)

func _size_class(size_data: Array) -> String:
	var w := int(size_data[0])
	var h := int(size_data[1])
	if w == 3 and h == 3: return "BOSS LARGE"
	if w * h >= 8: return "DOBLE"
	return "STANDARD"

func _map_title_text() -> String:
	var size_data: Array = current_map.get("s", [2, 2])
	var px_w := int(size_data[0]) * CHUNK_PIXELS
	var px_h := int(size_data[1]) * CHUNK_PIXELS
	return "IZR-M%02d · %s · BLOQUE %s\n%s · %dx%d px · DIFICULTAD %d" % [current_map_id, str(current_map.get("n", "")), str(current_map.get("b", "")), _size_class(size_data), px_w, px_h, int(current_map.get("d", 1))]

func _update_proximity_hints() -> void:
	var nearest_zone := ""
	var nearest_distance := INF
	for child in get_children():
		if child is Node2D and child.has_meta("zone_label"):
			var distance := player.global_position.distance_to((child as Node2D).global_position)
			if distance < nearest_distance:
				nearest_distance = distance
				nearest_zone = str(child.get_meta("zone_label", ""))
	_zone_label.text = "ZONA PRÓXIMA: %s" % nearest_zone if nearest_distance < 210.0 else ""
	var prev_distance := player.global_position.distance_to(entry_gate_position)
	var next_distance := player.global_position.distance_to(exit_gate_position)
	_gate_label.text = ""
	if current_map_id > 1 and prev_distance <= GATE_RADIUS:
		_gate_label.text = "[C] Volver al mapa %02d" % (current_map_id - 1)
		if Input.is_action_just_pressed("interact"):
			_go_to_map(current_map_id - 1, "backward")
	elif next_distance <= GATE_RADIUS:
		if current_map_id < 32:
			_gate_label.text = "[C] Avanzar al mapa %02d" % (current_map_id + 1)
			if Input.is_action_just_pressed("interact"):
				_go_to_map(current_map_id + 1, "forward")
		else:
			_gate_label.text = "UMBRAL LEGENDARIO · FIN DEL TEST DE IZRDRALAR 1–32"

func _go_to_map(target_id: int, entry_mode: String) -> void:
	if _transition_locked:
		return
	_transition_locked = true
	target_id = clampi(target_id, 1, 32)
	GameState.set_meta("izrdralar_map_id", target_id)
	GameState.set_meta("izrdralar_entry", entry_mode)
	EventBus.toast_requested.emit("Transición · IZR-M%02d" % target_id)
	get_tree().reload_current_scene()

func _ensure_inputs() -> void:
	var actions := {"move_left": [KEY_A, KEY_LEFT], "move_right": [KEY_D, KEY_RIGHT], "move_up": [KEY_W, KEY_UP], "move_down": [KEY_S, KEY_DOWN], "attack": [KEY_J], "dash": [KEY_SHIFT], "interact": [KEY_C]}
	for action in actions.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		for keycode in actions[action]:
			var exists := false
			for current in InputMap.action_get_events(action):
				if current is InputEventKey and current.physical_keycode == keycode:
					exists = true
			if not exists:
				var key_event := InputEventKey.new()
				key_event.physical_keycode = keycode
				InputMap.action_add_event(action, key_event)
