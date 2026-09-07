extends Node2D

const XETHKIOZ_TEX = preload("res://assets/v08/generated/xethkioz.png")

var main_ref: Node
var pet_index := 0
var power := 5.0
var attack_timer := 0.0
var skill_cooldown := 0.0
var visual_sprite: Sprite2D
var idle_time := 0.0

func _ready() -> void:
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = XETHKIOZ_TEX
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.25,1.25)
	visual_sprite.z_index = 7
	add_child(visual_sprite)

func setup(main_node: Node, idx: int, pet_power: float) -> void:
	main_ref = main_node
	pet_index = idx
	power = pet_power
	if visual_sprite:
		var tints := [Color.WHITE,Color(0.82,0.95,1.2),Color(0.88,0.78,0.62),Color(0.92,0.88,1.18),Color(1.15,0.72,0.58),Color(0.72,0.92,0.94),Color(0.72,0.88,1.18),Color(0.84,0.96,1.20)]
		visual_sprite.modulate = tints[clampi(pet_index,0,tints.size()-1)]

func _process(delta: float) -> void:
	idle_time += delta
	if attack_timer > 0.0: attack_timer -= delta
	if skill_cooldown > 0.0: skill_cooldown -= delta
	var p = get_tree().get_first_node_in_group("player")
	if not p: return
	var target_pos: Vector2 = p.global_position + Vector2(-38.0 * p.facing, -34.0 + sin(idle_time*3.0)*3.0)
	global_position = global_position.lerp(target_pos, minf(1.0,delta*6.5))
	if visual_sprite:
		visual_sprite.flip_h = p.facing < 0
		visual_sprite.rotation = sin(idle_time*2.2)*0.025
	if attack_timer <= 0.0:
		var target = _nearest_enemy()
		if target:
			target.take_damage(power)
			attack_timer = maxf(0.45,1.45-pet_index*0.06)

func _nearest_enemy():
	var nearest = null
	var best := 230.0
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var dist := global_position.distance_to(e.global_position)
		if dist < best:
			best = dist; nearest = e
	return nearest

func activate_skill() -> bool:
	if skill_cooldown > 0.0: return false
	skill_cooldown = 7.0
	var p = get_tree().get_first_node_in_group("player")
	if not p: return false
	if visual_sprite:
		visual_sprite.scale = Vector2(1.55,1.55)
		get_tree().create_timer(0.16).timeout.connect(func():
			if is_instance_valid(visual_sprite): visual_sprite.scale = Vector2(1.25,1.25)
		)
	for e in get_tree().get_nodes_in_group("enemies"):
		if is_instance_valid(e) and p.global_position.distance_to(e.global_position) < 250.0:
			e.take_damage(power*2.1)
	p.heal(3.0+pet_index)
	return true

func _draw() -> void:
	pass
