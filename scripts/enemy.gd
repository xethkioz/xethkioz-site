extends CharacterBody2D

var main_ref: Node
var hp := 20.0
var max_hp := 20.0
var damage := 8.0
var speed := 65.0
var reward := 2
var gravity := 1100.0
var contact_timer := 0.0
var archetype := 0

func _ready() -> void:
	add_to_group("enemies")
	collision_layer = 4
	collision_mask = 2
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(20,22)
	cs.shape = rs
	add_child(cs)

func setup(main_node: Node, difficulty: float, kind: int) -> void:
	main_ref = main_node
	archetype = kind % 4
	max_hp = 16.0 + difficulty * 8.0
	hp = max_hp
	damage = 5.0 + difficulty * 2.1
	speed = 52.0 + difficulty * 6.0
	reward = 1 + int(difficulty * 0.8)
	queue_redraw()

func _physics_process(delta: float) -> void:
	if contact_timer > 0.0: contact_timer -= delta
	if not is_on_floor(): velocity.y += gravity * delta
	var p = get_tree().get_first_node_in_group("player")
	if p:
		var dx: float = p.global_position.x - global_position.x
		if abs(dx) < 420.0: velocity.x = sign(dx) * speed
		else: velocity.x = move_toward(velocity.x, 0.0, 300.0 * delta)
		if abs(dx) < 28.0 and abs(p.global_position.y - global_position.y) < 35.0 and contact_timer <= 0.0:
			contact_timer = 0.85
			p.take_damage(damage, Vector2(-sign(dx) * 180.0, -120.0))
	move_and_slide()

func take_damage(amount: float) -> void:
	hp -= amount
	if hp <= 0.0:
		if main_ref: main_ref.enemy_defeated(self, reward)
		queue_free()

func _draw() -> void:
	var colors := [Color(0.17,0.69,0.45),Color(0.86,0.30,0.34),Color(0.30,0.58,0.86),Color(0.86,0.69,0.24)]
	var c: Color = colors[archetype]
	draw_rect(Rect2(-10,-10,20,20), c)
	draw_circle(Vector2(-4,-3),2.0,Color.WHITE)
	draw_circle(Vector2(4,-3),2.0,Color.WHITE)
	draw_rect(Rect2(-8,10,5,6), c.darkened(0.35))
	draw_rect(Rect2(3,10,5,6), c.darkened(0.35))
