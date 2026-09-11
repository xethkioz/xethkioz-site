class_name IzrdralarGenericChunk
extends "res://src/world/production_chunk.gd"

const M01_WORLD_SEED := 21500809
const M02_WORLD_SEED := 21500829
const M03_WORLD_SEED := 21500849

var authored_world_seed: int = 0

func configure(coord: Vector2i, data: Dictionary, world_seed: int) -> void:
	authored_world_seed = world_seed
	super.configure(coord, data, world_seed)

func _carve_routes() -> void:
	# Settlement and boss spaces intentionally keep strong architectural axes.
	if biome in ["refuge", "boss"]:
		super._carve_routes()
		return

	var center: int = CHUNK_TILES >> 1
	var width: int = 4 if biome in ["forest", "river", "lake"] else 5
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

func _paint_route_center(center: int, width: int) -> void:
	var half: int = width >> 1
	for y in range(center - half, center + half + 1):
		for x in range(center - half, center + half + 1):
			if _inside(Vector2i(x, y)):
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.PATH_VARIANTS, x, y, 27))

func _organic_route_offset(value: int, start: int, finish: int) -> int:
	if finish <= start:
		return 0
	var t := clampf(float(value - start) / float(finish - start), 0.0, 1.0)
	# Zero displacement at chunk boundaries and at the shared center guarantees
	# seamless graph connectivity. Only the interior meanders.
	var taper := sin(t * PI)
	var phase := float((seed_value >> 3) & 31) * 0.17
	var amplitude := 2.1 if biome in ["forest", "river", "lake"] else 1.35
	return roundi(sin(float(value) * 0.48 + phase) * amplitude * taper)

func _decorate() -> void:
	match authored_world_seed:
		M01_WORLD_SEED:
			_decorate_m01()
		M02_WORLD_SEED:
			_decorate_m02()
		M03_WORLD_SEED:
			_decorate_m03()
		_:
			super._decorate()

func _decorate_m01() -> void:
	# Cuenca del Despertar: vegetation frames the encounter instead of filling it.
	# The opening combat, Xethkioz and the resonance objective remain readable at 640x360.
	var clearings: Array = [
		{"cell": Vector2(32, 38), "radius": 8.5},
		{"cell": Vector2(43, 32), "radius": 7.5},
		{"cell": Vector2(18, 38), "radius": 5.5},
		{"cell": Vector2(52, 36), "radius": 5.0}
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
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 51))
				elif roll == 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 52))
				continue
			if roll < 4:
				_place_large_prop(cell, 0, true)
			elif roll < 6:
				_place_large_prop(cell, 1, true)
			elif roll < 9:
				_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 53))
			elif roll < 11:
				_place_large_prop(cell, 4, true)
			elif roll == 11:
				_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 54))

	# Resonance accents around the authored opening objective. They are visual-only
	# so the combat route cannot be accidentally blocked.
	if chunk_coord == Vector2i(1, 1):
		_place_safe_prop(Vector2i(8, 4), 2, false)
		_place_safe_prop(Vector2i(14, 5), 2, false)

func _decorate_m02() -> void:
	# Aldea del Alba: keep a broad civic/plaza read around Ivan and Prisma-Atlas.
	var plaza_center := Vector2(32, 31)
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var world_cell := Vector2(_world_cell(cell))
			var roll: int = _cell_roll(x, y)
			if world_cell.distance_to(plaza_center) <= 13.5:
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 61))
				continue
			if roll < 3:
				_place_large_prop(cell, 0, true)
			elif roll == 3:
				_place_large_prop(cell, 1, true)
			elif roll < 7:
				_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 62))
			elif roll == 7:
				_place_large_prop(cell, 4, true)
			elif roll == 8:
				_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 63))

	# One prism beacon anchors the village center without competing with Ivan.
	if chunk_coord == Vector2i(1, 0):
		_place_safe_prop(Vector2i(4, 25), 2, false)

func _decorate_m03() -> void:
	# Lago Encantado: preserve the Val/Rola/Mela/Carpinchito hub as a readable
	# social space and concentrate wetland texture toward the lake chunks.
	var care_hub_center := Vector2(45, 44)
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var world_cell := Vector2(_world_cell(cell))
			var roll: int = _cell_roll(x, y)
			if world_cell.distance_to(care_hub_center) <= 10.5:
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 71))
				continue
			if biome == "lake":
				if roll < 3:
					_place_large_prop(cell, 5, false)
				elif roll < 5:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 72))
				elif roll == 5:
					_place_large_prop(cell, 4, true)
				elif roll == 6:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 73))
			else:
				if roll < 3:
					_place_large_prop(cell, 0, true)
				elif roll == 3:
					_place_large_prop(cell, 1, true)
				elif roll < 7:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 74))
				elif roll == 7:
					_place_large_prop(cell, 4, true)

func _world_cell(local_cell: Vector2i) -> Vector2i:
	return Vector2i(
		chunk_coord.x * CHUNK_TILES + local_cell.x,
		chunk_coord.y * CHUNK_TILES + local_cell.y
	)

func _inside_any_clearing(world_cell: Vector2i, clearings: Array) -> bool:
	var point := Vector2(world_cell)
	for clearing_value in clearings:
		var clearing: Dictionary = clearing_value
		var center: Vector2 = clearing.get("cell", Vector2.ZERO)
		var radius: float = float(clearing.get("radius", 0.0))
		if point.distance_to(center) <= radius:
			return true
	return false

func _place_safe_prop(cell: Vector2i, frame: int, collidable: bool) -> void:
	if not _inside(cell):
		return
	var base: Vector2i = _ground.get_cell_atlas_coords(cell)
	if Factory.is_protected_ground(base):
		return
	_place_large_prop(cell, frame, collidable)

func _place_chunk_landmarks() -> void:
	# Deterministic authored accents replace random prop noise without changing the
	# canonical layout graph. Layout data still owns story-critical landmarks.
	match authored_world_seed:
		M01_WORLD_SEED:
			if chunk_coord == Vector2i(0, 0):
				_place_safe_prop(Vector2i(15, 29), 0, true)
				_place_safe_prop(Vector2i(20, 28), 1, true)
			elif chunk_coord == Vector2i(0, 1):
				_place_safe_prop(Vector2i(14, 5), 0, true)
				_place_safe_prop(Vector2i(19, 7), 4, true)
			elif chunk_coord == Vector2i(1, 1):
				_place_safe_prop(Vector2i(15, 12), 0, true)
				_place_safe_prop(Vector2i(18, 13), 1, true)
				_place_safe_prop(Vector2i(3, 14), 4, true)
		M02_WORLD_SEED:
			if chunk_coord == Vector2i(1, 0):
				# Third home closes the plaza composition visible from Ivan.
				_place_landmark(1, Vector2(200, 400))
				_add_rect_blocker(Rect2(158, 405, 84, 46))
			elif chunk_coord == Vector2i(0, 1):
				_place_safe_prop(Vector2i(8, 8), 1, true)
				_place_safe_prop(Vector2i(11, 9), 0, true)
		M03_WORLD_SEED:
			if chunk_coord == Vector2i(1, 1):
				# Small care station gives Val/Rola/Mela a physical place in the lake hub.
				_place_landmark(1, Vector2(56, 120))
				_add_rect_blocker(Rect2(14, 126, 84, 42))
				_place_safe_prop(Vector2i(10, 12), 5, false)
				_place_safe_prop(Vector2i(13, 14), 5, false)
