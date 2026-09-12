extends Node2D

const ATLAS := preload("res://assets/production/characters/p01_approved/viajero_runtime_atlas.png")
const FRAME_SIZE := Vector2(56, 72)
const FRAME_DOWN := 0
const FRAME_UP := 1
const FRAME_RIGHT := 2
const FRAME_LEFT := 3
const FRAME_DASH := 4
const FRAME_ATTACK := 5
const FRAME_BURST := 6

var _sprite: Sprite2D
var _clock: float = 0.0
var _facing: Vector2 = Vector2.DOWN
var _velocity: Vector2 = Vector2.ZERO
var _move_speed: float = 118.0
var _dash_left: float = 0.0
var _attack_left: float = 0.0
var _attack_total: float = 0.18
var _cast_left: float = 0.0
var _cast_total: float = 0.24
var _hit_left: float = 0.0
var _consume_pose: float = 0.0
var _body_scale: float = 1.0
var _state: String = "idle"

func _ready() -> void:
	_sprite = Sprite2D.new()
	_sprite.name = "ApprovedSprite"
	_sprite.texture = ATLAS
	_sprite.region_enabled = true
	_sprite.region_rect = Rect2(Vector2.ZERO, FRAME_SIZE)
	_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_sprite.centered = true
	_sprite.position = Vector2(0.0, -24.0)
	_sprite.z_index = 4
	add_child(_sprite)
	_apply_frame(FRAME_DOWN, false)

func configure_body_scale(value: float) -> void:
	_body_scale = clampf(value, 0.90, 1.10)

func update_from_player(delta: float, facing_value: Vector2, velocity_value: Vector2, move_speed_value: float, dash_left: float, attack_left: float, attack_total: float, cast_left: float, cast_total: float, hit_left: float) -> void:
	_clock += delta
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_move_speed = maxf(1.0, move_speed_value)
	_dash_left = maxf(0.0, dash_left)
	_attack_left = maxf(0.0, attack_left)
	_attack_total = maxf(0.01, attack_total)
	_cast_left = maxf(0.0, cast_left)
	_cast_total = maxf(0.01, cast_total)
	_hit_left = maxf(0.0, hit_left)
	_update_state()
	_update_pose()

func set_consumable_pose(value: float) -> void:
	_consume_pose = clampf(value, 0.0, 1.0)
	_update_state()
	_update_pose()

func state_name() -> String:
	return _state

func approved_texture_path() -> String:
	return str(ATLAS.resource_path)

func frame_size() -> Vector2:
	return FRAME_SIZE

func _update_state() -> void:
	if _hit_left > 0.0:
		_state = "hurt"
	elif _consume_pose > 0.001:
		_state = "consume"
	elif _attack_left > 0.0:
		_state = "attack"
	elif _cast_left > 0.0:
		_state = "burst"
	elif _dash_left > 0.0:
		_state = "dash"
	elif _velocity.length_squared() > 16.0:
		_state = "move"
	else:
		_state = "idle"

func _update_pose() -> void:
	if not is_instance_valid(_sprite):
		return
	var horizontal_dominant: bool = absf(_facing.x) >= absf(_facing.y) * 0.82
	var base_frame: int = _direction_frame(_facing)
	var frame: int = base_frame
	var flip_h: bool = false
	var base_position := Vector2(0.0, -24.0)
	var visual_position: Vector2 = base_position
	var visual_scale := Vector2(_body_scale, 1.0)
	var visual_rotation: float = 0.0
	var speed_ratio: float = clampf(_velocity.length() / _move_speed, 0.0, 1.8)

	match _state:
		"move":
			var step_wave: float = sin(_clock * (10.0 + speed_ratio * 2.5))
			var stride_wave: float = sin(_clock * (5.0 + speed_ratio * 1.5))
			visual_position.y -= absf(step_wave) * 1.35 * maxf(0.35, speed_ratio)
			visual_position.x += stride_wave * 0.55 * clampf(speed_ratio, 0.0, 1.0)
			visual_rotation = -_facing.x * step_wave * 0.018
			visual_scale = Vector2(_body_scale * (1.0 + absf(step_wave) * 0.018), 1.0 - absf(step_wave) * 0.015)
		"dash":
			var pulse: float = 0.65 + 0.35 * sin(_clock * 24.0)
			visual_position -= _facing * (2.5 + pulse * 1.5)
			visual_scale = Vector2(_body_scale * (1.08 + pulse * 0.025), 0.94)
			if horizontal_dominant:
				frame = FRAME_DASH
				flip_h = _facing.x < 0.0
			else:
				visual_rotation = -_facing.x * 0.07
		"attack":
			var progress: float = 1.0 - clampf(_attack_left / _attack_total, 0.0, 1.0)
			var thrust: float = sin(progress * PI)
			visual_position += _facing * (4.0 * thrust)
			visual_scale = Vector2(_body_scale * (1.0 + 0.07 * thrust), 1.0 - 0.045 * thrust)
			if horizontal_dominant:
				frame = FRAME_ATTACK
				flip_h = _facing.x < 0.0
			else:
				visual_rotation = -_facing.x * 0.06 * thrust
		"burst":
			var progress: float = 1.0 - clampf(_cast_left / _cast_total, 0.0, 1.0)
			var pulse: float = sin(progress * PI)
			frame = FRAME_BURST
			visual_position.y -= 2.5 * pulse
			visual_scale = Vector2.ONE * (1.0 + 0.045 * pulse)
			visual_scale.x *= _body_scale
		"consume":
			var pose: float = _consume_pose
			visual_position.y += 1.2 * pose
			visual_position.x += _facing.x * 0.8 * pose
			visual_rotation = -_facing.x * 0.035 * pose
			visual_scale = Vector2(_body_scale * (1.0 - 0.025 * pose), 1.0 + 0.025 * pose)
		"hurt":
			var recoil: float = clampf(_hit_left / 0.13, 0.0, 1.0)
			visual_position -= _facing * (2.5 * recoil)
			visual_rotation = _facing.x * 0.055 * recoil
			visual_scale = Vector2(_body_scale * (1.0 - 0.035 * recoil), 1.0 + 0.035 * recoil)
		_:
			var breathe: float = sin(_clock * 2.1)
			visual_position.y += breathe * 0.28
			visual_scale = Vector2(_body_scale * (1.0 + breathe * 0.004), 1.0 - breathe * 0.004)

	_apply_frame(frame, flip_h)
	_sprite.position = visual_position
	_sprite.rotation = visual_rotation
	_sprite.scale = visual_scale
	_sprite.modulate = Color(1.0, 0.58, 0.56, 1.0) if _hit_left > 0.0 else Color.WHITE

func _direction_frame(direction_value: Vector2) -> int:
	var direction: Vector2 = direction_value
	if direction.length_squared() <= 0.001:
		return FRAME_DOWN
	direction = direction.normalized()
	if absf(direction.x) > absf(direction.y):
		return FRAME_LEFT if direction.x < 0.0 else FRAME_RIGHT
	return FRAME_UP if direction.y < 0.0 else FRAME_DOWN

func _apply_frame(frame_index: int, flip_h: bool) -> void:
	if not is_instance_valid(_sprite):
		return
	var safe_index := clampi(frame_index, 0, 6)
	_sprite.region_rect = Rect2(Vector2(float(safe_index) * FRAME_SIZE.x, 0.0), FRAME_SIZE)
	_sprite.flip_h = flip_h
