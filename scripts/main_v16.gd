extends "res://scripts/main_v15.gd"

# World of Xethkioz v0.9.3 — Golden Slice UI / Flow
# Approved visual-language pass for menu, creator, dialogue, transitions and Elida refuge.

var pending_gender: String = "Masculino"
var dialogue_speaker_v16: String = ""
var transition_finished_map: int = 0
var transition_next_map: int = 1
var refuge_return_map: int = 1
var zone_intro_layer_v16: CanvasLayer

func _ready() -> void:
	super._ready()
	if not state.has("player_gender"):
		state["player_gender"] = "Masculino"
	SaveSystem.save_state(state)

# -----------------------------------------------------------------------------
# APPROVED MAIN MENU
func _show_title() -> void:
	if world:
		world.queue_free(); world = null; player = null; pet = null
	if hud_layer: hud_layer.visible = false
	if dialogue_layer: dialogue_layer.visible = false
	if overworld_layer: overworld_layer.queue_free(); overworld_layer = null
	if armory_layer: armory_layer.queue_free(); armory_layer = null
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 100; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.90,0.94,1.0))
	var shade := ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.006,0.008,0.025,0.28); menu_layer.add_child(shade)

	var logo_panel := Panel.new(); logo_panel.position=Vector2(48,40); logo_panel.size=Vector2(490,190)
	logo_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.012,0.032,0.56),Color(0.45,0.28,0.74,0.86),2)); menu_layer.add_child(logo_panel)
	var title := _vlabel(logo_panel,Vector2(18,22),Vector2(455,70),"WORLD OF\nXETHKIOZ",40,Color(0.82,0.70,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var sub := _vlabel(logo_panel,Vector2(18,118),Vector2(455,28),"ARGENTINA 2150 • LA FISURA PRISMÁTICA",14,Color(1.0,0.68,0.30)); sub.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	var menu_panel := Panel.new(); menu_panel.position=Vector2(50,270); menu_panel.size=Vector2(310,355)
	menu_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.012,0.032,0.88),Color(0.42,0.28,0.68,0.96),2)); menu_layer.add_child(menu_panel)
	var labels := ["NUEVA PARTIDA","CONTINUAR","CARGAR PARTIDA","AJUSTES","CRÉDITOS","SALIR"]
	for i in range(labels.size()):
		var b := Button.new(); b.position=Vector2(70,290+i*52); b.size=Vector2(270,42); b.text=labels[i]; b.add_theme_font_size_override("font_size",14); _style_button(b); menu_layer.add_child(b)
		match i:
			0: b.pressed.connect(_new_game)
			1: b.pressed.connect(_continue_game)
			2: b.pressed.connect(_open_saved_overworld)
			3: b.pressed.connect(func(): _toast("AJUSTES • audio, resolución, idioma y accesibilidad se integran en la siguiente etapa de pulido.",4.0))
			4: b.pressed.connect(func(): _toast("WORLD OF XETHKIOZ • proyecto original XETHKIOZ.",3.0))
			5: b.pressed.connect(func(): get_tree().quit())

	var lore := _vlabel(menu_layer,Vector2(905,565),Vector2(330,74),"Argentina, 2150.\nUn nuevo mundo despierta.",15,Color(0.90,0.86,1.0)); lore.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
	var footer := _vlabel(menu_layer,Vector2(40,680),Vector2(1200,24),"v0.9.3 • GOLDEN SLICE • DEMO 1–15",10,Color(0.70,0.70,0.82)); footer.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

# -----------------------------------------------------------------------------
# CHARACTER CREATOR — MASCULINO / FEMENINO
func _show_character_setup() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=108; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_CREATOR,Color(0.88,0.92,1.0))
	var shade:=ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.01,0.01,0.03,0.22); menu_layer.add_child(shade)

	var left := Panel.new(); left.position=Vector2(60,84); left.size=Vector2(470,560); left.add_theme_stylebox_override("panel",_panel_style(Color(0.009,0.014,0.035,0.88),Color(0.46,0.30,0.72,0.96),2)); menu_layer.add_child(left)
	var title:=_vlabel(left,Vector2(20,18),Vector2(430,48),"TU VIAJERO",26,Color(0.92,0.84,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	traveler_preview_v10=TextureRect.new(); traveler_preview_v10.position=Vector2(95,88); traveler_preview_v10.size=Vector2(280,325); traveler_preview_v10.texture=TEX_TRAVELER; traveler_preview_v10.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; traveler_preview_v10.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; left.add_child(traveler_preview_v10)
	var xeth:=TextureRect.new(); xeth.position=Vector2(315,315); xeth.size=Vector2(105,105); xeth.texture=TEX_XETH; xeth.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; xeth.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; left.add_child(xeth)
	var desc:=_vlabel(left,Vector2(35,438),Vector2(400,78),"Un nuevo camino. Un mismo propósito.\nLa familia, el mundo y todo lo que aún puede ser salvado.",13,Color(0.82,0.84,0.93)); desc.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; desc.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART

	var editor:=Panel.new(); editor.position=Vector2(565,84); editor.size=Vector2(650,560); editor.add_theme_stylebox_override("panel",_panel_style(Color(0.009,0.014,0.035,0.92),Color(0.46,0.30,0.72,0.96),2)); menu_layer.add_child(editor)
	var et:=_vlabel(editor,Vector2(20,18),Vector2(610,46),"CREAR VIAJERO",25,Color(0.94,0.88,1.0)); et.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	_vlabel(editor,Vector2(30,82),Vector2(130,30),"Cuerpo",15,Color(0.82,0.84,0.94))
	var male:=Button.new(); male.position=Vector2(170,74); male.size=Vector2(190,42); male.text="MASCULINO"; _style_button(male); editor.add_child(male)
	var female:=Button.new(); female.position=Vector2(380,74); female.size=Vector2(190,42); female.text="FEMENINO"; _style_button(female); editor.add_child(female)
	male.pressed.connect(func(): _choose_gender("Masculino"))
	female.pressed.connect(func(): _choose_gender("Femenino"))

	_vlabel(editor,Vector2(30,138),Vector2(130,30),"Paleta",15,Color(0.82,0.84,0.94))
	palette_status_label=_vlabel(editor,Vector2(170,138),Vector2(400,28),"Violeta Prismática",13,Color(0.78,0.56,1.0)); palette_status_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var palette_names:Array[String]=["VIOLETA","COBRE","TURQUESA","ORO"]
	for i in range(4):
		var pb:=Button.new(); pb.position=Vector2(170+i*102,178); pb.size=Vector2(92,38); pb.text=palette_names[i]; pb.add_theme_font_size_override("font_size",10); _style_button(pb); pb.pressed.connect(func(): _choose_palette(i,palette_names[i])); editor.add_child(pb)

	_vlabel(editor,Vector2(30,248),Vector2(130,30),"Nombre",15,Color(0.82,0.84,0.94))
	character_name_input=LineEdit.new(); character_name_input.position=Vector2(170,240); character_name_input.size=Vector2(400,44); character_name_input.text=str(state.get("player_name","Viajero")); character_name_input.placeholder_text="Viajero"; character_name_input.max_length=20; character_name_input.add_theme_stylebox_override("normal",_panel_style(Color(0.02,0.024,0.05,0.98),Color(0.32,0.25,0.50,0.95),1)); editor.add_child(character_name_input)

	var note:=_vlabel(editor,Vector2(40,320),Vector2(570,82),"El editor completo sumará rostro, peinado, color de cabello, tono de piel y ropa inicial. Esta build deja ya funcional el sexo del Viajero, el nombre y la paleta.",12,Color(0.74,0.78,0.88)); note.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var start:=Button.new(); start.position=Vector2(125,438); start.size=Vector2(400,58); start.text="COMENZAR VIAJE"; start.add_theme_font_size_override("font_size",18); _style_button(start); start.pressed.connect(_finish_character_setup); editor.add_child(start)

	pending_gender=str(state.get("player_gender","Masculino")); _choose_gender(pending_gender)
	var pi:int=clampi(int(state.get("player_palette",0)),0,3); _choose_palette(pi,palette_names[pi])

func _choose_gender(value: String) -> void:
	pending_gender = value if value in ["Masculino","Femenino"] else "Masculino"
	if traveler_preview_v10:
		traveler_preview_v10.flip_h = pending_gender == "Femenino"
		traveler_preview_v10.scale = Vector2(0.96,0.96) if pending_gender == "Femenino" else Vector2.ONE

func _finish_character_setup() -> void:
	var chosen_name:String=character_name_input.text.strip_edges() if character_name_input else "Viajero"
	if chosen_name.is_empty(): chosen_name="Viajero"
	state["player_name"]=chosen_name; state["player_gender"]=pending_gender; state["player_palette"]=pending_palette
	state["current_map"]=1; state["current_node"]=1; current_map=1
	SaveSystem.save_state(state)
	_start_level()

# -----------------------------------------------------------------------------
# DIALOGUES — PORTRAIT + RESPONSE OPTIONS
func show_family_dialogue(speaker:String,text:String,relationship:String,gender:String) -> void:
	_ensure_dialogue_ui()
	dialogue_speaker_v16=speaker
	dialogue_layer.visible=true
	dialogue_name_label.text=speaker
	dialogue_meta_label.text="%s • %s" % [relationship,gender]
	dialogue_body_label.text=text
	dialogue_timer=12.0
	if dialogue_portrait_v10:
		match speaker:
			"Alexis": dialogue_portrait_v10.texture=PORTRAIT_ALEXIS
			"Ashley": dialogue_portrait_v10.texture=PORTRAIT_ASHLEY
			_: dialogue_portrait_v10.texture=TEX_TRAVELER
	_update_dialogue_choices()

func _ensure_dialogue_ui() -> void:
	if dialogue_layer: return
	dialogue_layer=CanvasLayer.new(); dialogue_layer.layer=70; add_child(dialogue_layer)
	var panel:=Panel.new(); panel.position=Vector2(30,500); panel.size=Vector2(1215,195); panel.add_theme_stylebox_override("panel",_panel_style(Color(0.004,0.008,0.022,0.97),Color(0.50,0.30,0.78,0.98),2)); dialogue_layer.add_child(panel)
	dialogue_portrait_v10=TextureRect.new(); dialogue_portrait_v10.position=Vector2(48,520); dialogue_portrait_v10.size=Vector2(135,145); dialogue_portrait_v10.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; dialogue_portrait_v10.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; dialogue_layer.add_child(dialogue_portrait_v10)
	dialogue_name_label=_vlabel(dialogue_layer,Vector2(205,518),Vector2(250,32),"",20,Color(1.0,0.72,0.32))
	dialogue_meta_label=_vlabel(dialogue_layer,Vector2(460,522),Vector2(330,26),"",12,Color(0.68,0.70,0.80))
	dialogue_body_label=_vlabel(dialogue_layer,Vector2(205,560),Vector2(600,100),"",15,Color(0.95,0.95,0.99)); dialogue_body_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	for i in range(4):
		var b:=Button.new(); b.name="Choice%d"%i; b.position=Vector2(835,515+i*40); b.size=Vector2(380,34); b.add_theme_font_size_override("font_size",11); _style_button(b); b.pressed.connect(_dialogue_choice.bind(i)); dialogue_layer.add_child(b)
	dialogue_layer.visible=false

func _update_dialogue_choices() -> void:
	if not dialogue_layer: return
	var options:Array[String]
	match dialogue_speaker_v16:
		"Alexis": options=["¿Qué fue la Fisura?","¿Qué pasó con Argentina?","¿Por qué no envejecemos?","Entiendo. Gracias."]
		"Ashley": options=["¿Qué escuchás en Izrdralar?","¿Cómo funciona el ritmo?","¿Vas a ser mi mentora?","Sigamos."]
		_: options=["Contame más.","¿Qué debería buscar?","¿Es peligroso?","Continuar."]
	for i in range(4):
		var b:Button=dialogue_layer.get_node("Choice%d"%i); b.text=options[i]

func _dialogue_choice(index:int) -> void:
	match dialogue_speaker_v16:
		"Alexis":
			var a=["Una grieta prismática abrió capas del mundo que nunca debieron tocarse.","Lo que conocíamos quedó mezclado con Izrdralar: ruinas del 2150, naturaleza y magia.","El colapso temporal fijó a los cuatro chicos en sus edades. El tiempo no corre igual alrededor de ellos.","Seguimos juntos. Eso es lo que importa ahora."]
			dialogue_body_label.text=a[clampi(index,0,3)]
		"Ashley":
			var b=["El bosque cambia de ritmo con cada clima. Si lo seguís, aparecen caminos que otros no ven.","Movimiento, combate y magia tienen cadencia. Aprenderla te hace más preciso.","Después del primer gran jefe vas a poder elegir una mentoría.","Dale. Izrdralar todavía tiene mucho para mostrar."]
			dialogue_body_label.text=b[clampi(index,0,3)]
		_:
			dialogue_body_label.text="Cada respuesta abre otra parte del mundo."
	if index==3:
		dialogue_timer=2.0

# -----------------------------------------------------------------------------
# DYNAMIC ZONE INTRO
func _start_level() -> void:
	if zone_intro_layer_v16: zone_intro_layer_v16.queue_free(); zone_intro_layer_v16=null
	super._start_level()
	_show_zone_intro_v16()

func _show_zone_intro_v16() -> void:
	zone_intro_layer_v16=CanvasLayer.new(); zone_intro_layer_v16.layer=68; add_child(zone_intro_layer_v16)
	var panel:=Panel.new(); panel.position=Vector2(370,14); panel.size=Vector2(540,62); panel.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.012,0.030,0.82),Color(0.42,0.29,0.68,0.88),1)); zone_intro_layer_v16.add_child(panel)
	var t:=_vlabel(panel,Vector2(10,7),Vector2(520,24),"%s — %s" % [WorldData.region_for_map(current_map),WorldData.biome_for_map(current_map)],14,Color(0.96,0.90,1.0)); t.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var s:=_vlabel(panel,Vector2(10,32),Vector2(520,20),"%02d • %s" % [current_map,WorldData.map_name(current_map)],11,Color(0.82,0.86,0.96)); s.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var tw:=create_tween(); tw.tween_interval(3.2); tw.tween_property(panel,"modulate",Color(1,1,1,0),0.5); tw.finished.connect(func(): if is_instance_valid(zone_intro_layer_v16): zone_intro_layer_v16.queue_free())

# -----------------------------------------------------------------------------
# MAP TRANSITION — REFUGE AVAILABLE EVERY 5 MAPS
func _complete_map() -> void:
	if map_complete: return
	map_complete=true
	transition_finished_map=current_map
	_mark_node_completed(transition_finished_map)
	if transition_finished_map==15:
		state["demo_complete"]=true; state["demo_completed_map15"]=true; state["legendary_weapon_ids"]=[101,102]; _sync_armory_unlocks(); SaveSystem.save_state(state); _show_demo_complete(); return
	transition_next_map=transition_finished_map+1
	current_map=transition_next_map; state["current_map"]=current_map; state["current_node"]=current_map
	supplies=min(float(state.get("max_supplies",100.0)),supplies+8.0); state["supplies"]=supplies; SaveSystem.save_state(state)
	_show_map_transition_v16()

func _show_map_transition_v16() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=125; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_IZRDRALAR,Color(0.82,0.88,1.0))
	var shade:=ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.008,0.012,0.028,0.40); menu_layer.add_child(shade)
	var top:=_vlabel(menu_layer,Vector2(360,72),Vector2(560,28),"PRÓXIMO DESTINO",13,Color(0.80,0.84,0.96)); top.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var title:=_vlabel(menu_layer,Vector2(240,108),Vector2(800,62),"%02d — %s" % [transition_next_map,OverworldData.node_name(transition_next_map)],28,Color(0.96,0.92,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var quote:=_vlabel(menu_layer,Vector2(330,435),Vector2(620,90),"Cada paso en Izrdralar deja una huella.\nY cada huella cuenta una historia.\n— Elida",15,Color(0.88,0.88,0.95)); quote.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var cont:=Button.new(); cont.position=Vector2(860,260); cont.size=Vector2(310,46); cont.text="CONTINUAR"; _style_button(cont); cont.pressed.connect(_transition_continue); menu_layer.add_child(cont)
	var refuge:=Button.new(); refuge.position=Vector2(860,318); refuge.size=Vector2(310,46); refuge.text="REFUGIO DE ELIDA"; _style_button(refuge); menu_layer.add_child(refuge)
	var can_refuge:bool=transition_finished_map%5==0
	refuge.disabled=not can_refuge; refuge.tooltip_text="Disponible al cerrar cada bloque de 5 mapas." if not can_refuge else "Descansar, alquimia, mascotas, equipo, atlas y consejo."
	if can_refuge: refuge.pressed.connect(_show_elida_refuge_v16)
	var mapb:=Button.new(); mapb.position=Vector2(860,376); mapb.size=Vector2(310,46); mapb.text="REVISAR MAPA"; _style_button(mapb); mapb.pressed.connect(_show_overworld); menu_layer.add_child(mapb)

func _transition_continue() -> void:
	if transition_finished_map==5 and not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
	else:
		_show_overworld()

# -----------------------------------------------------------------------------
# ELIDA REFUGE
func _show_elida_refuge_v16() -> void:
	refuge_return_map=transition_next_map
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=126; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.055,0.032,0.024); menu_layer.add_child(bg)
	var title:=_vlabel(menu_layer,Vector2(260,28),Vector2(760,46),"REFUGIO DE ELIDA",28,Color(1.0,0.78,0.46)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var sub:=_vlabel(menu_layer,Vector2(260,72),Vector2(760,26),"Un hogar en medio de la Fisura",13,Color(0.86,0.82,0.76)); sub.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	var hearth:=Panel.new(); hearth.position=Vector2(80,125); hearth.size=Vector2(760,470); hearth.add_theme_stylebox_override("panel",_panel_style(Color(0.08,0.045,0.030,0.96),Color(0.72,0.43,0.22,0.90),2)); menu_layer.add_child(hearth)
	var family:=_vlabel(hearth,Vector2(35,35),Vector2(690,180),"ELIDA\n\nAlexis está revisando el mapa. Ashley acomoda su instrumento. Fermín descansa cerca del fuego. Isabella juega con reflejos prismáticos y Gael observa a Xethkioz.\n\nAcá el grupo baja la guardia antes de continuar.",15,Color(0.95,0.90,0.82)); family.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var advice:=_vlabel(hearth,Vector2(35,250),Vector2(690,140),"Consejo de Alexis:\n“No midas la dificultad sólo por cuánto golpea algo. Mirá el terreno, las rutas y qué te está pidiendo el mundo.”",15,Color(0.86,0.78,1.0)); advice.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART

	var menu:=Panel.new(); menu.position=Vector2(875,125); menu.size=Vector2(330,470); menu.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.018,0.035,0.96),Color(0.48,0.30,0.72,0.96),2)); menu_layer.add_child(menu)
	var opts=["HABLAR CON ELIDA","DESCANSAR","ALQUIMIA","MASCOTAS","MEJORAR EQUIPO","ATLAS / REVISITAR","CONSEJO DE ALEXIS","CONTINUAR VIAJE"]
	for i in range(opts.size()):
		var b:=Button.new(); b.position=Vector2(895,145+i*52); b.size=Vector2(290,42); b.text=opts[i]; b.add_theme_font_size_override("font_size",11); _style_button(b); menu_layer.add_child(b)
		match i:
			0: b.pressed.connect(func(): _toast("Elida: Acá siempre van a tener un hogar. No dejes que la Fisura te haga olvidar por qué seguís caminando.",5.0))
			1: b.pressed.connect(_refuge_rest_v16)
			2: b.pressed.connect(_refuge_alchemy_v16)
			3: b.pressed.connect(_refuge_pet_v16)
			4: b.pressed.connect(_show_armory)
			5: b.pressed.connect(_show_overworld)
			6: b.pressed.connect(func(): _toast("Alexis: Si una ruta parece demasiado obvia, mirá arriba y abajo. Izrdralar siempre deja otra opción.",4.0))
			7: b.pressed.connect(_refuge_continue_v16)

func _refuge_rest_v16() -> void:
	supplies=float(state.get("max_supplies",100.0)); state["supplies"]=supplies; state["refuge_rests"]=int(state.get("refuge_rests",0))+1; SaveSystem.save_state(state); _toast("DESCANSO COMPLETO • raciones restauradas.",2.5)

func _refuge_alchemy_v16() -> void:
	var crystals:int=int(state.get("crystals",0))
	if crystals<5:
		_toast("ALQUIMIA • necesitás 5 cristales para preparar una ración prismática.",2.8); return
	state["crystals"]=crystals-5; supplies=min(float(state.get("max_supplies",100.0)),supplies+15.0); state["supplies"]=supplies; SaveSystem.save_state(state); _toast("ALQUIMIA • ración prismática creada (+15 raciones).",2.8)

func _refuge_pet_v16() -> void:
	var owned:Array=state.get("pets",[])
	if owned.is_empty():
		_toast("MASCOTAS • todavía no desbloqueaste un legendario adicional.",2.8); return
	var current:int=int(state.get("active_pet",owned[0])); var idx:int=owned.find(current); idx=(idx+1)%owned.size(); state["active_pet"]=owned[idx]; SaveSystem.save_state(state); _toast("MASCOTAS • compañero activo cambiado.",2.5)

func _refuge_continue_v16() -> void:
	if transition_finished_map==5 and not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
	else:
		_show_overworld()
