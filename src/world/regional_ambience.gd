extends Node2D

const VIEW_HALF := Vector2(320, 180)
const CHUNK_PIXELS: float = 512.0

var _player: Node2D
var _motes: Array[Dictionary] = []
var _time: float = 0.0
var _biome: String = "forest"

func _ready() -> void:
	z_index = 35
	for index in range(22):
		var px: float = float((index * 97 + 31) % 620) - 310.0
		var py: float = float((index * 61 + 19) % 340) - 170.0
		var phase: float = float((index * 37) % 100) * 0.063
		var speed: float = 5.0 + float((index * 13) % 11)
		_motes.append({"pos":Vector2(px, py), "phase":phase, "speed":speed})

func _process(delta: float) -> void:
	_time += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
	if not is_instance_valid(_player):
		return
	global_position = _player.global_position
	var chunk := Vector2i(floori(_player.global_position.x / CHUNK_PIXELS), floori(_player.global_position.y / CHUNK_PIXELS))
	_biome = _biome_for_chunk(chunk)
	_update_motes(delta)
	queue_redraw()

func _update_motes(delta: float) -> void:
	for index in range(_motes.size()):
		var mote: Dictionary = _motes[index]
		var pos: Vector2 = mote.get("pos", Vector2.ZERO)
		var speed: float = float(mote.get("speed", 8.0))
		match _biome:
			"lake":
				pos.x += speed * 0.42 * delta
			"ruins":
				pos.y -= speed * 0.55 * delta
			"sanctuary":
				pos.y -= speed * 0.28 * delta
			"boss":
				pos.y -= speed * 0.78 * delta
			_:
				pos.x += speed * 0.25 * delta
		if pos.x > VIEW_HALF.x + 12.0:
			pos.x = -VIEW_HALF.x - 12.0
		if pos.x < -VIEW_HALF.x - 12.0:
			pos.x = VIEW_HALF.x + 12.0
		if pos.y > VIEW_HALF.y + 12.0:
			pos.y = -VIEW_HALF.y - 12.0
		if pos.y < -VIEW_HALF.y - 12.0:
			pos.y = VIEW_HALF.y + 12.0
		mote["pos"] = pos
		_motes[index] = mote

func _biome_for_chunk(chunk: Vector2i) -> String:
	if chunk == Vector2i(1, 1):
		return "lake"
	if chunk == Vector2i(3, 1) or chunk == Vector2i(3, 0) or chunk == Vector2i(4, 3):
		return "ruins"
	if chunk == Vector2i(3, 2):
		return "sanctuary"
	if chunk == Vector2i(4, 0):
		return "boss"
	return "forest"

func _draw() -> void:
	match _biome:
		"lake":
			_draw_lake_motes()
		"ruins":
			_draw_ruin_motes()
		"sanctuary":
			_draw_sanctuary_motes()
		"boss":
			_draw_boss_motes()
		_:
			_draw_forest_motes()

func _draw_forest_motes() -> void:
	for index in range(12):
		var mote: Dictionary = _motes[index]
		var base: Vector2 = mote.get("pos", Vector2.ZERO)
		var phase: float = float(mote.get("phase", 0.0))
		var pos := base + Vector2(0.0, sin(_time * 0.8 + phase) * 3.0)
		var color := Color(0.58, 0.78, 0.50, 0.12 + 0.08 * (0.5 + 0.5 * sin(_time + phase)))
		draw_circle(pos, 1.2, color)
		if index % 3 == 0:
			draw_line(pos - Vector2(2, 1), pos + Vector2(2, 1), Color(1.0, 0.55, 0.26, color.a * 0.65), 1.0)

func _draw_lake_motes() -> void:
	for index in range(14):
		var mote: Dictionary = _motes[index]
		var base: Vector2 = mote.get("pos", Vector2.ZERO)
		var phase: float = float(mote.get("phase", 0.0))
		var bob: float = sin(_time * 1.6 + phase) * 4.0
		var pos := base + Vector2(0, bob)
		var pulse: float = 0.18 + 0.16 * (0.5 + 0.5 * sin(_time * 2.2 + phase))
		draw_circle(pos, 2.0, Color(0.38, 0.88, 0.92, pulse))
		draw_line(pos - Vector2(5, 5), pos + Vector2(5, 5), Color(0.55, 0.36, 0.96, pulse * 0.34), 1.0)

func _draw_ruin_motes() -> void:
	for index in range(14):
		var mote: Dictionary = _motes[index]
		var pos: Vector2 = mote.get("pos", Vector2.ZERO)
		var phase: float = float(mote.get("phase", 0.0))
		var alpha: float = 0.12 + 0.12 * (0.5 + 0.5 * sin(_time * 1.8 + phase))
		var diamond := PackedVector2Array([pos + Vector2(0,-3), pos + Vector2(2,0), pos + Vector2(0,3), pos + Vector2(-2,0)])
		draw_colored_polygon(diamond, Color(0.65, 0.45, 1.0, alpha))

func _draw_sanctuary_motes() -> void:
	for index in range(16):
		var mote: Dictionary = _motes[index]
		var base: Vector2 = mote.get("pos", Vector2.ZERO)
		var phase: float = float(mote.get("phase", 0.0))
		var pos := base + Vector2(sin(_time * 0.7 + phase) * 4.0, 0.0)
		var alpha: float = 0.10 + 0.14 * (0.5 + 0.5 * sin(_time * 1.4 + phase))
		draw_circle(pos, 1.6, Color(0.48, 0.78, 0.56, alpha))
		if index % 4 == 0:
			draw_arc(pos, 5.0, 0.0, TAU, 12, Color(0.55, 0.36, 0.96, alpha * 0.50), 1.0)

func _draw_boss_motes() -> void:
	for index in range(16):
		var mote: Dictionary = _motes[index]
		var pos: Vector2 = mote.get("pos", Vector2.ZERO)
		var phase: float = float(mote.get("phase", 0.0))
		var alpha: float = 0.15 + 0.17 * (0.5 + 0.5 * sin(_time * 2.6 + phase))
		draw_line(pos, pos + Vector2(0, -5), Color(0.74, 0.38, 0.88, alpha), 1.4)
		if index % 3 == 0:
			draw_circle(pos + Vector2(0,-6), 1.4, Color(1.0, 0.42, 0.34, alpha * 0.85))
