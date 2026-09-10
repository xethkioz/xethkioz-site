extends Node2D

# IZRDRALAR 01-32 · CONTINENT FUNCTIONAL V2
# PLAYER ONLY. Data-driven maps with Pokémon Emerald-inspired route readability:
# natural edge transitions, compact boss arenas, varied map sizes and route blockers.

const GenericChunkScript := preload("res://src/world/izrdralar_generic_chunk.gd")
const PlayerScript := preload("res://src/player/player_controller_production.gd")

const MANIFEST_PATH := "res://data/regions/izrdralar_map_chain_01_32.json"
const PROGRESS_PATH := "user://izrdralar_continent_test.json"
const CHUNK_PIXELS := 512
const EDGE_MARGIN := 34.0
const EDGE_TRIGGER_RADIUS := 58.0
const SPAWN_INSET := 118.0
const TRANSITION_FADE := 0.18

var manifest: Dictionary = {}
var current_map: Dictionary = {}
var current_map_id: int = 1
var player: CharacterBody2D
var world_size := Vector2(1024, 1024)
var entry_path_position := Vector2.ZERO
var exit_path_position := Vector2.ZERO
var _transition_locked := false
var _transition_grace := 0.75
var _zone_label: Label
var _edge_label: Label
var _fade: ColorRect

func _ready() -> void:
	_ensure_inputs()
	manifest = _load_manifest()
	if manifest.is_empty():
		push_error("IZRDRALAR V2: manifest missing or invalid")
		return
	current_map_id = _requested_map_id()
	current_map = _map_by_id(current_map_id)
	if current_map.is_empty():
		push_error("IZRDRALAR V2: map id %d missing" % current_map_id)
		return
	_build_current_map()
	EventBus.toast_requested.emit("IZRDRALAR · M%02d/32 · %s" % [current_map_id, str(current_map.get("n", ""))])

func _process(delta: float) -> void:
	if not is_instance_valid(player) or _transition_locked:
		return
	_transition_grace = maxf(0.0, _transition_grace - delta)
	_update_zone_hint()
	_update_edge_hint_and_transition()

func _unhandled_key_input(event: InputEvent) -> void:
	if not event is InputEventKey or not event.pressed or event.echo:
		return
	if event.physical_keycode == KEY_PAGEDOWN and current_map_id < 32:
		_begin_transition(current_map_id + 1, "forward", true)
	elif event.physical_keycode == KEY_PAGEUP and current_map_id > 1:
		_begin_transition(current_map_id - 1, "backward", true)
	elif event.physical_keycode == KEY_HOME and current_map_id != 1:
		_begin_transition(1, "forward", true)
	elif event.physical_keycode == KEY_END and current_map_id != 32:
		_begin_transition(32, "forward", true)

func _requested_map_id() -> int:
	var env_id := OS.get_environment("XETHKIOZ_MAP_ID")
	if not env_id.is_empty() and env_id.is_valid_int():
		return clampi(env_id.to_int(), 1, 32)
	if GameState.has_meta("izrdralar_map_id"):
		return clampi(int(GameState.get_meta("izrdralar_map_id", 1)), 1, 32)
	var saved_id := _load_saved_map_id()
	if saved_id > 0:
		return clampi(saved_id, 1, 32)
	return 1

func _load_saved_map_id() -> int:
	if not FileAccess.file_exists(PROGRESS_PATH):
		return 0
	var file := FileAccess.open(PROGRESS_PATH, FileAccess.READ)
	if file == null:
		return 0
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		return int(parsed.get("map_id", 0))
	return 0

func _save_progress(target_id: int, entry_mode: String) -> void:
	var file := FileAccess.open(PROGRESS_PATH, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({
		"map_id": target_id,
		"entry": entry_mode,
		"continent": "Izrdralar",
		"schema": 2
	}))

func _load_manifest() -> Dictionary:
	if not FileAccess.file_exists(MANIFEST_PATH):
		return {}
	var file := FileAccess.open(MANIFEST_PATH, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if parsed is Dictionary else {}

func _map_by_id(map_id: int) -> Dictionary:
	for item in manifest.get("maps", []):
		if item is Dictionary and int(item.get("id", 0)) == map_id:
			return item
	return {}

func _build_current_map() -> void:
	var size_data: Array = current_map.get("s", [2, 2])
	var width_chunks := maxi(1, int(size_data[0]))
	var height_chunks := maxi(1, int(size_data[1]))
	world_size = Vector2(width_chunks * CHUNK_PIXELS, height_chunks * CHUNK_PIXELS)
	_build_chunks(width_chunks, height_chunks)
	_build_route_sculpture()
	_build_world_boundaries()
	_build_zone_markers()
	_build_path_markers()
	_spawn_player()
	_build_hud()
	_build_fade()

func _build_chunks(width_chunks: int, height_chunks: int) -> void:
	var seed_base := 21500000 + current_map_id * 7919
	for y in range(height_chunks):
		for x in range(width_chunks):
			var coord := Vector2i(x, y)
			var chunk := Node2D.new()
			chunk.name = "Map%02d_Chunk_%d_%d" % [current_map_id, x, y]
			chunk.set_script(GenericChunkScript)
			add_child(chunk)
			move_child(chunk, 0)
			chunk.configure(coord, _chunk_data(coord, width_chunks, height_chunks), seed_base)

func _chunk_data(coord: Vector2i, width_chunks: int, height_chunks: int) -> Dictionary:
	var exits := {
		"n": coord.y > 0,
		"e": coord.x < width_chunks - 1,
		"s": coord.y < height_chunks - 1,
		"w": coord.x > 0
	}
	_enable_outer_route(exits, coord, width_chunks, height_chunks, str(current_map.get("e", "west")))
	_enable_outer_route(exits, coord, width_chunks, height_chunks, str(current_map.get("x", "east")))
	return {"biome": _biome_for_chunk(coord), "exits": exits}

func _enable_outer_route(exits: Dictionary, coord: Vector2i, width_chunks: int, height_chunks: int, edge: String) -> void:
	match edge:
		"west":
			if coord.x == 0 and coord.y == (height_chunks >> 1):
				exits["w"] = true
		"east":
			if coord.x == width_chunks - 1 and coord.y == (height_chunks >> 1):
				exits["e"] = true
		"north":
			if coord.y == 0 and coord.x == (width_chunks >> 1):
				exits["n"] = true
		"south":
			if coord.y == height_chunks - 1 and coord.x == (width_chunks >> 1):
				exits["s"] = true

func _biome_for_chunk(coord: Vector2i) -> String:
	var biomes: Array = current_map.get("bi", ["forest"])
	if biomes.is_empty():
		return "forest"
	var index := posmod(coord.x + coord.y * 2 + current_map_id, biomes.size())
	return str(biomes[index])

func _is_vertical_route() -> bool:
	var entry := str(current_map.get("e", "west"))
	var exit := str(current_map.get("x", "east"))
	return entry in ["north", "south"] and exit in ["north", "south"]

func _build_route_sculpture() -> void:
	var profile := str(current_map.get("lp", "route"))
	var map_type := str(current_map.get("t", "normal"))
	if map_type == "boss":
		_build_boss_cover(profile)
		return
	if profile in ["clear_start", "refuge_outdoor", "refuge_evolved", "revelation_rest", "threshold_compact"]:
		_build_corner_mass()
		return
	if profile == "lake_hub_h":
		_build_hub_mass()
		return
	if profile in ["sanctuary_dungeon_h", "secret_dungeon_h"]:
		_build_dungeon_bands()
		return
	if _is_vertical_route():
		_build_vertical_switchbacks()
	else:
		_build_horizontal_switchbacks()

func _route_color() -> Color:
	var biomes: Array = current_map.get("bi", ["forest"])
	var first := str(biomes[0]) if not biomes.is_empty() else "forest"
	match first:
		"river", "lake":
			return Color(0.08, 0.20, 0.24, 0.72)
		"ruins", "sanctuary":
			return Color(0.17, 0.16, 0.19, 0.76)
		"boss":
			return Color(0.20, 0.10, 0.12, 0.70)
		"refuge":
			return Color(0.10, 0.20, 0.15, 0.68)
		_:
			return Color(0.06, 0.17, 0.10, 0.75)

func _build_horizontal_switchbacks() -> void:
	var count := 1 if world_size.x <= 1200.0 else 2
	var nav := float(current_map.get("nav", 0.50))
	var gap_size := lerpf(180.0, 300.0, nav)
	for i in range(count):
		var fraction := float(i + 1) / float(count + 1)
		var x := world_size.x * fraction
		var gap_y := world_size.y * (0.34 if (i + current_map_id) % 2 == 0 else 0.68)
		_add_vertical_band(x, gap_y, gap_size, 72.0)

func _build_vertical_switchbacks() -> void:
	var count := 1 if world_size.y <= 1200.0 else 2
	var nav := float(current_map.get("nav", 0.50))
	var gap_size := lerpf(180.0, 300.0, nav)
	for i in range(count):
		var fraction := float(i + 1) / float(count + 1)
		var y := world_size.y * fraction
		var gap_x := world_size.x * (0.34 if (i + current_map_id) % 2 == 0 else 0.68)
		_add_horizontal_band(y, gap_x, gap_size, 72.0)

func _build_dungeon_bands() -> void:
	if _is_vertical_route():
		for fraction in [0.28, 0.52, 0.76]:
			var gap_x := world_size.x * (0.35 if int(fraction * 100.0) % 2 == 0 else 0.65)
			_add_horizontal_band(world_size.y * fraction, gap_x, 185.0, 82.0)
	else:
		for index in range(3):
			var fraction := [0.28, 0.52, 0.76][index]
			var gap_y := world_size.y * (0.34 if index % 2 == 0 else 0.68)
			_add_vertical_band(world_size.x * fraction, gap_y, 185.0, 82.0)

func _build_corner_mass() -> void:
	var w := world_size.x
	var h := world_size.y
	var size := Vector2(minf(210.0, w * 0.22), minf(180.0, h * 0.22))
	_add_route_blocker(Rect2(Vector2(60, 60), size))
	_add_route_blocker(Rect2(Vector2(w - size.x - 60, 60), size))
	_add_route_blocker(Rect2(Vector2(60, h - size.y - 60), size))
	_add_route_blocker(Rect2(Vector2(w - size.x - 60, h - size.y - 60), size))

func _build_hub_mass() -> void:
	var w := world_size.x
	var h := world_size.y
	_add_route_blocker(Rect2(Vector2(w * 0.42, h * 0.16), Vector2(w * 0.16, h * 0.25)))
	_add_route_blocker(Rect2(Vector2(w * 0.42, h * 0.60), Vector2(w * 0.16, h * 0.24)))
	_add_route_blocker(Rect2(Vector2(w * 0.18, h * 0.38), Vector2(w * 0.15, h * 0.24)))
	_add_route_blocker(Rect2(Vector2(w * 0.68, h * 0.38), Vector2(w * 0.15, h * 0.24)))

func _build_boss_cover(profile: String) -> void:
	var w := world_size.x
	var h := world_size.y
	if profile == "boss_final_large":
		for uv in [Vector2(0.27,0.30), Vector2(0.73,0.30), Vector2(0.27,0.70), Vector2(0.73,0.70)]:
			_add_route_blocker(Rect2(Vector2(w * uv.x - 45.0, h * uv.y - 45.0), Vector2(90, 90)))
	elif profile == "boss_frontier_wide":
		_add_route_blocker(Rect2(Vector2(w * 0.46, h * 0.20), Vector2(80, h * 0.18)))
		_add_route_blocker(Rect2(Vector2(w * 0.46, h * 0.62), Vector2(80, h * 0.18)))
	else:
		_add_route_blocker(Rect2(Vector2(w * 0.18, h * 0.22), Vector2(72, 72)))
		_add_route_blocker(Rect2(Vector2(w * 0.74, h * 0.66), Vector2(72, 72)))

func _add_vertical_band(x: float, gap_center_y: float, gap_size: float, thickness: float) -> void:
	var top_h := maxf(0.0, gap_center_y - gap_size * 0.5)
	var bottom_y := minf(world_size.y, gap_center_y + gap_size * 0.5)
	if top_h > 24.0:
		_add_route_blocker(Rect2(Vector2(x - thickness * 0.5, 0), Vector2(thickness, top_h)))
	if world_size.y - bottom_y > 24.0:
		_add_route_blocker(Rect2(Vector2(x - thickness * 0.5, bottom_y), Vector2(thickness, world_size.y - bottom_y)))

func _add_horizontal_band(y: float, gap_center_x: float, gap_size: float, thickness: float) -> void:
	var left_w := maxf(0.0, gap_center_x - gap_size * 0.5)
	var right_x := minf(world_size.x, gap_center_x + gap_size * 0.5)
	if left_w > 24.0:
		_add_route_blocker(Rect2(Vector2(0, y - thickness * 0.5), Vector2(left_w, thickness)))
	if world_size.x - right_x > 24.0:
		_add_route_blocker(Rect2(Vector2(right_x, y - thickness * 0.5), Vector2(world_size.x - right_x, thickness)))

func _add_route_blocker(rect: Rect2) -> void:
	if rect.size.x <= 4.0 or rect.size.y <= 4.0:
		return
	var body := StaticBody2D.new()
	body.name = "RouteMass"
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	var visual := Polygon2D.new()
	visual.polygon = PackedVector2Array([
		Vector2(-rect.size.x * 0.5, -rect.size.y * 0.5),
		Vector2(rect.size.x * 0.5, -rect.size.y * 0.5),
		Vector2(rect.size.x * 0.5, rect.size.y * 0.5),
		Vector2(-rect.size.x * 0.5, rect.size.y * 0.5)
	])
	visual.color = _route_color()
	visual.z_index = -2
	body.add_child(visual)
	add_child(body)

func _build_world_boundaries() -> void:
	_add_wall(Rect2(-32, -32, world_size.x + 64, 32))
	_add_wall(Rect2(-32, world_size.y, world_size.x + 64, 32))
	_add_wall(Rect2(-32, 0, 32, world_size.y))
	_add_wall(Rect2(world_size.x, 0, 32, world_size.y))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.name = "WorldBoundary"
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _build_path_markers() -> void:
	entry_path_position = _edge_position(str(current_map.get("e", "west")))
	exit_path_position = _edge_position(str(current_map.get("x", "east")))
	if current_map_id > 1:
		_add_path_sign(entry_path_position, "CAMINO A M%02d" % (current_map_id - 1), Color("6ed4e8"))
	if current_map_id < 32:
		_add_path_sign(exit_path_position, "CAMINO A M%02d" % (current_map_id + 1), Color("a855f7"))
	else:
		_add_path_sign(exit_path_position, "UMBRAL · FIN DE IZRDRALAR", Color("ffbf4d"))

func _edge_position(edge: String) -> Vector2:
	match edge:
		"west": return Vector2(EDGE_MARGIN, world_size.y * 0.5)
		"east": return Vector2(world_size.x - EDGE_MARGIN, world_size.y * 0.5)
		"north": return Vector2(world_size.x * 0.5, EDGE_MARGIN)
		"south": return Vector2(world_size.x * 0.5, world_size.y - EDGE_MARGIN)
	return Vector2(EDGE_MARGIN, world_size.y * 0.5)

func _outward_vector(edge: String) -> Vector2:
	match edge:
		"west": return Vector2.LEFT
		"east": return Vector2.RIGHT
		"north": return Vector2.UP
		"south": return Vector2.DOWN
	return Vector2.ZERO

func _inward_spawn(edge: String, path_pos: Vector2) -> Vector2:
	return path_pos - _outward_vector(edge) * SPAWN_INSET

func _add_path_sign(pos: Vector2, text_value: String, color_value: Color) -> void:
	var marker := Node2D.new()
	marker.position = pos
	marker.z_index = 30
	var label := Label.new()
	label.position = Vector2(-70, -24)
	label.size = Vector2(140, 18)
	label.text = text_value
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", 7)
	label.add_theme_color_override("font_color", color_value)
	marker.add_child(label)
	add_child(marker)

func _build_zone_markers() -> void:
	var zones: Array = current_map.get("z", [])
	var vertical := _is_vertical_route()
	var anchors := [
		Vector2(0.34, 0.27) if vertical else Vector2(0.27, 0.34),
		Vector2(0.68, 0.52),
		Vector2(0.34, 0.74) if vertical else Vector2(0.74, 0.34),
		Vector2(0.60, 0.72)
	]
	if str(current_map.get("t", "")) == "boss":
		anchors = [Vector2(0.50, 0.50), Vector2(0.30, 0.68), Vector2(0.70, 0.32)]
	for index in range(zones.size()):
		var kind := str(zones[index])
		var uv: Vector2 = anchors[index % anchors.size()]
		var pos := Vector2(uv.x * world_size.x, uv.y * world_size.y)
		_add_zone_marker(index, pos, kind.replace("_", " ").capitalize(), kind)

func _add_zone_marker(index: int, pos: Vector2, label_text: String, kind: String) -> void:
	var marker := Node2D.new()
	marker.name = "Zone_%02d_%s" % [index + 1, kind]
	marker.position = pos
	marker.set_meta("zone_label", label_text)
	marker.set_meta("zone_kind", kind)
	marker.z_index = 20
	var plate := Polygon2D.new()
	plate.polygon = PackedVector2Array([Vector2(-46,-27), Vector2(46,-27), Vector2(46,27), Vector2(-46,27)])
	var c := _zone_color(kind)
	plate.color = Color(c.r, c.g, c.b, 0.17)
	marker.add_child(plate)
	var label := Label.new()
	label.position = Vector2(-62, -7)
	label.size = Vector2(124, 18)
	label.text = label_text.to_upper()
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", 7)
	label.add_theme_color_override("font_color", c)
	marker.add_child(label)
	add_child(marker)

func _zone_color(kind: String) -> Color:
	if kind.contains("boss"): return Color("ff6b5f")
	if kind.contains("refugio") or kind.contains("guardado") or kind.contains("descanso"): return Color("54e1ff")
	if kind.contains("secreto"): return Color("c686ff")
	if kind.contains("alexis") or kind.contains("revelacion") or kind.contains("guia"): return Color("ffbf4d")
	if kind.contains("historia") or kind.contains("vinculo"): return Color("8fcf78")
	if kind.contains("puzle") or kind.contains("runa") or kind.contains("santuario"): return Color("c7b0ff")
	return Color("6ed4e8")

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 4
	player.set_script(PlayerScript)
	var entry_mode := str(GameState.get_meta("izrdralar_entry", "forward"))
	if entry_mode == "backward" and current_map_id < 32:
		player.position = _inward_spawn(str(current_map.get("x", "east")), exit_path_position)
	else:
		player.position = _inward_spawn(str(current_map.get("e", "west")), entry_path_position)
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
	camera.limit_right = int(world_size.x)
	camera.limit_bottom = int(world_size.y)
	player.add_child(camera)
	add_child(player)

func _build_hud() -> void:
	var canvas := CanvasLayer.new()
	canvas.layer = 100
	add_child(canvas)
	var panel := Panel.new()
	panel.position = Vector2(8, 8)
	panel.size = Vector2(326, 88)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.02, 0.03, 0.05, 0.91)
	style.border_color = Color("8b5cf6")
	style.set_border_width_all(1)
	style.set_corner_radius_all(5)
	panel.add_theme_stylebox_override("panel", style)
	canvas.add_child(panel)
	var map_label := Label.new()
	map_label.position = Vector2(10, 7)
	map_label.size = Vector2(306, 34)
	map_label.text = _map_title_text()
	map_label.add_theme_font_size_override("font_size", 10)
	map_label.add_theme_color_override("font_color", Color("f0f0f5"))
	panel.add_child(map_label)
	var info := Label.new()
	info.position = Vector2(10, 43)
	info.size = Vector2(306, 18)
	info.text = "WASD mover · SHIFT dash · J ataque · caminos cambian de mapa"
	info.add_theme_font_size_override("font_size", 7)
	info.add_theme_color_override("font_color", Color("b8b8c4"))
	panel.add_child(info)
	var debug := Label.new()
	debug.position = Vector2(10, 62)
	debug.size = Vector2(306, 18)
	debug.text = "TEST: PgUp/PgDn · Home M01 · End M32"
	debug.add_theme_font_size_override("font_size", 7)
	debug.add_theme_color_override("font_color", Color("787887"))
	panel.add_child(debug)
	_zone_label = Label.new()
	_zone_label.position = Vector2(8, 102)
	_zone_label.size = Vector2(340, 22)
	_zone_label.add_theme_font_size_override("font_size", 8)
	_zone_label.add_theme_color_override("font_color", Color("6ed4e8"))
	canvas.add_child(_zone_label)
	_edge_label = Label.new()
	_edge_label.position = Vector2(8, 126)
	_edge_label.size = Vector2(420, 22)
	_edge_label.add_theme_font_size_override("font_size", 8)
	_edge_label.add_theme_color_override("font_color", Color("f0f0f5"))
	canvas.add_child(_edge_label)

func _build_fade() -> void:
	var canvas := CanvasLayer.new()
	canvas.layer = 500
	add_child(canvas)
	_fade = ColorRect.new()
	_fade.position = Vector2.ZERO
	_fade.size = Vector2(640, 360)
	_fade.color = Color(0, 0, 0, 0)
	_fade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	canvas.add_child(_fade)

func _size_class(size_data: Array) -> String:
	var w := int(size_data[0])
	var h := int(size_data[1])
	if w == 3 and h == 3: return "FINAL LARGE"
	if w * h >= 8: return "DOBLE"
	if w * h >= 6: return "MEDIO"
	return "COMPACTO"

func _map_title_text() -> String:
	var size_data: Array = current_map.get("s", [2, 2])
	var px_w := int(size_data[0]) * CHUNK_PIXELS
	var px_h := int(size_data[1]) * CHUNK_PIXELS
	return "IZR-M%02d · %s · BLOQUE %s\n%s · %dx%d · DIFICULTAD %d" % [
		current_map_id,
		str(current_map.get("n", "")),
		str(current_map.get("b", "")),
		_size_class(size_data),
		px_w,
		px_h,
		int(current_map.get("d", 1))
	]

func _update_zone_hint() -> void:
	var nearest_zone := ""
	var nearest_distance := INF
	for child in get_children():
		if child is Node2D and child.has_meta("zone_label"):
			var distance := player.global_position.distance_to((child as Node2D).global_position)
			if distance < nearest_distance:
				nearest_distance = distance
				nearest_zone = str(child.get_meta("zone_label", ""))
	_zone_label.text = "ZONA PLACEHOLDER: %s" % nearest_zone if nearest_distance < 190.0 else ""

func _update_edge_hint_and_transition() -> void:
	_edge_label.text = ""
	var entry_edge := str(current_map.get("e", "west"))
	var exit_edge := str(current_map.get("x", "east"))
	if current_map_id > 1:
		var prev_distance := player.global_position.distance_to(entry_path_position)
		if prev_distance < 130.0:
			_edge_label.text = "CAMINO → M%02d · cruzá el borde para volver" % (current_map_id - 1)
		if _transition_grace <= 0.0 and prev_distance <= EDGE_TRIGGER_RADIUS and player.velocity.dot(_outward_vector(entry_edge)) > 4.0:
			_begin_transition(current_map_id - 1, "backward", false)
			return
	var next_distance := player.global_position.distance_to(exit_path_position)
	if current_map_id < 32:
		if next_distance < 130.0:
			_edge_label.text = "CAMINO → M%02d · cruzá el borde para avanzar" % (current_map_id + 1)
		if _transition_grace <= 0.0 and next_distance <= EDGE_TRIGGER_RADIUS and player.velocity.dot(_outward_vector(exit_edge)) > 4.0:
			_begin_transition(current_map_id + 1, "forward", false)
	else:
		if next_distance < 150.0:
			_edge_label.text = "UMBRAL LEGENDARIO · IZRDRALAR COMPLETO · NO CRUZAR"

func _begin_transition(target_id: int, entry_mode: String, debug_jump: bool) -> void:
	if _transition_locked:
		return
	_transition_locked = true
	target_id = clampi(target_id, 1, 32)
	if debug_jump:
		EventBus.toast_requested.emit("TEST · salto a IZR-M%02d" % target_id)
	else:
		EventBus.toast_requested.emit("Camino · IZR-M%02d" % target_id)
	GameState.set_meta("izrdralar_map_id", target_id)
	GameState.set_meta("izrdralar_entry", entry_mode)
	_save_progress(target_id, entry_mode)
	if is_instance_valid(_fade):
		var tween := create_tween()
		tween.tween_property(_fade, "color", Color(0, 0, 0, 1), TRANSITION_FADE)
		await tween.finished
	get_tree().reload_current_scene()

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
				var key_event := InputEventKey.new()
				key_event.physical_keycode = keycode
				InputMap.action_add_event(action, key_event)
