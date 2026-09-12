extends CharacterBody2D

const VisualScript := preload("res://src/npc/elida_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const MOVE_SPEED := 62.0
const ACCELERATION := 240.0
const DECELERATION := 330.0
const FOLLOW_DISTANCE := 78.0
const SANCTUARY_RADIUS := 96.0
const SANCTUARY_REGEN_PER_SECOND := 4.0
const WATER_SURGE_HEAL := 26.0
const HYDRO_SHIELD_DURATION := 3.5
const HYDRO_SHIELD_MULTIPLIER := 0.65
const OKUNINUST_BLESSING_DURATION := 4.0

const ACTION_DURATIONS := {
	"water_surge": 0.72,
	"hydro_shield": 0.68,
	"okuninust_blessing": 0.82
}

var max_health := 150.0
var health := 150.0
var _support_target: Node2D
var _support_enabled := false
var _facing := Vector2.DOWN
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _recover_left := 0.0
var _shield_remaining := 0.0
var _blessing_remaining := 0.0
var _visual: Node2D

func _ready() -> void:
	add_to_group("elida_support")
	_visual = Node2D.new()
	_visual.name = "ElidaRuntimeVisual"
	_visual.set_script(VisualScript)
	add_child(_visual)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
	_shield_remaining = maxf(0.0, _shield_remaining - delta)
	_blessing_remaining = maxf(0.0, _blessing_remaining - delta)
	if _action_left <= 0.0:
		_action_state = ""
	if _downed:
		_recover_left = maxf(0.0, _recover_left - delta)
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		if _recover_left <= 0.0:
			_downed = false
			health = maxf(max_health * 0.42, 1.0)
	else:
		_update_support_movement(delta)
		_update_sanctuary(delta)
	_update_visual(delta)

func set_support_target(target: Node2D) -> void:
	_support_target = target

func set_support_enabled(enabled: bool, target: Node2D = null) -> void:
	_support_enabled = enabled
	if target != null:
		_support_target = target
	if not _support_enabled:
		velocity = Vector2.ZERO

func is_support_enabled() -> bool:
	return _support_enabled

func support_state() -> String:
	if _downed:
		return "downed"
	if _hurt_left > 0.0:
		return "hurt"
	if not _action_state.is_empty() and _action_left > 0.0:
		return _action_state
	if velocity.length_squared() > 9.0:
		return "walk_calm"
	return "idle_peaceful"

func support_health() -> float:
	return health

func support_max_health() -> float:
	return max_health

func sanctuary_radius() -> float:
	return SANCTUARY_RADIUS

func shield_remaining() -> float:
	return _shield_remaining

func shield_damage_multiplier() -> float:
	return HYDRO_SHIELD_MULTIPLIER if _shield_remaining > 0.0 else 1.0

func blessing_remaining() -> float:
	return _blessing_remaining

func support_role() -> String:
	return "Curadora / Soporte Principal"

func element_affinity() -> String:
	return "Agua / Escudo Fluido"

func bond_name() -> String:
	return "Okuninust"

func trigger_water_surge() -> bool:
	if not _begin_action("water_surge", "player_wave", Color("40e0d0")):
		return false
	_heal_self(WATER_SURGE_HEAL * 0.45)
	if _valid_target() and global_position.distance_to(_support_target.global_position) <= 128.0:
		_heal_target(_support_target, WATER_SURGE_HEAL)
	return true

func trigger_hydro_shield() -> bool:
	if not _begin_action("hydro_shield", "player_guard", Color("7ee7ff")):
		return false
	_shield_remaining = HYDRO_SHIELD_DURATION
	if _valid_target() and _support_target.has_method("apply_external_guard"):
		_support_target.call("apply_external_guard", HYDRO_SHIELD_DURATION, HYDRO_SHIELD_MULTIPLIER)
	return true

func trigger_okuninust_blessing() -> bool:
	if not _begin_action("okuninust_blessing", "player_regen", Color("f0f8ff")):
		return false
	_blessing_remaining = OKUNINUST_BLESSING_DURATION
	if _valid_target() and _support_target.has_method("apply_status_immunity"):
		_support_target.call("apply_status_immunity", OKUNINUST_BLESSING_DURATION)
	return true

func receive_support_hit(amount: float, source_position: Vector2 = Vector2.ZERO) -> void:
	if amount <= 0.0 or _downed:
		return
	health = maxf(0.0, health - amount)
	_hurt_left = 0.20
	_action_state = ""
	_action_left = 0.0
	if source_position != Vector2.ZERO:
		var away := global_position - source_position
		if away.length_squared() > 0.001:
			_facing = away.normalized()
	if health <= 0.0:
		_downed = true
		_recover_left = 4.2
		velocity = Vector2.ZERO
	_update_visual(0.0)

func heal_support(amount: float) -> void:
	_heal_self(amount)

func _begin_action(action_id: String, effect_id: String, accent: Color) -> bool:
	if _downed or _hurt_left > 0.0 or _action_left > 0.0:
		return false
	if not ACTION_DURATIONS.has(action_id):
		return false
	_action_state = action_id
	_action_total = float(ACTION_DURATIONS[action_id])
	_action_left = _action_total
	velocity = Vector2.ZERO
	var parent := get_tree().current_scene
	if parent != null:
		IzrdralarFxFactory.spawn(parent, effect_id, global_position + Vector2(0, -24), _facing, accent, "")
	_update_visual(0.0)
	return true

func _update_support_movement(delta: float) -> void:
	if not _support_enabled or _action_left > 0.0 or _hurt_left > 0.0 or not _valid_target():
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		move_and_slide()
		return
	var offset := _support_target.global_position - global_position
	if offset.length() <= FOLLOW_DISTANCE:
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
	else:
		_facing = offset.normalized()
		velocity = velocity.move_toward(_facing * MOVE_SPEED, ACCELERATION * delta)
	move_and_slide()

func _update_sanctuary(delta: float) -> void:
	if not _support_enabled or not _valid_target() or _downed:
		return
	if global_position.distance_to(_support_target.global_position) <= SANCTUARY_RADIUS:
		_heal_target(_support_target, SANCTUARY_REGEN_PER_SECOND * delta)

func _valid_target() -> bool:
	return is_instance_valid(_support_target)

func _heal_target(target: Node, amount: float) -> void:
	if target == null or amount <= 0.0:
		return
	if target.has_method("heal"):
		target.call("heal", amount)
	elif target.has_method("heal_support"):
		target.call("heal_support", amount)
	elif target.has_method("_heal"):
		target.call("_heal", amount)

func _heal_self(amount: float) -> void:
	if amount <= 0.0:
		return
	health = minf(max_health, health + amount)

func _update_visual(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	_visual.call("update_from_actor", delta, support_state(), _facing, velocity, _action_left, _action_total, _hurt_left, _downed, _shield_remaining, _blessing_remaining)
