class_name IzrdralarPauseMenu
extends CanvasLayer

const MAIN_MENU_SCENE := "res://scenes/v34/GameBootstrap.tscn"
const C_BG := Color(0.025, 0.03, 0.05, 0.97)
const C_PANEL := Color(0.045, 0.045, 0.075, 0.98)
const C_TEXT := Color("f0f0f5")
const C_MUTED := Color("9b9baa")
const C_VIOLET := Color("8b5cf6")
const C_ORANGE := Color("ff8c42")

var _root: Control
var _panel: Panel
var _resume_button: Button
var _status_label: Label
var _sfx_value: Label
var _ambience_value: Label
var _is_open := false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 200
	_build_ui()
	_set_open(false)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		if _is_open:
			_close_pause()
		else:
			_open_pause()
		get_viewport().set_input_as_handled()

func _build_ui() -> void:
	_root = Control.new()
	_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_root.mouse_filter = Control.MOUSE_FILTER_STOP
	add_child(_root)

	var veil := ColorRect.new()
	veil.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	veil.color = Color(0.0, 0.0, 0.0, 0.68)
	veil.mouse_filter = Control.MOUSE_FILTER_STOP
	_root.add_child(veil)

	_panel = Panel.new()
	_panel.position = Vector2(152, 44)
	_panel.size = Vector2(336, 272)
	var box := StyleBoxFlat.new()
	box.bg_color = C_BG
	box.border_color = Color(C_VIOLET.r, C_VIOLET.g, C_VIOLET.b, 0.86)
	box.set_border_width_all(1)
	box.set_corner_radius_all(8)
	box.shadow_color = Color(0, 0, 0, 0.65)
	box.shadow_size = 8
	_panel.add_theme_stylebox_override("panel", box)
	_root.add_child(_panel)

	_add_label(Vector2(18, 12), Vector2(300, 28), "PAUSA", 20, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	_add_label(Vector2(18, 39), Vector2(300, 15), "ESC · volver al juego", 7, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)

	_resume_button = _add_button(Vector2(18, 62), Vector2(145, 28), "CONTINUAR")
	_resume_button.pressed.connect(_close_pause)
	var save_button := _add_button(Vector2(173, 62), Vector2(145, 28), "GUARDAR")
	save_button.pressed.connect(_manual_save)

	var reduced_motion := CheckButton.new()
	reduced_motion.position = Vector2(18, 100)
	reduced_motion.size = Vector2(300, 25)
	reduced_motion.text = "Reducir movimiento de cámara"
	reduced_motion.button_pressed = AccessibilityService.reduce_camera_motion
	reduced_motion.toggled.connect(func(enabled): AccessibilityService.set_reduce_camera_motion(enabled))
	_panel.add_child(reduced_motion)

	var sfx_toggle := CheckButton.new()
	sfx_toggle.position = Vector2(18, 128)
	sfx_toggle.size = Vector2(160, 25)
	sfx_toggle.text = "SFX"
	sfx_toggle.button_pressed = AccessibilityService.sfx_enabled
	sfx_toggle.toggled.connect(func(enabled): AccessibilityService.set_sfx_enabled(enabled))
	_panel.add_child(sfx_toggle)
	_sfx_value = _add_label(Vector2(242, 130), Vector2(76, 18), "%d dB" % roundi(AccessibilityService.sfx_volume_db), 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	var sfx_slider := HSlider.new()
	sfx_slider.position = Vector2(70, 145)
	sfx_slider.size = Vector2(248, 16)
	sfx_slider.min_value = -30.0
	sfx_slider.max_value = 0.0
	sfx_slider.step = 1.0
	sfx_slider.value = AccessibilityService.sfx_volume_db
	sfx_slider.value_changed.connect(_on_sfx_volume_changed)
	_panel.add_child(sfx_slider)

	var ambience_toggle := CheckButton.new()
	ambience_toggle.position = Vector2(18, 166)
	ambience_toggle.size = Vector2(190, 25)
	ambience_toggle.text = "Ambiente"
	ambience_toggle.button_pressed = AccessibilityService.ambience_enabled
	ambience_toggle.toggled.connect(func(enabled): AccessibilityService.set_ambience_enabled(enabled))
	_panel.add_child(ambience_toggle)
	_ambience_value = _add_label(Vector2(242, 168), Vector2(76, 18), "%d dB" % roundi(AccessibilityService.ambience_volume_db), 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	var ambience_slider := HSlider.new()
	ambience_slider.position = Vector2(70, 183)
	ambience_slider.size = Vector2(248, 16)
	ambience_slider.min_value = -36.0
	ambience_slider.max_value = -6.0
	ambience_slider.step = 1.0
	ambience_slider.value = AccessibilityService.ambience_volume_db
	ambience_slider.value_changed.connect(_on_ambience_volume_changed)
	_panel.add_child(ambience_slider)

	var menu_button := _add_button(Vector2(18, 210), Vector2(300, 27), "GUARDAR Y VOLVER AL MENÚ")
	menu_button.pressed.connect(_save_and_exit_to_menu)
	_status_label = _add_label(Vector2(18, 242), Vector2(300, 18), "", 7, C_MUTED, true, HORIZONTAL_ALIGNMENT_CENTER)

func _add_label(pos: Vector2, size_value: Vector2, text_value: String, font_size: int, color_value: Color, bold := false, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size_value
	label.text = text_value
	label.horizontal_alignment = align
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color_value)
	label.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.9))
	label.add_theme_constant_override("outline_size", 1 if bold else 0)
	_panel.add_child(label)
	return label

func _add_button(pos: Vector2, size_value: Vector2, text_value: String) -> Button:
	var button := Button.new()
	button.position = pos
	button.size = size_value
	button.text = text_value
	button.add_theme_font_size_override("font_size", 8)
	button.add_theme_color_override("font_color", C_TEXT)
	var normal := StyleBoxFlat.new()
	normal.bg_color = C_PANEL
	normal.border_color = Color(C_VIOLET.r, C_VIOLET.g, C_VIOLET.b, 0.70)
	normal.set_border_width_all(1)
	normal.set_corner_radius_all(5)
	button.add_theme_stylebox_override("normal", normal)
	var hover := normal.duplicate() as StyleBoxFlat
	hover.border_color = C_ORANGE
	button.add_theme_stylebox_override("hover", hover)
	button.add_theme_stylebox_override("focus", hover)
	_panel.add_child(button)
	return button

func _open_pause() -> void:
	_status_label.text = ""
	_set_open(true)
	get_tree().paused = true
	_resume_button.grab_focus()

func _close_pause() -> void:
	get_tree().paused = false
	_set_open(false)

func _set_open(value: bool) -> void:
	_is_open = value
	if is_instance_valid(_root):
		_root.visible = value

func _manual_save() -> void:
	if SaveService.save_game({"manual_pause_save": true}):
		_status_label.text = "Partida guardada"
		_status_label.add_theme_color_override("font_color", Color("8fcf78"))
	else:
		_status_label.text = "No se pudo guardar"
		_status_label.add_theme_color_override("font_color", Color("ff6b6b"))

func _save_and_exit_to_menu() -> void:
	if not SaveService.save_game({"manual_pause_save": true, "return_to_menu": true}):
		_status_label.text = "No se pudo guardar · seguís en la partida"
		_status_label.add_theme_color_override("font_color", Color("ff6b6b"))
		return
	get_tree().paused = false
	get_tree().change_scene_to_file(MAIN_MENU_SCENE)

func _on_sfx_volume_changed(value: float) -> void:
	AccessibilityService.set_sfx_volume_db(value)
	_sfx_value.text = "%d dB" % roundi(value)

func _on_ambience_volume_changed(value: float) -> void:
	AccessibilityService.set_ambience_volume_db(value)
	_ambience_value.text = "%d dB" % roundi(value)
