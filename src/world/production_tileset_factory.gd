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

static func build() -> TileSet:
	var tile_set := TileSet.new()
	tile_set.tile_size = TILE_SIZE
	var atlas := TileSetAtlasSource.new()
	atlas.texture = ATLAS_TEXTURE
	atlas.texture_region_size = TILE_SIZE
	for y in range(2):
		for x in range(8):
			atlas.create_tile(Vector2i(x, y))
	tile_set.add_source(atlas, 0)
	return tile_set
