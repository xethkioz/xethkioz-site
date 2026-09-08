extends Control

const MANIFEST_PATH := "res://data/regions/golden_region_v34.json"
const MAP_COLS := 5
const MAP_ROWS := 4
const CHUNK_PIXELS := 512.0

const C_BG := Color(0.025, 0.035, 0.055, 0.95)
const C_BORDER := Color(0.55, 0.36, 0.96, 0.88)
const C_PLAYER := Color(1.0, 0.55, 0.26, 1.0)
const C_DISCOVERED := Color(0.86, 0.82, 1.0, 1.0)
const C_UNKNOWN := Color(0.48, 0.50, 0.55, 0.36)
const C_FOREST := Color("234b38")
const C_FOREST_ALT := Color("2d6043")
const C_PATH := Color("b79a6a")
const C_WATER := Color("347f99")
const C_WATER_LIGHT := Color("76dbea")
const C_RUINS := Color("59645f")
const C_SANCTUARY := Color("355947")
const C_BOSS := Color("38253f")
const C_REFUGE := Color("315944")
const C_PRISM := Color("8b5cf6")
const C_ORANGE := Color("ff8c42")

var _player: Node2D
var _world_size := Vector2(2560, 2048)
var _poi: Array = []
var _chunks: Dictionary = {}

func configure(player_ref: Node2D, world_size_value: Vector2, poi_data: Array) -> void:
	_player = player_ref
	_world_size = Vector2(maxf(1.0, world_size_value.x), maxf(1.0, world_size_value.y))
	_poi = poi_data.duplicate(true)
	_load_manifest_chunks()
	queue_redraw()

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	if _chunks.is_empty():
		_load_manifest_chunks()
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _load_manifest_chunks() -> void:
	_chunks.clear()
	if not FileAccess.file_exists(MANIFEST_PATH):
		return
	var file := FileAccess.open(MANIFEST_PATH, FileAccess.READ)
	if file == null:
		return
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		var raw_chunks = parsed.get("chunks", {})
		if raw_chunks is Dictionary:
			_chunks = raw_chunks.duplicate(true)

func _draw() -> void:
	var outer := Rect2(Vector2.ZERO, size)
	draw_rect(outer, C_BG, true)
	draw_rect(outer, C_BORDER, false, 1.0)
	var inner := Rect2(Vector2(6, 15), Vector2(maxf(10.0, size.x - 12.0), maxf(10.0, size.y - 21.0)))
	draw_rect(inner, Color("10231f"), true)
	_draw_region_topology(inner)
	_draw_poi(inner)
	_draw_player(inner)
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(6, 10), _nearest_label().to_upper(), HORIZONTAL_ALIGNMENT_LEFT, size.x - 12.0, 7, Color("f0f0f5"))

func _draw_region_topology(inner: Rect2) -> void:
	for key in _chunks.keys():
		var coord := _coord_from_key(str(key))
		if coord.x < 0 or coord.y < 0:
			continue
		var raw = _chunks[key]
		if raw is not Dictionary:
			continue
		var data: Dictionary = raw
		var rect := _chunk_rect(coord, inner)
		_draw_biome(rect, str(data.get("biome", "forest")), coord)
	for key in _chunks.keys():
		var coord := _coord_from_key(str(key))
		if coord.x < 0 or coord.y < 0:
			continue
		var raw = _chunks[key]
		if raw is not Dictionary:
			continue
		_draw_routes(_chunk_rect(coord, inner), raw.get("exits", {}))

func _draw_biome(rect: Rect2, biome: String, coord: Vector2i) -> void:
	var inset: Rect2 = Rect2(rect.position + Vector2(0.45, 0.45), rect.size - Vector2(0.9, 0.9))
	var fill: Color = C_FOREST if (coord.x + coord.y) % 2 == 0 else C_FOREST_ALT
	match biome:
		"river":
			fill = C_FOREST
		"lake":
			fill = Color("244d43")
		"ruins":
			fill = C_RUINS.darkened(0.18)
		"sanctuary":
			fill = C_SANCTUARY
		"boss":
			fill = C_BOSS
		"refuge":
			fill = C_REFUGE
	draw_rect(inset, fill, true)

	match biome:
		"river":
			var river_x: float = rect.position.x + rect.size.x * 0.23
			draw_line(Vector2(river_x, rect.position.y + 1.0), Vector2(river_x, rect.end.y - 1.0), C_WATER, 4.0)
			draw_line(Vector2(river_x + 0.8, rect.position.y + 1.0), Vector2(river_x + 0.8, rect.end.y - 1.0), C_WATER_LIGHT, 1.0)
		"lake":
			var center: Vector2 = rect.position + Vector2(rect.size.x * 0.65, rect.size.y * 0.42)
			var lake := PackedVector2Array([
				center + Vector2(-rect.size.x * 0.24, -rect.size.y * 0.12),
				center + Vector2(-rect.size.x * 0.10, -rect.size.y * 0.27),
				center + Vector2(rect.size.x * 0.17, -rect.size.y * 0.22),
				center + Vector2(rect.size.x * 0.27, -rect.size.y * 0.02),
				center + Vector2(rect.size.x * 0.18, rect.size.y * 0.23),
				center + Vector2(-rect.size.x * 0.10, rect.size.y * 0.26),
				center + Vector2(-rect.size.x * 0.27, rect.size.y * 0.08)
			])
			draw_colored_polygon(lake, C_WATER)
			draw_line(lake[0], lake[1], C_WATER_LIGHT, 1.0)
		"ruins":
			var ruin_offsets: Array[Vector2] = [Vector2(0.28,0.30), Vector2(0.58,0.22), Vector2(0.42,0.60), Vector2(0.72,0.55)]
			for offset in ruin_offsets:
				var p: Vector2 = rect.position + rect.size * offset
				draw_rect(Rect2(p, Vector2(2.4, 2.4)), Color("818b84"), true)
				if int((offset.x + offset.y) * 100.0) % 2 == 0:
					draw_rect(Rect2(p + Vector2(0.7,0.3), Vector2(0.8,1.8)), C_PRISM, true)
		"sanctuary":
			var c: Vector2 = rect.position + rect.size * 0.5
			draw_circle(c, minf(rect.size.x, rect.size.y) * 0.24, Color(0.55,0.36,0.96,0.18))
			draw_arc(c, minf(rect.size.x, rect.size.y) * 0.22, 0.0, TAU, 12, C_PRISM, 1.0)
			var cardinal: Array[Vector2] = [Vector2.UP, Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT]
			for direction in cardinal:
				draw_circle(c + direction * 4.0, 1.1, Color("b9a8ff"))
		"boss":
			var c: Vector2 = rect.position + rect.size * 0.5
			draw_circle(c, minf(rect.size.x, rect.size.y) * 0.31, Color(0.55,0.22,0.26,0.48))
			draw_arc(c, minf(rect.size.x, rect.size.y) * 0.28, 0.0, TAU, 14, C_ORANGE, 1.0)
		"refuge":
			var base: Vector2 = rect.position + Vector2(rect.size.x * 0.64, rect.size.y * 0.34)
			var roof := PackedVector2Array([base + Vector2(-4,2), base + Vector2(0,-2), base + Vector2(4,2)])
			draw_colored_polygon(roof, C_ORANGE)
			draw_rect(Rect2(base + Vector2(-3,2), Vector2(6,4)), Color("7b5a3e"), true)

func _draw_routes(rect: Rect2, raw_exits) -> void:
	if raw_exits is not Dictionary:
		return
	var exits: Dictionary = raw_exits
	var c: Vector2 = rect.position + rect.size * 0.5
	var north: Vector2 = Vector2(c.x, rect.position.y)
	var south: Vector2 = Vector2(c.x, rect.end.y)
	var west: Vector2 = Vector2(rect.position.x, c.y)
	var east: Vector2 = Vector2(rect.end.x, c.y)
	if bool(exits.get("n", false)):
		draw_line(c, north, C_PATH, 1.35)
	if bool(exits.get("s", false)):
		draw_line(c, south, C_PATH, 1.35)
	if bool(exits.get("w", false)):
		draw_line(c, west, C_PATH, 1.35)
	if bool(exits.get("e", false)):
		draw_line(c, east, C_PATH, 1.35)
	draw_circle(c, 1.15, C_PATH.lightened(0.15))

func _draw_poi(inner: Rect2) -> void:
	for raw in _poi:
		if raw is not Dictionary:
			continue
		var entry: Dictionary = raw
		var id: String = str(entry.get("id", ""))
		var map_p: Vector2 = _to_map(_poi_world_position(entry), inner)
		var discovered: bool = GameState.has_poi(id)
		var color: Color = C_DISCOVERED if discovered else C_UNKNOWN
		var radius: float = 2.5 if discovered else 1.5
		match str(entry.get("kind", "")):
			"boss":
				if discovered:
					color = C_ORANGE
			"creatures":
				if discovered:
					color = C_WATER_LIGHT
			"dungeon", "secret_locked":
				if discovered:
					color = C_PRISM.lightened(0.18)
		var diamond := PackedVector2Array([
			map_p + Vector2(0,-radius), map_p + Vector2(radius,0),
			map_p + Vector2(0,radius), map_p + Vector2(-radius,0)
		])
		draw_colored_polygon(diamond, color)

func _draw_player(inner: Rect2) -> void:
	if not is_instance_valid(_player):
		return
	var map_p: Vector2 = _to_map(_player.global_position, inner)
	draw_circle(map_p, 2.7, C_PLAYER)
	draw_circle(map_p, 4.5, Color(C_PLAYER.r, C_PLAYER.g, C_PLAYER.b, 0.30), false, 1.0)
	var facing = _player.get("facing")
	if facing is Vector2 and facing.length_squared() > 0.01:
		draw_line(map_p, map_p + facing.normalized() * 4.2, Color("ffe0b8"), 1.1)

func _chunk_rect(coord: Vector2i, inner: Rect2) -> Rect2:
	var cell_size: Vector2 = Vector2(inner.size.x / float(MAP_COLS), inner.size.y / float(MAP_ROWS))
	return Rect2(inner.position + Vector2(coord.x * cell_size.x, coord.y * cell_size.y), cell_size)

func _coord_from_key(key: String) -> Vector2i:
	var parts := key.split(",")
	if parts.size() != 2:
		return Vector2i(-1, -1)
	return Vector2i(int(parts[0]), int(parts[1]))

func _to_map(world_pos: Vector2, inner: Rect2) -> Vector2:
	var nx: float = clampf(world_pos.x / _world_size.x, 0.0, 1.0)
	var ny: float = clampf(world_pos.y / _world_size.y, 0.0, 1.0)
	return inner.position + Vector2(nx * inner.size.x, ny * inner.size.y)

func _poi_world_position(entry: Dictionary) -> Vector2:
	var chunk: Array = entry.get("chunk", [0, 0])
	var local: Array = entry.get("local", [256, 256])
	return Vector2(float(int(chunk[0]) * CHUNK_PIXELS + int(local[0])), float(int(chunk[1]) * CHUNK_PIXELS + int(local[1])))

func _nearest_label() -> String:
	if not is_instance_valid(_player):
		return "REGIÓN DORADA"
	var best_name := "REGIÓN DORADA"
	var best_distance := 999999.0
	for raw in _poi:
		if raw is not Dictionary:
			continue
		var entry: Dictionary = raw
		var d: float = _player.global_position.distance_to(_poi_world_position(entry))
		if d < best_distance:
			best_distance = d
			best_name = str(entry.get("name", "REGIÓN DORADA"))
	return best_name if best_distance <= 220.0 else "REGIÓN DORADA"
