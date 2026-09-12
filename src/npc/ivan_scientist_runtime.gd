extends "res://src/npc/npc_interactable_production_pass02.gd"

const IvanRuntimeVisualScript := preload("res://src/npc/ivan_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const ACTION_DURATIONS := {
	"lightning_strike": 0.58,
	"quantum_teleport": 0.40,
	"emp_field": 0.78,
	"overclock_buff": 0.82,
	"analyze_device": 0.72
}
const MAX_QUANTUM_REPOSITION := 48.0

var _ivan_visual: Node2D
var _field_support_enabled := false
var _support_target: Node2D
var _support_velocity := Vector2.ZERO
var _support_facing := Vector2.DOWN
var _support_move_speed := 96.0
var _support_acceleration := 360.0
var _support_deceleration := 460.0
var _follow_distance := 104.0
var _catchup_distance := 220.0
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _support_health := 135.0
var _support_max_health := 135.0
var _downed := false
var _recover_left := 0.0

func configure_production(id_value: String, name_value: String, lines: Array[String], index: int, rules: Array = []) -> void:
	super.configure_production(id_value, name_value, lines, index, rules)
	if is_inside_tree():
		_apply_ivan_presentation()

func _ready() -> void:
	super._ready()
	add_to_group("ivan_scientist")
	_ivan_visual = Node2D.new()
	_ivan_visual.name = "IvanRuntimeVisual"
	_ivan_visual.set_script(IvanRuntimeVisualScript)
	_ivan_visual.z_index = 4
	add_child(_ivan_visual)
	_apply_ivan_presentation()
	_update_ivan_visual(0.0)

func _physics_process(delta: float) -> void:
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
	if _action_left <= 0.0:
		_action_state = ""
	if _downed:
		_recover_left = maxf(0.0, _recover_left - delta)
		_support_velocity = _support_velocity.move_toward(Vector2.ZERO, _support_deceleration * delta)
		if _recover_left <= 0.0:
			_downed = false
			_support_health = maxf(_support_max_health * 0.36, 1.0)
	else:
		_update_field_support(delta)
	_update_ivan_visual(delta)

func _apply_ivan_presentation() -> void:
	if is_instance_valid(_visual):
		_visual.visible = false
	if is_instance_valid(_nameplate):
		_nameplate.position = Vector2(-46, -62)
		_nameplate.size = Vector2(92, 14)
		_nameplate.add_theme_color_override("font_color", Color("a8f3ff"))

func set_field_support_enabled(enabled: bool, target: Node2D = null) -> void:
	_field_support_enabled = enabled
	_support_target = target
	if _field_support_enabled and not is_instance_valid(_support_target):
		_support_target = get_tree().get_first_node_in_group("player") as Node2D
	if not _field_support_enabled:
		_support_velocity = Vector2.ZERO
	_update_ivan_visual(0.0)

func is_field_support_enabled() -> bool:
	return _field_support_enabled

func support_state() -> String:
	if _downed:
		return "downed"
	if _hurt_left > 0.0:
		return "hurt"
	if not _action_state.is_empty():
		return _action_state
	if _support_velocity.length_squared() > 16.0:
		return "walk_fast"
	return "idle_calculating"

func support_health() -> float:
	return _support_health

func support_max_health() -> float:
	return _support_max_health

func trigger_lightning_strike(target: Node2D = null) -> bool:
	if not _begin_support_action("lightning_strike", "player_line", Color("00d2ff")):
		return false
	var selected := target if is_instance_valid(target) else _nearest_enemy(176.0)
	if is_instance_valid(selected):
		var direction := selected.global_position - global_position
		if direction.length_squared() > 0.001:
			_support_facing = direction.normalized()
		if selected.has_method("take_damage"):
			selected.call("take_damage", 18.0)
	return true

func trigger_quantum_reposition(direction_value: Vector2 = Vector2.ZERO, distance_value: float = 36.0) -> bool:
	var direction := direction_value
	if direction.length_squared() <= 0.001:
		direction = _support_facing
	if direction.length_squared() <= 0.001:
		direction = Vector2.RIGHT
	direction = direction.normalized()
	if not _begin_support_action("quantum_teleport", "player_burst", Color("00d2ff")):
		return false
	_support_facing = direction
	var distance := clampf(distance_value, 8.0, MAX_QUANTUM_REPOSITION)
	var desired := global_position + direction * distance
	var query := PhysicsRayQueryParameters2D.create(global_position, desired, 1)
	query.collide_with_areas = false
	query.collide_with_bodies = true
	var hit: Dictionary = get_world_2d().direct_space_state.intersect_ray(query)
	if not hit.is_empty():
		var hit_position: Vector2 = hit.get("position", desired)
		desired = hit_position - direction * 10.0
	if desired.distance_to(global_position) >= 6.0:
		global_position = desired
	_support_velocity = Vector2.ZERO
	return true

func trigger_emp_field() -> bool:
	if not _begin_support_action("emp_field", "player_root", Color("00d2ff")):
		return false
	for enemy_value in get_tree().get_nodes_in_group("enemies"):
		var enemy := enemy_value as Node2D
		if enemy == null or global_position.distance_to(enemy.global_position) > 92.0:
			continue
		if enemy.has_method("apply_slow"):
			enemy.call("apply_slow", 0.72, 1.8)
		if enemy.has_method("apply_root"):
			enemy.call("apply_root", 0.55)
	return true

func trigger_overclock_buff() -> bool:
	return _begin_support_action("overclock_buff", "player_guard", Color("ffd700"))

func trigger_analyze_device() -> bool:
	if not _begin_support_action("analyze_device", "player_mark", Color("00d2ff")):
		return false
	EventBus.toast_requested.emit("Iván · lectura cuántica en curso")
	return true

func receive_support_hit(amount: float, source_position: Vector2 = Vector2.ZERO) -> void:
	if amount <= 0.0 or _downed:
		return
	_support_health = maxf(0.0, _support_health - amount)
	_hurt_left = 0.18
	_action_state = ""
	_action_left = 0.0
	if source_position != Vector2.ZERO:
		var away := global_position - source_position
		if away.length_squared() > 0.001:
			_support_facing = away.normalized()
	if _support_health <= 0.0:
		_downed = true
		_recover_left = 3.0
		_support_velocity = Vector2.ZERO
	_update_ivan_visual(0.0)

func heal_support(amount: float) -> void:
	if amount <= 0.0:
		return
	_support_health = minf(_support_max_health, _support_health + amount)

func analysis_profile() -> Dictionary:
	return {
		"npc_id": "ivan",
		"role": "scientist_quantum_support",
		"affinity": "rayo_energia_cuantica",
		"resonant": "itzuke",
		"player_fast_travel_granted": false,
		"direct_player_input": false
	}

func _begin_support_action(action_id: String, effect_id: String, accent: Color) -> bool:
	if _downed or _hurt_left > 0.0 or _action_left > 0.0:
		return false
	if not ACTION_DURATIONS.has(action_id):
		return false
	_action_state = action_id
	_action_total = float(ACTION_DURATIONS[action_id])
	_action_left = _action_total
	_support_velocity = Vector2.ZERO
	_update_ivan_visual(0.0)
	var scene := get_tree().current_scene
	if scene != null:
		IzrdralarFxFactory.spawn(scene, effect_id, global_position + Vector2(0, -25), _support_facing, accent, "")
	return true

func _nearest_enemy(max_distance: float) -> Node2D:
	var best: Node2D
	var best_distance := max_distance
	for enemy_value in get_tree().get_nodes_in_group("enemies"):
		var enemy := enemy_value as Node2D
		if enemy == null:
			continue
		var distance := global_position.distance_to(enemy.global_position)
		if distance < best_distance:
			best = enemy
			best_distance = distance
	return best

func _update_field_support(delta: float) -> void:
	if not _field_support_enabled or _action_left > 0.0 or _hurt_left > 0.0:
		_support_velocity = _support_velocity.move_toward(Vector2.ZERO, _support_deceleration * delta)
		return
	if not is_instance_valid(_support_target):
		_support_target = get_tree().get_first_node_in_group("player") as Node2D
	if not is_instance_valid(_support_target):
		_support_velocity = _support_velocity.move_toward(Vector2.ZERO, _support_deceleration * delta)
		return

	var offset := _support_target.global_position - global_position
	var distance := offset.length()
	if distance <= _follow_distance:
		_support_velocity = _support_velocity.move_toward(Vector2.ZERO, _support_deceleration * delta)
		return
	var direction := offset.normalized()
	_support_facing = direction
	var speed_multiplier := 1.30 if distance >= _catchup_distance else 1.0
	var desired := direction * _support_move_speed * speed_multiplier
	_support_velocity = _support_velocity.move_toward(desired, _support_acceleration * delta)
	global_position += _support_velocity * delta

func _update_ivan_visual(delta: float) -> void:
	if not is_instance_valid(_ivan_visual):
		return
	_ivan_visual.call(
		"update_from_actor",
		delta,
		_support_facing,
		_support_velocity,
		_support_move_speed,
		_action_state,
		_action_left,
		_action_total,
		_hurt_left,
		_downed
	)
