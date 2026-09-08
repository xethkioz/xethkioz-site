extends Node2D

const Factory := preload("res://src/world/production_tileset_factory.gd")
const LARGE_PROPS := preload("res://assets/production/izrdralar/large_props.svg")
const LANDMARKS := preload("res://assets/production/izrdralar/landmarks.svg")
const CUENCA_SETPIECES := preload("res://assets/production/izrdralar/cuenca_setpieces.svg")

const TILE := 16
const ORIGIN := Vector2(512, 1536) # chunk 1,3
const LARGE_FRAME := Vector2(48, 48)
const LANDMARK_FRAME := Vector2(96, 80)
const CUENCA_FRAME := Vector2(128, 96)

var _ground: TileMapLayer
var _detail: TileMapLayer
var _props: Node2D
var _blockers: Node2D
var _shimmer: Array[Sprite2D] = []
var _time := 0.0

func _ready() -> void:
	position = ORIGIN
	z_index = -9
	_build_layers()
	_paint_awakening_basin()
	_paint_main_route()
	_paint_refuge_spur()
	_paint_bridge_approach()
	_paint_aldea_plaza()
	_paint_optional_wetland()
	_place_authored_foliage()
	_place_signature_setpieces()
	_place_refuge_and_aldea()
	_place_ruin_language()
	_place_micro_details()

func _process(delta: float) -> void:
	_time += delta
	for i in range(_shimmer.size()):
		var sprite := _shimmer[i]
		if not is_instance_valid(sprite):
			continue
		var alpha := 0.88 + sin(_time * 2.15 + float(i) * 0.7) * 0.08
		sprite.modulate = Color(1.0, 1.0, 1.0, alpha)

func _build_layers() -> void:
	_ground = TileMapLayer.new()
	_ground.name = "GoldenSouthGroundAuthored"
	_ground.tile_set = Factory.build()
	_ground.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_ground.z_index = 0
	add_child(_ground)

	_detail = TileMapLayer.new()
	_detail.name = "GoldenSouthDetailAuthored"
	_detail.tile_set = _ground.tile_set
	_detail.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_detail.z_index = 1
	add_child(_detail)

	_props = Node2D.new()
	_props.name = "GoldenSouthPropsAuthored"
	_props.z_index = 5
	add_child(_props)

	_blockers = Node2D.new()
	_blockers.name = "GoldenSouthBlockersAuthored"
	_blockers.z_index = 6
	add_child(_blockers)

func _paint_awakening_basin() -> void:
	var center := Vector2(16, 14)
	for y in range(4, 25):
		for x in range(5, 28):
			var p := Vector2(x, y)
			var dx := (p.x - center.x) / 7.6
			var dy := (p.y - center.y) / 5.6
			var d := sqrt(dx * dx + dy * dy)
			var cell := Vector2i(x, y)
			if d <= 0.62:
				_ground.set_cell(cell, 0, Factory.DIRT)
			elif d <= 0.92:
				_ground.set_cell(cell, 0, Factory.PATH)
			elif d <= 1.12 and (x + y) % 3 != 0:
				_ground.set_cell(cell, 0, Factory.DARK_GRASS)

	for cell in [Vector2i(12,11), Vector2i(14,9), Vector2i(19,9), Vector2i(21,12), Vector2i(11,17), Vector2i(21,18)]:
		_detail.set_cell(cell, 0, Factory.FLOWERS)

func _paint_main_route() -> void:
	# Cuenca -> puente temporal -> Alexis/Ivan -> corazón de Aldea.
	var route := [
		Vector2(16,14), Vector2(20,14), Vector2(24,14), Vector2(28,14),
		Vector2(31,14), Vector2(34,13), Vector2(38,12), Vector2(42,12),
		Vector2(46,12), Vector2(51,13), Vector2(56,14), Vector2(61,14)
	]
	_paint_path_polyline(route, 2.0)

	# Bordes irregulares: la ruta se siente caminada, no dibujada con regla.
	for cell in [Vector2i(23,12), Vector2i(26,16), Vector2i(35,15), Vector2i(41,10), Vector2i(49,15), Vector2i(54,11), Vector2i(59,16)]:
		_ground.set_cell(cell, 0, Factory.DIRT)

func _paint_refuge_spur() -> void:
	var route := [Vector2(17,12), Vector2(18,10), Vector2(19,8), Vector2(20,7)]
	_paint_path_polyline(route, 1.55)
	_paint_ellipse(Vector2(20,8), Vector2(5.2,3.5), Factory.PATH)

func _paint_bridge_approach() -> void:
	# El puente está en x=448 local. Este corredor deja a ????? visible sin encerrarlo.
	_paint_ellipse(Vector2(27.5,14), Vector2(4.6,3.3), Factory.PATH)
	for cell in [Vector2i(25,10), Vector2i(26,10), Vector2i(29,10), Vector2i(30,10)]:
		_detail.set_cell(cell, 0, Factory.ROCK)
	for cell in [Vector2i(26,18), Vector2i(29,18)]:
		_detail.set_cell(cell, 0, Factory.CRYSTAL)

func _paint_aldea_plaza() -> void:
	# Chunk 2,3 comienza en x=32 tiles dentro de este layout.
	_paint_ellipse(Vector2(46,13), Vector2(10.0,5.8), Factory.PATH)
	_paint_ellipse(Vector2(47,13), Vector2(5.0,3.0), Factory.DIRT)
	# Base tecnológica reaprovechada en el centro cívico.
	for y in range(11, 15):
		for x in range(45, 50):
			if (x + y) % 4 != 0:
				_ground.set_cell(Vector2i(x, y), 0, Factory.RUIN_FLOOR)

	var east_exit := [Vector2(51,13), Vector2(55,13), Vector2(59,14), Vector2(63,15)]
	_paint_path_polyline(east_exit, 1.7)

func _paint_optional_wetland() -> void:
	# Desvío opcional al sudoeste del despertar: corto, visual y con recolección.
	var center := Vector2(6.5, 22.0)
	for y in range(18, 27):
		for x in range(2, 12):
			var dx := (float(x) - center.x) / 5.2
			var dy := (float(y) - center.y) / 3.4
			var d := sqrt(dx * dx + dy * dy)
			if d <= 0.72:
				_ground.set_cell(Vector2i(x,y), 0, Factory.MUD)
			elif d <= 0.96 and (x + y) % 2 == 0:
				_ground.set_cell(Vector2i(x,y), 0, Factory.DARK_GRASS)
	for cell in [Vector2i(5,21), Vector2i(7,22), Vector2i(9,23)]:
		_detail.set_cell(cell, 0, Factory.WATER_FOAM)

func _place_authored_foliage() -> void:
	# Masas deliberadas: bordes densos, centro legible y corredores visuales.
	var native_trees := [
		Vector2(48,72), Vector2(94,62), Vector2(146,72), Vector2(202,58),
		Vector2(36,150), Vector2(52,222), Vector2(44,302), Vector2(86,382),
		Vector2(132,430), Vector2(184,448), Vector2(244,454), Vector2(302,442),
		Vector2(366,454), Vector2(430,438), Vector2(478,406),
		Vector2(542,62), Vector2(592,76), Vector2(646,58),
		Vector2(558,420), Vector2(616,446), Vector2(690,438), Vector2(758,452),
		Vector2(832,440), Vector2(910,454), Vector2(982,430)
	]
	for p in native_trees:
		_add_large_prop(0, p, true)

	var ceibos := [
		Vector2(104,142), Vector2(178,102), Vector2(94,330), Vector2(390,82),
		Vector2(520,146), Vector2(608,124), Vector2(720,78), Vector2(866,88),
		Vector2(952,160), Vector2(894,350), Vector2(674,356)
	]
	for p in ceibos:
		_add_large_prop(1, p, true)

	var reeds := [Vector2(82,352), Vector2(112,372), Vector2(148,392)]
	for p in reeds:
		_add_large_prop(5, p, false)

func _place_signature_setpieces() -> void:
	_add_cuenca_setpiece(0, Vector2(256,154), false)
	_add_cuenca_setpiece(1, Vector2(256,236), true)
	_add_cuenca_setpiece(2, Vector2(126,210), true)
	_add_blocker(Vector2(126,218), Vector2(34,22))

func _place_refuge_and_aldea() -> void:
	# Refugio visible desde el principio pero sellado por progreso narrativo.
	_add_landmark(0, Vector2(320,128))
	_add_rect_blocker(Rect2(274,92,92,44))
	_add_rect_blocker(Rect2(274,136,31,24))
	_add_rect_blocker(Rect2(335,136,31,24))

	# Aldea del Alba: tres siluetas habitables crean una plaza reconocible.
	_add_landmark(1, Vector2(650,112))
	_add_landmark(1, Vector2(810,104))
	_add_landmark(1, Vector2(930,244))
	_add_rect_blocker(Rect2(606,78,88,52))
	_add_rect_blocker(Rect2(766,70,88,52))
	_add_rect_blocker(Rect2(886,210,88,52))

func _place_ruin_language() -> void:
	# El mundo 2150 ya aparece en Cuenca, pero sin convertirla en una ciudad de ruinas.
	for p in [Vector2(438,126), Vector2(468,286), Vector2(572,264), Vector2(736,250)]:
		_add_large_prop(3, p, true)
	for p in [Vector2(402,304), Vector2(520,318), Vector2(704,296), Vector2(858,310)]:
		_add_large_prop(4, p, true)
	for p in [Vector2(458,172), Vector2(596,286), Vector2(846,174)]:
		_add_large_prop(2, p, true)

func _place_micro_details() -> void:
	var shrubs := [
		Vector2i(8,8), Vector2i(10,7), Vector2i(7,14), Vector2i(10,20),
		Vector2i(23,7), Vector2i(24,9), Vector2i(25,20), Vector2i(30,21),
		Vector2i(35,8), Vector2i(38,18), Vector2i(43,18), Vector2i(51,7),
		Vector2i(55,19), Vector2i(60,9), Vector2i(61,21)
	]
	for cell in shrubs:
		_detail.set_cell(cell, 0, Factory.SHRUB)
	var flowers := [Vector2i(11,9), Vector2i(13,20), Vector2i(22,10), Vector2i(36,17), Vector2i(44,8), Vector2i(52,18), Vector2i(58,10)]
	for cell in flowers:
		_detail.set_cell(cell, 0, Factory.FLOWERS)

func _paint_path_polyline(points: Array, radius: float) -> void:
	if points.size() < 2:
		return
	for i in range(points.size() - 1):
		var a: Vector2 = points[i]
		var b: Vector2 = points[i + 1]
		var distance := a.distance_to(b)
		var steps := maxi(1, ceili(distance * 2.0))
		for step in range(steps + 1):
			var t := float(step) / float(steps)
			_paint_disc(a.lerp(b, t), radius, Factory.PATH)

func _paint_disc(center: Vector2, radius: float, tile: Vector2i) -> void:
	var min_x := floori(center.x - radius)
	var max_x := ceili(center.x + radius)
	var min_y := floori(center.y - radius)
	var max_y := ceili(center.y + radius)
	for y in range(min_y, max_y + 1):
		for x in range(min_x, max_x + 1):
			if Vector2(x,y).distance_to(center) <= radius:
				_ground.set_cell(Vector2i(x,y), 0, tile)

func _paint_ellipse(center: Vector2, radii: Vector2, tile: Vector2i) -> void:
	var min_x := floori(center.x - radii.x)
	var max_x := ceili(center.x + radii.x)
	var min_y := floori(center.y - radii.y)
	var max_y := ceili(center.y + radii.y)
	for y in range(min_y, max_y + 1):
		for x in range(min_x, max_x + 1):
			var dx := (float(x) - center.x) / maxf(0.01, radii.x)
			var dy := (float(y) - center.y) / maxf(0.01, radii.y)
			if dx * dx + dy * dy <= 1.0:
				_ground.set_cell(Vector2i(x,y), 0, tile)

func _add_large_prop(frame: int, pos: Vector2, collidable: bool) -> Sprite2D:
	var atlas := AtlasTexture.new()
	atlas.atlas = LARGE_PROPS
	atlas.region = Rect2(Vector2(frame * 48, 0), LARGE_FRAME)
	var sprite := Sprite2D.new()
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = pos
	_props.add_child(sprite)
	if collidable:
		var size := Vector2(16,10)
		if frame == 4:
			size = Vector2(24,12)
		elif frame in [2,3]:
			size = Vector2(18,14)
		_add_blocker(pos + Vector2(0,12), size)
	return sprite

func _add_landmark(frame: int, pos: Vector2) -> Sprite2D:
	var atlas := AtlasTexture.new()
	atlas.atlas = LANDMARKS
	atlas.region = Rect2(Vector2(frame * 96, 0), LANDMARK_FRAME)
	var sprite := Sprite2D.new()
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = pos
	_props.add_child(sprite)
	return sprite

func _add_cuenca_setpiece(frame: int, pos: Vector2, shimmer: bool) -> Sprite2D:
	var atlas := AtlasTexture.new()
	atlas.atlas = CUENCA_SETPIECES
	atlas.region = Rect2(Vector2(frame * 128, 0), CUENCA_FRAME)
	var sprite := Sprite2D.new()
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = pos
	_props.add_child(sprite)
	if shimmer:
		_shimmer.append(sprite)
	return sprite

func _add_blocker(pos: Vector2, size: Vector2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = pos
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = size
	collision.shape = shape
	body.add_child(collision)
	_blockers.add_child(body)

func _add_rect_blocker(rect: Rect2) -> void:
	_add_blocker(rect.position + rect.size * 0.5, rect.size)
