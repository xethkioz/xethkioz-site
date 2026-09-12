extends "res://src/player/player_controller_production.gd"

# Feel layer for the authored Izrdralar production pass. Damage, hitboxes,
# cooldowns and progression stay in the parent controller; this layer adds
# camera feedback plus short action commitment so attacks do not read like
# normal movement with an effect drawn on top.

var _world_camera: Camera2D
var _camera_shake_left := 0.0
var _camera_shake_duration := 0.0
var _camera_shake_strength := 0.0
var _camera_shake_clock := 0.0

func _ready() -> void:
	super._ready()
	_world_camera = get_node_or_null("WorldCamera") as Camera2D

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	_update_camera_feedback(delta)

func _apply_ground_movement(input_vector: Vector2, delta: float) -> void:
	# Dash is handled before this method by the base controller and therefore
	# remains a responsive cancel. Ground movement alone is briefly committed.
	if _attack_pose_left > 0.0:
		super._apply_ground_movement(input_vector * 0.22, delta)
		velocity = velocity.limit_length(move_speed * 0.52)
		return
	if _cast_pose_left > 0.0:
		super._apply_ground_movement(input_vector * 0.52, delta)
		velocity = velocity.limit_length(move_speed * 0.72)
		return
	super._apply_ground_movement(input_vector, delta)

func _spawn_feedback(kind_value: String, world_position: Vector2, direction_value: Vector2, color_value: Color, text_value: String) -> void:
	super._spawn_feedback(kind_value, world_position, direction_value, color_value, text_value)
	match kind_value:
		"burst":
			_kick_camera(0.095, 2.4)
		"hurt":
			_kick_camera(0.13, 3.2)
		"line", "shot", "charge":
			_kick_camera(0.055, 1.15)
		_:
			pass

func _kick_camera(duration: float, strength: float) -> void:
	if not is_instance_valid(_world_camera):
		return
	var effective_strength := strength * (0.22 if AccessibilityService.reduce_camera_motion else 1.0)
	var effective_duration := duration * (0.55 if AccessibilityService.reduce_camera_motion else 1.0)
	# Stronger feedback wins when multiple effects happen in the same frame.
	if effective_strength >= _camera_shake_strength or _camera_shake_left <= 0.0:
		_camera_shake_duration = maxf(0.01, effective_duration)
		_camera_shake_strength = effective_strength
	_camera_shake_left = maxf(_camera_shake_left, effective_duration)

func _update_camera_feedback(delta: float) -> void:
	if not is_instance_valid(_world_camera):
		return
	if _camera_shake_left <= 0.0:
		_world_camera.offset = Vector2.ZERO
		_camera_shake_strength = 0.0
		_camera_shake_clock = 0.0
		return

	_camera_shake_left = maxf(0.0, _camera_shake_left - delta)
	_camera_shake_clock += delta
	var duration := maxf(0.01, _camera_shake_duration)
	var decay := clampf(_camera_shake_left / duration, 0.0, 1.0)
	var wave := Vector2(
		sin(_camera_shake_clock * 91.0),
		cos(_camera_shake_clock * 73.0)
	)
	_world_camera.offset = wave * _camera_shake_strength * decay
