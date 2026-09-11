class_name IzrdralarTerrainEdgePass04
extends "res://src/world/izrdralar_terrain_edge_pass03.gd"

# Pass 04 keeps the underlying collision/ground contract untouched. It only
# breaks the visible 16 px cadence of water cells with bank intrusions, broken
# foam and slightly denser reeds so M03 reads as a natural shore at 640x360.

func _draw_water_edge(origin: Vector2, side: int, roll: int) -> void:
	var bank := _edge_grass_color()
	var wet := Color(0.10, 0.27, 0.29, 0.84)
	var foam := Color(0.58, 0.84, 0.86, 0.62)

	# A short wet shadow anchors the bank without outlining every complete tile.
	var wet_start := 1 + posmod(roll >> 2, 5)
	var wet_span := 5 + posmod(roll >> 6, 6)
	_draw_edge_strip(origin, side, wet_start, wet_span, 2, wet)

	# Grass/mud pixels intrude into the water tile by different depths. This is
	# presentation-only, but visually removes the ruler-straight shoreline.
	var nub_a := 2 + posmod(roll >> 9, 10)
	var nub_b := 2 + posmod(roll >> 13, 9)
	_draw_edge_nub(origin, side, nub_a, 3 + posmod(roll, 2), bank)
	if posmod(roll, 3) != 0:
		_draw_edge_nub(origin, side, nub_b, 2 + posmod(roll >> 4, 2), bank)

	# Foam is intentionally fragmented; a full continuous white edge made the
	# lake look like a rectangular UI element in the previous captures.
	if posmod(roll, 5) != 0:
		var foam_start := 3 + posmod(roll >> 5, 6)
		_draw_edge_strip(origin, side, foam_start, 2 + posmod(roll >> 11, 3), 1, foam)

	if _biome in ["lake", "river"] and posmod(roll, 4) == 0:
		var reed := Color(0.30, 0.48, 0.27, 0.78)
		_draw_reed(origin, side, 3 + posmod(roll >> 15, 8), reed)
