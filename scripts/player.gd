extends CharacterBody2D

signal died

var main_ref: Node
var max_health := 100.0
var health := 100.0
var base_speed := 245.0
var acceleration := 1500.0
var friction := 1800.0
var jump_velocity := -470.0
var gravity := 1280.0
var facing := 1
var dash_timer := 0.0
var dash_cooldown := 0.0
var attack_cooldown := 0.0
var invuln_timer := 0.0
var damage_multiplier := 1.0
var armor_reduction := 0.0
var speed_bonus := 0.0

func _ready() -> void:
	add_to_group("player")
	collision_layer = 1
	collision_mask = 2
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(18, 28)
	cs.shape = rs
	cs.position = Vector2(0, 2)
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

func setup(main_node: Node, hp: float, weapon_power: float, armor_power: float, charm_power: float) -> void:
	main_ref = main_node
	max_health = hp
	health = max_health
	damage_multiplier = 1.0 + weapon_power * 0.055
	armor_reduction = min(0.55, armor_power * 0.025)
	speed_bonus = charm_power * 2.0

func _physics_process(delta: float) -> void:
	if dash_cooldown > 0.0: dash_cooldown -= delta
	if attack_cooldown > 0.0: attack_cooldown -= delta
	if invuln_timer > 0.0: invuln_timer -= delta
	if not is_on_floor(): velocity.y += gravity * delta
	var direction := Input.get_axis("move_left", "move_right")
	var target_speed := direction * (base_speed + speed_bonus)
	if abs(direction) > 0.01:
		velocity.x = move_toward(velocity.x, target_speed, acceleration * delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = jump_velocity
	if Input.is_action_just_pressed("dash") and dash_cooldown <= 0.0:
		velocity.x = facing * 590.0
		dash_cooldown = 0.78
		dash_timer = 0.12
	if dash_timer > 0.0: dash_timer -= delta
	if Input.is_action_just_pressed("attack") and attack_cooldown <= 0.0:
		attack_cooldown = 0.34
		if main_ref: main_ref.player_attack(global_position, facing, 12.0 * damage_multiplier)
	move_and_slide()
	if global_position.y > 900.0:
		take_damage(30.0, Vector2(0, -220))
		global_position = Vector2(max(70.0, global_position.x - 150.0), 450.0)

func take_damage(amount: float, knockback: Vector2 = Vector2.ZERO) -> void:
	if invuln_timer > 0.0: return
	var final_damage := max(1.0, amount * (1.0 - armor_reduction))
	health -= final_damage
	invuln_timer = 0.6
	velocity += knockback
	queue_redraw()
	if main_ref: main_ref.update_hud()
	if health <= 0.0:
		health = 0.0
		died.emit()

func heal(amount: float) -> void:
	health = min(max_health, health + amount)
	if main_ref: main_ref.update_hud()

func _draw() -> void:
	var flip := float(facing)
	draw_circle(Vector2(0,-8), 8.0, Color(0.91,0.76,0.58))
	draw_rect(Rect2(-8,-1,16,19), Color(0.39,0.19,0.62))
	draw_rect(Rect2(-11,-3,22,4), Color(0.67,0.35,0.95))
	draw_polygon(PackedVector2Array([Vector2(-4*flip,3),Vector2(-18*flip,8),Vector2(-5*flip,11)]), PackedColorArray([Color(1.0,0.4,0.08)]))
	draw_rect(Rect2(-7,18,5,10), Color(0.12,0.16,0.24))
	draw_rect(Rect2(2,18,5,10), Color(0.12,0.16,0.24))
