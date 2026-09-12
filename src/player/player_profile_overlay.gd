extends Node2D

const ApprovedVisualScript := preload("res://src/player/viajero_approved_visual.gd")

var _player: CharacterBody2D
var _approved_visual: Node2D
var _technical_visual_hidden := false

func configure(player_ref: CharacterBody2D) -> void:
	_player = player_ref
	_hide_technical_visual()

func _ready() -> void:
	z_index = 5
	_approved_visual = Node2D.new()
	_approved_visual.name = "ViajeroApprovedVisual"
	_approved_visual.set_script(ApprovedVisualScript)
	add_child(_approved_visual)
	_hide_technical_visual()
	_sync_visual_state()

func _process(_delta: float) -> void:
	if not is_instance_valid(_player):
		_player = get_parent() as CharacterBody2D
	if not is_instance_valid(_player) or not is_instance_valid(_approved_visual):
		return
	_hide_technical_visual()
	_sync_visual_state()

func _hide_technical_visual() -> void:
	if not is_instance_valid(_player):
		return
	var technical_visual := _player.get_node_or_null("ViajeroVisual") as CanvasItem
	if technical_visual != null and technical_visual.visible:
		technical_visual.visible = false
	_technical_visual_hidden = technical_visual != null

func _sync_visual_state() -> void:
	var facing_value: Vector2 = _player.get("facing") if _player.get("facing") is Vector2 else Vector2.DOWN
	_approved_visual.call("set_facing", facing_value)
	_approved_visual.call("set_resonance_color", CharacterProfile.accent_color_value())

	var hit_left := float(_player.get("_hit_flash_left")) if _player.get("_hit_flash_left") != null else 0.0
	var attack_left := float(_player.get("_attack_pose_left")) if _player.get("_attack_pose_left") != null else 0.0
	var cast_left := float(_player.get("_cast_pose_left")) if _player.get("_cast_pose_left") != null else 0.0
	var dash_left := float(_player.get("_dash_time_left")) if _player.get("_dash_time_left") != null else 0.0
	var velocity_value: Vector2 = _player.velocity

	var next_action: StringName = &"idle"
	if hit_left > 0.0:
		next_action = &"hurt"
	elif attack_left > 0.0:
		next_action = &"attack"
	elif cast_left > 0.0:
		next_action = &"burst"
	elif dash_left > 0.0:
		next_action = &"dash"
	elif velocity_value.length_squared() > 25.0:
		var move_speed_value := float(_player.get("move_speed")) if _player.get("move_speed") != null else 118.0
		next_action = &"run" if velocity_value.length() >= move_speed_value * 0.78 else &"walk"

	_approved_visual.call("set_action", next_action, 0)
