extends Node2D

# Golden Slice family sprites are generated in CI by generate_v095_golden_assets.py.
const ALEXIS_TEX = preload("res://assets/v095/generated/alexis.png")
const ASHLEY_TEX = preload("res://assets/v095/generated/ashley.png")
const FERMIN_TEX = preload("res://assets/v095/generated/fermin.png")
const ISABELLA_TEX = preload("res://assets/v095/generated/isabella.png")
const GAEL_TEX = preload("res://assets/v095/generated/gael.png")
const ELIDA_TEX = preload("res://assets/v095/generated/elida.png")

var main_ref: Node
var profile: Dictionary = {}
var dialogue_text := ""
var spoken := false
var trigger_distance := 135.0
var name_label: Label
var visual_sprite: Sprite2D
var idle_time := 0.0
var snap_attempts := 10
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
		visual_sprite.scale = _scale_for_character(str(profile.get("name","NPC")))
		visual_sprite.position = Vector2(0,-29)
		visual_sprite.z_index = 8
		add_child(visual_sprite)
	name_label = Label.new()
	name_label.position = Vector2(-70,-100)
	name_label.size = Vector2(140,20)
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.text = str(profile.get("name","NPC"))
	name_label.add_theme_font_size_override("font_size",10)
	name_label.add_theme_color_override("font_color",Color(0.96,0.94,1.0))
	name_label.add_theme_color_override("font_shadow_color",Color(0.02,0.02,0.04,0.95))
	name_label.add_theme_constant_override("shadow_offset_x",1)
	name_label.add_theme_constant_override("shadow_offset_y",1)
	add_child(name_label)
	call_deferred("_snap_to_floor")

func _texture_for_character(character_name: String) -> Texture2D:
	match character_name:
		"Alexis": return ALEXIS_TEX
		"Ashley": return ASHLEY_TEX
		"Fermín": return FERMIN_TEX
		"Isabella": return ISABELLA_TEX
		"Gael": return GAEL_TEX
		"Elida": return ELIDA_TEX
		_: return null

func _scale_for_character(character_name: String) -> Vector2:
	# Keep visible age hierarchy: Ashley 15 > Fermín 13 > Isabella 8 / Gael 7.
	match character_name:
		"Alexis": return Vector2(1.38,1.38)
		"Elida": return Vector2(1.32,1.32)
		"Ashley": return Vector2(1.26,1.26)
		"Fermín": return Vector2(1.20,1.20)
		"Isabella": return Vector2(1.02,1.02)
		"Gael": return Vector2(0.98,0.98)
	return Vector2(1.15,1.15)

func _snap_to_floor() -> void:
	if not is_inside_tree() or snapped_to_floor:
		return
	var space := get_world_2d().direct_space_state
	var query := PhysicsRayQueryParameters2D.create(global_position+Vector2(0,-220),global_position+Vector2(0,340),2)
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
		visual_sprite.position.y = -29.0 + sin(idle_time*2.2)*0.8
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
	# No geometric family placeholders are allowed in the Golden Slice.
	pass
