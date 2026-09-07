extends "res://scripts/main_v16.gd"

# World of Xethkioz v0.9.4 — Approved Visual Skin
# Temporary high-fidelity production skin based on the user-approved concept screens.
# Functional Godot hotspots are layered over the approved art; these flattened skins
# will later be split into final layered assets, sprites and UI components.

const APPROVED_MENU: Texture2D = preload("res://assets/approved/menu_approved_640x360.webp")
const APPROVED_CREATOR: Texture2D = preload("res://assets/approved/creator_approved_640x360.webp")
const APPROVED_REFUGE: Texture2D = preload("res://assets/approved/refuge_approved_640x360.webp")
const APPROVED_TRANSITION: Texture2D = preload("res://assets/approved/transition_approved_640x360.webp")

func _approved_background(layer: CanvasLayer, texture: Texture2D) -> TextureRect:
	var bg := TextureRect.new()
	bg.position = Vector2.ZERO
	bg.size = Vector2(1280,720)
	bg.texture = texture
	bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	bg.stretch_mode = TextureRect.STRETCH_SCALE
	bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(bg)
	return bg

func _hotspot(layer: CanvasLayer, rect: Rect2, callback: Callable, tooltip: String = "") -> Button:
	var b := Button.new()
	b.position = rect.position
	b.size = rect.size
	b.text = ""
	b.flat = true
	b.focus_mode = Control.FOCUS_ALL
	b.tooltip_text = tooltip
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	var normal := StyleBoxFlat.new(); normal.bg_color = Color(0,0,0,0); normal.border_color = Color(0.50,0.30,0.86,0.0)
	var hover := StyleBoxFlat.new(); hover.bg_color = Color(0.38,0.17,0.72,0.18); hover.border_color = Color(0.68,0.48,1.0,0.72); hover.set_border_width_all(2); hover.corner_radius_top_left=4; hover.corner_radius_top_right=4; hover.corner_radius_bottom_left=4; hover.corner_radius_bottom_right=4
	var focus := hover.duplicate()
	b.add_theme_stylebox_override("normal",normal); b.add_theme_stylebox_override("hover",hover); b.add_theme_stylebox_override("focus",focus); b.add_theme_stylebox_override("pressed",hover)
	b.pressed.connect(callback)
	layer.add_child(b)
	return b

# -----------------------------------------------------------------------------
# PORTADA / MAIN MENU — approved concept as interactive skin
func _show_title() -> void:
	if world:
		world.queue_free(); world=null; player=null; pet=null
	if hud_layer: hud_layer.visible=false
	if dialogue_layer: dialogue_layer.visible=false
	if overworld_layer: overworld_layer.queue_free(); overworld_layer=null
	if armory_layer: armory_layer.queue_free(); armory_layer=null
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=100; add_child(menu_layer)
	_approved_background(menu_layer,APPROVED_MENU)
	# Concept image already contains the visual labels; these are interactive hotspots.
	_hotspot(menu_layer,Rect2(72,233,340,44),_new_game,"Crear un nuevo Viajero")
	_hotspot(menu_layer,Rect2(72,286,340,44),_continue_game,"Continuar desde el último progreso")
	_hotspot(menu_layer,Rect2(72,338,340,44),_open_saved_overworld,"Cargar partida / mapa global")
	_hotspot(menu_layer,Rect2(72,391,340,44),func(): _toast("AJUSTES • próximamente: audio, resolución, idioma, gamepad y accesibilidad.",4.0),"Ajustes")
	_hotspot(menu_layer,Rect2(72,444,340,44),func(): _toast("WORLD OF XETHKIOZ • proyecto original XETHKIOZ.",3.0),"Créditos")
	_hotspot(menu_layer,Rect2(72,497,340,44),func(): get_tree().quit(),"Salir")
	var build := _vlabel(menu_layer,Vector2(1020,684),Vector2(240,22),"v0.9.4 GOLDEN SLICE",9,Color(0.74,0.72,0.86,0.80)); build.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT

# -----------------------------------------------------------------------------
# CREATOR — approved concept, functional sex/name/palette controls on top
func _show_character_setup() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=108; add_child(menu_layer)
	_approved_background(menu_layer,APPROVED_CREATOR)

	# Cover only the baked dynamic values while preserving the approved frame/art.
	var gender_panel := Panel.new(); gender_panel.position=Vector2(890,142); gender_panel.size=Vector2(310,44); gender_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.016,0.020,0.047,0.96),Color(0.38,0.28,0.57,0.9),1)); menu_layer.add_child(gender_panel)
	var male := Button.new(); male.position=Vector2(900,148); male.size=Vector2(140,32); male.text="MASCULINO"; male.add_theme_font_size_override("font_size",10); _style_button(male); male.pressed.connect(func(): _choose_gender("Masculino")); menu_layer.add_child(male)
	var female := Button.new(); female.position=Vector2(1045,148); female.size=Vector2(145,32); female.text="FEMENINO"; female.add_theme_font_size_override("font_size",10); _style_button(female); female.pressed.connect(func(): _choose_gender("Femenino")); menu_layer.add_child(female)

	palette_status_label=_vlabel(menu_layer,Vector2(880,430),Vector2(310,24),"Violeta Prismática",10,Color(0.84,0.76,1.0)); palette_status_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var palette_names:Array[String]=["VIOLETA","COBRE","TURQUESA","ORO"]
	for i in range(4):
		var p:=Button.new(); p.position=Vector2(887+i*78,454); p.size=Vector2(70,27); p.text=palette_names[i]; p.add_theme_font_size_override("font_size",8); _style_button(p); p.pressed.connect(func(): _choose_palette(i,palette_names[i])); menu_layer.add_child(p)

	character_name_input=LineEdit.new(); character_name_input.position=Vector2(925,494); character_name_input.size=Vector2(270,39); character_name_input.text=str(state.get("player_name","Viajero")); character_name_input.placeholder_text="Viajero"; character_name_input.max_length=20; character_name_input.add_theme_font_size_override("font_size",12); character_name_input.add_theme_stylebox_override("normal",_panel_style(Color(0.012,0.016,0.038,0.94),Color(0.38,0.28,0.58,0.92),1)); menu_layer.add_child(character_name_input)
	var start := Button.new(); start.position=Vector2(875,554); start.size=Vector2(340,54); start.text="COMENZAR VIAJE"; start.add_theme_font_size_override("font_size",15); _style_button(start); start.pressed.connect(_finish_character_setup); menu_layer.add_child(start)
	var back := Button.new(); back.position=Vector2(30,666); back.size=Vector2(140,34); back.text="VOLVER"; back.add_theme_font_size_override("font_size",10); _style_button(back); back.pressed.connect(_show_title); menu_layer.add_child(back)

	pending_gender=str(state.get("player_gender","Masculino")); _choose_gender(pending_gender)
	var pi:int=clampi(int(state.get("player_palette",0)),0,3); _choose_palette(pi,palette_names[pi])

# -----------------------------------------------------------------------------
# TRANSITION — approved scenic concept with dynamic destination and refuge state
func _show_map_transition_v16() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=125; add_child(menu_layer)
	_approved_background(menu_layer,APPROVED_TRANSITION)
	# Hide baked destination and replace with actual node.
	var top_cover:=ColorRect.new(); top_cover.position=Vector2(355,28); top_cover.size=Vector2(570,128); top_cover.color=Color(0.012,0.016,0.038,0.88); menu_layer.add_child(top_cover)
	var top:=_vlabel(menu_layer,Vector2(390,42),Vector2(500,25),"PRÓXIMO DESTINO",11,Color(0.82,0.84,0.95)); top.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var title:=_vlabel(menu_layer,Vector2(270,75),Vector2(740,52),"%02d — %s" % [transition_next_map,OverworldData.node_name(transition_next_map)],25,Color(0.97,0.93,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var buttons_cover:=Panel.new(); buttons_cover.position=Vector2(850,250); buttons_cover.size=Vector2(355,190); buttons_cover.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.012,0.034,0.93),Color(0.46,0.30,0.75,0.92),2)); menu_layer.add_child(buttons_cover)
	var cont:=Button.new(); cont.position=Vector2(872,268); cont.size=Vector2(310,42); cont.text="CONTINUAR"; _style_button(cont); cont.pressed.connect(_transition_continue); menu_layer.add_child(cont)
	var refuge:=Button.new(); refuge.position=Vector2(872,320); refuge.size=Vector2(310,42); refuge.text="REFUGIO DE ELIDA"; _style_button(refuge); menu_layer.add_child(refuge)
	var can_refuge:bool=transition_finished_map%5==0; refuge.disabled=not can_refuge
	refuge.tooltip_text="Disponible después de los mapas 5, 10 y 15." if not can_refuge else "Entrar al Refugio de Elida"
	if can_refuge: refuge.pressed.connect(_show_elida_refuge_v16)
	var mapb:=Button.new(); mapb.position=Vector2(872,372); mapb.size=Vector2(310,42); mapb.text="REVISAR MAPA"; _style_button(mapb); mapb.pressed.connect(_show_overworld); menu_layer.add_child(mapb)

# -----------------------------------------------------------------------------
# REFUGIO — approved warm family scene + functional service panel
func _show_elida_refuge_v16() -> void:
	refuge_return_map=transition_next_map
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=126; add_child(menu_layer)
	_approved_background(menu_layer,APPROVED_REFUGE)
	# Replace the small baked menu with all approved gameplay services.
	var services:=Panel.new(); services.position=Vector2(885,240); services.size=Vector2(330,400); services.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.012,0.030,0.95),Color(0.48,0.30,0.76,0.98),2)); menu_layer.add_child(services)
	var st:=_vlabel(services,Vector2(12,10),Vector2(306,28),"SERVICIOS DE ELIDA",15,Color(1.0,0.78,0.42)); st.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var opts=["HABLAR","DESCANSAR","ALQUIMIA","MASCOTAS","MEJORAR EQUIPO","ATLAS / REVISITAR","CONSEJO DE ALEXIS","CONTINUAR VIAJE"]
	for i in range(opts.size()):
		var b:=Button.new(); b.position=Vector2(900,282+i*42); b.size=Vector2(300,34); b.text=opts[i]; b.add_theme_font_size_override("font_size",10); _style_button(b); menu_layer.add_child(b)
		match i:
			0: b.pressed.connect(func(): _toast("Elida: Acá siempre van a tener un hogar. La familia sigue siendo nuestra mayor fuerza.",5.0))
			1: b.pressed.connect(_refuge_rest_v16)
			2: b.pressed.connect(_refuge_alchemy_v16)
			3: b.pressed.connect(_refuge_pet_v16)
			4: b.pressed.connect(_show_armory)
			5: b.pressed.connect(_show_overworld)
			6: b.pressed.connect(func(): _toast("Alexis: Mirá arriba y abajo antes de elegir camino. Izrdralar premia al que observa.",4.0))
			7: b.pressed.connect(_refuge_continue_v16)

# Make the build identity explicit without changing gameplay.
func update_hud() -> void:
	super.update_hud()
	if objective_label:
		objective_label.tooltip_text="World of Xethkioz v0.9.4 • Golden Slice visual skin"
