extends "res://src/pets/capturable_creature.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
var _visual: Sprite2D
var _bob := 0.0

func _ready() -> void:
	super._ready()
	if is_queued_for_deletion():
		return
	_visual = Sprite2D.new()
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(128, 0), Vector2(32, 32))
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)

func _process(delta: float) -> void:
	_bob += delta
	if is_instance_valid(_visual):
		_visual.position.y = -7.0 + sin(_bob * 2.4) * 1.0

func _draw() -> void:
	pass
