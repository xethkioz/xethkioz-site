extends "res://scripts/player_v6.gd"

# v0.6 Traversal Pass
# Inspired by the movement grammar of classic 16-bit platformers without
# reproducing proprietary code, layouts or exact physics values.

const RUN_CHARGE_TIME := 0.85
const START_SPEED_MULT := 0.82
const SPRINT_SPEED_MULT := 1.38
const SPRINT_ACCEL := 980.0
const SLIDE_MIN_SPEED := 205.0
const SLIDE_SPEED := 515.0
const SLIDE_TIME := 0.34
const WALL_JUMP_X := 365.0
const WALL_JUMP_Y_MULT := 0.92
const STOMP_MIN_FALL_SPEED := 145.0
const STOMP_BOUNCE_MULT := 0.64

var run_charge := 0.0
var slide_timer_v7 := 0.0
var slide_direction := 1
var slide_hit_tick := 0.0
var wall_jump_lock := 0.0
var stomp_cooldown := 0.0

func _physics_process(delta: float) -> void:
	wall_jump_lock = max(0.0,wall_jump_lock-delta)
	stomp_cooldown = max(0.0,stomp_cooldown-delta)
	slide_timer_v7 = max(0.0,slide_timer_v7-delta)
	slide_hit_tick = max(0.0,slide_hit_tick-delta)

	var direction := Input.get_axis("move_left","move_right")
	var requested_slide := Input.is_action_just_pressed("slide")
	var did_wall_jump := false
	var wall_push_dir := 0.0

	# Wall bounce: keeps the retro traversal idea but leaves the player's
	# normal air jump available after a successful bounce.
	if Input.is_action_just_pressed("jump") and not is_on_floor() and is_on_wall_only() and wall_jump_lock <= 0.0:
		var wall_normal := get_wall_normal()
		if abs(wall_normal.x) > 0.5:
			wall_push_dir = wall_normal.x
			velocity.x = wall_push_dir*WALL_JUMP_X
			velocity.y = jump_velocity*WALL_JUMP_Y_MULT
			coyote_timer = 0.0
			jump_buffer_timer = 0.0
			wall_jump_lock = 0.16
			did_wall_jump = true

	super._physics_process(delta)

	if did_wall_jump:
		velocity.x = wall_push_dir*WALL_JUMP_X
		velocity.y = min(velocity.y,jump_velocity*0.84)
		air_jumps = 1
		if main_ref:
			main_ref.play_sfx("jump")

	# Walk -> run -> sprint curve. Sprint charge only builds on the ground,
	# but existing modern air control is deliberately preserved.
	if is_on_floor() and abs(direction) > 0.01 and sign(direction) == sign(velocity.x) and dash_timer <= 0.0 and slide_timer_v7 <= 0.0:
		run_charge = min(RUN_CHARGE_TIME,run_charge+delta)
	else:
		run_charge = max(0.0,run_charge-delta*(2.4 if is_on_floor() else 0.45))

	if is_on_floor() and abs(direction) > 0.01 and dash_timer <= 0.0 and slide_timer_v7 <= 0.0:
		var charge_t := clamp(run_charge/RUN_CHARGE_TIME,0.0,1.0)
		var eased := charge_t*charge_t*(3.0-2.0*charge_t)
		var run_mult := lerp(START_SPEED_MULT,SPRINT_SPEED_MULT,eased)
		var sprint_target := direction*(base_speed+speed_bonus)*run_mult
		velocity.x = move_toward(velocity.x,sprint_target,SPRINT_ACCEL*delta)

	# Momentum slide. It is intentionally unavailable from a standstill.
	if requested_slide and is_on_floor() and abs(velocity.x) >= SLIDE_MIN_SPEED and slide_timer_v7 <= 0.0:
		slide_direction = 1 if velocity.x >= 0.0 else -1
		facing = slide_direction
		slide_timer_v7 = SLIDE_TIME
		run_charge = max(run_charge,RUN_CHARGE_TIME*0.72)

	if slide_timer_v7 > 0.0 and is_on_floor():
		velocity.x = move_toward(velocity.x,slide_direction*SLIDE_SPEED,520.0*delta)
		invuln_timer = max(invuln_timer,0.05)
		if slide_hit_tick <= 0.0 and main_ref and main_ref.has_method("traversal_slide_attack"):
			slide_hit_tick = 0.08
			main_ref.traversal_slide_attack(global_position,slide_direction,10.0*damage_multiplier)

	# Downward bounce attack: gives fast platforming a second combat language
	# besides the weapon combo, without replacing the ARPG combat layer.
	if stomp_cooldown <= 0.0 and velocity.y >= STOMP_MIN_FALL_SPEED and main_ref and main_ref.has_method("try_traversal_stomp"):
		if main_ref.try_traversal_stomp(global_position,12.0*damage_multiplier):
			velocity.y = jump_velocity*STOMP_BOUNCE_MULT
			air_jumps = 1
			stomp_cooldown = 0.18

	# Camera look-ahead makes high-speed corridors readable instead of blind.
	var cam := get_node_or_null("Camera2D") as Camera2D
	if cam:
		var look_x := clamp(velocity.x*0.16,-82.0,112.0)
		cam.position.x = lerp(cam.position.x,look_x,min(1.0,delta*4.8))
		cam.position.y = lerp(cam.position.y,-18.0,min(1.0,delta*4.2))

	queue_redraw()

func traversal_speed_ratio() -> float:
	return clamp(run_charge/RUN_CHARGE_TIME,0.0,1.0)

func is_traversal_sliding() -> bool:
	return slide_timer_v7 > 0.0
