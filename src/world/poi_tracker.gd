extends Node

var _player: Node2D
var _poi: Array = []
var _timer := 0.0

func configure(player_ref: Node2D, poi_data: Array) -> void:
	_player = player_ref
	_poi = poi_data.duplicate(true)

func _process(delta: float) -> void:
	_timer -= delta
	if _timer > 0.0:
		return
	_timer = 0.18
	if not is_instance_valid(_player):
		return
	for raw in _poi:
		if raw is not Dictionary:
			continue
		var entry: Dictionary = raw
		var id := str(entry.get("id", ""))
		if id.is_empty() or GameState.has_poi(id):
			continue
		if _player.global_position.distance_to(_world_position(entry)) <= 88.0:
			var reward := GameState.discover_poi(id, str(entry.get("name", id)))
			if reward > 0:
				EventBus.toast_requested.emit("Lugar descubierto · %s · +%d XP" % [str(entry.get("name", id)), reward])

func _world_position(entry: Dictionary) -> Vector2:
	var chunk: Array = entry.get("chunk", [0, 0])
	var local: Array = entry.get("local", [256, 256])
	return Vector2(float(int(chunk[0]) * 512 + int(local[0])), float(int(chunk[1]) * 512 + int(local[1])))
