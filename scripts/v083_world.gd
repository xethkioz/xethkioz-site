extends RefCounted

const GROUND_Y := 620.0
const LEVEL_WIDTH := 3200.0

static func _add_one_way(main: Node,rect: Rect2,color: Color) -> void:
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
	main.world.add_child(body)

static func _add_slope(main: Node,x: float,y: float,width: float,height: float,up_right: bool,color: Color) -> void:
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
	main.world.add_child(body)

static func _add_boost(main: Node,pos: Vector2,direction: int = 1,speed_value: float = 610.0) -> void:
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
			if main.has_method("_spawn_combat_fx"):
				main._spawn_combat_fx("arrow",body.global_position,Color(0.30,0.92,1.0),90.0,0.20,direction,0.8)
	)
	main.world.add_child(area)

static func _add_bounce(main: Node,pos: Vector2,power: float = 690.0) -> void:
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
			if main.has_method("_spawn_combat_fx"):
				main._spawn_combat_fx("burst",body.global_position,Color(0.78,0.40,1.0),72.0,0.25,1,1.0)
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
