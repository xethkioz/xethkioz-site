extends "res://src/world/production_chunk.gd"

# Generic map-chain chunks intentionally suppress the old Golden Region
# hard-coded landmark coordinates. Map identity comes from the 01-32 manifest.
func _place_chunk_landmarks() -> void:
	pass
