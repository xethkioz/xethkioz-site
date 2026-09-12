class_name XethkiozApprovedVisual
extends Node2D

# Visual runtime adaptado desde el paquete aprobado P02.
# No controla movimiento, colisiones ni combate: sólo presentación.

var action: StringName = &"idle_companion"
var facing: Vector2 = Vector2.RIGHT
var phase: float = 0.0
var tail_count: int = 3
var rune_color: Color = Color("8b5cf6")
var hurt_flash: float = 0.0
var downed: bool = false
var _special_action_left: float = 0.0

func _process(delta: float) -> void:
	var speed: float = 3.5
	if action == &"follow_run":
		speed = 10.0
	elif action == &"tail_swipe":
		speed = 14.0
	elif action == &"resonance_howl":
		speed = 7.0
	elif action == &"evolve_tails":
		speed = 11.0
	elif action == &"hurt":
		speed = 15.0
	phase += delta * speed
	hurt_flash = maxf(0.0, hurt_flash - delta * 3.2)
	_special_action_left = maxf(0.0, _special_action_left - delta)
	queue_redraw()

func set_action(value: StringName) -> void:
	if _special_action_left > 0.0 and value in [&"idle_companion", &"follow_run"]:
		return
	if action != value:
		phase = 0.0
	action = value

func play_action(value: StringName, duration: float = 0.55) -> void:
	_special_action_left = maxf(0.05, duration)
	if action != value:
		phase = 0.0
	action = value

func set_facing(value: Vector2) -> void:
	if value.length_squared() > 0.001:
		facing = value.normalized()

func set_tail_count(value: int) -> void:
	tail_count = clampi(value, 3, 9)
	queue_redraw()

func set_rune_color(value: Color) -> void:
	rune_color = value
	queue_redraw()

func flash_hurt() -> void:
	hurt_flash = 1.0
	play_action(&"hurt", 0.22)

func set_downed(value: bool) -> void:
	downed = value
	queue_redraw()

func _draw() -> void:
	var bob: float = sin(phase) * 1.4
	if action == &"follow_run":
		bob = absf(sin(phase)) * -3.0
	elif action == &"rest_sit":
		bob = 0.0
	elif action == &"hurt":
		bob = sin(phase * 2.0) * 2.5
	if downed:
		bob = 5.0

	var direction_sign: float = 1.0
	if facing.x < -0.15:
		direction_sign = -1.0

	_draw_oval(Vector2(0.0, 12.0), Vector2(30.0, 10.0), Color(0.0, 0.0, 0.0, 0.30))
	_draw_tails(bob, direction_sign)

	var body_center: Vector2 = Vector2(0.0, -7.0 + bob)
	if downed:
		body_center = Vector2(0.0, 1.0)
	var body_color: Color = Color("f8f9fa")
	if hurt_flash > 0.0:
		body_color = body_color.lerp(Color(1.0, 0.35, 0.35, 1.0), hurt_flash)
	_draw_oval(body_center, Vector2(27.0, 17.0), body_color)
	_draw_oval(body_center + Vector2(-7.0 * direction_sign, 3.0), Vector2(16.0, 11.0), Color("ff6b35"))

	var head: Vector2 = body_center + Vector2(25.0 * direction_sign, -9.0)
	draw_circle(head, 15.0, body_color)
	var ear_a := PackedVector2Array([
		head + Vector2(-7.0 * direction_sign, -10.0),
		head + Vector2(-4.0 * direction_sign, -27.0),
		head + Vector2(2.0 * direction_sign, -12.0)
	])
	var ear_b := PackedVector2Array([
		head + Vector2(4.0 * direction_sign, -11.0),
		head + Vector2(11.0 * direction_sign, -25.0),
		head + Vector2(11.0 * direction_sign, -7.0)
	])
	draw_colored_polygon(ear_a, body_color)
	draw_colored_polygon(ear_b, body_color)
	draw_polyline(PackedVector2Array([ear_a[0], ear_a[1], ear_a[2]]), Color("ff6b35"), 2.0)
	draw_polyline(PackedVector2Array([ear_b[0], ear_b[1], ear_b[2]]), Color("ff6b35"), 2.0)

	var muzzle: Vector2 = head + Vector2(13.0 * direction_sign, 4.0)
	_draw_oval(muzzle, Vector2(10.0, 6.0), Color("f1e9df"))
	draw_circle(muzzle + Vector2(7.0 * direction_sign, -1.0), 2.1, Color("20232a"))
	draw_circle(head + Vector2(5.0 * direction_sign, -3.5), 2.0, rune_color.lerp(Color.WHITE, 0.25))

	_draw_legs(body_center)
	_draw_runes(body_center)
	_draw_action_fx(body_center, head, direction_sign)

func _draw_tails(bob: float, direction_sign: float) -> void:
	var root := Vector2(-18.0 * direction_sign, -8.0 + bob)
	var spread: float = 1.55
	if action == &"tail_swipe":
		spread = 2.35
	for index in range(tail_count):
		var fraction: float = 0.5
		if tail_count > 1:
			fraction = float(index) / float(tail_count - 1)
		var angle := lerpf(-spread * 0.5, spread * 0.5, fraction)
		angle += PI if direction_sign > 0.0 else 0.0
		if action == &"tail_swipe":
			angle += sin(phase * 0.55) * 0.75
		else:
			angle += sin(phase * 0.45 + float(index) * 0.55) * 0.08
		var length := 43.0 + float(index % 3) * 4.0
		var end := root + Vector2.RIGHT.rotated(angle) * length
		var control := root.lerp(end, 0.55) + Vector2(0.0, -11.0 - float(index % 2) * 4.0)
		var points := PackedVector2Array()
		for step in range(9):
			var t := float(step) / 8.0
			var a := root.lerp(control, t)
			var b := control.lerp(end, t)
			points.append(a.lerp(b, t))
		draw_polyline(points, Color("f8f9fa"), 10.0)
		draw_polyline(points, Color("ff6b35"), 4.0)
		draw_circle(end, 7.0, Color(rune_color, 0.22))
		draw_circle(end, 3.4, rune_color)

func _draw_legs(body_center: Vector2) -> void:
	if downed:
		draw_line(body_center + Vector2(-13.0, 7.0), body_center + Vector2(-24.0, 12.0), Color("ff6b35"), 7.0)
		draw_line(body_center + Vector2(8.0, 8.0), body_center + Vector2(20.0, 12.0), Color("ff6b35"), 7.0)
		return
	var stride: float = 0.0
	if action == &"follow_run":
		stride = sin(phase) * 8.0
	draw_line(body_center + Vector2(-12.0, 8.0), body_center + Vector2(-15.0 + stride, 21.0), Color("ff6b35"), 7.0)
	draw_line(body_center + Vector2(10.0, 8.0), body_center + Vector2(13.0 - stride, 21.0), Color("ff6b35"), 7.0)
	draw_line(body_center + Vector2(-15.0 + stride, 21.0), body_center + Vector2(-9.0 + stride, 22.0), Color("f8f9fa"), 5.0)
	draw_line(body_center + Vector2(13.0 - stride, 21.0), body_center + Vector2(19.0 - stride, 22.0), Color("f8f9fa"), 5.0)

func _draw_runes(body_center: Vector2) -> void:
	draw_arc(body_center + Vector2(2.0, -2.0), 10.0, 0.2, 2.8, 18, rune_color, 1.8)
	draw_circle(body_center + Vector2(4.0, -5.0), 2.2, rune_color)
	draw_line(body_center + Vector2(-2.0, -12.0), body_center + Vector2(4.0, 6.0), Color(rune_color, 0.8), 1.2)

func _draw_action_fx(body_center: Vector2, head: Vector2, direction_sign: float) -> void:
	if action == &"resonance_howl":
		var radius := 22.0 + fmod(phase * 8.0, 35.0)
		draw_arc(head, radius, -1.0, 1.0, 24, Color(rune_color, 0.55), 2.5)
		draw_arc(head, radius + 10.0, -0.9, 0.9, 24, Color(rune_color, 0.24), 1.8)
	elif action == &"evolve_tails":
		var r := 26.0 + fmod(phase * 6.0, 32.0)
		draw_arc(body_center, r, 0.0, TAU, 36, Color(rune_color, 0.65), 2.2)
		for index in range(8):
			var angle := TAU * float(index) / 8.0 + phase * 0.2
			draw_circle(body_center + Vector2.RIGHT.rotated(angle) * r, 2.5, Color.WHITE)
	elif action == &"tail_swipe":
		var start_angle: float = PI * 0.65
		if direction_sign < 0.0:
			start_angle = -0.35
		draw_arc(body_center, 54.0, start_angle, start_angle + 2.2, 28, Color(rune_color, 0.65), 4.0)
	elif action == &"rest_sit":
		draw_arc(head + Vector2(5.0 * direction_sign, -22.0), 7.0, 0.0, TAU, 18, Color(rune_color, 0.25), 1.2)

func _draw_oval(center: Vector2, radii: Vector2, color_value: Color) -> void:
	var points := PackedVector2Array()
	for index in range(28):
		var angle := TAU * float(index) / 28.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color_value)
