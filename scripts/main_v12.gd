extends "res://scripts/main_v11.gd"

# v0.8.3 — Game Feel / Traversal Pass
# Maps 1–5 now favor momentum, ramps, route splits and traversal devices.

const CombatFX = preload("res://scripts/combat_fx.gd")

func _setup_ui() -> void:
	super._setup_ui()
	if objective_label:
		objective_label.position = Vector2(390,86)
		objective_label.size = Vector2(500,22)
		objective_label.add_theme_font_size_override("font_size",10)
		objective_label.add_theme_color_override("font_color",Color(0.78,0.90,1.0,0.92))
	if toast_label:
		toast_label.position = Vector2(420,535)
		toast_label.size = Vector2(440,34)
		toast_label.add_theme_font_size_override("font_size",12)

func _complete_map() -> void:
	# main_v10 stopped Map 1 deliberately. The playable block must flow 1→5.
	if current_map != 1:
		super._complete_map()
		return
	if map_complete:
		return
	map_complete = true
	state["unlocked_map"] = max(int(state.get("unlocked_map",1)),2)
	current_map = 2
	state["current_map"] = current_map
	supplies = min(float(state.get("max_supplies",100.0)),supplies+10.0)
	state["supplies"] = supplies
	SaveSystem.save_state(state)
	_show_intermission()

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and "v0.8.0" in node.text:
			node.text = "v0.8.3 • GAME FEEL PLAYTEST • IZRDALAR 1–5 • XETHKIOZ"

func update_hud() -> void:
	super.update_hud()
	if objective_label:
		match current_map:
			1: objective_label.text = "Tomá impulso • probá ruta alta/baja • G: resonancias"
			2: objective_label.text = "Usá rampas y pads prismáticos • guardianes más agresivos"
			3: objective_label.text = "Bruma • rebotes verticales • reuní 4 fragmentos"
			4: objective_label.text = "Noche • mantené velocidad sin caer en emboscadas"
			5: objective_label.text = "Tormenta • carrera de aproximación • derrotá al Arconte"
		if bool(state.get("mentor_chosen",false)) and current_map >= 6:
			objective_label.text = "Q/E/R: skills de mentor con efectos • F: definitiva de set"

# ---------------------------------------------------------------------------
# Combat feedback
func _spawn_combat_fx(effect_mode: String,pos: Vector2,color: Color,radius: float,duration: float = 0.35,facing_dir: int = 1,intensity: float = 1.0) -> void:
	if not world:
		return
	var fx := Node2D.new()
	fx.set_script(CombatFX)
	world.add_child(fx)
	fx.global_position = pos
	fx.setup(effect_mode,color,radius,duration,facing_dir,intensity)

func enemy_hit_feedback(pos: Vector2,amount: float) -> void:
	_spawn_combat_fx("burst",pos+Vector2(0,-15),Color(1.0,0.55,0.24),26.0,0.18,1,0.8)
	if not world:
		return
	var label := Label.new()
	label.position = pos+Vector2(-18,-58)
	label.size = Vector2(70,28)
	label.text = str(int(round(amount)))
	label.z_index = 95
	label.add_theme_font_size_override("font_size",16)
	label.add_theme_color_override("font_color",Color(1.0,0.82,0.42))
	label.add_theme_color_override("font_shadow_color",Color(0.0,0.0,0.0,0.95))
	world.add_child(label)
	var tween := create_tween()
	tween.tween_property(label,"position",label.position+Vector2(0,-26),0.34)
	tween.parallel().tween_property(label,"modulate",Color(1,1,1,0),0.34)
	tween.finished.connect(func():
		if is_instance_valid(label): label.queue_free()
	)

func player_attack(pos: Vector2,facing_dir: int,power: float) -> void:
	super.player_attack(pos,facing_dir,power)
	_spawn_combat_fx("slash",pos+Vector2(facing_dir*34,-4),Color(0.82,0.54,1.0),58.0,0.16,facing_dir,0.8)

func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	var mentor_ready := bool(state.get("mentor_chosen",false))
	var set_ready := slot != 3 or is_set_skill_unlocked()
	super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class)
	if not mentor_ready or not set_ready:
		return
	var mode := "burst"
	var color := Color(0.72,0.42,1.0)
	var radius := [125.0,155.0,245.0,390.0][clampi(slot,0,3)]
	match hero_class:
		"Bardo":
			color = Color(1.0,0.38,0.78)
			mode = "slash" if slot == 0 else ("buff" if slot == 1 else "burst")
		"Guerrero":
			color = Color(1.0,0.62,0.22)
			mode = "slash" if slot in [0,2] else "buff"
		"Arquero":
			color = Color(0.36,0.92,0.60)
			mode = "arrow" if slot in [0,2] else "buff"
		"Bruja del Caos":
			color = Color(0.68,0.30,1.0)
			mode = "chaos"
	if slot == 3:
		mode = "chaos" if hero_class == "Bruja del Caos" else "burst"
		radius *= 1.22
	_spawn_combat_fx(mode,pos,color,radius,0.42 if slot < 3 else 0.62,facing_dir,1.0 if slot < 3 else 1.4)

# ---------------------------------------------------------------------------
# Traversal building blocks
func _add_one_way_platform(rect: Rect2,color: Color) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = rect.position+rect.size/2.0
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = rect.size
	cs.shape = sh
	cs.one_way_collision = true
	cs.one_way_collision_margin = 10.0
	body.add_child(cs)
	var poly := Polygon2D.new()
	var hs := rect.size/2.0
	poly.polygon = PackedVector2Array([Vector2(-hs.x,-hs.y),Vector2(hs.x,-hs.y),Vector2(hs.x,hs.y),Vector2(-hs.x,hs.y)])
	poly.color = color
	body.add_child(poly)
	world.add_child(body)

func _add_slope(x: float,y: float,width: float,height: float,up_right: bool,color: Color) -> void:
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
	var poly := Polygon2D.new()
	poly.polygon = pts
	poly.color = color
	body.add_child(poly)
	world.add_child(body)

func _add_prism_boost(pos: Vector2,direction: int = 1,speed_value: float = 610.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = Vector2(72,16)
	cs.shape = sh
	area.add_child(cs)
	var poly := Polygon2D.new()
	poly.polygon = PackedVector2Array([Vector2(-36,8),Vector2(-28,-8),Vector2(36,-8),Vector2(28,8)])
	poly.color = Color(0.28,0.88,1.0,0.88)
	area.add_child(poly)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.x = float(direction)*maxf(absf(body.velocity.x),speed_value)
			_spawn_combat_fx("arrow",body.global_position,Color(0.30,0.92,1.0),90.0,0.20,direction,0.8)
	)
	world.add_child(area)

func _add_bounce_pad(pos: Vector2,power: float = 690.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = Vector2(54,18)
	cs.shape = sh
	area.add_child(cs)
	var poly := Polygon2D.new()
	poly.polygon = PackedVector2Array([Vector2(-27,8),Vector2(-20,-8),Vector2(20,-8),Vector2(27,8)])
	poly.color = Color(0.78,0.38,1.0,0.92)
	area.add_child(poly)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.y = -power
			_spawn_combat_fx("burst",body.global_position,Color(0.78,0.40,1.0),72.0,0.25,1,1.0)
	)
	world.add_child(area)

func _crystal_line(start: Vector2,count: int,step: Vector2) -> void:
	for i in range(count):
		_spawn_pickup("crystal",start+step*float(i))

# ---------------------------------------------------------------------------
# Hand-authored Izrdalar traversal block. Same ecosystem, different rhythm.
func _generate_demo_level(map_no: int) -> void:
	var biome := _biome()
	_build_background(biome,map_no)
	var difficulty := _difficulty()
	var ground: Color = biome["ground"]
	var accent := Color(biome["accent"],0.88)
	match map_no:
		1:
			# Flow tutorial: long run, slope, upper route, gap, rejoin.
			_add_platform(Rect2(-100,GROUND_Y,760,120),ground)
			_add_platform(Rect2(850,GROUND_Y,1170,120),ground)
			_add_platform(Rect2(2200,GROUND_Y,1100,120),ground)
			_add_slope(360,GROUND_Y,250,105,true,accent)
			_add_one_way_platform(Rect2(610,510,190,18),accent)
			_add_one_way_platform(Rect2(760,455,165,18),accent)
			_add_one_way_platform(Rect2(930,415,175,18),accent)
			_add_slope(1320,GROUND_Y,280,120,true,accent)
			_add_one_way_platform(Rect2(1590,488,210,18),accent)
			_add_slope(1810,GROUND_Y,210,105,false,accent)
			_add_one_way_platform(Rect2(2050,490,170,18),accent)
			_add_one_way_platform(Rect2(2320,438,185,18),accent)
			_add_prism_boost(Vector2(275,606),1,600.0)
			_add_bounce_pad(Vector2(805,606),650.0)
			_add_prism_boost(Vector2(2250,606),1,640.0)
			for p in [Vector2(540,565),Vector2(1120,565),Vector2(1730,565),Vector2(2480,565)]: _spawn_enemy(p,difficulty,0)
			_crystal_line(Vector2(465,530),5,Vector2(55,-14))
			_crystal_line(Vector2(760,420),4,Vector2(58,-5))
			_crystal_line(Vector2(2280,530),5,Vector2(60,-12))
			_spawn_pickup("food",Vector2(1880,555))
			_spawn_pickup("chest",Vector2(2700,555))
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		2:
			# Speed corridor with high safe route and lower combat route.
			_add_platform(Rect2(-100,GROUND_Y,620,120),ground)
			_add_platform(Rect2(700,GROUND_Y,680,120),ground)
			_add_platform(Rect2(1510,GROUND_Y,640,120),ground)
			_add_platform(Rect2(2310,GROUND_Y,990,120),ground)
			_add_slope(250,GROUND_Y,260,130,true,accent)
			for r in [Rect2(510,485,180,18),Rect2(690,438,180,18),Rect2(900,410,190,18),Rect2(1120,452,170,18),Rect2(1380,485,170,18)]: _add_one_way_platform(r,accent)
			_add_slope(1650,GROUND_Y,300,135,true,accent)
			_add_slope(1960,GROUND_Y,190,95,false,accent)
			for r in [Rect2(2190,470,150,18),Rect2(2390,420,165,18),Rect2(2600,380,180,18)]: _add_one_way_platform(r,accent)
			_add_prism_boost(Vector2(185,606),1,650.0)
			_add_prism_boost(Vector2(1560,606),1,680.0)
			_add_bounce_pad(Vector2(2215,606),700.0)
			for p in [Vector2(760,565),Vector2(1040,565),Vector2(1580,565),Vector2(1910,565),Vector2(2420,565),Vector2(2830,565)]: _spawn_enemy(p,difficulty+0.10,1)
			_crystal_line(Vector2(560,445),6,Vector2(70,-5))
			_crystal_line(Vector2(2200,430),6,Vector2(70,-10))
			_spawn_pickup("food",Vector2(2460,555))
			_spawn_pickup("chest",Vector2(1260,555))
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		3:
			# Vertical route: bounce pads create a fast upper chain through the fog.
			_add_platform(Rect2(-100,GROUND_Y,900,120),ground)
			_add_platform(Rect2(980,GROUND_Y,690,120),ground)
			_add_platform(Rect2(1840,GROUND_Y,620,120),ground)
			_add_platform(Rect2(2630,GROUND_Y,670,120),ground)
			for r in [Rect2(420,505,185,18),Rect2(720,430,175,18),Rect2(1040,350,175,18),Rect2(1360,430,180,18),Rect2(1690,355,170,18),Rect2(2010,435,190,18),Rect2(2340,345,180,18),Rect2(2730,430,180,18)]: _add_one_way_platform(r,accent)
			_add_bounce_pad(Vector2(345,606),690.0)
			_add_bounce_pad(Vector2(930,606),720.0)
			_add_bounce_pad(Vector2(1785,606),710.0)
			_add_bounce_pad(Vector2(2555,606),700.0)
			for p in [Vector2(560,565),Vector2(1150,565),Vector2(1480,565),Vector2(1960,565),Vector2(2230,565),Vector2(2790,565)]: _spawn_enemy(p,difficulty+0.14,2)
			for pos in [Vector2(470,465),Vector2(770,390),Vector2(1090,310),Vector2(1740,315),Vector2(2390,305),Vector2(2800,390)]: _spawn_pickup("crystal",pos)
			_spawn_pickup("food",Vector2(2050,555))
			_spawn_pickup("chest",Vector2(2380,300))
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		4:
			# Night gauntlet: momentum lanes separated by short precision branches.
			_add_platform(Rect2(-100,GROUND_Y,560,120),ground)
			_add_platform(Rect2(610,GROUND_Y,720,120),ground)
			_add_platform(Rect2(1490,GROUND_Y,650,120),ground)
			_add_platform(Rect2(2290,GROUND_Y,1010,120),ground)
			_add_slope(150,GROUND_Y,260,120,true,accent)
			_add_slope(710,GROUND_Y,300,125,true,accent)
			_add_slope(1020,GROUND_Y,250,105,false,accent)
			_add_slope(1580,GROUND_Y,290,130,true,accent)
			_add_slope(1880,GROUND_Y,220,105,false,accent)
			for r in [Rect2(470,465,150,18),Rect2(1320,430,170,18),Rect2(2110,455,180,18),Rect2(2540,395,175,18),Rect2(2810,350,170,18)]: _add_one_way_platform(r,accent)
			_add_prism_boost(Vector2(90,606),1,670.0)
			_add_prism_boost(Vector2(1515,606),1,700.0)
			_add_bounce_pad(Vector2(2180,606),710.0)
			for p in [Vector2(660,565),Vector2(930,565),Vector2(1530,565),Vector2(1810,565),Vector2(2340,565),Vector2(2650,565),Vector2(2940,565)]: _spawn_enemy(p,difficulty+0.22,3)
			_crystal_line(Vector2(210,520),5,Vector2(64,-18))
			_crystal_line(Vector2(2490,350),6,Vector2(70,-4))
			_spawn_pickup("food",Vector2(2440,555))
			_spawn_pickup("chest",Vector2(2880,305))
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		5:
			# Boss approach: build speed, climb, descend into a large uninterrupted arena.
			_add_platform(Rect2(-100,GROUND_Y,3300,120),ground)
			_add_slope(320,GROUND_Y,320,150,true,accent)
			_add_one_way_platform(Rect2(640,465,210,18),accent)
			_add_one_way_platform(Rect2(900,420,210,18),accent)
			_add_slope(1160,GROUND_Y,300,135,false,accent)
			_add_prism_boost(Vector2(130,606),1,700.0)
			_add_prism_boost(Vector2(1500,606),1,720.0)
			for p in [Vector2(720,565),Vector2(1060,565),Vector2(1500,565),Vector2(1880,565)]: _spawn_enemy(p,difficulty+0.26,3)
			_crystal_line(Vector2(420,520),6,Vector2(70,-18))
			_spawn_pickup("food",Vector2(1280,555))
			_spawn_pickup("food",Vector2(2020,555))
			_spawn_pickup("chest",Vector2(1040,375))
			boss_alive = true
			_spawn_boss(Vector2(2700,545),0,difficulty+0.36)
