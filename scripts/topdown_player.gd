extends CharacterBody2D

signal attack_requested(origin: Vector2, facing: Vector2, power: float)
signal skill_requested(slot: int, origin: Vector2, facing: Vector2)
signal interact_requested(origin: Vector2, facing: Vector2)

const SPEED := 118.0
const DASH_SPEED := 285.0
const DASH_TIME := 0.16
const DASH_COOLDOWN := 0.55

var facing := Vector2.DOWN
var dash_left := 0.0
var dash_cd := 0.0
var attack_cd := 0.0
var hp := 104.0
var max_hp := 104.0
var mana := 82.0
var max_mana := 82.0
var stamina := 105.0
var max_stamina := 105.0
var sprite: Sprite2D

func setup(gender: String = "male") -> void:
	add_to_group("player")
	var tex_path := "res://assets/topdown/generated/traveler_female.png" if gender == "female" else "res://assets/topdown/generated/traveler_male.png"
	sprite = Sprite2D.new()
	sprite.texture = load(tex_path)
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.scale = Vector2(1.35,1.35)
	add_child(sprite)
	var shape := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 8.0
	capsule.height = 22.0
	shape.shape = capsule
	shape.position = Vector2(0,8)
	add_child(shape)
	var cam := Camera2D.new()
	cam.position_smoothing_enabled = true
	cam.position_smoothing_speed = 7.5
	cam.limit_left = 0; cam.limit_top = 0; cam.limit_right = 2048; cam.limit_bottom = 1400
	add_child(cam)

func _physics_process(delta: float) -> void:
	dash_left = maxf(0.0,dash_left-delta)
	dash_cd = maxf(0.0,dash_cd-delta)
	attack_cd = maxf(0.0,attack_cd-delta)
	var input := Input.get_vector("move_left","move_right","move_up","move_down")
	if input.length() > 0.12:
		facing = input.normalized()
	if Input.is_action_just_pressed("dash") and dash_cd <= 0.0 and stamina >= 12.0:
		dash_left = DASH_TIME
		dash_cd = DASH_COOLDOWN
		stamina -= 12.0
	if dash_left > 0.0:
		velocity = facing * DASH_SPEED
	else:
		velocity = input * SPEED
		stamina = minf(max_stamina,stamina + 18.0*delta)
	move_and_slide()
	if sprite:
		if absf(facing.x) > 0.3:
			sprite.flip_h = facing.x < 0.0
		sprite.position.y = sin(Time.get_ticks_msec()/140.0)*0.6 if velocity.length() > 8.0 else sin(Time.get_ticks_msec()/320.0)*0.35
	if Input.is_action_just_pressed("attack") and attack_cd <= 0.0:
		attack_cd = 0.28
		attack_requested.emit(global_position,facing,18.0)
	if Input.is_action_just_pressed("skill_q") and mana >= 8.0:
		mana -= 8.0; skill_requested.emit(0,global_position,facing)
	if Input.is_action_just_pressed("skill_e") and mana >= 12.0:
		mana -= 12.0; skill_requested.emit(1,global_position,facing)
	if Input.is_action_just_pressed("skill_r") and mana >= 18.0:
		mana -= 18.0; skill_requested.emit(2,global_position,facing)
	if Input.is_action_just_pressed("interact"):
		interact_requested.emit(global_position,facing)
	mana = minf(max_mana,mana+4.5*delta)

func take_damage(amount: float) -> void:
	hp = maxf(0.0,hp-amount)
	modulate = Color(1.0,0.55,0.55)
	var tw := create_tween(); tw.tween_property(self,"modulate",Color.WHITE,0.12)
