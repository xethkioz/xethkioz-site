extends Control

const C_BG := Color(0.025, 0.035, 0.055, 0.94)
const C_GRID := Color(0.35, 0.42, 0.50, 0.22)
const C_BORDER := Color(0.55, 0.36, 0.96, 0.85)
const C_PLAYER := Color(1.0, 0.55, 0.26, 1.0)
const C_DISCOVERED := Color(0.86, 0.82, 1.0, 1.0)
const C_UNKNOWN := Color(0.42, 0.46, 0.52, 0.28)

var _player: Node2D
var _world_size := Vector2(2560, 2048)
var _poi: Array = []

func configure(player_ref: Node2D, world_size_value: Vector2, poi_data: Array) -> void:
	_player = player_ref
	_world_size = Vector2(maxf(1.0, world_size_value.x), maxf(1.0, world_size_value.y))
	_poi = poi_data.duplicate(true)
	queue_redraw()

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _draw() -> void:
	var outer := Rect2(Vector2.ZERO, size)
	draw_rect(outer, C_BG, true)
	draw_rect(outer, C_BORDER, false, 1.0)
	var inner := Rect2(Vector2(6, 14), Vector2(maxf(10.0, size.x - 12.0), maxf(10.0, size.y - 20.0)))
	draw_rect(inner, Color(0.08, 0.16, 0.15, 0.78), true)
	for x in range(1, 5):
		var px := inner.position.x + inner.size.x * float(x) / 5.0
		draw_line(Vector2(px, inner.position.y), Vector2(px, inner.end.y), C_GRID, 1.0)
	for y in range(1, 4):
		var py := inner.position.y + inner.size.y * float(y) / 4.0
		draw_line(Vector2(inner.position.x, py), Vector2(inner.end.x, py), C_GRID, 1.0)

	for raw in _poi:
		if raw is not Dictionary:
			continue
		var entry: Dictionary = raw
		var id := str(entry.get("id", ""))
		var p := _poi_world_position(entry)
		var map_p := _to_map(p, inner)
		var discovered := GameState.has_poi(id)
		var color := C_DISCOVERED if discovered else C_UNKNOWN
		var radius := 2.6 if discovered else 1.7
		if str(entry.get("kind", "")) == "boss" and discovered:
			color = Color("ff8c42")
		elif str(entry.get("kind", "")) == "creatures" and discovered:
			color = Color("6ed4e8")
		draw_circle(map_p, radius, color)

	if is_instance_valid(_player):
		draw_circle(_to_map(_player.global_position, inner), 3.0, C_PLAYER)
		draw_circle(_to_map(_player.global_position, inner), 5.0, Color(C_PLAYER.r, C_PLAYER.g, C_PLAYER.b, 0.22), false, 1.0)

	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(6, 10), _nearest_label().to_upper(), HORIZONTAL_ALIGNMENT_LEFT, size.x - 12.0, 7, Color("f0f0f5"))

func _to_map(world_pos: Vector2, inner: Rect2) -> Vector2:
	var nx := clampf(world_pos.x / _world_size.x, 0.0, 1.0)
	var ny := clampf(world_pos.y / _world_size.y, 0.0, 1.0)
	return inner.position + Vector2(nx * inner.size.x, ny * inner.size.y)

func _poi_world_position(entry: Dictionary) -> Vector2:
	var chunk: Array = entry.get("chunk", [0, 0])
	var local: Array = entry.get("local", [256, 256])
	return Vector2(float(int(chunk[0]) * 512 + int(local[0])), float(int(chunk[1]) * 512 + int(local[1])))

func _nearest_label() -> String:
	if not is_instance_valid(_player):
		return "REGIÓN DORADA"
	var best_name := "REGIÓN DORADA"
	var best_distance := 999999.0
	for raw in _poi:
		if raw is not Dictionary:
			continue
		var entry: Dictionary = raw
		var d := _player.global_position.distance_to(_poi_world_position(entry))
		if d < best_distance:
			best_distance = d
			best_name = str(entry.get("name", "REGIÓN DORADA"))
	return best_name if best_distance <= 220.0 else "REGIÓN DORADA"
