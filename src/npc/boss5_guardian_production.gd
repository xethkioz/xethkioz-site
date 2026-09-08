extends "res://src/npc/boss5_guardian.gd"

const SPRITE := preload("res://assets/production/characters/boss5_guardian.svg")
var _visual: Sprite2D

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = SPRITE
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -16)
	_visual.z_index = 3
	add_child(_visual)

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	if is_instance_valid(_visual):
		_visual.modulate = Color.WHITE if core_exposed or phase < 3 else Color(0.48, 0.45, 0.54)

func _draw() -> void:
	var ratio: float = health / max_health if max_health > 0.0 else 0.0
	if phase >= 2:
		draw_arc(Vector2(0, 2), 74.0, 0.0, TAU, 40, Color(0.55, 0.36, 0.96, 0.24), 2.0)
	if phase == 3:
		draw_arc(Vector2(0, -9), 30.0, 0.0, TAU, 28, Color("d8ceff") if core_exposed else Color("493e50"), 3.0)
	draw_rect(Rect2(-38, -55, 76, 5), Color("1b1820"))
	draw_rect(Rect2(-38, -55, 76.0 * ratio, 5), Color("ff8c42"))
