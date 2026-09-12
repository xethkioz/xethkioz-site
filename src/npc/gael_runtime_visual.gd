extends Node2D

var _clock: float = 0.0
var _state: String = "idle_stealth"
var _facing: Vector2 = Vector2.DOWN
var _velocity: Vector2 = Vector2.ZERO
var _action_left: float = 0.0
var _action_total: float = 0.01
var _hurt_left: float = 0.0
var _downed: bool = false
var _veil_remaining: float = 0.0
var _precision_ready: bool = false
var _last_dodge: bool = false

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func update_from_actor(delta: float, state_value: String, facing_value: Vector2, velocity_value: Vector2, action_left: float, action_total: float, hurt_left: float, downed_value: bool, veil_left: float, precision_value: bool, dodge_value: bool) -> void:
	_clock += delta
	_state = state_value
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_action_left = action_left
	_action_total = maxf(0.01, action_total)
	_hurt_left = hurt_left
	_downed = downed_value
	_veil_remaining = veil_left
	_precision_ready = precision_value
	_last_dodge = dodge_value
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_name() -> String:
	return "P09_GAEL_PROTOTYPE_RENDERER_NOT_FINAL_ART"

func _draw() -> void:
	var bob: float = sin(_clock * 3.4) * 0.55
	var origin: Vector2 = Vector2(0, bob)
	var tunic: Color = Color("27ae60")
	var mint: Color = Color("a3e4d7")
	var emerald: Color = Color("2ecc71")
	var leather: Color = Color("8b5a2b")
	var skin: Color = Color("ecc39f")
	if _hurt_left > 0.0:
		tunic = Color("8bd9ad")
	if _downed:
		origin.y += 7.0

	_draw_flat_ellipse(Vector2(0, 11.5), Vector2(10.5, 3.2), Color(0.03, 0.05, 0.06, 0.34))
	if _downed:
		draw_rect(Rect2(origin + Vector2(-11, -3), Vector2(22, 7)), tunic, true)
	else:
		var body_points := PackedVector2Array([
			origin + Vector2(-7, -9), origin + Vector2(7, -9),
			origin + Vector2(9, 9), origin + Vector2(-9, 9)
		])
		draw_colored_polygon(body_points, tunic)
		draw_circle(origin + Vector2(0, -15), 5.2, skin)
		draw_arc(origin + Vector2(0, -16), 5.8, PI, TAU, 12, Color("4b352a"), 1.8)
		var scarf_dir: Vector2 = -_facing if _facing.length_squared() > 0.001 else Vector2.LEFT
		var scarf_start: Vector2 = origin + Vector2(0, -8)
		var scarf_end: Vector2 = scarf_start + scarf_dir * (10.0 + minf(_velocity.length() / 15.0, 8.0))
		draw_line(scarf_start, scarf_end, mint, 2.4)
		var blade_side: float = -1.0 if _facing.x <= 0.0 else 1.0
		draw_line(origin + Vector2(blade_side * 8.0, -2), origin + Vector2(blade_side * 13.0, 5), leather, 2.0)

	if _state == "sprint_wind":
		var speed_ratio: float = clampf(_velocity.length() / 116.0, 0.0, 1.0)
		for index in range(3):
			var y_offset: float = -5.0 + float(index) * 5.0
			draw_line(origin + Vector2(-_facing.x * 7.0, y_offset), origin - _facing * (15.0 + float(index) * 5.0) + Vector2(0, y_offset), Color(0.64, 0.89, 0.84, 0.22 + speed_ratio * 0.30), 1.2)
	elif _state == "gale_blade":
		var progress: float = 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		var base_angle: float = _facing.angle()
		for offset_angle in [-0.52, 0.0, 0.52]:
			var dir: Vector2 = Vector2.from_angle(base_angle + float(offset_angle))
			draw_arc(origin + dir * 8.0, 10.0 + progress * 10.0, base_angle + float(offset_angle) - 0.4, base_angle + float(offset_angle) + 0.4, 14, mint, 1.8)
	elif _state == "shadow_veil":
		draw_arc(origin + Vector2(0, -3), 18.0, 0.0, TAU, 28, Color(0.64, 0.89, 0.84, 0.62), 2.0)
	elif _state == "kahezer_dash":
		var pulse: float = 16.0 + sin(_clock * 18.0) * 2.0
		draw_arc(origin + Vector2(0, -2), pulse, -PI * 0.35, PI * 1.35, 24, emerald, 2.2)

	if _veil_remaining > 0.0:
		var alpha: float = 0.18 + 0.10 * sin(_clock * 7.0)
		draw_arc(origin + Vector2(0, -3), 21.0, 0.0, TAU, 30, Color(0.64, 0.89, 0.84, alpha), 1.2)
	if _precision_ready:
		draw_arc(origin + Vector2(0, -22), 5.0, 0.0, TAU, 16, mint, 1.3)
	if _last_dodge:
		draw_string(ThemeDB.fallback_font, origin + Vector2(-13, -29), "DODGE", HORIZONTAL_ALIGNMENT_LEFT, -1, 7, mint)

func _draw_flat_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for index in range(24):
		var angle: float = TAU * float(index) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
