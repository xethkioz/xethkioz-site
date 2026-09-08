extends "res://src/pets/familiar_companion.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
const SNAP_DISTANCE := 205.0

var _visual: Sprite2D
var _motion_velocity := Vector2.ZERO
var _motion_clock: float = 0.0
var _step_clock: float = 0.0
var _last_move_direction := Vector2.RIGHT

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "FamiliarVisual"
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(128, 0), Vector2(32, 32))
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)

func _process(delta: float) -> void:
	_pulse += delta
	_motion_clock += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return

	var player_facing: Vector2 = _player.get("facing") if _player.get("facing") is Vector2 else Vector2.DOWN
	if player_facing.length_squared() <= 0.001:
		player_facing = Vector2.DOWN
	player_facing = player_facing.normalized()
	var side := Vector2(-player_facing.y, player_facing.x)
	var desired: Vector2 = _player.global_position - player_facing * 31.0 + side * 25.0
	var player_distance: float = global_position.distance_to(_player.global_position)

	if player_distance > SNAP_DISTANCE:
		global_position = desired
		_motion_velocity = Vector2.ZERO
	else:
		var offset: Vector2 = desired - global_position
		var distance: float = offset.length()
		if distance > 9.0:
			var speed_factor: float = clampf(distance / 66.0, 0.42, 1.45)
			var desired_velocity: Vector2 = offset.normalized() * follow_speed * speed_factor
			_motion_velocity = _motion_velocity.move_toward(desired_velocity, 610.0 * delta)
		else:
			_motion_velocity = _motion_velocity.move_toward(Vector2.ZERO, 520.0 * delta)
		global_position += _motion_velocity * delta

	if _motion_velocity.length_squared() > 16.0:
		_last_move_direction = _motion_velocity.normalized()
		_step_clock += delta * clampf(_motion_velocity.length() / 75.0, 0.8, 1.7)
	else:
		_step_clock = 0.0
	_update_visual()
	queue_redraw()

func _update_visual() -> void:
	if not is_instance_valid(_visual):
		return
	var moving: bool = _motion_velocity.length_squared() > 16.0
	var hop: float = absf(sin(_step_clock * 8.2)) * 2.6 if moving else sin(_motion_clock * 2.2) * 0.45
	var squash: float = sin(_step_clock * 8.2) if moving else 0.0
	_visual.position = Vector2(0.0, -7.0 - hop)
	_visual.scale = Vector2(1.0 + maxf(0.0, squash) * 0.035, 1.0 - maxf(0.0, squash) * 0.045)
	if absf(_last_move_direction.x) > 0.08:
		_visual.flip_h = _last_move_direction.x < 0.0

func _draw() -> void:
	var glow: float = 0.15 + sin(_pulse * 3.0) * 0.035
	draw_circle(Vector2(0, 4), 9.0, Color(0.55, 0.36, 0.96, glow))
	var moving: bool = _motion_velocity.length_squared() > 36.0
	if moving:
		var step_phase: float = absf(sin(_step_clock * 8.2))
		var shadow_width: float = 7.0 + step_phase * 2.0
		draw_line(Vector2(-shadow_width, 7), Vector2(shadow_width, 7), Color(0.03, 0.04, 0.05, 0.24), 2.0)
		if step_phase < 0.18:
			draw_circle(Vector2(-7, 6), 1.2, Color(0.62, 0.54, 0.42, 0.30))
			draw_circle(Vector2(6, 7), 1.0, Color(0.62, 0.54, 0.42, 0.24))
