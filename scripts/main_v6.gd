extends "res://scripts/main_v5.gd"

const PlayerV6Script = preload("res://scripts/player_v6.gd")
const PetV6Script = preload("res://scripts/pet_v6.gd")

var secret_sense_timer := 0.0

func _ready() -> void:
	super._ready()
	_bind("pet_next",KEY_TAB)

func _process(delta: float) -> void:
	super._process(delta)
	secret_sense_timer = max(0.0,secret_sense_timer-delta)
	if Input.is_action_just_pressed("pet_next"):
		_cycle_legendary()

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.4 FAMILY BUILD"):
			node.text = "v0.5 COMBAT & COMPANIONS • maná • stamina • 3+1 • 8 legendarios"

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV6Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var w: Dictionary = state.get("weapon",{})
	var a: Dictionary = state.get("armor",{})
	var c: Dictionary = state.get("charm",{})
	var pp: int = int(state.get("parenting_points",0))
	player.setup(self,100.0+float(a.get("power",1.0))*2.0+pp*2.0,float(w.get("power",1.0))+pp*0.12,float(a.get("power",1.0)),float(c.get("power",1.0)))
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático")))
	player.died.connect(_on_player_died)

func _spawn_pet_if_owned() -> void:
	pet = null
	var idx: int = int(state.get("active_pet",-1))
	if idx < 0 or idx >= pet_defs.size(): return
	pet = Node2D.new()
	pet.set_script(PetV6Script)
	world.add_child(pet)
	pet.position = player.position+Vector2(-40,-25)
	var bond: float = float(state.get("pet_bond",0.0))
	pet.setup(self,idx,float(pet_defs[idx]["power"])+current_map*0.06+bond*0.45)

func update_hud() -> void:
	super.update_hud()
	if player and is_instance_valid(player) and player.has_method("get_crit_chance"):
		health_label.size = Vector2(270,26)
		supply_label.size = Vector2(270,26)
		health_label.text = "VIDA %d/%d • MANÁ %d/%d" % [int(max(0.0,player.health)),int(player.max_health),int(player.mana),int(player.max_mana)]
		supply_label.text = "STA %d/%d • RACIONES %d%%" % [int(player.stamina),int(player.max_stamina),int(supplies)]
	var idx: int = int(state.get("active_pet",0))
	if idx >= 0 and idx < pet_defs.size():
		var d: Dictionary = pet_defs[idx]
		pet_label.text = "%s • %s • %s • TAB cambiar • K/C activar" % [str(d["name"]),str(d.get("element","Legendario")),str(d.get("bonus",""))]

func mana_feedback(cost: float,current: float) -> void:
	_toast("MANÁ INSUFICIENTE — necesitás %d, tenés %d" % [int(cost),int(current)],1.8)

func stamina_feedback() -> void:
	_toast("STAMINA INSUFICIENTE PARA DASH",1.4)

func legendary_shield_feedback() -> void:
	_toast("OKUNINUST — la burbuja absorbió el golpe",1.5)

func player_attack(pos: Vector2,facing: int,power: float) -> void:
	var crit: bool = false
	var chance: float = float(player.get_crit_chance()) if player and player.has_method("get_crit_chance") else 0.05
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var delta_to_enemy: Vector2 = e.global_position-pos
		if abs(delta_to_enemy.y)<58.0 and delta_to_enemy.x*facing>-10.0 and delta_to_enemy.x*facing<78.0:
			var final_power: float = power
			if rng.randf() < chance:
				final_power *= 1.75; crit = true
			e.take_damage(final_power)
	if crit: screen_shake(4.2,0.09)

func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	if not bool(state.get("mentor_chosen",false)):
		mentor_locked_feedback(); return
	var hero: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
	var names: Dictionary = {
		"Bardo":["Acorde Cortante","Balada de Vigor","Resonancia Arcana","Sinfonía Prismática"],
		"Guerrero":["Corte Quebrador","Guardia de Hierro","Embate del León","Juramento del Bastión"],
		"Arquero":["Flecha Gemela","Paso del Viento","Lluvia Astral","Tormenta de Xiomalar"],
		"Bruja del Caos":["Orbe Inestable","Marca del Vacío","Ruptura Caótica","Eclipse del Caos"]
	}
	var power: float = (18.0+slot*9.0)*multiplier
	match hero_class:
		"Bardo":
			if slot == 0:
				_damage_cone(pos,facing_dir,250.0,power); player.apply_damage_buff(5.0,1.12)
			elif slot == 1:
				player.heal(14.0); player.restore_mana(10.0); player.apply_speed_buff(6.0,1.18)
			elif slot == 2:
				_damage_radius(pos,285.0,power*1.20); _slow_enemies(pos,285.0,0.68,2.3)
			else:
				_damage_radius(pos,430.0,power*2.0); player.heal(24.0); player.apply_damage_buff(9.0,1.22); player.apply_speed_buff(9.0,1.18)
		"Guerrero":
			if slot == 0:
				_damage_radius(pos+Vector2(facing_dir*70,0),115.0,power*1.35)
			elif slot == 1:
				player.apply_armor_buff(6.0,0.34); player.invuln_timer=max(player.invuln_timer,0.55)
			elif slot == 2:
				player.velocity.x=facing_dir*760.0; _damage_radius(pos+Vector2(facing_dir*90,0),145.0,power*1.65)
			else:
				_damage_radius(pos,360.0,power*2.25); player.apply_armor_buff(10.0,0.40); player.apply_bubble_shield(1)
		"Arquero":
			if slot == 0:
				_damage_cone(pos,facing_dir,560.0,power*1.15)
			elif slot == 1:
				player.velocity.x=-facing_dir*480.0; player.invuln_timer=max(player.invuln_timer,0.48); _damage_cone(pos,facing_dir,320.0,power*0.75)
			elif slot == 2:
				_damage_radius(pos,620.0,power*1.35)
			else:
				_damage_radius(pos,790.0,power*1.90); player.apply_speed_buff(8.0,1.24); player.apply_crit_buff(8.0,0.15)
		"Bruja del Caos":
			if slot == 0:
				_damage_radius(pos+Vector2(facing_dir*150,0),150.0,power*1.20)
			elif slot == 1:
				_damage_radius(pos+Vector2(facing_dir*100,0),230.0,power); player.restore_mana(12.0)
			elif slot == 2:
				_damage_radius(pos,365.0,power*1.60); player.heal(8.0)
			else:
				_damage_radius(pos,530.0,power*2.45); player.heal(16.0); player.apply_mana_regen(8.0,5.0)
	var default_names: Array = ["Habilidad","Habilidad","Habilidad","Definitiva"]
	var selected_names: Array = names.get(hero_class,default_names)
	var skill_name: String = str(selected_names[slot])
	_toast("%s — %s" % [hero_class,skill_name],1.5)
	if slot == 3: screen_shake(9.0,0.22)
	update_hud()

func _slow_enemies(pos: Vector2,radius: float,factor: float,seconds: float) -> void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e) or pos.distance_to(e.global_position)>radius: continue
		var old_speed: float = float(e.get("speed"))
		e.set("speed",old_speed*factor)
		var target: Node = e
		get_tree().create_timer(seconds).timeout.connect(func():
			if is_instance_valid(target): target.set("speed",old_speed)
		)

func legendary_auto_attack(idx: int,origin: Vector2,power: float) -> bool:
	var target: Node = _nearest_enemy_to(origin,285.0)
	if target == null: return false
	match idx:
		0:
			target.take_damage(power)
		1:
			var hits: int = 0
			for e in get_tree().get_nodes_in_group("enemies"):
				if is_instance_valid(e) and origin.distance_to(e.global_position)<300.0 and hits<2:
					e.take_damage(power*0.82); hits+=1
		2:
			for e in get_tree().get_nodes_in_group("enemies"):
				if is_instance_valid(e) and target.global_position.distance_to(e.global_position)<105.0: e.take_damage(power*0.72)
		3:
			target.take_damage(power*0.92)
		4:
			for e in get_tree().get_nodes_in_group("enemies"):
				if is_instance_valid(e) and origin.distance_to(e.global_position)<120.0: e.take_damage(power*0.64)
		5:
			target.take_damage(power*1.18)
		6:
			target.take_damage(power*0.95)
		7:
			target.take_damage(power*1.28); _freeze_target(target,0.75)
	return true

func _nearest_enemy_to(origin: Vector2,max_range: float) -> Node:
	var best: Node = null
	var best_dist: float = max_range
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var dist: float = origin.distance_to(e.global_position)
		if dist<best_dist: best_dist=dist; best=e
	return best

func _freeze_target(target: Node,seconds: float) -> void:
	if not is_instance_valid(target): return
	var old_speed: float = float(target.get("speed"))
	target.set("speed",old_speed*0.55)
	get_tree().create_timer(seconds).timeout.connect(func():
		if is_instance_valid(target): target.set("speed",old_speed)
	)

func activate_legendary_effect(idx: int,power: float) -> void:
	if not player or not is_instance_valid(player): return
	match idx:
		0:
			player.apply_heal_regen(7.0,3.5); player.heal(6.0)
		1:
			player.apply_speed_buff(8.0,1.12); player.apply_dash_empower(8.0,1.25,power*2.0)
		2:
			player.apply_armor_buff(9.0,0.28)
		3:
			player.restore_mana(38.0); player.apply_mana_regen(10.0,4.0); secret_sense_timer=10.0
			if current_map in [9,19,29] and not bool(state.get("nigzen_complete",false)): _toast("KILLARUNA detecta una distorsión: NigZen está cerca.",3.0)
		4:
			player.apply_burn_aura(8.0,power*0.72)
		5:
			player.apply_dash_empower(9.0,1.32,power*2.8); player.apply_speed_buff(9.0,1.10)
		6:
			player.apply_bubble_shield(1); player.heal(5.0)
		7:
			player.apply_crit_buff(10.0,0.20); _damage_radius(player.global_position,260.0,power*1.15); _slow_enemies(player.global_position,260.0,0.60,2.0)
	_toast("%s — %s" % [str(pet_defs[idx]["name"]),str(pet_defs[idx].get("bonus","Poder legendario"))],2.2)
	update_hud()

func legendary_dash_strike(pos: Vector2,facing_dir: int,damage: float) -> void:
	_damage_radius(pos+Vector2(facing_dir*42,0),88.0,damage)

func legendary_burn_tick(pos: Vector2,damage: float) -> void:
	_damage_radius(pos,145.0,damage)

func _cycle_legendary() -> void:
	var owned: Array = state.get("pets",[])
	if owned.size()<2:
		_toast("Todavía no tenés otro legendario para cambiar.",1.6); return
	owned.sort()
	var current: int = int(state.get("active_pet",owned[0]))
	var at: int = owned.find(current)
	var next_idx: int = int(owned[(at+1)%owned.size()])
	state["active_pet"] = next_idx
	SaveSystem.save_state(state)
	if pet and is_instance_valid(pet): pet.queue_free()
	_spawn_pet_if_owned()
	_toast("LEGENDARIO ACTIVO: %s" % str(pet_defs[next_idx]["name"]),1.8)
	update_hud()
