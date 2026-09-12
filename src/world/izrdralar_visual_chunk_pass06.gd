class_name IzrdralarVisualChunkPass06
extends "res://src/world/izrdralar_visual_chunk_pass05.gd"

# Pass 06 targets the remaining procedural read of M01-M03. It changes only
# decoration density/composition: routes, authored clearings, collision shapes,
# lake geometry, encounters and story coordinates remain authoritative.

func _decorate_m01() -> void:
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
			var world_cell := Vector2(_world_cell(cell))
			var roll := _cell_roll(x, y)
			if _inside_any_clearing(world_cell, clearings):
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 251))
				elif roll == 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 252))
				continue

			var field := _macro_field(world_cell, 0.35)
			if field > 1.05:
				if roll < 7:
					_place_large_prop(cell, 0, true)
				elif roll < 11:
					_place_large_prop(cell, 1, true)
				elif roll < 18:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 253))
			elif field < -1.20:
				if roll < 4:
					_place_large_prop(cell, 4, true)
				elif roll < 10:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 254))
				elif roll == 10:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 255))
			else:
				if roll < 2:
					_place_large_prop(cell, 0, true)
				elif roll < 5:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 256))
				elif roll == 5:
					_place_large_prop(cell, 4, true)

	if chunk_coord == Vector2i(1, 1):
		_place_safe_prop(Vector2i(8, 4), 2, false)
		_place_safe_prop(Vector2i(14, 5), 2, false)

func _decorate_m02() -> void:
	var plaza_center := Vector2(32, 31)
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var world_cell := Vector2(_world_cell(cell))
			var roll := _cell_roll(x, y)
			var plaza_distance := world_cell.distance_to(plaza_center)
			if plaza_distance <= 13.5:
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 261))
				elif roll == 2 and plaza_distance > 8.0:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 262))
				continue

			var field := _macro_field(world_cell, 1.60)
			if field > 1.18:
				if roll < 6:
					_place_large_prop(cell, 0, true)
				elif roll < 9:
					_place_large_prop(cell, 1, true)
				elif roll < 15:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 263))
			elif field < -1.30:
				if roll < 3:
					_place_large_prop(cell, 4, true)
				elif roll < 8:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 264))
			else:
				if roll < 2:
					_place_large_prop(cell, 0, true)
				elif roll < 5:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 265))

	if chunk_coord == Vector2i(1, 0):
		_place_safe_prop(Vector2i(4, 25), 2, false)

func _decorate_m03() -> void:
	var care_hub_center := Vector2(45, 44)
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var world_cell := Vector2(_world_cell(cell))
			var roll := _cell_roll(x, y)
			if world_cell.distance_to(care_hub_center) <= 10.5:
				if roll < 2:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 271))
				elif roll == 2:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 272))
				continue

			if biome == "lake":
				# Shoreline reeds already come from Pass 05. Keep the broader wetland
				# sparse so the irregular lake silhouette remains the visual anchor.
				if roll < 4:
					_place_large_prop(cell, 5, false)
				elif roll < 9:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 273))
				elif roll == 9:
					_place_large_prop(cell, 4, true)
				continue

			var field := _macro_field(world_cell, 2.75)
			if field > 1.25:
				if roll < 5:
					_place_large_prop(cell, 0, true)
				elif roll < 8:
					_place_large_prop(cell, 1, true)
				elif roll < 14:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 274))
			elif field < -1.15:
				if roll < 3:
					_place_large_prop(cell, 4, true)
				elif roll < 9:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 275))
				elif roll == 9:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 276))
			else:
				if roll < 2:
					_place_large_prop(cell, 0, true)
				elif roll < 5:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 277))

func _macro_field(world_cell: Vector2, phase: float) -> float:
	var value := sin(world_cell.x * 0.17 + phase)
	value += cos(world_cell.y * 0.13 - phase * 0.55)
	value += sin((world_cell.x + world_cell.y) * 0.075 + phase * 1.7)
	return value
