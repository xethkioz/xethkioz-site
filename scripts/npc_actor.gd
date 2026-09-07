extends Node2D

var main_ref: Node
var profile: Dictionary = {}
var dialogue_text := ""
var spoken := false
var trigger_distance := 135.0
var name_label: Label

func setup(main_node: Node, character_profile: Dictionary, line: String, trigger: float = 135.0) -> void:
	main_ref = main_node
	profile = character_profile.duplicate(true)
	dialogue_text = line
	trigger_distance = trigger
	name_label = Label.new()
	name_label.position = Vector2(-70,-58)
	name_label.size = Vector2(140,24)
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.text = str(profile.get("name","NPC"))
	name_label.add_theme_font_size_override("font_size",13)
	name_label.add_theme_color_override("font_color",Color(0.96,0.96,0.98))
	add_child(name_label)
	queue_redraw()

func _process(_delta: float) -> void:
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
	var primary := Color.from_string(str(profile.get("color","#8b5cf6")),Color(0.55,0.36,0.96))
	var secondary := Color.from_string(str(profile.get("secondary","#ff8c42")),Color(1.0,0.55,0.26))
	var gender := str(profile.get("gender","No definido"))
	var relationship := str(profile.get("relationship","NPC"))

	# Prototype pixel-like silhouette. Final sprite sheets replace this in the art pass.
	draw_rect(Rect2(-10,-25,20,22),primary)
	draw_circle(Vector2(0,-34),9.0,Color(0.88,0.70,0.54))
	draw_rect(Rect2(-12,-18,24,5),secondary)
	draw_rect(Rect2(-9,-3,7,17),primary.darkened(0.20))
	draw_rect(Rect2(2,-3,7,17),primary.darkened(0.20))
	if gender == "Femenino":
		draw_arc(Vector2(0,-34),11.5,PI,TAU,12,primary.darkened(0.15),3.0)
	else:
		draw_rect(Rect2(-8,-45,16,4),primary.darkened(0.20))
	if relationship in ["Padre","Abuela"]:
		draw_circle(Vector2(0,-34),12.5,Color(secondary,0.18),false,2.0)
