extends Node2D

var lore_id := "lore"
var title := "Pista"
var speaker := "Registro"
var body := ""
var accent_color := Color("b18cff")
var total_hint := 5

func configure(id_value: String, title_value: String, speaker_value: String, body_value: String, color_value: Color, total_value: int = 5) -> void:
	lore_id = id_value
	title = title_value
	speaker = speaker_value
	body = body_value
	accent_color = color_value
	total_hint = total_value
	queue_redraw()

func _ready() -> void:
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	var first_discovery := GameState.discover_lore(lore_id, title, total_hint)
	if first_discovery:
		EventBus.toast_requested.emit("Atlas actualizado · %s · +8 XP" % title)
	EventBus.dialog_requested.emit(speaker, body)

func interaction_label() -> String:
	return title

func _draw() -> void:
	var discovered := GameState.has_lore(lore_id)
	var draw_color := accent_color.darkened(0.45) if discovered else accent_color
	draw_rect(Rect2(-7, -7, 14, 14), draw_color, true)
	draw_rect(Rect2(-9, -9, 18, 18), Color(draw_color.r, draw_color.g, draw_color.b, 0.35), false, 1.0)
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(-34, -14), title, HORIZONTAL_ALIGNMENT_CENTER, 68, 8, Color("f0f0f5"))
