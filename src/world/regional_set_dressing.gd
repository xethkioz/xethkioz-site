extends Node2D

const ACCENTS := preload("res://assets/production/izrdralar/regional_accents.svg")
const CUENCA_SETPIECES := preload("res://assets/production/izrdralar/cuenca_setpieces.svg")
const FRAME_SIZE := Vector2(64, 64)
const CUENCA_FRAME_SIZE := Vector2(128, 96)
const CHUNK_PIXELS := 512

var _shimmer: Array[Sprite2D] = []
var _time := 0.0

func _ready() -> void:
	z_index = -4
	_build_cuenca()
	_build_lake()
	_build_route_markers()
	_build_ruins_and_sanctuary()
	_build_boss_arena()

func _process(delta: float) -> void:
	_time += delta
	for index in range(_shimmer.size()):
		var sprite := _shimmer[index]
		if not is_instance_valid(sprite):
			continue
		var pulse := 0.82 + sin(_time * 2.2 + float(index) * 0.9) * 0.12
		sprite.modulate = Color(1.0, 1.0, 1.0, pulse)

func _build_cuenca() -> void:
	# Signature first-minute composition: awakening crater framed by native roots,
	# recovered future hardware and restrained prism light.
	_add_cuenca_setpiece(0, _world_pos(1, 3, 256, 154), false)
	_add_cuenca_setpiece(1, _world_pos(1, 3, 256, 235), true)
	_add_cuenca_setpiece(2, _world_pos(1, 3, 122, 205), true)
	_add_accent(0, _world_pos(1, 3, 188, 286), true)
	_add_accent(1, _world_pos(1, 3, 392, 112), false)
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

func _build_ruins_and_sanctuary() -> void:
	_add_accent(5, _world_pos(3, 1, 116, 122), true)
	_add_accent(5, _world_pos(3, 1, 390, 370), true)
	_add_accent(0, _world_pos(3, 1, 352, 132), true)
	_add_accent(4, _world_pos(3, 1, 84, 256), false)
	_add_accent(1, _world_pos(3, 2, 256, 88), false)
	_add_accent(0, _world_pos(3, 2, 126, 150), true)
	_add_accent(0, _world_pos(3, 2, 386, 150), true)

func _build_boss_arena() -> void:
	_add_accent(1, _world_pos(4, 0, 126, 196), false)
	_add_accent(1, _world_pos(4, 0, 386, 196), false)
	_add_accent(0, _world_pos(4, 0, 170, 360), true)
	_add_accent(0, _world_pos(4, 0, 342, 360), true)
	_add_accent(5, _world_pos(4, 0, 112, 92), true)
	_add_accent(5, _world_pos(4, 0, 400, 92), true)

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

func _add_cuenca_setpiece(frame: int, world_pos: Vector2, shimmer := false) -> Sprite2D:
	var atlas := AtlasTexture.new()
	atlas.atlas = CUENCA_SETPIECES
	atlas.region = Rect2(Vector2(frame * int(CUENCA_FRAME_SIZE.x), 0), CUENCA_FRAME_SIZE)
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
