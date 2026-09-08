extends "res://scripts/main_v16.gd"

# World of Xethkioz v0.9.5 — Golden Slice Foundation Repair
# Fixes composition/layout defects before any additional content expansion.

const PlayerV9Script = preload("res://scripts/player_v9.gd")

func _setup_ui() -> void:
	super._setup_ui()
	# v0.9.3 inherited two different map/environment title systems. Keep only
	# the compact zone intro from main_v16.
	if environment_badge:
		environment_badge.visible = false
	if map_title_panel_v10:
		map_title_panel_v10.visible = false
	if hud_layer:
		for child in hud_layer.get_children():
			if child is Panel:
				var control := child as Control
				if control.position.distance_to(Vector2(430,18)) < 8.0 and control.size.x > 390.0 and control.size.x < 460.0:
					control.visible = false
	if objective_label:
		objective_label.position = Vector2(390,82)
		objective_label.size = Vector2(500,22)
		objective_label.add_theme_font_size_override("font_size",10)

# Disable the older large center title. main_v16 provides the approved compact intro.
func _refresh_map_intro_panel() -> void:
	if map_title_panel_v10:
		map_title_panel_v10.visible = false

# main_v15 added a second full scenic pass after the actual map had already
# built its background. Virtual dispatch lets this override remove that duplicate.
func _add_demo_scenery(_map_no:int) -> void:
	pass

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV9Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var weapon: Dictionary = state.get("weapon",{})
	var armor: Dictionary = state.get("armor",{})
	var charm: Dictionary = state.get("charm",{})
	var parenting_points := int(state.get("parenting_points",0))
	player.setup(self,100.0+float(armor.get("power",1.0))*2.0+parenting_points*2.0,float(weapon.get("power",1.0))+parenting_points*0.12,float(armor.get("power",1.0)),float(charm.get("power",1.0)))
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático")))
	player.died.connect(_on_player_died)

# Story pacing for the finished first block. NPC Y placement is only an
# approximate seed; npc_actor.gd now snaps characters to valid collision floor.
func _spawn_family_encounters(map_no: int) -> void:
	match map_no:
		1:
			_spawn_story_npc("Alexis",Vector2(420,420),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
			_spawn_story_npc("Ashley",Vector2(1650,360),"Escuchá Izrdralar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")
		2:
			_spawn_story_npc("Fermín",Vector2(980,420),"No todo se resuelve corriendo. A veces hay que aguantar el golpe, romper la defensa y recién entonces avanzar.")
		3:
			_spawn_story_npc("Gael",Vector2(1410,330),"Desde arriba se ven rutas que desde el suelo parecen imposibles. Mirá primero; después dispará.")
		4:
			_spawn_story_npc("Isabella",Vector2(1580,330),"El caos no significa perder el control. Significa aprender a dirigir algo que nunca va a obedecer del todo.")
		5:
			_spawn_story_npc("Alexis",Vector2(1980,420),"Después de este guardián vas a elegir una senda. No elijas por fuerza: elegí por cómo querés pelear.")

# Maps 1–5 must already feel like a real action RPG. Before mentor selection,
# Q/E/R use neutral Apprentice Prismático abilities. Mentor skills replace them.
func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	if bool(state.get("mentor_chosen",false)):
		super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class)
		return
	if slot == 3:
		_toast("F • La definitiva se desbloquea con un conjunto completo.",1.8)
		return
	var power := (14.0 + float(slot)*5.0) * multiplier
	match slot:
		0:
			_damage_cone(pos,facing_dir,205.0,power)
			_spawn_combat_fx("slash",pos+Vector2(facing_dir*48,-4),Color(0.54,0.72,1.0),78.0,0.22,facing_dir,1.0)
			_toast("APRENDIZ • Corte Prismático",1.2)
		1:
			_damage_radius(pos,145.0,power*0.55)
			if player and is_instance_valid(player):
				player.apply_armor_buff(3.5,0.18)
				player.heal(5.0)
			_spawn_combat_fx("buff",pos,Color(0.46,0.92,0.92),115.0,0.34,facing_dir,1.0)
			_toast("APRENDIZ • Pulso de Guardia",1.2)
		2:
			_damage_cone(pos,facing_dir,390.0,power*1.18)
			_spawn_combat_fx("arrow",pos+Vector2(facing_dir*42,-4),Color(0.74,0.42,1.0),165.0,0.30,facing_dir,1.15)
			_toast("APRENDIZ • Destello de Fisura",1.2)
	update_hud()

func update_hud() -> void:
	super.update_hud()
	if not bool(state.get("mentor_chosen",false)) and gear_label:
		gear_label.text = "%s • APRENDIZ PRISMÁTICO   |   Q CORTE • E GUARDIA • R DESTELLO • F SET" % str(state.get("player_name","Viajero"))
	if objective_label and current_map <= 5:
		var prompts := [
			"Explorá rutas altas y bajas • Q/E/R poderes prismáticos",
			"Mantené impulso • combiná plataformas y combate",
			"Bruma • buscá altura y secretos • Q/E/R activos",
			"Noche • leé emboscadas y conservá movilidad",
			"Tormenta • preparate para el Guardián del Bosque"
		]
		objective_label.text = prompts[clampi(current_map-1,0,4)]
