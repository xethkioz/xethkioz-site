class_name IzrdralarVisualChunkPass04
extends "res://src/world/izrdralar_visual_chunk_pass02.gd"

# Visual Pass 04 only changes presentation. Navigation, collisions, exits and
# authored encounter positions remain exactly as defined by the production data.

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
