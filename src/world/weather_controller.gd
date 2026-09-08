extends Node

@export var cycle_seconds := 45.0
var weather_id := "despejado"
var _elapsed := 0.0

func _ready() -> void:
	EventBus.weather_changed.emit(weather_id)

func _process(delta: float) -> void:
	_elapsed += delta
	if _elapsed < cycle_seconds:
		return
	_elapsed = 0.0
	weather_id = "bruma_prismatica" if weather_id == "despejado" else "despejado"
	EventBus.weather_changed.emit(weather_id)
	EventBus.toast_requested.emit("El clima cambia: %s" % weather_id.replace("_", " ").capitalize())
