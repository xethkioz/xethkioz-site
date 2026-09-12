extends CharacterBody2D

const VisualScript := preload("res://src/npc/isabella_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const MOVE_SPEED := 78.0
const ACCELERATION := 310.0
const DECELERATION := 430.0
const FOLLOW_DISTANCE := 76.0
const SPARK_RANGE := 190.0
const SPARK_DAMAGE := 9.0
const CHAOS_BURST_RADIUS := 90.0
const CHAOS_BURST_DAMAGE := 11.0
const HELLER_FURY_RADIUS := 82.0
const HELLER_FURY_DAMAGE := 14.0
const HELLER_BURN_DURATION := 2.8
const SECONDARY_BURN_DURATION := 1.8
const SECONDARY_STUN_DURATION := 0.42
const SECONDARY_CHAIN_DAMAGE := 5.0

const ACTION_DURATIONS := {
	"spark_shot": 0.34,
	"chaos_burst": 0.62,
	"heller_fury": 0.78
}
const CHAOS_EFFECTS := ["burn", "stun", "chain"]

var max_health := 96.0
var health := 96.0
var _support_target: Node2D
var _support_enabled := false
var _facing := Vector2.DOWN
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _recover_left := 0.0
var _chaos_cursor := 0
var _last_secondary_effect := "none"
var _visual: Node2D

func _ready() -> void:
	add_to_group("isabella_support")
	_visual = Node2D.new()
	_visual.name = "IsabellaRuntimeVisual"
	_visual.set_script(VisualScript)
	add_child(_visual)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
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
	return 8

func support_role() -> String:
	return "Mentora de Magia Caótica y Pirotecnia"

func element_affinity() -> String:
	return "Fuego / Caos Controlado"

func bond_name() -> String:
	return "Heller"

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
		return "walk_hop"
	return "idle_playful"

func support_health() -> float:
	return health

func support_max_health() -> float:
	return max_health

func chaos_cursor() -> int:
	return _chaos_cursor

func last_secondary_effect() -> String:
	return _last_secondary_effect

func trigger_spark_shot(target: Node2D) -> bool:
	if not is_instance_valid(target):
		return false
	var offset := target.global_position - global_position
	if offset.length() > SPARK_RANGE:
		return false
	if not _begin_action("spark_shot", "player_shot", Color("ff5722")):
		return false
	if offset.length_squared() > 0.001:
		_facing = offset.normalized()
	_apply_damage(target, SPARK_DAMAGE)
	_apply_chaos_secondary(target)
	return true

func trigger_chaos_burst(targets: Array = []) -> bool:
	if not _begin_action("chaos_burst", "player_burst", Color("8e44ad")):
		return false
	for target_value in targets:
		if not (target_value is Node2D):
			continue
		var target := target_value as Node2D
		if not is_instance_valid(target):
			continue
		if global_position.distance_to(target.global_position) > CHAOS_BURST_RADIUS:
			continue
		_apply_damage(target, CHAOS_BURST_DAMAGE)
		_apply_chaos_secondary(target)
	return true

func trigger_heller_fury(targets: Array = []) -> bool:
	if not _begin_action("heller_fury", "player_burst", Color("e74c3c")):
		return false
	for target_value in targets:
		if not (target_value is Node2D):
			continue
		var target := target_value as Node2D
		if not is_instance_valid(target):
			continue
		if global_position.distance_to(target.global_position) > HELLER_FURY_RADIUS:
			continue
		_apply_damage(target, HELLER_FURY_DAMAGE)
		_apply_burn(target, HELLER_BURN_DURATION)
	return true

func receive_support_hit(amount: float, source_position: Vector2 = Vector2.ZERO) -> void:
	if amount <= 0.0 or _downed:
		return
	health = maxf(0.0, health - amount)
	_hurt_left = 0.18
	_action_state = ""
	_action_left = 0.0
	if source_position != Vector2.ZERO:
		var away := global_position - source_position
		if away.length_squared() > 0.001:
			_facing = away.normalized()
	if health <= 0.0:
		_downed = true
		_recover_left = 3.2
		velocity = Vector2.ZERO
	_update_visual(0.0)

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
	var parent := get_tree().current_scene
	if parent != null:
		IzrdralarFxFactory.spawn(parent, effect_id, global_position + Vector2(0, -16), _facing, accent, "")
	_update_visual(0.0)
	return true

func _apply_chaos_secondary(target: Node2D) -> void:
	var effect_id := str(CHAOS_EFFECTS[_chaos_cursor % CHAOS_EFFECTS.size()])
	_chaos_cursor += 1
	_last_secondary_effect = effect_id
	match effect_id:
		"burn":
			_apply_burn(target, SECONDARY_BURN_DURATION)
		"stun":
			if target.has_method("apply_stun"):
				target.call("apply_stun", SECONDARY_STUN_DURATION)
		"chain":
			if target.has_method("apply_chain_hit"):
				target.call("apply_chain_hit", SECONDARY_CHAIN_DAMAGE)
			else:
				_apply_damage(target, SECONDARY_CHAIN_DAMAGE)

func _apply_burn(target: Node2D, duration: float) -> void:
	if target.has_method("apply_burn"):
		target.call("apply_burn", duration)

func _apply_damage(target: Node2D, amount: float) -> void:
	if target.has_method("take_damage"):
		target.call("take_damage", amount)

func _update_support_movement(delta: float) -> void:
	if not _support_enabled or _action_left > 0.0 or _hurt_left > 0.0 or not is_instance_valid(_support_target):
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

func _update_visual(delta: float) -> void:
	if is_instance_valid(_visual):
		_visual.call("update_from_actor", delta, support_state(), _facing, velocity, _action_left, _action_total, _hurt_left, _downed, _last_secondary_effect)
