extends "res://scripts/main_v21.gd"

# World of Xethkioz — Golden Slice Production v0.10.2
# First real visual production pass: dedicated menu/creator/refuge art and one
# coherent Izrdralar ecosystem reused across Maps 1–5 with changing time/weather.

const BG_MENU_PRODUCTION: Texture2D = preload("res://assets/production/generated/menu_bg_production.png")
const BG_CREATOR_PRODUCTION: Texture2D = preload("res://assets/production/generated/creator_bg_production.png")
const BG_IZRDRALAR_PRODUCTION: Texture2D = preload("res://assets/production/generated/node1_bg_production.png")
const BG_REFUGE_PRODUCTION: Texture2D = preload("res://assets/production/generated/refuge_bg_production.png")

func _replace_fullscreen_texture(layer: CanvasLayer, texture: Texture2D) -> void:
	if not layer:
		return
	for child in layer.get_children():
		if child is TextureRect:
			var tr := child as TextureRect
			if tr.position == Vector2.ZERO and tr.size.x >= 1200.0 and tr.size.y >= 680.0:
				tr.texture = texture
				tr.modulate = Color.WHITE
				tr.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
				tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
				return

func _show_title() -> void:
	super._show_title()
	_replace_fullscreen_texture(menu_layer,BG_MENU_PRODUCTION)

func _show_character_setup() -> void:
	super._show_character_setup()
	_replace_fullscreen_texture(menu_layer,BG_CREATOR_PRODUCTION)

# Maps 1–5 share one authored ecosystem base. What changes is atmosphere,
# lighting and encounter composition rather than loading five unrelated worlds.
func _add_visual_background() -> void:
	if current_map < 1 or current_map > 5:
		super._add_visual_background()
		return
	var tint := Color.WHITE
	match current_map:
		1: tint = Color(1.00,1.00,1.00,1.0) # morning
		2: tint = Color(1.08,1.05,0.96,1.0) # warmer daylight
		3: tint = Color(0.88,0.94,1.02,1.0) # mist / cool afternoon
		4: tint = Color(0.55,0.66,0.88,1.0) # night
		5: tint = Color(0.72,0.62,0.94,1.0) # prismatic storm
	for i in range(3):
		var sprite := Sprite2D.new()
		sprite.texture = BG_IZRDRALAR_PRODUCTION
		sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		sprite.centered = false
		sprite.position = Vector2(i*1280,0)
		sprite.scale = Vector2(2.0,2.0)
		sprite.modulate = tint
		sprite.z_index = -100
		world.add_child(sprite)

func _show_elida_refuge_v16() -> void:
	super._show_elida_refuge_v16()
	if not menu_layer:
		return
	# Remove the inherited flat-color fullscreen card and put the actual refuge
	# environment behind all interactive UI/NPC dialogue elements.
	for child in menu_layer.get_children():
		if child is ColorRect:
			var c := child as ColorRect
			if c.position == Vector2.ZERO and c.size.x >= 1200.0 and c.size.y >= 680.0:
				c.visible = false
	var bg := TextureRect.new()
	bg.position = Vector2.ZERO
	bg.size = Vector2(1280,720)
	bg.texture = BG_REFUGE_PRODUCTION
	bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	bg.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	menu_layer.add_child(bg)
	menu_layer.move_child(bg,0)

func _show_zone_intro_v16() -> void:
	super._show_zone_intro_v16()
	# The first block is explicitly presented as one evolving place.
	if zone_intro_layer_v16 and current_map <= 5:
		for child in zone_intro_layer_v16.get_children():
			if child is Panel:
				for sub in child.get_children():
					if sub is Label and "Bosque" in (sub as Label).text:
						(sub as Label).text += " • ECOSISTEMA IZRDRALAR"
