class_name ProductionChunk
extends Node2D

const Factory := preload("res://src/world/production_tileset_factory.gd")
const LARGE_PROPS := preload("res://assets/production/izrdralar/large_props.svg")
const LANDMARKS := preload("res://assets/production/izrdralar/landmarks.svg")
const TILE_SIZE := 16
const CHUNK_TILES := 32
const CHUNK_PIXELS := TILE_SIZE * CHUNK_TILES

var chunk_coord := Vector2i.ZERO
var biome := "forest"
var exits := {"n": false, "e": false, "s": false, "w": false}
var seed_value := 0
var _ground: TileMapLayer
var _detail: TileMapLayer
var _props: Node2D
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

	_props = Node2D.new()
	_props.name = "LargeProps"
	_props.z_index = -5
	add_child(_props)

	_blockers = Node2D.new()
	_blockers.name = "Blockers"
	add_child(_blockers)

	_fill_base()
	_carve_routes()
	_apply_biome_features()
	_decorate()
	_place_chunk_landmarks()

func _fill_base() -> void:
	var base_tile: Vector2i = Factory.GRASS
	if biome in ["ruins", "boss"]:
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
	_add_rect_blocker(Rect2(48, 0, 96, float(bridge_y * TILE_SIZE)))
	_add_rect_blocker(Rect2(48, float((bridge_y + 2) * TILE_SIZE), 96, float(CHUNK_PIXELS - (bridge_y + 2) * TILE_SIZE)))

func _paint_lake() -> void:
	var center := Vector2(21, 11)
	for y in range(2, 22):
		for x in range(11, 31):
			var d: float = Vector2(x, y).distance_to(center)
			if d < 8.4:
				_ground.set_cell(Vector2i(x, y), 0, Factory.WATER)
			elif d < 9.4:
				_ground.set_cell(Vector2i(x, y), 0, Factory.WATER_FOAM)
	_add_circle_blocker(Vector2(344, 184), 124.0)
	for cell in [Vector2i(13,19), Vector2i(16,20), Vector2i(23,21), Vector2i(29,18)]:
		_place_large_prop(cell, 5, false)

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
			if roll < 4:
				_place_large_prop(cell, 0, true)
			elif roll < 6 and biome in ["forest", "refuge", "lake"]:
				_place_large_prop(cell, 1, true)
			elif roll < 9:
				_detail.set_cell(cell, 0, Factory.SHRUB)
			elif roll < 11:
				_place_large_prop(cell, 4, true)
			elif roll == 11:
				_detail.set_cell(cell, 0, Factory.FLOWERS)
			elif roll == 12 and biome in ["ruins", "sanctuary", "boss"]:
				_place_large_prop(cell, 2, true)
			elif roll == 13 and biome in ["ruins", "sanctuary"]:
				_place_large_prop(cell, 3, true)

func _place_large_prop(cell: Vector2i, frame: int, collidable: bool) -> void:
	var sprite := Sprite2D.new()
	var atlas := AtlasTexture.new()
	atlas.atlas = LARGE_PROPS
	atlas.region = Rect2(Vector2(frame * 48, 0), Vector2(48, 48))
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = Vector2(cell.x * TILE_SIZE + 8, cell.y * TILE_SIZE - 8)
	_props.add_child(sprite)
	if collidable:
		var size := Vector2(14, 10)
		if frame == 4:
			size = Vector2(22, 12)
		elif frame in [2, 3]:
			size = Vector2(16, 14)
		_add_blocker(cell, size, Vector2(0, 3))

func _place_landmark(frame: int, center: Vector2) -> void:
	var sprite := Sprite2D.new()
	var atlas := AtlasTexture.new()
	atlas.atlas = LANDMARKS
	atlas.region = Rect2(Vector2(frame * 96, 0), Vector2(96, 80))
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = center
	_props.add_child(sprite)

func _place_chunk_landmarks() -> void:
	if chunk_coord == Vector2i(1, 3):
		_place_landmark(0, Vector2(320, 128))
		_add_rect_blocker(Rect2(272, 88, 96, 54))
		_add_rect_blocker(Rect2(272, 142, 37, 24))
		_add_rect_blocker(Rect2(331, 142, 37, 24))
	elif chunk_coord == Vector2i(2, 3):
		_place_landmark(1, Vector2(220, 190))
		_place_landmark(1, Vector2(370, 335))
		_add_rect_blocker(Rect2(172, 150, 96, 58))
		_add_rect_blocker(Rect2(322, 295, 96, 58))
	elif chunk_coord == Vector2i(3, 2):
		_place_landmark(2, Vector2(256, 216))
		_add_rect_blocker(Rect2(208, 196, 22, 60))
		_add_rect_blocker(Rect2(282, 196, 22, 60))
	elif chunk_coord == Vector2i(3, 1):
		_place_landmark(3, Vector2(250, 200))
		_add_rect_blocker(Rect2(226, 180, 48, 58))

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

func _add_rect_blocker(rect: Rect2) -> void:
	if rect.size.x <= 0.0 or rect.size.y <= 0.0:
		return
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	_blockers.add_child(body)

func _add_circle_blocker(center: Vector2, radius: float) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = center
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = radius
	collision.shape = shape
	body.add_child(collision)
	_blockers.add_child(body)

func _cell_roll(x: int, y: int) -> int:
	var n: int = seed_value ^ (x * 374761393) ^ (y * 668265263)
	n = (n ^ (n >> 13)) * 1274126177
	return absi(n) % 100

func _inside(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.y >= 0 and cell.x < CHUNK_TILES and cell.y < CHUNK_TILES
