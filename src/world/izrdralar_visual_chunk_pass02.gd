extends "res://src/world/izrdralar_generic_chunk.gd"

# Visual Production Pass 02
# Keeps authored navigation/collision intact while reducing the prototype-like
# grid of oversized paths and clearings visible at the 640x360 target.

func _carve_routes() -> void:
	var center: int = CHUNK_TILES >> 1
	# Three tiles = 48 px. This preserves traversal readability without turning
	# every connected chunk into a broad tan cross.
	var width: int = 3
	_paint_route_center(center, width)

	if bool(exits.get("n", false)):
		for y in range(0, center + 1):
			var offset := _organic_route_offset(y, 0, center)
			_paint_path_band(Vector2i(center + offset, y), width, true)
	if bool(exits.get("s", false)):
		for y in range(center, CHUNK_TILES):
			var offset := _organic_route_offset(y, center, CHUNK_TILES - 1)
			_paint_path_band(Vector2i(center + offset, y), width, true)
	if bool(exits.get("w", false)):
		for x in range(0, center + 1):
			var offset := _organic_route_offset(x, 0, center)
			_paint_path_band(Vector2i(x, center + offset), width, false)
	if bool(exits.get("e", false)):
		for x in range(center, CHUNK_TILES):
			var offset := _organic_route_offset(x, center, CHUNK_TILES - 1)
			_paint_path_band(Vector2i(x, center + offset), width, false)

func _paint_refuge_clearance() -> void:
	# M02 only: replace the old 16x13-tile rectangles with two authored village
	# clearings. Routes remain connected, but grass returns between buildings.
	if authored_world_seed != M02_WORLD_SEED:
		super._paint_refuge_clearance()
		return

	var center := Vector2(16, 16)
	var radius_x := 6.5
	var radius_y := 5.0
	if chunk_coord == Vector2i(1, 0):
		# Iván + Prisma-Atlas civic clearing near the lower half of this chunk.
		center = Vector2(16, 26)
		radius_x = 8.0
		radius_y = 4.8
	elif chunk_coord == Vector2i(0, 1):
		# West residential clearing. Smaller on purpose so the village reads as a
		# place inside the forest instead of a tiled plaza covering the whole map.
		center = Vector2(22, 8)
		radius_x = 7.0
		radius_y = 4.3

	for y in range(2, CHUNK_TILES - 2):
		for x in range(2, CHUNK_TILES - 2):
			var nx: float = (float(x) - center.x) / radius_x
			var ny: float = (float(y) - center.y) / radius_y
			var distance_sq := nx * nx + ny * ny
			if distance_sq <= 1.0:
				# Dirt in the outer lip, lighter path only in the walkable core. The
				# irregular threshold breaks the old rectangular/plaza appearance.
				var roll: int = _cell_roll(x + 401, y + 809)
				if distance_sq > 0.72 or roll % 7 == 0:
					_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DIRT_VARIANTS, x, y, 114))
				else:
					_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.PATH_VARIANTS, x, y, 115))

func _paint_boss_arena() -> void:
	# Preserve the exact boss space and collision contract, but shrink the solid
	# brown disk so M05 still reads as the Corazón del Bosque rather than a bare
	# dirt test arena.
	var center := Vector2(16, 16)
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var distance: float = Vector2(x, y).distance_to(center)
			if distance < 10.0:
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DIRT_VARIANTS, x, y, 121))
			elif distance < 11.6:
				var roll: int = _cell_roll(x + 613, y + 337)
				if roll % 3 != 0:
					_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DARK_GRASS_VARIANTS, x, y, 122))
				_detail.set_cell(Vector2i(x, y), 0, _variant(Factory.CLIFF_VARIANTS, x, y, 123))
