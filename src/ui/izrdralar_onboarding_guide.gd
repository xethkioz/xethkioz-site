class_name IzrdralarOnboardingGuide
extends CanvasLayer

const COMPLETION_FLAG := "m01_controls_onboarding_complete"
const C_BG := Color(0.025, 0.03, 0.05, 0.92)
const C_TEXT := Color("f0f0f5")
const C_MUTED := Color("9b9baa")
const C_VIOLET := Color("8b5cf6")
const C_ORANGE := Color("ff8c42")

var map_id := "M01"
var _persist_completion := true
var _root: Control
var _label: Label
var _seen_move := false
var _seen_attack := false
var _seen_dash := false
var _seen_interact := false
var _completion_left := 0.0

func configure(map_value: String, persist_completion: bool = true) -> void:
	map_id = map_value
	_persist_completion = persist_completion

func _ready() -> void:
	layer = 80
	if map_id != "M01" or GameState.has_world_flag(COMPLETION_FLAG):
		queue_free()
		return
	_build_ui()
	_refresh_hint()

func _process(delta: float) -> void:
	if _completion_left > 0.0:
		_completion_left = maxf(0.0, _completion_left - delta)
		if _completion_left <= 0.0:
			queue_free()
		return

	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if input_vector.length_squared() > 0.04:
		_mark_seen("move")
	if Input.is_action_just_pressed("attack"):
		_mark_seen("attack")
	if Input.is_action_just_pressed("dash"):
		_mark_seen("dash")
	if Input.is_action_just_pressed("interact"):
		_mark_seen("interact")

func _build_ui() -> void:
	_root = Control.new()
	_root.position = Vector2(190, 66)
	_root.size = Vector2(260, 34)
	_root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_root)

	var panel := Panel.new()
	panel.size = _root.size
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var box := StyleBoxFlat.new()
	box.bg_color = C_BG
	box.border_color = Color(C_VIOLET.r, C_VIOLET.g, C_VIOLET.b, 0.72)
	box.set_border_width_all(1)
	box.set_corner_radius_all(6)
	panel.add_theme_stylebox_override("panel", box)
	_root.add_child(panel)

	_label = Label.new()
	_label.position = Vector2(8, 4)
	_label.size = Vector2(244, 26)
	_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_label.add_theme_font_size_override("font_size", 7)
	_label.add_theme_color_override("font_color", C_TEXT)
	_label.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.92))
	_label.add_theme_constant_override("outline_size", 1)
	_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_root.add_child(_label)

func _mark_seen(action_id: String) -> void:
	var changed := false
	match action_id:
		"move":
			changed = not _seen_move
			_seen_move = true
		"attack":
			changed = not _seen_attack
			_seen_attack = true
		"dash":
			changed = not _seen_dash
			_seen_dash = true
		"interact":
			changed = not _seen_interact
			_seen_interact = true
		_:
			return
	if changed:
		_refresh_hint()

func _refresh_hint() -> void:
	if not is_instance_valid(_label):
		return
	if not _seen_move:
		_label.text = "CONTROLES · WASD / FLECHAS · MOVER"
		_label.add_theme_color_override("font_color", C_TEXT)
		return
	if not _seen_attack:
		_label.text = "CONTROLES · J · ATACAR"
		_label.add_theme_color_override("font_color", C_ORANGE)
		return
	if not _seen_dash:
		_label.text = "CONTROLES · SHIFT · DASH"
		_label.add_theme_color_override("font_color", C_VIOLET.lightened(0.30))
		return
	if not _seen_interact:
		_label.text = "CONTROLES · C · INTERACTUAR"
		_label.add_theme_color_override("font_color", C_TEXT)
		return
	_complete_onboarding()

func _complete_onboarding() -> void:
	if GameState.has_world_flag(COMPLETION_FLAG):
		return
	GameState.set_world_flag(COMPLETION_FLAG)
	if _persist_completion:
		SaveService.save_game({"onboarding": "controls_complete"})
	_label.text = "CONTROLES BÁSICOS · LISTO"
	_label.add_theme_color_override("font_color", Color("8fcf78"))
	_completion_left = 1.1
