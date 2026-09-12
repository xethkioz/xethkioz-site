extends "res://src/fx/world_feedback_fx.gd"

# Production impact refinement: preserve the semantic FX contract while giving
# melee contact a crisper first read at the 640x360 logical resolution.
func configure(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "", duration_override: float = -1.0) -> void:
	super.configure(kind_value, direction_value, color_value, text_value, duration_override)
	if kind_value == "slash" and duration_override <= 0.0:
		_duration = 0.22

func _draw_slash(progress: float, alpha: float) -> void:
	var angle: float = _direction.angle()
	var sweep: float = 0.82
	var radius: float = 15.0 + progress * 9.0
	var main_color: Color = _alpha(_accent.lightened(0.34), alpha)
	var core_color: Color = _alpha(Color.WHITE, alpha * 0.82)
	draw_arc(Vector2.ZERO, radius, angle - sweep, angle + sweep, 20, main_color, 4.0)
	draw_arc(Vector2.ZERO, radius - 4.5, angle - sweep * 0.68, angle + sweep * 0.68, 16, core_color, 1.8)
	var side := Vector2(-_direction.y, _direction.x)
	var tip := _direction * (radius + 2.0)
	draw_line(tip - side * 4.0, tip + side * 4.0, _alpha(Color.WHITE, alpha * 0.58), 1.5)

func _draw_burst(progress: float, alpha: float) -> void:
	var radius: float = 8.0 + progress * 34.0
	var impact_alpha: float = alpha * clampf(1.0 - progress * 2.2, 0.0, 1.0)
	draw_circle(Vector2.ZERO, 7.0 + progress * 3.0, _alpha(_accent.lightened(0.30), alpha * 0.24))
	# Fast white core sells contact; it disappears before the expanding ring can
	# become visual noise during abilities or Boss phase feedback.
	draw_circle(Vector2.ZERO, 3.0 + progress * 2.0, _alpha(Color.WHITE, impact_alpha * 0.82))
	for index in range(4):
		var impact_ray := Vector2.from_angle(TAU * float(index) / 4.0)
		draw_line(impact_ray * 3.0, impact_ray * (12.0 + progress * 5.0), _alpha(Color.WHITE, impact_alpha * 0.72), 1.8)
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 36, _alpha(_accent, alpha * 0.82), 2.5)
	for index in range(8):
		var angle: float = TAU * float(index) / 8.0
		var ray: Vector2 = Vector2.from_angle(angle)
		draw_line(ray * (radius * 0.45), ray * radius, _alpha(_accent.lightened(0.15), alpha * 0.72), 1.5)

func _draw_hit(progress: float, alpha: float) -> void:
	draw_circle(Vector2.ZERO, 4.0 + progress * 5.0, _alpha(_accent.lightened(0.35), alpha * 0.38))
	draw_circle(Vector2.ZERO, 2.0 + progress * 2.0, _alpha(Color.WHITE, alpha * 0.72))
	for index in range(6):
		var angle: float = TAU * float(index) / 6.0
		var ray: Vector2 = Vector2.from_angle(angle)
		var inner: Vector2 = ray * (3.0 + progress * 5.0)
		var outer: Vector2 = ray * (13.0 + progress * 12.0)
		draw_line(inner, outer, _alpha(_accent, alpha), 2.2)
