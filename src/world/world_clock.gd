extends Node

@export var start_hour := 8.0
@export var real_seconds_per_game_hour := 20.0
var hour := 8.0

func _ready() -> void:
	hour = start_hour
	EventBus.time_changed.emit(hour)

func _process(delta: float) -> void:
	hour = fmod(hour + delta / real_seconds_per_game_hour, 24.0)
	EventBus.time_changed.emit(hour)
