extends Node2D

# PLAYER-ONLY MAP TEST
# Purpose: validate P01/PLAYER + camera + collisions + chunk streaming before
# integrating any NPC, companion, Familiar, enemy or character package.

const ChunkScript := preload("res://src/world/production_chunk.gd")
const PlayerScript := preload("res://src/player/player_controller_production.gd")

const MANIFEST_PATH := "res://data/regions/golden_region_v34.json"
const CHUNK_PIXELS := 512
const STREAM_RADIUS := 1

var manifest: Dictionary = {}
var player: CharacterBody2D
var active_chunks: Dictionary = {}
var _stream_timer := 0.0
var _world_size := Vector2(2560, 2048)

func _ready() -> void:
	_ensure_inputs()
	manifest = _load_manifest()
	if manifest.is_empty():
		_build_fallback_floor()
	_spawn_player()
	_add_world_boundaries()
	_update_streaming(true)
	_build_test_overlay()
	EventBus.toast_requested.emit("PLAYER ONLY · MAP TEST")

func _process(delta: float) -> void:
	_stream_timer -= delta
	if _stream_timer <= 0.0:
		_stream_timer = 0.18
		_update_streaming(false)

func _ensure_inputs() -> void:
	var actions := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"attack": [KEY_J],
		"dash": [KEY_SHIFT],
		"interact": [KEY_C]
	}
	for action in actions.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		for keycode in actions[action]:
			var exists := false
			for current in InputMap.action_get_events(action):
				if current is InputEventKey and current.physical_keycode == keycode:
					exists = true
			if not exists:
				var event := InputEventKey.new()
				event.physical_keycode = keycode
				InputMap.action_add_event(action, event)

func _load_manifest() -> Dictionary:
	if not FileAccess.file_exists(MANIFEST_PATH):
		push_warning("PLAYER ONLY: Golden Region manifest missing: %s" % MANIFEST_PATH)
		return {}
	var file := FileAccess.open(MANIFEST_PATH, FileAccess.READ)
	if file == null:
		push_warning("PLAYER ONLY: could not open Golden Region manifest")
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		return parsed
	push_warning("PLAYER ONLY: Golden Region manifest is invalid JSON")
	return {}

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 4
	player.set_script(PlayerScript)
	player.position = _manifest_start_position()

	var collision := CollisionShape2D.new()
	collision.name = "PlayerCollision"
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)

	var camera := Camera2D.new()
	camera.name = "WorldCamera"
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 7.5
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(_world_size.x)
	camera.limit_bottom = int(_world_size.y)
	camera.zoom = Vector2.ONE
	player.add_child(camera)

	add_child(player)

func _update_streaming(force: bool) -> void:
	if not is_instance_valid(player) or manifest.is_empty():
		return
	var center := Vector2i(floori(player.position.x / CHUNK_PIXELS), floori(player.position.y / CHUNK_PIXELS))
	var wanted: Dictionary = {}
	for y in range(center.y - STREAM_RADIUS, center.y + STREAM_RADIUS + 1):
		for x in range(center.x - STREAM_RADIUS, center.x + STREAM_RADIUS + 1):
			var coord := Vector2i(x, y)
			var key := _chunk_key(coord)
			if manifest.get("chunks", {}).has(key):
				wanted[key] = coord

	for key in wanted.keys():
		if not active_chunks.has(key):
			_load_chunk(wanted[key])

	for key in active_chunks.keys().duplicate():
		if not wanted.has(key):
			var chunk: Node = active_chunks[key]
			if is_instance_valid(chunk):
				chunk.queue_free()
			active_chunks.erase(key)

	if force:
		_stream_timer = 0.0

func _load_chunk(coord: Vector2i) -> void:
	var key := _chunk_key(coord)
	var data: Dictionary = manifest.get("chunks", {}).get(key, {})
	if data.is_empty():
		return
	var chunk := Node2D.new()
	chunk.name = "Chunk_%s" % key.replace(",", "_")
	chunk.set_script(ChunkScript)
	add_child(chunk)
	move_child(chunk, 0)
	chunk.configure(coord, data, int(manifest.get("world_seed", 21500809)))
	active_chunks[key] = chunk

func _add_world_boundaries() -> void:
	_add_wall(Rect2(-32, -32, _world_size.x + 64, 32))
	_add_wall(Rect2(-32, _world_size.y, _world_size.x + 64, 32))
	_add_wall(Rect2(-32, 0, 32, _world_size.y))
	_add_wall(Rect2(_world_size.x, 0, 32, _world_size.y))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _manifest_start_position() -> Vector2:
	if manifest.is_empty():
		return Vector2(320, 240)
	var chunk_data: Array = manifest.get("start_chunk", [1, 3])
	var local_data: Array = manifest.get("start_local_px", [256, 224])
	return Vector2(
		float(int(chunk_data[0]) * CHUNK_PIXELS + int(local_data[0])),
		float(int(chunk_data[1]) * CHUNK_PIXELS + int(local_data[1]))
	)

func _chunk_key(coord: Vector2i) -> String:
	return "%d,%d" % [coord.x, coord.y]

func _build_fallback_floor() -> void:
	var floor := Polygon2D.new()
	floor.name = "FallbackFloor"
	floor.polygon = PackedVector2Array([
		Vector2(0, 0),
		Vector2(_world_size.x, 0),
		_world_size,
		Vector2(0, _world_size.y)
	])
	floor.color = Color("1c322d")
	floor.z_index = -100
	add_child(floor)

func _build_test_overlay() -> void:
	var canvas := CanvasLayer.new()
	canvas.name = "PlayerOnlyTestHUD"
	canvas.layer = 100
	add_child(canvas)

	var panel := Panel.new()
	panel.position = Vector2(10, 10)
	panel.size = Vector2(248, 74)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.02, 0.03, 0.05, 0.90)
	style.border_color = Color("8b5cf6")
	style.set_border_width_all(1)
	style.set_corner_radius_all(5)
	panel.add_theme_stylebox_override("panel", style)
	canvas.add_child(panel)

	var title := Label.new()
	title.position = Vector2(10, 7)
	title.size = Vector2(228, 18)
	title.text = "PLAYER ONLY · MAP TEST"
	title.add_theme_font_size_override("font_size", 10)
	title.add_theme_color_override("font_color", Color("f0f0f5"))
	panel.add_child(title)

	var info := Label.new()
	info.position = Vector2(10, 27)
	info.size = Vector2(228, 38)
	info.text = "WASD/Flechas mover · SHIFT dash · J ataque\nQ/E/R kit aprendiz · C interacción (sin NPCs)"
	info.add_theme_font_size_override("font_size", 7)
	info.add_theme_color_override("font_color", Color("b8b8c4"))
	panel.add_child(info)
