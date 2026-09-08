extends "res://src/world/production_chunk.gd"

const AUTHORED_CHUNKS := [Vector2i(1, 3), Vector2i(2, 3)]

func _decorate() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._decorate()

func _place_chunk_landmarks() -> void:
	if AUTHORED_CHUNKS.has(chunk_coord):
		return
	super._place_chunk_landmarks()
