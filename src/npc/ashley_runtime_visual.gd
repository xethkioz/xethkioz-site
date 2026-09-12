extends Node2D

var _clock := 0.0
var _state := "idle_rhythmic"
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _beat_window := false
var _cadence_remaining := 0.0

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func update_from_actor(delta: float, state_value: String, facing_value: Vector2, velocity_value: Vector2, action_left: float, action_total: float, hurt_left: float, downed_value: bool, beat_window_value: bool, cadence_left: float) -> void:
	_clock += delta
	_state = state_value
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_action_left = action_left
	_action_total = maxf(0.01, action_total)
	_hurt_left = hurt_left
	_downed = downed_value
	_beat_window = beat_window_value
	_cadence_remaining = cadence_left
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_name() -> String:
	return "P06_ASHLEY_PROTOTYPE_RENDERER_NOT_FINAL_ART"

func _draw() -> void:
	var pulse := sin(_clock * 4.0)
	var bob := sin(_clock * 2.0) * 0.9
	var origin := Vector2(0, bob)
	var silver := Color("e0e6ed")
	var violet := Color("4a2e80")
	var mist := Color("85a5cc")
	var skin := Color("e7c5a5")
	if _hurt_left > 0.0:
		violet = Color("c15a78")
	if _downed:
		origin.y += 7.0

	_draw_shadow(Vector2(0, 12), Vector2(11.5, 3.4), Color(0.03, 0.04, 0.08, 0.34))
	if _downed:
		draw_rect(Rect2(origin + Vector2(-12, -3), Vector2(24, 8)), violet, true)
	else:
		var tunic := PackedVector2Array([
			origin + Vector2(-8, -9), origin + Vector2(8, -9),
			origin + Vector2(11, 10), origin + Vector2(-11, 10)
		])
		draw_colored_polygon(tunic, violet)
		draw_circle(origin + Vector2(0, -16), 5.5, skin)
		draw_arc(origin + Vector2(0, -17), 6.3, PI, TAU, 14, silver, 2.0)
		var catalyst_pos := origin + Vector2(13 if _facing.x >= 0.0 else -13, -7)
		draw_circle(catalyst_pos, 4.4 + pulse * 0.35, Color(mist.r, mist.g, mist.b, 0.82))
		draw_arc(catalyst_pos, 6.7, -PI * 0.55, PI * 0.55, 15, silver, 1.5)

	if _state == "walk_graceful":
		var ratio := clampf(_velocity.length() / 78.0, 0.0, 1.0)
		draw_arc(origin + Vector2(0, 10), 8.0 + ratio * 3.0, 0.2, PI - 0.2, 18, Color(mist.r, mist.g, mist.b, 0.46), 1.2)
	elif _state == "lunar_crescent":
		var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		var direction := _facing if _facing.length_squared() > 0.001 else Vector2.RIGHT
		var crescent_center := origin + direction * (11.0 + progress * 18.0)
		draw_arc(crescent_center, 8.0, -PI * 0.55 + direction.angle(), PI * 0.55 + direction.angle(), 18, silver, 2.5)
	elif _state == "rhythm_cadence":
		var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		draw_arc(origin + Vector2(0, 8), 12.0 + progress * 15.0, 0.0, TAU, 28, Color(mist.r, mist.g, mist.b, 0.72 - progress * 0.35), 2.0)
	elif _state == "moon_phase_burst":
		var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		draw_arc(origin + Vector2(0, -3), 14.0 + progress * 25.0, 0.0, TAU, 34, Color(1.0, 1.0, 1.0, 0.78 - progress * 0.42), 2.4)
		for index in range(4):
			var angle := _clock * 1.8 + float(index) * TAU / 4.0
			draw_circle(origin + Vector2(cos(angle), sin(angle)) * 17.0, 1.7, silver)

	if _beat_window:
		draw_arc(origin + Vector2(0, 8), 17.0, 0.0, TAU, 24, Color(1.0, 1.0, 1.0, 0.32), 1.1)
	if _cadence_remaining > 0.0:
		for index in range(3):
			var angle := _clock * 2.1 + float(index) * TAU / 3.0
			draw_circle(origin + Vector2(cos(angle) * 21.0, sin(angle) * 8.0 - 5.0), 1.5, mist)

func _draw_shadow(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for index in range(24):
		var angle := TAU * float(index) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
