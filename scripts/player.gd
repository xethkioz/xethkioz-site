extends CharacterBody2D

signal died

var main_ref: Node
var max_health := 100.0
var health := 100.0
var base_speed := 255.0
var acceleration := 1750.0
var friction := 2050.0
var jump_velocity := -485.0
var gravity := 1320.0
var facing := 1
var dash_timer := 0.0
var dash_cooldown := 0.0
var attack_cooldown := 0.0
var invuln_timer := 0.0
var coyote_timer := 0.0
var jump_buffer_timer := 0.0
var combo_reset_timer := 0.0
var combo_step := 0
var damage_multiplier := 1.0
var armor_reduction := 0.0
var speed_bonus := 0.0

const COYOTE_TIME := 0.11
const JUMP_BUFFER := 0.13

func _ready() -> void:
	add_to_group("player")
	collision_layer = 1
	collision_mask = 2
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(18,28)
	cs.shape = rs
	cs.position = Vector2(0,2)
	add_child(cs)
	var cam := Camera2D.new()
	cam.name = "Camera2D"
	cam.position_smoothing_enabled = true
	cam.position_smoothing_speed = 7.0
	cam.limit_left = 0
	cam.limit_right = 3200
	cam.limit_top = 0
	cam.limit_bottom = 720
	add_child(cam)
	queue_redraw()

func setup(main_node: Node,hp: float,weapon_power: float,armor_power: float,charm_power: float) -> void:
	main_ref = main_node
	max_health = hp
	health = max_health
	damage_multiplier = 1.0+weapon_power*0.055
	armor_reduction = min(0.55,armor_power*0.025)
	speed_bonus = charm_power*2.0

func _physics_process(delta: float) -> void:
	dash_cooldown = max(0.0,dash_cooldown-delta)
	attack_cooldown = max(0.0,attack_cooldown-delta)
	invuln_timer = max(0.0,invuln_timer-delta)
	combo_reset_timer = max(0.0,combo_reset_timer-delta)
	jump_buffer_timer = max(0.0,jump_buffer_timer-delta)
	if combo_reset_timer <= 0.0:
		combo_step = 0
	if is_on_floor():
		coyote_timer = COYOTE_TIME
	else:
		coyote_timer = max(0.0,coyote_timer-delta)
		velocity.y += gravity*delta
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = JUMP_BUFFER
	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		jump_buffer_timer = 0.0
		coyote_timer = 0.0
		velocity.y = jump_velocity
		if main_ref:
			main_ref.play_sfx("jump")
	if Input.is_action_just_released("jump") and velocity.y < -180.0:
		velocity.y *= 0.53
	var direction: float = Input.get_axis("move_left","move_right")
	var target_speed: float = direction*(base_speed+speed_bonus)
	if abs(direction) > 0.01:
		velocity.x = move_toward(velocity.x,target_speed,acceleration*delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x,0.0,friction*delta)
	if Input.is_action_just_pressed("dash") and dash_cooldown <= 0.0:
		velocity.x = facing*625.0
		dash_cooldown = 0.72
		dash_timer = 0.13
		invuln_timer = max(invuln_timer,0.16)
	if dash_timer > 0.0:
		dash_timer -= delta
		velocity.y *= 0.88
	if Input.is_action_just_pressed("attack") and attack_cooldown <= 0.0:
		_do_combo_attack()
	if Input.is_action_just_pressed("pet_skill") and main_ref:
		main_ref.activate_pet_skill()
	move_and_slide()
	queue_redraw()
	if global_position.y > 900.0:
		take_damage(30.0,Vector2(0,-220))
		if main_ref and main_ref.has_method("get_respawn_position"):
			global_position = main_ref.get_respawn_position(global_position)
		else:
			global_position = Vector2(max(70.0,global_position.x-150.0),450.0)

func _do_combo_attack() -> void:
	combo_step = (combo_step%3)+1
	combo_reset_timer = 0.62
	var damages: Array[float] = [10.5,12.5,18.0]
	var cooldowns: Array[float] = [0.20,0.23,0.32]
	attack_cooldown = cooldowns[combo_step-1]
	if main_ref:
		main_ref.player_attack(global_position,facing,damages[combo_step-1]*damage_multiplier)
		main_ref.play_sfx("attack")
		if combo_step == 3 and main_ref.has_method("screen_shake"):
			main_ref.screen_shake(4.0,0.10)

func take_damage(amount: float,knockback: Vector2 = Vector2.ZERO) -> void:
	if invuln_timer > 0.0:
		return
	var final_damage: float = max(1.0,amount*(1.0-armor_reduction))
	health -= final_damage
	invuln_timer = 0.58
	velocity += knockback
	queue_redraw()
	if main_ref:
		main_ref.play_sfx("hit")
		if main_ref.has_method("screen_shake"):
			main_ref.screen_shake(5.0,0.14)
		main_ref.update_hud()
	if health <= 0.0:
		health = 0.0
		died.emit()

func heal(amount: float) -> void:
	health = min(max_health,health+amount)
	if main_ref:
		main_ref.update_hud()

func _draw() -> void:
	var flip: float = float(facing)
	var skin: Color = Color(0.91,0.76,0.58)
	var coat: Color = Color(0.39,0.19,0.62)
	if invuln_timer > 0.0 and int(Time.get_ticks_msec()/70)%2 == 0:
		skin = skin.lightened(0.25)
		coat = coat.lightened(0.35)
	draw_circle(Vector2(0,-8),8.0,skin)
	draw_rect(Rect2(-8,-1,16,19),coat)
	draw_rect(Rect2(-11,-3,22,4),Color(0.67,0.35,0.95))
	draw_polygon(PackedVector2Array([Vector2(-4*flip,3),Vector2(-18*flip,8),Vector2(-5*flip,11)]),PackedColorArray([Color(1.0,0.4,0.08)]))
	draw_rect(Rect2(-7,18,5,10),Color(0.12,0.16,0.24))
	draw_rect(Rect2(2,18,5,10),Color(0.12,0.16,0.24))
	if dash_timer > 0.0:
		draw_circle(Vector2(-facing*15,5),10.0,Color(0.66,0.35,0.95,0.22),false,2.0)
