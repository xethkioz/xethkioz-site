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
var snap_attempts := 8
var snapped_to_floor := false

func setup(main_node: Node, character_profile: Dictionary, line: String, trigger: float = 135.0) -> void:
	main_ref = main_node
	profile = character_profile.duplicate(true)
	dialogue_text = line
	trigger_distance = trigger
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = _texture_for_character(str(profile.get("name","NPC")))
	if visual_sprite.texture:
		visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		visual_sprite.scale = Vector2(1.42,1.42)
		visual_sprite.position = Vector2(0,-27)
		visual_sprite.z_index = 8
		add_child(visual_sprite)
	name_label = Label.new()
	name_label.position = Vector2(-70,-94)
	name_label.size = Vector2(140,20)
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.text = str(profile.get("name","NPC"))
	name_label.add_theme_font_size_override("font_size",10)
	name_label.add_theme_color_override("font_color",Color(0.96,0.94,1.0))
	name_label.add_theme_color_override("font_shadow_color",Color(0.02,0.02,0.04,0.95))
	name_label.add_theme_constant_override("shadow_offset_x",1)
	name_label.add_theme_constant_override("shadow_offset_y",1)
	add_child(name_label)
	queue_redraw()
	call_deferred("_snap_to_floor")

func _texture_for_character(character_name: String) -> Texture2D:
	match character_name:
		"Alexis": return ALEXIS_TEX
		"Ashley": return ASHLEY_TEX
		_: return null

func _snap_to_floor() -> void:
	if not is_inside_tree() or snapped_to_floor:
		return
	var space := get_world_2d().direct_space_state
	var query := PhysicsRayQueryParameters2D.create(global_position+Vector2(0,-180),global_position+Vector2(0,300),2)
	query.collide_with_areas = false
	query.collide_with_bodies = true
	var result := space.intersect_ray(query)
	if not result.is_empty():
		global_position.y = float(result["position"].y)
		snapped_to_floor = true

func _process(delta: float) -> void:
	idle_time += delta
	if not snapped_to_floor and snap_attempts > 0:
		snap_attempts -= 1
		_snap_to_floor()
	if visual_sprite:
		visual_sprite.position.y = -27.0 + sin(idle_time*2.2)*0.8
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
	# Temporary fallback only for a family member whose production sprite is not
	# yet assigned. The actor still snaps correctly to the level surface.
	if visual_sprite and visual_sprite.texture:
		return
	var primary := Color.from_string(str(profile.get("color","#8b5cf6")),Color(0.55,0.36,0.96))
	var secondary := Color.from_string(str(profile.get("secondary","#ff8c42")),Color(1.0,0.55,0.26))
	draw_circle(Vector2(0,-38),9.0,Color(0.88,0.70,0.54))
	draw_polygon(PackedVector2Array([Vector2(-10,-29),Vector2(10,-29),Vector2(13,4),Vector2(-13,4)]),PackedColorArray([primary]))
	draw_line(Vector2(-11,-18),Vector2(11,-18),secondary,3.0)
