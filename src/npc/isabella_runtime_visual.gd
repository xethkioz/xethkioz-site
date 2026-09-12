extends Node2D

var _clock := 0.0
var _state := "idle_playful"
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _last_secondary_effect := "none"

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func update_from_actor(delta: float, state_value: String, facing_value: Vector2, velocity_value: Vector2, action_left: float, action_total: float, hurt_left: float, downed_value: bool, secondary_effect: String) -> void:
	_clock += delta
	_state = state_value
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_action_left = action_left
	_action_total = maxf(0.01, action_total)
	_hurt_left = hurt_left
	_downed = downed_value
	_last_secondary_effect = secondary_effect
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_name() -> String:
	return "P08_ISABELLA_PROTOTYPE_RENDERER_NOT_FINAL_ART"

func _draw() -> void:
	var hop: float = abs(sin(_clock * 4.6)) * 1.2 if _state == "idle_playful" or _state == "walk_hop" else 0.0
	var origin: Vector2 = Vector2(0, -hop)
	var coat: Color = Color("e74c3c")
	var flame: Color = Color("ff5722")
	var spark: Color = Color("ffeb3b")
	var chaos: Color = Color("8e44ad")
	var skin: Color = Color("edc6a2")
	if _hurt_left > 0.0:
		coat = Color("f6a3a3")
	if _downed:
		origin.y += 7.0

	_draw_flat_ellipse(Vector2(0, 12), Vector2(11, 3.5), Color(0.03, 0.04, 0.07, 0.35))
	if _downed:
		draw_rect(Rect2(origin + Vector2(-12, -4), Vector2(24, 8)), coat, true)
	else:
		var coat_points := PackedVector2Array([
			origin + Vector2(-8, -10), origin + Vector2(8, -10),
			origin + Vector2(11, 10), origin + Vector2(-11, 10)
		])
		draw_colored_polygon(coat_points, coat)
		draw_circle(origin + Vector2(0, -16), 5.5, skin)
		draw_arc(origin + Vector2(0, -16), 6.2, PI, TAU, 12, Color("5a2a32"), 2.0)
		var wand_x: float = -12.0 if _facing.x <= 0.0 else 12.0
		draw_line(origin + Vector2(wand_x, -7), origin + Vector2(wand_x, 9), Color("5b3a29"), 1.8)
		draw_circle(origin + Vector2(wand_x, -9), 2.8, spark)

	if _state == "walk_hop":
		var trail_alpha: float = clampf(_velocity.length() / 78.0, 0.15, 0.55)
		draw_arc(origin + Vector2(0, 8), 9.0, 0.1, PI - 0.1, 16, Color(1.0, 0.34, 0.13, trail_alpha), 1.3)
	elif _state == "spark_shot":
		var progress: float = 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		var direction: Vector2 = _facing if _facing.length_squared() > 0.001 else Vector2.RIGHT
		var p: Vector2 = origin + direction * (10.0 + progress * 18.0)
		draw_circle(p, 3.0, spark)
		draw_arc(p, 5.5, 0.0, TAU, 16, chaos, 1.2)
	elif _state == "chaos_burst":
		var progress: float = 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		draw_arc(origin + Vector2(0, -3), 12.0 + progress * 23.0, 0.0, TAU, 28, Color(0.56, 0.27, 0.68, 0.72 - progress * 0.34), 2.2)
		for index in range(5):
			var angle: float = _clock * 4.0 + TAU * float(index) / 5.0
			draw_circle(origin + Vector2(cos(angle), sin(angle)) * (10.0 + progress * 13.0), 1.8, flame if index % 2 == 0 else spark)
	elif _state == "heller_fury":
		var pulse: float = 19.0 + sin(_clock * 9.0) * 2.0
		draw_arc(origin + Vector2(0, 2), pulse, PI, TAU, 24, flame, 2.6)
		draw_arc(origin + Vector2(0, 2), pulse + 4.0, PI * 1.08, PI * 1.92, 24, chaos, 1.3)

	if _last_secondary_effect == "burn":
		draw_circle(origin + Vector2(8, -20), 2.2, flame)
	elif _last_secondary_effect == "stun":
		draw_arc(origin + Vector2(0, -24), 7.0, 0.0, TAU, 18, spark, 1.2)
	elif _last_secondary_effect == "chain":
		draw_polyline(PackedVector2Array([origin + Vector2(-7, -23), origin + Vector2(-2, -27), origin + Vector2(2, -22), origin + Vector2(7, -27)]), chaos, 1.4)

func _draw_flat_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for index in range(24):
		var angle: float = TAU * float(index) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
