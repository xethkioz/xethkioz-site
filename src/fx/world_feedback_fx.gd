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
		"death":
			_duration = 0.52
		"pickup":
			_duration = 0.68
		"hurt":
			_duration = 0.30
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
		"death":
			_draw_death(progress, alpha)
		"pickup":
			_draw_pickup(progress, alpha)
		"hurt":
			_draw_hurt(progress, alpha)
		_:
			_draw_hit(progress, alpha)

func _draw_slash(progress: float, alpha: float) -> void:
	var angle: float = _direction.angle()
	var sweep: float = 0.78
	var radius: float = 16.0 + progress * 8.0
	draw_arc(Vector2.ZERO, radius, angle - sweep, angle + sweep, 18, _alpha(_accent.lightened(0.32), alpha), 3.0)
	draw_arc(Vector2.ZERO, radius - 5.0, angle - sweep * 0.72, angle + sweep * 0.72, 14, _alpha(Color.WHITE, alpha * 0.72), 1.5)

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

func _alpha(color_value: Color, alpha_value: float) -> Color:
	return Color(color_value.r, color_value.g, color_value.b, clampf(alpha_value, 0.0, 1.0))
