extends "res://src/npc/npc_interactable_production.gd"

# Readability pass for authored NPCs at the 640x360 target.
# Dialogue, flags, interaction distance and authored positions remain owned by
# the production/base NPC scripts. This layer only changes visual presentation.

func configure_production(id_value: String, name_value: String, lines: Array[String], index: int, rules: Array = []) -> void:
	super.configure_production(id_value, name_value, lines, index, rules)
	if is_inside_tree():
		_apply_pass02_presentation()

func _ready() -> void:
	super._ready()
	_apply_pass02_presentation()

func _apply_pass02_presentation() -> void:
	var scale_value := _npc_scale()
	if is_instance_valid(_visual):
		_visual.scale = Vector2.ONE * scale_value
		# Keep feet visually anchored while allowing adult silhouettes to read a
		# little larger than children/younger NPCs.
		var lift := maxf(-0.5, (scale_value - 1.0) * 11.0)
		_visual.position = Vector2(0.0, -7.0 - lift)
	if is_instance_valid(_nameplate):
		var plate_lift := maxf(0.0, (scale_value - 1.0) * 22.0)
		_nameplate.position = Vector2(-42.0, -38.0 - plate_lift)
		_nameplate.add_theme_color_override("font_color", _name_color())
	queue_redraw()

func _npc_scale() -> float:
	match _atlas_index:
		0: # Alexis 35
			return 1.10
		1: # Elida
			return 1.07
		2: # Ashley 15
			return 1.02
		3: # Fermin 13
			return 1.00
		4: # Isabella 8
			return 0.93
		5: # Gael 7
			return 0.92
		6: # Ivan
			return 1.10
		7: # Val 46
			return 1.12
		8: # Rola 14
			return 1.01
		9: # Mela 12
			return 0.98
		_:
			return 1.0

func _role_color() -> Color:
	match _atlas_index:
		0:
			return Color("8b5cf6")
		1:
			return Color("8fcf78")
		2:
			return Color("d66fb3")
		3:
			return Color("ff8c42")
		4:
			return Color("a855f7")
		5:
			return Color("73b96e")
		6:
			return Color("3fc7c9")
		7:
			return Color("73d8c8")
		8:
			return Color("d0a05c")
		9:
			return Color("9d7bff")
		_:
			return Color("d8d3c5")

func _name_color() -> Color:
	return _role_color().lightened(0.38)

func _draw() -> void:
	# A restrained authored footprint improves NPC separation from dense foliage
	# without turning them into quest-marker beacons.
	var accent := _role_color()
	var ring_color := accent
	ring_color.a = 0.30
	var glow_color := accent.lightened(0.30)
	glow_color.a = 0.55
	draw_arc(Vector2(0, 8), 9.5, 0.15, PI - 0.15, 18, ring_color, 1.0)
	draw_rect(Rect2(Vector2(-1, 7), Vector2(2, 2)), glow_color, true)
