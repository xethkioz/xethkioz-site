extends Node

func _ready() -> void:
	var packed := load("res://scenes/3d/TargetRoom3D.tscn") as PackedScene
	_assert(packed != null, "TargetRoom3D must load")
	var room := packed.instantiate()
	add_child(room)
	await get_tree().process_frame
	await get_tree().physics_frame

	var player := room.get_node_or_null("Player") as CharacterBody3D
	var camera := room.get_node_or_null("CameraRig") as Camera3D
	var interactable := room.get_node_or_null("InteractionProbe") as Area3D
	_assert(player != null, "Player3D missing")
	_assert(camera != null and camera.current, "Camera3D rig missing/current=false")
	_assert(interactable != null, "3D interactable missing")
	_assert(player.is_in_group("player"), "Player3D must be in player group")
	_assert(interactable.is_in_group("interactable3d"), "Interactable must be registered")
	_assert(player.has_method("save_runtime_state"), "3D save adapter missing")
	_assert(player.has_method("restore_runtime_state"), "3D restore adapter missing")
	_assert(player.has_method("_camera_relative_direction"), "Camera-relative movement contract missing")

	var forward = player.call("_camera_relative_direction", Vector2(0.0, -1.0))
	_assert(forward is Vector3 and float(forward.length()) > 0.9, "Camera-relative forward movement invalid")

	var start_position := player.global_position
	_assert(bool(player.call("save_runtime_state", "TARGET_ROOM_3D")), "3D runtime save failed")
	var payload := SaveService.load_game()
	_assert(payload.has("runtime"), "3D runtime payload missing")
	player.global_position = Vector3(4.0, 2.0, 4.0)
	_assert(bool(player.call("restore_runtime_state", payload)), "3D runtime restore failed")
	_assert(player.global_position.distance_to(start_position) < 0.01, "3D transform restore mismatch")

	_assert(bool(interactable.call("interact", player)), "3D interaction call failed")

	print("XETHKIOZ_3D_FOUNDATION_PASS")
	get_tree().quit(0)

func _assert(condition: bool, message: String) -> void:
	if condition:
		return
	push_error("XETHKIOZ_3D_FOUNDATION_FAIL: %s" % message)
	get_tree().quit(1)
