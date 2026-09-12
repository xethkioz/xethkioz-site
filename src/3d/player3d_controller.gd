class_name XethkiozPlayer3D
extends CharacterBody3D

@export var move_speed: float = 5.4
@export var acceleration: float = 22.0
@export var deceleration: float = 28.0
@export var turn_speed: float = 10.0
@export var dash_speed: float = 11.5
@export var dash_duration: float = 0.16
@export var dash_cooldown: float = 0.65
@export var interaction_range: float = 2.0
@export var camera_path: NodePath
@export var restore_saved_transform_on_ready: bool = false

var _camera: Camera3D
var _gravity: float = 9.8
var _dash_left: float = 0.0
var _dash_cooldown_left: float = 0.0
var _last_move_direction: Vector3 = Vector3.FORWARD

func _ready() -> void:
	add_to_group("player")
	_ensure_core_inputs()
	_gravity = float(ProjectSettings.get_setting("physics/3d/default_gravity", 9.8))
	_camera = get_node_or_null(camera_path) as Camera3D
	if restore_saved_transform_on_ready:
		restore_runtime_state()

func _physics_process(delta: float) -> void:
	_dash_left = maxf(0.0, _dash_left - delta)
	_dash_cooldown_left = maxf(0.0, _dash_cooldown_left - delta)

	if not is_on_floor():
		velocity.y -= _gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	var move_direction := _camera_relative_direction(input_vector)
	if move_direction.length_squared() > 0.0001:
		_last_move_direction = move_direction

	if Input.is_action_just_pressed("dash") and _dash_cooldown_left <= 0.0 and _last_move_direction.length_squared() > 0.0001:
		_dash_left = dash_duration
		_dash_cooldown_left = dash_cooldown

	if _dash_left > 0.0:
		velocity.x = _last_move_direction.x * dash_speed
		velocity.z = _last_move_direction.z * dash_speed
	else:
		_apply_ground_movement(move_direction, delta)

	_update_facing(move_direction, delta)
	move_and_slide()

	if Input.is_action_just_pressed("interact"):
		_interact_with_nearest()

func _apply_ground_movement(direction: Vector3, delta: float) -> void:
	var horizontal := Vector3(velocity.x, 0.0, velocity.z)
	var target := direction * move_speed
	var response := acceleration if direction.length_squared() > 0.0001 else deceleration
	horizontal = horizontal.move_toward(target, response * delta)
	velocity.x = horizontal.x
	velocity.z = horizontal.z

func _camera_relative_direction(input_vector: Vector2) -> Vector3:
	if input_vector.length_squared() <= 0.0001:
		return Vector3.ZERO
	if not is_instance_valid(_camera):
		_camera = get_viewport().get_camera_3d()
	if not is_instance_valid(_camera):
		return Vector3(input_vector.x, 0.0, input_vector.y).normalized()

	var forward := -_camera.global_transform.basis.z
	var right := _camera.global_transform.basis.x
	forward.y = 0.0
	right.y = 0.0
	forward = forward.normalized()
	right = right.normalized()
	return (right * input_vector.x + forward * -input_vector.y).normalized()

func _update_facing(direction: Vector3, delta: float) -> void:
	if direction.length_squared() <= 0.0001:
		return
	var target_yaw := atan2(-direction.x, -direction.z)
	rotation.y = lerp_angle(rotation.y, target_yaw, minf(1.0, turn_speed * delta))

func _interact_with_nearest() -> bool:
	var nearest: Node3D = null
	var nearest_distance := interaction_range
	for candidate in get_tree().get_nodes_in_group("interactable3d"):
		if candidate is not Node3D or not is_instance_valid(candidate):
			continue
		var distance := global_position.distance_to(candidate.global_position)
		if distance <= nearest_distance:
			nearest = candidate
			nearest_distance = distance
	if nearest == null or not nearest.has_method("interact"):
		return false
	return bool(nearest.call("interact", self))

func save_runtime_state(scene_id: String = "TARGET_ROOM_3D") -> bool:
	var runtime := {
		"mode": "3d",
		"scene_id": scene_id,
		"world3d": {
			"position": [global_position.x, global_position.y, global_position.z],
			"rotation_y": rotation.y
		}
	}
	return SaveService.save_game({"runtime": runtime})

func restore_runtime_state(payload: Dictionary = {}) -> bool:
	var source := payload
	if source.is_empty():
		source = SaveService.load_game()
	var runtime = source.get("runtime", {})
	if runtime is not Dictionary or str(runtime.get("mode", "")) != "3d":
		return false
	var world3d = runtime.get("world3d", {})
	if world3d is not Dictionary:
		return false
	var position_data = world3d.get("position", [])
	if position_data is not Array or position_data.size() != 3:
		return false
	global_position = Vector3(float(position_data[0]), float(position_data[1]), float(position_data[2]))
	rotation.y = float(world3d.get("rotation_y", rotation.y))
	return true

func _ensure_core_inputs() -> void:
	var bindings := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"dash": [KEY_SHIFT],
		"attack": [KEY_J],
		"interact": [KEY_C]
	}
	for action in bindings.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		if not InputMap.action_get_events(action).is_empty():
			continue
		for keycode in bindings[action]:
			var event := InputEventKey.new()
			event.physical_keycode = int(keycode)
			InputMap.action_add_event(action, event)
