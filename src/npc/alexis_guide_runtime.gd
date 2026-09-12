extends "res://src/npc/npc_interactable_production_pass02.gd"

const AlexisApprovedVisualScript := preload("res://src/npc/alexis_approved_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")

const ACTION_DURATIONS := {
	"frost_strike": 0.62,
	"shadow_step": 0.42,
	"trap_place": 0.72,
	"mentor_buff": 0.82
}

var _approved_visual: Node2D
var _field_support_enabled := false
var _support_target: Node2D
var _support_velocity := Vector2.ZERO
var _support_facing := Vector2.DOWN
var _support_move_speed := 86.0
var _support_acceleration := 310.0
var _support_deceleration := 430.0
var _follow_distance := 92.0
var _catchup_distance := 210.0
var _action_state := ""
var _action_left := 0.0
var _action_total := 0.0
var _hurt_left := 0.0
var _support_health := 170.0
var _support_max_health := 170.0
var _downed := false
var _recover_left := 0.0

func configure_production(id_value: String, name_value: String, lines: Array[String], index: int, rules: Array = []) -> void:
	super.configure_production(id_value, name_value, lines, index, rules)
	if is_inside_tree():
		_apply_alexis_presentation()

func _ready() -> void:
	super._ready()
	add_to_group("alexis_guide")
	_approved_visual = Node2D.new()
	_approved_visual.name = "AlexisApprovedVisual"
	_approved_visual.set_script(AlexisApprovedVisualScript)
	add_child(_approved_visual)
	_apply_alexis_presentation()
	_update_approved_visual(0.0)

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
			_support_health = maxf(_support_max_health * 0.38, 1.0)
	else:
		_update_field_support(delta)
	_update_approved_visual(delta)

func _apply_alexis_presentation() -> void:
	if is_instance_valid(_visual):
		_visual.visible = false
	if is_instance_valid(_nameplate):
		_nameplate.position = Vector2(-46, -61)
		_nameplate.size = Vector2(92, 14)
		_nameplate.add_theme_color_override("font_color", Color("d8ceff"))

func set_field_support_enabled(enabled: bool, target: Node2D = null) -> void:
	_field_support_enabled = enabled
	_support_target = target
	if _field_support_enabled and not is_instance_valid(_support_target):
		_support_target = get_tree().get_first_node_in_group("player") as Node2D
	if not _field_support_enabled:
		_support_velocity = Vector2.ZERO

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
		return "walk_heavy"
	return "idle"

func support_health() -> float:
	return _support_health

func support_max_health() -> float:
	return _support_max_health

func trigger_frost_strike() -> bool:
	return _begin_support_action("frost_strike", "player_wave", Color("7ee7ff"))

func trigger_shadow_step() -> bool:
	return _begin_support_action("shadow_step", "player_burst", Color("7b5ac8"))

func trigger_trap_place() -> bool:
	return _begin_support_action("trap_place", "player_root", Color("8edee8"))

func trigger_mentor_buff() -> bool:
	return _begin_support_action("mentor_buff", "player_guard", Color("b8edff"))

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
			_support_facing = -away.normalized()
	if _support_health <= 0.0:
		_downed = true
		_recover_left = 3.0
		_support_velocity = Vector2.ZERO

func heal_support(amount: float) -> void:
	if amount <= 0.0:
		return
	_support_health = minf(_support_max_health, _support_health + amount)

func _begin_support_action(action_id: String, effect_id: String, accent: Color) -> bool:
	if _downed or _hurt_left > 0.0 or _action_left > 0.0:
		return false
	if not ACTION_DURATIONS.has(action_id):
		return false
	_action_state = action_id
	_action_total = float(ACTION_DURATIONS[action_id])
	_action_left = _action_total
	_support_velocity = Vector2.ZERO
	var scene := get_tree().current_scene
	if scene != null:
		IzrdralarFxFactory.spawn(scene, effect_id, global_position + Vector2(0, -28), _support_facing, accent, "")
	return true

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
	var speed_multiplier := 1.34 if distance >= _catchup_distance else 1.0
	var desired := direction * _support_move_speed * speed_multiplier
	_support_velocity = _support_velocity.move_toward(desired, _support_acceleration * delta)
	global_position += _support_velocity * delta

func _update_approved_visual(delta: float) -> void:
	if not is_instance_valid(_approved_visual):
		return
	_approved_visual.call(
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
