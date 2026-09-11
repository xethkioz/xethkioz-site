extends "res://src/world/izrdralar_m01_m05_runtime.gd"

const VisualChunkScript := preload("res://src/world/izrdralar_visual_chunk_pass02.gd")
const CompactHudScript := preload("res://src/ui/hud_controller_production_compact.gd")

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
		chunk.set_script(VisualChunkScript)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)

func _spawn_hud() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(CompactHudScript)
	add_child(hud)
