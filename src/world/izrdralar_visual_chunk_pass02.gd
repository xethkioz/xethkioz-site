extends "res://src/world/izrdralar_generic_chunk.gd"

# Visual Production Pass 02
# Keeps authored navigation/collision intact while reducing the prototype-like
# grid of oversized paths and clearings visible at the 640x360 target.

func _fill_base() -> void:
	super._fill_base()
	# Coarse seeded mosaics break the flat green carpet without changing any
	# navigation contract. Later route/water/ruin passes remain authoritative.
	match authored_world_seed:
		M01_WORLD_SEED:
			_apply_ground_mosaic(Factory.DARK_GRASS_VARIANTS, 18, 211)
		M02_WORLD_SEED:
			_apply_ground_mosaic(Factory.DARK_GRASS_VARIANTS, 9, 223)
		M03_WORLD_SEED:
			if biome == "lake":
				_apply_ground_mosaic(Factory.MUD_VARIANTS, 20, 227)
			else:
				_apply_ground_mosaic(Factory.DARK_GRASS_VARIANTS, 11, 229)
		M04_WORLD_SEED:
			if biome == "forest":
				_apply_ground_mosaic(Factory.DARK_GRASS_VARIANTS, 12, 233)
		_:
			pass

func _apply_ground_mosaic(variants: Array, patch_threshold: int, salt: int) -> void:
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var coarse_x := floori(float(x) / 4.0)
			var coarse_y := floori(float(y) / 4.0)
			var patch_roll := _cell_roll(coarse_x + salt, coarse_y + salt * 2)
			var edge_roll := _cell_roll(x + salt * 3, y + salt * 5)
			if patch_roll < patch_threshold and edge_roll < 76:
				_ground.set_cell(Vector2i(x, y), 0, _variant(variants, x, y, salt))

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

func _decorate_m04() -> void:
	# M04 needs visual silence around its story beats. Large prisms remain as
	# authored wayfinding accents instead of repeating as general-purpose clutter.
	var clearings: Array = [
		{"cell": Vector2(22, 16), "radius": 6.0},
		{"cell": Vector2(35, 31), "radius": 5.5},
		{"cell": Vector2(48, 40), "radius": 7.0},
		{"cell": Vector2(48, 46), "radius": 9.5},
		{"cell": Vector2(55, 53), "radius": 7.0}
	]
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var world_cell := _world_cell(cell)
			var roll: int = _cell_roll(x, y)
			if _inside_any_clearing(world_cell, clearings):
				if roll == 0:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 181))
				elif roll == 1 and _sparse_visual_gate(x, y, 5):
					_detail.set_cell(cell, 0, _variant(Factory.CRYSTAL_VARIANTS, x, y, 182))
				continue

			if biome == "ruins":
				if roll < 2:
					_place_large_prop(cell, 3, true)
				elif roll < 4:
					_place_large_prop(cell, 4, true)
				elif roll == 4:
					_place_large_prop(cell, 0, true)
				elif roll < 9:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 183))
				elif roll == 9:
					_detail.set_cell(cell, 0, _variant(Factory.ROCK_VARIANTS, x, y, 184))
				elif roll == 10 and _sparse_visual_gate(x, y, 4):
					_place_large_prop(cell, 2, false)
			elif biome == "sanctuary":
				if roll == 0 and _sparse_visual_gate(x, y, 3):
					_place_large_prop(cell, 2, false)
				elif roll == 1:
					_place_large_prop(cell, 3, true)
				elif roll < 4:
					_place_large_prop(cell, 4, true)
				elif roll < 9:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 185))
				elif roll == 9:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 186))
				elif roll == 10:
					_detail.set_cell(cell, 0, _variant(Factory.ROCK_VARIANTS, x, y, 187))
			else:
				if roll < 2:
					_place_large_prop(cell, 0, true)
				elif roll == 2:
					_place_large_prop(cell, 1, true)
				elif roll < 6:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 188))
				elif roll == 6:
					_place_large_prop(cell, 4, true)

	# Four major prisms remain across the authored sanctuary area: two here and
	# two in _place_chunk_landmarks(). They now read as deliberate landmarks.
	if chunk_coord == Vector2i(1, 1):
		_place_safe_prop(Vector2i(12, 9), 2, false)
		_place_safe_prop(Vector2i(27, 24), 2, false)

func _place_large_prop(cell: Vector2i, frame: int, collidable: bool) -> void:
	super._place_large_prop(cell, frame, collidable)
	# Mirroring only changes silhouette. Position and collision remain untouched.
	if not is_instance_valid(_props) or _props.get_child_count() == 0:
		return
	var visual := _props.get_child(_props.get_child_count() - 1)
	if visual is Sprite2D:
		(visual as Sprite2D).flip_h = (_cell_roll(cell.x + frame * 31, cell.y + 907) % 2) == 0

func _sparse_visual_gate(x: int, y: int, modulus: int) -> bool:
	return posmod(x * 7 + y * 11 + chunk_coord.x * 13 + chunk_coord.y * 17, modulus) == 0
