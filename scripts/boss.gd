extends CharacterBody2D

var main_ref: Node
var boss_kind := 0
var map_index := 5
var hp := 180.0
var max_hp := 180.0
var damage := 12.0
var speed := 82.0
var gravity := 1200.0
var attack_timer := 1.5
var contact_timer := 0.0
var leap_timer := 1.0

func _ready() -> void:
	add_to_group("enemies")
	add_to_group("boss")
	collision_layer = 4
	collision_mask = 2
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(52,58)
	cs.shape = rs
	add_child(cs)

func setup(main_node: Node, kind: int, map_no: int, difficulty: float) -> void:
	main_ref = main_node
	boss_kind = clamp(kind,0,6)
	map_index = map_no
	max_hp = 145.0 + map_no * 12.0 + difficulty * 20.0
	hp = max_hp
	damage = 9.0 + map_no * 0.45
	speed = 70.0 + map_no * 1.25
	queue_redraw()

func _physics_process(delta: float) -> void:
	if attack_timer > 0.0: attack_timer -= delta
	if contact_timer > 0.0: contact_timer -= delta
	if leap_timer > 0.0: leap_timer -= delta
	if not is_on_floor(): velocity.y += gravity * delta
	var p = get_tree().get_first_node_in_group("player")
	if not p:
		move_and_slide(); return
	var dx: float = p.global_position.x - global_position.x
	var phase := 1
	if hp < max_hp * 0.66: phase = 2
	if hp < max_hp * 0.33: phase = 3
	match boss_kind:
		0:
			velocity.x = sign(dx) * speed * (1.0 + phase * 0.12)
			_attack_if_ready(1.9 - phase * 0.18, phase)
		1:
			velocity.x = sign(dx) * speed * 0.55
			if leap_timer <= 0.0 and is_on_floor():
				velocity.y = -430.0; leap_timer = 2.2 - phase * 0.25
			_attack_if_ready(1.65 - phase * 0.12, phase)
		2:
			velocity.x = sign(dx) * speed * 0.42
			_attack_if_ready(2.0 - phase * 0.2, phase)
		3:
			velocity.x = sign(dx) * speed * 0.35
			_attack_if_ready(1.45 - phase * 0.12, phase)
		4:
			if attack_timer <= 0.0:
				global_position.x = p.global_position.x + (-130.0 if randf() > 0.5 else 130.0)
				_attack_if_ready(1.3 - phase * 0.1, phase)
			velocity.x = 0.0
		5:
			velocity.x = sign(dx) * speed * 0.6
			_attack_if_ready(1.1 - phase * 0.08, phase)
		_:
			velocity.x = sign(dx) * speed * 0.7
			_attack_if_ready(1.0 - phase * 0.08, phase)
	if abs(dx) < 48.0 and abs(p.global_position.y - global_position.y) < 58.0 and contact_timer <= 0.0:
		contact_timer = 0.75
		p.take_damage(damage, Vector2(-sign(dx) * 260.0, -150.0))
	move_and_slide()

func _attack_if_ready(interval: float, phase: int) -> void:
	if attack_timer <= 0.0:
		attack_timer = max(0.45, interval)
		if main_ref: main_ref.boss_attack(self, boss_kind, phase)

func take_damage(amount: float) -> void:
	hp -= amount
	if main_ref: main_ref.update_boss_hud(hp,max_hp)
	if hp <= 0.0:
		if main_ref: main_ref.boss_defeated(self,boss_kind)
		queue_free()

func _draw() -> void:
	var colors := [Color(0.45,0.27,0.64),Color(0.15,0.57,0.67),Color(0.40,0.68,0.29),Color(0.37,0.56,0.82),Color(0.81,0.30,0.52),Color(0.78,0.44,0.20),Color(0.50,0.28,0.76)]
	var c: Color = colors[boss_kind]
	draw_rect(Rect2(-27,-28,54,56), c.darkened(0.25))
	draw_rect(Rect2(-22,-32,44,48), c)
	draw_circle(Vector2(-9,-12),4.0,Color.WHITE)
	draw_circle(Vector2(9,-12),4.0,Color.WHITE)
	draw_rect(Rect2(-22,18,10,18), c.darkened(0.35))
	draw_rect(Rect2(12,18,10,18), c.darkened(0.35))
