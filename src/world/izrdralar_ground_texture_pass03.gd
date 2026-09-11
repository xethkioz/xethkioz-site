class_name IzrdralarGroundTexturePass03
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
	z_index = -15
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_build_marks()
	queue_redraw()

func _build_marks() -> void:
	_marks.clear()
	if not is_instance_valid(_ground):
		return
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var cell := Vector2i(x, y)
			var atlas: Vector2i = _ground.get_cell_atlas_coords(cell)
			if atlas == Vector2i(-1, -1) or Factory.is_protected_ground(atlas):
				continue
			var roll := _hash(x, y, 17) % 100
			var density := _density_for_atlas(atlas)
			if roll >= density:
				continue
			var local_x := x * TILE_SIZE + 2 + int(_hash(x, y, 31) % 13)
			var local_y := y * TILE_SIZE + 2 + int(_hash(x, y, 47) % 13)
			var kind := int(_hash(x, y, 59) % 4)
			var palette := _palette_for(atlas)
			var color_index := int(_hash(x, y, 73) % max(1, palette.size()))
			_marks.append({
				"position": Vector2(local_x, local_y),
				"kind": kind,
				"color": palette[color_index]
			})

func _density_for_atlas(atlas: Vector2i) -> int:
	if Factory.DIRT_VARIANTS.has(atlas):
		return 28 if _biome == "boss" else 16
	if Factory.DARK_GRASS_VARIANTS.has(atlas):
		return 24
	if Factory.MUD_VARIANTS.has(atlas):
		return 30
	match _biome:
		"lake", "river":
			return 24
		"ruins", "sanctuary":
			return 22
		"refuge":
			return 16
		"boss":
			return 20
		_:
			return 19

func _palette_for(atlas: Vector2i) -> PackedColorArray:
	if Factory.DIRT_VARIANTS.has(atlas):
		return PackedColorArray([
			Color(0.25, 0.18, 0.13, 0.28),
			Color(0.52, 0.37, 0.23, 0.25),
			Color(0.20, 0.12, 0.16, 0.20)
		])
	if Factory.MUD_VARIANTS.has(atlas):
		return PackedColorArray([
			Color(0.15, 0.24, 0.21, 0.34),
			Color(0.31, 0.32, 0.23, 0.28),
			Color(0.20, 0.43, 0.39, 0.22)
		])
	match _biome:
		"lake", "river":
			return PackedColorArray([
				Color(0.10, 0.28, 0.25, 0.32),
				Color(0.25, 0.47, 0.38, 0.24),
				Color(0.18, 0.43, 0.46, 0.20)
			])
		"ruins", "sanctuary":
			return PackedColorArray([
				Color(0.13, 0.27, 0.21, 0.34),
				Color(0.35, 0.40, 0.37, 0.22),
				Color(0.42, 0.31, 0.62, 0.16)
			])
		"refuge":
			return PackedColorArray([
				Color(0.16, 0.34, 0.24, 0.26),
				Color(0.37, 0.49, 0.29, 0.20),
				Color(0.62, 0.42, 0.22, 0.18)
			])
		"boss":
			return PackedColorArray([
				Color(0.12, 0.20, 0.16, 0.32),
				Color(0.35, 0.22, 0.17, 0.24),
				Color(0.49, 0.33, 0.75, 0.16)
			])
		_:
			return PackedColorArray([
				Color(0.10, 0.27, 0.19, 0.30),
				Color(0.34, 0.51, 0.30, 0.22),
				Color(0.69, 0.43, 0.20, 0.16)
			])

func _draw() -> void:
	for mark in _marks:
		var point: Vector2 = mark["position"]
		var kind: int = int(mark["kind"])
		var color_value: Color = mark["color"]
		match kind:
			0:
				# Broken grass/moss blade; asymmetric on purpose to avoid tile rhythm.
				draw_rect(Rect2(point + Vector2(-1, 0), Vector2(1, 3)), color_value, true)
				draw_rect(Rect2(point + Vector2(0, 1), Vector2(2, 1)), color_value, true)
			1:
				# Small soil/stone fleck.
				draw_rect(Rect2(point, Vector2(3, 1)), color_value, true)
				draw_rect(Rect2(point + Vector2(1, 1), Vector2(1, 1)), color_value, true)
			2:
				# Low shadow patch that may cross the 16 px cell boundary.
				draw_rect(Rect2(point + Vector2(-3, -1), Vector2(7, 2)), color_value, true)
			3:
				# Leaf/reed pair.
				draw_rect(Rect2(point + Vector2(-1, 0), Vector2(2, 1)), color_value, true)
				draw_rect(Rect2(point + Vector2(1, -2), Vector2(1, 3)), color_value, true)

func _hash(x: int, y: int, salt: int) -> int:
	var n := _seed_value ^ (x * 73856093) ^ (y * 19349663) ^ (salt * 83492791)
	n = (n ^ (n >> 13)) * 1274126177
	return absi(n)
