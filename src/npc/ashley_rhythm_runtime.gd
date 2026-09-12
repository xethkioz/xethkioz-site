extends CharacterBody2D

signal beat_pulse(beat_index: int)

const VisualScript := preload("res://src/npc/ashley_runtime_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const BPM := 96.0
const BEAT_INTERVAL := 60.0 / BPM
const BEAT_WINDOW := 0.13
const MOVE_SPEED := 78.0
const ACCELERATION := 300.0
const DECELERATION := 410.0
const FOLLOW_DISTANCE := 84.0
const LUNAR_CRESCENT_RANGE := 188.0
const LUNAR_CRESCENT_DAMAGE := 18.0
const RHYTHM_CADENCE_DURATION := 3.5
const RHYTHM_CADENCE_MULTIPLIER := 1.14
const MOON_BURST_RADIUS := 102.0
const MOON_BURST_DAMAGE := 10.0
const MOON_BURST_STUN_ON_BEAT := 1.0
const MOON_BURST_STUN_OFF_BEAT := 0.55

const ACTION_DURATIONS := {
	"lunar_crescent": 0.54,
	"rhythm_cadence": 0.68,
	"moon_phase_burst": 0.78
}

var max_health := 122.0
var health := 122.0
var _support_target: Node2D
var _support_enabled := false
var _facing := Vector2.DOWN
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.01
var _hurt_left := 0.0
var _downed := false
var _recover_left := 0.0
var _rhythm_clock := 0.0
var _last_beat_index := -1
var _cadence_remaining := 0.0
var _visual: Node2D

func _ready() -> void:
	add_to_group("ashley_support")
	_visual = Node2D.new()
	_visual.name = "AshleyRuntimeVisual"
	_visual.set_script(VisualScript)
	add_child(_visual)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	_update_rhythm(delta)
	_action_left = maxf(0.0, _action_left - delta)
	_hurt_left = maxf(0.0, _hurt_left - delta)
	_cadence_remaining = maxf(0.0, _cadence_remaining - delta)
	if _action_left <= 0.0:
		_action_state = ""
	if _downed:
		_recover_left = maxf(0.0, _recover_left - delta)
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		if _recover_left <= 0.0:
			_downed = false
			health = maxf(max_health * 0.40, 1.0)
	else:
		_update_support_movement(delta)
	_update_visual(delta)

func character_age() -> int:
	return 15

func support_role() -> String:
	return "Mentora de Ritmo y Cadencia"

func element_affinity() -> String:
	return "Luz Lunar / Resonancia Rítmica"

func bond_name() -> String:
	return "Killaruna"

func bpm() -> float:
	return BPM

func beat_interval() -> float:
	return BEAT_INTERVAL

func rhythm_window_open() -> bool:
	var phase := fmod(_rhythm_clock, BEAT_INTERVAL)
	var distance_to_beat := minf(phase, BEAT_INTERVAL - phase)
	return distance_to_beat <= BEAT_WINDOW

func rhythm_attack_multiplier() -> float:
	return 1.18 if rhythm_window_open() else 1.0

func cadence_remaining() -> float:
	return _cadence_remaining

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
		return "walk_graceful"
	return "idle_rhythmic"

func support_health() -> float:
	return health

func support_max_health() -> float:
	return max_health

func trigger_lunar_crescent(target: Node2D = null) -> bool:
	if not _begin_action("lunar_crescent", "player_shot", Color("e0e6ed")):
		return false
	if is_instance_valid(target):
		var offset := target.global_position - global_position
		if offset.length_squared() > 0.001:
			_facing = offset.normalized()
		if offset.length() <= LUNAR_CRESCENT_RANGE and target.has_method("take_damage"):
			target.call("take_damage", LUNAR_CRESCENT_DAMAGE * rhythm_attack_multiplier())
	return true

func trigger_rhythm_cadence() -> bool:
	if not _begin_action("rhythm_cadence", "player_wave", Color("85a5cc")):
		return false
	_cadence_remaining = RHYTHM_CADENCE_DURATION
	if _valid_support_target() and _support_target.has_method("apply_rhythm_cadence"):
		_support_target.call("apply_rhythm_cadence", RHYTHM_CADENCE_DURATION, RHYTHM_CADENCE_MULTIPLIER)
	return true

func trigger_moon_phase_burst(targets: Array = []) -> bool:
	if not _begin_action("moon_phase_burst", "player_burst", Color("ffffff")):
		return false
	var stun_duration := MOON_BURST_STUN_ON_BEAT if rhythm_window_open() else MOON_BURST_STUN_OFF_BEAT
	for target_value in targets:
		if not (target_value is Node2D):
			continue
		var target := target_value as Node2D
		if not is_instance_valid(target) or global_position.distance_to(target.global_position) > MOON_BURST_RADIUS:
			continue
		if target.has_method("take_damage"):
			target.call("take_damage", MOON_BURST_DAMAGE)
		if target.has_method("apply_stun"):
			target.call("apply_stun", stun_duration)
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
		_recover_left = 3.6
		velocity = Vector2.ZERO
	_update_visual(0.0)

func heal_support(amount: float) -> void:
	if amount > 0.0:
		health = minf(max_health, health + amount)

func _update_rhythm(delta: float) -> void:
	_rhythm_clock += delta
	var current_index := int(floor(_rhythm_clock / BEAT_INTERVAL))
	if current_index != _last_beat_index:
		_last_beat_index = current_index
		beat_pulse.emit(current_index)

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
		IzrdralarFxFactory.spawn(parent, effect_id, global_position + Vector2(0, -22), _facing, accent, "")
	_update_visual(0.0)
	return true

func _update_support_movement(delta: float) -> void:
	if not _support_enabled or _action_left > 0.0 or _hurt_left > 0.0 or not _valid_support_target():
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

func _valid_support_target() -> bool:
	return is_instance_valid(_support_target)

func _update_visual(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	_visual.call("update_from_actor", delta, support_state(), _facing, velocity, _action_left, _action_total, _hurt_left, _downed, rhythm_window_open(), _cadence_remaining)
