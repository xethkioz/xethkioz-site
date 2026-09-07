extends "res://scripts/main_v8.gd"

const PlayerV8Script = preload("res://scripts/player_v8.gd")
const BG_IZRDRALAR: Texture2D = preload("res://assets/v08/generated/izrdalar_bg.png")
const BG_MENU: Texture2D = preload("res://assets/v08/generated/menu_bg.png")
const BG_CREATOR: Texture2D = preload("res://assets/v08/generated/creator_bg.png")
const TILE_PLATFORM: Texture2D = preload("res://assets/v08/generated/platform_tile.png")
const TILE_GROUND: Texture2D = preload("res://assets/v08/generated/ground_tile.png")
const TEX_TRAVELER: Texture2D = preload("res://assets/v08/generated/traveler.png")
const TEX_XETH: Texture2D = preload("res://assets/v08/generated/xethkioz.png")
const PORTRAIT_ALEXIS: Texture2D = preload("res://assets/v08/generated/alexis_portrait.png")
const PORTRAIT_ASHLEY: Texture2D = preload("res://assets/v08/generated/ashley_portrait.png")

var hp_bar_v10: ProgressBar
var mana_bar_v10: ProgressBar
var stamina_bar_v10: ProgressBar
var traveler_preview_v10: TextureRect
var preview_aura_v10: ColorRect
var dialogue_portrait_v10: TextureRect
var map_title_panel_v10: Panel
var map_title_timer_v10 := 0.0

func _process(delta: float) -> void:
	super._process(delta)
	if map_title_timer_v10 > 0.0:
		map_title_timer_v10 -= delta
		if map_title_timer_v10 <= 0.0 and map_title_panel_v10:
			map_title_panel_v10.visible = false

func _panel_style(bg: Color = Color(0.02,0.025,0.05,0.92), border: Color = Color(0.38,0.22,0.62,0.95), width: int = 2) -> StyleBoxFlat:
	var box := StyleBoxFlat.new()
	box.bg_color = bg
	box.border_color = border
	box.set_border_width_all(width)
	box.corner_radius_top_left = 5
	box.corner_radius_top_right = 5
	box.corner_radius_bottom_left = 5
	box.corner_radius_bottom_right = 5
	box.shadow_color = Color(0,0,0,0.45)
	box.shadow_size = 5
	return box

func _style_button(button: Button) -> void:
	button.add_theme_stylebox_override("normal",_panel_style(Color(0.025,0.03,0.06,0.95),Color(0.28,0.22,0.46,0.95),2))
	button.add_theme_stylebox_override("hover",_panel_style(Color(0.10,0.055,0.18,0.98),Color(0.66,0.34,0.96,1.0),2))
	button.add_theme_stylebox_override("pressed",_panel_style(Color(0.16,0.07,0.26,1.0),Color(1.0,0.50,0.20,1.0),2))
	button.add_theme_color_override("font_color",Color(0.95,0.95,1.0))
	button.add_theme_color_override("font_hover_color",Color(1.0,0.78,0.42))

func _menu_button(text: String,pos: Vector2) -> Button:
	var button := Button.new()
	button.position = pos
	button.size = Vector2(360,50)
	button.text = text
	button.add_theme_font_size_override("font_size",16)
	_style_button(button)
	menu_layer.add_child(button)
	return button

func _vlabel(parent: Node,pos: Vector2,size: Vector2,text: String = "",font_size: int = 14,color: Color = Color(0.93,0.94,1.0)) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size
	label.text = text
	label.add_theme_font_size_override("font_size",font_size)
	label.add_theme_color_override("font_color",color)
	label.add_theme_color_override("font_shadow_color",Color(0,0,0,0.92))
	label.add_theme_constant_override("shadow_offset_x",1)
	label.add_theme_constant_override("shadow_offset_y",1)
	parent.add_child(label)
	return label

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

# ---------------------------------------------------------------------------
# Main menu
func _show_title() -> void:
	if world:
		world.queue_free()
		world = null
		player = null
		pet = null
	if hud_layer:
		hud_layer.visible = false
	if dialogue_layer:
		dialogue_layer.visible = false
	if menu_layer:
		menu_layer.queue_free()
	menu_layer = CanvasLayer.new()
	menu_layer.layer = 100
	add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.88,0.92,1.0))
	var shade := ColorRect.new()
	shade.position = Vector2.ZERO
	shade.size = Vector2(1280,720)
	shade.color = Color(0.005,0.01,0.025,0.34)
	menu_layer.add_child(shade)
	var title_panel := Panel.new()
	title_panel.position = Vector2(70,60)
	title_panel.size = Vector2(590,190)
	title_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.01,0.018,0.04,0.72),Color(0.50,0.30,0.78,0.88),2))
	menu_layer.add_child(title_panel)
	var title := _vlabel(title_panel,Vector2(22,22),Vector2(545,78),"WORLD OF XETHKIOZ",48,Color(0.76,0.48,1.0))
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var subtitle := _vlabel(title_panel,Vector2(22,100),Vector2(545,32),"ARGENTINA 2150 • LA FISURA PRISMÁTICA",16,Color(1.0,0.62,0.27))
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var motto := _vlabel(title_panel,Vector2(22,140),Vector2(545,28),"EXPLORÁ • COMBATÍ • DESCUBRÍ • TRASCENDÉ",12,Color(0.78,0.80,0.90))
	motto.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var menu_panel := Panel.new()
	menu_panel.position = Vector2(88,292)
	menu_panel.size = Vector2(390,335)
	menu_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.04,0.89),Color(0.34,0.22,0.56,0.96),2))
	menu_layer.add_child(menu_panel)
	var new_btn := _menu_button("NUEVA PARTIDA",Vector2(103,315))
	new_btn.pressed.connect(_new_game)
	var continue_btn := _menu_button("CONTINUAR",Vector2(103,375))
	continue_btn.pressed.connect(_continue_game)
	var atlas_btn := _menu_button("ATLAS DE ELIDA",Vector2(103,435))
	atlas_btn.pressed.connect(_open_atlas_from_title)
	var controls_btn := _menu_button("CONTROLES",Vector2(103,495))
	controls_btn.pressed.connect(func(): _toast("A/D mover • ESPACIO saltar • SHIFT dash • J/X atacar • G explorar • K/C legendario",5.0))
	var credits_btn := _menu_button("ESTADO DEL SLICE",Vector2(103,555))
	credits_btn.pressed.connect(func(): _toast("v0.8 • Izrdalar Vertical Slice • Mapa 1 en producción visual",4.0))
	var lore_panel := Panel.new()
	lore_panel.position = Vector2(820,430)
	lore_panel.size = Vector2(385,180)
	lore_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.01,0.018,0.035,0.72),Color(0.22,0.48,0.62,0.78),1))
	menu_layer.add_child(lore_panel)
	_vlabel(lore_panel,Vector2(22,18),Vector2(340,36),"IZRDRALAR TE ESPERA",22,Color(0.93,0.90,1.0))
	var copy := _vlabel(lore_panel,Vector2(22,58),Vector2(340,95),"La Argentina del año 2150 quedó atravesada por una fisura temporal. Un Viajero, cuatro hermanos y ocho legendarios deberán descubrir qué nació al otro lado.",14,Color(0.83,0.86,0.93))
	copy.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var footer := _vlabel(menu_layer,Vector2(45,680),Vector2(1190,24),"v0.8.0 • Vertical Slice visual • XETHKIOZ",11,Color(0.66,0.68,0.76))
	footer.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

# ---------------------------------------------------------------------------
# Character creator
func _show_character_setup() -> void:
	if hud_layer:
		hud_layer.visible = false
	if menu_layer:
		menu_layer.queue_free()
	menu_layer = CanvasLayer.new()
	menu_layer.layer = 108
	add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_CREATOR,Color(0.82,0.88,1.0))
	var shade := ColorRect.new()
	shade.position = Vector2.ZERO
	shade.size = Vector2(1280,720)
	shade.color = Color(0.01,0.01,0.03,0.28)
	menu_layer.add_child(shade)
	var title := _vlabel(menu_layer,Vector2(120,36),Vector2(1040,58),"CREÁ TU VIAJERO",36,Color(0.76,0.48,1.0))
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var preview_panel := Panel.new()
	preview_panel.position = Vector2(90,125)
	preview_panel.size = Vector2(425,490)
	preview_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.048,0.88),Color(0.42,0.29,0.66,0.96),2))
	menu_layer.add_child(preview_panel)
	preview_aura_v10 = ColorRect.new()
	preview_aura_v10.position = Vector2(55,48)
	preview_aura_v10.size = Vector2(310,320)
	preview_aura_v10.color = Color(0.50,0.25,0.85,0.12)
	preview_panel.add_child(preview_aura_v10)
	traveler_preview_v10 = TextureRect.new()
	traveler_preview_v10.position = Vector2(93,55)
	traveler_preview_v10.size = Vector2(235,315)
	traveler_preview_v10.texture = TEX_TRAVELER
	traveler_preview_v10.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	traveler_preview_v10.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	preview_panel.add_child(traveler_preview_v10)
	var xeth_preview := TextureRect.new()
	xeth_preview.position = Vector2(275,288)
	xeth_preview.size = Vector2(105,105)
	xeth_preview.texture = TEX_XETH
	xeth_preview.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	xeth_preview.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	preview_panel.add_child(xeth_preview)
	var role := _vlabel(preview_panel,Vector2(45,395),Vector2(335,54),"APRENDIZ PRISMÁTICO\nMentoría después del Mapa 5",14,Color(0.88,0.84,0.98))
	role.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var editor := Panel.new()
	editor.position = Vector2(565,125)
	editor.size = Vector2(625,490)
	editor.add_theme_stylebox_override("panel",_panel_style(Color(0.015,0.022,0.048,0.92),Color(0.42,0.29,0.66,0.96),2))
	menu_layer.add_child(editor)
	_vlabel(editor,Vector2(35,28),Vector2(140,34),"Nombre",16,Color(1.0,0.72,0.34))
	character_name_input = LineEdit.new()
	character_name_input.position = Vector2(185,22)
	character_name_input.size = Vector2(395,44)
	character_name_input.text = str(state.get("player_name","Viajero"))
	character_name_input.placeholder_text = "Viajero"
	character_name_input.max_length = 20
	character_name_input.add_theme_stylebox_override("normal",_panel_style(Color(0.02,0.022,0.04,0.97),Color(0.30,0.24,0.48,0.92),1))
	editor.add_child(character_name_input)
	_vlabel(editor,Vector2(35,98),Vector2(540,30),"AFINIDAD DE COLOR",15,Color(0.82,0.84,0.92))
	palette_status_label = _vlabel(editor,Vector2(35,136),Vector2(540,30),"Violeta Prismática",14,Color(0.76,0.48,1.0))
	palette_status_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var palette_names: Array[String] = ["VIOLETA PRISMÁTICA","COBRE PAMPEANO","TURQUESA ANCESTRAL","ORO CELESTE"]
	for i in range(4):
		var button := Button.new()
		button.position = Vector2(35+i*138,184)
		button.size = Vector2(124,72)
		button.text = palette_names[i]
		button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		button.add_theme_font_size_override("font_size",10)
		_style_button(button)
		button.pressed.connect(func(): _choose_palette(i,palette_names[i]))
		editor.add_child(button)
	var lore := _vlabel(editor,Vector2(35,286),Vector2(540,78),"Argentina, año 2150. La Fisura Prismática abrió Izrdalar. Tu identidad visual va a crecer con nuevas prendas, peinados y cosméticos a lo largo del desarrollo.",13,Color(0.77,0.80,0.88))
	lore.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var start := Button.new()
	start.position = Vector2(105,388)
	start.size = Vector2(415,58)
	start.text = "COMENZAR VIAJE"
	start.add_theme_font_size_override("font_size",18)
	_style_button(start)
	start.pressed.connect(_finish_character_setup)
	editor.add_child(start)
	_choose_palette(int(state.get("player_palette",0)),palette_names[clampi(int(state.get("player_palette",0)),0,3)])

func _choose_palette(index: int,label_text: String) -> void:
	super._choose_palette(index,label_text)
	var tints: Array[Color] = [Color(1.0,0.90,1.15),Color(1.12,0.88,0.75),Color(0.78,1.10,1.06),Color(1.10,1.03,0.76)]
	var tint: Color = tints[clampi(index,0,tints.size()-1)]
	if traveler_preview_v10:
		traveler_preview_v10.modulate = tint
	if preview_aura_v10:
		preview_aura_v10.color = Color(tint.r,tint.g,tint.b,0.13)

# ---------------------------------------------------------------------------
# Compact production HUD
func _setup_ui() -> void:
	hud_layer = CanvasLayer.new()
	hud_layer.layer = 30
	add_child(hud_layer)
	var stats := Panel.new()
	stats.position = Vector2(18,18)
	stats.size = Vector2(300,108)
	stats.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.040,0.91),Color(0.30,0.24,0.48,0.92),2))
	hud_layer.add_child(stats)
	var portrait := TextureRect.new()
	portrait.position = Vector2(28,27)
	portrait.size = Vector2(70,70)
	portrait.texture = TEX_TRAVELER
	portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	hud_layer.add_child(portrait)
	hp_bar_v10 = _hud_bar(Vector2(102,31),Vector2(192,17),Color(0.86,0.20,0.30))
	mana_bar_v10 = _hud_bar(Vector2(102,55),Vector2(192,14),Color(0.18,0.54,0.95))
	stamina_bar_v10 = _hud_bar(Vector2(102,77),Vector2(192,14),Color(0.22,0.72,0.40))
	health_label = _vlabel(hud_layer,Vector2(106,29),Vector2(184,18),"",10,Color.WHITE)
	supply_label = _vlabel(hud_layer,Vector2(104,95),Vector2(190,20),"",10,Color(0.84,0.86,0.92))
	var region_panel := Panel.new()
	region_panel.position = Vector2(900,18)
	region_panel.size = Vector2(360,76)
	region_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.040,0.86),Color(0.26,0.23,0.42,0.84),1))
	hud_layer.add_child(region_panel)
	map_label = _vlabel(hud_layer,Vector2(920,29),Vector2(315,24),"",14,Color(0.94,0.92,1.0))
	map_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	crystal_label = _vlabel(hud_layer,Vector2(920,57),Vector2(315,20),"",11,Color(0.70,0.88,1.0))
	crystal_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	gear_label = _vlabel(hud_layer,Vector2(-900,-900),Vector2(1,1),"",8)
	gear_label.visible = false
	var companion_panel := Panel.new()
	companion_panel.position = Vector2(18,612)
	companion_panel.size = Vector2(285,88)
	companion_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.040,0.89),Color(0.46,0.25,0.70,0.88),2))
	hud_layer.add_child(companion_panel)
	var companion_icon := TextureRect.new()
	companion_icon.position = Vector2(28,619)
	companion_icon.size = Vector2(70,70)
	companion_icon.texture = TEX_XETH
	companion_icon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	companion_icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	hud_layer.add_child(companion_icon)
	pet_label = _vlabel(hud_layer,Vector2(104,624),Vector2(178,42),"",12,Color(0.92,0.86,1.0))
	pet_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_vlabel(hud_layer,Vector2(104,670),Vector2(178,18),"K/C PODER • TAB CAMBIAR",9,Color(0.66,0.68,0.76))
	var skill_panel := Panel.new()
	skill_panel.position = Vector2(486,640)
	skill_panel.size = Vector2(310,60)
	skill_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.040,0.83),Color(0.28,0.24,0.44,0.82),1))
	hud_layer.add_child(skill_panel)
	for i in range(4):
		var slot := Panel.new()
		slot.position = Vector2(499+i*72,649)
		slot.size = Vector2(54,40)
		slot.add_theme_stylebox_override("panel",_panel_style(Color(0.07,0.045,0.12,0.94),Color(0.52,0.30,0.76,0.96),1))
		hud_layer.add_child(slot)
		var key := _vlabel(hud_layer,Vector2(499+i*72,652),Vector2(54,30),["Q","E","R","F"][i],18,Color(0.96,0.93,1.0))
		key.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	objective_label = _vlabel(hud_layer,Vector2(330,600),Vector2(620,28),"",12,Color(0.75,0.90,1.0))
	objective_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	boss_label = _vlabel(hud_layer,Vector2(390,142),Vector2(500,34),"",20,Color(1.0,0.66,0.35))
	boss_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	boss_label.visible = false
	toast_label = _vlabel(hud_layer,Vector2(350,540),Vector2(580,42),"",15,Color(1.0,0.78,0.42))
	toast_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast_label.visible = false
	map_title_panel_v10 = Panel.new()
	map_title_panel_v10.position = Vector2(330,180)
	map_title_panel_v10.size = Vector2(620,94)
	map_title_panel_v10.add_theme_stylebox_override("panel",_panel_style(Color(0.008,0.015,0.035,0.84),Color(0.50,0.31,0.76,0.94),2))
	hud_layer.add_child(map_title_panel_v10)
	map_title_panel_v10.visible = false
	var map_title := _vlabel(map_title_panel_v10,Vector2(20,14),Vector2(580,62),"IZRDRALAR — BOSQUE MÍSTICO\n01 • EL DESPERTAR DE IZRDRALAR",20,Color(0.95,0.91,1.0))
	map_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

func _hud_bar(pos: Vector2,size: Vector2,color: Color) -> ProgressBar:
	var bar := ProgressBar.new()
	bar.position = pos
	bar.size = size
	bar.min_value = 0.0
	bar.max_value = 100.0
	bar.value = 100.0
	bar.show_percentage = false
	bar.add_theme_stylebox_override("background",_panel_style(Color(0.02,0.024,0.04,0.97),Color(0.12,0.13,0.19,1.0),1))
	var fill := StyleBoxFlat.new()
	fill.bg_color = color
	fill.corner_radius_top_left = 3
	fill.corner_radius_top_right = 3
	fill.corner_radius_bottom_left = 3
	fill.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("fill",fill)
	hud_layer.add_child(bar)
	return bar

func update_hud() -> void:
	if not health_label:
		return
	if player and is_instance_valid(player):
		if hp_bar_v10:
			hp_bar_v10.max_value = maxf(1.0,float(player.max_health))
			hp_bar_v10.value = maxf(0.0,float(player.health))
			mana_bar_v10.max_value = maxf(1.0,float(player.max_mana))
			mana_bar_v10.value = maxf(0.0,float(player.mana))
			stamina_bar_v10.max_value = maxf(1.0,float(player.max_stamina))
			stamina_bar_v10.value = maxf(0.0,float(player.stamina))
		health_label.text = "VIDA %d/%d • MANÁ %d/%d" % [int(player.health),int(player.max_health),int(player.mana),int(player.max_mana)]
		supply_label.text = "STA %d/%d • RACIONES %d%%" % [int(player.stamina),int(player.max_stamina),int(supplies)]
	map_label.text = "IZRDRALAR • %02d/32" % current_map
	crystal_label.text = "◆ %d CRISTALES • PATERNIDAD %d" % [int(state.get("crystals",0)),int(state.get("parenting_points",0))]
	var idx := int(state.get("active_pet",0))
	if idx >= 0 and idx < pet_defs.size():
		pet_label.text = "%s\n%s" % [str(pet_defs[idx]["name"]),str(pet_defs[idx].get("element","Legendario"))]
	if current_map == 1:
		objective_label.text = "Llegá al Umbral • explorá rutas altas • G: resonancias legendarias"
	else:
		objective_label.text = _objective_text()

# ---------------------------------------------------------------------------
# Map 1 vertical slice
func _start_level() -> void:
	if hud_layer:
		hud_layer.visible = true
	super._start_level()
	if current_map == 1 and map_title_panel_v10:
		map_title_panel_v10.visible = true
		map_title_timer_v10 = 3.4

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV8Script)
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

func _add_visual_background() -> void:
	for i in range(3):
		var sprite := Sprite2D.new()
		sprite.texture = BG_IZRDRALAR
		sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		sprite.centered = false
		sprite.position = Vector2(i*1280,0)
		sprite.scale = Vector2(4.0,4.0)
		sprite.z_index = -100
		world.add_child(sprite)
	var haze := Polygon2D.new()
	haze.z_index = -20
	haze.polygon = PackedVector2Array([Vector2(-100,500),Vector2(3300,500),Vector2(3300,720),Vector2(-100,720)])
	haze.color = Color(0.04,0.13,0.14,0.12)
	world.add_child(haze)

func _generate_demo_level(map_no: int) -> void:
	if map_no != 1:
		super._generate_demo_level(map_no)
		return
	_add_visual_background()
	var biome: Dictionary = _biome()
	var difficulty := _difficulty()
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
	for enemy_pos in [Vector2(690,560),Vector2(1120,560),Vector2(1845,560),Vector2(2410,560),Vector2(2860,560)]:
		_spawn_enemy(enemy_pos,difficulty,0)
	for crystal_pos in [Vector2(565,435),Vector2(955,380),Vector2(1288,315),Vector2(1680,405),Vector2(2010,330),Vector2(2605,400),Vector2(2905,315)]:
		_spawn_pickup("crystal",crystal_pos)
	_spawn_pickup("food",Vector2(1515,555))
	_spawn_pickup("chest",Vector2(2130,555))
	_spawn_pickup("exit",Vector2(3090,545))
	_add_spike(Vector2(730,604),5.0)
	_add_spike(Vector2(1420,604),5.0)
	_add_spike(Vector2(2270,604),5.0)

func _add_platform(rect: Rect2,_color: Color) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = rect.position + rect.size/2.0
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	var visual := TextureRect.new()
	visual.position = -rect.size/2.0
	visual.size = rect.size
	visual.texture = TILE_GROUND if rect.size.y >= 70.0 else TILE_PLATFORM
	visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	visual.stretch_mode = TextureRect.STRETCH_TILE
	visual.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(visual)
	world.add_child(body)

func _spawn_family_encounters(map_no: int) -> void:
	if map_no != 1:
		super._spawn_family_encounters(map_no)
		return
	_spawn_story_npc("Alexis",Vector2(420,555),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
	_spawn_story_npc("Ashley",Vector2(1655,405),"Escuchá Izrdalar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")

# ---------------------------------------------------------------------------
# Dialogue
func show_family_dialogue(speaker: String,text: String,relationship: String,gender: String) -> void:
	_ensure_dialogue_ui()
	dialogue_layer.visible = true
	dialogue_name_label.text = speaker
	dialogue_meta_label.text = "%s • %s" % [relationship,gender]
	dialogue_body_label.text = text
	dialogue_timer = 5.8
	if dialogue_portrait_v10:
		match speaker:
			"Alexis": dialogue_portrait_v10.texture = PORTRAIT_ALEXIS
			"Ashley": dialogue_portrait_v10.texture = PORTRAIT_ASHLEY
			_: dialogue_portrait_v10.texture = TEX_TRAVELER

func _ensure_dialogue_ui() -> void:
	if dialogue_layer:
		return
	dialogue_layer = CanvasLayer.new()
	dialogue_layer.layer = 70
	add_child(dialogue_layer)
	var panel := Panel.new()
	panel.position = Vector2(105,505)
	panel.size = Vector2(1070,180)
	panel.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.01,0.025,0.97),Color(0.48,0.28,0.72,0.98),2))
	dialogue_layer.add_child(panel)
	dialogue_portrait_v10 = TextureRect.new()
	dialogue_portrait_v10.position = Vector2(128,527)
	dialogue_portrait_v10.size = Vector2(130,130)
	dialogue_portrait_v10.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	dialogue_portrait_v10.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	dialogue_layer.add_child(dialogue_portrait_v10)
	dialogue_name_label = _vlabel(dialogue_layer,Vector2(285,525),Vector2(280,34),"",22,Color(1.0,0.71,0.32))
	dialogue_meta_label = _vlabel(dialogue_layer,Vector2(570,531),Vector2(440,28),"",13,Color(0.66,0.68,0.76))
	dialogue_body_label = _vlabel(dialogue_layer,Vector2(285,570),Vector2(835,76),"",17,Color(0.95,0.95,0.98))
	dialogue_body_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_vlabel(dialogue_layer,Vector2(1010,647),Vector2(125,20),"AUTO",10,Color(0.58,0.60,0.70))

# ---------------------------------------------------------------------------
# Stop the slice after Map 1 until the visual standard is approved.
func _complete_map() -> void:
	if current_map != 1:
		super._complete_map()
		return
	if map_complete:
		return
	map_complete = true
	state["unlocked_map"] = max(int(state.get("unlocked_map",1)),2)
	state["current_map"] = 1
	state["supplies"] = supplies
	SaveSystem.save_state(state)
	_show_v08_milestone()

func _show_v08_milestone() -> void:
	if hud_layer:
		hud_layer.visible = false
	if menu_layer:
		menu_layer.queue_free()
	menu_layer = CanvasLayer.new()
	menu_layer.layer = 118
	add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_MENU,Color(0.67,0.74,0.82))
	var shade := ColorRect.new()
	shade.position = Vector2.ZERO
	shade.size = Vector2(1280,720)
	shade.color = Color(0.004,0.008,0.02,0.58)
	menu_layer.add_child(shade)
	var panel := Panel.new()
	panel.position = Vector2(240,130)
	panel.size = Vector2(800,455)
	panel.add_theme_stylebox_override("panel",_panel_style(Color(0.010,0.016,0.036,0.95),Color(0.50,0.30,0.76,0.98),2))
	menu_layer.add_child(panel)
	var title := _vlabel(panel,Vector2(50,38),Vector2(700,68),"EL DESPERTAR DE IZRDRALAR",31,Color(0.79,0.54,1.0))
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var copy := _vlabel(panel,Vector2(75,125),Vector2(650,110),"Vertical Slice v0.8 completado. Esta build corta acá a propósito: primero fijamos arte, cámara, HUD, diálogos y atmósfera del Mapa 1. Después llevamos este estándar al resto del juego.",16,Color(0.85,0.87,0.93))
	copy.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	copy.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var replay := Button.new()
	replay.position = Vector2(195,275)
	replay.size = Vector2(410,54)
	replay.text = "REJUGAR MAPA 1"
	_style_button(replay)
	replay.pressed.connect(func(): current_map=1; map_complete=false; _start_level())
	panel.add_child(replay)
	var back := Button.new()
	back.position = Vector2(195,342)
	back.size = Vector2(410,54)
	back.text = "VOLVER AL MENÚ"
	_style_button(back)
	back.pressed.connect(_show_title)
	panel.add_child(back)
