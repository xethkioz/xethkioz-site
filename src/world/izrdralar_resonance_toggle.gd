class_name IzrdralarResonanceToggle
extends Node2D

var puzzle_id := ""
var node_id := ""
var display_name := "Resonancia"
var mode := "focus"
var completion_flag := ""
var state_flag := ""
var solution_alternate := false
var completion_message := "La configuración quedó estable."
var accent := Color("8b5cf6")
var alternate_state := false
var _pulse := 0.0

func configure(data: Dictionary) -> void:
	puzzle_id = str(data.get("puzzle_id", "puzzle"))
	node_id = str(data.get("id", "node"))
	display_name = str(data.get("name", display_name))
	mode = str(data.get("mode", mode))
	completion_flag = str(data.get("completion_flag", ""))
	state_flag = str(data.get("state_flag", "izrdralar_%s_%s_alternate" % [puzzle_id, node_id]))
	solution_alternate = bool(data.get("solution_alternate", false))
	completion_message = str(data.get("completion_message", completion_message))
	var color_value := str(data.get("accent", ""))
	if not color_value.is_empty():
		accent = Color(color_value)
	alternate_state = GameState.has_world_flag(state_flag)
	queue_redraw()

func _ready() -> void:
	add_to_group("interactable")
	add_to_group("izrdralar_resonance_toggle")
	add_to_group(_puzzle_group())
	alternate_state = GameState.has_world_flag(state_flag)
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	queue_redraw()

func interaction_label() -> String:
	if not completion_flag.is_empty() and GameState.has_world_flag(completion_flag):
		return "%s · estable" % display_name
	if mode == "crystal":
		return "Orientar · %s" % display_name
	return "%s · %s" % ["Encender" if alternate_state else "Apagar", display_name]

func interact(_actor: Node = null) -> void:
	if not completion_flag.is_empty() and GameState.has_world_flag(completion_flag):
		EventBus.toast_requested.emit("%s ya quedó en su configuración correcta." % display_name)
		return
	alternate_state = not alternate_state
	GameState.set_world_flag(state_flag, alternate_state)
	if mode == "crystal":
		EventBus.toast_requested.emit("%s · orientación %s" % [display_name, "B" if alternate_state else "A"])
	else:
		EventBus.toast_requested.emit("%s · %s" % [display_name, "apagado" if alternate_state else "activo"])
	if _check_solution():
		GameState.set_world_flag(completion_flag)
		SaveService.save_game({"puzzle_id": puzzle_id, "puzzle_state": "solved"})
		EventBus.toast_requested.emit(completion_message)
	else:
		SaveService.save_game({"puzzle_id": puzzle_id, "puzzle_state": "in_progress"})
	queue_redraw()

func is_solution_state() -> bool:
	return alternate_state == solution_alternate

func _check_solution() -> bool:
	var nodes := get_tree().get_nodes_in_group(_puzzle_group())
	if nodes.is_empty():
		return false
	for node in nodes:
		if not node.has_method("is_solution_state") or not bool(node.call("is_solution_state")):
			return false
	return true

func _puzzle_group() -> String:
	return "izrdralar_puzzle_%s" % puzzle_id

func _draw() -> void:
	var solved := not completion_flag.is_empty() and GameState.has_world_flag(completion_flag)
	var breathe := 0.5 + 0.5 * sin(_pulse * 3.2)
	var visual_color := Color("8fcf78") if solved else accent
	if mode == "crystal":
		var points := PackedVector2Array([Vector2(0, -12), Vector2(8, 0), Vector2(0, 12), Vector2(-8, 0)])
		draw_colored_polygon(points, Color(visual_color.r, visual_color.g, visual_color.b, 0.72 if not alternate_state else 0.36))
		var angle := PI * 0.25 if alternate_state else -PI * 0.25
		draw_line(Vector2.from_angle(angle) * -10.0, Vector2.from_angle(angle) * 10.0, Color("f0f0f5"), 2.0)
		draw_arc(Vector2.ZERO, 16.0 + breathe, 0.0, TAU, 24, Color(visual_color.r, visual_color.g, visual_color.b, 0.35), 1.0)
	else:
		var alpha := 0.22 if alternate_state else 0.74
		draw_circle(Vector2.ZERO, 8.0 + breathe, Color(visual_color.r, visual_color.g, visual_color.b, alpha))
		draw_arc(Vector2.ZERO, 15.0 + breathe * 2.0, 0.0, TAU, 24, Color(visual_color.r, visual_color.g, visual_color.b, 0.55 if not alternate_state else 0.18), 2.0)
