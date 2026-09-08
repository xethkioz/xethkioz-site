class_name ProductionTilesetFactory
extends RefCounted

const ATLAS_TEXTURE := preload("res://assets/production/izrdralar/izrdralar_tiles.svg")
const TILE_SIZE := Vector2i(16, 16)

const GRASS := Vector2i(0, 0)
const FLOWERS := Vector2i(1, 0)
const DIRT := Vector2i(2, 0)
const PATH := Vector2i(3, 0)
const WATER := Vector2i(4, 0)
const WATER_FOAM := Vector2i(5, 0)
const ROCK := Vector2i(6, 0)
const CLIFF := Vector2i(7, 0)
const DARK_GRASS := Vector2i(0, 1)
const SHRUB := Vector2i(1, 1)
const TREE := Vector2i(2, 1)
const CRYSTAL := Vector2i(3, 1)
const RUIN_FLOOR := Vector2i(4, 1)
const RUIN_WALL := Vector2i(5, 1)
const BRIDGE := Vector2i(6, 1)
const MUD := Vector2i(7, 1)

const GRASS_VARIANTS = [GRASS, Vector2i(0, 2)]
const FLOWER_VARIANTS = [FLOWERS, Vector2i(1, 2)]
const DIRT_VARIANTS = [DIRT, Vector2i(2, 2)]
const PATH_VARIANTS = [PATH, Vector2i(3, 2)]
const WATER_VARIANTS = [WATER, Vector2i(4, 2)]
const WATER_FOAM_VARIANTS = [WATER_FOAM, Vector2i(5, 2)]
const ROCK_VARIANTS = [ROCK, Vector2i(6, 2)]
const CLIFF_VARIANTS = [CLIFF, Vector2i(7, 2)]
const DARK_GRASS_VARIANTS = [DARK_GRASS, Vector2i(0, 3)]
const SHRUB_VARIANTS = [SHRUB, Vector2i(1, 3)]
const TREE_VARIANTS = [TREE, Vector2i(2, 3)]
const CRYSTAL_VARIANTS = [CRYSTAL, Vector2i(3, 3)]
const RUIN_FLOOR_VARIANTS = [RUIN_FLOOR, Vector2i(4, 3)]
const RUIN_WALL_VARIANTS = [RUIN_WALL, Vector2i(5, 3)]
const BRIDGE_VARIANTS = [BRIDGE, Vector2i(6, 3)]
const MUD_VARIANTS = [MUD, Vector2i(7, 3)]

static func build() -> TileSet:
	var tile_set := TileSet.new()
	tile_set.tile_size = TILE_SIZE
	var atlas := TileSetAtlasSource.new()
	atlas.texture = ATLAS_TEXTURE
	atlas.texture_region_size = TILE_SIZE
	for y in range(4):
		for x in range(8):
			atlas.create_tile(Vector2i(x, y))
	tile_set.add_source(atlas, 0)
	return tile_set

static func choose(variants: Array, roll: int) -> Vector2i:
	if variants.is_empty():
		return GRASS
	var index: int = posmod(roll, variants.size())
	var tile: Vector2i = variants[index]
	return tile

static func is_path(tile: Vector2i) -> bool:
	return PATH_VARIANTS.has(tile)

static func is_water(tile: Vector2i) -> bool:
	return WATER_VARIANTS.has(tile) or WATER_FOAM_VARIANTS.has(tile)

static func is_bridge(tile: Vector2i) -> bool:
	return BRIDGE_VARIANTS.has(tile)

static func is_ruin_floor(tile: Vector2i) -> bool:
	return RUIN_FLOOR_VARIANTS.has(tile)

static func is_protected_ground(tile: Vector2i) -> bool:
	return is_path(tile) or is_water(tile) or is_bridge(tile) or is_ruin_floor(tile)
