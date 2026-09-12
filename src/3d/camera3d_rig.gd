class_name XethkiozCamera3DRig
extends Camera3D

@export var target_path: NodePath
@export var offset := Vector3(7.5, 9.5, 7.5)
@export var focus_height: float = 1.15
@export var follow_smoothing: float = 7.5
@export var look_smoothing: float = 10.0

var _target: Node3D
var _look_point := Vector3.ZERO

func _ready() -> void:
	_target = get_node_or_null(target_path) as Node3D
	if is_instance_valid(_target):
		global_position = _target.global_position + offset
		_look_point = _target.global_position + Vector3.UP * focus_height
		look_at(_look_point, Vector3.UP)

func _process(delta: float) -> void:
	if not is_instance_valid(_target):
		_target = get_node_or_null(target_path) as Node3D
		if not is_instance_valid(_target):
			return

	var position_weight := 1.0 - exp(-follow_smoothing * delta)
	var look_weight := 1.0 - exp(-look_smoothing * delta)
	var desired_position := _target.global_position + offset
	var desired_look := _target.global_position + Vector3.UP * focus_height
	global_position = global_position.lerp(desired_position, position_weight)
	_look_point = _look_point.lerp(desired_look, look_weight)
	look_at(_look_point, Vector3.UP)
