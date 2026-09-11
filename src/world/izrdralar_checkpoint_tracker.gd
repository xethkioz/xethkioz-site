class_name IzrdralarCheckpointTracker
extends Node

@export var map_id: String = "M01"
@export var update_interval := 0.20

var _player: Node2D
var _elapsed := 0.0

func _ready() -> void:
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

	if GameState.current_map_id != map_id:
		GameState.set_world_checkpoint(map_id, _default_entry_id(), Vector2.ZERO)

	if GameState.last_world_position != Vector2.ZERO:
		_player.global_position = GameState.last_world_position
		return

	var entry := _find_entry_point(GameState.current_entry_id)
	if entry == null:
		entry = _find_entry_point(_default_entry_id())
	if entry != null:
		_player.global_position = entry.global_position
		GameState.set_world_checkpoint(map_id, str(entry.get_meta("entry_id", GameState.current_entry_id)), _player.global_position)

func _find_entry_point(entry_id: String) -> Node2D:
	for node in get_tree().get_nodes_in_group("izrdralar_entry_point"):
		if node is Node2D and str(node.get_meta("entry_id", "")) == entry_id:
			return node as Node2D
	return null

func _default_entry_id() -> String:
	return "start" if map_id == "M01" else "from_m01"
