class_name IzrdralarM01M05Runtime
extends Node2D

const LAYOUT_PATH := "res://data/regions/izrdralar_m01_m05_layouts.json"
const RUNTIME_SCENE := "res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn"
const CHUNK_PIXELS := 512

const ChunkScript := preload("res://src/world/izrdralar_generic_chunk.gd")
const PlayerScript := preload("res://src/player/player_controller_production.gd")
const XethkiozScript := preload("res://src/pets/xethkioz_companion_production.gd")
const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")
const NpcScript := preload("res://src/npc/npc_interactable_production.gd")
const BossScript := preload("res://src/npc/boss5_guardian_production.gd")
const HudScript := preload("res://src/ui/hud_controller.gd")
const EntryScript := preload("res://src/world/izrdralar_entry_point.gd")
const TransitionScript := preload("res://src/world/izrdralar_map_transition.gd")
const CheckpointScript := preload("res://src/world/izrdralar_checkpoint_tracker.gd")
const ObjectiveScript := preload("res://src/world/izrdralar_route_objective.gd")

var layout_root: Dictionary = {}
var map_data: Dictionary = {}
var map_id := "M01"
var player: CharacterBody2D
var _world_size := Vector2(1024, 1024)

func _ready() -> void:
	_ensure_inputs()
	if not _load_layouts():
		return
	map_id = GameState.current_map_id
	if not layout_root.get("maps", {}).has(map_id):
		map_id = "M01"
		GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	map_data = layout_root.get("maps", {}).get(map_id, {})
	_world_size = _vector_from_array(map_data.get("world_size", [1024, 1024]))
	_build_chunks()
	_build_entries()
	_spawn_player()
	_spawn_xethkioz()
	_build_transitions()
	_build_objectives()
	_spawn_npcs()
	_spawn_enemies()
	_spawn_boss_if_needed()
	_spawn_hud()
	_add_world_boundaries()
	_add_checkpoint_tracker()
	if not EventBus.enemy_defeated.is_connected(_on_enemy_defeated):
		EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.toast_requested.emit("%s · %s" % [map_id, str(map_data.get("name", "Izrdralar"))])

func _load_layouts() -> bool:
	if not FileAccess.file_exists(LAYOUT_PATH):
		push_error("Izrdralar layouts missing: %s" % LAYOUT_PATH)
		return false
	var file := FileAccess.open(LAYOUT_PATH, FileAccess.READ)
	if file == null:
		push_error("Izrdralar layouts could not be opened")
		return false
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not (parsed is Dictionary):
		push_error("Izrdralar layouts invalid JSON")
		return false
	layout_root = (parsed as Dictionary).duplicate(true)
	return str(layout_root.get("layout_id", "")) == "izrdralar_m01_m05_layouts"

func _build_chunks() -> void:
	var chunks: Dictionary = map_data.get("chunks", {})
	var world_seed := int(map_data.get("world_seed", 21500809))
	for key_value in chunks.keys():
		var key := str(key_value)
		var parts := key.split(",")
		if parts.size() != 2:
			continue
		var coord := Vector2i(int(parts[0]), int(parts[1]))
		var chunk := Node2D.new()
		chunk.name = "Chunk_%s" % key.replace(",", "_")
		chunk.set_script(ChunkScript)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)

func _build_entries() -> void:
	var entries: Dictionary = map_data.get("entries", {})
	for entry_value in entries.keys():
		var entry_id := str(entry_value)
		var marker := Marker2D.new()
		marker.name = "Entry_%s" % entry_id
		marker.set_script(EntryScript)
		marker.set("entry_id", entry_id)
		marker.position = _vector_from_array(entries[entry_value])
		add_child(marker)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(PlayerScript)
	player.position = _initial_entry_position()
	var collision := CollisionShape2D.new()
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

func _spawn_xethkioz() -> void:
	var pet := Node2D.new()
	pet.name = "Xethkioz"
	pet.set_script(XethkiozScript)
	pet.position = player.position + Vector2(-30, 22)
	add_child(pet)

func _build_transitions() -> void:
	for transition_value in map_data.get("transitions", []):
		if not (transition_value is Dictionary):
			continue
		var data: Dictionary = transition_value
		var area := Area2D.new()
		var target_id := str(data.get("to", ""))
		area.name = "Transition_%s_to_%s" % [map_id, target_id]
		area.collision_layer = 0
		area.collision_mask = 1
		area.monitoring = true
		area.set_script(TransitionScript)
		area.set("source_map_id", map_id)
		area.set("target_map_id", target_id)
		area.set("target_scene", RUNTIME_SCENE)
		area.position = _vector_from_array(data.get("position", [0, 0]))
		var collision := CollisionShape2D.new()
		var shape := RectangleShape2D.new()
		shape.size = _vector_from_array(data.get("size", [48, 120]))
		collision.shape = shape
		area.add_child(collision)
		add_child(area)

func _build_objectives() -> void:
	for objective_value in map_data.get("objectives", []):
		if not (objective_value is Dictionary):
			continue
		var data: Dictionary = objective_value
		var objective := Node2D.new()
		objective.name = "Objective_%s" % str(data.get("id", "resonance"))
		objective.set_script(ObjectiveScript)
		objective.position = _vector_from_array(data.get("position", [0, 0]))
		objective.call("configure", data)
		add_child(objective)

func _spawn_npcs() -> void:
	for npc_value in map_data.get("npcs", []):
		if not (npc_value is Dictionary):
			continue
		var data: Dictionary = npc_value
		var npc := Node2D.new()
		npc.name = str(data.get("name", "NPC"))
		npc.set_script(NpcScript)
		npc.position = _vector_from_array(data.get("position", [0, 0]))
		var lines: Array[String] = []
		for line in data.get("lines", []):
			lines.append(str(line))
		npc.call("configure_production", str(data.get("id", "npc")), str(data.get("name", "NPC")), lines, int(data.get("atlas", 0)))
		add_child(npc)

func _spawn_enemies() -> void:
	for enemy_value in map_data.get("enemies", []):
		if not (enemy_value is Dictionary):
			continue
		_spawn_enemy(enemy_value as Dictionary)

func _spawn_enemy(data: Dictionary) -> void:
	var enemy := CharacterBody2D.new()
	enemy.name = str(data.get("id", "enemy"))
	enemy.collision_layer = 2
	enemy.collision_mask = 1 | 4
	enemy.set_script(EnemyScript)
	enemy.position = _vector_from_array(data.get("position", [0, 0]))
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 9.0
	collision.shape = shape
	collision.position = Vector2(0, 3)
	enemy.add_child(collision)
	enemy.call("configure_production", str(data.get("id", "enemy")), float(data.get("hp", 42.0)), float(data.get("speed", 52.0)), float(data.get("damage", 8.0)), int(data.get("xp", 24)), int(data.get("atlas", 0)))
	add_child(enemy)

func _spawn_boss_if_needed() -> void:
	var boss_data: Dictionary = map_data.get("boss", {})
	if boss_data.is_empty():
		return
	if GameState.has_world_flag("boss5_defeated") or GameState.has_world_flag("boss5_stabilized"):
		return
	var boss := CharacterBody2D.new()
	boss.name = "Boss5Guardian"
	boss.collision_layer = 2
	boss.collision_mask = 1 | 4
	boss.set_script(BossScript)
	boss.position = _vector_from_array(boss_data.get("position", [256, 220]))
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 24.0
	collision.shape = shape
	collision.position = Vector2(0, 5)
	boss.add_child(collision)
	add_child(boss)

func _spawn_hud() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudScript)
	add_child(hud)

func _add_checkpoint_tracker() -> void:
	var tracker := Node.new()
	tracker.name = "CheckpointTracker"
	tracker.set_script(CheckpointScript)
	tracker.set("map_id", map_id)
	add_child(tracker)

func _on_enemy_defeated(enemy_id: String, _xp: int, _position: Vector2) -> void:
	if enemy_id != "boss5_guardian_bosque_velado":
		return
	GameState.set_world_flag("boss5_defeated")
	SaveService.save_game({"boss5_state": "defeated_waiting_stabilization"})
	EventBus.toast_requested.emit("El Guardián cayó. Acercate al Corazón y elegí ESTABILIZAR.")

func _initial_entry_position() -> Vector2:
	if GameState.current_map_id == map_id and GameState.last_world_position != Vector2.ZERO:
		return GameState.last_world_position
	var entries: Dictionary = map_data.get("entries", {})
	if entries.has(GameState.current_entry_id):
		return _vector_from_array(entries[GameState.current_entry_id])
	if not entries.is_empty():
		return _vector_from_array(entries[entries.keys()[0]])
	return _world_size * 0.5

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

func _vector_from_array(value: Variant) -> Vector2:
	if value is Array and value.size() >= 2:
		return Vector2(float(value[0]), float(value[1]))
	return Vector2.ZERO

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
