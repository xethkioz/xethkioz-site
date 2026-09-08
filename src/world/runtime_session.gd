extends Node

const WORLD_BOUNDS := Rect2(16, 16, 2528, 2016)
const AUTOSAVE_SECONDS := 8.0

var _player: Node2D
var _spawn_resolved := false
var _save_timer := AUTOSAVE_SECONDS

func _ready() -> void:
	EventBus.quest_changed.connect(_on_progress_event)
	EventBus.poi_discovered.connect(_on_poi_discovered)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.familiar_trained.connect(_on_familiar_trained)

func _process(delta: float) -> void:
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return
	if not _spawn_resolved:
		_spawn_resolved = true
		var saved := GameState.last_world_position
		if saved != Vector2.ZERO and WORLD_BOUNDS.has_point(saved):
			_player.global_position = saved
			EventBus.toast_requested.emit("Partida reanudada · posición restaurada")
	_save_timer -= delta
	if _save_timer <= 0.0:
		_save_timer = AUTOSAVE_SECONDS
		_save_now()

func _exit_tree() -> void:
	if is_instance_valid(_player):
		GameState.set_last_world_position(_player.global_position)
		SaveService.save_game()

func _on_progress_event(_title: String, _objective: String, _completed: bool) -> void:
	call_deferred("_save_now")

func _on_poi_discovered(_poi_id: String, _display_name: String, _count: int, _reward: int) -> void:
	call_deferred("_save_now")

func _on_familiar_captured(_species_id: String, _display_name: String) -> void:
	call_deferred("_save_now")

func _on_familiar_trained(_species_id: String, _rank: int, _mentor_id: String) -> void:
	call_deferred("_save_now")

func _save_now() -> void:
	if is_instance_valid(_player):
		GameState.set_last_world_position(_player.global_position)
	SaveService.save_game()
