extends CharacterBody2D

const PROPS := preload("res://assets/production/interiors/mentor_trial_props_v36.svg")

var controller: Node
var target_index := 0
var active := true
var _sprite: Sprite2D
var _flash_left := 0.0

func configure(owner: Node, index_value: int) -> void:
	controller = owner
	target_index = index_value

func _ready() -> void:
	collision_layer = 2
	collision_mask = 0
	var shape_node := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 10.0
	shape_node.shape = shape
	shape_node.position = Vector2(0,-5)
	add_child(shape_node)

	_sprite = Sprite2D.new()
	_sprite.texture = PROPS
	_sprite.region_enabled = true
	_sprite.region_rect = Rect2(Vector2(128,0), Vector2(32,32))
	_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_sprite.position = Vector2(0,-7)
	_sprite.z_index = 2
	add_child(_sprite)

func _process(delta: float) -> void:
	_flash_left = maxf(0.0, _flash_left - delta)
	if is_instance_valid(_sprite):
		_sprite.modulate = Color("e8ffd7") if _flash_left > 0.0 else (Color.WHITE if active else Color(0.42,0.48,0.43,0.58))

func take_damage(_amount: float) -> void:
	if not active:
		return
	_flash_left = 0.16
	if is_instance_valid(controller) and controller.has_method("handle_target_hit"):
		controller.call("handle_target_hit", target_index, self)

func set_target_active(value: bool) -> void:
	active = value
	collision_layer = 2 if active else 0
