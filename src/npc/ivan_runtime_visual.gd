extends Node2D

const COLOR_COAT := Color("#34495E")
const COLOR_DARK := Color("#1B2631")
const COLOR_CYAN := Color("#00D2FF")
const COLOR_YELLOW := Color("#FFD700")
const COLOR_SKIN := Color("#E4C6A6")

var _clock := 0.0
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _move_speed := 96.0
var _action := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _state := "idle_calculating"

func update_from_actor(
	delta: float,
	facing_value: Vector2,
	velocity_value: Vector2,
	move_speed_value: float,
	action_value: String,
	action_left: float,
	action_total: float,
	hurt_left: float,
	downed_value: bool
) -> void:
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
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_id() -> String:
	return "P04_IVAN_QUANTUM_SCIENTIST_V1"

func _update_state() -> void:
	if _downed:
		_state = "downed"
	elif _hurt_left > 0.0:
		_state = "hurt"
	elif not _action.is_empty() and _action_left > 0.0:
		_state = _action
	elif _velocity.length_squared() > 16.0:
		_state = "walk_fast"
	else:
		_state = "idle_calculating"

func _draw() -> void:
	var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
	var speed_ratio := clampf(_velocity.length() / _move_speed, 0.0, 1.4)
	var facing_sign := -1.0 if _facing.x < -0.1 else 1.0
	var bob := sin(_clock * (2.0 if _state == "idle_calculating" else 6.4)) * (0.7 + speed_ratio * 0.8)
	var alpha := 1.0
	var local_shift := Vector2(0.0, bob)

	if _state == "quantum_teleport":
		alpha = 0.42 + absf(sin(progress * PI)) * 0.28
		local_shift += _facing * (progress * 5.0)
	elif _state == "hurt":
		local_shift -= _facing * 4.0
	elif _state == "downed":
		local_shift.y += 7.0

	draw_set_transform(local_shift, 0.0, Vector2.ONE)
	_draw_shadow(alpha)
	_draw_body(facing_sign, alpha)
	_draw_device(alpha)
	_draw_state_fx(progress, alpha)
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

func _draw_shadow(alpha: float) -> void:
	var color := Color(0.01, 0.03, 0.05, 0.28 * alpha)
	var shadow := PackedVector2Array()
	for i in range(18):
		var angle := TAU * float(i) / 18.0
		shadow.append(Vector2(cos(angle) * 13.0, 13.0 + sin(angle) * 4.2))
	draw_colored_polygon(shadow, color)

func _draw_body(facing_sign: float, alpha: float) -> void:
	var coat := Color(COLOR_COAT.r, COLOR_COAT.g, COLOR_COAT.b, alpha)
	var dark := Color(COLOR_DARK.r, COLOR_DARK.g, COLOR_DARK.b, alpha)
	var cyan := Color(COLOR_CYAN.r, COLOR_CYAN.g, COLOR_CYAN.b, alpha)
	var skin := Color(COLOR_SKIN.r, COLOR_SKIN.g, COLOR_SKIN.b, alpha)

	draw_rect(Rect2(-8, 5, 6, 15), dark, true)
	draw_rect(Rect2(2, 5, 6, 15), dark, true)
	draw_rect(Rect2(-9, 17, 8, 4), Color(0.04, 0.06, 0.09, alpha), true)
	draw_rect(Rect2(1, 17, 8, 4), Color(0.04, 0.06, 0.09, alpha), true)

	var coat_points := PackedVector2Array([
		Vector2(-13, -16), Vector2(13, -16), Vector2(10, 10),
		Vector2(4, 14), Vector2(0, 5), Vector2(-4, 14), Vector2(-10, 10)
	])
	draw_colored_polygon(coat_points, coat)
	draw_line(Vector2(0, -14), Vector2(0, 7), cyan, 1.2)
	draw_rect(Rect2(-11, -2, 4, 6), Color(0.11, 0.18, 0.24, alpha), true)

	draw_circle(Vector2(0, -25), 7.0, skin)
	draw_colored_polygon(PackedVector2Array([
		Vector2(-8, -28), Vector2(-5, -35), Vector2(-1, -31),
		Vector2(3, -36), Vector2(8, -29), Vector2(6, -24), Vector2(-6, -24)
	]), Color(0.78, 0.82, 0.85, alpha))
	draw_line(Vector2(-6, -25), Vector2(6, -25), cyan, 2.0)
	draw_circle(Vector2(-3, -25), 1.4, Color(0.65, 0.95, 1.0, alpha))
	draw_circle(Vector2(3, -25), 1.4, Color(0.65, 0.95, 1.0, alpha))

	var arm_y := -7.0
	draw_line(Vector2(-11, -10), Vector2(-17 * facing_sign, arm_y), coat, 5.0)
	draw_line(Vector2(11, -10), Vector2(17 * facing_sign, arm_y), coat, 5.0)
	draw_circle(Vector2(-18 * facing_sign, arm_y), 3.2, dark)
	draw_circle(Vector2(18 * facing_sign, arm_y), 3.2, dark)
	draw_arc(Vector2(18 * facing_sign, arm_y), 4.4, 0.0, TAU, 12, cyan, 1.3)

func _draw_device(alpha: float) -> void:
	var cyan := Color(COLOR_CYAN.r, COLOR_CYAN.g, COLOR_CYAN.b, alpha)
	var panel_center := Vector2(14, -18)
	draw_rect(Rect2(panel_center - Vector2(5, 4), Vector2(10, 8)), Color(0.03, 0.12, 0.17, 0.82 * alpha), true)
	draw_rect(Rect2(panel_center - Vector2(5, 4), Vector2(10, 8)), cyan, false, 1.0)
	if _state in ["idle_calculating", "analyze_device"]:
		draw_line(panel_center + Vector2(-3, -1), panel_center + Vector2(3, -1), cyan, 1.0)
		draw_line(panel_center + Vector2(-3, 2), panel_center + Vector2(1, 2), cyan, 1.0)

func _draw_state_fx(progress: float, alpha: float) -> void:
	var cyan := Color(COLOR_CYAN.r, COLOR_CYAN.g, COLOR_CYAN.b, alpha)
	var yellow := Color(COLOR_YELLOW.r, COLOR_YELLOW.g, COLOR_YELLOW.b, alpha)
	match _state:
		"lightning_strike":
			var tip := _facing * 30.0 + Vector2(0, -7)
			var origin := _facing * 12.0 + Vector2(0, -7)
			var perpendicular := Vector2(-_facing.y, _facing.x)
			var points := PackedVector2Array([
				origin,
				origin.lerp(tip, 0.32) + perpendicular * sin(progress * 19.0) * 4.0,
				origin.lerp(tip, 0.66) - perpendicular * 3.0,
				tip
			])
			draw_polyline(points, cyan, 2.2)
			draw_circle(tip, 3.0 + progress * 2.0, yellow)
		"quantum_teleport":
			for i in range(3):
				draw_arc(Vector2(0, -8), 10.0 + float(i) * 6.0 + progress * 4.0, 0.0, TAU, 24, Color(cyan.r, cyan.g, cyan.b, (0.65 - float(i) * 0.13) * alpha), 1.5)
		"emp_field":
			var radius := 12.0 + progress * 24.0
			draw_arc(Vector2(0, 3), radius, 0.0, TAU, 30, cyan, 2.0)
			draw_arc(Vector2(0, 3), radius * 0.66, 0.0, TAU, 22, yellow, 1.0)
		"overclock_buff":
			for i in range(4):
				var angle := _clock * 2.4 + TAU * float(i) / 4.0
				var p := Vector2(0, -8) + Vector2.from_angle(angle) * 19.0
				draw_circle(p, 2.2, yellow if i % 2 == 0 else cyan)
		"analyze_device":
			var radius := 11.0 + sin(_clock * 4.0) * 1.5
			draw_arc(Vector2(0, -11), radius, -PI * 0.85, PI * 0.85, 24, cyan, 1.6)
			draw_line(Vector2(-20, -11), Vector2(20, -11), Color(cyan.r, cyan.g, cyan.b, 0.32), 1.0)
		"hurt":
			draw_circle(Vector2(0, -10), 18.0, Color(1.0, 0.35, 0.22, 0.12 * alpha))
		"downed":
			draw_line(Vector2(-15, 18), Vector2(15, 18), Color(cyan.r, cyan.g, cyan.b, 0.35), 1.0)
