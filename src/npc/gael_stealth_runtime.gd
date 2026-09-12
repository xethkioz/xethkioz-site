extends CharacterBody2D

const VisualScript := preload("res://src/npc/gael_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const MOVE_SPEED := 116.0
const ACCELERATION := 520.0
const DECELERATION := 610.0
const FOLLOW_DISTANCE := 84.0
const GALE_RANGE := 150.0
const GALE_HALF_ANGLE := deg_to_rad(38.0)
const GALE_DAMAGE := 8.0
const CRITICAL_MULTIPLIER := 1.75
const VEIL_DURATION := 1.35
const DASH_RANGE := 180.0
const DASH_BEHIND_DISTANCE := 24.0

const ACTION_DURATIONS := {
	"gale_blade": 0.34,
	"shadow_veil": 0.38,
	"kahezer_dash": 0.24
}

var max_health: float = 90.0
var health: float = 90.0
var _support_target: Node2D
var _support_enabled: bool = false
var _facing: Vector2 = Vector2.DOWN
var _action_state: String = ""
var _action_left: float = 0.0
var _action_total: float = 0.01
var _hurt_left: float = 0.0
var _downed: bool = false
var _recover_left: float = 0.0
var _veil_remaining: float = 0.0
var _precision_ready: bool = false
var _last_attack_critical: bool = false
var _last_dodge: bool = false
var _dodge_count: int = 0
var _visual: Node2D

func _ready() -> void:
	add_to_group("gael_support")
	_visual = Node2D.new()
	_visual.name = "GaelRuntimeVisual"
	_visual.set_script(VisualScript)
	add_child(_visual)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
	_veil_remaining = maxf(0.0, _veil_remaining - delta)
	if _downed:
		_recover_left = maxf(0.0, _recover_left - delta)
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		move_and_slide()
		if _recover_left <= 0.0:
			_downed = false
			health = maxf(max_health * 0.50, 1.0)
	else:
		_update_support_movement(delta)
	if _action_left <= 0.0:
		_action_state = ""
	_update_visual(delta)

func character_age() -> int:
	return 7

func support_role() -> String:
	return "Mentor de Precisión, Movilidad y Acecho"

func element_affinity() -> String:
	return "Viento / Acecho Místico"

func bond_name() -> String:
	return "Kahezer"

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
	if velocity.length_squared() > 100.0:
		return "sprint_wind"
	return "idle_stealth"

func support_health() -> float:
	return health

func support_max_health() -> float:
	return max_health

func veil_remaining() -> float:
	return _veil_remaining

func is_veiled() -> bool:
	return _veil_remaining > 0.0

func precision_ready() -> bool:
	return _precision_ready

func last_attack_critical() -> bool:
	return _last_attack_critical

func last_dodge() -> bool:
	return _last_dodge

func dodge_count() -> int:
	return _dodge_count

func trigger_shadow_veil() -> bool:
	if not _begin_action("shadow_veil", "player_guard", Color("a3e4d7")):
		return false
	_veil_remaining = VEIL_DURATION
	_precision_ready = true
	return true

func trigger_kahezer_dash(target: Node2D) -> bool:
	if not is_instance_valid(target):
		return false
	var offset: Vector2 = target.global_position - global_position
	var distance: float = offset.length()
	if distance <= 0.001 or distance > DASH_RANGE:
		return false
	if not _begin_action("kahezer_dash", "player_charge", Color("2ecc71")):
		return false
	var toward: Vector2 = offset / distance
	var destination: Vector2 = target.global_position + toward * DASH_BEHIND_DISTANCE
	var motion: Vector2 = destination - global_position
	if test_move(global_transform, motion):
		_action_state = ""
		_action_left = 0.0
		return false
	global_position = destination
	_facing = -toward
	_precision_ready = true
	velocity = Vector2.ZERO
	_update_visual(0.0)
	return true

func trigger_gale_blade(targets: Array = []) -> bool:
	if not _begin_action("gale_blade", "player_shot", Color("a3e4d7")):
		return false
	_last_attack_critical = false
	var use_critical: bool = _precision_ready
	var hit_any: bool = false
	var facing_dir: Vector2 = _facing.normalized() if _facing.length_squared() > 0.001 else Vector2.RIGHT
	var min_dot: float = cos(GALE_HALF_ANGLE)
	for target_value in targets:
		if not (target_value is Node2D):
			continue
		var target: Node2D = target_value as Node2D
		if not is_instance_valid(target):
			continue
		var offset: Vector2 = target.global_position - global_position
		var distance: float = offset.length()
		if distance <= 0.001 or distance > GALE_RANGE:
			continue
		var direction: Vector2 = offset / distance
		if facing_dir.dot(direction) < min_dot:
			continue
		var damage: float = GALE_DAMAGE * CRITICAL_MULTIPLIER if use_critical else GALE_DAMAGE
		_apply_damage(target, damage)
		hit_any = true
	if hit_any and use_critical:
		_last_attack_critical = true
		_precision_ready = false
	return true

func receive_support_hit(amount: float, source_position: Vector2 = Vector2.ZERO) -> bool:
	_last_dodge = false
	if amount <= 0.0 or _downed:
		return false
	if _veil_remaining > 0.0:
		_last_dodge = true
		_dodge_count += 1
		var parent: Node = get_tree().current_scene
		if parent != null:
			IzrdralarFxFactory.spawn(parent, "player_guard", global_position + Vector2(0, -14), _facing, Color("a3e4d7"), "DODGE")
		return false
	health = maxf(0.0, health - amount)
	_hurt_left = 0.18
	_action_state = ""
	_action_left = 0.0
	if source_position != Vector2.ZERO:
		var away: Vector2 = global_position - source_position
		if away.length_squared() > 0.001:
			_facing = away.normalized()
	if health <= 0.0:
		_downed = true
		_recover_left = 3.0
		velocity = Vector2.ZERO
	_update_visual(0.0)
	return true

func heal_support(amount: float) -> void:
	if amount > 0.0:
		health = minf(max_health, health + amount)

func _begin_action(action_id: String, effect_id: String, accent: Color) -> bool:
	if _downed or _hurt_left > 0.0 or _action_left > 0.0:
		return false
	if not ACTION_DURATIONS.has(action_id):
		return false
	_action_state = action_id
	_action_total = float(ACTION_DURATIONS[action_id])
	_action_left = _action_total
	velocity = Vector2.ZERO
	var parent: Node = get_tree().current_scene
	if parent != null:
		IzrdralarFxFactory.spawn(parent, effect_id, global_position + Vector2(0, -15), _facing, accent, "")
	_update_visual(0.0)
	return true

func _apply_damage(target: Node2D, amount: float) -> void:
	if target.has_method("take_damage"):
		target.call("take_damage", amount)

func _update_support_movement(delta: float) -> void:
	if not _support_enabled or _action_left > 0.0 or _hurt_left > 0.0 or not is_instance_valid(_support_target):
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		move_and_slide()
		return
	var offset: Vector2 = _support_target.global_position - global_position
	if offset.length() <= FOLLOW_DISTANCE:
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
	else:
		_facing = offset.normalized()
		velocity = velocity.move_toward(_facing * MOVE_SPEED, ACCELERATION * delta)
	move_and_slide()

func _update_visual(delta: float) -> void:
	if is_instance_valid(_visual):
		_visual.call("update_from_actor", delta, support_state(), _facing, velocity, _action_left, _action_total, _hurt_left, _downed, _veil_remaining, _precision_ready, _last_dodge)
