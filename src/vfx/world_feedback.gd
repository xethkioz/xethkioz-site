extends Node2D

const DAMAGE_DURATION := 0.62
const BURST_DURATION := 0.34
const SLASH_DURATION := 0.18
const PICKUP_DURATION := 0.92

var _damage_numbers: Array[Dictionary] = []
var _bursts: Array[Dictionary] = []
var _slashes: Array[Dictionary] = []
var _pickups: Array[Dictionary] = []

func _ready() -> void:
	z_index = 200
	EventBus.damage_feedback_requested.connect(_on_damage_feedback)
	EventBus.slash_feedback_requested.connect(_on_slash_feedback)
	EventBus.pickup_feedback_requested.connect(_on_pickup_feedback)
	EventBus.burst_feedback_requested.connect(_on_burst_feedback)
	set_process(true)

func _process(delta: float) -> void:
	_advance_entries(_damage_numbers, delta, DAMAGE_DURATION)
	_advance_entries(_bursts, delta, BURST_DURATION)
	_advance_entries(_slashes, delta, SLASH_DURATION)
	_advance_entries(_pickups, delta, PICKUP_DURATION)
	if not _damage_numbers.is_empty() or not _bursts.is_empty() or not _slashes.is_empty() or not _pickups.is_empty():
		queue_redraw()

func _advance_entries(entries: Array[Dictionary], delta: float, duration: float) -> void:
	for index in range(entries.size() - 1, -1, -1):
		var entry: Dictionary = entries[index]
		entry["age"] = float(entry.get("age", 0.0)) + delta
		if float(entry["age"]) >= duration:
			entries.remove_at(index)
		else:
			entries[index] = entry

func _on_damage_feedback(world_position: Vector2, amount: float, accent: Color, heavy: bool) -> void:
	_damage_numbers.append({
		"position": world_position,
		"amount": amount,
		"accent": accent,
		"heavy": heavy,
		"age": 0.0
	})
	_bursts.append({
		"position": world_position,
		"accent": accent,
		"intensity": 12 if heavy else 7,
		"age": 0.0
	})
	queue_redraw()

func _on_slash_feedback(world_position: Vector2, direction: Vector2, accent: Color, radius: float) -> void:
	var safe_direction: Vector2 = direction.normalized() if direction.length_squared() > 0.001 else Vector2.DOWN
	_slashes.append({
		"position": world_position,
		"direction": safe_direction,
		"accent": accent,
		"radius": maxf(12.0, radius),
		"age": 0.0
	})
	queue_redraw()

func _on_pickup_feedback(world_position: Vector2, label: String, accent: Color) -> void:
	_pickups.append({
		"position": world_position,
		"label": label,
		"accent": accent,
		"age": 0.0
	})
	_bursts.append({
		"position": world_position,
		"accent": accent,
		"intensity": 5,
		"age": 0.0
	})
	queue_redraw()

func _on_burst_feedback(world_position: Vector2, accent: Color, intensity: int) -> void:
	_bursts.append({
		"position": world_position,
		"accent": accent,
		"intensity": clampi(intensity, 3, 24),
		"age": 0.0
	})
	queue_redraw()

func _draw() -> void:
	_draw_slashes()
	_draw_bursts()
	_draw_damage_numbers()
	_draw_pickups()

func _draw_slashes() -> void:
	for entry in _slashes:
		var age: float = float(entry.get("age", 0.0))
		var t: float = clampf(age / SLASH_DURATION, 0.0, 1.0)
		var position_value: Vector2 = entry.get("position", Vector2.ZERO)
		var direction: Vector2 = entry.get("direction", Vector2.DOWN)
		var accent: Color = entry.get("accent", Color.WHITE)
		var radius: float = float(entry.get("radius", 24.0))
		var alpha: float = 1.0 - t
		var angle: float = direction.angle()
		var center: Vector2 = position_value + direction * (radius * 0.55)
		var outer_color := Color(accent.r, accent.g, accent.b, alpha * 0.95)
		var inner_color := Color(0.95, 0.96, 1.0, alpha * 0.78)
		draw_arc(center, radius * (0.72 + t * 0.18), angle - 0.92, angle + 0.92, 18, outer_color, 4.0 - t * 1.5)
		draw_arc(center, radius * (0.55 + t * 0.14), angle - 0.78, angle + 0.78, 16, inner_color, 1.5)

func _draw_bursts() -> void:
	for entry in _bursts:
		var age: float = float(entry.get("age", 0.0))
		var t: float = clampf(age / BURST_DURATION, 0.0, 1.0)
		var position_value: Vector2 = entry.get("position", Vector2.ZERO)
		var accent: Color = entry.get("accent", Color.WHITE)
		var intensity: int = int(entry.get("intensity", 6))
		var alpha: float = 1.0 - t
		var distance: float = 5.0 + t * 23.0
		for index in range(intensity):
			var angle: float = TAU * float(index) / float(intensity) + float(index % 3) * 0.19
			var direction := Vector2.from_angle(angle)
			var start: Vector2 = position_value + direction * maxf(1.0, distance - 5.0)
			var finish: Vector2 = position_value + direction * distance
			var particle_color := Color(accent.r, accent.g, accent.b, alpha * (0.88 if index % 2 == 0 else 0.55))
			draw_line(start, finish, particle_color, 2.0 if index % 3 == 0 else 1.0)
		if t < 0.48:
			var ring_alpha: float = (1.0 - t / 0.48) * 0.68
			draw_arc(position_value, 5.0 + t * 18.0, 0.0, TAU, 20, Color(accent.r, accent.g, accent.b, ring_alpha), 2.0)

func _draw_damage_numbers() -> void:
	var font: Font = ThemeDB.fallback_font
	for entry in _damage_numbers:
		var age: float = float(entry.get("age", 0.0))
		var t: float = clampf(age / DAMAGE_DURATION, 0.0, 1.0)
		var position_value: Vector2 = entry.get("position", Vector2.ZERO)
		var amount: float = float(entry.get("amount", 0.0))
		var accent: Color = entry.get("accent", Color.WHITE)
		var heavy: bool = bool(entry.get("heavy", false))
		var rise: float = 10.0 + 25.0 * t
		var alpha: float = 1.0 - t
		var font_size: int = 12 if heavy else 10
		var text := "%d" % maxi(1, roundi(amount))
		var draw_position := position_value + Vector2(-20.0, -18.0 - rise)
		draw_string(font, draw_position + Vector2(1, 1), text, HORIZONTAL_ALIGNMENT_CENTER, 40.0, font_size, Color(0.03, 0.03, 0.05, alpha * 0.85))
		draw_string(font, draw_position, text, HORIZONTAL_ALIGNMENT_CENTER, 40.0, font_size, Color(accent.r, accent.g, accent.b, alpha))

func _draw_pickups() -> void:
	var font: Font = ThemeDB.fallback_font
	for entry in _pickups:
		var age: float = float(entry.get("age", 0.0))
		var t: float = clampf(age / PICKUP_DURATION, 0.0, 1.0)
		var position_value: Vector2 = entry.get("position", Vector2.ZERO)
		var label: String = str(entry.get("label", "Recurso"))
		var accent: Color = entry.get("accent", Color.WHITE)
		var alpha: float = 1.0 - t
		var rise: float = 8.0 + 22.0 * t
		var draw_position := position_value + Vector2(-52.0, -18.0 - rise)
		draw_string(font, draw_position + Vector2(1, 1), "+ " + label, HORIZONTAL_ALIGNMENT_CENTER, 104.0, 8, Color(0.02, 0.02, 0.04, alpha * 0.82))
		draw_string(font, draw_position, "+ " + label, HORIZONTAL_ALIGNMENT_CENTER, 104.0, 8, Color(accent.r, accent.g, accent.b, alpha))
