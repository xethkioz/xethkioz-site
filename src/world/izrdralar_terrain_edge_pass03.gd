class_name IzrdralarTerrainEdgePass03
extends Node2D

const Factory := preload("res://src/world/production_tileset_factory.gd")
const TILE_SIZE := 16
const CHUNK_TILES := 32

var _ground: TileMapLayer
var _biome := "forest"
var _seed_value := 0
var _marks: Array[Dictionary] = []

func configure(ground: TileMapLayer, biome_value: String, seed_value: int) -> void:
	_ground = ground
	_biome = biome_value
	_seed_value = seed_value
	z_index = -12
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_collect_edges()
	queue_redraw()

func _collect_edges() -> void:
	_marks.clear()
	if not is_instance_valid(_ground):
		return
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var tile := _ground.get_cell_atlas_coords(cell)
			if Factory.is_path(tile):
				_collect_for_cell(cell, "path")
			elif Factory.is_water(tile):
				_collect_for_cell(cell, "water")
			elif Factory.DIRT_VARIANTS.has(tile) and _biome in ["refuge", "boss"]:
				_collect_for_cell(cell, "dirt")

func _collect_for_cell(cell: Vector2i, kind: String) -> void:
	var neighbors := [
		{"dir": Vector2i.UP, "side": 0},
		{"dir": Vector2i.RIGHT, "side": 1},
		{"dir": Vector2i.DOWN, "side": 2},
		{"dir": Vector2i.LEFT, "side": 3}
	]
	for item in neighbors:
		var neighbor_cell: Vector2i = cell + item["dir"]
		var neighbor_tile := _ground.get_cell_atlas_coords(neighbor_cell)
		var is_edge := false
		match kind:
			"path":
				is_edge = not Factory.is_path(neighbor_tile) and not Factory.is_bridge(neighbor_tile)
			"water":
				is_edge = not Factory.is_water(neighbor_tile) and not Factory.is_bridge(neighbor_tile)
			"dirt":
				is_edge = not Factory.DIRT_VARIANTS.has(neighbor_tile) and not Factory.is_path(neighbor_tile)
		if not is_edge:
			continue
		var side := int(item["side"])
		var roll := _hash(cell.x, cell.y, 101 + side * 17 + kind.hash())
		_marks.append({
			"cell": cell,
			"side": side,
			"kind": kind,
			"roll": roll
		})

func _draw() -> void:
	for mark in _marks:
		var cell: Vector2i = mark["cell"]
		var origin := Vector2(cell.x * TILE_SIZE, cell.y * TILE_SIZE)
		var side := int(mark["side"])
		var kind := str(mark["kind"])
		var roll := int(mark["roll"])
		match kind:
			"path":
				_draw_path_edge(origin, side, roll)
			"water":
				_draw_water_edge(origin, side, roll)
			"dirt":
				_draw_dirt_edge(origin, side, roll)

func _draw_path_edge(origin: Vector2, side: int, roll: int) -> void:
	var grass := _edge_grass_color()
	var shadow := Color(grass.r * 0.72, grass.g * 0.72, grass.b * 0.72, 0.72)
	var start := 2 + posmod(roll, 4)
	var span := 7 + posmod(roll >> 3, 6)
	_draw_edge_strip(origin, side, start, span, 2, shadow)
	# Two one-pixel intrusions break the rectangular edge at 16 px cadence.
	var nub_a := 3 + posmod(roll >> 7, 8)
	var nub_b := 2 + posmod(roll >> 11, 10)
	_draw_edge_nub(origin, side, nub_a, 3, grass)
	if posmod(roll, 3) != 0:
		_draw_edge_nub(origin, side, nub_b, 2, grass)

func _draw_water_edge(origin: Vector2, side: int, roll: int) -> void:
	var wet := Color(0.12, 0.31, 0.32, 0.78)
	var foam := Color(0.55, 0.82, 0.84, 0.58)
	var start := 1 + posmod(roll, 6)
	var span := 6 + posmod(roll >> 4, 7)
	_draw_edge_strip(origin, side, start, span, 1, wet)
	if posmod(roll, 4) != 0:
		_draw_edge_strip(origin, side, 3 + posmod(roll >> 8, 5), 3, 1, foam)
	# Sparse reed pixels on wetland/lake shore.
	if _biome in ["lake", "river"] and posmod(roll, 5) == 0:
		var reed := Color(0.32, 0.48, 0.29, 0.72)
		_draw_reed(origin, side, 4 + posmod(roll >> 13, 7), reed)

func _draw_dirt_edge(origin: Vector2, side: int, roll: int) -> void:
	var earth_shadow := Color(0.31, 0.22, 0.16, 0.52)
	var moss := _edge_grass_color()
	_draw_edge_strip(origin, side, 2 + posmod(roll, 5), 7 + posmod(roll >> 4, 5), 1, earth_shadow)
	if posmod(roll, 2) == 0:
		_draw_edge_nub(origin, side, 4 + posmod(roll >> 8, 7), 2, moss)

func _draw_edge_strip(origin: Vector2, side: int, start: int, span: int, thickness: int, color_value: Color) -> void:
	var safe_start := clampi(start, 0, TILE_SIZE - 1)
	var safe_span := clampi(span, 1, TILE_SIZE - safe_start)
	match side:
		0: draw_rect(Rect2(origin + Vector2(safe_start, 0), Vector2(safe_span, thickness)), color_value, true)
		1: draw_rect(Rect2(origin + Vector2(TILE_SIZE - thickness, safe_start), Vector2(thickness, safe_span)), color_value, true)
		2: draw_rect(Rect2(origin + Vector2(safe_start, TILE_SIZE - thickness), Vector2(safe_span, thickness)), color_value, true)
		3: draw_rect(Rect2(origin + Vector2(0, safe_start), Vector2(thickness, safe_span)), color_value, true)

func _draw_edge_nub(origin: Vector2, side: int, offset: int, depth: int, color_value: Color) -> void:
	var o := clampi(offset, 1, TILE_SIZE - 2)
	var d := clampi(depth, 1, 4)
	match side:
		0: draw_rect(Rect2(origin + Vector2(o, 0), Vector2(1, d)), color_value, true)
		1: draw_rect(Rect2(origin + Vector2(TILE_SIZE - d, o), Vector2(d, 1)), color_value, true)
		2: draw_rect(Rect2(origin + Vector2(o, TILE_SIZE - d), Vector2(1, d)), color_value, true)
		3: draw_rect(Rect2(origin + Vector2(0, o), Vector2(d, 1)), color_value, true)

func _draw_reed(origin: Vector2, side: int, offset: int, color_value: Color) -> void:
	var o := clampi(offset, 2, TILE_SIZE - 3)
	match side:
		0:
			draw_rect(Rect2(origin + Vector2(o, 0), Vector2(1, 4)), color_value, true)
			draw_rect(Rect2(origin + Vector2(o + 2, 1), Vector2(1, 3)), color_value, true)
		1:
			draw_rect(Rect2(origin + Vector2(TILE_SIZE - 4, o), Vector2(4, 1)), color_value, true)
			draw_rect(Rect2(origin + Vector2(TILE_SIZE - 3, o + 2), Vector2(3, 1)), color_value, true)
		2:
			draw_rect(Rect2(origin + Vector2(o, TILE_SIZE - 4), Vector2(1, 4)), color_value, true)
			draw_rect(Rect2(origin + Vector2(o + 2, TILE_SIZE - 3), Vector2(1, 3)), color_value, true)
		3:
			draw_rect(Rect2(origin + Vector2(0, o), Vector2(4, 1)), color_value, true)
			draw_rect(Rect2(origin + Vector2(0, o + 2), Vector2(3, 1)), color_value, true)

func _edge_grass_color() -> Color:
	match _biome:
		"lake", "river": return Color(0.16, 0.34, 0.29, 0.76)
		"ruins", "sanctuary": return Color(0.14, 0.29, 0.22, 0.74)
		"boss": return Color(0.11, 0.25, 0.18, 0.78)
		"refuge": return Color(0.22, 0.42, 0.27, 0.72)
		_: return Color(0.18, 0.39, 0.25, 0.76)

func _hash(x: int, y: int, salt: int) -> int:
	var n := _seed_value ^ (x * 73856093) ^ (y * 19349663) ^ salt
	n = (n ^ (n >> 13)) * 1274126177
	return absi(n)
