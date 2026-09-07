extends CharacterBody2D

const GOBLIN_TEX = preload("res://assets/v08/generated/goblin.png")

var main_ref: Node
var hp := 20.0
var max_hp := 20.0
var damage := 8.0
var speed := 65.0
var reward := 2
var gravity := 1100.0
var contact_timer := 0.0
var archetype := 0
var visual_sprite: Sprite2D
var visual_time := 0.0
var environment_variant: Dictionary = {}
var base_variant_tint := Color.WHITE

func _ready() -> void:
	add_to_group("enemies")
	collision_layer = 4
	collision_mask = 2
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(22,30)
	cs.shape = rs
	cs.position = Vector2(0,-4)
	add_child(cs)
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = GOBLIN_TEX
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.35,1.35)
	visual_sprite.position = Vector2(0,-15)
	visual_sprite.z_index = 4
	add_child(visual_sprite)

func setup(main_node: Node, difficulty: float, kind: int) -> void:
	main_ref = main_node
	archetype = kind % 4
	max_hp = 16.0 + difficulty * 8.0
	hp = max_hp
	damage = 5.0 + difficulty * 2.1
	speed = 52.0 + difficulty * 6.0
	reward = 1 + int(difficulty * 0.8)
	_refresh_tint()

func apply_environment_variant(profile: Dictionary) -> void:
	environment_variant = profile.duplicate(true)
	max_hp *= float(profile.get("hp",1.0))
	hp = max_hp
	damage *= float(profile.get("damage",1.0))
	speed *= float(profile.get("speed",1.0))
	reward = maxi(1,int(round(float(reward)*float(profile.get("reward",1.0)))))
	base_variant_tint = Color.from_string(str(profile.get("tint","#ffffff")),Color.WHITE)
	_refresh_tint()

func _refresh_tint() -> void:
	if not visual_sprite:
		return
	var archetype_tints := [Color.WHITE,Color(1.0,0.78,0.72),Color(0.72,0.86,1.0),Color(1.0,0.90,0.62)]
	var archetype_tint: Color = archetype_tints[archetype]
	visual_sprite.modulate = Color(
		archetype_tint.r*base_variant_tint.r,
		archetype_tint.g*base_variant_tint.g,
		archetype_tint.b*base_variant_tint.b,
		1.0
	)

func _physics_process(delta: float) -> void:
	visual_time += delta
	if contact_timer > 0.0: contact_timer -= delta
	if not is_on_floor(): velocity.y += gravity * delta
	var p = get_tree().get_first_node_in_group("player")
	if p:
		var dx: float = p.global_position.x - global_position.x
		if abs(dx) < 420.0: velocity.x = sign(dx) * speed
		else: velocity.x = move_toward(velocity.x, 0.0, 300.0 * delta)
		if visual_sprite:
			visual_sprite.flip_h = dx < 0.0
			visual_sprite.position.y = -15.0 + (sin(visual_time*8.0)*1.2 if absf(velocity.x)>5.0 and is_on_floor() else 0.0)
		if abs(dx) < 28.0 and abs(p.global_position.y - global_position.y) < 35.0 and contact_timer <= 0.0:
			contact_timer = 0.85
			p.take_damage(damage, Vector2(-sign(dx) * 180.0, -120.0))
	move_and_slide()

func take_damage(amount: float) -> void:
	hp -= amount
	if visual_sprite:
		visual_sprite.modulate = Color(1.5,0.65,0.65,1.0)
		get_tree().create_timer(0.08).timeout.connect(func():
			if is_instance_valid(visual_sprite):
				_refresh_tint()
		)
	if hp <= 0.0:
		if main_ref: main_ref.enemy_defeated(self, reward)
		queue_free()

func _draw() -> void:
	pass
