extends Node

@export var cycle_seconds := 55.0

const NORMAL_SEQUENCE := ["despejado", "bruma_prismatica", "lluvia"]
const BOSS_STATE := 7

var weather_id := "despejado"
var _elapsed := 0.0
var _normal_index := 0
var _boss_override := false

func _ready() -> void:
	EventBus.demo_stage_changed.connect(_on_demo_stage_changed)
	var snapshot := GameState.get_quest_snapshot()
	if int(snapshot.get("state", -1)) == BOSS_STATE:
		_boss_override = true
		weather_id = "tormenta_prismatica"
	else:
		weather_id = NORMAL_SEQUENCE[_normal_index]
	EventBus.weather_changed.emit(weather_id)

func _process(delta: float) -> void:
	if _boss_override:
		return
	_elapsed += delta
	if _elapsed < cycle_seconds:
		return
	_elapsed = 0.0
	_normal_index = (_normal_index + 1) % NORMAL_SEQUENCE.size()
	_set_weather(NORMAL_SEQUENCE[_normal_index], true)

func _on_demo_stage_changed(stage_id: String) -> void:
	match stage_id:
		"boss5":
			_boss_override = true
			_set_weather("tormenta_prismatica", true)
		"refuge_after_boss", "mentor_choice", "training", "fermin_training", "demo_complete":
			if _boss_override:
				_boss_override = false
				_elapsed = 0.0
				_normal_index = 0
				_set_weather("despejado", true)

func _set_weather(next_id: String, announce: bool) -> void:
	if weather_id == next_id:
		return
	weather_id = next_id
	EventBus.weather_changed.emit(weather_id)
	if announce:
		var names := {
			"despejado": "Cielo despejado",
			"bruma_prismatica": "Bruma prismática",
			"lluvia": "Lluvia sobre Izrdralar",
			"tormenta_prismatica": "Tormenta prismática"
		}
		EventBus.toast_requested.emit(str(names.get(weather_id, weather_id.replace("_", " ").capitalize())))
