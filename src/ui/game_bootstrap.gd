extends Control

const GAME_SCENE := "res://scenes/v34/GoldenRegion.tscn"
const TITLE_ART := preload("res://assets/production/ui/title_izrdralar.svg")
const INTRO_ART := preload("res://assets/production/ui/intro_chapters.svg")
const CreatorPreviewScript := preload("res://src/ui/character_creator_preview.gd")

const C_BG := Color("071019")
const C_PANEL := Color(0.035, 0.045, 0.075, 0.94)
const C_TEXT := Color("f0f0f5")
const C_MUTED := Color("9b9baa")
const C_VIOLET := Color("8b5cf6")
const C_ORANGE := Color("ff8c42")
const C_WATER := Color("3fc7c9")

var content: Control
var splash_timer := 0.0
var splash_active := true
var intro_index := 0

var name_edit: LineEdit
var body_option: OptionButton
var skin_option: OptionButton
var hair_option: OptionButton
var hair_color_option: OptionButton
var accent_option: OptionButton
var preview_sprite: Control
var preview_name: Label

const INTRO := [
	{
		"title": "ARGENTINA · AÑO 2150",
		"text": "La Fisura Prismática no destruyó el mundo. Lo superpuso. Tecnología, naturaleza, magia y planos antiguos comenzaron a ocupar el mismo lugar."
	},
	{
		"title": "IZRDRALAR",
		"text": "Entre bosques alterados, ruinas del futuro y resonancias imposibles nació una tierra nueva. Algunos lugares recuerdan cosas que todavía no sucedieron."
	},
	{
		"title": "CUATRO VOCES EN EL TIEMPO",
		"text": "Ashley, Fermín, Isabella y Gael quedaron atrapados en un colapso temporal. Su familia sigue buscando respuestas. Cada uno aprendió una forma distinta de sobrevivir."
	},
	{
		"title": "EL DESPERTAR",
		"text": "No sabés exactamente cómo llegaste. Cuando abrís los ojos, una criatura prismática ya está junto a vos. Su nombre es Xethkioz. Y parece conocerte."
	}
]

func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_build_shell()
	_show_splash()

func _process(delta: float) -> void:
	if splash_active:
		splash_timer -= delta
		if splash_timer <= 0.0 or Input.is_action_just_pressed("ui_accept"):
			splash_active = false
			_show_main_menu()

func _build_shell() -> void:
	var background := TextureRect.new()
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.texture = TITLE_ART
	background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	background.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	background.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)

	var cinematic_tint := ColorRect.new()
	cinematic_tint.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	cinematic_tint.color = Color(0.018, 0.027, 0.043, 0.18)
	cinematic_tint.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(cinematic_tint)

	content = Control.new()
	content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(content)

func _clear_content() -> void:
	for child in content.get_children():
		child.queue_free()

func _show_splash() -> void:
	_clear_content()
	splash_active = true
	splash_timer = 1.4
	var veil := _panel(Vector2(74,104), Vector2(492,126), Color(0.02,0.03,0.05,0.76), C_VIOLET)
	veil.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var title := _label(Vector2(90,120), Vector2(460,62), "WORLD OF XETHKIOZ", 34, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	title.add_theme_color_override("font_outline_color", Color(0.45,0.24,0.85,0.95))
	title.add_theme_constant_override("outline_size", 4)
	_label(Vector2(120,186), Vector2(400,24), "GAMING IS MY PASSION · BEYOND THE GAME", 10, Color("d8ceff"), false, HORIZONTAL_ALIGNMENT_CENTER)
	_label(Vector2(160,316), Vector2(320,18), "Presioná ENTER para continuar", 8, C_TEXT, false, HORIZONTAL_ALIGNMENT_CENTER)

func _show_main_menu() -> void:
	_clear_content()
	var header := _panel(Vector2(28,24), Vector2(382,105), Color(0.02,0.03,0.05,0.77), C_VIOLET)
	header.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_label(Vector2(42,37), Vector2(350,42), "WORLD OF XETHKIOZ", 27, C_TEXT, true)
	_label(Vector2(44,78), Vector2(330,18), "IZRDRALAR · LAS RAÍCES VIVAS", 10, Color("d8ceff"), true)
	_label(Vector2(44,99), Vector2(340,20), "Un mundo fracturado. Una familia unida.", 8, C_MUTED)

	var menu := _panel(Vector2(38,154), Vector2(224,174), Color(0.025,0.035,0.055,0.92), C_VIOLET)
	var continue_button := _button(Vector2(18,16), Vector2(188,28), "CONTINUAR")
	continue_button.disabled = not SaveService.has_save()
	continue_button.pressed.connect(_continue_game)
	menu.add_child(continue_button)
	var new_button := _button(Vector2(18,50), Vector2(188,28), "NUEVA PARTIDA")
	new_button.pressed.connect(_show_creator)
	menu.add_child(new_button)
	var settings_button := _button(Vector2(18,84), Vector2(188,28), "OPCIONES")
	settings_button.pressed.connect(_show_settings)
	menu.add_child(settings_button)
	var credits_button := _button(Vector2(18,118), Vector2(91,28), "CRÉDITOS")
	credits_button.pressed.connect(_show_credits)
	menu.add_child(credits_button)
	var exit_button := _button(Vector2(115,118), Vector2(91,28), "SALIR")
	exit_button.pressed.connect(func(): get_tree().quit())
	menu.add_child(exit_button)

	var lore_panel := _panel(Vector2(432,166), Vector2(174,146), Color(0.018,0.045,0.052,0.87), C_WATER)
	var prism := _local_label(Vector2(0,15), Vector2(174,44), "◇", 40, C_VIOLET, true, HORIZONTAL_ALIGNMENT_CENTER)
	lore_panel.add_child(prism)
	var region := _local_label(Vector2(12,63), Vector2(150,18), "IZRDRALAR", 13, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	lore_panel.add_child(region)
	var sub := _local_label(Vector2(12,87), Vector2(150,42), "Explorá. Formá lazos.\nDescubrí la verdad\nde Xethkioz.", 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
	sub.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lore_panel.add_child(sub)

func _show_creator() -> void:
	_clear_content()
	var header := _panel(Vector2(22,15), Vector2(596,58), Color(0.018,0.027,0.045,0.88), C_VIOLET)
	header.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_label(Vector2(34,24), Vector2(260,28), "CREAR VIAJERO", 21, C_TEXT, true)
	_label(Vector2(294,28), Vector2(304,22), "Tu clase se construye dentro de Izrdralar.", 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_RIGHT)

	var editor := _panel(Vector2(28,84), Vector2(350,244), Color(0.025,0.035,0.055,0.95), C_VIOLET)
	var name_label := _local_label(Vector2(18,14), Vector2(95,18), "NOMBRE", 8, C_MUTED, true)
	editor.add_child(name_label)
	name_edit = LineEdit.new()
	name_edit.position = Vector2(112,10)
	name_edit.size = Vector2(214,26)
	name_edit.max_length = 18
	name_edit.text = CharacterProfile.player_name
	_style_field(name_edit)
	name_edit.text_changed.connect(func(_v): _update_creator_preview())
	editor.add_child(name_edit)

	body_option = _creator_option(editor, 48, "COMPLEXIÓN", CharacterProfile.BODY_NAMES, CharacterProfile.body_type)
	skin_option = _creator_option(editor, 80, "TONO DE PIEL", ["Tono I","Tono II","Tono III","Tono IV","Tono V","Tono VI"], CharacterProfile.skin_tone)
	hair_option = _creator_option(editor, 112, "CABELLO", CharacterProfile.HAIR_NAMES, CharacterProfile.hair_style)
	hair_color_option = _creator_option(editor, 144, "COLOR CABELLO", ["Negro","Castaño","Cobre","Dorado","Violeta","Ceniza"], CharacterProfile.hair_color)
	accent_option = _creator_option(editor, 176, "ACENTO EQUIPO", ["Prisma","Ámbar","Cian","Bosque","Rosa","Oro"], CharacterProfile.accent_color)

	var back := _button(Vector2(18,211), Vector2(96,24), "VOLVER")
	back.pressed.connect(_show_main_menu)
	editor.add_child(back)
	var confirm := _button(Vector2(120,211), Vector2(206,24), "COMENZAR VIAJE")
	confirm.pressed.connect(_confirm_character)
	editor.add_child(confirm)

	var preview := _panel(Vector2(396,84), Vector2(216,244), Color(0.018,0.045,0.052,0.95), C_ORANGE)
	preview_name = _local_label(Vector2(12,13), Vector2(192,20), "VIAJERO", 11, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	preview.add_child(preview_name)
	preview_sprite = Control.new()
	preview_sprite.name = "LiveViajeroPreview"
	preview_sprite.position = Vector2(42,38)
	preview_sprite.size = Vector2(132,108)
	preview_sprite.set_script(CreatorPreviewScript)
	preview.add_child(preview_sprite)
	var profile_title := _local_label(Vector2(18,151), Vector2(180,16), "VISTA DE CAMPO", 7, C_ORANGE, true, HORIZONTAL_ALIGNMENT_CENTER)
	preview.add_child(profile_title)
	var note := _local_label(Vector2(18,171), Vector2(180,48), "La complexión, piel, cabello y\nacento se previsualizan antes de\nentrar al mundo.", 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
	preview.add_child(note)
	_update_creator_preview()

func _creator_option(parent: Control, y: float, label_text: String, values: Array, selected: int) -> OptionButton:
	var label := _local_label(Vector2(18,y+3), Vector2(118,18), label_text, 7, C_MUTED, true)
	parent.add_child(label)
	var option := OptionButton.new()
	option.position = Vector2(142,y)
	option.size = Vector2(184,25)
	for value in values:
		option.add_item(str(value))
	option.select(clampi(selected, 0, maxi(0, values.size()-1)))
	_style_field(option)
	option.item_selected.connect(func(_index): _update_creator_preview())
	parent.add_child(option)
	return option

func _update_creator_preview() -> void:
	if preview_sprite == null:
		return
	var body_index: int = body_option.selected if body_option else CharacterProfile.body_type
	var skin_index: int = skin_option.selected if skin_option else CharacterProfile.skin_tone
	var hair_style_index: int = hair_option.selected if hair_option else CharacterProfile.hair_style
	var hair_index: int = hair_color_option.selected if hair_color_option else CharacterProfile.hair_color
	var accent_index: int = accent_option.selected if accent_option else CharacterProfile.accent_color
	var skin: Color = CharacterProfile.SKIN_COLORS[skin_index]
	var hair: Color = CharacterProfile.HAIR_COLORS[hair_index]
	var accent: Color = CharacterProfile.ACCENT_COLORS[accent_index]
	if preview_sprite.has_method("configure_visual"):
		preview_sprite.call("configure_visual", body_index, skin, hair_style_index, hair, accent)
	var display_name: String = name_edit.text.strip_edges() if name_edit else CharacterProfile.player_name
	preview_name.text = display_name.to_upper() if not display_name.is_empty() else "VIAJERO"

func _confirm_character() -> void:
	GameState.reset_new_game()
	InventoryService.reset()
	CharacterProfile.configure(name_edit.text, body_option.selected, skin_option.selected, hair_option.selected, hair_color_option.selected, accent_option.selected)
	SaveService.save_game({"intro_seen": false})
	intro_index = 0
	_show_intro()

func _show_intro() -> void:
	_clear_content()
	var slide: Dictionary = INTRO[intro_index]
	var vignette := TextureRect.new()
	vignette.position = Vector2(64,24)
	vignette.size = Vector2(512,288)
	vignette.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	vignette.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	vignette.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	vignette.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var frame := AtlasTexture.new()
	frame.atlas = INTRO_ART
	frame.region = Rect2(Vector2(intro_index * 256, 0), Vector2(256, 144))
	vignette.texture = frame
	content.add_child(vignette)

	var chapter_panel := _panel(Vector2(78,170), Vector2(484,116), Color(0.015,0.022,0.035,0.90), C_VIOLET)
	chapter_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_label(Vector2(96,179), Vector2(448,16), "CAPÍTULO CERO · %d/%d" % [intro_index + 1, INTRO.size()], 7, C_ORANGE, true, HORIZONTAL_ALIGNMENT_CENTER)
	_label(Vector2(96,198), Vector2(448,28), str(slide["title"]), 17, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	var body := _label(Vector2(111,229), Vector2(418,49), str(slide["text"]), 8, C_TEXT, false, HORIZONTAL_ALIGNMENT_CENTER)
	body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	var skip := _button(Vector2(40,320), Vector2(112,26), "OMITIR")
	skip.pressed.connect(_enter_world)
	content.add_child(skip)
	if intro_index > 0:
		var previous := _button(Vector2(170,320), Vector2(112,26), "ANTERIOR")
		previous.pressed.connect(func(): intro_index -= 1; _show_intro())
		content.add_child(previous)
	var next_text := "ENTRAR A IZRDRALAR" if intro_index == INTRO.size() - 1 else "CONTINUAR"
	var next_x := 302.0 if intro_index > 0 else 170.0
	var next_width := 298.0 if intro_index > 0 else 430.0
	var next := _button(Vector2(next_x,320), Vector2(next_width,26), next_text)
	next.pressed.connect(_next_intro)
	content.add_child(next)

func _next_intro() -> void:
	if intro_index >= INTRO.size() - 1:
		_enter_world()
		return
	intro_index += 1
	_show_intro()

func _enter_world() -> void:
	SaveService.save_game({"intro_seen": true})
	get_tree().change_scene_to_file(GAME_SCENE)

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	get_tree().change_scene_to_file(GAME_SCENE)

func _show_settings() -> void:
	_clear_content()
	_label(Vector2(42,40), Vector2(300,36), "OPCIONES", 22, C_TEXT, true)
	var panel := _panel(Vector2(42,94), Vector2(330,170), Color(0.02,0.03,0.05,0.94), C_VIOLET)
	var fullscreen := CheckButton.new()
	fullscreen.position = Vector2(18,18)
	fullscreen.size = Vector2(290,28)
	fullscreen.text = "Pantalla completa"
	fullscreen.button_pressed = DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN
	fullscreen.toggled.connect(func(enabled): DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN if enabled else DisplayServer.WINDOW_MODE_WINDOWED))
	panel.add_child(fullscreen)
	var scale_1 := _button(Vector2(18,60), Vector2(138,26), "1280 × 720")
	scale_1.pressed.connect(func(): DisplayServer.window_set_size(Vector2i(1280,720)))
	panel.add_child(scale_1)
	var scale_2 := _button(Vector2(172,60), Vector2(138,26), "1920 × 1080")
	scale_2.pressed.connect(func(): DisplayServer.window_set_size(Vector2i(1920,1080)))
	panel.add_child(scale_2)
	var back := _button(Vector2(18,122), Vector2(292,28), "VOLVER")
	back.pressed.connect(_show_main_menu)
	panel.add_child(back)

func _show_credits() -> void:
	_clear_content()
	_label(Vector2(40,35), Vector2(360,40), "CRÉDITOS", 22, C_TEXT, true)
	var panel := _panel(Vector2(36,90), Vector2(454,154), Color(0.02,0.03,0.05,0.94), C_VIOLET)
	var text := _local_label(Vector2(18,12), Vector2(418,120), "WORLD OF XETHKIOZ\nDirección y universo: XETHKIOZ\nMotor: Godot 4.7.2\n\nProducción en desarrollo · Izrdralar", 10, C_TEXT)
	text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	panel.add_child(text)
	var back := _button(Vector2(42,282), Vector2(160,28), "VOLVER")
	back.pressed.connect(_show_main_menu)
	content.add_child(back)

func _panel(pos: Vector2, size: Vector2, fill: Color, border: Color) -> Panel:
	var panel := Panel.new()
	panel.position = pos
	panel.size = size
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = Color(border.r, border.g, border.b, 0.82)
	style.set_border_width_all(1)
	style.set_corner_radius_all(7)
	style.shadow_color = Color(0,0,0,0.50)
	style.shadow_size = 4
	panel.add_theme_stylebox_override("panel", style)
	content.add_child(panel)
	return panel

func _button(pos: Vector2, size: Vector2, text: String) -> Button:
	var button := Button.new()
	button.position = pos
	button.size = size
	button.text = text
	button.add_theme_font_size_override("font_size", 8)
	button.add_theme_color_override("font_color", C_TEXT)
	button.add_theme_color_override("font_hover_color", Color.WHITE)
	button.add_theme_color_override("font_pressed_color", Color.WHITE)
	button.add_theme_color_override("font_disabled_color", Color(0.55,0.55,0.62,0.65))
	button.add_theme_stylebox_override("normal", _button_style(Color(0.055,0.065,0.10,0.96), Color(0.45,0.34,0.72,0.85)))
	button.add_theme_stylebox_override("hover", _button_style(Color(0.09,0.075,0.14,0.98), C_VIOLET))
	button.add_theme_stylebox_override("pressed", _button_style(Color(0.12,0.085,0.16,1.0), C_ORANGE))
	button.add_theme_stylebox_override("disabled", _button_style(Color(0.035,0.04,0.055,0.80), Color(0.20,0.22,0.27,0.80)))
	return button

func _button_style(fill: Color, border: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(5)
	style.content_margin_left = 6
	style.content_margin_right = 6
	return style

func _style_field(control: Control) -> void:
	control.add_theme_font_size_override("font_size", 8)
	control.add_theme_color_override("font_color", C_TEXT)
	var normal := StyleBoxFlat.new()
	normal.bg_color = Color(0.025,0.035,0.055,0.98)
	normal.border_color = Color(0.35,0.30,0.55,0.90)
	normal.set_border_width_all(1)
	normal.set_corner_radius_all(4)
	control.add_theme_stylebox_override("normal", normal)
	var focus := normal.duplicate()
	focus.border_color = C_VIOLET
	control.add_theme_stylebox_override("focus", focus)

func _label(pos: Vector2, size: Vector2, text: String, font_size: int, color: Color, bold := false, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var label := _local_label(pos, size, text, font_size, color, bold, align)
	content.add_child(label)
	return label

func _local_label(pos: Vector2, size: Vector2, text: String, font_size: int, color: Color, bold := false, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size
	label.text = text
	label.horizontal_alignment = align
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_shadow_color", Color(0,0,0,0.85))
	label.add_theme_constant_override("shadow_offset_x", 1)
	label.add_theme_constant_override("shadow_offset_y", 1)
	if bold:
		label.add_theme_constant_override("outline_size", 1)
		label.add_theme_color_override("font_outline_color", Color(0,0,0,0.9))
	return label
