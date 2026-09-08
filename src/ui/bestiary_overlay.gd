extends CanvasLayer

var panel: Panel
var title_label: Label
var body_label: Label
var hint_label: Label

func _ready() -> void:
	layer = 80
	_ensure_input()
	_build_ui()
	visible = false
	EventBus.active_familiar_changed.connect(_on_familiar_changed)
	EventBus.familiar_assessed.connect(_on_familiar_assessed)
	EventBus.familiar_trained.connect(_on_familiar_trained)

func _ensure_input() -> void:
	if InputMap.has_action("bestiary"):
		return
	InputMap.add_action("bestiary")
	var event := InputEventKey.new()
	event.physical_keycode = KEY_B
	InputMap.action_add_event("bestiary", event)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("bestiary"):
		visible = not visible
		if visible:
			_refresh()
		get_viewport().set_input_as_handled()

func _build_ui() -> void:
	panel = Panel.new()
	panel.position = Vector2(94,58)
	panel.size = Vector2(452,244)
	var box := StyleBoxFlat.new()
	box.bg_color = Color(0.028,0.03,0.05,0.97)
	box.border_color = Color("8b5cf6")
	box.set_border_width_all(2)
	box.set_corner_radius_all(10)
	panel.add_theme_stylebox_override("panel", box)
	add_child(panel)

	title_label = _label(Vector2(116,78), Vector2(408,26), "PRISMA-ATLAS · FAMILIARES", 15, Color("f0f0f5"))
	body_label = _label(Vector2(116,116), Vector2(408,142), "", 11, Color("d6d6df"))
	body_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	hint_label = _label(Vector2(116,270), Vector2(408,18), "B · cerrar", 9, Color("ff8c42"))
	hint_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT

func _label(pos: Vector2, size: Vector2, text: String, font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size
	label.text = text
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	add_child(label)
	return label

func _refresh() -> void:
	if GameState.active_familiar_id.is_empty():
		body_label.text = "Todavía no hay un Familiar activo.\n\nVal puede evaluar criaturas capturables y derivar su entrenamiento al hermano cuya afinidad corresponda.\n\nLos ocho legendarios no pertenecen al sistema de captura ni entrenamiento común."
		return
	var data := GameState.active_familiar_data()
	if data.is_empty():
		body_label.text = "No se pudieron leer los datos del Familiar activo."
		return
	var display_name := str(data.get("display_name", GameState.active_familiar_id))
	var assessed := bool(data.get("assessed", false))
	var affinity := str(data.get("affinity", "desconocida")).capitalize() if assessed else "Desconocida"
	var mentor := str(data.get("mentor_id", "")).capitalize() if assessed else "Pendiente de Val"
	var rank := int(data.get("training_rank", 0))
	var bond := int(data.get("bond", 0))
	var ability := str(data.get("unlocked_ability", ""))
	if ability.is_empty():
		ability = "Sin técnica entrenada"
	else:
		ability = ability.replace("_", " ").capitalize()
	body_label.text = "%s\n\nAfinidad primaria: %s\nMentor recomendado: %s\nEntrenamiento: Rango %d\nVínculo del Familiar: %d/100\nTécnica: %s\n\nRegla: los legendarios usan Convergencias narrativas propias; no pueden capturarse ni entrenarse mediante este sistema." % [display_name, affinity, mentor, rank, bond, ability]

func _on_familiar_changed(_species_id: String) -> void:
	if visible:
		_refresh()

func _on_familiar_assessed(_species_id: String, _affinity: String, _mentor_id: String) -> void:
	if visible:
		_refresh()

func _on_familiar_trained(_species_id: String, _rank: int, _mentor_id: String) -> void:
	if visible:
		_refresh()
