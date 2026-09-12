class_name IzrdralarM01M05RuntimeVisualPass07
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass06.gd"

const VisualChunkPass07 := preload("res://src/world/izrdralar_visual_chunk_pass07.gd")

# Pass 07 preserves every validated route, story beat, collision and encounter.
# Only the presentation class changes so M01-M05 can use two original prop
# families with deterministic authored variation.
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
		chunk.set_script(VisualChunkPass07)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)
