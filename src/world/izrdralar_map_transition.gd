class_name IzrdralarMapTransition
extends Area2D

const NavigationGraph := preload("res://src/world/izrdralar_navigation_graph.gd")

@export var source_map_id: String = ""
@export var target_map_id: String = ""
@export_file("*.tscn") var target_scene: String = ""
@export var auto_transition: bool = true
@export var allow_scope_exit: bool = false
@export var locked_message: String = "El camino todavía no responde a tu Resonancia."

var _navigation = NavigationGraph.new()
var _busy := false

func _ready() -> void:
	add_to_group("izrdralar_map_transition")
	_navigation.load_graph()
	if auto_transition:
		body_entered.connect(_on_body_entered)

func request_transition(actor: Node = null) -> bool:
	if _busy or target_map_id.is_empty() or target_scene.is_empty():
		return false
	if _navigation.graph_data().is_empty() and not _navigation.load_graph():
		EventBus.toast_requested.emit("No se pudo cargar el grafo de Izrdralar.")
		return false

	var source_id := source_map_id if not source_map_id.is_empty() else GameState.current_map_id
	var edge: Dictionary = _navigation.resolve_edge(source_id, target_map_id, GameState.world_flags, allow_scope_exit)
	if edge.is_empty():
		_emit_locked_feedback(source_id)
		return false

	var target_entry_id := str(edge.get("entry_id", "start"))
	if not _navigation.validate_checkpoint(target_map_id, target_entry_id) and not bool(edge.get("scope_exit", false)):
		EventBus.toast_requested.emit("Entrada inválida para %s: %s" % [target_map_id, target_entry_id])
		return false

	_busy = true
	GameState.set_world_checkpoint(target_map_id, target_entry_id, Vector2.ZERO)
	if not SaveService.save_game({"transition_from": source_id, "transition_to": target_map_id}):
		_busy = false
		EventBus.toast_requested.emit("No se pudo guardar el viaje. La transición fue cancelada.")
		return false

	EventBus.toast_requested.emit("Camino · %s" % target_map_id)
	get_tree().change_scene_to_file(target_scene)
	return true

func interaction_label() -> String:
	if target_map_id.is_empty():
		return "Camino"
	return "Viajar a %s" % target_map_id

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		request_transition(body)

func _emit_locked_feedback(source_id: String) -> void:
	var missing := _navigation.missing_requirements(source_id, target_map_id, GameState.world_flags)
	if target_map_id == "M05" and ("lake_resolved" in missing or "ruins_sanctuary_resolved" in missing):
		var pending: Array[String] = []
		if "lake_resolved" in missing:
			pending.append("Lago Encantado")
		if "ruins_sanctuary_resolved" in missing:
			pending.append("Ruinas/Santuario")
		EventBus.toast_requested.emit("El Corazón del Bosque sigue cerrado · falta %s" % ", ".join(pending))
		return
	if target_map_id == "M06" and not allow_scope_exit:
		EventBus.toast_requested.emit("M06 permanece fuera del Production Pass 01.")
		return
	EventBus.toast_requested.emit(locked_message)
