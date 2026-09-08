extends CharacterBody2D

signal damaged_player(amount: float)
signal died(enemy: Node)

var player: Node2D
var kind := 0
var hp := 42.0
var speed := 62.0
var detect_range := 190.0
var attack_range := 30.0
var attack_cd := 0.0
var home := Vector2.ZERO
var wander_phase := 0.0

func setup(target: Node2D, enemy_kind: int) -> void:
	player = target
	kind = enemy_kind
	home = global_position
	var sprite := Sprite2D.new()
	var paths := ["res://assets/topdown/generated/mob_goblin.png","res://assets/topdown/generated/mob_slime.png","res://assets/topdown/generated/mob_spirit.png"]
	sprite.texture = load(paths[clampi(kind,0,2)])
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.scale = Vector2(1.2,1.2)
	add_child(sprite)
	var cs := CollisionShape2D.new()
	var sh := CircleShape2D.new(); sh.radius = 11.0
	cs.shape = sh; cs.position = Vector2(0,6)
	add_child(cs)
	add_to_group("enemies")
	match kind:
		0: hp=46.0; speed=65.0; attack_range=30.0
		1: hp=62.0; speed=42.0; attack_range=28.0
		2: hp=38.0; speed=82.0; attack_range=40.0

func _physics_process(delta: float) -> void:
	attack_cd = maxf(0.0,attack_cd-delta)
	if not player or not is_instance_valid(player): return
	var dist := global_position.distance_to(player.global_position)
	if dist <= detect_range:
		var dir := global_position.direction_to(player.global_position)
		if dist > attack_range:
			velocity = dir*speed
		else:
			velocity = Vector2.ZERO
			if attack_cd <= 0.0:
				attack_cd = 1.0 if kind != 2 else 1.35
				damaged_player.emit(8.0 + kind*2.0)
	else:
		wander_phase += delta
		var desired := home + Vector2(cos(wander_phase*0.7),sin(wander_phase*0.55))*34.0
		velocity = global_position.direction_to(desired)*speed*0.28 if global_position.distance_to(desired)>5.0 else Vector2.ZERO
	move_and_slide()

func take_damage(amount: float, knock_dir: Vector2 = Vector2.ZERO) -> void:
	hp -= amount
	if knock_dir.length() > 0.1:
		global_position += knock_dir.normalized()*8.0
	modulate = Color(1.0,0.5,0.5)
	var tw := create_tween(); tw.tween_property(self,"modulate",Color.WHITE,0.10)
	if hp <= 0.0:
		died.emit(self)
		queue_free()
