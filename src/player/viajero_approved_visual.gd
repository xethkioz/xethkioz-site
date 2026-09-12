class_name ViajeroApprovedVisual
extends Node2D

# Presentación del Viajero basada EXCLUSIVAMENTE en el arte P01 aprobado.
# El movimiento, hitboxes, daño y progresión permanecen en PlayerControllerProduction.

const ATLAS: Texture2D = preload("res://assets/production/characters/p01_approved/viajero_approved_atlas.png")

const REGION_DOWN := Rect2(0, 0, 121, 219)
const REGION_UP := Rect2(121, 0, 129, 219)
const REGION_LEFT := Rect2(250, 0, 131, 217)
const REGION_RIGHT := Rect2(381, 0, 132, 214)
const REGION_DASH := Rect2(513, 0, 213, 161)
const REGION_ATTACK := Rect2(726, 0, 241, 181)
const REGION_BURST := Rect2(967, 0, 219, 228)

@export var gameplay_scale: float = 0.30

var action: StringName = &"idle"
var facing: Vector2 = Vector2.DOWN
var combo_step: int = 0
var phase: float = 0.0
var resonance_color: Color = Color("8b5cf6")
var hit_flash: float = 0.0
var invulnerable: bool = false
var invuln_phase: float = 0.0

var pixel_sprite: Sprite2D
var _atlas_texture := AtlasTexture.new()

func _ready() -> void:
	pixel_sprite = Sprite2D.new()
	pixel_sprite.name = "ApprovedPixelSprite"
	pixel_sprite.centered = true
	pixel_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	pixel_sprite.z_index = 2
	add_child(pixel_sprite)
	_atlas_texture.atlas = ATLAS
	_apply_visual_state()

func _process(delta: float) -> void:
	var rate := 4.0
	match action:
		&"walk": rate = 7.0
		&"run": rate = 11.5
		&"dash": rate = 18.0
		&"attack": rate = 14.0
		&"hurt": rate = 16.0
		&"burst": rate = 8.0
		&"interact": rate = 6.0
	phase += delta * rate
	invuln_phase += delta * 22.0
	hit_flash = maxf(0.0, hit_flash - delta * 6.8)
	_apply_visual_state()
	queue_redraw()

func set_action(value: StringName, step: int = 0) -> void:
	if action != value or combo_step != step:
		phase = 0.0
	action = value
	combo_step = step
	_apply_visual_state()

func set_facing(value: Vector2) -> void:
	if value.length_squared() > 0.001:
		facing = value.normalized()
	_apply_visual_state()

func set_resonance_color(value: Color) -> void:
	resonance_color = value
	queue_redraw()

func flash_hurt() -> void:
	hit_flash = 1.0
	set_action(&"hurt")

func set_invulnerable(value: bool) -> void:
	invulnerable = value

func _apply_visual_state() -> void:
	if not is_instance_valid(pixel_sprite):
		return

	var region := _direction_region()
	var use_action_art := false
	if action == &"dash" and absf(facing.x) >= 0.45:
		region = REGION_DASH
		use_action_art = true
	elif action == &"attack" and absf(facing.x) >= 0.42:
		region = REGION_ATTACK
		use_action_art = true
	elif action == &"burst":
		region = REGION_BURST
		use_action_art = true

	_atlas_texture.region = region
	pixel_sprite.texture = _atlas_texture
	pixel_sprite.flip_h = use_action_art and facing.x < -0.15 and action in [&"dash", &"attack"]

	var scale_value := gameplay_scale
	if action == &"dash" and use_action_art:
		scale_value *= 0.82
	elif action == &"attack" and use_action_art:
		scale_value *= 0.80
	elif action == &"burst":
		scale_value *= 0.79

	var texture_height := region.size.y
	var y_base := -texture_height * scale_value * 0.5 + 5.0
	var bob := 0.0
	var sway := 0.0
	var squash := 1.0
	var lateral := 0.0

	if action == &"idle":
		bob = sin(phase) * 0.7
	elif action == &"walk":
		bob = -absf(sin(phase)) * 1.8
		sway = sin(phase) * 0.012
		squash = 1.0 - absf(sin(phase)) * 0.012
	elif action == &"run":
		bob = -absf(sin(phase)) * 2.8
		sway = sin(phase) * 0.020
		squash = 1.0 - absf(sin(phase)) * 0.020
	elif action == &"hurt":
		bob = sin(phase * 2.0) * 1.7
		sway = sin(phase * 2.0) * 0.038
	elif action == &"interact":
		bob = -absf(sin(phase)) * 1.0
		sway = sin(phase) * 0.010

	# El gameplay conserva 8 direcciones. El arte aprobado tiene 4 vistas;
	# el desplazamiento lateral hace que las diagonales no parezcan una simple
	# repetición cardinal sin inventar un quinto diseño del personaje.
	if absf(facing.x) > 0.25 and absf(facing.y) > 0.25 and not use_action_art:
		lateral = facing.x * 1.4
		sway += -facing.x * 0.012

	pixel_sprite.position = Vector2(lateral, y_base + bob)
	pixel_sprite.rotation = sway
	pixel_sprite.scale = Vector2(scale_value, scale_value * squash)

	var base_modulate := Color.WHITE
	if hit_flash > 0.0:
		base_modulate = Color.WHITE.lerp(Color(1.0, 0.36, 0.34, 1.0), hit_flash)
	if invulnerable:
		base_modulate.a = 0.50 + 0.50 * absf(sin(invuln_phase))
	pixel_sprite.modulate = base_modulate

func _direction_region() -> Rect2:
	if absf(facing.y) >= absf(facing.x):
		return REGION_UP if facing.y < 0.0 else REGION_DOWN
	return REGION_LEFT if facing.x < 0.0 else REGION_RIGHT

func _draw() -> void:
	# Sombra de contacto pequeña: la imagen aprobada conserva su propia sombra,
	# ésta sólo ancla visualmente al personaje al suelo del mapa real.
	var shadow := _ellipse_points(Vector2(0.0, 1.5), Vector2(19.0, 5.5), 24)
	draw_colored_polygon(shadow, Color(0.0, 0.0, 0.0, 0.20))

	if action in [&"idle", &"walk", &"run", &"interact"]:
		var pulse_alpha := 0.10 + 0.05 * (0.5 + 0.5 * sin(phase * 0.55))
		draw_arc(Vector2(0.0, -7.0), 23.0, 0.20, 2.94, 28, Color(resonance_color, pulse_alpha), 1.5)

	if action == &"attack":
		var start_angle := -1.25
		var end_angle := 0.65
		if facing.x < -0.45:
			start_angle = 2.50
			end_angle = 4.40
		elif facing.y < -0.45:
			start_angle = 3.35
			end_angle = 5.65
		elif facing.y > 0.45:
			start_angle = 0.15
			end_angle = 2.75
		var radius := 34.0 + float(combo_step) * 2.0
		draw_arc(Vector2(0.0, -18.0), radius, start_angle, end_angle, 26, Color(resonance_color, 0.38), 2.4)

	if action == &"burst":
		var radius_1 := 27.0 + fmod(phase * 5.5, 30.0)
		var radius_2 := 16.0 + fmod(phase * 3.8, 22.0)
		draw_arc(Vector2(0.0, -15.0), radius_1, 0.0, TAU, 36, Color(resonance_color, 0.30), 2.0)
		draw_arc(Vector2(0.0, -15.0), radius_2, 0.0, TAU, 30, Color(resonance_color, 0.42), 1.4)

	if action == &"hurt":
		draw_arc(Vector2(0.0, -18.0), 25.0, 0.0, TAU, 28, Color(1.0, 0.22, 0.28, 0.28), 1.8)

func _ellipse_points(center: Vector2, radii: Vector2, segments: int) -> PackedVector2Array:
	var points := PackedVector2Array()
	for index in range(segments):
		var angle := TAU * float(index) / float(segments)
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	return points
