extends "res://src/pets/xethkioz_companion.gd"

const SHEET := preload("res://assets/production/characters/xethkioz_sheet.svg")
const FRAME_SIZE := Vector2(24, 24)

var _visual: Sprite2D
var _anim_clock := 0.0
var _anim_frame := 1
var _last_position := Vector2.ZERO
var _visual_facing := Vector2.DOWN

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "XethkiozVisual"
	_visual.texture = SHEET
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(24, 0), FRAME_SIZE)
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -5)
	_visual.z_index = 2
	add_child(_visual)
	_last_position = global_position

func _process(delta: float) -> void:
	var before := global_position
	super._process(delta)
	var movement := global_position - before
	if movement.length_squared() > 0.05:
		_visual_facing = movement.normalized()
		_anim_clock += delta
		if _anim_clock >= 0.14:
			_anim_clock = 0.0
			_anim_frame = (_anim_frame + 1) % 3
	else:
		_anim_frame = 1
		_anim_clock = 0.0
	_update_region()
	_last_position = global_position

func _update_region() -> void:
	if not is_instance_valid(_visual):
		return
	var row := 0
	if absf(_visual_facing.x) > absf(_visual_facing.y):
		row = 1 if _visual_facing.x < 0.0 else 2
	elif _visual_facing.y < 0.0:
		row = 3
	_visual.region_rect = Rect2(Vector2(_anim_frame * 24, row * 24), FRAME_SIZE)

func _draw() -> void:
	var glow := 0.28 + sin(_pulse * 4.0) * 0.08
	draw_circle(Vector2(0, 5), 10.0, Color(0.55, 0.36, 0.96, glow))
