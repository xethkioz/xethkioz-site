extends CanvasLayer

const FLAG_ID := "cuenca_intro_seen"
const INTRO_SECONDS := 4.2

var _player: CharacterBody2D
var _root: Control
var _veil: ColorRect
var _title: Label
var _subtitle: Label
var _hint: Label
var _elapsed := 0.0
var _running := false

func _ready() -> void:
	layer = 80
	call_deferred("_start_if_needed")

func _process(delta: float) -> void:
	if not _running:
		return
	_elapsed += delta
	var fade_alpha: float = 1.0
	if _elapsed < 0.8:
		fade_alpha = 1.0 - (_elapsed / 0.8) * 0.32
	elif _elapsed < 2.6:
		fade_alpha = 0.68 - ((_elapsed - 0.8) / 1.8) * 0.38
	else:
		fade_alpha = maxf(0.0, 0.30 * (1.0 - (_elapsed - 2.6) / 1.6))
	_veil.color.a = fade_alpha
	var text_alpha: float = 1.0
	if _elapsed > 3.2:
		text_alpha = maxf(0.0, 1.0 - (_elapsed - 3.2) / 0.8)
	_title.modulate.a = text_alpha
	_subtitle.modulate.a = text_alpha
	_hint.modulate.a = maxf(0.0, minf(1.0, (_elapsed - 1.2) / 0.5)) * text_alpha
	if _elapsed >= INTRO_SECONDS:
		_finish()

func _start_if_needed() -> void:
	if GameState.has_world_flag(FLAG_ID):
		queue_free()
		return
	var snapshot: Dictionary = GameState.get_quest_snapshot()
	if int(snapshot.get("state", 0)) > 0:
		GameState.set_world_flag(FLAG_ID)
		SaveService.save_game()
		queue_free()
		return
	_player = get_tree().get_first_node_in_group("player") as CharacterBody2D
	if not is_instance_valid(_player):
		await get_tree().process_frame
		_player = get_tree().get_first_node_in_group("player") as CharacterBody2D
	_build_overlay()
	_running = true
	if is_instance_valid(_player):
		_player.set_physics_process(false)
	GameState.set_world_flag(FLAG_ID)
	SaveService.save_game()

func _build_overlay() -> void:
	_root = Control.new()
	_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_root)

	_veil = ColorRect.new()
	_veil.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_veil.color = Color(0.01, 0.018, 0.028, 1.0)
	_veil.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_root.add_child(_veil)

	var line_top := ColorRect.new()
	line_top.position = Vector2(0, 82)
	line_top.size = Vector2(640, 2)
	line_top.color = Color("8b5cf6")
	line_top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_root.add_child(line_top)
	var line_bottom := ColorRect.new()
	line_bottom.position = Vector2(0, 278)
	line_bottom.size = Vector2(640, 2)
	line_bottom.color = Color("ff8c42")
	line_bottom.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_root.add_child(line_bottom)

	_title = _make_label(Vector2(80, 124), Vector2(480, 44), "IZRDRALAR", 30, Color("f0f0f5"), true)
	_subtitle = _make_label(Vector2(80, 172), Vector2(480, 26), "CUENCA DEL DESPERTAR · LAS RAÍCES VIVAS", 11, Color("d8ceff"), true)
	_hint = _make_label(Vector2(80, 220), Vector2(480, 20), "Xethkioz permanece cerca. Encontrá a Alexis.", 8, Color("ffb071"), false)

func _make_label(pos: Vector2, label_size: Vector2, text_value: String, font_size: int, color: Color, bold: bool) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = label_size
	label.text = text_value
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	label.add_theme_constant_override("shadow_offset_x", 2)
	label.add_theme_constant_override("shadow_offset_y", 2)
	if bold:
		label.add_theme_constant_override("outline_size", 1)
	_root.add_child(label)
	return label

func _finish() -> void:
	_running = false
	if is_instance_valid(_player):
		_player.set_physics_process(true)
	EventBus.toast_requested.emit("Objetivo · hablá con Alexis")
	queue_free()
