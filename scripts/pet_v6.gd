extends "res://scripts/pet.gd"

func _process(delta: float) -> void:
	if attack_timer > 0.0: attack_timer -= delta
	if skill_cooldown > 0.0: skill_cooldown -= delta
	var p = get_tree().get_first_node_in_group("player")
	if not p: return
	var target_pos: Vector2 = p.global_position + Vector2(-34.0*p.facing,-28.0)
	global_position = global_position.lerp(target_pos,min(1.0,delta*6.5))
	if attack_timer <= 0.0 and main_ref and main_ref.has_method("legendary_auto_attack"):
		if main_ref.legendary_auto_attack(pet_index,global_position,power):
			var rates := [1.15,1.05,1.35,1.20,0.82,0.95,1.10,1.45]
			attack_timer = rates[clamp(pet_index,0,rates.size()-1)]

func activate_skill() -> bool:
	if skill_cooldown > 0.0 or main_ref == null:
		return false
	var cds := [9.0,10.0,11.0,10.0,11.0,10.0,12.0,13.0]
	skill_cooldown = cds[clamp(pet_index,0,cds.size()-1)]
	if main_ref.has_method("activate_legendary_effect"):
		main_ref.activate_legendary_effect(pet_index,power)
		return true
	return false
