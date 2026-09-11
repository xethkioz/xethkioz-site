class_name IzrdralarGenericChunk
extends "res://src/world/production_chunk.gd"

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

func _place_chunk_landmarks() -> void:
	# M01-M05 authored maps place landmarks explicitly from their layout data.
	# This intentionally disables GoldenRegion's hard-coded chunk-coordinate landmarks.
	pass
