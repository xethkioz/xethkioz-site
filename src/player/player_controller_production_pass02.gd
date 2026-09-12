extends "res://src/player/player_controller_production.gd"

# Feel layer for the authored Izrdralar production pass. Damage, hitboxes,
# cooldowns and progression stay in the parent controller; this layer adds
# camera feedback, action commitment, physical consumable use and contextual
# interaction readability.

const ConsumableUseFeedbackScript := preload("res://src/fx/consumable_use_feedback.gd")

var _world_camera: Camera2D
var _camera_shake_left := 0.0
var _camera_shake_duration := 0.0
var _camera_shake_strength := 0.0
var _camera_shake_clock := 0.0
var _interaction_hint := ""
var _consuming := false
var _consume_pose_left := 0.0
var _consume_pose_total := 0.0
var _consume_generation := 0
var _active_consumable_visual: Node2D

func _ready() -> void:
	super._ready()
	_world_camera = get_node_or_null("WorldCamera") as Camera2D

func _exit_tree() -> void:
	if not _interaction_hint.is_empty():
		EventBus.interaction_hint_changed.emit("")

func _physics_process(delta: float) -> void:
	_consume_pose_left = maxf(0.0, _consume_pose_left - delta)
	super._physics_process(delta)
	if _consuming:
		_apply_consumable_pose()
	_update_camera_feedback(delta)
	_update_interaction_hint()

func _apply_ground_movement(input_vector: Vector2, delta: float) -> void:
	# Consuming is intentionally more committed than casting: the player can
	# take small steps but cannot glide around at normal combat speed.
	if _consuming:
		super._apply_ground_movement(input_vector * 0.16, delta)
		velocity = velocity.limit_length(move_speed * 0.30)
		return
	# Dash is handled before this method by the base controller and therefore
	# remains a responsive cancel for attacks/casts, but not for consumables.
	if _attack_pose_left > 0.0:
		super._apply_ground_movement(input_vector * 0.22, delta)
		velocity = velocity.limit_length(move_speed * 0.52)
		return
	if _cast_pose_left > 0.0:
		super._apply_ground_movement(input_vector * 0.52, delta)
		velocity = velocity.limit_length(move_speed * 0.72)
		return
	super._apply_ground_movement(input_vector, delta)

func _perform_melee_attack() -> void:
	if _consuming:
		return
	super._perform_melee_attack()

func _use_ability(slot: String) -> void:
	if _consuming:
		return
	super._use_ability(slot)

func _interact_with_nearest() -> void:
	if _consuming:
		return
	super._interact_with_nearest()

func use_consumable(item_id: String) -> bool:
	if _consuming or _dash_time_left > 0.0 or _attack_pose_left > 0.0 or _cast_pose_left > 0.0:
		EventBus.toast_requested.emit("Terminá la acción actual antes de usar un objeto")
		return false
	var spec: Dictionary = InventoryService.consumable_data(item_id)
	if spec.is_empty() or InventoryService.amount_of(item_id) <= 0:
		EventBus.toast_requested.emit("No tenés %s" % InventoryService.item_name(item_id))
		return false
	var heal_amount := float(spec.get("heal", 0.0))
	var mana_amount := float(spec.get("mana", 0.0))
	if health >= max_health - 0.01 and (mana_amount <= 0.0 or mana >= max_mana - 0.01):
		EventBus.toast_requested.emit("No necesitás usar %s ahora" % InventoryService.item_name(item_id))
		return false

	var use_time := maxf(0.35, float(spec.get("use_time", 0.72)))
	_consume_generation += 1
	var generation := _consume_generation
	_consuming = true
	_consume_pose_total = use_time
	_consume_pose_left = use_time
	# Prevent dash while the item is actually being brought to the mouth/used.
	_dash_cooldown_left = maxf(_dash_cooldown_left, use_time)
	_attack_cooldown_left = maxf(_attack_cooldown_left, use_time)
	_spawn_consumable_visual(item_id, use_time)

	var consume_moment := use_time * 0.58
	await get_tree().create_timer(consume_moment).timeout
	if generation != _consume_generation or not is_inside_tree():
		return false
	if not InventoryService.consume_one(item_id):
		_finish_consumption(generation)
		return false

	var previous_health := health
	var previous_mana := mana
	health = minf(max_health, health + heal_amount)
	mana = minf(max_mana, mana + mana_amount)
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_mana_changed.emit(mana, max_mana)
	var restored_health := health - previous_health
	var restored_mana := mana - previous_mana
	var result_text := "+%d salud" % roundi(restored_health)
	if restored_mana > 0.5:
		result_text += " · +%d mana" % roundi(restored_mana)
	_spawn_feedback("regen", global_position + Vector2(0, -10), Vector2.UP, Color("8fcf78"), result_text)
	EventBus.toast_requested.emit("Usaste %s · %s" % [InventoryService.item_name(item_id), result_text])
	SaveService.save_game({"consumed_item": item_id})

	var finish_delay := maxf(0.0, use_time - consume_moment)
	if finish_delay > 0.0:
		await get_tree().create_timer(finish_delay).timeout
	_finish_consumption(generation)
	return true

func _spawn_consumable_visual(item_id: String, use_time: float) -> void:
	if is_instance_valid(_active_consumable_visual):
		_active_consumable_visual.queue_free()
	var visual := Node2D.new()
	visual.name = "ConsumableUseFeedback"
	visual.set_script(ConsumableUseFeedbackScript)
	visual.position = Vector2.ZERO
	add_child(visual)
	visual.call("configure", item_id, facing, use_time)
	_active_consumable_visual = visual

func _finish_consumption(generation: int) -> void:
	if generation != _consume_generation:
		return
	_consuming = false
	_consume_pose_left = 0.0
	_consume_pose_total = 0.0
	_active_consumable_visual = null

func _cancel_consumption() -> void:
	if not _consuming:
		return
	_consume_generation += 1
	_consuming = false
	_consume_pose_left = 0.0
	_consume_pose_total = 0.0
	if is_instance_valid(_active_consumable_visual):
		_active_consumable_visual.queue_free()
	_active_consumable_visual = null
	EventBus.toast_requested.emit("Uso de objeto interrumpido")

func _apply_consumable_pose() -> void:
	if _consume_pose_total <= 0.0:
		return
	var progress := 1.0 - clampf(_consume_pose_left / _consume_pose_total, 0.0, 1.0)
	var lift := sin(clampf(progress / 0.62, 0.0, 1.0) * PI * 0.5)
	var settle := 1.0 - clampf((progress - 0.72) / 0.28, 0.0, 1.0)
	var pose := lift * settle
	var base_position := Vector2(0.0, -7.0)
	var lean := -facing.x * 0.035 * pose
	if is_instance_valid(_visual):
		_visual.position = base_position + Vector2(0.0, 0.8 * pose)
		_visual.rotation = lean
		_visual.scale = Vector2(_body_scale * (1.0 - 0.025 * pose), 1.0 + 0.025 * pose)
	if is_instance_valid(_profile_overlay):
		_profile_overlay.position = base_position + Vector2(0.0, 0.8 * pose)
		_profile_overlay.rotation = lean
		_profile_overlay.scale = Vector2(1.0 - 0.025 * pose, 1.0 + 0.025 * pose)

func take_damage(amount: float) -> void:
	if _consuming:
		_cancel_consumption()
	super.take_damage(amount)

func _update_interaction_hint() -> void:
	var nearest: Node2D = null
	var nearest_distance := interaction_range
	for candidate in get_tree().get_nodes_in_group("interactable"):
		if candidate is not Node2D or not is_instance_valid(candidate) or not candidate.is_visible_in_tree():
			continue
		var distance := global_position.distance_to(candidate.global_position)
		if distance <= nearest_distance:
			nearest = candidate
			nearest_distance = distance

	var next_hint := ""
	if nearest != null:
		if nearest.has_method("interaction_label"):
			next_hint = str(nearest.call("interaction_label")).strip_edges()
		if next_hint.is_empty():
			next_hint = "Interactuar"
	if next_hint == _interaction_hint:
		return
	_interaction_hint = next_hint
	EventBus.interaction_hint_changed.emit(_interaction_hint)

func _spawn_feedback(kind_value: String, world_position: Vector2, direction_value: Vector2, color_value: Color, text_value: String) -> void:
	super._spawn_feedback(kind_value, world_position, direction_value, color_value, text_value)
	match kind_value:
		"burst":
			_kick_camera(0.095, 2.4)
		"hurt":
			_kick_camera(0.13, 3.2)
		"line", "shot", "charge":
			_kick_camera(0.055, 1.15)
		_:
			pass

func _kick_camera(duration: float, strength: float) -> void:
	if not is_instance_valid(_world_camera):
		return
	var effective_strength := strength * (0.22 if AccessibilityService.reduce_camera_motion else 1.0)
	var effective_duration := duration * (0.55 if AccessibilityService.reduce_camera_motion else 1.0)
	# Stronger feedback wins when multiple effects happen in the same frame.
	if effective_strength >= _camera_shake_strength or _camera_shake_left <= 0.0:
		_camera_shake_duration = maxf(0.01, effective_duration)
		_camera_shake_strength = effective_strength
	_camera_shake_left = maxf(_camera_shake_left, effective_duration)

func _update_camera_feedback(delta: float) -> void:
	if not is_instance_valid(_world_camera):
		return
	if _camera_shake_left <= 0.0:
		_world_camera.offset = Vector2.ZERO
		_camera_shake_strength = 0.0
		_camera_shake_clock = 0.0
		return

	_camera_shake_left = maxf(0.0, _camera_shake_left - delta)
	_camera_shake_clock += delta
	var duration := maxf(0.01, _camera_shake_duration)
	var decay := clampf(_camera_shake_left / duration, 0.0, 1.0)
	var wave := Vector2(
		sin(_camera_shake_clock * 91.0),
		cos(_camera_shake_clock * 73.0)
	)
	_world_camera.offset = wave * _camera_shake_strength * decay