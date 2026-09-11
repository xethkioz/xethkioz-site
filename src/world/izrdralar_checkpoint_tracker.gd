class_name IzrdralarCheckpointTracker
extends Node

const NavigationGraph := preload("res://src/world/izrdralar_navigation_graph.gd")

@export var map_id: String = "M01"
@export var default_entry_id: String = ""
@export var update_interval := 0.20

var _player: Node2D
var _elapsed := 0.0
var _navigation = NavigationGraph.new()

func _ready() -> void:
	_navigation.load_graph()
	call_deferred("_restore_player_checkpoint")

func _physics_process(delta: float) -> void:
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return
	_elapsed += delta
	if _elapsed < update_interval:
		return
	_elapsed = 0.0
	GameState.set_world_checkpoint(map_id, GameState.current_entry_id, _player.global_position)

func _restore_player_checkpoint() -> void:
	await get_tree().process_frame
	_player = get_tree().get_first_node_in_group("player") as Node2D
	if not is_instance_valid(_player):
		push_warning("IzrdralarCheckpointTracker: player not found in %s" % map_id)
		return

	var fallback_entry := _default_entry_id()
	if GameState.current_map_id != map_id:
		GameState.set_world_checkpoint(map_id, fallback_entry, Vector2.ZERO)

	if GameState.last_world_position != Vector2.ZERO:
		_player.global_position = GameState.last_world_position
		return

	var entry := _find_entry_point(GameState.current_entry_id)
	if entry == null:
		entry = _find_entry_point(fallback_entry)
	if entry != null:
		_player.global_position = entry.global_position
		GameState.set_world_checkpoint(map_id, str(entry.get_meta("entry_id", fallback_entry)), _player.global_position)
	else:
		push_warning("IzrdralarCheckpointTracker: no entry point for %s/%s" % [map_id, fallback_entry])

func _find_entry_point(entry_id: String) -> Node2D:
	for node in get_tree().get_nodes_in_group("izrdralar_entry_point"):
		if node is Node2D and str(node.get_meta("entry_id", "")) == entry_id:
			return node as Node2D
	return null

func _default_entry_id() -> String:
	if not default_entry_id.is_empty():
		return default_entry_id
	if _navigation.graph_data().is_empty():
		_navigation.load_graph()
	var map_value: Dictionary = _navigation.map_data(map_id)
	var entries: Array = map_value.get("entries", [])
	if not entries.is_empty():
		return str(entries[0])
	return "start"
