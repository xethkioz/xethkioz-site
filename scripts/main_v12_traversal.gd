extends "res://scripts/main_v12.gd"

# Shared traversal builders restored after the v0.8.3 modularization.
# They are inherited by the Steam-demo layers.

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
	)
	world.add_child(area)

func _crystal_line(start: Vector2,count: int,step: Vector2) -> void:
	for i in range(count):
		_spawn_pickup("crystal",start+step*float(i))
