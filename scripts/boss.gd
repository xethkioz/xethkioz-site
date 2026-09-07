extends CharacterBody2D

const DEMO_BOSS_TEXTURES := [
	preload("res://assets/v09/generated/boss_forest_guardian.png"),
	preload("res://assets/v09/generated/boss_plains_sentinel.png"),
	preload("res://assets/v09/generated/boss_cism_archon.png")
]

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
var charge_timer := 0.0
var charge_direction := 1.0
var telegraph_timer := 0.0
var charge_pending := false
var visual_sprite: Sprite2D

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
	visual_sprite = Sprite2D.new()
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.65,1.65)
	visual_sprite.position = Vector2(0,-4)
	visual_sprite.z_index = 6
	add_child(visual_sprite)

func setup(main_node: Node,kind: int,map_no: int,difficulty: float) -> void:
	main_ref = main_node
	boss_kind = clampi(kind,0,6)
	map_index = map_no
	max_hp = 145.0+float(map_no)*12.0+difficulty*20.0
	if map_no == 5: max_hp = 255.0
	if map_no == 10: max_hp = maxf(max_hp,320.0)
	if map_no == 15: max_hp = maxf(max_hp,390.0)
	hp = max_hp
	# Escalation remains readable; later bosses gain patterns and HP before raw one-shot damage.
	damage = 9.0+float(map_no)*0.38
	speed = 70.0+float(map_no)*1.1
	if visual_sprite:
		visual_sprite.texture = DEMO_BOSS_TEXTURES[boss_kind] if boss_kind < 3 else null
	queue_redraw()

func _physics_process(delta: float) -> void:
	attack_timer = maxf(0.0,attack_timer-delta)
	contact_timer = maxf(0.0,contact_timer-delta)
	leap_timer = maxf(0.0,leap_timer-delta)
	telegraph_timer = maxf(0.0,telegraph_timer-delta)
	if not is_on_floor(): velocity.y += gravity*delta
	var p = get_tree().get_first_node_in_group("player")
	if not p:
		move_and_slide(); return
	var dx: float = p.global_position.x-global_position.x
	var phase: int = _phase()
	if boss_kind == 0: _update_forest_guardian(delta,dx,phase)
	elif boss_kind == 1: _update_plains_sentinel(p,dx,phase)
	elif boss_kind == 2: _update_cism_archon(p,dx,phase)
	else: _update_generic_boss(p,dx,phase)
	if absf(dx)<48.0 and absf(p.global_position.y-global_position.y)<58.0 and contact_timer<=0.0:
		contact_timer = 0.78
		p.take_damage(damage,Vector2(-signf(dx)*260.0,-150.0))
	move_and_slide()
	_update_visual_state(phase)
	queue_redraw()

func _phase() -> int:
	if hp < max_hp*0.33: return 3
	if hp < max_hp*0.66: return 2
	return 1

func _update_visual_state(phase: int) -> void:
	if not visual_sprite: return
	visual_sprite.flip_h = velocity.x < -2.0
	var scale_target := Vector2(1.65,1.65)
	if charge_pending: scale_target = Vector2(1.78,1.55)
	elif charge_timer > 0.0: scale_target = Vector2(1.92,1.46)
	visual_sprite.scale = scale_target
	if charge_pending:
		visual_sprite.modulate = Color(1.25,0.66,0.66)
	elif phase == 3:
		visual_sprite.modulate = Color(1.12,0.88,1.18)
	else:
		visual_sprite.modulate = Color.WHITE

func _update_forest_guardian(delta: float,dx: float,phase: int) -> void:
	if charge_pending:
		velocity.x = 0.0
		if telegraph_timer <= 0.0:
			charge_pending = false
			charge_timer = 0.52+float(phase)*0.05
		return
	if charge_timer > 0.0:
		charge_timer -= delta
		velocity.x = charge_direction*(390.0+float(phase)*42.0)
		return
	velocity.x = signf(dx)*speed*(0.34+float(phase)*0.08)
	if attack_timer <= 0.0:
		if phase >= 2 and randf() < 0.48:
			charge_direction = signf(dx) if absf(dx)>1.0 else 1.0
			charge_pending = true
			telegraph_timer = 0.48
			attack_timer = 1.62-float(phase)*0.12
			if main_ref: main_ref.graveljaw_charge_warning(global_position,charge_direction,phase)
		else:
			attack_timer = 1.78-float(phase)*0.15
			if main_ref: main_ref.boss_attack(self,boss_kind,phase)

func _update_plains_sentinel(_p: Node,dx: float,phase: int) -> void:
	# Mobile sentinel: jumps to disrupt upper routes and fires its scripted area attack between leaps.
	velocity.x = signf(dx)*speed*(0.48+float(phase)*0.06)
	if leap_timer <= 0.0 and is_on_floor():
		velocity.y = -410.0-float(phase)*18.0
		velocity.x = signf(dx)*speed*1.8
		leap_timer = 2.25-float(phase)*0.22
	if attack_timer <= 0.0:
		attack_timer = 1.75-float(phase)*0.13
		if main_ref: main_ref.boss_attack(self,boss_kind,phase)

func _update_cism_archon(_p: Node,dx: float,phase: int) -> void:
	# Deliberately slower body movement; the challenge comes from denser scripted attacks and phase cadence.
	velocity.x = signf(dx)*speed*(0.28+float(phase)*0.05)
	if attack_timer <= 0.0:
		attack_timer = 1.95-float(phase)*0.22
		if main_ref:
			main_ref.boss_attack(self,boss_kind,phase)
			if phase >= 2:
				get_tree().create_timer(0.34).timeout.connect(func():
					if is_instance_valid(self) and main_ref: main_ref.boss_attack(self,boss_kind,phase)
				)

func _update_generic_boss(p: Node,dx: float,phase: int) -> void:
	match boss_kind:
		3:
			velocity.x = signf(dx)*speed*0.35; _attack_if_ready(1.45-float(phase)*0.12,phase)
		4:
			if attack_timer <= 0.0:
				global_position.x = p.global_position.x+(-130.0 if randf()>0.5 else 130.0)
				_attack_if_ready(1.3-float(phase)*0.1,phase)
			velocity.x = 0.0
		5:
			velocity.x = signf(dx)*speed*0.6; _attack_if_ready(1.1-float(phase)*0.08,phase)
		_:
			velocity.x = signf(dx)*speed*0.7; _attack_if_ready(1.0-float(phase)*0.08,phase)

func _attack_if_ready(interval: float,phase: int) -> void:
	if attack_timer <= 0.0:
		attack_timer = maxf(0.45,interval)
		if main_ref: main_ref.boss_attack(self,boss_kind,phase)

func take_damage(amount: float) -> void:
	hp -= amount
	if main_ref:
		main_ref.update_boss_hud(hp,max_hp)
		if main_ref.has_method("enemy_hit_feedback"): main_ref.enemy_hit_feedback(global_position,amount)
	queue_redraw()
	if hp <= 0.0:
		if main_ref: main_ref.boss_defeated(self,boss_kind)
		queue_free()

func _draw() -> void:
	# Future bosses keep a debug fallback until their production art is created.
	if boss_kind < 3 and visual_sprite and visual_sprite.texture != null: return
	var colors := [Color(0.45,0.27,0.64),Color(0.15,0.57,0.67),Color(0.40,0.68,0.29),Color(0.37,0.56,0.82),Color(0.81,0.30,0.52),Color(0.78,0.44,0.20),Color(0.50,0.28,0.76)]
	var c: Color = colors[boss_kind]
	draw_rect(Rect2(-27,-28,54,56),c.darkened(0.25))
	draw_rect(Rect2(-22,-32,44,48),c)
