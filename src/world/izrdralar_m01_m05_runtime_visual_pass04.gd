class_name IzrdralarM01M05RuntimeVisualPass04
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass02.gd"

const VisualChunkPass04 := preload("res://src/world/izrdralar_visual_chunk_pass04.gd")
const LandmarkPass04 := preload("res://src/world/izrdralar_authored_landmark_pass04.gd")

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
		chunk.set_script(VisualChunkPass04)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)

func _build_landmarks() -> void:
	for landmark_value in map_data.get("landmarks", []):
		if not (landmark_value is Dictionary):
			continue
		var data: Dictionary = landmark_value
		var landmark := Node2D.new()
		landmark.name = "Landmark_%s" % str(data.get("id", "authored"))
		landmark.set_script(LandmarkPass04)
		landmark.position = _vector_from_array(data.get("position", [0, 0]))
		landmark.call("configure", data)
		add_child(landmark)
