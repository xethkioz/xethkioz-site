extends Area2D

const TEX_CRYSTAL: Texture2D = preload("res://assets/v08/generated/crystal.png")
const TEX_FOOD: Texture2D = preload("res://assets/v08/generated/food.png")
const TEX_CHEST: Texture2D = preload("res://assets/v08/generated/chest.png")
const TEX_EXIT: Texture2D = preload("res://assets/v08/generated/exit.png")

var main_ref: Node
var kind := "crystal"
var payload: Dictionary = {}
var shape_node: CollisionShape2D
var visual_sprite: Sprite2D
var base_y := 0.0
var bob_time := 0.0

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
	base_y = position.y
	if kind == "exit" and shape_node:
		var rs := RectangleShape2D.new()
		rs.size = Vector2(34,54)
		shape_node.shape = rs
	_setup_visual()
	queue_redraw()

func _setup_visual() -> void:
	var texture: Texture2D = null
	match kind:
		"crystal": texture = TEX_CRYSTAL
		"food": texture = TEX_FOOD
		"chest": texture = TEX_CHEST
		"exit": texture = TEX_EXIT
	if texture == null:
		return
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = texture
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.15,1.15) if kind != "exit" else Vector2(1.0,1.0)
	visual_sprite.z_index = 5
	add_child(visual_sprite)

func _process(delta: float) -> void:
	bob_time += delta
	if visual_sprite and kind in ["crystal","food"]:
		visual_sprite.position.y = sin(bob_time*3.1 + global_position.x*0.01) * 3.0
		visual_sprite.rotation = sin(bob_time*1.7 + global_position.x*0.005) * 0.035
	elif visual_sprite and kind == "chest":
		visual_sprite.position.y = sin(bob_time*1.6)*0.7

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player") and main_ref:
		main_ref.pickup_collected(self,kind,payload)

func _draw() -> void:
	if visual_sprite:
		return
	match kind:
		"pet":
			draw_circle(Vector2.ZERO,10.0,Color(0.93,0.94,0.98))
			draw_circle(Vector2(-3,-2),3.0,Color(0.65,0.34,0.94))
			draw_circle(Vector2(4,4),2.5,Color(1.0,0.42,0.12))
		"nigzen_portal":
			draw_rect(Rect2(-16,-26,32,52),Color(0.18,0.08,0.28))
			draw_rect(Rect2(-11,-21,22,42),Color(0.03,0.01,0.06))
			draw_arc(Vector2.ZERO,13.0,0.0,TAU,24,Color(0.74,0.39,1.0),2.0)
		"legendary_weapon":
			draw_line(Vector2(-13,10),Vector2(12,-11),Color(0.82,0.78,1.0),4.0)
			draw_line(Vector2(-9,14),Vector2(-1,6),Color(1.0,0.56,0.24),3.0)
		_:
			draw_polygon(PackedVector2Array([Vector2(0,-10),Vector2(8,-2),Vector2(5,10),Vector2(-5,10),Vector2(-8,-2)]),PackedColorArray([Color(0.65,0.35,1.0)]))
