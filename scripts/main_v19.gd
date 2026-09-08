extends "res://scripts/main_v18.gd"

# World of Xethkioz v0.9.6 — Final Block 1-5 Foundation
# Locks the first five maps as the production reference before extending 6-15.
# Goal: one visual layer, grounded NPCs, readable combat, non-debug traversal,
# stable map flow, and a boss transition that can be reused for later blocks.

func _setup_ui() -> void:
	super._setup_ui()
	# Keep only the compact HUD. Remove duplicated environment/title panels.
	if environment_badge:
		environment_badge.visible = false
	if map_title_panel_v10:
		map_title_panel_v10.visible = false
	if objective_label:
		objective_label.position = Vector2(355,78)
		objective_label.size = Vector2(570,24)
		objective_label.add_theme_font_size_override("font_size",10)
	if toast_label:
		toast_label.position = Vector2(440,560)
		toast_label.size = Vector2(400,32)
		toast_label.add_theme_font_size_override("font_size",11)

# Hide all large inherited map-title overlays. main_v16 compact intro is enough.
func _refresh_map_intro_panel() -> void:
	if map_title_panel_v10:
		map_title_panel_v10.visible = false

# Do not stack a second scenery pass over the level background.
func _add_demo_scenery(_map_no:int) -> void:
	pass

# Production-style one-way platform: collision stays simple, visual uses tile art.
func _add_one_way_platform(rect: Rect2,color: Color) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = rect.position + rect.size/2.0
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = rect.size
	cs.shape = sh
	cs.one_way_collision = true
	cs.one_way_collision_margin = 10.0
	body.add_child(cs)
	var visual := TextureRect.new()
	visual.position = -rect.size/2.0
	visual.size = rect.size
	visual.texture = TILE_PLATFORM
	visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	visual.stretch_mode = TextureRect.STRETCH_TILE
	visual.modulate = Color(0.90,0.96,0.94,1.0)
	visual.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(visual)
	world.add_child(body)

# Slopes remain simple collision geometry, but the visual no longer uses neon debug color.
func _add_slope(x: float,y: float,width: float,height: float,up_right: bool,_color: Color) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = Vector2(x,y)
	var pts: PackedVector2Array
	if up_right:
		pts = PackedVector2Array([Vector2(0,0),Vector2(width,-height),Vector2(width,78),Vector2(0,78)])
	else:
		pts = PackedVector2Array([Vector2(0,-height),Vector2(width,0),Vector2(width,78),Vector2(0,78)])
	var cs := CollisionShape2D.new()
	var shape := ConvexPolygonShape2D.new()
	shape.points = pts
	cs.shape = shape
	body.add_child(cs)
	var fill := Polygon2D.new()
	fill.polygon = pts
	fill.color = Color(0.11,0.25,0.20,1.0)
	fill.z_index = 1
	body.add_child(fill)
	var edge := Line2D.new()
	edge.points = PackedVector2Array([pts[0],pts[1]])
	edge.width = 7.0
	edge.default_color = Color(0.25,0.48,0.29,1.0)
	edge.z_index = 2
	body.add_child(edge)
	world.add_child(body)

func _add_prism_boost(pos: Vector2,direction: int = 1,speed_value: float = 610.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new(); sh.size = Vector2(68,14); cs.shape = sh; area.add_child(cs)
	var pad := Polygon2D.new()
	pad.polygon = PackedVector2Array([Vector2(-34,7),Vector2(-28,-5),Vector2(28,-5),Vector2(34,7)])
	pad.color = Color(0.24,0.58,0.76,0.82)
	area.add_child(pad)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.x = float(direction)*maxf(absf(body.velocity.x),speed_value)
			_spawn_combat_fx("arrow",body.global_position,Color(0.30,0.84,1.0),86.0,0.18,direction,0.75)
	)
	world.add_child(area)

func _add_bounce_pad(pos: Vector2,power: float = 690.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new(); sh.size = Vector2(50,16); cs.shape = sh; area.add_child(cs)
	var pad := Polygon2D.new()
	pad.polygon = PackedVector2Array([Vector2(-25,8),Vector2(-17,-7),Vector2(17,-7),Vector2(25,8)])
	pad.color = Color(0.48,0.29,0.70,0.86)
	area.add_child(pad)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.y = -power
			_spawn_combat_fx("burst",body.global_position,Color(0.72,0.48,1.0),70.0,0.22,1,0.9)
	)
	world.add_child(area)

# Story NPC pacing for maps 1-5. Each actor snaps itself to valid ground.
func _spawn_family_encounters(map_no: int) -> void:
	match map_no:
		1:
			_spawn_story_npc("Alexis",Vector2(420,410),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
			_spawn_story_npc("Ashley",Vector2(1640,360),"Escuchá Izrdralar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")
		2:
			_spawn_story_npc("Fermín",Vector2(1010,400),"No todo se resuelve corriendo. A veces hay que aguantar el golpe, romper la defensa y recién entonces avanzar.")
		3:
			_spawn_story_npc("Gael",Vector2(1400,330),"Desde arriba se ven rutas que desde el suelo parecen imposibles. Mirá primero; después dispará.")
		4:
			_spawn_story_npc("Isabella",Vector2(1570,330),"El caos no significa perder el control. Significa aprender a dirigir algo que nunca va a obedecer del todo.")
		5:
			_spawn_story_npc("Alexis",Vector2(1970,410),"Después de este guardián vas a elegir una senda. No elijas por fuerza: elegí por cómo querés pelear.")

# Apprentice powers are fully functional from the first map.
func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	if bool(state.get("mentor_chosen",false)):
		super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class)
		return
	if slot == 3:
		_toast("F • Definitiva bloqueada hasta completar un set.",1.5)
		return
	var power := (15.0 + float(slot)*6.0) * multiplier
	match slot:
		0:
			_damage_cone(pos,facing_dir,220.0,power)
			_spawn_combat_fx("slash",pos+Vector2(facing_dir*48,-4),Color(0.45,0.72,1.0),82.0,0.22,facing_dir,1.1)
			_toast("CORTE PRISMÁTICO",1.0)
		1:
			_damage_radius(pos,155.0,power*0.65)
			if player and is_instance_valid(player):
				player.apply_armor_buff(3.8,0.20)
				player.heal(6.0)
			_spawn_combat_fx("buff",pos,Color(0.42,0.92,0.86),120.0,0.36,facing_dir,1.0)
			_toast("PULSO DE GUARDIA",1.0)
		2:
			_damage_cone(pos,facing_dir,420.0,power*1.22)
			_spawn_combat_fx("arrow",pos+Vector2(facing_dir*44,-4),Color(0.78,0.42,1.0),175.0,0.30,facing_dir,1.2)
			_toast("DESTELLO DE FISURA",1.0)
	update_hud()

func update_hud() -> void:
	super.update_hud()
	if not bool(state.get("mentor_chosen",false)) and gear_label:
		gear_label.text = "%s • APRENDIZ PRISMÁTICO | Q CORTE • E GUARDIA • R DESTELLO • F SET" % str(state.get("player_name","Viajero"))
	if objective_label and current_map <= 5:
		var prompts := [
			"Explorá rutas altas y bajas • Q/E/R activos",
			"Mantené impulso • combiná movimiento y combate",
			"Bruma • buscá altura, ecos y secretos",
			"Noche • leé emboscadas y conservá movilidad",
			"Tormenta • derrotá al Guardián del Bosque"
		]
		objective_label.text = prompts[clampi(current_map-1,0,4)]
