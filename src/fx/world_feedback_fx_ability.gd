extends "res://src/fx/world_feedback_fx_impact.gd"

const ProceduralSfx := preload("res://src/audio/izrdralar_procedural_sfx.gd")

# Mentor ability readability pass. Gameplay semantics remain owned by the
# player controller; this layer only gives each combat school a distinct shape.
func configure(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "", duration_override: float = -1.0) -> void:
	super.configure(kind_value, direction_value, color_value, text_value, duration_override)
	if duration_override > 0.0:
		return
	match kind_value:
		"wave":
			_duration = 0.36
		"guard":
			_duration = 0.48
		"mark":
			_duration = 0.52
		"root":
			_duration = 0.58
		"shot":
			_duration = 0.26
		"trap":
			_duration = 0.62
		"charge":
			_duration = 0.38
		"regen":
			_duration = 0.72

func _play_authored_sfx() -> void:
	if DisplayServer.get_name() == "headless" or not AccessibilityService.sfx_enabled:
		return
	var stream := ProceduralSfx.build(_kind)
	if stream == null:
		return
	if not is_instance_valid(_sfx_player):
		_sfx_player = AudioStreamPlayer2D.new()
		_sfx_player.name = "AuthoredSfx"
		add_child(_sfx_player)
	_sfx_player.volume_db = AccessibilityService.sfx_volume_db
	_sfx_player.stream = stream
	_sfx_player.play()

func _draw() -> void:
	var progress: float = clampf(_elapsed / maxf(_duration, 0.001), 0.0, 1.0)
	var alpha: float = 1.0 - progress
	match _kind:
		"wave":
			_draw_wave(progress, alpha)
		"guard":
			_draw_guard(progress, alpha)
		"mark":
			_draw_mark(progress, alpha)
		"root":
			_draw_root(progress, alpha)
		"shot":
			_draw_shot(progress, alpha)
		"trap":
			_draw_trap(progress, alpha)
		"charge":
			_draw_charge(progress, alpha)
		"regen":
			_draw_regen(progress, alpha)
		_:
			super._draw()

func _draw_wave(progress: float, alpha: float) -> void:
	var angle := _direction.angle()
	var radius := 13.0 + progress * 32.0
	for band in range(3):
		var band_radius := radius - float(band) * 7.0
		if band_radius <= 2.0:
			continue
		var band_alpha := alpha * (0.92 - float(band) * 0.22)
		draw_arc(Vector2.ZERO, band_radius, angle - 0.72, angle + 0.72, 18, _alpha(_accent.lightened(0.12 * float(2 - band)), band_alpha), 2.4 - float(band) * 0.4)
	var crest := _direction * (radius + 1.0)
	draw_circle(crest, 2.2, _alpha(Color.WHITE, alpha * 0.72))

func _draw_guard(progress: float, alpha: float) -> void:
	var pulse := sin(progress * PI)
	var radius := 14.0 + pulse * 5.0
	var points := PackedVector2Array()
	for index in range(6):
		points.append(Vector2.from_angle(TAU * float(index) / 6.0 - PI / 2.0) * radius)
	for index in range(points.size()):
		draw_line(points[index], points[(index + 1) % points.size()], _alpha(_accent.lightened(0.18), alpha * 0.90), 2.4)
	draw_arc(Vector2.ZERO, radius - 5.0, -PI * 0.85, PI * 0.15, 16, _alpha(Color.WHITE, alpha * 0.54), 1.4)

func _draw_mark(progress: float, alpha: float) -> void:
	var radius := 8.0 + progress * 8.0
	var spin := progress * 0.65
	var points := PackedVector2Array()
	for index in range(4):
		points.append(Vector2.from_angle(spin + PI * 0.25 + TAU * float(index) / 4.0) * radius)
	for index in range(4):
		draw_line(points[index], points[(index + 1) % 4], _alpha(_accent, alpha * 0.90), 2.0)
	draw_line(Vector2(-radius * 0.45, 0), Vector2(radius * 0.45, 0), _alpha(Color.WHITE, alpha * 0.70), 1.4)
	draw_line(Vector2(0, -radius * 0.45), Vector2(0, radius * 0.45), _alpha(Color.WHITE, alpha * 0.70), 1.4)

func _draw_root(progress: float, alpha: float) -> void:
	var reach := 9.0 + progress * 25.0
	for index in range(6):
		var angle := TAU * float(index) / 6.0 + sin(progress * PI + float(index)) * 0.12
		var ray := Vector2.from_angle(angle)
		var side := Vector2(-ray.y, ray.x)
		var mid := ray * (reach * 0.55) + side * sin(float(index) * 2.3) * 3.0
		draw_polyline(PackedVector2Array([Vector2.ZERO, mid, ray * reach]), _alpha(_accent.darkened(0.08), alpha * 0.86), 2.2)
		draw_line(mid, mid + side * 5.0, _alpha(_accent.lightened(0.15), alpha * 0.60), 1.2)

func _draw_shot(progress: float, alpha: float) -> void:
	var start := _direction * 4.0
	var end := _direction * (24.0 + progress * 52.0)
	var side := Vector2(-_direction.y, _direction.x)
	draw_line(start, end, _alpha(_accent.lightened(0.16), alpha), 2.2)
	draw_line(start + side * 2.0, end + side, _alpha(Color.WHITE, alpha * 0.74), 1.0)
	draw_circle(end, 2.6, _alpha(Color.WHITE, alpha * 0.82))

func _draw_trap(progress: float, alpha: float) -> void:
	var radius := 10.0 + sin(progress * PI) * 7.0
	draw_arc(Vector2.ZERO, radius, 0.0, TAU, 24, _alpha(_accent, alpha * 0.82), 1.8)
	for index in range(4):
		var angle := TAU * float(index) / 4.0 + PI * 0.25
		var outer := Vector2.from_angle(angle) * (radius + 7.0)
		var inner := Vector2.from_angle(angle) * (radius - 2.0)
		draw_line(inner, outer, _alpha(_accent.lightened(0.18), alpha * 0.88), 2.0)
		draw_circle(outer, 1.8, _alpha(Color.WHITE, alpha * 0.64))

func _draw_charge(progress: float, alpha: float) -> void:
	var length := 26.0 + progress * 48.0
	var side := Vector2(-_direction.y, _direction.x)
	var start := _direction * 3.0
	var end := _direction * length
	draw_line(start, end, _alpha(_accent, alpha), 4.0)
	draw_line(start + side * 3.5, end + side * 1.5, _alpha(Color.WHITE, alpha * 0.72), 1.4)
	draw_line(start - side * 3.5, end - side * 1.5, _alpha(_accent.lightened(0.24), alpha * 0.66), 1.4)
	for offset in [14.0, 27.0]:
		var center := _direction * minf(offset + progress * 8.0, length - 3.0)
		draw_arc(center, 5.0 + progress * 2.0, 0.0, TAU, 16, _alpha(_accent.lightened(0.12), alpha * 0.50), 1.2)

func _draw_regen(progress: float, alpha: float) -> void:
	var rise := progress * 22.0
	draw_arc(Vector2(0, -3.0 - rise * 0.25), 10.0 + progress * 8.0, 0.0, TAU, 20, _alpha(_accent, alpha * 0.62), 1.5)
	for index in range(5):
		var angle := -PI * 0.85 + float(index) * (PI * 0.42)
		var drift := Vector2.from_angle(angle) * (6.0 + float(index % 2) * 4.0)
		var point := drift + Vector2(0, -rise * (0.55 + float(index) * 0.08))
		draw_circle(point, 2.0, _alpha(_accent.lightened(0.22), alpha * 0.82))
		draw_line(point + Vector2(-2, 0), point + Vector2(2, 0), _alpha(Color.WHITE, alpha * 0.54), 1.0)
