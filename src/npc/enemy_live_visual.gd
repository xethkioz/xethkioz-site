class_name IzrdralarEnemyLiveVisual
extends Node2D

# Articulated pixel-style renderer for the six production enemy families.
# It preserves their authored silhouettes/colors while separating body parts so
# idle, movement, windup, attack, recovery and hurt are not a static image slide.

var species_index := 0
var action_state := "idle"
var facing := Vector2.DOWN
var speed_ratio := 0.0
var _phase := 0.0
var _hurt_left := 0.0
var _seed_phase := 0.0

func configure_species(index_value: int) -> void:
	species_index = clampi(index_value, 0, 5)
	_seed_phase = float(species_index) * 0.73
	queue_redraw()

func set_motion_state(state_value: String, facing_value: Vector2, speed_value: float) -> void:
	action_state = state_value
	if facing_value.length_squared() > 0.001:
		facing = facing_value.normalized()
	speed_ratio = clampf(speed_value, 0.0, 1.5)
	queue_redraw()

func flash_hurt(duration: float = 0.13) -> void:
	_hurt_left = maxf(_hurt_left, duration)
	queue_redraw()

func _process(delta: float) -> void:
	var pace := 1.0
	match action_state:
		"move", "chase", "return", "patrol": pace = 1.0 + speed_ratio * 2.0
		"windup": pace = 0.65
		"attack": pace = 2.2
		"recover": pace = 0.72
		_: pace = 0.55
	_phase += delta * pace
	_hurt_left = maxf(0.0, _hurt_left - delta)
	queue_redraw()

func _draw() -> void:
	match species_index:
		0: _draw_brote_goblin()
		1: _draw_explorer_goblin()
		2: _draw_prismatic_slime()
		3: _draw_bark_beetle()
		4: _draw_mist_spirit()
		5: _draw_broken_drone()

func _state_amount() -> float:
	match action_state:
		"windup": return 1.0
		"attack": return 1.0
		"recover": return 0.45
		_: return 0.0

func _walk_cycle(multiplier: float = 1.0) -> float:
	if action_state not in ["move", "chase", "return", "patrol"]:
		return sin(_phase * 2.0 + _seed_phase) * 0.10
	return sin(_phase * 7.2 * multiplier + _seed_phase) * minf(1.0, speed_ratio)

func _facing_sign() -> float:
	if absf(facing.x) < 0.12:
		return 1.0
	return signf(facing.x)

func _hurt_color(base: Color) -> Color:
	if _hurt_left <= 0.0:
		return base
	var pulse := 0.55 + 0.45 * absf(sin(_hurt_left * 74.0))
	return base.lerp(Color("ffd5cf"), pulse)

func _shadow(rx: float, ry: float, alpha: float = 0.34) -> void:
	var points := PackedVector2Array()
	for i in range(20):
		var a := TAU * float(i) / 20.0
		points.append(Vector2(cos(a) * rx, 7.0 + sin(a) * ry))
	draw_colored_polygon(points, Color(0.02, 0.04, 0.04, alpha))

func _draw_brote_goblin() -> void:
	var step := _walk_cycle(1.04)
	var wind := _state_amount()
	var side := _facing_sign()
	var crouch := 1.7 * wind if action_state == "windup" else 0.0
	var strike := maxf(0.0, sin(_phase * 8.0)) if action_state == "attack" else 0.0
	_shadow(9.5, 2.1)

	# Legs move independently; no whole-image sliding illusion.
	var leg_a := step * 2.4
	var leg_b := -step * 2.4
	draw_line(Vector2(-4, 3 + crouch), Vector2(-5 + leg_a, 8), _hurt_color(Color("2e4b2e")), 2.3)
	draw_line(Vector2(4, 3 + crouch), Vector2(5 + leg_b, 8), _hurt_color(Color("2e4b2e")), 2.3)

	var body := _hurt_color(Color("548448"))
	var body_dark := _hurt_color(Color("416d39"))
	draw_colored_polygon(PackedVector2Array([Vector2(-8,-6+crouch),Vector2(8,-6+crouch),Vector2(10,2+crouch),Vector2(6,5+crouch),Vector2(-7,5+crouch),Vector2(-10,1+crouch)]), body_dark)
	draw_rect(Rect2(-6,-5+crouch,12,8), body, true)
	draw_rect(Rect2(-8,0+crouch,16,2), _hurt_color(Color("694a34")), true)

	var head_y := -13.0 + crouch
	draw_rect(Rect2(-6,head_y,12,7), _hurt_color(Color("65994e")), true)
	draw_colored_polygon(PackedVector2Array([Vector2(-6,head_y+1),Vector2(-2,head_y-5),Vector2(0,head_y+1)]), _hurt_color(Color("285431")))
	draw_colored_polygon(PackedVector2Array([Vector2(3,head_y+1),Vector2(8,head_y-5),Vector2(6,head_y+2)]), _hurt_color(Color("285431")))
	draw_rect(Rect2(-4,head_y+2,2,2), Color("e5ff9e"), true)
	draw_rect(Rect2(3,head_y+2,2,2), Color("e5ff9e"), true)

	var arm_swing := step * 2.8
	var attack_reach := side * (5.0 * wind + 8.0 * strike)
	draw_line(Vector2(-7,-3+crouch), Vector2(-11-arm_swing + minf(0.0,attack_reach),2+crouch), _hurt_color(Color("597f43")), 2.3)
	draw_line(Vector2(7,-3+crouch), Vector2(11+arm_swing + maxf(0.0,attack_reach),2+crouch), _hurt_color(Color("597f43")), 2.3)

func _draw_explorer_goblin() -> void:
	var step := _walk_cycle(1.32)
	var side := _facing_sign()
	var wind := _state_amount()
	var lean := side * (1.6 * wind + step * 0.7)
	var strike := sin(clampf(fmod(_phase * 2.8, 1.0),0.0,1.0) * PI) if action_state == "attack" else 0.0
	_shadow(9.0, 1.9, 0.31)

	draw_line(Vector2(-4+lean,3), Vector2(-6 + step*3.0,8), _hurt_color(Color("27462b")), 2.1)
	draw_line(Vector2(4+lean,3), Vector2(6 - step*3.0,8), _hurt_color(Color("27462b")), 2.1)
	draw_colored_polygon(PackedVector2Array([Vector2(-7+lean,-6),Vector2(7+lean,-6),Vector2(9+lean,3),Vector2(5+lean,5),Vector2(-6+lean,5),Vector2(-9+lean,2)]), _hurt_color(Color("315f37")))
	draw_rect(Rect2(-5+lean,-5,10,8), _hurt_color(Color("437447")), true)

	var head_y := -13.0
	draw_rect(Rect2(-6+lean,head_y,12,7), _hurt_color(Color("5d8d48")), true)
	draw_colored_polygon(PackedVector2Array([Vector2(-7+lean,head_y),Vector2(7+lean,head_y),Vector2(4+lean,head_y-4),Vector2(-4+lean,head_y-4)]), _hurt_color(Color("3a4a31")))
	draw_rect(Rect2(-4+lean,head_y+2,2,2), Color("f0ffa3"), true)
	draw_rect(Rect2(3+lean,head_y+2,2,2), Color("f0ffa3"), true)

	# Spear follows the attacking arm and actually thrusts.
	var spear_x := 8.0 + lean + side * (wind*4.0 + strike*8.0)
	var spear_top := -15.0 - strike*2.0
	var spear_bottom := 6.0 + strike*2.0
	draw_line(Vector2(spear_x,spear_bottom),Vector2(spear_x+side*3.0,spear_top),_hurt_color(Color("755033")),2.0)
	var tip := Vector2(spear_x+side*3.0,spear_top)
	draw_colored_polygon(PackedVector2Array([tip+Vector2(-3,-1),tip+Vector2(0,-5),tip+Vector2(3,-1),tip]),_hurt_color(Color("b99461")))

func _draw_prismatic_slime() -> void:
	var moving := action_state in ["move","chase","return","patrol"]
	var hop := maxf(0.0, sin(_phase * (6.2 if moving else 2.3)))
	var wind := 1.0 if action_state == "windup" else 0.0
	var attack := maxf(0.0, sin(_phase*7.0)) if action_state == "attack" else 0.0
	var sx := 1.0 + hop*0.12 - wind*0.10 + attack*0.18
	var sy := 1.0 - hop*0.14 + wind*0.16 - attack*0.10
	var y := 1.5 - hop*2.3
	_shadow(11.0*sx,2.3)

	var body := _hurt_color(Color("3da77e"))
	var light := _hurt_color(Color("72d0a4"))
	var outline := _hurt_color(Color("226c58"))
	# Layered lobes deform separately to create actual jelly motion.
	draw_circle(Vector2(-5*sx,y),7.0*maxf(0.78,sx),outline)
	draw_circle(Vector2(5*sx,y+0.7),7.4*maxf(0.78,sx),outline)
	draw_circle(Vector2(0,y-4*sy),9.2*maxf(0.78,sy),outline)
	draw_circle(Vector2(-4*sx,y-0.5),6.1*sx,body)
	draw_circle(Vector2(4*sx,y),6.4*sx,body)
	draw_circle(Vector2(0,y-4*sy),8.0*sy,light)
	# Core moves at a different phase than the gelatinous body.
	var core_y := y - 5.0*sy + sin(_phase*3.7+0.9)*1.0
	draw_colored_polygon(PackedVector2Array([Vector2(0,core_y-7),Vector2(4,core_y-1),Vector2(2,core_y+6),Vector2(-3,core_y+3),Vector2(-4,core_y-2)]),_hurt_color(Color("7555c8")))
	draw_colored_polygon(PackedVector2Array([Vector2(0,core_y-5),Vector2(2,core_y-1),Vector2(0,core_y+3),Vector2(-2,core_y)]),Color("d9ceff"))
	draw_circle(Vector2(-4,y-1),1.1,Color("113c34"))
	draw_circle(Vector2(4,y-1),1.1,Color("113c34"))

func _draw_bark_beetle() -> void:
	var step := _walk_cycle(1.55)
	var wind := 1.0 if action_state == "windup" else 0.0
	var attack := maxf(0.0,sin(_phase*7.5)) if action_state == "attack" else 0.0
	var shell_open := 0.5*wind + 0.9*attack
	_shadow(11.0,2.0)

	# Six legs alternate in tripod groups.
	for i in range(3):
		var y := -3.0 + float(i)*4.0
		var phase_sign := 1.0 if i%2==0 else -1.0
		var reach := 5.0 + step*phase_sign*2.0
		draw_line(Vector2(-7,y),Vector2(-13-reach*0.25,y+3+step*phase_sign),_hurt_color(Color("6d5c48")),1.7)
		draw_line(Vector2(7,y),Vector2(13+reach*0.25,y+3-step*phase_sign),_hurt_color(Color("6d5c48")),1.7)

	var left_shell := PackedVector2Array([Vector2(-1-shell_open,-10),Vector2(-9,-6),Vector2(-9,5),Vector2(-2,8),Vector2(-1,2)])
	var right_shell := PackedVector2Array([Vector2(1+shell_open,-10),Vector2(9,-6),Vector2(9,5),Vector2(2,8),Vector2(1,2)])
	draw_colored_polygon(left_shell,_hurt_color(Color("6c5c48")))
	draw_colored_polygon(right_shell,_hurt_color(Color("78654e")))
	draw_line(Vector2(0,-10),Vector2(0,8),_hurt_color(Color("2c2924")),2.0)
	draw_rect(Rect2(-4,-12,8,4),_hurt_color(Color("8b765a")),true)
	# Prism seam brightens before attack.
	var seam := Color("d2c6ff").lerp(Color.WHITE,wind*0.45+attack*0.45)
	draw_rect(Rect2(-6,-4,12,2),_hurt_color(Color("6c50b9")),true)
	draw_rect(Rect2(-2,-4,4,2),seam,true)

func _draw_mist_spirit() -> void:
	var wind := 1.0 if action_state == "windup" else 0.0
	var attack := maxf(0.0,sin(_phase*5.8)) if action_state == "attack" else 0.0
	var float_y := sin(_phase*2.4+_seed_phase)*1.7
	var stretch := 1.0 + wind*0.12 + attack*0.22
	_shadow(8.0,1.8,0.16)
	var base := _hurt_color(Color(0.72,0.85,0.87,0.78))
	var light := _hurt_color(Color(0.88,0.97,0.98,0.68))
	var points := PackedVector2Array()
	points.append(Vector2(-7,-7*stretch+float_y))
	points.append(Vector2(-6,5+float_y))
	for i in range(5):
		var x := -6.0+float(i)*3.0
		var tail_y := 9.0 + sin(_phase*3.0+float(i)*1.2)*2.2
		points.append(Vector2(x,tail_y+float_y))
	points.append(Vector2(7,-7*stretch+float_y))
	draw_colored_polygon(points,base)
	draw_circle(Vector2(0,-8*stretch+float_y),7.0,light)
	draw_rect(Rect2(-5,-9*stretch+float_y,2,2),Color("7055bf"),true)
	draw_rect(Rect2(3,-9*stretch+float_y,2,2),Color("7055bf"),true)
	# Wisps separate from the body and extend during attack.
	for side in [-1.0,1.0]:
		var reach := 8.0 + wind*5.0 + attack*10.0
		var origin := Vector2(side*5,-3+float_y)
		var tip := origin + Vector2(side*reach,-2.0-attack*4.0)
		draw_line(origin,tip,Color(0.60,0.81,0.85,0.55),1.4)
		draw_circle(tip,1.8+attack*1.2,Color(0.66,0.54,0.94,0.62))
	var orb_y := -17.0+float_y+sin(_phase*3.1)*1.1
	draw_circle(Vector2(0,orb_y),4.0+wind*1.8,Color(0.49,0.36,0.82,0.30+wind*0.22))
	draw_circle(Vector2(0,orb_y),1.8+attack,Color(0.85,0.81,1.0,0.78))

func _draw_broken_drone() -> void:
	var step := _walk_cycle(1.0)
	var wind := 1.0 if action_state == "windup" else 0.0
	var attack := maxf(0.0,sin(_phase*8.0)) if action_state == "attack" else 0.0
	var hover := sin(_phase*4.2)*0.45
	_shadow(10.0,2.0)
	var metal := _hurt_color(Color("687277"))
	var dark := _hurt_color(Color("424b4f"))
	# Suspension legs articulate instead of the whole chassis bobbing.
	var leg_shift := step*1.8
	draw_line(Vector2(-6,4+hover),Vector2(-8-leg_shift,8),dark,3.0)
	draw_line(Vector2(6,4+hover),Vector2(8+leg_shift,8),dark,3.0)
	draw_rect(Rect2(-10,-7+hover,20,11),dark,true)
	draw_rect(Rect2(-8,-5+hover,16,8),metal,true)
	draw_rect(Rect2(-6,-11+hover,12,5),_hurt_color(Color("7b8589")),true)
	# Side stabilizers move opposite each other while travelling.
	draw_rect(Rect2(-14,-4+hover+step,4,6),dark,true)
	draw_rect(Rect2(10,-4+hover-step,4,6),dark,true)
	var lens_glow := Color("47cbd0").lerp(Color("d7ffff"),wind*0.5+attack*0.5)
	draw_rect(Rect2(-5,-3+hover,10,5),_hurt_color(Color("236b74")),true)
	draw_rect(Rect2(-3,-2+hover,6,3),lens_glow,true)
	# Damaged antenna jitters mechanically.
	var antenna_jitter := sin(_phase*11.0)*0.7
	draw_line(Vector2(6,-9+hover),Vector2(10+antenna_jitter,-15-hover),_hurt_color(Color("b4673b")),2.0)
	draw_rect(Rect2(9+antenna_jitter,-17-hover,2,3),Color("ff8c42"),true)
	if wind > 0.0 or attack > 0.0:
		var ray_len := 8.0+wind*7.0+attack*14.0
		draw_line(Vector2(0,-1+hover),facing*ray_len+Vector2(0,-1+hover),Color(0.44,0.91,0.96,0.55),1.2)
