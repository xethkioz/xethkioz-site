extends Node2D

const Factory := preload("res://src/world/production_tileset_factory.gd")
const TILE_SIZE := 16
const CHUNK_PIXELS := 512
const CUENCA_CHUNK := Vector2i(1, 3)

var _ground: TileMapLayer
var _detail: TileMapLayer

func _ready() -> void:
	position = Vector2(CUENCA_CHUNK.x * CHUNK_PIXELS, CUENCA_CHUNK.y * CHUNK_PIXELS)
	z_index = -9
	_ground = TileMapLayer.new()
	_ground.name = "CuencaGroundOverlay"
	_ground.tile_set = Factory.build()
	_ground.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	add_child(_ground)
	_detail = TileMapLayer.new()
	_detail.name = "CuencaPrismMarks"
	_detail.tile_set = _ground.tile_set
	_detail.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_detail.z_index = 1
	add_child(_detail)
	_stamp_awakening_bowl()
	_stamp_refuge_walk()
	_stamp_prism_scars()

func _stamp_awakening_bowl() -> void:
	var center := Vector2(16, 14)
	for y in range(5, 24):
		for x in range(7, 26):
			var cell := Vector2i(x, y)
			var distance: float = Vector2(x, y).distance_to(center)
			if distance <= 4.8:
				_ground.set_cell(cell, 0, Factory.DIRT)
			elif distance <= 6.2:
				_ground.set_cell(cell, 0, Factory.PATH)
			elif distance <= 8.0 and (x * 3 + y * 5) % 4 == 0:
				_ground.set_cell(cell, 0, Factory.DARK_GRASS)
	for cell in [Vector2i(14,13), Vector2i(18,13), Vector2i(13,16), Vector2i(19,16), Vector2i(16,18)]:
		_detail.set_cell(cell, 0, Factory.FLOWERS)

func _stamp_refuge_walk() -> void:
	# Irregular diagonal connection from the awakening bowl to Elida's refuge.
	var cells := [
		Vector2i(17,12), Vector2i(18,11), Vector2i(18,10), Vector2i(19,10),
		Vector2i(19,9), Vector2i(20,9), Vector2i(20,8)
	]
	for cell in cells:
		_ground.set_cell(cell, 0, Factory.PATH)
		for offset in [Vector2i(-1,0), Vector2i(1,0)]:
			if (cell.x + cell.y + offset.x) % 2 == 0:
				_ground.set_cell(cell + offset, 0, Factory.PATH)

func _stamp_prism_scars() -> void:
	# Broken resonance lines: visible clues rather than a glowing generic magic circle.
	var scars := [
		Vector2i(16,14), Vector2i(15,14), Vector2i(14,13), Vector2i(13,12),
		Vector2i(17,15), Vector2i(18,16), Vector2i(19,17),
		Vector2i(16,15), Vector2i(16,16), Vector2i(15,17)
	]
	for index in range(scars.size()):
		var cell: Vector2i = scars[index]
		if index % 3 == 0:
			_detail.set_cell(cell, 0, Factory.CRYSTAL)
		else:
			_detail.set_cell(cell, 0, Factory.ROCK)
