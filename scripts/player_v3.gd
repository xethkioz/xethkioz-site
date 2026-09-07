extends "res://scripts/player.gd"

var hero_name := "Ashley"
var hero_class := "Bardo"
var hero_damage_mod := 1.0
var skill_cooldowns := [0.0,0.0,0.0,0.0]

func configure_hero(hero: Dictionary) -> void:
	hero_name = str(hero.get("name","Ashley"))
	hero_class = str(hero.get("class","Bardo"))
	hero_damage_mod = float(hero.get("damage",1.0))
	max_health *= float(hero.get("hp",100.0))/100.0
	health = max_health
	base_speed *= float(hero.get("speed",1.0))
	damage_multiplier *= hero_damage_mod
	queue_redraw()

func _process(delta: float) -> void:
	for i in range(skill_cooldowns.size()):
		skill_cooldowns[i] = max(0.0,float(skill_cooldowns[i])-delta)
	if Input.is_action_just_pressed("skill_1"):
		_try_skill(0)
	if Input.is_action_just_pressed("skill_2"):
		_try_skill(1)
	if Input.is_action_just_pressed("skill_3"):
		_try_skill(2)
	if Input.is_action_just_pressed("set_skill"):
		_try_skill(3)

func _try_skill(slot: int) -> void:
	if slot < 0 or slot >= skill_cooldowns.size() or skill_cooldowns[slot] > 0.0 or main_ref == null:
		return
	if slot == 3 and not main_ref.is_set_skill_unlocked():
		main_ref.skill_locked_feedback()
		return
	var cds := [3.2,5.0,8.0,14.0]
	skill_cooldowns[slot] = cds[slot]
	main_ref.use_hero_skill(slot,global_position,facing,damage_multiplier,hero_class)
