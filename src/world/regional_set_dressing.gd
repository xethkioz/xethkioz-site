extends Node2D

const ACCENTS := preload("res://assets/production/izrdralar/regional_accents.svg")
const FRAME_SIZE := Vector2(64, 64)
const CHUNK_PIXELS := 512

var _shimmer: Array[Sprite2D] = []
var _time := 0.0

func _ready() -> void:
	z_index = -4
	_build_cuenca()
	_build_lake()
	_build_route_markers()

func _process(delta: float) -> void:
	_time += delta
	for index in range(_shimmer.size()):
		var sprite := _shimmer[index]
		if not is_instance_valid(sprite):
			continue
		var pulse := 0.82 + sin(_time * 2.2 + float(index) * 0.9) * 0.12
		sprite.modulate = Color(1.0, 1.0, 1.0, pulse)

func _build_cuenca() -> void:
	_add_accent(0, _world_pos(1, 3, 188, 242), true)
	_add_accent(1, _world_pos(1, 3, 256, 70), false)
	_add_accent(4, _world_pos(1, 3, 430, 252), true)
	_add_accent(5, _world_pos(1, 3, 92, 356), true)

func _build_lake() -> void:
	_add_accent(2, _world_pos(1, 1, 238, 316), false)
	_add_accent(3, _world_pos(1, 1, 116, 206), true)
	_add_accent(4, _world_pos(1, 1, 124, 350), false)
	_add_accent(5, _world_pos(1, 1, 448, 356), true)

func _build_route_markers() -> void:
	_add_accent(4, _world_pos(1, 2, 256, 420), false)
	_add_accent(4, _world_pos(2, 2, 90, 256), false)
	_add_accent(4, _world_pos(3, 2, 84, 256), false)

func _add_accent(frame: int, world_pos: Vector2, shimmer := false) -> Sprite2D:
	var atlas := AtlasTexture.new()
	atlas.atlas = ACCENTS
	atlas.region = Rect2(Vector2(frame * int(FRAME_SIZE.x), 0), FRAME_SIZE)
	var sprite := Sprite2D.new()
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = world_pos
	sprite.centered = true
	add_child(sprite)
	if shimmer:
		_shimmer.append(sprite)
	return sprite

func _world_pos(chunk_x: int, chunk_y: int, local_x: int, local_y: int) -> Vector2:
	return Vector2(chunk_x * CHUNK_PIXELS + local_x, chunk_y * CHUNK_PIXELS + local_y)
