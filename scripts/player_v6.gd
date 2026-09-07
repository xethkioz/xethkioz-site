extends "res://scripts/player_v4.gd"

var max_mana := 100.0
var mana := 100.0
var max_stamina := 100.0
var stamina := 100.0
var mana_regen := 5.0
var stamina_regen := 24.0
var combat_stats_ready := false

var baseline_speed := 255.0
var baseline_damage := 1.0
var baseline_armor := 0.0
var speed_buff_timer := 0.0
var speed_buff_mult := 1.0
var damage_buff_timer := 0.0
var damage_buff_mult := 1.0
var armor_buff_timer := 0.0
var armor_buff_bonus := 0.0
var mana_regen_buff_timer := 0.0
var mana_regen_bonus := 0.0
var dash_empower_timer := 0.0
var dash_speed_mult := 1.0
var dash_bonus_damage := 0.0
var burn_aura_timer := 0.0
var burn_aura_damage := 0.0
var burn_tick := 0.0
var heal_regen_timer := 0.0
var heal_regen_per_sec := 0.0
var heal_tick := 0.0
var crit_buff_timer := 0.0
var crit_bonus := 0.0
var base_crit_chance := 0.05
var shield_hits := 0

func finalize_combat_stats(hero_class_name: String) -> void:
	match hero_class_name:
		"Bardo":
			max_mana = 125.0; max_stamina = 95.0; mana_regen = 7.0; stamina_regen = 23.0
		"Guerrero":
			max_mana = 72.0; max_stamina = 135.0; mana_regen = 4.0; stamina_regen = 30.0
		"Arquero":
			max_mana = 92.0; max_stamina = 122.0; mana_regen = 5.2; stamina_regen = 28.0
		"Bruja del Caos":
			max_mana = 152.0; max_stamina = 86.0; mana_regen = 8.5; stamina_regen = 21.0
		_:
			max_mana = 82.0; max_stamina = 105.0; mana_regen = 5.0; stamina_regen = 25.0
	mana = max_mana
	stamina = max_stamina
	baseline_speed = base_speed
	baseline_damage = damage_multiplier
	baseline_armor = armor_reduction
	combat_stats_ready = true

func _physics_process(delta: float) -> void:
	if not combat_stats_ready:
		finalize_combat_stats(hero_class)
	_update_combat_buffs(delta)
	mana = min(max_mana,mana + (mana_regen + (mana_regen_bonus if mana_regen_buff_timer > 0.0 else 0.0))*delta)
	var stamina_rate: float = stamina_regen * (1.15 if is_on_floor() else 0.72)
	if dash_timer <= 0.0:
		stamina = min(max_stamina,stamina + stamina_rate*delta)

	var dash_pressed: bool = Input.is_action_just_pressed("dash")
	var dash_allowed: bool = dash_pressed and dash_cooldown <= 0.0 and stamina >= 18.0
	if dash_pressed:
		if dash_allowed:
			stamina -= 18.0
		else:
			dash_cooldown = max(dash_cooldown,0.18)
			if main_ref and main_ref.has_method("stamina_feedback"):
				main_ref.stamina_feedback()

	super._physics_process(delta)

	if dash_allowed and dash_timer > 0.0 and dash_empower_timer > 0.0:
		velocity.x *= dash_speed_mult
		if main_ref and main_ref.has_method("legendary_dash_strike") and dash_bonus_damage > 0.0:
			main_ref.legendary_dash_strike(global_position,facing,dash_bonus_damage)

	if burn_aura_timer > 0.0:
		burn_tick -= delta
		if burn_tick <= 0.0:
			burn_tick = 0.55
			if main_ref and main_ref.has_method("legendary_burn_tick"):
				main_ref.legendary_burn_tick(global_position,burn_aura_damage)

	if heal_regen_timer > 0.0:
		heal_tick -= delta
		if heal_tick <= 0.0:
			heal_tick = 1.0
			heal(heal_regen_per_sec)

func _update_combat_buffs(delta: float) -> void:
	speed_buff_timer = max(0.0,speed_buff_timer-delta)
	damage_buff_timer = max(0.0,damage_buff_timer-delta)
	armor_buff_timer = max(0.0,armor_buff_timer-delta)
	mana_regen_buff_timer = max(0.0,mana_regen_buff_timer-delta)
	dash_empower_timer = max(0.0,dash_empower_timer-delta)
	burn_aura_timer = max(0.0,burn_aura_timer-delta)
	heal_regen_timer = max(0.0,heal_regen_timer-delta)
	crit_buff_timer = max(0.0,crit_buff_timer-delta)
	base_speed = baseline_speed * (speed_buff_mult if speed_buff_timer > 0.0 else 1.0)
	damage_multiplier = baseline_damage * (damage_buff_mult if damage_buff_timer > 0.0 else 1.0)
	armor_reduction = min(0.72,baseline_armor + (armor_buff_bonus if armor_buff_timer > 0.0 else 0.0))
	if mana_regen_buff_timer <= 0.0: mana_regen_bonus = 0.0
	if dash_empower_timer <= 0.0:
		dash_speed_mult = 1.0; dash_bonus_damage = 0.0
	if burn_aura_timer <= 0.0: burn_aura_damage = 0.0
	if heal_regen_timer <= 0.0: heal_regen_per_sec = 0.0
	if crit_buff_timer <= 0.0: crit_bonus = 0.0

func _try_skill(slot: int) -> void:
	if hero_class == "Aprendiz Prismático":
		if main_ref and main_ref.has_method("mentor_locked_feedback"): main_ref.mentor_locked_feedback()
		return
	if slot < 0 or slot >= skill_cooldowns.size() or skill_cooldowns[slot] > 0.0 or main_ref == null:
		return
	if slot == 3 and not main_ref.is_set_skill_unlocked():
		main_ref.skill_locked_feedback()
		return
	var costs: Array[float] = [14.0,22.0,34.0,58.0]
	var cost: float = costs[slot]
	if mana < cost:
		if main_ref.has_method("mana_feedback"): main_ref.mana_feedback(cost,mana)
		return
	mana -= cost
	var cds: Array[float] = [2.8,4.8,7.4,16.0]
	skill_cooldowns[slot] = cds[slot]
	main_ref.use_hero_skill(slot,global_position,facing,damage_multiplier,hero_class)

func take_damage(amount: float,knockback: Vector2 = Vector2.ZERO) -> void:
	if shield_hits > 0:
		shield_hits -= 1
		invuln_timer = max(invuln_timer,0.55)
		if main_ref and main_ref.has_method("legendary_shield_feedback"): main_ref.legendary_shield_feedback()
		return
	super.take_damage(amount,knockback)

func restore_mana(amount: float) -> void:
	mana = min(max_mana,mana+amount)

func apply_speed_buff(seconds: float,multiplier: float) -> void:
	speed_buff_timer = max(speed_buff_timer,seconds); speed_buff_mult = max(speed_buff_mult,multiplier)

func apply_damage_buff(seconds: float,multiplier: float) -> void:
	damage_buff_timer = max(damage_buff_timer,seconds); damage_buff_mult = max(damage_buff_mult,multiplier)

func apply_armor_buff(seconds: float,bonus: float) -> void:
	armor_buff_timer = max(armor_buff_timer,seconds); armor_buff_bonus = max(armor_buff_bonus,bonus)

func apply_mana_regen(seconds: float,bonus_per_sec: float) -> void:
	mana_regen_buff_timer = max(mana_regen_buff_timer,seconds); mana_regen_bonus = max(mana_regen_bonus,bonus_per_sec)

func apply_dash_empower(seconds: float,speed_multiplier: float,bonus_damage: float) -> void:
	dash_empower_timer = max(dash_empower_timer,seconds); dash_speed_mult = max(dash_speed_mult,speed_multiplier); dash_bonus_damage = max(dash_bonus_damage,bonus_damage)

func apply_burn_aura(seconds: float,tick_damage: float) -> void:
	burn_aura_timer = max(burn_aura_timer,seconds); burn_aura_damage = max(burn_aura_damage,tick_damage); burn_tick = 0.05

func apply_heal_regen(seconds: float,amount_per_sec: float) -> void:
	heal_regen_timer = max(heal_regen_timer,seconds); heal_regen_per_sec = max(heal_regen_per_sec,amount_per_sec); heal_tick = 0.05

func apply_bubble_shield(hits: int = 1) -> void:
	shield_hits = max(shield_hits,hits)

func apply_crit_buff(seconds: float,bonus: float) -> void:
	crit_buff_timer = max(crit_buff_timer,seconds); crit_bonus = max(crit_bonus,bonus)

func get_crit_chance() -> float:
	return min(0.75,base_crit_chance + (crit_bonus if crit_buff_timer > 0.0 else 0.0))
