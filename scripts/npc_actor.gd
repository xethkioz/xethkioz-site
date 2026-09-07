extends Node2D

const ALEXIS_TEX = preload("res://assets/v08/generated/alexis.png")
const ASHLEY_TEX = preload("res://assets/v08/generated/ashley.png")

var main_ref: Node
var profile: Dictionary = {}
var dialogue_text := ""
var spoken := false
var trigger_distance := 135.0
var name_label: Label
var visual_sprite: Sprite2D
var idle_time := 0.0

func setup(main_node: Node, character_profile: Dictionary, line: String, trigger: float = 135.0) -> void:
	main_ref = main_node
	profile = character_profile.duplicate(true)
	dialogue_text = line
	trigger_distance = trigger
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = _texture_for_character(str(profile.get("name","NPC")))
	if visual_sprite.texture:
		visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		visual_sprite.scale = Vector2(1.55,1.55)
		visual_sprite.position = Vector2(0,-24)
		visual_sprite.z_index = 5
		add_child(visual_sprite)
	name_label = Label.new()
	name_label.position = Vector2(-64,-88)
	name_label.size = Vector2(128,20)
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.text = str(profile.get("name","NPC"))
	name_label.add_theme_font_size_override("font_size",11)
	name_label.add_theme_color_override("font_color",Color(0.96,0.94,1.0))
	name_label.add_theme_color_override("font_shadow_color",Color(0.02,0.02,0.04,0.95))
	name_label.add_theme_constant_override("shadow_offset_x",1)
	name_label.add_theme_constant_override("shadow_offset_y",1)
	add_child(name_label)
	queue_redraw()

func _texture_for_character(character_name: String) -> Texture2D:
	match character_name:
		"Alexis": return ALEXIS_TEX
		"Ashley": return ASHLEY_TEX
		_: return null

func _process(delta: float) -> void:
	idle_time += delta
	if visual_sprite:
		visual_sprite.position.y = -24.0 + sin(idle_time*2.2)*1.1
	if spoken or main_ref == null:
		return
	var p = get_tree().get_first_node_in_group("player")
	if p and global_position.distance_to(p.global_position) <= trigger_distance:
		spoken = true
		if main_ref.has_method("show_family_dialogue"):
			main_ref.show_family_dialogue(str(profile.get("name","NPC")), dialogue_text, str(profile.get("relationship","NPC")), str(profile.get("gender","No definido")))
		elif main_ref.has_method("_toast"):
			main_ref._toast("%s: %s" % [str(profile.get("name","NPC")),dialogue_text],4.5)

func _draw() -> void:
	# Ashley and Alexis now use real pixel sprites. Other family members keep a
	# compact fallback until their production sprites are generated in later slices.
	if visual_sprite and visual_sprite.texture:
		return
	var primary := Color.from_string(str(profile.get("color","#8b5cf6")),Color(0.55,0.36,0.96))
	var secondary := Color.from_string(str(profile.get("secondary","#ff8c42")),Color(1.0,0.55,0.26))
	draw_circle(Vector2(0,-36),10.0,Color(0.88,0.70,0.54))
	draw_polygon(PackedVector2Array([Vector2(-11,-27),Vector2(11,-27),Vector2(15,8),Vector2(-15,8)]),PackedColorArray([primary]))
	draw_line(Vector2(-12,-18),Vector2(12,-18),secondary,4.0)
