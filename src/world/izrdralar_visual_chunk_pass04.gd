class_name IzrdralarVisualChunkPass04
extends "res://src/world/izrdralar_visual_chunk_pass02.gd"

const GroundTexturePass04 := preload("res://src/world/izrdralar_ground_texture_pass04.gd")
const TerrainEdgePass04 := preload("res://src/world/izrdralar_terrain_edge_pass04.gd")

# Visual Pass 04 only changes presentation. Navigation, collisions, exits and
# authored encounter positions remain exactly as defined by the production data.

func _install_ground_texture_pass() -> void:
	if not is_instance_valid(_ground) or get_node_or_null("GroundTexturePass04") != null:
		return
	var old := get_node_or_null("GroundTexturePass03")
	if old != null:
		remove_child(old)
		old.queue_free()
	var texture_pass := Node2D.new()
	texture_pass.name = "GroundTexturePass04"
	texture_pass.set_script(GroundTexturePass04)
	add_child(texture_pass)
	texture_pass.call("configure", _ground, biome, seed_value)

func _install_terrain_edge_pass() -> void:
	if not is_instance_valid(_ground) or get_node_or_null("TerrainEdgePass04") != null:
		return
	var old := get_node_or_null("TerrainEdgePass03")
	if old != null:
		remove_child(old)
		old.queue_free()
	var edge_pass := Node2D.new()
	edge_pass.name = "TerrainEdgePass04"
	edge_pass.set_script(TerrainEdgePass04)
	add_child(edge_pass)
	edge_pass.call("configure", _ground, biome, seed_value)

func _carve_routes() -> void:
	if biome != "boss":
		super._carve_routes()
		return

	# Boss approach lanes use the same earth family as the clearing. The former
	# pale path cross made M05 look like an isolated test arena even after the
	# organic clearing pass. This remains purely visual: exits and movement space
	# are unchanged.
	var center := CHUNK_TILES >> 1
	var width := 3
	_paint_boss_route_band(Vector2i(center, center), width, true)
	if bool(exits.get("n", false)):
		for y in range(0, center + 1):
			var offset := _organic_route_offset(y, 0, center)
			_paint_boss_route_band(Vector2i(center + offset, y), width, true)
	if bool(exits.get("s", false)):
		for y in range(center, CHUNK_TILES):
			var offset := _organic_route_offset(y, center, CHUNK_TILES - 1)
			_paint_boss_route_band(Vector2i(center + offset, y), width, true)
	if bool(exits.get("w", false)):
		for x in range(0, center + 1):
			var offset := _organic_route_offset(x, 0, center)
			_paint_boss_route_band(Vector2i(x, center + offset), width, false)
	if bool(exits.get("e", false)):
		for x in range(center, CHUNK_TILES):
			var offset := _organic_route_offset(x, center, CHUNK_TILES - 1)
			_paint_boss_route_band(Vector2i(x, center + offset), width, false)

func _paint_boss_route_band(center: Vector2i, width: int, vertical: bool) -> void:
	var half := width >> 1
	for offset in range(-half, half + 1):
		var cell := center + (Vector2i(offset, 0) if vertical else Vector2i(0, offset))
		if _inside(cell):
			_ground.set_cell(cell, 0, _variant(Factory.DIRT_VARIANTS, cell.x, cell.y, 124))

func _paint_boss_arena() -> void:
	# The old arena used a near-perfect circular threshold. At runtime that still
	# read as a test arena, so the same safe combat footprint is now expressed as
	# an irregular forest clearing with a broken fringe.
	var center := Vector2(16, 16)
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var delta := Vector2(float(x), float(y)) - center
			var distance := delta.length()
			var angle := atan2(delta.y, delta.x)
			var wobble := sin(angle * 3.0 + 0.65) * 0.85
			wobble += sin(angle * 7.0 - 0.35) * 0.48
			wobble += (float(_cell_roll(x + 701, y + 419) % 7) - 3.0) * 0.08
			var dirt_radius := 9.45 + wobble
			var fringe_radius := dirt_radius + 1.65
			if distance < dirt_radius:
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DIRT_VARIANTS, x, y, 121))
			elif distance < fringe_radius:
				var roll := _cell_roll(x + 613, y + 337)
				if roll % 4 != 0:
					_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DARK_GRASS_VARIANTS, x, y, 122))
				if roll % 3 != 0:
					_detail.set_cell(Vector2i(x, y), 0, _variant(Factory.CLIFF_VARIANTS, x, y, 123))

func _decorate_m04() -> void:
	# Keep the ruin/sanctuary readable while lowering the repeated rock/crystal
	# cadence visible in the real 640x360 capture. Major authored prism anchors
	# remain; ambient props become supporting texture instead of a pattern.
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
			var roll := _cell_roll(x, y)
			if _inside_any_clearing(world_cell, clearings):
				if roll == 0:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 181))
				elif roll == 1 and _sparse_visual_gate(x, y, 11):
					_detail.set_cell(cell, 0, _variant(Factory.CRYSTAL_VARIANTS, x, y, 182))
				continue

			if biome == "ruins":
				if roll == 0 and _sparse_visual_gate(x, y, 2):
					_place_large_prop(cell, 3, true)
				elif roll == 1 and _sparse_visual_gate(x, y, 2):
					_place_large_prop(cell, 4, true)
				elif roll == 2 and _sparse_visual_gate(x, y, 4):
					_place_large_prop(cell, 0, true)
				elif roll in [3, 4, 5, 6]:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 183))
				elif roll == 7:
					_detail.set_cell(cell, 0, _variant(Factory.ROCK_VARIANTS, x, y, 184))
				elif roll == 8 and _sparse_visual_gate(x, y, 7):
					_place_large_prop(cell, 2, false)
			elif biome == "sanctuary":
				if roll == 0 and _sparse_visual_gate(x, y, 5):
					_place_large_prop(cell, 2, false)
				elif roll == 1 and _sparse_visual_gate(x, y, 2):
					_place_large_prop(cell, 3, true)
				elif roll == 2 and _sparse_visual_gate(x, y, 2):
					_place_large_prop(cell, 4, true)
				elif roll in [3, 4, 5, 6]:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 185))
				elif roll == 7:
					_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 186))
				elif roll == 8:
					_detail.set_cell(cell, 0, _variant(Factory.ROCK_VARIANTS, x, y, 187))
			else:
				if roll == 0:
					_place_large_prop(cell, 0, true)
				elif roll == 1 and _sparse_visual_gate(x, y, 2):
					_place_large_prop(cell, 1, true)
				elif roll in [2, 3, 4]:
					_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 188))
				elif roll == 5:
					_place_large_prop(cell, 4, true)

	if chunk_coord == Vector2i(1, 1):
		_place_safe_prop(Vector2i(12, 9), 2, false)
		_place_safe_prop(Vector2i(27, 24), 2, false)

func _decorate_m05() -> void:
	var arena_center := Vector2(16, 15)
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var cell := Vector2i(x, y)
			var base: Vector2i = _ground.get_cell_atlas_coords(cell)
			if Factory.is_protected_ground(base):
				continue
			var distance_to_arena := Vector2(x, y).distance_to(arena_center)
			var roll := _cell_roll(x, y)
			if distance_to_arena <= 11.0:
				if roll == 0 and _sparse_visual_gate(x, y, 4):
					_detail.set_cell(cell, 0, _variant(Factory.CRYSTAL_VARIANTS, x, y, 191))
				continue
			if roll == 0 and _sparse_visual_gate(x, y, 2):
				_place_large_prop(cell, 0, false)
			elif roll == 1 and _sparse_visual_gate(x, y, 2):
				_place_large_prop(cell, 3, false)
			elif roll == 2:
				_place_large_prop(cell, 4, false)
			elif roll in [3, 4, 5]:
				_detail.set_cell(cell, 0, _variant(Factory.SHRUB_VARIANTS, x, y, 192))
			elif roll == 6:
				_detail.set_cell(cell, 0, _variant(Factory.FLOWER_VARIANTS, x, y, 193))

	# Keep four ritual anchors, but break the old perfect square composition.
	if chunk_coord == Vector2i.ZERO:
		for anchor in [Vector2i(5, 7), Vector2i(26, 6), Vector2i(7, 26), Vector2i(25, 24)]:
			_place_safe_prop(anchor, 2, false)
