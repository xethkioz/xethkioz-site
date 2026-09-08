extends "res://src/npc/boss5_guardian.gd"

const SPRITE := preload("res://assets/production/characters/boss5_guardian_v2.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")

var _visual: Sprite2D
var _visual_time: float = 0.0
var _hit_flash_left: float = 0.0

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = SPRITE
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -24)
	_visual.z_index = 3
	add_child(_visual)

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	_visual_time += delta
	_hit_flash_left = maxf(0.0, _hit_flash_left - delta)
	if is_instance_valid(_visual):
		var phase_tint: Color = Color.WHITE
		if phase == 2:
			phase_tint = Color(0.92, 1.0, 0.86)
		elif phase == 3 and not core_exposed:
			phase_tint = Color(0.58, 0.52, 0.64)
		if _hit_flash_left > 0.0:
			phase_tint = Color(1.0, 0.60, 0.46, 1.0)
		_visual.modulate = phase_tint
		var breathe: float = 1.0 + sin(_visual_time * 2.4) * (0.015 if phase < 3 else 0.025)
		_visual.scale = Vector2.ONE * breathe

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
	if phase >= 2:
		draw_arc(Vector2(0, 2), ROOT_PULSE_RADIUS, 0.0, TAU, 56, Color(0.55, 0.36, 0.96, 0.20), 2.0)
	if telegraph > 0.0:
		var danger: Color = Color(0.88, 0.48 + telegraph * 0.25, 1.0, 0.35 + telegraph * 0.55)
		draw_arc(Vector2(0, 2), ROOT_PULSE_RADIUS, 0.0, TAU, 64, danger, 3.0 + telegraph * 2.0)
		for i in range(8):
			var angle: float = TAU * float(i) / 8.0 + _visual_time * 0.18
			var inner: Vector2 = Vector2.from_angle(angle) * (30.0 + telegraph * 8.0)
			var outer: Vector2 = Vector2.from_angle(angle) * ROOT_PULSE_RADIUS
			draw_line(inner, outer, Color(danger.r, danger.g, danger.b, danger.a * 0.65), 2.0)
	if phase == 3:
		var core_color: Color = Color("eee8ff") if core_exposed else Color("3d3445")
		draw_circle(Vector2(0, -18), 13.0, Color(core_color.r, core_color.g, core_color.b, 0.18))
		draw_arc(Vector2(0, -18), 19.0, 0.0, TAU, 32, core_color, 3.0)
		if core_exposed:
			for i in range(4):
				var angle: float = _visual_time * 1.8 + TAU * float(i) / 4.0
				var p: Vector2 = Vector2(0, -18) + Vector2.from_angle(angle) * 24.0
				draw_circle(p, 2.5, Color("d8ceff"))
	if _mark_time > 0.0:
		draw_arc(Vector2(0, -15), 42.0, 0.0, TAU, 36, Color("c686ff"), 2.0)
	if _root_time > 0.0:
		draw_line(Vector2(-24, 17), Vector2(24, 17), Color("b99a6a"), 4.0)
	var font: Font = ThemeDB.fallback_font
	draw_string(font, Vector2(-64, -79), "GUARDIÁN DEL BOSQUE VELADO", HORIZONTAL_ALIGNMENT_CENTER, 128, 8, Color("f0f0f5"))
	draw_rect(Rect2(-50, -68, 100, 7), Color("17151b"))
	draw_rect(Rect2(-50, -68, 100.0 * ratio, 7), Color("ff8c42"))
	draw_rect(Rect2(-50, -68, 100, 7), Color("8b5cf6"), false, 1.0)
