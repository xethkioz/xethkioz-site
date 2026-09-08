extends "res://src/pets/familiar_companion.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
var _visual: Sprite2D
var _bob := 0.0

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(128, 0), Vector2(32, 32))
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)

func _process(delta: float) -> void:
	super._process(delta)
	_bob += delta
	if is_instance_valid(_visual):
		_visual.position.y = -7.0 + sin(_bob * 3.0) * 0.8

func _draw() -> void:
	var glow: float = 0.18 + sin(_pulse * 3.0) * 0.04
	draw_circle(Vector2(0, 4), 10.0, Color(0.55, 0.36, 0.96, glow))
