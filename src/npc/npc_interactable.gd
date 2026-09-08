extends Node2D

var npc_id := "npc"
var display_name := "NPC"
var dialogue_lines: Array[String] = []
var accent_color := Color("d8d3c5")
var _line_index := 0

func configure(id_value: String, name_value: String, lines: Array[String], color_value: Color) -> void:
	npc_id = id_value
	display_name = name_value
	dialogue_lines = lines.duplicate()
	accent_color = color_value
	queue_redraw()

func _ready() -> void:
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	var line := "..."
	if not dialogue_lines.is_empty():
		line = dialogue_lines[_line_index % dialogue_lines.size()]
		_line_index += 1
	EventBus.dialog_requested.emit(display_name, line)
	EventBus.npc_interacted.emit(npc_id)

func interaction_label() -> String:
	return display_name

func _draw() -> void:
	draw_circle(Vector2(0, -3), 9.0, accent_color)
	draw_circle(Vector2(0, -15), 5.0, Color("e7c5a5"))
	draw_line(Vector2(-7, 10), Vector2(7, 10), accent_color.darkened(0.25), 3.0)
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(-24, -25), display_name, HORIZONTAL_ALIGNMENT_CENTER, 48, 9, Color("f0f0f5"))
