class_name ProductionChunk
extends Node2D

const Factory := preload("res://src/world/production_tileset_factory.gd")
const TILE_SIZE := 16
const CHUNK_TILES := 32
const CHUNK_PIXELS := TILE_SIZE * CHUNK_TILES

var chunk_coord := Vector2i.ZERO
var biome := "forest"
var exits := {"n": false, "e": false, "s": false, "w": false}
var seed_value := 0
var _ground: TileMapLayer
var _detail: TileMapLayer
var _blockers: Node2D

func configure(coord: Vector2i, data: Dictionary, world_seed: int) -> void:
	chunk_coord = coord
	biome = str(data.get("biome", "forest"))
	exits = data.get("exits", exits).duplicate(true)
	seed_value = world_seed + coord.x * 73856093 + coord.y * 19349663
	position = Vector2(coord.x * CHUNK_PIXELS, coord.y * CHUNK_PIXELS)
	_build()

func _build() -> void:
	_ground = TileMapLayer.new()
	_ground.name = "Ground"
	_ground.tile_set = Factory.build()
	_ground.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_ground.z_index = -20
	add_child(_ground)

	_detail = TileMapLayer.new()
	_detail.name = "Detail"
	_detail.tile_set = _ground.tile_set
	_detail.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_detail.z_index = -10
	add_child(_detail)

	_blockers = Node2D.new()
	_blockers.name = "Blockers"
	add_child(_blockers)

	_fill_base()
	_carve_routes()
	_apply_biome_features()
	_decorate()

func _fill_base() -> void:
	var base_tile: Vector2i = Factory.GRASS
	if biome == "ruins":
		base_tile = Factory.DARK_GRASS
	elif biome == "lake":
		base_tile = Factory.GRASS
	elif biome == "boss":
		base_tile = Factory.DARK_GRASS
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			_ground.set_cell(Vector2i(x, y), 0, base_tile)

func _carve_routes() -> void:
	var c: int = CHUNK_TILES >> 1
	var width: int = 5
	var half: int = width >> 1
	for y in range(c - half, c + half + 1):
		for x in range(c - half, c + half + 1):
			_ground.set_cell(Vector2i(x, y), 0, Factory.PATH)
	if bool(exits.get("n", false)):
		for y in range(0, c + 1):
			_paint_path_band(Vector2i(c, y), width)
	if bool(exits.get("s", false)):
		for y in range(c, CHUNK_TILES):
			_paint_path_band(Vector2i(c, y), width)
	if bool(exits.get("w", false)):
		for x in range(0, c + 1):
			_paint_path_band(Vector2i(x, c), width, false)
	if bool(exits.get("e", false)):
		for x in range(c, CHUNK_TILES):
			_paint_path_band(Vector2i(x, c), width, false)

func _paint_path_band(center: Vector2i, width: int, vertical := true) -> void:
	var half: int = width >> 1
	for offset in range(-half, half + 1):
		var cell: Vector2i = center + (Vector2i(offset, 0) if vertical else Vector2i(0, offset))
		if _inside(cell):
			_ground.set_cell(cell, 0, Factory.PATH)

func _apply_biome_features() -> void:
	match biome:
		"river":
			_paint_river()
		"lake":
			_paint_lake()
		"ruins":
			_paint_ruins()
		"sanctuary":
			_paint_sanctuary()
		"boss":
			_paint_boss_arena()
		"refuge":
			_paint_refuge_clearance()

func _paint_river() -> void:
	for y in range(CHUNK_TILES):
		for x in range(3, 9):
			_ground.set_cell(Vector2i(x, y), 0, Factory.WATER if x not in [3, 8] else Factory.WATER_FOAM)
	var bridge_y: int = CHUNK_TILES >> 1
	for x in range(3, 9):
		_ground.set_cell(Vector2i(x, bridge_y), 0, Factory.BRIDGE)
		_ground.set_cell(Vector2i(x, bridge_y + 1), 0, Factory.BRIDGE)

func _paint_lake() -> void:
	var center := Vector2(21, 11)
	for y in range(2, 22):
		for x in range(11, 31):
			var d: float = Vector2(x, y).distance_to(center)
			if d < 8.4:
				_ground.set_cell(Vector2i(x, y), 0, Factory.WATER)
			elif d < 9.4:
				_ground.set_cell(Vector2i(x, y), 0, Factory.WATER_FOAM)

func _paint_ruins() -> void:
	for y in range(7, 23):
		for x in range(7, 25):
			if x in [7, 24] or y in [7, 22]:
				_detail.set_cell(Vector2i(x, y), 0, Factory.RUIN_WALL)
			elif (x + y) % 3 != 0:
				_ground.set_cell(Vector2i(x, y), 0, Factory.RUIN_FLOOR)
	for opening in [Vector2i(15, 7), Vector2i(16, 7), Vector2i(7, 15), Vector2i(7, 16)]:
		_detail.erase_cell(opening)

func _paint_sanctuary() -> void:
	var c := Vector2i(16, 16)
	for y in range(6, 27):
		for x in range(6, 27):
			var d: float = Vector2(x, y).distance_to(Vector2(c.x, c.y))
			if d < 9.0:
				_ground.set_cell(Vector2i(x, y), 0, Factory.RUIN_FLOOR)
	for p in [Vector2i(10, 10), Vector2i(22, 10), Vector2i(10, 22), Vector2i(22, 22)]:
		_detail.set_cell(p, 0, Factory.CRYSTAL)

func _paint_boss_arena() -> void:
	var c := Vector2(16, 16)
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var d: float = Vector2(x, y).distance_to(c)
			if d < 11.5:
				_ground.set_cell(Vector2i(x, y), 0, Factory.DIRT)
			elif d < 13.0:
				_detail.set_cell(Vector2i(x, y), 0, Factory.CLIFF)

func _paint_refuge_clearance() -> void:
	for y in range(7, 25):
		for x in range(5, 27):
			if x in range(8, 24) and y in range(9, 22):
				_ground.set_cell(Vector2i(x, y), 0, Factory.PATH)

func _decorate() -> void:
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if base in [Factory.PATH, Factory.WATER, Factory.WATER_FOAM, Factory.BRIDGE, Factory.RUIN_FLOOR]:
				continue
			var roll: int = _cell_roll(x, y)
			if roll < 3:
				_detail.set_cell(cell, 0, Factory.TREE)
				_add_blocker(cell, Vector2(12, 10), Vector2(0, 3))
			elif roll < 6:
				_detail.set_cell(cell, 0, Factory.SHRUB)
			elif roll == 7:
				_detail.set_cell(cell, 0, Factory.ROCK)
				_add_blocker(cell, Vector2(12, 8), Vector2(0, 4))
			elif roll == 8:
				_detail.set_cell(cell, 0, Factory.FLOWERS)
			elif roll == 9 and biome in ["ruins", "sanctuary", "boss"]:
				_detail.set_cell(cell, 0, Factory.CRYSTAL)

func _add_blocker(cell: Vector2i, size: Vector2, offset: Vector2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = Vector2(cell.x * TILE_SIZE + TILE_SIZE * 0.5, cell.y * TILE_SIZE + TILE_SIZE * 0.5) + offset
	var collision := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = size
	collision.shape = rect
	body.add_child(collision)
	_blockers.add_child(body)

func _cell_roll(x: int, y: int) -> int:
	var n: int = seed_value ^ (x * 374761393) ^ (y * 668265263)
	n = (n ^ (n >> 13)) * 1274126177
	return absi(n) % 100

func _inside(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.y >= 0 and cell.x < CHUNK_TILES and cell.y < CHUNK_TILES
