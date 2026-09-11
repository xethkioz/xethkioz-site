extends "res://src/world/izrdralar_m01_m05_runtime.gd"

const VisualChunkScript := preload("res://src/world/izrdralar_visual_chunk_pass02.gd")
const CompactHudScript := preload("res://src/ui/hud_controller_production_compact.gd")
const IntegratedLandmarkScript := preload("res://src/world/izrdralar_authored_landmark_pass02.gd")
const ImpactPlayerScript := preload("res://src/player/player_controller_production_pass02.gd")

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

func _build_landmarks() -> void:
	for landmark_value in map_data.get("landmarks", []):
		if not (landmark_value is Dictionary):
			continue
		var data: Dictionary = landmark_value
		var landmark := Node2D.new()
		landmark.name = "Landmark_%s" % str(data.get("id", "authored"))
		landmark.set_script(IntegratedLandmarkScript)
		landmark.position = _vector_from_array(data.get("position", [0, 0]))
		landmark.call("configure", data)
		add_child(landmark)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(ImpactPlayerScript)
	player.position = _initial_entry_position()
	var collision := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)
	var camera := Camera2D.new()
	camera.name = "WorldCamera"
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 7.5
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(_world_size.x)
	camera.limit_bottom = int(_world_size.y)
	camera.zoom = Vector2.ONE
	player.add_child(camera)
	add_child(player)

func _spawn_hud() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(CompactHudScript)
	add_child(hud)
