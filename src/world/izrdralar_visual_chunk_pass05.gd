class_name IzrdralarVisualChunkPass05
extends "res://src/world/izrdralar_visual_chunk_pass04.gd"

# Visual Pass 05 starts from the validated Pass 04 checkpoint. Its first target
# is M03's macro shoreline. The existing lake collision circle is preserved and
# always remains inside the visual water mass, so the art pass cannot create a
# walkable-looking blocked shore or a visually dry traversable water strip.

func _paint_lake() -> void:
	var center := Vector2(21, 11)
	var phase := float(posmod(seed_value, 41)) * 0.11
	for y in range(1, CHUNK_TILES - 1):
		for x in range(1, CHUNK_TILES - 1):
			var delta := Vector2(float(x), float(y)) - center
			var distance := delta.length()
			var angle := atan2(delta.y, delta.x)

			# Minimum water radius stays above the 124 px / 7.75 tile blocker.
			# Low-frequency waves shape the macro silhouette; tiny deterministic
			# variation only prevents repeated identical arcs between lake chunks.
			var water_radius := 8.38
			water_radius += sin(angle * 3.0 + phase) * 0.34
			water_radius += sin(angle * 5.0 - phase * 0.7) * 0.20
			water_radius += (float(_cell_roll(x + 211, y + 547) % 5) - 2.0) * 0.04
			water_radius = maxf(7.90, water_radius)
			var foam_radius := water_radius + 0.82 + sin(angle * 4.0 + 0.4) * 0.10

			if distance < water_radius:
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.WATER_VARIANTS, x, y, 206))
			elif distance < foam_radius:
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.WATER_FOAM_VARIANTS, x, y, 207))

	# Preserve the production collision contract. The center matches the tile
	# center used by the previous authored lake implementation.
	_add_circle_blocker(Vector2(344, 184), 124.0)

	# Non-colliding reed clusters sit on deliberately different points of the new
	# shoreline. They provide scale and hide remaining tile cadence at 640x360.
	for cell in [Vector2i(13, 18), Vector2i(16, 20), Vector2i(24, 20), Vector2i(29, 17)]:
		_place_large_prop(cell, 5, false)
