extends Control

const GAME_SCENE := "res://scenes/v34/GoldenRegion.tscn"
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
var preview_head: ColorRect
var preview_hair: ColorRect
var preview_body: ColorRect
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
	var background := ColorRect.new()
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.color = C_BG
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)

	for data in [
		[Vector2(36,42), Vector2(110,300), Color(0.08,0.18,0.16,0.70)],
		[Vector2(510,22), Vector2(92,326), Color(0.06,0.16,0.20,0.75)],
		[Vector2(455,70), Vector2(20,205), Color(0.55,0.36,0.96,0.16)],
		[Vector2(145,92), Vector2(12,180), Color(1.0,0.55,0.26,0.12)]
	]:
		var shape := ColorRect.new()
		shape.position = data[0]
		shape.size = data[1]
		shape.color = data[2]
		shape.mouse_filter = Control.MOUSE_FILTER_IGNORE
		add_child(shape)

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
	var title := _label(Vector2(90,120), Vector2(460,62), "WORLD OF XETHKIOZ", 34, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	title.add_theme_color_override("font_outline_color", Color(0.45,0.24,0.85,0.95))
	title.add_theme_constant_override("outline_size", 4)
	_label(Vector2(120,186), Vector2(400,24), "GAMING IS MY PASSION · BEYOND THE GAME", 10, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
	_label(Vector2(160,316), Vector2(320,18), "Presioná ENTER para continuar", 8, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)

func _show_main_menu() -> void:
	_clear_content()
	_label(Vector2(38,32), Vector2(410,46), "WORLD OF XETHKIOZ", 27, C_TEXT, true)
	_label(Vector2(40,79), Vector2(340,20), "IZRDRALAR · LAS RAÍCES VIVAS", 10, C_VIOLET, true)
	_label(Vector2(40,104), Vector2(350,35), "Un mundo fracturado. Una familia unida.", 9, C_MUTED)

	var menu := _panel(Vector2(38,154), Vector2(224,174), C_PANEL, C_VIOLET)
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

	var lore_panel := _panel(Vector2(334,145), Vector2(266,176), Color(0.025,0.055,0.065,0.90), C_WATER)
	var prism := _local_label(Vector2(0,24), Vector2(266,55), "◇", 48, C_VIOLET, true, HORIZONTAL_ALIGNMENT_CENTER)
	lore_panel.add_child(prism)
	var region := _local_label(Vector2(20,86), Vector2(226,20), "IZRDRALAR", 15, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	lore_panel.add_child(region)
	var sub := _local_label(Vector2(20,110), Vector2(226,36), "Explorá. Formá lazos.\nDescubrí la verdad de Xethkioz.", 8, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
	lore_panel.add_child(sub)

func _show_creator() -> void:
	_clear_content()
	_label(Vector2(32,20), Vector2(420,36), "CREAR VIAJERO", 22, C_TEXT, true)
	_label(Vector2(34,56), Vector2(500,20), "Tu clase no se elige acá: la vas a construir dentro del mundo.", 8, C_MUTED)

	var editor := _panel(Vector2(32,88), Vector2(350,238), C_PANEL, C_VIOLET)
	var name_label := _local_label(Vector2(18,14), Vector2(95,18), "NOMBRE", 8, C_MUTED, true)
	editor.add_child(name_label)
	name_edit = LineEdit.new()
	name_edit.position = Vector2(112,10)
	name_edit.size = Vector2(214,26)
	name_edit.max_length = 18
	name_edit.text = CharacterProfile.player_name
	name_edit.text_changed.connect(func(_v): _update_creator_preview())
	editor.add_child(name_edit)

	body_option = _creator_option(editor, 48, "COMPLEXIÓN", CharacterProfile.BODY_NAMES, CharacterProfile.body_type)
	skin_option = _creator_option(editor, 80, "TONO DE PIEL", ["Tono I","Tono II","Tono III","Tono IV","Tono V","Tono VI"], CharacterProfile.skin_tone)
	hair_option = _creator_option(editor, 112, "CABELLO", CharacterProfile.HAIR_NAMES, CharacterProfile.hair_style)
	hair_color_option = _creator_option(editor, 144, "COLOR CABELLO", ["Negro","Castaño","Cobre","Dorado","Violeta","Ceniza"], CharacterProfile.hair_color)
	accent_option = _creator_option(editor, 176, "ACENTO EQUIPO", ["Prisma","Ámbar","Cian","Bosque","Rosa","Oro"], CharacterProfile.accent_color)

	var back := _button(Vector2(18,208), Vector2(96,24), "VOLVER")
	back.pressed.connect(_show_main_menu)
	editor.add_child(back)
	var confirm := _button(Vector2(120,208), Vector2(206,24), "COMENZAR VIAJE")
	confirm.pressed.connect(_confirm_character)
	editor.add_child(confirm)

	var preview := _panel(Vector2(410,88), Vector2(198,238), Color(0.025,0.055,0.065,0.94), C_ORANGE)
	preview_name = _local_label(Vector2(12,14), Vector2(174,20), "VIAJERO", 11, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	preview.add_child(preview_name)
	preview_hair = ColorRect.new()
	preview_hair.position = Vector2(75,57)
	preview_hair.size = Vector2(48,18)
	preview.add_child(preview_hair)
	preview_head = ColorRect.new()
	preview_head.position = Vector2(80,70)
	preview_head.size = Vector2(38,38)
	preview.add_child(preview_head)
	preview_body = ColorRect.new()
	preview_body.position = Vector2(66,111)
	preview_body.size = Vector2(66,76)
	preview.add_child(preview_body)
	var note := _local_label(Vector2(18,198), Vector2(162,26), "Vista provisional.\nEl sprite final reemplazará esta guía.", 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
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
	option.item_selected.connect(func(_index): _update_creator_preview())
	parent.add_child(option)
	return option

func _update_creator_preview() -> void:
	if preview_head == null:
		return
	var skin_index: int = skin_option.selected if skin_option else CharacterProfile.skin_tone
	var hair_index: int = hair_color_option.selected if hair_color_option else CharacterProfile.hair_color
	var accent_index: int = accent_option.selected if accent_option else CharacterProfile.accent_color
	var skin: Color = CharacterProfile.SKIN_COLORS[skin_index]
	var hair: Color = CharacterProfile.HAIR_COLORS[hair_index]
	var accent: Color = CharacterProfile.ACCENT_COLORS[accent_index]
	preview_head.color = skin
	preview_hair.color = hair
	preview_body.color = accent
	var body_idx: int = body_option.selected if body_option else CharacterProfile.body_type
	preview_body.size.x = [54.0,66.0,78.0][body_idx]
	preview_body.position.x = 99.0 - preview_body.size.x * 0.5
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
	_label(Vector2(72,50), Vector2(496,28), "CAPÍTULO CERO", 9, C_ORANGE, true, HORIZONTAL_ALIGNMENT_CENTER)
	_label(Vector2(70,92), Vector2(500,52), str(slide["title"]), 22, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	var body := _label(Vector2(108,158), Vector2(424,92), str(slide["text"]), 11, C_TEXT, false, HORIZONTAL_ALIGNMENT_CENTER)
	body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_label(Vector2(208,267), Vector2(224,16), "%d / %d" % [intro_index + 1, INTRO.size()], 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)
	var skip := _button(Vector2(40,312), Vector2(112,26), "OMITIR")
	skip.pressed.connect(_enter_world)
	content.add_child(skip)
	if intro_index > 0:
		var previous := _button(Vector2(184,312), Vector2(112,26), "ANTERIOR")
		previous.pressed.connect(func(): intro_index -= 1; _show_intro())
		content.add_child(previous)
	var next_text := "ENTRAR A IZRDRALAR" if intro_index == INTRO.size() - 1 else "CONTINUAR"
	var next := _button(Vector2(320,312), Vector2(280,26), next_text)
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
	var panel := _panel(Vector2(42,94), Vector2(330,170), C_PANEL, C_VIOLET)
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
	var text := _label(Vector2(42,105), Vector2(440,120), "WORLD OF XETHKIOZ\nDirección y universo: XETHKIOZ\nMotor: Godot 4\n\nDemo en desarrollo · Izrdralar", 10, C_TEXT)
	text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var back := _button(Vector2(42,282), Vector2(160,28), "VOLVER")
	back.pressed.connect(_show_main_menu)
	content.add_child(back)

func _panel(pos: Vector2, size: Vector2, fill: Color, border: Color) -> Panel:
	var panel := Panel.new()
	panel.position = pos
	panel.size = size
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(7)
	panel.add_theme_stylebox_override("panel", style)
	content.add_child(panel)
	return panel

func _button(pos: Vector2, size: Vector2, text: String) -> Button:
	var button := Button.new()
	button.position = pos
	button.size = size
	button.text = text
	button.add_theme_font_size_override("font_size", 8)
	return button

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
	if bold:
		label.add_theme_constant_override("outline_size", 1)
		label.add_theme_color_override("font_outline_color", Color(0,0,0,0.9))
	return label