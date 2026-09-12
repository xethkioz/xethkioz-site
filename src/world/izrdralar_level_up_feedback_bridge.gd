class_name IzrdralarLevelUpFeedbackBridge
extends Node

const LevelUpFeedbackScript := preload("res://src/fx/izrdralar_level_up_feedback.gd")

var _last_level: int = 1

func _ready() -> void:
	_last_level = GameState.player_level
	if not EventBus.player_progress_changed.is_connected(_on_player_progress_changed):
		EventBus.player_progress_changed.connect(_on_player_progress_changed)

func _on_player_progress_changed(level: int, _xp: int, _xp_to_next: int) -> void:
	if level <= _last_level:
		_last_level = level
		return
	_last_level = level
	var player := get_tree().get_first_node_in_group("player") as Node2D
	var scene := get_tree().current_scene
	if not is_instance_valid(player) or scene == null:
		return
	var feedback := Node2D.new()
	feedback.name = "LevelUpFeedback_L%d" % level
	feedback.set_script(LevelUpFeedbackScript)
	feedback.global_position = player.global_position + Vector2(0, -10)
	scene.add_child(feedback)
	feedback.call("configure", level)
