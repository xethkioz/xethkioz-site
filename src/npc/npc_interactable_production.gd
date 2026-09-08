extends "res://src/npc/npc_interactable.gd"

const ATLAS := preload("res://assets/production/characters/npc_atlas.svg")
const FRAME_SIZE := Vector2(32, 32)

var _visual: Sprite2D
var _nameplate: Label
var _atlas_index := 0

func configure_production(id_value: String, name_value: String, lines: Array[String], index: int, rules: Array = []) -> void:
	configure(id_value, name_value, lines, Color.WHITE, rules)
	_atlas_index = clampi(index, 0, 9)
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "NpcVisual"
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)
	_nameplate = Label.new()
	_nameplate.position = Vector2(-42, -38)
	_nameplate.size = Vector2(84, 14)
	_nameplate.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_nameplate.add_theme_font_size_override("font_size", 8)
	_nameplate.add_theme_color_override("font_color", Color("f0f0f5"))
	_nameplate.add_theme_color_override("font_outline_color", Color("071019"))
	_nameplate.add_theme_constant_override("outline_size", 3)
	_nameplate.z_index = 4
	add_child(_nameplate)
	_refresh_visual()

func _refresh_visual() -> void:
	if is_instance_valid(_visual):
		_visual.region_rect = Rect2(Vector2(_atlas_index * 32, 0), FRAME_SIZE)
	if is_instance_valid(_nameplate):
		_nameplate.text = display_name

func _draw() -> void:
	pass
