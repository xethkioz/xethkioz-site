extends Node2D

const ATLAS := preload("res://assets/production/characters/p03_approved/alexis_runtime_atlas.png")
const FRAME_SIZE := Vector2(104, 96)
const FRAME_DOWN := 0
const FRAME_UP := 1
const FRAME_LEFT := 2
const FRAME_RIGHT := 3
const FRAME_WALK := 4
const FRAME_FROST_STRIKE := 5
const FRAME_SHADOW_STEP := 6
const FRAME_TRAP := 7
const FRAME_MENTOR_BUFF := 8

var _sprite: Sprite2D
var _clock := 0.0
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _move_speed := 86.0
var _action := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _state := "idle"

func _ready() -> void:
	_sprite = Sprite2D.new()
	_sprite.name = "ApprovedSprite"
	_sprite.texture = ATLAS
	_sprite.region_enabled = true
	_sprite.region_rect = Rect2(Vector2.ZERO, FRAME_SIZE)
	_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_sprite.centered = true
	_sprite.position = Vector2(0, -40)
	_sprite.z_index = 4
	add_child(_sprite)
	_apply_frame(FRAME_DOWN, false)

func update_from_actor(delta: float, facing_value: Vector2, velocity_value: Vector2, move_speed_value: float, action_value: String, action_left: float, action_total: float, hurt_left: float, downed_value: bool) -> void:
	_clock += delta
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_move_speed = maxf(1.0, move_speed_value)
	_action = action_value
	_action_left = maxf(0.0, action_left)
	_action_total = maxf(0.01, action_total)
	_hurt_left = maxf(0.0, hurt_left)
	_downed = downed_value
	_update_state()
	_update_pose()

func state_name() -> String:
	return _state

func approved_texture_path() -> String:
	return str(ATLAS.resource_path)

func frame_size() -> Vector2:
	return FRAME_SIZE

func _update_state() -> void:
	if _downed:
		_state = "downed"
	elif _hurt_left > 0.0:
		_state = "hurt"
	elif not _action.is_empty() and _action_left > 0.0:
		_state = _action
	elif _velocity.length_squared() > 16.0:
		_state = "walk_heavy"
	else:
		_state = "idle"

func _update_pose() -> void:
	if not is_instance_valid(_sprite):
		return
	var frame := _direction_frame(_facing)
	var flip_h := false
	var visual_position := Vector2(0.0, -40.0)
	var visual_scale := Vector2.ONE
	var visual_rotation := 0.0
	var alpha := 1.0
	var speed_ratio := clampf(_velocity.length() / _move_speed, 0.0, 1.6)

	match _state:
		"walk_heavy":
			frame = FRAME_WALK
			flip_h = _facing.x < -0.1
			var plant := sin(_clock * (6.2 + speed_ratio * 1.4))
			var transfer := sin(_clock * (3.1 + speed_ratio * 0.7))
			visual_position.y -= absf(plant) * 1.0 * maxf(0.35, speed_ratio)
			visual_position.x += transfer * 1.05 * clampf(speed_ratio, 0.0, 1.0)
			visual_rotation = -transfer * 0.018
			visual_scale = Vector2(1.0 + absf(plant) * 0.012, 1.0 - absf(plant) * 0.010)
		"frost_strike":
			frame = FRAME_FROST_STRIKE
			var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
			var anticipation := sin(clampf(progress / 0.42, 0.0, 1.0) * PI * 0.5)
			var impact := sin(clampf((progress - 0.35) / 0.65, 0.0, 1.0) * PI)
			visual_position -= _facing * (2.8 * anticipation)
			visual_position += _facing * (6.0 * impact)
			visual_rotation = -_facing.x * (0.05 * anticipation - 0.08 * impact)
			visual_scale = Vector2(1.0 + 0.055 * impact, 1.0 - 0.040 * impact)
		"shadow_step":
			frame = FRAME_SHADOW_STEP
			var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
			var vanish := sin(progress * PI)
			visual_position += _facing * (8.0 * progress)
			visual_scale = Vector2(1.0 + 0.08 * vanish, 1.0 - 0.07 * vanish)
			alpha = 1.0 - 0.38 * vanish
		"trap_place":
			frame = FRAME_TRAP
			var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
			var crouch := sin(progress * PI)
			visual_position.y += 3.0 * crouch
			visual_scale = Vector2(1.035, 1.0 - 0.065 * crouch)
		"mentor_buff":
			frame = FRAME_MENTOR_BUFF
			var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
			var brace := sin(progress * PI)
			visual_position.y -= 2.3 * brace
			visual_scale = Vector2.ONE * (1.0 + 0.035 * brace)
		"hurt":
			var recoil := clampf(_hurt_left / 0.18, 0.0, 1.0)
			visual_position -= _facing * (3.5 * recoil)
			visual_rotation = _facing.x * 0.065 * recoil
			visual_scale = Vector2(1.0 - 0.04 * recoil, 1.0 + 0.035 * recoil)
		"downed":
			visual_position.y += 6.0
			visual_rotation = 0.24 if _facing.x >= 0.0 else -0.24
			visual_scale = Vector2(1.08, 0.72)
			alpha = 0.72
		_:
			var breathe := sin(_clock * 1.55)
			visual_position.y += breathe * 0.34
			visual_scale = Vector2(1.0 + breathe * 0.003, 1.0 - breathe * 0.005)

	_apply_frame(frame, flip_h)
	_sprite.position = visual_position
	_sprite.rotation = visual_rotation
	_sprite.scale = visual_scale
	_sprite.modulate = Color(1.0, 0.56, 0.58, alpha) if _hurt_left > 0.0 else Color(1.0, 1.0, 1.0, alpha)

func _direction_frame(direction_value: Vector2) -> int:
	var direction := direction_value
	if direction.length_squared() <= 0.001:
		return FRAME_DOWN
	direction = direction.normalized()
	if absf(direction.x) > absf(direction.y):
		return FRAME_LEFT if direction.x < 0.0 else FRAME_RIGHT
	return FRAME_UP if direction.y < 0.0 else FRAME_DOWN

func _apply_frame(frame_index: int, flip_h: bool) -> void:
	if not is_instance_valid(_sprite):
		return
	var safe_index := clampi(frame_index, 0, 8)
	_sprite.region_rect = Rect2(Vector2(float(safe_index) * FRAME_SIZE.x, 0.0), FRAME_SIZE)
	_sprite.flip_h = flip_h
