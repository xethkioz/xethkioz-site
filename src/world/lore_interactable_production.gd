extends "res://src/world/lore_interactable.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
var _visual: Sprite2D
var _pulse := 0.0

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(96, 0), Vector2(32, 32))
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)

func _process(delta: float) -> void:
	_pulse += delta
	if is_instance_valid(_visual):
		_visual.modulate = accent_color.darkened(0.35) if GameState.has_lore(lore_id) else accent_color.lerp(Color.WHITE, 0.25 + sin(_pulse * 2.6) * 0.08)

func _draw() -> void:
	if GameState.has_lore(lore_id):
		return
	draw_arc(Vector2(0, -6), 13.0, 0.0, TAU, 20, Color(accent_color.r, accent_color.g, accent_color.b, 0.32), 1.0)
