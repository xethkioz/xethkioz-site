extends Node2D

var _clock := 0.0
var _state := "idle_sturdy"
var _facing := Vector2.DOWN
var _velocity := Vector2.ZERO
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _armor_left := 0.0

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func update_from_actor(delta: float, state_value: String, facing_value: Vector2, velocity_value: Vector2, action_left: float, action_total: float, hurt_left: float, downed_value: bool, armor_left: float) -> void:
	_clock += delta
	_state = state_value
	if facing_value.length_squared() > 0.001:
		_facing = facing_value.normalized()
	_velocity = velocity_value
	_action_left = action_left
	_action_total = maxf(0.01, action_total)
	_hurt_left = hurt_left
	_downed = downed_value
	_armor_left = armor_left
	queue_redraw()

func state_name() -> String:
	return _state

func visual_contract_name() -> String:
	return "P07_FERMIN_PROTOTYPE_RENDERER_NOT_FINAL_ART"

func _draw() -> void:
	var step := sin(_clock * 6.0)
	var origin := Vector2.ZERO
	var clay := Color("8b4513")
	var stone := Color("4a4e51")
	var sand := Color("d2b48c")
	var seismic := Color("ffd700")
	var skin := Color("e7c5a5")
	if _hurt_left > 0.0:
		clay = Color("b65b46")
	if _downed:
		origin.y += 7.0

	_draw_ground_shadow(Vector2(0, 12), Vector2(13, 4), Color(0.04, 0.035, 0.03, 0.40))
	if _downed:
		draw_rect(Rect2(origin + Vector2(-14, -3), Vector2(28, 8)), stone, true)
	else:
		var body := PackedVector2Array([
			origin + Vector2(-9, -9), origin + Vector2(9, -9),
			origin + Vector2(12, 10), origin + Vector2(-12, 10)
		])
		draw_colored_polygon(body, clay)
		draw_circle(origin + Vector2(0, -16), 5.4, skin)
		draw_rect(Rect2(origin + Vector2(-12, -7), Vector2(5, 11)), stone, true)
		draw_rect(Rect2(origin + Vector2(7, -7), Vector2(5, 11)), stone, true)
		draw_line(origin + Vector2(-8, 8), origin + Vector2(-8, 14), stone, 3.0)
		draw_line(origin + Vector2(8, 8), origin + Vector2(8, 14), stone, 3.0)

	if _state == "walk_heavy_step":
		var ratio := clampf(_velocity.length() / 70.0, 0.0, 1.0)
		var side := -1.0 if step < 0.0 else 1.0
		draw_circle(origin + Vector2(side * 8.0, 13.0), 2.1 + ratio, Color(sand.r, sand.g, sand.b, 0.42))
	elif _state == "ground_slam":
		var progress := 1.0 - clampf(_action_left / _action_total, 0.0, 1.0)
		var radius := 11.0 + progress * 31.0
		draw_arc(origin + Vector2(0, 10), radius, PI, TAU, 30, Color(seismic.r, seismic.g, seismic.b, 0.78 - progress * 0.40), 2.4)
		for index in range(5):
			var angle := PI + float(index) * PI / 4.0
			var end := origin + Vector2(cos(angle), sin(angle)) * radius
			draw_line(origin + Vector2(0, 10), end, Color(seismic.r, seismic.g, seismic.b, 0.44), 1.2)
	elif _state == "rock_armor":
		for index in range(5):
			var angle := _clock * 2.2 + float(index) * TAU / 5.0
			var pos := origin + Vector2(cos(angle) * 17.0, sin(angle) * 9.0 - 4.0)
			draw_rect(Rect2(pos - Vector2(2.5, 2.0), Vector2(5, 4)), stone, true)
	elif _state == "seismic_charge":
		var direction := _facing if _facing.length_squared() > 0.001 else Vector2.RIGHT
		for index in range(3):
			var trail_pos := origin - direction * (9.0 + float(index) * 7.0)
			draw_circle(trail_pos, 3.0 - float(index) * 0.5, Color(sand.r, sand.g, sand.b, 0.52))

	if _armor_left > 0.0:
		for index in range(4):
			var angle := _clock * 1.4 + float(index) * TAU / 4.0
			var pos := origin + Vector2(cos(angle) * 19.0, sin(angle) * 10.0 - 4.0)
			draw_rect(Rect2(pos - Vector2(2, 2), Vector2(4, 4)), Color(stone.r, stone.g, stone.b, 0.88), true)

func _draw_ground_shadow(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for index in range(24):
		var angle := TAU * float(index) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
