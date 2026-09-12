extends Node2D

# Low-cost world-space ambience for the authored M01-M05 pass.
# Pixel motes and authored light anchors are deterministic per map, non-colliding
# and purely visual. External XNB lighting/effect libraries are reference-only:
# this pass is rendered natively in Godot and does not reuse third-party pixels.

var _map_id := "M01"
var _world_size := Vector2(1024, 1024)
var _seed_value := 21500809
var _clock := 0.0
var _motes: Array[Dictionary] = []
var _light_anchors: Array[Dictionary] = []
var _palette := PackedColorArray([Color("8b5cf6"), Color("6ed4e8")])
var _density := 70
var _drift_scale := 1.0

func configure(map_id_value: String, world_size_value: Vector2, seed_value: int) -> void:
	_map_id = map_id_value
	_world_size = world_size_value
	_seed_value = seed_value
	_apply_identity()
	_build_motes()
	_build_light_anchors()
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

func _build_light_anchors() -> void:
	_light_anchors.clear()
	match _map_id:
		"M01":
			_add_light_anchor(Vector2(760, 430), 68.0, Color("8b5cf6"), 0.085, 0.72)
			_add_light_anchor(Vector2(690, 520), 48.0, Color("73d8c8"), 0.060, 0.56)
		"M02":
			_add_light_anchor(Vector2(530, 500), 64.0, Color("6ed4e8"), 0.080, 0.62)
			_add_light_anchor(Vector2(330, 430), 58.0, Color("ffb05f"), 0.050, 0.38)
			_add_light_anchor(Vector2(705, 620), 58.0, Color("ffb05f"), 0.050, 0.44)
		"M03":
			_add_light_anchor(Vector2(650, 485), 70.0, Color("3fc7c9"), 0.080, 0.54)
			_add_light_anchor(Vector2(650, 600), 44.0, Color("3fc7c9"), 0.060, 0.70)
			_add_light_anchor(Vector2(770, 620), 46.0, Color("8b5cf6"), 0.065, 0.82)
			_add_light_anchor(Vector2(875, 600), 44.0, Color("3fc7c9"), 0.060, 0.74)
		"M04":
			_add_light_anchor(Vector2(350, 250), 62.0, Color("6ed4e8"), 0.055, 0.46)
			_add_light_anchor(Vector2(760, 640), 72.0, Color("8b5cf6"), 0.080, 0.72)
			_add_light_anchor(Vector2(650, 730), 42.0, Color("a855f7"), 0.060, 0.68)
			_add_light_anchor(Vector2(760, 730), 46.0, Color("6ed4e8"), 0.060, 0.78)
			_add_light_anchor(Vector2(870, 730), 42.0, Color("a855f7"), 0.060, 0.73)
			_add_light_anchor(Vector2(875, 845), 64.0, Color("a855f7"), 0.070, 0.58)
		"M05":
			_add_light_anchor(Vector2(256, 220), 92.0, Color("8b5cf6"), 0.075, 0.86)
			_add_light_anchor(Vector2(256, 300), 66.0, Color("ff8c42"), 0.065, 0.52)

func _add_light_anchor(position_value: Vector2, radius_value: float, color_value: Color, strength_value: float, phase_value: float) -> void:
	_light_anchors.append({
		"position": position_value,
		"radius": radius_value,
		"color": color_value,
		"strength": strength_value,
		"phase": phase_value * TAU
	})

func get_light_anchor_count() -> int:
	return _light_anchors.size()

func _draw() -> void:
	if _palette.is_empty() or _world_size.x <= 0.0 or _world_size.y <= 0.0:
		return
	_draw_light_anchors()
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

func _draw_light_anchors() -> void:
	for anchor_value in _light_anchors:
		var anchor: Dictionary = anchor_value
		var position_value: Vector2 = anchor["position"]
		var radius_value: float = float(anchor["radius"])
		var color_value: Color = anchor["color"]
		var strength_value: float = float(anchor["strength"])
		var phase_value: float = float(anchor["phase"])
		var pulse := 0.5 + 0.5 * sin(_clock * 1.65 + phase_value)
		var radius_scale := lerpf(0.94, 1.05, pulse)
		for ring in range(5, 0, -1):
			var normalized := float(ring) / 5.0
			var ring_radius := radius_value * normalized * radius_scale
			var ring_color := color_value
			ring_color.a = strength_value * (1.0 - normalized * 0.72) * lerpf(0.82, 1.0, pulse)
			draw_circle(position_value, ring_radius, ring_color)
		var core_color := color_value.lightened(0.28)
		core_color.a = strength_value * lerpf(0.62, 0.92, pulse)
		draw_circle(position_value, 2.0, core_color)
		var sparkle_color := Color.WHITE
		sparkle_color.a = strength_value * 2.4 * pulse
		draw_line(position_value + Vector2(-4, 0), position_value + Vector2(4, 0), sparkle_color, 1.0)
		draw_line(position_value + Vector2(0, -4), position_value + Vector2(0, 4), sparkle_color, 1.0)

func _unit(index: int, salt: int) -> float:
	var n: int = _seed_value ^ ((index + 1) * 374761393) ^ (salt * 668265263)
	n = (n ^ (n >> 13)) * 1274126177
	return float(absi(n) % 10000) / 9999.0
