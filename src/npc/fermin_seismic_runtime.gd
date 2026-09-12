extends CharacterBody2D

const VisualScript := preload("res://src/npc/fermin_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const MOVE_SPEED := 70.0
const ACCELERATION := 270.0
const DECELERATION := 390.0
const FOLLOW_DISTANCE := 82.0
const GROUND_SLAM_RADIUS := 94.0
const GROUND_SLAM_DAMAGE := 15.0
const GROUND_SLAM_STUN := 0.58
const GROUND_SLAM_KNOCKBACK := 64.0
const ROCK_ARMOR_DURATION := 3.8
const ROCK_ARMOR_DAMAGE_MULTIPLIER := 0.58
const CHARGE_SPEED := 176.0
const CHARGE_DAMAGE := 12.0
const CHARGE_KNOCKBACK := 86.0
const CHARGE_HIT_RADIUS := 25.0

const ACTION_DURATIONS := {
	"ground_slam": 0.70,
	"rock_armor": 0.62,
	"seismic_charge": 0.52
}

var max_health := 142.0
var health := 142.0
var _support_target: Node2D
var _support_enabled := false
var _facing := Vector2.DOWN
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _recover_left := 0.0
var _rock_armor_remaining := 0.0
var _charge_direction := Vector2.RIGHT
var _charge_targets: Array = []
var _charge_hit_ids: Dictionary = {}
var _visual: Node2D

func _ready() -> void:
	add_to_group("fermin_support")
	_visual = Node2D.new()
	_visual.name = "FerminRuntimeVisual"
	_visual.set_script(VisualScript)
	add_child(_visual)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
	_rock_armor_remaining = maxf(0.0, _rock_armor_remaining - delta)
	if _downed:
		_recover_left = maxf(0.0, _recover_left - delta)
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		if _recover_left <= 0.0:
			_downed = false
			health = maxf(max_health * 0.44, 1.0)
	elif _action_state == "seismic_charge" and _action_left > 0.0:
		_update_seismic_charge()
	else:
		_update_support_movement(delta)
	if _action_left <= 0.0:
		_action_state = ""
		_charge_targets.clear()
		_charge_hit_ids.clear()
	_update_visual(delta)

func character_age() -> int:
	return 13

func support_role() -> String:
	return "Mentor de Fuerza e Impacto"

func element_affinity() -> String:
	return "Tierra / Densidad Sísmica"

func bond_name() -> String:
	return "Mozaruk"

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
		return "walk_heavy_step"
	return "idle_sturdy"

func support_health() -> float:
	return health

func support_max_health() -> float:
	return max_health

func rock_armor_remaining() -> float:
	return _rock_armor_remaining

func rock_armor_damage_multiplier() -> float:
	return ROCK_ARMOR_DAMAGE_MULTIPLIER if _rock_armor_remaining > 0.0 else 1.0

func trigger_ground_slam(targets: Array = []) -> bool:
	if not _begin_action("ground_slam", "player_burst", Color("ffd700")):
		return false
	for target_value in targets:
		if not (target_value is Node2D):
			continue
		var target := target_value as Node2D
		if not is_instance_valid(target) or global_position.distance_to(target.global_position) > GROUND_SLAM_RADIUS:
			continue
		_apply_seismic_hit(target, GROUND_SLAM_DAMAGE, GROUND_SLAM_STUN, GROUND_SLAM_KNOCKBACK)
	return true

func trigger_rock_armor() -> bool:
	if not _begin_action("rock_armor", "player_guard", Color("d2b48c")):
		return false
	_rock_armor_remaining = ROCK_ARMOR_DURATION
	return true

func trigger_seismic_charge(direction: Vector2, targets: Array = []) -> bool:
	if not _begin_action("seismic_charge", "player_charge", Color("ff8c42")):
		return false
	_charge_direction = direction.normalized() if direction.length_squared() > 0.001 else _facing
	if _charge_direction.length_squared() <= 0.001:
		_charge_direction = Vector2.RIGHT
	_facing = _charge_direction
	_charge_targets = targets.duplicate()
	_charge_hit_ids.clear()
	return true

func receive_support_hit(amount: float, source_position: Vector2 = Vector2.ZERO) -> void:
	if amount <= 0.0 or _downed:
		return
	var applied := amount * rock_armor_damage_multiplier()
	health = maxf(0.0, health - applied)
	_hurt_left = 0.16 if _rock_armor_remaining > 0.0 else 0.20
	if _action_state != "rock_armor":
		_action_state = ""
		_action_left = 0.0
	if source_position != Vector2.ZERO:
		var away := global_position - source_position
		if away.length_squared() > 0.001:
			_facing = away.normalized()
	if health <= 0.0:
		_downed = true
		_recover_left = 4.0
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
		IzrdralarFxFactory.spawn(parent, effect_id, global_position + Vector2(0, -18), _facing, accent, "")
	_update_visual(0.0)
	return true

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

func _update_seismic_charge() -> void:
	velocity = _charge_direction * CHARGE_SPEED
	move_and_slide()
	for target_value in _charge_targets:
		if not (target_value is Node2D):
			continue
		var target := target_value as Node2D
		if not is_instance_valid(target):
			continue
		var target_id := target.get_instance_id()
		if _charge_hit_ids.has(target_id):
			continue
		if global_position.distance_to(target.global_position) <= CHARGE_HIT_RADIUS:
			_charge_hit_ids[target_id] = true
			_apply_seismic_hit(target, CHARGE_DAMAGE, 0.22, CHARGE_KNOCKBACK)

func _apply_seismic_hit(target: Node2D, damage: float, stun_duration: float, knockback_strength: float) -> void:
	if target.has_method("take_damage"):
		target.call("take_damage", damage)
	if target.has_method("apply_stun"):
		target.call("apply_stun", stun_duration)
	if target.has_method("apply_knockback"):
		var direction := target.global_position - global_position
		if direction.length_squared() <= 0.001:
			direction = _facing
		target.call("apply_knockback", direction.normalized(), knockback_strength)

func _update_visual(delta: float) -> void:
	if is_instance_valid(_visual):
		_visual.call("update_from_actor", delta, support_state(), _facing, velocity, _action_left, _action_total, _hurt_left, _downed, _rock_armor_remaining)
