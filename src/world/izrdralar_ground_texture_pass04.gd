class_name IzrdralarGroundTexturePass04
extends "res://src/world/izrdralar_ground_texture_pass03.gd"

# Visual Pass 04 keeps the Pass 03 palette and mark shapes, but lowers the
# micro-detail density. At 640x360 the previous values made the terrain read as
# a uniform field of dots instead of larger authored masses.

func _density_for_atlas(atlas: Vector2i) -> int:
	if Factory.DIRT_VARIANTS.has(atlas):
		return 17 if _biome == "boss" else 10
	if Factory.DARK_GRASS_VARIANTS.has(atlas):
		return 13
	if Factory.MUD_VARIANTS.has(atlas):
		return 17
	match _biome:
		"lake", "river":
			return 14
		"ruins", "sanctuary":
			return 13
		"refuge":
			return 9
		"boss":
			return 12
		_:
			return 11
