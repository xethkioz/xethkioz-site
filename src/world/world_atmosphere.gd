extends Node2D

const VIEW_HALF := Vector2(320, 180)

var _player: Node2D
var _modulate: CanvasModulate
var _weather := "despejado"
var _hour := 8.0
var _rain: Array[Dictionary] = []
var _mist: Array[Dictionary] = []
var _storm_clock := 0.0

func _ready() -> void:
	z_index = 180
	EventBus.weather_changed.connect(_on_weather_changed)
	EventBus.time_changed.connect(_on_time_changed)
	_build_particles()
	_modulate = CanvasModulate.new()
	_modulate.name = "WorldDayNightModulate"
	get_parent().add_child.call_deferred(_modulate)

func _process(delta: float) -> void:
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
	if is_instance_valid(_player):
		global_position = _player.global_position
	_update_day_night()
	_update_particles(delta)
	_storm_clock += delta
	queue_redraw()

func _build_particles() -> void:
	for index in range(64):
		var x := float((index * 83 + 29) % 650) - 325.0
		var y := float((index * 47 + 17) % 380) - 190.0
		_rain.append({"pos": Vector2(x, y), "speed": 155.0 + float((index * 31) % 85), "length": 7.0 + float(index % 5)})
	for index in range(16):
		var x := float((index * 113 + 41) % 720) - 360.0
		var y := float((index * 59 + 23) % 360) - 180.0
		_mist.append({"pos": Vector2(x, y), "speed": 4.0 + float(index % 5), "radius": 34.0 + float((index * 7) % 38)})

func _update_particles(delta: float) -> void:
	if _weather in ["lluvia", "tormenta_prismatica"]:
		for drop in _rain:
			var pos: Vector2 = drop["pos"]
			pos.y += float(drop["speed"]) * delta
			pos.x -= 38.0 * delta
			if pos.y > VIEW_HALF.y + 16.0:
				pos.y = -VIEW_HALF.y - 16.0
			if pos.x < -VIEW_HALF.x - 20.0:
				pos.x = VIEW_HALF.x + 20.0
			drop["pos"] = pos
	if _weather in ["bruma_prismatica", "tormenta_prismatica"]:
		for cloud in _mist:
			var pos: Vector2 = cloud["pos"]
			pos.x += float(cloud["speed"]) * delta
			if pos.x > VIEW_HALF.x + 90.0:
				pos.x = -VIEW_HALF.x - 90.0
			cloud["pos"] = pos

func _update_day_night() -> void:
	if not is_instance_valid(_modulate):
		return
	var daylight := 1.0
	if _hour < 5.0 or _hour >= 22.0:
		daylight = 0.52
	elif _hour < 7.0:
		daylight = lerpf(0.52, 0.92, (_hour - 5.0) / 2.0)
	elif _hour < 18.5:
		daylight = 1.0
	elif _hour < 21.0:
		daylight = lerpf(1.0, 0.62, (_hour - 18.5) / 2.5)
	else:
		daylight = lerpf(0.62, 0.52, (_hour - 21.0))
	var warm := 0.96 if _hour >= 18.0 and _hour < 21.0 else 1.0
	_modulate.color = Color(daylight * warm, daylight * 0.98, minf(1.0, daylight * 1.08), 1.0)

func _on_weather_changed(weather_id: String) -> void:
	_weather = weather_id
	_storm_clock = 0.0

func _on_time_changed(hour: float) -> void:
	_hour = hour

func _draw() -> void:
	if _weather in ["bruma_prismatica", "tormenta_prismatica"]:
		for cloud in _mist:
			var alpha := 0.035 if _weather == "bruma_prismatica" else 0.05
			draw_circle(cloud["pos"], float(cloud["radius"]), Color(0.65, 0.55, 0.92, alpha))
	if _weather in ["lluvia", "tormenta_prismatica"]:
		var line_color := Color(0.58, 0.78, 0.92, 0.42) if _weather == "lluvia" else Color(0.72, 0.64, 1.0, 0.55)
		for drop in _rain:
			var pos: Vector2 = drop["pos"]
			var length: float = float(drop["length"])
			draw_line(pos, pos + Vector2(-3, length), line_color, 1.0)
	if _weather == "tormenta_prismatica":
		var phase := fmod(_storm_clock, 5.2)
		if phase > 4.82 and phase < 4.94:
			draw_rect(Rect2(-VIEW_HALF, VIEW_HALF * 2.0), Color(0.65, 0.55, 1.0, 0.11), true)
