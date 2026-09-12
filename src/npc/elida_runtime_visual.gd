extends Node2D

var _clock := 0.0
var _state := "idle_peaceful"
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _shield_remaining := 0.0
var _blessing_remaining := 0.0

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func update_from_actor(delta: float, state_value: String, facing_value: Vector2, velocity_value: Vector2, action_left: float, action_total: float, hurt_left: float, downed_value: bool, shield_left: float, blessing_left: float) -> void:
	_clock += delta
	_state = state_value
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_action_left = action_left
	_action_total = maxf(0.01, action_total)
	_hurt_left = hurt_left
	_downed = downed_value
	_shield_remaining = shield_left
	_blessing_remaining = blessing_left
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_name() -> String:
	return "P05_ELIDA_PROTOTYPE_RENDERER_NOT_FINAL_ART"

func _draw() -> void:
	var bob := sin(_clock * 1.45) * 0.7
	var origin := Vector2(0, bob)
	var robe := Color("1f4f75")
	var water := Color("40e0d0")
	var foam := Color("f0f8ff")
	var skin := Color("e7c5a5")
	if _hurt_left > 0.0:
		robe = Color("c45b68")
	if _downed:
		origin.y += 7.0

	# Contact shadow + robe silhouette. Renderer is intentionally procedural until final art approval.
	_draw_flat_ellipse(Vector2(0, 12), Vector2(13, 4), Color(0.03, 0.05, 0.08, 0.38))
	if _downed:
		draw_rect(Rect2(origin + Vector2(-14, -4), Vector2(28, 9)), robe, true)
	else:
		var robe_points := PackedVector2Array([
			origin + Vector2(-9, -10), origin + Vector2(9, -10),
			origin + Vector2(14, 11), origin + Vector2(-14, 11)
		])
		draw_colored_polygon(robe_points, robe)
		draw_circle(origin + Vector2(0, -17), 6.0, skin)
		draw_arc(origin + Vector2(0, -18), 6.8, PI, TAU, 14, foam, 2.2)
		var staff_x := -14.0 if _facing.x <= 0.0 else 14.0
		draw_line(origin + Vector2(staff_x, -11), origin + Vector2(staff_x, 12), Color("8b6a4a"), 2.2)
		draw_circle(origin + Vector2(staff_x, -13), 3.3, water)

	var move_ratio := clampf(_velocity.length() / 62.0, 0.0, 1.0)
	if _state == "walk_calm":
		draw_arc(origin + Vector2(0, 10), 9.0 + move_ratio * 2.0, 0.15, PI - 0.15, 18, Color(0.25, 0.88, 0.82, 0.45), 1.2)
	elif _state == "water_surge":
		var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		draw_arc(origin, 14.0 + progress * 24.0, 0.0, TAU, 32, Color(0.25, 0.88, 0.82, 0.72 - progress * 0.40), 2.4)
	elif _state == "hydro_shield":
		draw_arc(origin + Vector2(0, -5), 20.0, 0.0, TAU, 32, Color(0.49, 0.91, 1.0, 0.78), 2.4)
	elif _state == "okuninust_blessing":
		for index in range(3):
			var phase := fmod(_clock * 26.0 + float(index) * 11.0, 34.0)
			draw_circle(origin + Vector2(-8.0 + float(index) * 8.0, 11.0 - phase), 1.8, foam)

	if _shield_remaining > 0.0:
		draw_arc(origin + Vector2(0, -4), 23.0, 0.0, TAU, 36, Color(0.49, 0.91, 1.0, 0.35), 1.4)
	if _blessing_remaining > 0.0:
		draw_arc(origin + Vector2(0, -5), 27.0, -PI * 0.2, PI * 1.2, 28, Color(0.94, 0.97, 1.0, 0.55), 1.2)

func _draw_flat_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for index in range(24):
		var angle := TAU * float(index) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
