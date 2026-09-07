extends Area2D

var main_ref: Node
var kind := "crystal"
var payload: Dictionary = {}
var shape_node: CollisionShape2D

func _ready() -> void:
	collision_layer = 8
	collision_mask = 1
	monitoring = true
	shape_node = CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(24,30)
	shape_node.shape = rs
	add_child(shape_node)
	body_entered.connect(_on_body_entered)

func setup(main_node: Node, pickup_kind: String, data: Dictionary = {}) -> void:
	main_ref = main_node
	kind = pickup_kind
	payload = data
	if kind == "exit" and shape_node:
		var rs := RectangleShape2D.new(); rs.size = Vector2(30,50); shape_node.shape = rs
	queue_redraw()

func _process(_delta: float) -> void:
	if kind in ["crystal","food","pet"]:
		position.y += sin(Time.get_ticks_msec()*0.004 + position.x*0.01) * 0.03

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player") and main_ref:
		main_ref.pickup_collected(self,kind,payload)

func _draw() -> void:
	match kind:
		"food":
			draw_circle(Vector2.ZERO,8.0,Color(0.90,0.25,0.29)); draw_rect(Rect2(1,-12,2,6),Color(0.30,0.65,0.28))
		"chest":
			draw_rect(Rect2(-11,-7,22,16),Color(0.58,0.34,0.15)); draw_rect(Rect2(-10,-11,20,6),Color(0.78,0.51,0.22)); draw_rect(Rect2(-2,-3,4,7),Color(1.0,0.78,0.20))
		"pet":
			draw_circle(Vector2.ZERO,10.0,Color(0.93,0.94,0.98)); draw_circle(Vector2(-3,-2),3.0,Color(0.65,0.34,0.94)); draw_circle(Vector2(4,4),2.5,Color(1.0,0.42,0.12))
		"exit":
			draw_rect(Rect2(-14,-24,28,48),Color(0.25,0.16,0.38)); draw_rect(Rect2(-9,-19,18,38),Color(0.07,0.04,0.12)); draw_rect(Rect2(-2,-12,4,25),Color(1.0,0.42,0.10))
		_:
			draw_polygon(PackedVector2Array([Vector2(0,-10),Vector2(8,-2),Vector2(5,10),Vector2(-5,10),Vector2(-8,-2)]),PackedColorArray([Color(0.65,0.35,1.0)]))
