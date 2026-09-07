extends "res://scripts/player_v3.gd"

var traveler_name := "Viajero"
var avatar_palette := 0
var air_jumps := 1

const PALETTES := [
	{"skin":Color(0.91,0.76,0.58),"coat":Color(0.39,0.19,0.62),"accent":Color(0.67,0.35,0.95)},
	{"skin":Color(0.84,0.64,0.47),"coat":Color(0.62,0.24,0.12),"accent":Color(1.0,0.42,0.10)},
	{"skin":Color(0.73,0.55,0.39),"coat":Color(0.10,0.36,0.39),"accent":Color(0.26,0.82,0.76)},
	{"skin":Color(0.95,0.81,0.66),"coat":Color(0.45,0.36,0.10),"accent":Color(1.0,0.78,0.20)}
]

func configure_traveler(name_value: String,palette_index: int) -> void:
	traveler_name = name_value if not name_value.strip_edges().is_empty() else "Viajero"
	avatar_palette = clamp(palette_index,0,PALETTES.size()-1)
	queue_redraw()

func _physics_process(delta: float) -> void:
	var wants_jump := Input.is_action_just_pressed("jump")
	if is_on_floor():
		air_jumps = 1
	elif wants_jump and coyote_timer <= 0.0 and air_jumps > 0:
		velocity.y = jump_velocity * 0.90
		air_jumps -= 1
		jump_buffer_timer = 0.0
		if main_ref:
			main_ref.play_sfx("jump")
	super._physics_process(delta)
	if is_on_floor():
		air_jumps = 1

func _try_skill(slot: int) -> void:
	if hero_class == "Aprendiz Prismático":
		if main_ref and main_ref.has_method("mentor_locked_feedback"):
			main_ref.mentor_locked_feedback()
		return
	super._try_skill(slot)

func _draw() -> void:
	var p: Dictionary = PALETTES[avatar_palette]
	var skin: Color = p["skin"]
	var coat: Color = p["coat"]
	var accent: Color = p["accent"]
	if invuln_timer > 0.0 and int(Time.get_ticks_msec()/70)%2 == 0:
		skin = skin.lightened(0.25)
		coat = coat.lightened(0.35)
	var flip := float(facing)
	draw_circle(Vector2(0,-8),8.0,skin)
	draw_rect(Rect2(-8,-1,16,19),coat)
	draw_rect(Rect2(-11,-3,22,4),accent)
	draw_polygon(PackedVector2Array([Vector2(-4*flip,3),Vector2(-18*flip,8),Vector2(-5*flip,11)]),PackedColorArray([Color(1.0,0.4,0.08)]))
	draw_rect(Rect2(-7,18,5,10),Color(0.12,0.16,0.24))
	draw_rect(Rect2(2,18,5,10),Color(0.12,0.16,0.24))
	if dash_timer > 0.0:
		draw_circle(Vector2(-facing*15,5),10.0,Color(accent,0.22),false,2.0)
