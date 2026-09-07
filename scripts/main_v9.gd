extends "res://scripts/main_v8.gd"

const PlayerV8Script = preload("res://scripts/player_v8.gd")
const BG_IZRDRALAR = preload("res://assets/v08/generated/izrdalar_bg.png")
const BG_MENU = preload("res://assets/v08/generated/menu_bg.png")
const BG_CREATOR = preload("res://assets/v08/generated/creator_bg.png")
const TILE_PLATFORM = preload("res://assets/v08/generated/platform_tile.png")
const TILE_GROUND = preload("res://assets/v08/generated/ground_tile.png")
const TEX_TRAVELER = preload("res://assets/v08/generated/traveler.png")
const TEX_XETH = preload("res://assets/v08/generated/xethkioz.png")
const PORTRAIT_ALEXIS = preload("res://assets/v08/generated/alexis_portrait.png")
const PORTRAIT_ASHLEY = preload("res://assets/v08/generated/ashley_portrait.png")

var hp_bar: ProgressBar
var mana_bar: ProgressBar
var stamina_bar: ProgressBar
var hud_portrait: TextureRect
var companion_icon: TextureRect
var traveler_preview: TextureRect
var preview_aura: ColorRect
var dialogue_portrait_v9: TextureRect
var map_title_timer := 0.0
var map_title_panel: Control

func _ready() -> void:
	super._ready()
	_bind("ui_cancel",KEY_ESCAPE)

func _process(delta: float) -> void:
	super._process(delta)
	if map_title_timer > 0.0:
		map_title_timer -= delta
		if map_title_timer <= 0.0 and map_title_panel:
			map_title_panel.visible = false

# ---------------------------------------------------------------------------
# Shared visual helpers
func _panel_style(bg: Color = Color(0.025,0.030,0.055,0.92),border: Color = Color(0.37,0.20,0.62,0.95),width: int = 2) -> StyleBoxFlat:
	var box := StyleBoxFlat.new()
	box.bg_color = bg
	box.border_color = border
	box.set_border_width_all(width)
	box.corner_radius_top_left = 6
	box.corner_radius_top_right = 6
	box.corner_radius_bottom_left = 6
	box.corner_radius_bottom_right = 6
	box.shadow_color = Color(0,0,0,0.45)
	box.shadow_size = 5
	return box

func _button_style(normal: Color, border: Color) -> StyleBoxFlat:
	var box := _panel_style(normal,border,2)
	box.content_margin_left = 14
	box.content_margin_right = 14
	return box

func _style_button(button: Button) -> void:
	button.add_theme_stylebox_override("normal",_button_style(Color(0.035,0.038,0.070,0.94),Color(0.30,0.22,0.48,0.95)))
	button.add_theme_stylebox_override("hover",_button_style(Color(0.11,0.065,0.19,0.98),Color(0.67,0.35,0.95,1.0)))
	button.add_theme_stylebox_override("pressed",_button_style(Color(0.18,0.08,0.28,1.0),Color(1.0,0.55,0.26,1.0)))
	button.add_theme_color_override("font_color",Color(0.95,0.95,1.0))
	button.add_theme_color_override("font_hover_color",Color(1.0,0.78,0.42))

func _menu_button(text: String,pos: Vector2) -> Button:
	var b := Button.new()
	b.position = pos
	b.size = Vector2(360,50)
	b.text = text
	b.add_theme_font_size_override("font_size",16)
	_style_button(b)
	menu_layer.add_child(b)
	return b

func _full_screen_texture(layer: CanvasLayer,texture: Texture2D,tint: Color = Color.WHITE) -> TextureRect:
	var bg := TextureRect.new()
	bg.position = Vector2.ZERO
	bg.size = Vector2(1280,720)
	bg.texture = texture
	bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	bg.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	bg.modulate = tint
	layer.add_child(bg)
	return bg

func _make_small_label(parent: Node,pos: Vector2,size: Vector2,text: String,font_size: int = 14,color: Color = Color(0.92,0.94,1.0)) -> Label:
	var l := Label.new()
	l.position = pos
	l.size = size
	l.text = text
	l.add_theme_font_size_override("font_size",font_size)
	l.add_theme_color_override("font_color",color)
	l.add_theme_color_override("font_shadow_color",Color(0,0,0,0.9))
	l.add_theme_constant_override("shadow_offset_x",1)
	l.add_theme_constant_override("shadow_offset_y",1)
	parent.add_child(l)
	return l

# ---------------------------------------------------------------------------
# Main menu
func _show_title() -> void:
	if world:
		world.queue_free(); world = null; player = null; pet = null
	if hud_layer: hud_layer.visible = false
	if dialogue_layer: dialogue_layer.visible = false
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer=100; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.90,0.92,1.0))
	var shade := ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.01,0.015,0.035,0.38); menu_layer.add_child(shade)
	var logo_panel := Panel.new(); logo_panel.position=Vector2(75,66); logo_panel.size=Vector2(570,190); logo_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.02,0.045,0.70),Color(0.48,0.28,0.75,0.75),2)); menu_layer.add_child(logo_panel)
	var title := _make_small_label(logo_panel,Vector2(22,24),Vector2(525,74),"WORLD OF XETHKIOZ",48,Color(0.76,0.49,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var tag := _make_small_label(logo_panel,Vector2(22,102),Vector2(525,44),"ARGENTINA 2150  •  LA FISURA PRISMÁTICA",16,Color(1.0,0.64,0.30)); tag.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var motto := _make_small_label(logo_panel,Vector2(22,143),Vector2(525,30),"EXPLORÁ  •  COMBATÍ  •  DESCUBRÍ  •  TRASCENDÉ",12,Color(0.76,0.78,0.90)); motto.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var menu_panel := Panel.new(); menu_panel.position=Vector2(90,292); menu_panel.size=Vector2(390,335); menu_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.018,0.021,0.044,0.87),Color(0.34,0.20,0.55,0.95),2)); menu_layer.add_child(menu_panel)
	var new_btn := _menu_button("NUEVA PARTIDA",Vector2(105,315)); new_btn.pressed.connect(_new_game)
	var cont_btn := _menu_button("CONTINUAR",Vector2(105,375)); cont_btn.pressed.connect(_continue_game)
	var atlas_btn := _menu_button("ATLAS DE ELIDA",Vector2(105,435)); atlas_btn.pressed.connect(_open_atlas_from_title)
	var ctrl_btn := _menu_button("CONTROLES",Vector2(105,495)); ctrl_btn.pressed.connect(func(): _toast("A/D mover • ESPACIO saltar • SHIFT dash • J/X atacar • G explorar • K/C legendario",5.0))
	var credits := _menu_button("CRÉDITOS / ESTADO",Vector2(105,555)); credits.pressed.connect(func(): _toast("v0.8 IZRDRALAR VERTICAL SLICE • arte de producción en progreso",4.0))
	var right_copy := Panel.new(); right_copy.position=Vector2(810,425); right_copy.size=Vector2(390,185); right_copy.add_theme_stylebox_override("panel",_panel_style(Color(0.01,0.018,0.035,0.70),Color(0.28,0.50,0.62,0.75),1)); menu_layer.add_child(right_copy)
	_make_small_label(right_copy,Vector2(22,20),Vector2(345,40),"IZRDRALAR TE ESPERA",22,Color(0.91,0.88,1.0))
	var copy := _make_small_label(right_copy,Vector2(22,66),Vector2(345,92),"La Argentina del año 2150 quedó atravesada por una fisura temporal. Un Viajero, cuatro hermanos y ocho legendarios deberán descubrir qué quedó del mundo… y qué nació después.",14,Color(0.82,0.85,0.92)); copy.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	_make_small_label(menu_layer,Vector2(45,675),Vector2(1190,26),"v0.8 • Vertical Slice visual • Godot 4.7.2 • XETHKIOZ",11,Color(0.66,0.68,0.77)).horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

# ---------------------------------------------------------------------------
# Character creation
func _show_character_setup() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=108; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_CREATOR,Color(0.82,0.87,1.0))
	var shade:=ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.015,0.012,0.035,0.30); menu_layer.add_child(shade)
	var title:=_make_small_label(menu_layer,Vector2(120,38),Vector2(1040,62),"CREÁ TU VIAJERO",36,Color(0.75,0.47,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var preview_panel:=Panel.new(); preview_panel.position=Vector2(95,128); preview_panel.size=Vector2(420,485); preview_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.018,0.024,0.050,0.86),Color(0.42,0.29,0.65,0.95),2)); menu_layer.add_child(preview_panel)
	preview_aura=ColorRect.new(); preview_aura.position=Vector2(58,55); preview_aura.size=Vector2(304,318); preview_aura.color=Color(0.42,0.20,0.76,0.12); preview_panel.add_child(preview_aura)
	traveler_preview=TextureRect.new(); traveler_preview.position=Vector2(92,60); traveler_preview.size=Vector2(235,315); traveler_preview.texture=TEX_TRAVELER; traveler_preview.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; traveler_preview.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; preview_panel.add_child(traveler_preview)
	var xeth_preview:=TextureRect.new(); xeth_preview.position=Vector2(276,290); xeth_preview.size=Vector2(105,105); xeth_preview.texture=TEX_XETH; xeth_preview.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; xeth_preview.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; preview_panel.add_child(xeth_preview)
	var role:=_make_small_label(preview_panel,Vector2(45,390),Vector2(330,55),"APRENDIZ PRISMÁTICO\nTu mentoría se define después del Mapa 5",14,Color(0.86,0.82,0.98)); role.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var editor:=Panel.new(); editor.position=Vector2(565,128); editor.size=Vector2(620,485); editor.add_theme_stylebox_override("panel",_panel_style(Color(0.018,0.024,0.050,0.91),Color(0.42,0.29,0.65,0.95),2)); menu_layer.add_child(editor)
	_make_small_label(editor,Vector2(35,30),Vector2(150,36),"Nombre",16,Color(1.0,0.72,0.34))
	character_name_input=LineEdit.new(); character_name_input.position=Vector2(190,24); character_name_input.size=Vector2(385,44); character_name_input.text=str(state.get("player_name","Viajero")); character_name_input.placeholder_text="Viajero"; character_name_input.max_length=20; character_name_input.add_theme_stylebox_override("normal",_panel_style(Color(0.02,0.022,0.04,0.95),Color(0.30,0.24,0.48,0.9),1)); editor.add_child(character_name_input)
	_make_small_label(editor,Vector2(35,100),Vector2(520,34),"AFINIDAD DE COLOR",15,Color(0.82,0.83,0.92))
	palette_status_label=_make_small_label(editor,Vector2(35,140),Vector2(540,32),"Violeta Prismática",14,Color(0.75,0.47,1.0)); palette_status_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var palette_names: Array=["VIOLETA PRISMÁTICA","COBRE PAMPEANO","TURQUESA ANCESTRAL","ORO CELESTE"]
	var palette_colors: Array=[Color(0.62,0.30,1.0),Color(0.88,0.35,0.14),Color(0.18,0.72,0.72),Color(0.92,0.70,0.18)]
	for i in range(4):
		var b:=Button.new(); b.position=Vector2(35+i*137,188); b.size=Vector2(122,74); b.text=palette_names[i].replace(" ","\n",1); b.add_theme_font_size_override("font_size",10); _style_button(b); b.add_theme_color_override("font_hover_color",palette_colors[i].lightened(0.25)); b.pressed.connect(func(): _choose_palette(i,palette_names[i])); editor.add_child(b)
	var lore:=_make_small_label(editor,Vector2(35,288),Vector2(540,72),"Argentina, año 2150. La Fisura Prismática abrió Izrdralar. La personalización visual seguirá creciendo con cabello, rostro y ropa desbloqueable durante la aventura.",13,Color(0.76,0.79,0.87)); lore.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var start:=Button.new(); start.position=Vector2(105,385); start.size=Vector2(410,58); start.text="COMENZAR VIAJE"; start.add_theme_font_size_override("font_size",18); _style_button(start); start.pressed.connect(_finish_character_setup); editor.add_child(start)
	_choose_palette(int(state.get("player_palette",0)),palette_names[clampi(int(state.get("player_palette",0)),0,3)])

func _choose_palette(index: int,label_text: String) -> void:
	super._choose_palette(index,label_text)
	var colors: Array=[Color(0.94,0.86,1.12),Color(1.08,0.83,0.72),Color(0.76,1.08,1.04),Color(1.08,1.00,0.72)]
	if traveler_preview:
		traveler_preview.modulate=colors[clampi(index,0,3)]
	if preview_aura:
		var c: Color=colors[clampi(index,0,3)]
		preview_aura.color=Color(c.r,c.g,c.b,0.12)

# ---------------------------------------------------------------------------
# HUD
func _setup_ui() -> void:
	hud_layer=CanvasLayer.new(); hud_layer.layer=30; add_child(hud_layer)
	var stats:=Panel.new(); stats.position=Vector2(18,18); stats.size=Vector2(305,112); stats.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.045,0.90),Color(0.30,0.24,0.48,0.90),2)); hud_layer.add_child(stats)
	hud_portrait=TextureRect.new(); hud_portrait.position=Vector2(28,27); hud_portrait.size=Vector2(72,72); hud_portrait.texture=TEX_TRAVELER; hud_portrait.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; hud_portrait.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; hud_layer.add_child(hud_portrait)
	hp_bar=_hud_bar(Vector2(102,31),Vector2(198,18),Color(0.86,0.20,0.30)); mana_bar=_hud_bar(Vector2(102,56),Vector2(198,15),Color(0.18,0.54,0.95)); stamina_bar=_hud_bar(Vector2(102,79),Vector2(198,15),Color(0.22,0.72,0.40))
	health_label=_make_small_label(hud_layer,Vector2(106,29),Vector2(190,19),11); supply_label=_make_small_label(hud_layer,Vector2(106,94),Vector2(190,20),11,Color(0.85,0.86,0.91))
	var top_right:=Panel.new(); top_right.position=Vector2(870,18); top_right.size=Vector2(390,78); top_right.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.045,0.86),Color(0.25,0.22,0.42,0.82),1)); hud_layer.add_child(top_right)
	map_label=_make_small_label(hud_layer,Vector2(890,29),Vector2(345,25),15,Color(0.94,0.91,1.0)); map_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
	crystal_label=_make_small_label(hud_layer,Vector2(890,58),Vector2(345,22),12,Color(0.70,0.88,1.0)); crystal_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
	gear_label=_make_small_label(hud_layer,Vector2(-1000,-1000),Vector2(10,10),8); gear_label.visible=false
	var companion:=Panel.new(); companion.position=Vector2(18,606); companion.size=Vector2(290,94); companion.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.045,0.88),Color(0.46,0.25,0.70,0.86),2)); hud_layer.add_child(companion)
	companion_icon=TextureRect.new(); companion_icon.position=Vector2(28,614); companion_icon.size=Vector2(72,72); companion_icon.texture=TEX_XETH; companion_icon.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; companion_icon.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; hud_layer.add_child(companion_icon)
	pet_label=_make_small_label(hud_layer,Vector2(104,620),Vector2(185,48),12,Color(0.92,0.86,1.0)); pet_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	_make_small_label(hud_layer,Vector2(104,670),Vector2(178,18),10,"K/C PODER  •  TAB CAMBIAR" if false else 10)
	var controls:=Panel.new(); controls.position=Vector2(485,635); controls.size=Vector2(310,64); controls.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.045,0.82),Color(0.28,0.24,0.44,0.80),1)); hud_layer.add_child(controls)
	for i in range(4):
		var key: String=["Q","E","R","F"][i]
		var slot:=Panel.new(); slot.position=Vector2(498+i*72,646); slot.size=Vector2(54,42); slot.add_theme_stylebox_override("panel",_panel_style(Color(0.07,0.045,0.12,0.92),Color(0.52,0.30,0.76,0.95),1)); hud_layer.add_child(slot)
		var kl:=_make_small_label(hud_layer,Vector2(498+i*72,650),Vector2(54,32),18,key,Color(0.96,0.93,1.0)); kl.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	objective_label=_make_small_label(hud_layer,Vector2(335,596),Vector2(610,30),13,Color(0.75,0.90,1.0)); objective_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	boss_label=_make_small_label(hud_layer,Vector2(390,145),Vector2(500,34),20,Color(1.0,0.66,0.35)); boss_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; boss_label.visible=false
	toast_label=_make_small_label(hud_layer,Vector2(350,535),Vector2(580,48),16,Color(1.0,0.78,0.42)); toast_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; toast_label.visible=false
	map_title_panel=Panel.new(); map_title_panel.position=Vector2(330,180); map_title_panel.size=Vector2(620,96); map_title_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.01,0.02,0.04,0.82),Color(0.50,0.31,0.76,0.92),2)); hud_layer.add_child(map_title_panel); map_title_panel.visible=false
	var mt:=_make_small_label(map_title_panel,Vector2(20,15),Vector2(580,62),"IZRDRALAR — BOSQUE MÍSTICO\n01 • EL DESPERTAR DE IZRDRALAR",20,Color(0.95,0.91,1.0)); mt.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

func _hud_bar(pos: Vector2,size: Vector2,color: Color) -> ProgressBar:
	var bar:=ProgressBar.new(); bar.position=pos; bar.size=size; bar.min_value=0.0; bar.max_value=100.0; bar.value=100.0; bar.show_percentage=false
	bar.add_theme_stylebox_override("background",_panel_style(Color(0.02,0.024,0.04,0.96),Color(0.12,0.13,0.19,1.0),1))
	var fill:=StyleBoxFlat.new(); fill.bg_color=color; fill.corner_radius_top_left=3; fill.corner_radius_top_right=3; fill.corner_radius_bottom_left=3; fill.corner_radius_bottom_right=3; bar.add_theme_stylebox_override("fill",fill); hud_layer.add_child(bar); return bar

func update_hud() -> void:
	super.update_hud()
	if not hp_bar: return
	if player and is_instance_valid(player):
		hp_bar.max_value=maxf(1.0,float(player.max_health)); hp_bar.value=maxf(0.0,float(player.health))
		mana_bar.max_value=maxf(1.0,float(player.max_mana)); mana_bar.value=maxf(0.0,float(player.mana))
		stamina_bar.max_value=maxf(1.0,float(player.max_stamina)); stamina_bar.value=maxf(0.0,float(player.stamina))
		health_label.text="VIDA %d/%d   •   MANÁ %d/%d" % [int(player.health),int(player.max_health),int(player.mana),int(player.max_mana)]
		supply_label.text="STAMINA %d/%d  •  RACIONES %d%%" % [int(player.stamina),int(player.max_stamina),int(supplies)]
	map_label.text="IZRDRALAR  •  %02d/32" % current_map
	crystal_label.text="CRISTALES  ◆ %d    •    PATERNIDAD %d" % [int(state.get("crystals",0)),int(state.get("parenting_points",0))]
	var idx: int=int(state.get("active_pet",0))
	if idx>=0 and idx<pet_defs.size(): pet_label.text="%s\n%s" % [str(pet_defs[idx]["name"]),str(pet_defs[idx].get("element","Legendario"))]
	if current_map==1:
		objective_label.text="Llegá al Umbral • explorá rutas altas y escuchá los ecos de Xethkioz"

# ---------------------------------------------------------------------------
# Map 1 visual slice
func _start_level() -> void:
	if hud_layer: hud_layer.visible=true
	super._start_level()
	if current_map==1 and map_title_panel:
		map_title_panel.visible=true; map_title_timer=3.4

func _spawn_player() -> void:
	player=CharacterBody2D.new(); player.set_script(PlayerV8Script); world.add_child(player); player.position=Vector2(120,520)
	var w: Dictionary=state.get("weapon",{}); var a: Dictionary=state.get("armor",{}); var c: Dictionary=state.get("charm",{}); var pp: int=int(state.get("parenting_points",0))
	player.setup(self,100.0+float(a.get("power",1.0))*2.0+pp*2.0,float(w.get("power",1.0))+pp*0.12,float(a.get("power",1.0)),float(c.get("power",1.0)))
	var build: Dictionary=WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build); player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0))); player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático"))); player.died.connect(_on_player_died)

func _add_visual_background() -> void:
	for i in range(3):
		var s:=Sprite2D.new(); s.texture=BG_IZRDRALAR; s.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; s.centered=false; s.position=Vector2(i*1280,0); s.scale=Vector2(4.0,4.0); s.z_index=-100; world.add_child(s)
	var haze:=Polygon2D.new(); haze.z_index=-20; haze.polygon=PackedVector2Array([Vector2(-100,500),Vector2(3300,500),Vector2(3300,720),Vector2(-100,720)]); haze.color=Color(0.04,0.13,0.14,0.14); world.add_child(haze)

func _generate_demo_level(map_no: int) -> void:
	if map_no != 1:
		super._generate_demo_level(map_no); return
	_add_visual_background()
	var biome: Dictionary=_biome(); var difficulty: float=_difficulty()
	_add_platform(Rect2(-100,620,790,120),biome["ground"])
	_add_platform(Rect2(770,620,610,120),biome["ground"])
	_add_platform(Rect2(1465,620,760,120),biome["ground"])
	_add_platform(Rect2(2315,620,900,120),biome["ground"])
	_add_platform(Rect2(500,485,180,24),biome["accent"])
	_add_platform(Rect2(870,430,175,24),biome["accent"])
	_add_platform(Rect2(1205,365,165,24),biome["accent"])
	_add_platform(Rect2(1595,455,190,24),biome["accent"])
	_add_platform(Rect2(1925,380,175,24),biome["accent"])
	_add_platform(Rect2(2525,450,190,24),biome["accent"])
	_add_platform(Rect2(2825,365,165,24),biome["accent"])
	for pos in [Vector2(690,560),Vector2(1120,560),Vector2(1845,560),Vector2(2410,560),Vector2(2860,560)]: _spawn_enemy(pos,difficulty,0)
	for pos in [Vector2(565,435),Vector2(955,380),Vector2(1288,315),Vector2(1680,405),Vector2(2010,330),Vector2(2605,400),Vector2(2905,315)]: _spawn_pickup("crystal",pos)
	_spawn_pickup("food",Vector2(1515,555)); _spawn_pickup("chest",Vector2(2130,555)); _spawn_pickup("exit",Vector2(3090,545))
	_add_spike(Vector2(730,604),5.0); _add_spike(Vector2(1420,604),5.0); _add_spike(Vector2(2270,604),5.0)

func _add_platform(rect: Rect2,color: Color) -> void:
	var body:=StaticBody2D.new(); body.collision_layer=2; body.collision_mask=0; body.position=rect.position+rect.size/2.0
	var cs:=CollisionShape2D.new(); var sh:=RectangleShape2D.new(); sh.size=rect.size; cs.shape=sh; body.add_child(cs)
	var sprite:=Sprite2D.new(); var tex: Texture2D=TILE_GROUND if rect.size.y>=70.0 else TILE_PLATFORM; sprite.texture=tex; sprite.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; sprite.scale=Vector2(rect.size.x/float(tex.get_width()),rect.size.y/float(tex.get_height())); sprite.modulate=Color(0.92,0.98,0.96); body.add_child(sprite); world.add_child(body)

func _spawn_family_encounters(map_no: int) -> void:
	if map_no!=1:
		super._spawn_family_encounters(map_no); return
	_spawn_story_npc("Alexis",Vector2(420,555),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
	_spawn_story_npc("Ashley",Vector2(1655,405),"Escuchá Izrdralar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")

# ---------------------------------------------------------------------------
# Dialogue presentation
func show_family_dialogue(speaker: String,text: String,relationship: String,gender: String) -> void:
	_ensure_dialogue_ui(); dialogue_layer.visible=true; dialogue_name_label.text=speaker; dialogue_meta_label.text="%s • %s" % [relationship,gender]; dialogue_body_label.text=text; dialogue_timer=5.8
	if dialogue_portrait_v9:
		match speaker:
			"Alexis": dialogue_portrait_v9.texture=PORTRAIT_ALEXIS
			"Ashley": dialogue_portrait_v9.texture=PORTRAIT_ASHLEY
			_: dialogue_portrait_v9.texture=TEX_TRAVELER

func _ensure_dialogue_ui() -> void:
	if dialogue_layer: return
	dialogue_layer=CanvasLayer.new(); dialogue_layer.layer=70; add_child(dialogue_layer)
	var panel:=Panel.new(); panel.position=Vector2(105,505); panel.size=Vector2(1070,180); panel.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.012,0.027,0.96),Color(0.48,0.28,0.72,0.98),2)); dialogue_layer.add_child(panel)
	dialogue_portrait_v9=TextureRect.new(); dialogue_portrait_v9.position=Vector2(128,527); dialogue_portrait_v9.size=Vector2(130,130); dialogue_portrait_v9.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; dialogue_portrait_v9.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED; dialogue_layer.add_child(dialogue_portrait_v9)
	dialogue_name_label=_make_small_label(dialogue_layer,Vector2(285,525),Vector2(280,34),22,Color(1.0,0.71,0.32))
	dialogue_meta_label=_make_small_label(dialogue_layer,Vector2(570,531),Vector2(440,28),13,Color(0.66,0.68,0.76))
	dialogue_body_label=_make_small_label(dialogue_layer,Vector2(285,570),Vector2(835,76),17,Color(0.95,0.95,0.98)); dialogue_body_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var hint:=_make_small_label(dialogue_layer,Vector2(1010,647),Vector2(125,20),10,"AUTO",Color(0.58,0.60,0.70))

# ---------------------------------------------------------------------------
# Vertical slice completion: do not throw the player straight back into legacy art.
func _complete_map() -> void:
	if current_map!=1:
		super._complete_map(); return
	if map_complete: return
	map_complete=true
	state["unlocked_map"]=max(int(state.get("unlocked_map",1)),2); state["current_map"]=1; state["supplies"]=supplies; SaveSystem.save_state(state)
	_show_v08_milestone()

func _show_v08_milestone() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=118; add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.66,0.72,0.80))
	var shade:=ColorRect.new(); shade.position=Vector2.ZERO; shade.size=Vector2(1280,720); shade.color=Color(0.005,0.008,0.02,0.55); menu_layer.add_child(shade)
	var panel:=Panel.new(); panel.position=Vector2(240,130); panel.size=Vector2(800,455); panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.038,0.94),Color(0.50,0.30,0.76,0.98),2)); menu_layer.add_child(panel)
	var t:=_make_small_label(panel,Vector2(50,38),Vector2(700,68),"EL DESPERTAR DE IZRDRALAR",31,Color(0.79,0.54,1.0)); t.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var c:=_make_small_label(panel,Vector2(75,125),Vector2(650,105),"Vertical Slice v0.8 completado. Esta versión corta acá a propósito: el objetivo es fijar primero la calidad visual, cámara, HUD, personajes y atmósfera del Mapa 1 antes de extender ese estándar al resto de la campaña.",16,Color(0.85,0.87,0.93)); c.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; c.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var replay:=Button.new(); replay.position=Vector2(195,270); replay.size=Vector2(410,54); replay.text="REJUGAR MAPA 1"; _style_button(replay); replay.pressed.connect(func(): current_map=1; map_complete=false; _start_level()); panel.add_child(replay)
	var atlas:=Button.new(); atlas.position=Vector2(195,337); atlas.size=Vector2(410,54); atlas.text="ATLAS / VOLVER AL MENÚ"; _style_button(atlas); atlas.pressed.connect(_show_title); panel.add_child(atlas)
