extends Node2D

var _kind: String = "hit"
var _direction: Vector2 = Vector2.RIGHT
var _accent: Color = Color.WHITE
var _text: String = ""
var _elapsed: float = 0.0
var _duration: float = 0.32
var _label: Label

func configure(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "") -> void:
	_kind = kind_value
	_direction = direction_value.normalized() if direction_value.length_squared() > 0.001 else Vector2.UP
	_accent = color_value
	_text = text_value
	match _kind:
		"slash":
			_duration = 0.18
		"line":
			_duration = 0.24
		"ward":
			_duration = 0.46
		"burst":
			_duration = 0.42
		"death":
			_duration = 0.52
		"pickup":
			_duration = 0.68
		"hurt":
			_duration = 0.30
		"telegraph":
			_duration = 0.72
		"aura":
			_duration = 0.78
		"smoke":
			_duration = 0.90
		"rune":
			_duration = 0.66
		_:
			_duration = 0.34
	if not _text.is_empty():
		_ensure_label()
	queue_redraw()

func _ready() -> void:
	z_index = 50
	if not _text.is_empty():
		_ensure_label()
	queue_redraw()

func _process(delta: float) -> void:
	_elapsed += delta
	var progress: float = clampf(_elapsed / maxf(_duration, 0.001), 0.0, 1.0)
	if is_instance_valid(_label):
		_label.position = Vector2(-64.0, -26.0 - progress * 18.0)
		var label_color: Color = _label.modulate
		label_color.a = 1.0 - progress
		_label.modulate = label_color
		_label.scale = Vector2.ONE * (1.0 + sin(progress * PI) * 0.08)
	queue_redraw()
	if _elapsed >= _duration:
		queue_free()

func _ensure_label() -> void:
	if is_instance_valid(_label):
		_label.text = _text
		return
	_label = Label.new()
	_label.position = Vector2(-64.0, -26.0)
	_label.size = Vector2(128.0, 18.0)
	_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_label.text = _text
	_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_label.add_theme_font_size_override("font_size", 9)
	_label.add_theme_color_override("font_color", _accent.lightened(0.25))
	_label.add_theme_color_override("font_outline_color", Color(0.02, 0.025, 0.04, 0.92))
	_label.add_theme_constant_override("outline_size", 2)
	add_child(_label)

func _draw() -> void:
	var progress: float = clampf(_elapsed / maxf(_duration, 0.001), 0.0, 1.0)
	var alpha: float = 1.0 - progress
	match _kind:
		"slash":
			_draw_slash(progress, alpha)
		"line":
			_draw_line_cast(progress, alpha)
		"ward":
			_draw_ward(progress, alpha)
		"burst":
			_draw_burst(progress, alpha)
		"death":
			_draw_death(progress, alpha)
		"pickup":
			_draw_pickup(progress, alpha)
		"hurt":
			_draw_hurt(progress, alpha)
		"telegraph":
			_draw_telegraph(progress, alpha)
		"aura":
			_draw_aura(progress, alpha)
		"smoke":
			_draw_smoke(progress, alpha)
		"rune":
			_draw_rune(progress, alpha)
		_:
			_draw_hit(progress, alpha)

func _draw_slash(progress: float, alpha: float) -> void:
	var angle: float = _direction.angle()
	var sweep: float = 0.78
	var radius: float = 16.0 + progress * 8.0
	draw_arc(Vector2.ZERO, radius, angle - sweep, angle + sweep, 18, _alpha(_accent.lightened(0.32), alpha), 3.0)
	draw_arc(Vector2.ZERO, radius - 5.0, angle - sweep * 0.72, angle + sweep * 0.72, 14, _alpha(Color.WHITE, alpha * 0.72), 1.5)

func _draw_line_cast(progress: float, alpha: float) -> void:
	var start: Vector2 = _direction * (6.0 + progress * 3.0)
	var end: Vector2 = _direction * (32.0 + progress * 38.0)
	var side: Vector2 = Vector2(-_direction.y, _direction.x)
	draw_line(start, end, _alpha(_accent.lightened(0.25), alpha), 3.0)
	draw_line(start + side * 4.0, end + side * 2.0, _alpha(Color.WHITE, alpha * 0.58), 1.5)
	draw_line(start - side * 4.0, end - side * 2.0, _alpha(_accent.darkened(0.08), alpha * 0.62), 1.5)

func _draw_ward(progress: float, alpha: float) -> void:
	var radius: float = 12.0 + sin(progress * PI) * 9.0
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 28, _alpha(_accent, alpha * 0.90), 2.5)
	draw_arc(Vector2.ZERO, radius + 7.0, -PI * 0.70, PI * 0.15, 18, _alpha(Color.WHITE, alpha * 0.55), 1.5)
	for index in range(4):
		var angle: float = TAU * float(index) / 4.0 + progress * 0.7
		var point: Vector2 = Vector2.from_angle(angle) * (radius + 3.0)
		draw_circle(point, 2.0, _alpha(_accent.lightened(0.25), alpha))

func _draw_burst(progress: float, alpha: float) -> void:
	var radius: float = 8.0 + progress * 34.0
	draw_circle(Vector2.ZERO, 7.0 + progress * 3.0, _alpha(_accent.lightened(0.30), alpha * 0.22))
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 36, _alpha(_accent, alpha * 0.82), 2.5)
	for index in range(8):
		var angle: float = TAU * float(index) / 8.0
		var ray: Vector2 = Vector2.from_angle(angle)
		draw_line(ray * (radius * 0.45), ray * radius, _alpha(_accent.lightened(0.15), alpha * 0.72), 1.5)

func _draw_hit(progress: float, alpha: float) -> void:
	draw_circle(Vector2.ZERO, 4.0 + progress * 5.0, _alpha(_accent.lightened(0.35), alpha * 0.34))
	for index in range(6):
		var angle: float = TAU * float(index) / 6.0
		var ray: Vector2 = Vector2.from_angle(angle)
		var inner: Vector2 = ray * (3.0 + progress * 5.0)
		var outer: Vector2 = ray * (11.0 + progress * 11.0)
		draw_line(inner, outer, _alpha(_accent, alpha), 2.0)

func _draw_death(progress: float, alpha: float) -> void:
	var radius: float = 8.0 + progress * 28.0
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 28, _alpha(_accent, alpha * 0.75), 2.0)
	for index in range(10):
		var angle: float = TAU * float(index) / 10.0 + 0.22
		var ray: Vector2 = Vector2.from_angle(angle)
		var shard_start: Vector2 = ray * (5.0 + progress * 13.0)
		var shard_end: Vector2 = ray * (12.0 + progress * 28.0)
		draw_line(shard_start, shard_end, _alpha(_accent.lightened(0.18), alpha), 2.0)

func _draw_pickup(progress: float, alpha: float) -> void:
	var rise: float = progress * 15.0
	draw_arc(Vector2(0.0, -rise * 0.25), 9.0 + progress * 7.0, 0.0, TAU, 20, _alpha(_accent, alpha * 0.72), 1.5)
	for index in range(5):
		var x_offset: float = -12.0 + float(index) * 6.0
		var y_offset: float = -5.0 - rise - absf(float(index) - 2.0) * 2.0
		draw_line(Vector2(x_offset - 2.0, y_offset), Vector2(x_offset + 2.0, y_offset), _alpha(_accent.lightened(0.28), alpha), 1.5)
		draw_line(Vector2(x_offset, y_offset - 2.0), Vector2(x_offset, y_offset + 2.0), _alpha(Color.WHITE, alpha * 0.85), 1.5)

func _draw_hurt(progress: float, alpha: float) -> void:
	var radius: float = 12.0 + progress * 10.0
	draw_arc(Vector2.ZERO, radius, -2.6, -0.55, 18, _alpha(_accent, alpha), 2.5)
	draw_arc(Vector2.ZERO, radius + 4.0, 0.55, 2.6, 18, _alpha(_accent.lightened(0.20), alpha * 0.75), 1.5)


func _draw_telegraph(progress: float, alpha: float) -> void:
	var radius: float = 15.0 + sin(progress * PI) * 10.0
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 32, _alpha(_accent, alpha * 0.92), 2.0)
	for index in range(8):
		var angle: float = TAU * float(index) / 8.0
		var ray: Vector2 = Vector2.from_angle(angle)
		draw_line(ray * (radius + 3.0), ray * (radius + 9.0), _alpha(Color.WHITE, alpha * 0.70), 1.0)

func _draw_aura(progress: float, alpha: float) -> void:
	var radius: float = 10.0 + sin(progress * PI) * 5.0
	draw_circle(Vector2.ZERO, radius, _alpha(_accent, alpha * 0.10))
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 28, _alpha(_accent.lightened(0.24), alpha * 0.80), 2.0)
	for index in range(4):
		var angle: float = TAU * float(index) / 4.0 + progress * 0.9
		var point: Vector2 = Vector2.from_angle(angle) * (radius + 4.0)
		draw_circle(point, 1.8, _alpha(Color.WHITE, alpha * 0.80))

func _draw_smoke(progress: float, alpha: float) -> void:
	for index in range(5):
		var drift: float = (float(index) - 2.0) * 4.0 + sin(progress * PI * 2.0 + index) * 3.0
		var rise: float = progress * (14.0 + float(index) * 4.0)
		var size: float = 2.0 + float(index % 2)
		draw_circle(Vector2(drift, -rise), size, _alpha(_accent.darkened(0.16), alpha * (0.42 - float(index) * 0.045)))

func _draw_rune(progress: float, alpha: float) -> void:
	var radius: float = 8.0 + progress * 5.0
	var points: PackedVector2Array = PackedVector2Array()
	for index in range(6):
		var angle: float = TAU * float(index) / 6.0 - PI / 2.0
		points.append(Vector2.from_angle(angle) * radius)
		points.append(Vector2.from_angle(angle + PI / 6.0) * (radius * 0.45))
	for index in range(points.size()):
		var next_index: int = (index + 1) % points.size()
		draw_line(points[index], points[next_index], _alpha(_accent.lightened(0.18), alpha * 0.85), 1.5)

func _alpha(color_value: Color, alpha_value: float) -> Color:
	return Color(color_value.r, color_value.g, color_value.b, clampf(alpha_value, 0.0, 1.0))
