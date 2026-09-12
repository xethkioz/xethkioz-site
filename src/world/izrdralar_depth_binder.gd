class_name IzrdralarDepthBinder
extends Node

var _target: Node2D
var _foot_offset := 0.0

func configure(target: Node2D, foot_offset: float = 0.0) -> void:
	_target = target
	_foot_offset = foot_offset
	if is_instance_valid(_target):
		_target.set_meta("izrdralar_depth_offset", _foot_offset)
	_sync_depth()

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_sync_depth()

func _process(_delta: float) -> void:
	_sync_depth()

func _sync_depth() -> void:
	if not is_instance_valid(_target):
		return
	# World Y is the visual foot line. Keeping the range below CanvasItem's hard
	# limits leaves room for local accents such as nameplates and telegraphs.
	_target.z_index = clampi(roundi(_target.global_position.y + _foot_offset), -3900, 3900)
