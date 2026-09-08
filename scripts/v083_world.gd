extends RefCounted

# Golden Slice map builder — maps 1–5.
# Traversal physics stay lightweight, but all visible helpers are presented as
# terrain/platform elements rather than debug geometry.

const GROUND_Y := 620.0
const LEVEL_WIDTH := 3200.0
const PLATFORM_TEX: Texture2D = preload("res://assets/v08/generated/platform_tile.png")
const GROUND_TEX: Texture2D = preload("res://assets/v08/generated/ground_tile.png")

static func _terrain_color(main: Node) -> Color:
	var biome: Dictionary = main._biome()
	return Color(biome.get("ground",Color(0.14,0.28,0.22)))

static func _terrain_accent(main: Node) -> Color:
	var biome: Dictionary = main._biome()
	var c := Color(biome.get("accent",Color(0.35,0.72,0.55)))
	return Color(c.r*0.82,c.g*0.88,c.b*0.82,0.96)

static func _add_one_way(main: Node,rect: Rect2,_color: Color) -> void:
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
	var visual := TextureRect.new()
	visual.position = -rect.size/2.0
	visual.size = rect.size
	visual.texture = PLATFORM_TEX
	visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	visual.stretch_mode = TextureRect.STRETCH_TILE
	visual.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(visual)
	main.world.add_child(body)

static func _add_slope(main: Node,x: float,y: float,width: float,height: float,up_right: bool,_color: Color) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = Vector2(x,y)
	var pts: PackedVector2Array
	var top_a: Vector2
	var top_b: Vector2
	if up_right:
		pts = PackedVector2Array([Vector2(0,0),Vector2(width,-height),Vector2(width,78),Vector2(0,78)])
		top_a=Vector2(0,0); top_b=Vector2(width,-height)
	else:
		pts = PackedVector2Array([Vector2(0,-height),Vector2(width,0),Vector2(width,78),Vector2(0,78)])
		top_a=Vector2(0,-height); top_b=Vector2(width,0)
	var cs := CollisionShape2D.new()
	var shape := ConvexPolygonShape2D.new()
	shape.points = pts
	cs.shape = shape
	body.add_child(cs)
	var poly := Polygon2D.new()
	poly.polygon = pts
	poly.color = _terrain_color(main).darkened(0.08)
	body.add_child(poly)
	var lip := Line2D.new()
	lip.points = PackedVector2Array([top_a,top_b])
	lip.width = 9.0
	lip.default_color = _terrain_accent(main)
	lip.antialiased = false
	body.add_child(lip)
	main.world.add_child(body)

static func _add_boost(main: Node,pos: Vector2,direction: int = 1,speed_value: float = 610.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = Vector2(58,13)
	cs.shape = sh
	area.add_child(cs)
	var plate := Polygon2D.new()
	plate.polygon = PackedVector2Array([Vector2(-29,6),Vector2(-23,-5),Vector2(29,-5),Vector2(23,6)])
	plate.color = Color(0.18,0.48,0.58,0.90)
	area.add_child(plate)
	var glow := Line2D.new()
	glow.points = PackedVector2Array([Vector2(-17,0),Vector2(17,0)])
	glow.width = 3.0
	glow.default_color = Color(0.48,0.92,1.0,0.92)
	area.add_child(glow)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.x = float(direction)*maxf(absf(body.velocity.x),speed_value)
			if main.has_method("_spawn_combat_fx"):
				main._spawn_combat_fx("arrow",body.global_position,Color(0.30,0.92,1.0),70.0,0.16,direction,0.55)
	)
	main.world.add_child(area)

static func _add_bounce(main: Node,pos: Vector2,power: float = 690.0) -> void:
	var area := Area2D.new()
	area.collision_layer = 0
	area.collision_mask = 1
	area.position = pos
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = Vector2(48,15)
	cs.shape = sh
	area.add_child(cs)
	var plate := Polygon2D.new()
	plate.polygon = PackedVector2Array([Vector2(-24,7),Vector2(-18,-6),Vector2(18,-6),Vector2(24,7)])
	plate.color = Color(0.36,0.20,0.48,0.92)
	area.add_child(plate)
	var rune := Line2D.new()
	rune.points = PackedVector2Array([Vector2(-11,1),Vector2(0,-4),Vector2(11,1)])
	rune.width = 3.0
	rune.default_color = Color(0.82,0.58,1.0,0.96)
	area.add_child(rune)
	area.body_entered.connect(func(body):
		if body.is_in_group("player"):
			body.velocity.y = -power
			if main.has_method("_spawn_combat_fx"):
				main._spawn_combat_fx("burst",body.global_position,Color(0.78,0.40,1.0),64.0,0.20,1,0.65)
	)
	main.world.add_child(area)

static func _crystals(main: Node,start: Vector2,count: int,step: Vector2) -> void:
	for i in range(count):
		main._spawn_pickup("crystal",start+step*float(i))

static func build(main: Node,map_no: int) -> void:
	var biome: Dictionary = main._biome()
	main._build_background(biome,map_no)
	var difficulty: float = main._difficulty()
	var ground: Color = biome["ground"]
	var accent: Color = Color(biome["accent"],0.88)
	match map_no:
		1:
			main._add_platform(Rect2(-100,GROUND_Y,760,120),ground)
			main._add_platform(Rect2(850,GROUND_Y,1170,120),ground)
			main._add_platform(Rect2(2200,GROUND_Y,1100,120),ground)
			_add_slope(main,360,GROUND_Y,250,105,true,accent)
			for r in [Rect2(610,510,190,18),Rect2(760,455,165,18),Rect2(930,415,175,18),Rect2(1590,488,210,18),Rect2(2050,490,170,18),Rect2(2320,438,185,18)]: _add_one_way(main,r,accent)
			_add_slope(main,1320,GROUND_Y,280,120,true,accent)
			_add_slope(main,1810,GROUND_Y,210,105,false,accent)
			_add_boost(main,Vector2(275,606),1,600.0)
			_add_bounce(main,Vector2(805,606),650.0)
			_add_boost(main,Vector2(2250,606),1,640.0)
			for p in [Vector2(540,565),Vector2(1120,565),Vector2(1730,565),Vector2(2480,565)]: main._spawn_enemy(p,difficulty,0)
			_crystals(main,Vector2(465,530),5,Vector2(55,-14)); _crystals(main,Vector2(760,420),4,Vector2(58,-5)); _crystals(main,Vector2(2280,530),5,Vector2(60,-12))
			main._spawn_pickup("food",Vector2(1880,555)); main._spawn_pickup("chest",Vector2(2700,555)); main._spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		2:
			main._add_platform(Rect2(-100,GROUND_Y,620,120),ground); main._add_platform(Rect2(700,GROUND_Y,680,120),ground); main._add_platform(Rect2(1510,GROUND_Y,640,120),ground); main._add_platform(Rect2(2310,GROUND_Y,990,120),ground)
			_add_slope(main,250,GROUND_Y,260,130,true,accent); _add_slope(main,1650,GROUND_Y,300,135,true,accent); _add_slope(main,1960,GROUND_Y,190,95,false,accent)
			for r in [Rect2(510,485,180,18),Rect2(690,438,180,18),Rect2(900,410,190,18),Rect2(1120,452,170,18),Rect2(1380,485,170,18),Rect2(2190,470,150,18),Rect2(2390,420,165,18),Rect2(2600,380,180,18)]: _add_one_way(main,r,accent)
			_add_boost(main,Vector2(185,606),1,650.0); _add_boost(main,Vector2(1560,606),1,680.0); _add_bounce(main,Vector2(2215,606),700.0)
			for p in [Vector2(760,565),Vector2(1040,565),Vector2(1580,565),Vector2(1910,565),Vector2(2420,565),Vector2(2830,565)]: main._spawn_enemy(p,difficulty+0.10,1)
			_crystals(main,Vector2(560,445),6,Vector2(70,-5)); _crystals(main,Vector2(2200,430),6,Vector2(70,-10))
			main._spawn_pickup("food",Vector2(2460,555)); main._spawn_pickup("chest",Vector2(1260,555)); main._spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		3:
			main._add_platform(Rect2(-100,GROUND_Y,900,120),ground); main._add_platform(Rect2(980,GROUND_Y,690,120),ground); main._add_platform(Rect2(1840,GROUND_Y,620,120),ground); main._add_platform(Rect2(2630,GROUND_Y,670,120),ground)
			for r in [Rect2(420,505,185,18),Rect2(720,430,175,18),Rect2(1040,350,175,18),Rect2(1360,430,180,18),Rect2(1690,355,170,18),Rect2(2010,435,190,18),Rect2(2340,345,180,18),Rect2(2730,430,180,18)]: _add_one_way(main,r,accent)
			for x in [345.0,930.0,1785.0,2555.0]: _add_bounce(main,Vector2(x,606),710.0)
			for p in [Vector2(560,565),Vector2(1150,565),Vector2(1480,565),Vector2(1960,565),Vector2(2230,565),Vector2(2790,565)]: main._spawn_enemy(p,difficulty+0.14,2)
			for pos in [Vector2(470,465),Vector2(770,390),Vector2(1090,310),Vector2(1740,315),Vector2(2390,305),Vector2(2800,390)]: main._spawn_pickup("crystal",pos)
			main._spawn_pickup("food",Vector2(2050,555)); main._spawn_pickup("chest",Vector2(2380,300)); main._spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		4:
			main._add_platform(Rect2(-100,GROUND_Y,560,120),ground); main._add_platform(Rect2(610,GROUND_Y,720,120),ground); main._add_platform(Rect2(1490,GROUND_Y,650,120),ground); main._add_platform(Rect2(2290,GROUND_Y,1010,120),ground)
			_add_slope(main,150,GROUND_Y,260,120,true,accent); _add_slope(main,710,GROUND_Y,300,125,true,accent); _add_slope(main,1020,GROUND_Y,250,105,false,accent); _add_slope(main,1580,GROUND_Y,290,130,true,accent); _add_slope(main,1880,GROUND_Y,220,105,false,accent)
			for r in [Rect2(470,465,150,18),Rect2(1320,430,170,18),Rect2(2110,455,180,18),Rect2(2540,395,175,18),Rect2(2810,350,170,18)]: _add_one_way(main,r,accent)
			_add_boost(main,Vector2(90,606),1,670.0); _add_boost(main,Vector2(1515,606),1,700.0); _add_bounce(main,Vector2(2180,606),710.0)
			for p in [Vector2(660,565),Vector2(930,565),Vector2(1530,565),Vector2(1810,565),Vector2(2340,565),Vector2(2650,565),Vector2(2940,565)]: main._spawn_enemy(p,difficulty+0.22,3)
			_crystals(main,Vector2(210,520),5,Vector2(64,-18)); _crystals(main,Vector2(2490,350),6,Vector2(70,-4))
			main._spawn_pickup("food",Vector2(2440,555)); main._spawn_pickup("chest",Vector2(2880,305)); main._spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
		5:
			main._add_platform(Rect2(-100,GROUND_Y,3300,120),ground)
			_add_slope(main,320,GROUND_Y,320,150,true,accent); _add_one_way(main,Rect2(640,465,210,18),accent); _add_one_way(main,Rect2(900,420,210,18),accent); _add_slope(main,1160,GROUND_Y,300,135,false,accent)
			_add_boost(main,Vector2(130,606),1,700.0); _add_boost(main,Vector2(1500,606),1,720.0)
			for p in [Vector2(720,565),Vector2(1060,565),Vector2(1500,565),Vector2(1880,565)]: main._spawn_enemy(p,difficulty+0.26,3)
			_crystals(main,Vector2(420,520),6,Vector2(70,-18))
			main._spawn_pickup("food",Vector2(1280,555)); main._spawn_pickup("food",Vector2(2020,555)); main._spawn_pickup("chest",Vector2(1040,375))
			main.boss_alive = true
			main._spawn_boss(Vector2(2700,545),0,difficulty+0.36)
