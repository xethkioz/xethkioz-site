class_name ConsumableUseFeedback
extends Node2D

var item_id := ""
var facing := Vector2.DOWN
var use_time := 0.72
var elapsed := 0.0
var _accent := Color("8fcf78")

func configure(item_id_value: String, facing_value: Vector2, use_time_value: float) -> void:
	item_id = item_id_value
	facing = facing_value.normalized() if facing_value.length_squared() > 0.001 else Vector2.DOWN
	use_time = maxf(0.28, use_time_value)
	_accent = Color("ff8c42") if item_id == "racion_bosque" else Color("8fcf78")
	z_index = 8
	queue_redraw()

func _process(delta: float) -> void:
	elapsed += delta
	if elapsed >= use_time:
		queue_free()
		return
	queue_redraw()

func _draw() -> void:
	var t := clampf(elapsed / use_time, 0.0, 1.0)
	var hand_anchor := facing * 7.0 + Vector2(0, -7)
	var mouth_anchor := facing * 2.0 + Vector2(0, -15)
	var local_pos: Vector2
	var alpha := 1.0
	var item_scale := 1.0

	if t < 0.42:
		var lift := t / 0.42
		local_pos = hand_anchor.lerp(mouth_anchor, _ease_out(lift))
		item_scale = 0.88 + sin(lift * PI) * 0.15
	elif t < 0.68:
		var bite := (t - 0.42) / 0.26
		local_pos = mouth_anchor + Vector2(sin(bite * PI * 2.0) * 0.8, cos(bite * PI) * 0.45)
		item_scale = lerpf(1.0, 0.62, bite)
		_draw_bite_particles(mouth_anchor, bite)
	else:
		var finish := (t - 0.68) / 0.32
		local_pos = mouth_anchor + Vector2(0, -4.0 * finish)
		item_scale = lerpf(0.62, 0.28, finish)
		alpha = 1.0 - finish

	if item_id == "racion_bosque":
		_draw_ration(local_pos, item_scale, alpha)
	else:
		_draw_apple(local_pos, item_scale, alpha)

	if t >= 0.50:
		var pulse := sin(clampf((t - 0.50) / 0.50, 0.0, 1.0) * PI)
		draw_arc(Vector2(0, -10), 11.0 + pulse * 5.0, -PI * 0.85, PI * 0.15, 20, Color(_accent.r, _accent.g, _accent.b, 0.34 * pulse), 1.5)

func _draw_apple(pos: Vector2, scale_value: float, alpha: float) -> void:
	var body := Color(0.48, 0.77, 0.39, alpha)
	var light := Color(0.70, 0.92, 0.52, alpha)
	var dark := Color(0.24, 0.48, 0.24, alpha)
	draw_circle(pos + Vector2(-1.6, 0) * scale_value, 3.2 * scale_value, dark)
	draw_circle(pos + Vector2(1.6, 0) * scale_value, 3.2 * scale_value, dark)
	draw_circle(pos + Vector2(0, -0.6) * scale_value, 3.25 * scale_value, body)
	draw_circle(pos + Vector2(-1.1, -1.4) * scale_value, 1.0 * scale_value, light)
	draw_line(pos + Vector2(0, -3.2) * scale_value, pos + Vector2(0.8, -5.0) * scale_value, Color(0.32, 0.21, 0.12, alpha), maxf(1.0, scale_value))
	draw_line(pos + Vector2(0.8, -4.4) * scale_value, pos + Vector2(3.1, -4.8) * scale_value, dark, maxf(1.0, scale_value))

func _draw_ration(pos: Vector2, scale_value: float, alpha: float) -> void:
	var crust := Color(0.64, 0.39, 0.20, alpha)
	var food := Color(0.93, 0.68, 0.34, alpha)
	var leaf := Color(0.37, 0.62, 0.33, alpha)
	var size := Vector2(8, 5) * scale_value
	draw_rect(Rect2(pos - size * 0.5, size), crust, true)
	draw_rect(Rect2(pos - Vector2(3, 1.5) * scale_value, Vector2(6, 2.5) * scale_value), food, true)
	draw_line(pos + Vector2(-2, -1) * scale_value, pos + Vector2(2, 1) * scale_value, leaf, maxf(1.0, scale_value))

func _draw_bite_particles(origin: Vector2, bite: float) -> void:
	var particle_alpha := sin(bite * PI)
	for i in range(3):
		var angle := -1.9 + float(i) * 0.58
		var distance := (4.0 + float(i) * 1.8) * bite
		var p := origin + Vector2(cos(angle), sin(angle)) * distance
		draw_circle(p, 0.8 + float(i % 2) * 0.35, Color(_accent.r, _accent.g, _accent.b, particle_alpha * 0.80))

func _ease_out(value: float) -> float:
	var inv := 1.0 - clampf(value, 0.0, 1.0)
	return 1.0 - inv * inv