extends CharacterBody2D

const MOB_TEXTURES := [
	preload("res://assets/v09/generated/mob_goblin.png"),
	preload("res://assets/v09/generated/mob_scout.png"),
	preload("res://assets/v09/generated/mob_slime.png"),
	preload("res://assets/v09/generated/mob_beetle.png")
]

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

# Navigation / threat pass
var floor_probe: RayCast2D
var spawn_x := 0.0
var patrol_direction := 1.0
var edge_pause := 0.0
var aggro_range := 390.0
var patrol_radius := 145.0
var special_timer := 0.0
var charge_timer := 0.0
var charge_direction := 1.0

func _ready() -> void:
	add_to_group("enemies")
	collision_layer = 4
	collision_mask = 2
	spawn_x = global_position.x
	patrol_direction = -1.0 if int(absf(global_position.x)) % 2 == 0 else 1.0
	var cs := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(22,30)
	cs.shape = rs
	cs.position = Vector2(0,-4)
	add_child(cs)
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = MOB_TEXTURES[clampi(archetype,0,MOB_TEXTURES.size()-1)]
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.35,1.35)
	visual_sprite.position = Vector2(0,-15)
	visual_sprite.z_index = 4
	add_child(visual_sprite)
	floor_probe = RayCast2D.new()
	floor_probe.enabled = true
	floor_probe.collision_mask = 2
	floor_probe.target_position = Vector2(0,56)
	floor_probe.position = Vector2(22,4)
	add_child(floor_probe)

func setup(main_node: Node, difficulty: float, kind: int) -> void:
	main_ref = main_node
	archetype = kind % 4
	max_hp = 22.0 + difficulty * 9.0
	hp = max_hp
	damage = 8.5 + difficulty * 3.4
	speed = 58.0 + difficulty * 7.0
	reward = 1 + int(difficulty * 0.8)
	match archetype:
		0: # Brote Goblin: melee baseline.
			aggro_range = 390.0; patrol_radius = 150.0
		1: # Explorador: faster, lighter, pressures long corridors.
			aggro_range = 470.0; patrol_radius = 190.0; speed *= 1.23; max_hp *= 0.88; hp = max_hp
		2: # Slime: slower but hops and blocks route timing.
			aggro_range = 350.0; patrol_radius = 120.0; speed *= 0.72; max_hp *= 1.24; hp = max_hp; special_timer = 0.8
		3: # Beetle: armored charger.
			aggro_range = 430.0; patrol_radius = 145.0; speed *= 0.82; max_hp *= 1.34; hp = max_hp; damage *= 1.08
	if visual_sprite:
		visual_sprite.texture = MOB_TEXTURES[archetype]
		visual_sprite.scale = _base_scale()
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

func _base_scale() -> Vector2:
	match archetype:
		1: return Vector2(1.26,1.26)
		2: return Vector2(1.48,1.34)
		3: return Vector2(1.42,1.42)
	return Vector2(1.35,1.35)

func _refresh_tint() -> void:
	if not visual_sprite: return
	var archetype_tints: Array[Color] = [Color.WHITE,Color(0.92,1.0,0.86),Color(0.82,1.0,0.98),Color(0.96,0.88,1.0)]
	var archetype_tint: Color = archetype_tints[archetype]
	visual_sprite.modulate = Color(
		archetype_tint.r*base_variant_tint.r,
		archetype_tint.g*base_variant_tint.g,
		archetype_tint.b*base_variant_tint.b,
		1.0
	)

func _floor_exists_ahead(direction: float) -> bool:
	if not floor_probe: return true
	floor_probe.position.x = 24.0 * direction
	floor_probe.force_raycast_update()
	return floor_probe.is_colliding()

func _physics_process(delta: float) -> void:
	visual_time += delta
	contact_timer = maxf(0.0,contact_timer-delta)
	edge_pause = maxf(0.0,edge_pause-delta)
	special_timer = maxf(0.0,special_timer-delta)
	charge_timer = maxf(0.0,charge_timer-delta)
	if not is_on_floor(): velocity.y += gravity * delta

	var desired_dir: float = patrol_direction
	var player_node = get_tree().get_first_node_in_group("player")
	if player_node:
		var dx: float = player_node.global_position.x-global_position.x
		var dy: float = player_node.global_position.y-global_position.y
		var sees_player: bool = absf(dx)<aggro_range and absf(dy)<150.0
		if sees_player:
			desired_dir = signf(dx) if absf(dx)>5.0 else patrol_direction
		elif absf(global_position.x-spawn_x)>patrol_radius:
			desired_dir = signf(spawn_x-global_position.x)
		else:
			desired_dir = patrol_direction

		if is_on_floor() and desired_dir != 0.0 and not _floor_exists_ahead(desired_dir):
			patrol_direction = -desired_dir
			desired_dir = patrol_direction
			edge_pause = 0.18
			velocity.x = 0.0

		# Slime hop: readable cadence, no instant leap spam.
		if archetype == 2 and sees_player and is_on_floor() and special_timer <= 0.0 and _floor_exists_ahead(desired_dir):
			velocity.y = -330.0
			velocity.x = desired_dir*speed*1.35
			special_timer = 1.35
		# Beetle charge: short windup, then a quick burst on the same platform.
		elif archetype == 3 and sees_player and is_on_floor() and absf(dx) < 210.0 and absf(dy) < 52.0 and special_timer <= 0.0:
			charge_direction = desired_dir
			charge_timer = 0.34
			special_timer = 1.65
			velocity.x = 0.0
		elif archetype == 3 and charge_timer > 0.0:
			if _floor_exists_ahead(charge_direction): velocity.x = charge_direction*speed*3.15
			else: charge_timer = 0.0
		else:
			var speed_mult: float = 1.32 if archetype == 1 and sees_player and absf(dx)<170.0 else 1.0
			if edge_pause <= 0.0:
				velocity.x = move_toward(velocity.x,desired_dir*speed*speed_mult,720.0*delta)
			else:
				velocity.x = move_toward(velocity.x,0.0,1200.0*delta)

		if visual_sprite:
			visual_sprite.flip_h = desired_dir < 0.0
			var base: Vector2 = _base_scale()
			var bob: float = sin(visual_time*(9.0 if archetype != 2 else 6.0))*1.2 if absf(velocity.x)>5.0 and is_on_floor() else 0.0
			visual_sprite.position.y = -15.0+bob
			if archetype == 3 and charge_timer > 0.0:
				visual_sprite.scale = base*Vector2(1.20,0.86)
			elif absf(dx)<72.0 and absf(dy)<42.0 and contact_timer<=0.0:
				visual_sprite.scale = base*Vector2(1.06,0.96)
			else:
				visual_sprite.scale = base

		if absf(dx)<31.0 and absf(dy)<40.0 and contact_timer<=0.0:
			contact_timer = 0.72 if archetype != 1 else 0.62
			var hit_damage: float = damage*(1.18 if archetype == 3 and charge_timer > 0.0 else 1.0)
			player_node.take_damage(hit_damage,Vector2(-signf(dx)*235.0,-145.0))

	move_and_slide()
	if is_on_wall() and is_on_floor(): patrol_direction *= -1.0

func take_damage(amount: float) -> void:
	var received: float = amount*(0.78 if archetype == 3 else 1.0)
	hp -= received
	if main_ref and main_ref.has_method("enemy_hit_feedback"):
		main_ref.enemy_hit_feedback(global_position,received)
	if visual_sprite:
		visual_sprite.modulate = Color(1.5,0.65,0.65,1.0)
		get_tree().create_timer(0.08).timeout.connect(func():
			if is_instance_valid(visual_sprite): _refresh_tint()
		)
	if hp <= 0.0:
		if main_ref: main_ref.enemy_defeated(self,reward)
		queue_free()

func _draw() -> void:
	pass
