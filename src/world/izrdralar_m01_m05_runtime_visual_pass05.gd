class_name IzrdralarM01M05RuntimeVisualPass05
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass04.gd"

const VisualChunkPass05 := preload("res://src/world/izrdralar_visual_chunk_pass05.gd")

# Pass 05 deliberately inherits all validated Pass 04 runtime/story/landmark
# behavior and swaps only the chunk presentation layer. This keeps the M02
# second house family and all existing authored interactions untouched.

func _build_chunks() -> void:
	var chunks: Dictionary = map_data.get("chunks", {})
	var world_seed := int(map_data.get("world_seed", 21500809))
	for key_value in chunks.keys():
		var key := str(key_value)
		var parts := key.split(",")
		if parts.size() != 2:
			continue
		var coord := Vector2i(int(parts[0]), int(parts[1]))
		var chunk := Node2D.new()
		chunk.name = "Chunk_%s" % key.replace(",", "_")
		chunk.set_script(VisualChunkPass05)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)
