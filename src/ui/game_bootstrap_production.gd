extends "res://src/ui/game_bootstrap.gd"

const IZRDRALAR_RUNTIME_SCENE := "res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn"

func world_scene_path() -> String:
	return IZRDRALAR_RUNTIME_SCENE

func _enter_world() -> void:
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	if not SaveService.save_game({"intro_seen": true, "runtime": "m01_m05"}):
		EventBus.toast_requested.emit("No se pudo guardar el inicio de la partida.")
		return
	get_tree().change_scene_to_file(world_scene_path())

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	if not bool(loaded.get("intro_seen", false)):
		intro_index = 0
		_show_intro()
		return
	get_tree().change_scene_to_file(world_scene_path())

func _show_settings() -> void:
	_clear_content()
	_label(Vector2(42,32), Vector2(420,36), "OPCIONES", 22, C_TEXT, true)
	_label(Vector2(42,66), Vector2(500,18), "Pantalla, movimiento y feedback de combate", 8, C_MUTED)

	var panel := _panel(Vector2(42,92), Vector2(410,222), Color(0.02,0.03,0.05,0.94), C_VIOLET)

	var fullscreen := CheckButton.new()
	fullscreen.position = Vector2(18,14)
	fullscreen.size = Vector2(360,26)
	fullscreen.text = "Pantalla completa"
	fullscreen.button_pressed = DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN
	fullscreen.toggled.connect(func(enabled): DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN if enabled else DisplayServer.WINDOW_MODE_WINDOWED))
	panel.add_child(fullscreen)

	var reduced_motion := CheckButton.new()
	reduced_motion.position = Vector2(18,45)
	reduced_motion.size = Vector2(360,26)
	reduced_motion.text = "Reducir movimiento de cámara"
	reduced_motion.button_pressed = AccessibilityService.reduce_camera_motion
	reduced_motion.toggled.connect(func(enabled): AccessibilityService.set_reduce_camera_motion(enabled))
	panel.add_child(reduced_motion)

	var sfx_toggle := CheckButton.new()
	sfx_toggle.position = Vector2(18,76)
	sfx_toggle.size = Vector2(360,26)
	sfx_toggle.text = "Efectos de sonido"
	sfx_toggle.button_pressed = AccessibilityService.sfx_enabled
	sfx_toggle.toggled.connect(func(enabled): AccessibilityService.set_sfx_enabled(enabled))
	panel.add_child(sfx_toggle)

	var sfx_title := _local_label(Vector2(22,108), Vector2(150,18), "VOLUMEN SFX", 7, C_MUTED, true)
	panel.add_child(sfx_title)
	var sfx_value := _local_label(Vector2(310,108), Vector2(70,18), "%d dB" % roundi(AccessibilityService.sfx_volume_db), 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	panel.add_child(sfx_value)
	var sfx_slider := HSlider.new()
	sfx_slider.position = Vector2(22,128)
	sfx_slider.size = Vector2(358,18)
	sfx_slider.min_value = -30.0
	sfx_slider.max_value = 0.0
	sfx_slider.step = 1.0
	sfx_slider.value = AccessibilityService.sfx_volume_db
	sfx_slider.value_changed.connect(func(value):
		AccessibilityService.set_sfx_volume_db(float(value))
		sfx_value.text = "%d dB" % roundi(value)
	)
	panel.add_child(sfx_slider)

	var scale_1 := _button(Vector2(18,154), Vector2(176,25), "1280 × 720")
	scale_1.pressed.connect(func(): DisplayServer.window_set_size(Vector2i(1280,720)))
	panel.add_child(scale_1)
	var scale_2 := _button(Vector2(214,154), Vector2(176,25), "1920 × 1080")
	scale_2.pressed.connect(func(): DisplayServer.window_set_size(Vector2i(1920,1080)))
	panel.add_child(scale_2)

	var back := _button(Vector2(18,188), Vector2(372,26), "VOLVER")
	back.pressed.connect(_show_main_menu)
	panel.add_child(back)
