extends "res://src/npc/boss5_guardian.gd"

const SPRITE := preload("res://assets/production/characters/boss5_guardian_v2.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")

var _visual: Sprite2D
var _visual_time: float = 0.0
var _hit_flash_left: float = 0.0
var _phase_flash_left: float = 0.0
var _entrance_left: float = 0.85
var _last_phase: int = 1

func _ready() -> void:
	super._ready()
	_last_phase = phase
	_visual = Sprite2D.new()
	_visual.texture = SPRITE
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -24)
	_visual.z_index = 3
	_visual.scale = Vector2.ONE * 0.76
	add_child(_visual)
	_spawn_feedback("burst", Vector2.UP, Color("8b5cf6"), "")

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	_visual_time += delta
	_hit_flash_left = maxf(0.0, _hit_flash_left - delta)
	_phase_flash_left = maxf(0.0, _phase_flash_left - delta)
	_entrance_left = maxf(0.0, _entrance_left - delta)
	if phase != _last_phase:
		_last_phase = phase
		_phase_flash_left = 0.55
		_spawn_feedback("burst", Vector2.UP, Color("d8ceff") if phase == 3 else Color("9bcf75"), "FASE %d" % phase)
	if is_instance_valid(_visual):
		var phase_tint: Color = Color.WHITE
		if phase == 2:
			phase_tint = Color(0.92, 1.0, 0.86)
		elif phase == 3 and not core_exposed:
			phase_tint = Color(0.58, 0.52, 0.64)
		elif phase == 3 and core_exposed:
			phase_tint = Color(1.0, 0.93, 1.0)
		if _phase_flash_left > 0.0:
			phase_tint = phase_tint.lerp(Color("d8ceff"), 0.45)
		if _hit_flash_left > 0.0:
			phase_tint = Color(1.0, 0.60, 0.46, 1.0)
		_visual.modulate = phase_tint
		var breathe: float = 1.0 + sin(_visual_time * 2.4) * (0.015 if phase < 3 else 0.025)
		var entrance_t: float = 1.0 - clampf(_entrance_left / 0.85, 0.0, 1.0)
		var entrance_scale: float = lerpf(0.76, 1.0, ease(entrance_t, 0.55))
		_visual.scale = Vector2.ONE * breathe * entrance_scale
		_visual.position.y = -24.0 - sin(_visual_time * 1.7) * (0.8 if phase < 3 else 1.5)

func take_damage(amount: float) -> void:
	if amount <= 0.0:
		return
	var previous_health: float = health
	super.take_damage(amount)
	var dealt: float = maxf(0.0, previous_health - health)
	if dealt <= 0.0:
		return
	_hit_flash_left = 0.14
	_spawn_feedback("hit", _impact_direction(), Color("ff8c42"), str(roundi(dealt)))
	if health <= 0.0:
		_spawn_feedback("death", Vector2.UP, Color("d8ceff"), "PURIFICADO")

func _impact_direction() -> Vector2:
	if is_instance_valid(_player):
		var direction: Vector2 = global_position - _player.global_position
		if direction.length_squared() > 0.001:
			return direction.normalized()
	return Vector2.UP

func _spawn_feedback(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String) -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -20)
	scene.add_child(fx)
	fx.call("configure", kind_value, direction_value, color_value, text_value)

func _draw() -> void:
	var ratio: float = health / max_health if max_health > 0.0 else 0.0
	var telegraph: float = pulse_windup_ratio()

	# Arena presence and grounded silhouette.
	draw_ellipse_shadow(Vector2(0, 18), Vector2(44, 14), Color(0.02, 0.05, 0.04, 0.38))
	if phase >= 2:
		draw_circle(Vector2(0, 2), ROOT_PULSE_RADIUS, Color(0.28, 0.14, 0.36, 0.055))
		draw_arc(Vector2(0, 2), ROOT_PULSE_RADIUS, 0.0, TAU, 56, Color(0.55, 0.36, 0.96, 0.24), 2.0)

	if telegraph > 0.0:
		var danger: Color = Color(0.88, 0.48 + telegraph * 0.25, 1.0, 0.36 + telegraph * 0.52)
		var fill_alpha: float = 0.045 + telegraph * 0.095
		draw_circle(Vector2(0, 2), ROOT_PULSE_RADIUS, Color(danger.r, danger.g, danger.b, fill_alpha))
		var closing_radius: float = lerpf(ROOT_PULSE_RADIUS - 3.0, 18.0, telegraph)
		draw_arc(Vector2(0, 2), closing_radius, 0.0, TAU, 56, Color(1.0, 0.78, 1.0, 0.72), 2.2)
		for i in range(10):
			var angle: float = TAU * float(i) / 10.0 + _visual_time * 0.08
			var inner: Vector2 = Vector2.from_angle(angle) * (22.0 + telegraph * 12.0) + Vector2(0, 2)
			var outer: Vector2 = Vector2.from_angle(angle) * ROOT_PULSE_RADIUS + Vector2(0, 2)
			var bend: Vector2 = Vector2.from_angle(angle + (0.12 if i % 2 == 0 else -0.12)) * (ROOT_PULSE_RADIUS * 0.66) + Vector2(0, 2)
			draw_polyline(PackedVector2Array([inner, bend, outer]), Color(danger.r, danger.g, danger.b, danger.a * 0.72), 2.0)
			draw_circle(outer, 2.1 + telegraph * 1.2, Color("d8ceff"))

	if phase == 3:
		var core_color: Color = Color("f3ecff") if core_exposed else Color("48404f")
		var core_alpha: float = 0.26 + 0.12 * (0.5 + 0.5 * sin(_visual_time * 4.0)) if core_exposed else 0.10
		draw_circle(Vector2(0, -18), 16.0, Color(core_color.r, core_color.g, core_color.b, core_alpha))
		draw_arc(Vector2(0, -18), 20.0, 0.0, TAU, 36, core_color, 3.0)
		if core_exposed:
			for i in range(6):
				var angle: float = _visual_time * 1.8 + TAU * float(i) / 6.0
				var p: Vector2 = Vector2(0, -18) + Vector2.from_angle(angle) * 25.0
				draw_circle(p, 2.5, Color("d8ceff"))
		else:
			for i in range(4):
				var start: float = _visual_time * 0.25 + TAU * float(i) / 4.0
				draw_arc(Vector2(0, -18), 27.0, start, start + 0.72, 8, Color(0.43,0.36,0.50,0.85), 3.0)

	if _phase_flash_left > 0.0:
		var flash_ratio: float = _phase_flash_left / 0.55
		draw_arc(Vector2(0, -8), 50.0 + (1.0 - flash_ratio) * 25.0, 0.0, TAU, 40, Color(0.72,0.60,1.0,flash_ratio * 0.55), 3.0)
	if _mark_time > 0.0:
		draw_arc(Vector2(0, -15), 42.0, 0.0, TAU, 36, Color("c686ff"), 2.0)
	if _root_time > 0.0:
		draw_line(Vector2(-24, 17), Vector2(24, 17), Color("b99a6a"), 4.0)

	var font: Font = ThemeDB.fallback_font
	draw_string(font, Vector2(-64, -83), "GUARDIÁN DEL BOSQUE VELADO", HORIZONTAL_ALIGNMENT_CENTER, 128, 8, Color("f0f0f5"))
	draw_string(font, Vector2(-30, -72), "FASE %d" % phase, HORIZONTAL_ALIGNMENT_CENTER, 60, 6, Color("d8ceff"))
	draw_rect(Rect2(-50, -65, 100, 7), Color("17151b"))
	draw_rect(Rect2(-50, -65, 100.0 * ratio, 7), Color("ff8c42"))
	draw_rect(Rect2(-50, -65, 100, 7), Color("8b5cf6"), false, 1.0)

func draw_ellipse_shadow(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var angle: float = TAU * float(i) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
