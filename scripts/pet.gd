extends Node2D

var main_ref: Node
var pet_index := 0
var power := 5.0
var attack_timer := 0.0
var skill_cooldown := 0.0

func setup(main_node: Node, idx: int, pet_power: float) -> void:
	main_ref = main_node
	pet_index = idx
	power = pet_power
	queue_redraw()

func _process(delta: float) -> void:
	if attack_timer > 0.0: attack_timer -= delta
	if skill_cooldown > 0.0: skill_cooldown -= delta
	var p = get_tree().get_first_node_in_group("player")
	if not p: return
	var target_pos: Vector2 = p.global_position + Vector2(-34.0 * p.facing, -28.0)
	global_position = global_position.lerp(target_pos, min(1.0,delta*6.5))
	if attack_timer <= 0.0:
		var target = _nearest_enemy()
		if target:
			target.take_damage(power)
			attack_timer = max(0.45,1.45-pet_index*0.06)

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
	for e in get_tree().get_nodes_in_group("enemies"):
		if is_instance_valid(e) and p.global_position.distance_to(e.global_position) < 250.0:
			e.take_damage(power*2.1)
	p.heal(3.0+pet_index)
	return true

func _draw() -> void:
	var colors := [Color(1.0,0.42,0.24),Color(0.29,0.78,0.67),Color(0.45,0.60,1.0),Color(0.93,0.80,0.27),Color(0.78,0.41,1.0),Color(1.0,0.49,0.72),Color(0.45,0.88,0.38),Color(0.70,0.75,0.82)]
	var c: Color = colors[pet_index]
	draw_circle(Vector2.ZERO,8.0,c)
	draw_polygon(PackedVector2Array([Vector2(-7,-6),Vector2(-4,-14),Vector2(-1,-7)]),PackedColorArray([c]))
	draw_polygon(PackedVector2Array([Vector2(1,-7),Vector2(4,-14),Vector2(7,-6)]),PackedColorArray([c]))
	draw_circle(Vector2(-3,-2),1.5,Color.WHITE)
	draw_circle(Vector2(3,-2),1.5,Color.WHITE)
