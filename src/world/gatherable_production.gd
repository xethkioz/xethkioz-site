extends "res://src/world/gatherable.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
var _visual: Sprite2D
var _atlas_index := 0

func configure_production(id_value: String, amount_value: int, profession_value: String, xp_value: int, atlas_index: int) -> void:
	_atlas_index = clampi(atlas_index, 0, 3)
	configure(id_value, amount_value, profession_value, xp_value, Color.WHITE)
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.region_rect = Rect2(Vector2(_atlas_index * 32, 0), Vector2(32, 32))
	_visual.position = Vector2(0, -7)
	_visual.z_index = 1
	add_child(_visual)

func _refresh_visual() -> void:
	if is_instance_valid(_visual):
		_visual.region_rect = Rect2(Vector2(_atlas_index * 32, 0), Vector2(32, 32))

func _draw() -> void:
	pass
