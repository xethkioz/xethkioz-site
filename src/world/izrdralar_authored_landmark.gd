class_name IzrdralarAuthoredLandmark
extends Node2D

const LANDMARKS := preload("res://assets/production/izrdralar/landmarks.svg")
const FRAME_SIZE := Vector2(96, 80)

var landmark_id := "landmark"
var frame := 0
var visual_scale := 1.0
var collision_size := Vector2.ZERO
var collision_offset := Vector2.ZERO
var _sprite: Sprite2D

func configure(data: Dictionary) -> void:
	landmark_id = str(data.get("id", landmark_id))
	frame = clampi(int(data.get("frame", frame)), 0, 3)
	visual_scale = maxf(0.5, float(data.get("scale", visual_scale)))
	collision_size = _vector_from_array(data.get("collision_size", []))
	collision_offset = _vector_from_array(data.get("collision_offset", [0, 0]))
	if is_inside_tree():
		_build_visual()

func _ready() -> void:
	add_to_group("izrdralar_authored_landmark")
	_build_visual()

func _build_visual() -> void:
	if is_instance_valid(_sprite):
		_sprite.queue_free()
	for child in get_children():
		if child is StaticBody2D:
			child.queue_free()

	_sprite = Sprite2D.new()
	_sprite.name = "Visual"
	var atlas := AtlasTexture.new()
	atlas.atlas = LANDMARKS
	atlas.region = Rect2(Vector2(frame * int(FRAME_SIZE.x), 0), FRAME_SIZE)
	_sprite.texture = atlas
	_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_sprite.scale = Vector2.ONE * visual_scale
	_sprite.position = Vector2(0, -8.0 * visual_scale)
	_sprite.z_index = -3
	add_child(_sprite)

	if collision_size.x > 0.0 and collision_size.y > 0.0:
		var body := StaticBody2D.new()
		body.name = "Collision"
		body.collision_layer = 4
		body.collision_mask = 0
		body.position = collision_offset
		var collision := CollisionShape2D.new()
		var shape := RectangleShape2D.new()
		shape.size = collision_size
		collision.shape = shape
		body.add_child(collision)
		add_child(body)

func _vector_from_array(value: Variant) -> Vector2:
	if value is Array and value.size() >= 2:
		return Vector2(float(value[0]), float(value[1]))
	return Vector2.ZERO
