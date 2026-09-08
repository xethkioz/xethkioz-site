extends CanvasLayer

var hp_label: Label
var progress_label: Label
var quest_label: Label
var world_label: Label
var inventory_label: Label
var toast_label: Label
var dialog_panel: ColorRect
var dialog_label: Label
var _toast_timer := 0.0
var _dialog_timer := 0.0
var _weather := "despejado"
var _hour := 8.0

func _ready() -> void:
	_build_ui()
	EventBus.player_health_changed.connect(_on_health)
	EventBus.player_progress_changed.connect(_on_progress)
	EventBus.currency_changed.connect(_on_currency)
	EventBus.inventory_changed.connect(_on_inventory)
	EventBus.quest_changed.connect(_on_quest)
	EventBus.weather_changed.connect(_on_weather)
	EventBus.time_changed.connect(_on_time)
	EventBus.toast_requested.connect(_on_toast)
	EventBus.dialog_requested.connect(_on_dialog)
	_on_progress(GameState.player_level, GameState.player_xp, GameState.xp_to_next())
	_on_currency(GameState.crystals)
	_on_inventory(InventoryService.stacks)

func _process(delta: float) -> void:
	_toast_timer = maxf(0.0, _toast_timer - delta)
	_dialog_timer = maxf(0.0, _dialog_timer - delta)
	if _toast_timer <= 0.0 and toast_label:
		toast_label.visible = false
	if _dialog_timer <= 0.0 and dialog_panel:
		dialog_panel.visible = false
		dialog_label.visible = false

func _build_ui() -> void:
	var panel := ColorRect.new()
	panel.position = Vector2(8, 8)
	panel.size = Vector2(250, 66)
	panel.color = Color(0.02, 0.025, 0.04, 0.84)
	add_child(panel)
	hp_label = _make_label(Vector2(16, 13), Vector2(230, 18), "PV --", 11)
	progress_label = _make_label(Vector2(16, 34), Vector2(230, 30), "Nivel 1", 10)
	quest_label = _make_label(Vector2(382, 12), Vector2(248, 54), "Misión", 10)
	quest_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	inventory_label = _make_label(Vector2(12, 310), Vector2(330, 18), "Bolsa", 8)
	world_label = _make_label(Vector2(12, 332), Vector2(300, 20), "", 9)
	toast_label = _make_label(Vector2(170, 217), Vector2(300, 24), "", 10)
	toast_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast_label.visible = false
	dialog_panel = ColorRect.new()
	dialog_panel.position = Vector2(44, 246)
	dialog_panel.size = Vector2(552, 76)
	dialog_panel.color = Color(0.015, 0.02, 0.035, 0.92)
	add_child(dialog_panel)
	dialog_label = _make_label(Vector2(58, 256), Vector2(524, 58), "", 10)
	dialog_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	dialog_panel.visible = false
	dialog_label.visible = false
	var controls := _make_label(Vector2(336, 333), Vector2(292, 18), "WASD mover · Shift dash · J atacar · C interactuar", 8)
	controls.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT

func _make_label(pos: Vector2, size: Vector2, text: String, font_size: int) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size
	label.text = text
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", Color("f0f0f5"))
	label.add_theme_color_override("font_shadow_color", Color(0,0,0,0.9))
	label.add_theme_constant_override("shadow_offset_x", 1)
	label.add_theme_constant_override("shadow_offset_y", 1)
	add_child(label)
	return label

func _on_health(current: float, maximum: float) -> void:
	if hp_label:
		hp_label.text = "PV %d / %d" % [roundi(current), roundi(maximum)]

func _on_progress(level: int, xp: int, xp_to_next: int) -> void:
	if progress_label:
		progress_label.text = "Nivel %d · XP %d/%d · Cristales %d" % [level, xp, xp_to_next, GameState.crystals]

func _on_currency(_crystals: int) -> void:
	_on_progress(GameState.player_level, GameState.player_xp, 0 if GameState.player_level >= GameState.MAX_LEVEL else GameState.xp_to_next())

func _on_inventory(_stacks: Dictionary) -> void:
	if inventory_label:
		inventory_label.text = "Bolsa · Manzana %d · Hongo %d · Ración %d" % [InventoryService.amount_of("manzana_bruma"), InventoryService.amount_of("hongo_azul_rocio"), InventoryService.amount_of("racion_bosque")]

func _on_quest(title: String, objective: String, completed: bool) -> void:
	if quest_label:
		quest_label.text = "%s%s\n%s" % ["✓ " if completed else "", title, objective]

func _on_weather(weather_id: String) -> void:
	_weather = weather_id
	_update_world_label()

func _on_time(hour: float) -> void:
	_hour = hour
	_update_world_label()

func _update_world_label() -> void:
	if world_label:
		world_label.text = "Izrdralar · %02d:00 · %s" % [int(_hour), _weather.replace("_", " ").capitalize()]

func _on_toast(message: String) -> void:
	if toast_label:
		toast_label.text = message
		toast_label.visible = true
		_toast_timer = 3.0

func _on_dialog(speaker: String, text: String) -> void:
	if dialog_panel and dialog_label:
		dialog_label.text = "[ %s ]\n%s" % [speaker, text]
		dialog_panel.visible = true
		dialog_label.visible = true
		_dialog_timer = 5.5
