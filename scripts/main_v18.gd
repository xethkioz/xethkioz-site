extends "res://scripts/main_v16.gd"

# World of Xethkioz v0.9.5 — Golden Slice Foundation Repair
# Maps 1–5 are the production template for the rest of the Steam demo.

const PlayerV9Script = preload("res://scripts/player_v9.gd")
const TRAVELER_MALE_V95 = preload("res://assets/v095/generated/traveler_male.png")
const TRAVELER_FEMALE_V95 = preload("res://assets/v095/generated/traveler_female.png")

var creator_pending: Dictionary = {
	"body":0,"face":0,"hair":0,"hair_color":0,"skin":0,"clothes":0
}
var creator_labels: Dictionary = {}

func _setup_ui() -> void:
	super._setup_ui()
	# Older layers created two map/environment headers. Golden Slice keeps one.
	if environment_badge:
		environment_badge.visible = false
	if map_title_panel_v10:
		map_title_panel_v10.visible = false
	if hud_layer:
		for child in hud_layer.get_children():
			if child is Panel:
				var control := child as Control
				if control.position.distance_to(Vector2(430,18)) < 8.0 and control.size.x > 390.0 and control.size.x < 460.0:
					control.visible = false
	if objective_label:
		objective_label.position = Vector2(390,82)
		objective_label.size = Vector2(500,22)
		objective_label.add_theme_font_size_override("font_size",10)

func _refresh_map_intro_panel() -> void:
	if map_title_panel_v10:
		map_title_panel_v10.visible = false

# main_v15 added a second full scenic pass. The Golden Slice intentionally has
# exactly one background composition per map.
func _add_demo_scenery(_map_no:int) -> void:
	pass

# v0.9.5 backgrounds are 640x360 rather than the old 320x180 placeholders.
func _add_visual_background() -> void:
	for i in range(3):
		var sprite := Sprite2D.new()
		sprite.texture = BG_IZRDRALAR
		sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		sprite.centered = false
		sprite.position = Vector2(i*1280,0)
		sprite.scale = Vector2(2.0,2.0)
		sprite.z_index = -100
		world.add_child(sprite)

# -----------------------------------------------------------------------------
# FINAL-STYLE MAIN MENU FOUNDATION
func _show_title() -> void:
	if world:
		world.queue_free(); world=null; player=null; pet=null
	if hud_layer: hud_layer.visible=false
	if dialogue_layer: dialogue_layer.visible=false
	if overworld_layer: overworld_layer.queue_free(); overworld_layer=null
	if armory_layer: armory_layer.queue_free(); armory_layer=null
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=100; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.92,0.95,1.0))

	# Only the left UI area is darkened; the world art remains visible.
	var veil:=ColorRect.new(); veil.position=Vector2(0,0); veil.size=Vector2(390,720); veil.color=Color(0.004,0.006,0.018,0.56); menu_layer.add_child(veil)
	var title:=_vlabel(menu_layer,Vector2(34,28),Vector2(330,104),"WORLD OF\nXETHKIOZ",39,Color(0.88,0.78,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var sub:=_vlabel(menu_layer,Vector2(38,132),Vector2(320,42),"ARGENTINA 2150\nLA FISURA PRISMÁTICA",12,Color(0.88,0.62,1.0)); sub.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	var panel:=Panel.new(); panel.position=Vector2(30,202); panel.size=Vector2(300,344); panel.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.009,0.026,0.82),Color(0.40,0.25,0.66,0.92),2)); menu_layer.add_child(panel)
	var labels:=["NUEVA PARTIDA","CONTINUAR","CARGAR PARTIDA","AJUSTES","CRÉDITOS","SALIR"]
	for i in range(labels.size()):
		var b:=Button.new(); b.position=Vector2(50,222+i*50); b.size=Vector2(260,40); b.text=labels[i]; b.add_theme_font_size_override("font_size",12); _style_button(b); menu_layer.add_child(b)
		match i:
			0: b.pressed.connect(_new_game)
			1: b.pressed.connect(_continue_game)
			2: b.pressed.connect(_open_saved_overworld)
			3: b.pressed.connect(func(): _toast("AJUSTES • audio, resolución, idioma, gamepad y accesibilidad en pulido de demo.",4.0))
			4: b.pressed.connect(func(): _toast("WORLD OF XETHKIOZ • XETHKIOZ • Argentina 2150.",3.0))
			5: b.pressed.connect(func(): get_tree().quit())

	var lore_panel:=Panel.new(); lore_panel.position=Vector2(905,570); lore_panel.size=Vector2(335,105); lore_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.009,0.024,0.64),Color(0.34,0.25,0.55,0.58),1)); menu_layer.add_child(lore_panel)
	var lore:=_vlabel(lore_panel,Vector2(18,14),Vector2(300,72),"Argentina, 2150.\nUn nuevo mundo despierta.\nLa familia sigue unida.",14,Color(0.92,0.90,1.0)); lore.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
	var build:=_vlabel(menu_layer,Vector2(32,674),Vector2(1190,24),"v0.9.5 • GOLDEN SLICE 1–5",9,Color(0.68,0.68,0.80)); build.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

# -----------------------------------------------------------------------------
# CHARACTER CREATOR FOUNDATION
func _show_character_setup() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=108; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_CREATOR,Color(0.90,0.93,1.0))
	var shade:=ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.004,0.006,0.018,0.18); menu_layer.add_child(shade)

	var left:=Panel.new(); left.position=Vector2(55,72); left.size=Vector2(445,585); left.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.010,0.028,0.90),Color(0.43,0.29,0.70,0.98),2)); menu_layer.add_child(left)
	var lt:=_vlabel(left,Vector2(18,16),Vector2(410,42),"TU VIAJERO",25,Color(0.92,0.84,1.0)); lt.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	traveler_preview_v10=TextureRect.new(); traveler_preview_v10.position=Vector2(92,76); traveler_preview_v10.size=Vector2(260,335); traveler_preview_v10.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; traveler_preview_v10.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; left.add_child(traveler_preview_v10)
	var xp:=TextureRect.new(); xp.position=Vector2(310,315); xp.size=Vector2(90,90); xp.texture=TEX_XETH; xp.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; xp.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; left.add_child(xp)
	var role:=_vlabel(left,Vector2(45,427),Vector2(355,52),"APRENDIZ PRISMÁTICO\nMentoría después del Mapa 5",13,Color(0.88,0.84,0.98)); role.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var desc:=_vlabel(left,Vector2(40,490),Vector2(365,62),"Un nuevo camino. Un mismo propósito.\nLa familia, el mundo y todo lo que aún puede salvarse.",11,Color(0.78,0.81,0.91)); desc.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; desc.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART

	var editor:=Panel.new(); editor.position=Vector2(540,72); editor.size=Vector2(685,585); editor.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.010,0.028,0.93),Color(0.43,0.29,0.70,0.98),2)); menu_layer.add_child(editor)
	var et:=_vlabel(editor,Vector2(20,14),Vector2(645,40),"CREAR VIAJERO",24,Color(0.94,0.88,1.0)); et.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	pending_gender=str(state.get("player_gender","Masculino"))
	creator_pending["body"]=int(state.get("creator_body",0)); creator_pending["face"]=int(state.get("creator_face",0)); creator_pending["hair"]=int(state.get("creator_hair",0)); creator_pending["hair_color"]=int(state.get("creator_hair_color",0)); creator_pending["skin"]=int(state.get("creator_skin",0)); creator_pending["clothes"]=int(state.get("creator_clothes",0))

	_add_creator_gender_row(editor,70)
	_add_creator_cycle_row(editor,120,"CUERPO","body",3)
	_add_creator_cycle_row(editor,166,"ROSTRO","face",4)
	_add_creator_cycle_row(editor,212,"PEINADO","hair",5)
	_add_creator_cycle_row(editor,258,"COLOR DE CABELLO","hair_color",5)
	_add_creator_cycle_row(editor,304,"TONO DE PIEL","skin",5)
	_add_creator_cycle_row(editor,350,"ROPA INICIAL","clothes",4)

	_vlabel(editor,Vector2(28,402),Vector2(150,28),"PALETA",12,Color(0.78,0.81,0.92))
	palette_status_label=_vlabel(editor,Vector2(184,402),Vector2(450,28),"Violeta Prismática",11,Color(0.84,0.70,1.0)); palette_status_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var palette_names:Array[String]=["VIOLETA","COBRE","TURQUESA","ORO"]
	for i in range(4):
		var pb:=Button.new(); pb.position=Vector2(188+i*105,433); pb.size=Vector2(94,30); pb.text=palette_names[i]; pb.add_theme_font_size_override("font_size",8); _style_button(pb); pb.pressed.connect(func(): _choose_palette(i,palette_names[i])); editor.add_child(pb)

	_vlabel(editor,Vector2(28,478),Vector2(140,30),"NOMBRE",12,Color(0.78,0.81,0.92))
	character_name_input=LineEdit.new(); character_name_input.position=Vector2(184,472); character_name_input.size=Vector2(430,38); character_name_input.text=str(state.get("player_name","Viajero")); character_name_input.placeholder_text="Viajero"; character_name_input.max_length=20; character_name_input.add_theme_font_size_override("font_size",11); character_name_input.add_theme_stylebox_override("normal",_panel_style(Color(0.012,0.017,0.038,0.98),Color(0.33,0.25,0.52,0.95),1)); editor.add_child(character_name_input)
	var start:=Button.new(); start.position=Vector2(160,525); start.size=Vector2(365,44); start.text="COMENZAR VIAJE"; start.add_theme_font_size_override("font_size",14); _style_button(start); start.pressed.connect(_finish_character_setup); editor.add_child(start)
	var back:=Button.new(); back.position=Vector2(65,671); back.size=Vector2(145,32); back.text="VOLVER"; back.add_theme_font_size_override("font_size",9); _style_button(back); back.pressed.connect(_show_title); menu_layer.add_child(back)

	var pi:int=clampi(int(state.get("player_palette",0)),0,3); pending_palette=pi; _choose_palette(pi,palette_names[pi]); _choose_gender(pending_gender); _refresh_creator_labels()

func _add_creator_gender_row(parent:Control,y:float) -> void:
	_vlabel(parent,Vector2(28,y),Vector2(145,30),"SEXO",12,Color(0.78,0.81,0.92))
	var male:=Button.new(); male.position=Vector2(190,y-5); male.size=Vector2(185,34); male.text="MASCULINO"; male.add_theme_font_size_override("font_size",9); _style_button(male); male.pressed.connect(func(): _choose_gender("Masculino")); parent.add_child(male)
	var female:=Button.new(); female.position=Vector2(395,y-5); female.size=Vector2(185,34); female.text="FEMENINO"; female.add_theme_font_size_override("font_size",9); _style_button(female); female.pressed.connect(func(): _choose_gender("Femenino")); parent.add_child(female)

func _add_creator_cycle_row(parent:Control,y:float,label_text:String,key:String,count:int) -> void:
	_vlabel(parent,Vector2(28,y),Vector2(145,26),label_text,11,Color(0.78,0.81,0.92))
	var prev:=Button.new(); prev.position=Vector2(185,y-3); prev.size=Vector2(38,30); prev.text="◀"; _style_button(prev); prev.pressed.connect(_cycle_creator_option.bind(key,-1,count)); parent.add_child(prev)
	var value:=_vlabel(parent,Vector2(232,y),Vector2(320,25),"",10,Color(0.93,0.92,1.0)); value.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; creator_labels[key]=value
	var next:=Button.new(); next.position=Vector2(560,y-3); next.size=Vector2(38,30); next.text="▶"; _style_button(next); next.pressed.connect(_cycle_creator_option.bind(key,1,count)); parent.add_child(next)

func _cycle_creator_option(key:String,delta:int,count:int) -> void:
	creator_pending[key]=posmod(int(creator_pending.get(key,0))+delta,count)
	_refresh_creator_labels(); _refresh_creator_preview()

func _refresh_creator_labels() -> void:
	var names={
		"body":["BASE A","BASE B","BASE C"],
		"face":["ROSTRO 1","ROSTRO 2","ROSTRO 3","ROSTRO 4"],
		"hair":["CORTO","DESPEINADO","MEDIO","LARGO","CAPUCHA"],
		"hair_color":["NEGRO","CASTAÑO","COBRE","GRIS","VIOLETA"],
		"skin":["TONO I","TONO II","TONO III","TONO IV","TONO V"],
		"clothes":["VIAJERO","EXPLORADOR","PRISMÁTICO","PAMPEANO"]
	}
	for key in creator_labels.keys():
		var arr:Array=names[key]; (creator_labels[key] as Label).text=str(arr[clampi(int(creator_pending[key]),0,arr.size()-1)])

func _choose_gender(value:String) -> void:
	pending_gender=value if value in ["Masculino","Femenino"] else "Masculino"
	_refresh_creator_preview()

func _choose_palette(index:int,label_text:String) -> void:
	pending_palette=clampi(index,0,3)
	if palette_status_label: palette_status_label.text=label_text
	_refresh_creator_preview()

func _refresh_creator_preview() -> void:
	if not traveler_preview_v10: return
	traveler_preview_v10.texture=TRAVELER_FEMALE_V95 if pending_gender=="Femenino" else TRAVELER_MALE_V95
	var tints:Array[Color]=[Color.WHITE,Color(1.06,0.88,0.78),Color(0.78,1.05,1.02),Color(1.08,1.02,0.76)]
	traveler_preview_v10.modulate=tints[clampi(pending_palette,0,3)]

func _finish_character_setup() -> void:
	var chosen_name:String=character_name_input.text.strip_edges() if character_name_input else "Viajero"
	if chosen_name.is_empty(): chosen_name="Viajero"
	state["player_name"]=chosen_name; state["player_gender"]=pending_gender; state["player_palette"]=pending_palette
	state["creator_body"]=creator_pending["body"]; state["creator_face"]=creator_pending["face"]; state["creator_hair"]=creator_pending["hair"]; state["creator_hair_color"]=creator_pending["hair_color"]; state["creator_skin"]=creator_pending["skin"]; state["creator_clothes"]=creator_pending["clothes"]
	state["current_map"]=1; state["current_node"]=1; current_map=1
	SaveSystem.save_state(state); _start_level()

# -----------------------------------------------------------------------------
func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV9Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var weapon: Dictionary = state.get("weapon",{})
	var armor: Dictionary = state.get("armor",{})
	var charm: Dictionary = state.get("charm",{})
	var parenting_points := int(state.get("parenting_points",0))
	player.setup(self,100.0+float(armor.get("power",1.0))*2.0+parenting_points*2.0,float(weapon.get("power",1.0))+parenting_points*0.12,float(armor.get("power",1.0)),float(charm.get("power",1.0)))
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático")))
	player.died.connect(_on_player_died)

# Story pacing for the finished first block. NPCs snap to valid collision floor.
func _spawn_family_encounters(map_no: int) -> void:
	match map_no:
		1:
			_spawn_story_npc("Alexis",Vector2(420,420),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
			_spawn_story_npc("Ashley",Vector2(1650,360),"Escuchá Izrdralar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")
		2:
			_spawn_story_npc("Fermín",Vector2(980,420),"No todo se resuelve corriendo. A veces hay que aguantar el golpe, romper la defensa y recién entonces avanzar.")
		3:
			_spawn_story_npc("Gael",Vector2(1410,330),"Desde arriba se ven rutas que desde el suelo parecen imposibles. Mirá primero; después dispará.")
		4:
			_spawn_story_npc("Isabella",Vector2(1580,330),"El caos no significa perder el control. Significa aprender a dirigir algo que nunca va a obedecer del todo.")
		5:
			_spawn_story_npc("Alexis",Vector2(1980,420),"Después de este guardián vas a elegir una senda. No elijas por fuerza: elegí por cómo querés pelear.")

# Maps 1–5 already have functional neutral powers. Mentor abilities replace them.
func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	if bool(state.get("mentor_chosen",false)):
		super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class); return
	if slot == 3:
		_toast("F • La definitiva se desbloquea con un conjunto completo.",1.8); return
	var power := (14.0 + float(slot)*5.0) * multiplier
	match slot:
		0:
			_damage_cone(pos,facing_dir,205.0,power); _spawn_combat_fx("slash",pos+Vector2(facing_dir*48,-4),Color(0.54,0.72,1.0),78.0,0.22,facing_dir,1.0); _toast("APRENDIZ • Corte Prismático",1.2)
		1:
			_damage_radius(pos,145.0,power*0.55)
			if player and is_instance_valid(player): player.apply_armor_buff(3.5,0.18); player.heal(5.0)
			_spawn_combat_fx("buff",pos,Color(0.46,0.92,0.92),115.0,0.34,facing_dir,1.0); _toast("APRENDIZ • Pulso de Guardia",1.2)
		2:
			_damage_cone(pos,facing_dir,390.0,power*1.18); _spawn_combat_fx("arrow",pos+Vector2(facing_dir*42,-4),Color(0.74,0.42,1.0),165.0,0.30,facing_dir,1.15); _toast("APRENDIZ • Destello de Fisura",1.2)
	update_hud()

func update_hud() -> void:
	super.update_hud()
	if environment_badge: environment_badge.visible=false
	if map_title_panel_v10: map_title_panel_v10.visible=false
	if not bool(state.get("mentor_chosen",false)) and gear_label:
		gear_label.text = "%s • APRENDIZ PRISMÁTICO   |   Q CORTE • E GUARDIA • R DESTELLO • F SET" % str(state.get("player_name","Viajero"))
	if objective_label and current_map <= 5:
		var prompts := ["Explorá rutas altas y bajas • Q/E/R poderes prismáticos","Mantené impulso • combiná plataformas y combate","Bruma • buscá altura y secretos • Q/E/R activos","Noche • leé emboscadas y conservá movilidad","Tormenta • preparate para el Guardián del Bosque"]
		objective_label.text = prompts[clampi(current_map-1,0,4)]
