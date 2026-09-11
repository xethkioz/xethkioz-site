extends Node2D

# Low-cost world-space ambience for the authored M01-M05 pass.
# Pixel motes are deterministic per map, non-colliding and purely visual.

var _map_id := "M01"
var _world_size := Vector2(1024, 1024)
var _seed_value := 21500809
var _clock := 0.0
var _motes: Array[Dictionary] = []
var _palette := PackedColorArray([Color("8b5cf6"), Color("6ed4e8")])
var _density := 70
var _drift_scale := 1.0

func configure(map_id_value: String, world_size_value: Vector2, seed_value: int) -> void:
	_map_id = map_id_value
	_world_size = world_size_value
	_seed_value = seed_value
	_apply_identity()
	_build_motes()
	z_index = -2
	process_mode = Node.PROCESS_MODE_ALWAYS

func _process(delta: float) -> void:
	_clock += delta
	queue_redraw()

func _apply_identity() -> void:
	match _map_id:
		"M01":
			_palette = PackedColorArray([Color("9d7bff"), Color("73d8c8"), Color("ffb05f")])
			_density = 78
			_drift_scale = 0.8
		"M02":
			_palette = PackedColorArray([Color("ffb05f"), Color("d8ceff"), Color("73d8c8")])
			_density = 54
			_drift_scale = 0.55
		"M03":
			_palette = PackedColorArray([Color("73d8c8"), Color("a7eff2"), Color("9d7bff")])
			_density = 86
			_drift_scale = 0.65
		"M04":
			_palette = PackedColorArray([Color("9d7bff"), Color("d8ceff"), Color("3fc7c9")])
			_density = 92
			_drift_scale = 0.45
		"M05":
			_palette = PackedColorArray([Color("9d7bff"), Color("ff8c42"), Color("d8ceff")])
			_density = 64
			_drift_scale = 0.7
		_:
			_density = 60

func _build_motes() -> void:
	_motes.clear()
	for index in range(_density):
		var base := Vector2(
			_unit(index, 11) * _world_size.x,
			_unit(index, 23) * _world_size.y
		)
		var angle := _unit(index, 37) * TAU
		var speed_value := lerpf(3.0, 9.0, _unit(index, 41)) * _drift_scale
		var speed := Vector2(cos(angle), sin(angle)) * speed_value
		var size_value := 1.0 if _unit(index, 53) < 0.78 else 2.0
		_motes.append({
			"base": base,
			"speed": speed,
			"phase": _unit(index, 67) * TAU,
			"amp": lerpf(1.0, 5.0, _unit(index, 71)),
			"size": size_value,
			"color": int(floor(_unit(index, 83) * float(_palette.size()))) % max(1, _palette.size())
		})

func _draw() -> void:
	if _palette.is_empty() or _world_size.x <= 0.0 or _world_size.y <= 0.0:
		return
	for index in range(_motes.size()):
		var mote: Dictionary = _motes[index]
		var phase: float = float(mote["phase"])
		var amp: float = float(mote["amp"])
		var drift: Vector2 = mote["speed"] * _clock
		var wobble := Vector2(
			sin(_clock * 1.3 + phase),
			cos(_clock * 1.1 + phase * 0.73)
		) * amp
		var point: Vector2 = mote["base"] + drift + wobble
		point.x = fposmod(point.x, _world_size.x)
		point.y = fposmod(point.y, _world_size.y)
		point = Vector2(roundf(point.x), roundf(point.y))
		var pulse := 0.5 + 0.5 * sin(_clock * 2.0 + phase)
		var alpha := lerpf(0.16, 0.48, pulse)
		var color_value: Color = _palette[int(mote["color"])]
		color_value.a = alpha
		var size_value: float = float(mote["size"])
		draw_rect(Rect2(point, Vector2(size_value, size_value)), color_value, true)

func _unit(index: int, salt: int) -> float:
	var n: int = _seed_value ^ ((index + 1) * 374761393) ^ (salt * 668265263)
	n = (n ^ (n >> 13)) * 1274126177
	return float(absi(n) % 10000) / 9999.0
