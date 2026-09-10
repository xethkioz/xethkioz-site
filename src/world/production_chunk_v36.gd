extends "res://src/world/production_chunk.gd"

const AUTHORED_CHUNKS := [Vector2i(1, 3), Vector2i(2, 3)]

func _fill_base() -> void:
	if not AUTHORED_CHUNKS.has(chunk_coord):
		super._fill_base()
		return
	# Cuenca/Aldea arrancan desde un campo neutro. Caminos, claros,
	# humedal, edificios y detalle los define exclusivamente el layout
	# autoral v3.6, evitando que se filtre la geometría procedural vieja.
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			_ground.set_cell(Vector2i(x, y), 0, Factory.GRASS)

func _carve_routes() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._carve_routes()

func _apply_biome_features() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._apply_biome_features()

func _decorate() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._decorate()

func _place_chunk_landmarks() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._place_chunk_landmarks()
