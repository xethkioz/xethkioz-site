extends "res://src/world/golden_region_controller.gd"

const AuthoredChunkScript := preload("res://src/world/production_chunk_v36.gd")

func _load_chunk(coord: Vector2i) -> void:
	var key := _chunk_key(coord)
	var data: Dictionary = manifest.get("chunks", {}).get(key, {})
	if data.is_empty():
		return
	var chunk := Node2D.new()
	chunk.name = "Chunk_%s" % key.replace(",", "_")
	chunk.set_script(AuthoredChunkScript)
	add_child(chunk)
	move_child(chunk, 0)
	chunk.configure(coord, data, int(manifest.get("world_seed", 21500809)))
	active_chunks[key] = chunk
