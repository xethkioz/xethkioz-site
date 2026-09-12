extends "res://src/npc/enemy_controller.gd"

const ATLAS := preload("res://assets/production/characters/enemy_atlas.svg")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")
const FRAME_SIZE := Vector2(32, 32)

const STATE_IDLE := "idle"
const STATE_PATROL := "patrol"
const STATE_CHASE := "chase"
const STATE_WINDUP := "windup"
const STATE_RECOVER := "recover"
const STATE_RETURN := "return"

var _visual: Sprite2D
var _visual_index: int = 0
var _production_defeated: bool = false
var _ai_state: String = STATE_IDLE
var _state_timer: float = 0.0
var _attack_windup_total: float = 0.0
var _home_position: Vector2 = Vector2.ZERO
var _patrol_target: Vector2 = Vector2.ZERO
var _patrol_step: int = 0
var _stagger_left: float = 0.0
var _knockback_velocity: Vector2 = Vector2.ZERO
var _visual_time: float = 0.0
var _attack_impact_left: float = 0.0
var _last_move_direction: Vector2 = Vector2.DOWN

func configure_production(id_value: String, hp: float, speed: float, damage: float, xp: int, atlas_index: int) -> void:
	enemy_id = id_value
	max_health = hp
	health = hp
	move_speed = speed
	attack_damage = damage
	xp_reward = xp
	_visual_index = clampi(atlas_index, 0, 5)
	_apply_species_behavior()
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	super._ready()
	_home_position = global_position
	_patrol_target = _home_position
	_state_timer = 0.65 + float(_visual_index) * 0.09
	_visual = Sprite2D.new()
	_visual.name = "EnemyVisual"
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)
	_refresh_visual()

func _physics_process(delta: float) -> void:
	if _production_defeated:
		return
	_update_status_timers(delta)
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		velocity = velocity.move_toward(Vector2.ZERO, _movement_deceleration() * delta)
		if velocity.length_squared() > 0.25:
			move_and_slide()
		_update_visual_motion(delta)
		return

	if _stagger_left > 0.0:
		_stagger_left = maxf(0.0, _stagger_left - delta)
		velocity = _knockback_velocity
		_knockback_velocity = _knockback_velocity.move_toward(Vector2.ZERO, 520.0 * delta)
		move_and_slide()
		_update_visual_motion(delta)
		queue_redraw()
		return

	var to_player: Vector2 = _player.global_position - global_position
	var player_distance: float = to_player.length()
	var home_distance: float = global_position.distance_to(_home_position)
	var desired_velocity := Vector2.ZERO

	match _ai_state:
		STATE_IDLE:
			if player_distance <= aggro_range:
				_set_state(STATE_CHASE)
			elif _state_timer <= 0.0:
				_choose_patrol_target()
				_set_state(STATE_PATROL, 2.0)
		STATE_PATROL:
			if player_distance <= aggro_range:
				_set_state(STATE_CHASE)
			elif _state_timer <= 0.0 or global_position.distance_to(_patrol_target) <= 5.0:
				_set_state(STATE_IDLE, 0.65 + float((_patrol_step + _visual_index) % 4) * 0.18)
			else:
				desired_velocity = _desired_velocity_toward(_patrol_target, 0.42, false)
		STATE_CHASE:
			if player_distance > aggro_range * 1.45 or home_distance > aggro_range * 1.80:
				_set_state(STATE_RETURN)
			elif player_distance <= attack_range and _attack_cooldown <= 0.0:
				_begin_attack()
			elif _root_time <= 0.0:
				desired_velocity = _desired_velocity_toward(_player.global_position, 1.0, true)
		STATE_WINDUP:
			if player_distance > attack_range * (1.65 if _is_ranged() else 1.85):
				_set_state(STATE_CHASE)
			elif _state_timer <= 0.0:
				_resolve_attack()
		STATE_RECOVER:
			if _state_timer <= 0.0:
				_set_state(STATE_CHASE if player_distance <= aggro_range * 1.25 else STATE_RETURN)
		STATE_RETURN:
			if player_distance <= aggro_range * 0.82:
				_set_state(STATE_CHASE)
			elif home_distance <= 7.0:
				global_position = _home_position
				velocity = Vector2.ZERO
				_set_state(STATE_IDLE, 0.9)
			else:
				desired_velocity = _desired_velocity_toward(_home_position, 0.72, false)

	_apply_steering(desired_velocity, delta)
	_update_visual_motion(delta)
	queue_redraw()

func _apply_steering(desired_velocity: Vector2, delta: float) -> void:
	if _root_time > 0.0:
		desired_velocity = Vector2.ZERO
	var rate: float = _movement_acceleration() if desired_velocity.length_squared() > 0.25 else _movement_deceleration()
	velocity = velocity.move_toward(desired_velocity, rate * delta)
	if velocity.length_squared() > 0.25:
		_last_move_direction = velocity.normalized()
		move_and_slide()
	else:
		velocity = Vector2.ZERO

func _desired_velocity_toward(target: Vector2, speed_multiplier: float, allow_weave: bool) -> Vector2:
	if _root_time > 0.0:
		return Vector2.ZERO
	var direction: Vector2 = target - global_position
	if direction.length_squared() <= 0.25:
		return Vector2.ZERO
	direction = direction.normalized()
	if allow_weave and _uses_chase_weave():
		var perpendicular := Vector2(-direction.y, direction.x)
		var weave_strength: float = 0.10 if _visual_index == 1 else (0.16 if _visual_index == 4 else 0.07)
		var weave: float = sin(_visual_time * (2.7 + float(_visual_index) * 0.21) + float(_visual_index) * 1.3) * weave_strength
		direction = (direction + perpendicular * weave).normalized()
	return direction * move_speed * speed_multiplier * _slow_multiplier

func _movement_acceleration() -> float:
	match _visual_index:
		0:
			return 280.0
		1:
			return 390.0
		2:
			return 210.0
		3:
			return 250.0
		4:
			return 185.0
		5:
			return 320.0
		_:
			return 280.0

func _movement_deceleration() -> float:
	return _movement_acceleration() * (1.35 if _visual_index != 2 else 0.95)

func _uses_chase_weave() -> bool:
	return _visual_index in [0, 1, 4]

func _update_status_timers(delta: float) -> void:
	_attack_cooldown = maxf(0.0, _attack_cooldown - delta)
	_state_timer = maxf(0.0, _state_timer - delta)
	_slow_time = maxf(0.0, _slow_time - delta)
	_root_time = maxf(0.0, _root_time - delta)
	_mark_time = maxf(0.0, _mark_time - delta)
	_attack_impact_left = maxf(0.0, _attack_impact_left - delta)
	if _slow_time <= 0.0:
		_slow_multiplier = 1.0

func _apply_species_behavior() -> void:
	match _visual_index:
		0: # Brote goblin
			aggro_range = 148.0
			attack_range = 23.0
		1: # Explorador goblin
			aggro_range = 174.0
			attack_range = 25.0
		2: # Slime prismático
			aggro_range = 126.0
			attack_range = 24.0
		3: # Escarabajo de corteza
			aggro_range = 138.0
			attack_range = 26.0
		4: # Espíritu de bruma
			aggro_range = 188.0
			attack_range = 68.0
		5: # Drone pampeano roto
			aggro_range = 220.0
			attack_range = 92.0

func _is_ranged() -> bool:
	return _visual_index >= 4

func _attack_windup_duration() -> float:
	match _visual_index:
		0:
			return 0.38
		1:
			return 0.26
		2:
			return 0.48
		3:
			return 0.52
		4:
			return 0.58
		5:
			return 0.66
		_:
			return 0.40

func _attack_recovery_duration() -> float:
	return 0.42 if _visual_index == 1 else (0.72 if _is_ranged() else 0.58)

func _attack_interval() -> float:
	return 0.78 if _visual_index == 1 else (1.35 if _is_ranged() else 1.05)

func _set_state(next_state: String, duration: float = 0.0) -> void:
	_ai_state = next_state
	_state_timer = maxf(0.0, duration)
	if next_state != STATE_WINDUP:
		_attack_windup_total = 0.0

func _choose_patrol_target() -> void:
	_patrol_step += 1
	var angle: float = float(_patrol_step) * 2.399963 + float(_visual_index) * 0.53
	var radius: float = 22.0 + float((_patrol_step + _visual_index) % 4) * 8.0
	_patrol_target = _home_position + Vector2.from_angle(angle) * radius

func _begin_attack() -> void:
	var windup: float = _attack_windup_duration()
	_set_state(STATE_WINDUP, windup)
	_attack_windup_total = windup
	_spawn_feedback("ward", _direction_to_player(), _telegraph_color(), "", windup)

func _resolve_attack() -> void:
	var direction: Vector2 = _direction_to_player()
	var landed: bool = false
	_attack_impact_left = 0.14
	_last_move_direction = direction
	if _is_ranged():
		_spawn_feedback("line", direction, _attack_color(), "")
		landed = _ranged_attack_hits_player()
	else:
		_spawn_feedback("slash", direction, _attack_color(), "")
		landed = global_position.distance_to(_player.global_position) <= attack_range + 9.0
	if landed and is_instance_valid(_player) and _player.has_method("take_damage"):
		_player.take_damage(attack_damage)
	_attack_cooldown = _attack_interval()
	_set_state(STATE_RECOVER, _attack_recovery_duration())

func _ranged_attack_hits_player() -> bool:
	if not is_instance_valid(_player):
		return false
	var query := PhysicsRayQueryParameters2D.create(global_position, _player.global_position, 1 | 4)
	query.exclude = [get_rid()]
	query.collide_with_areas = false
	query.collide_with_bodies = true
	var result: Dictionary = get_world_2d().direct_space_state.intersect_ray(query)
	return not result.is_empty() and result.get("collider") == _player

func _direction_to_player() -> Vector2:
	if is_instance_valid(_player):
		var direction: Vector2 = _player.global_position - global_position
		if direction.length_squared() > 0.001:
			return direction.normalized()
	return _last_move_direction

func _telegraph_color() -> Color:
	return Color("c686ff") if _is_ranged() else Color("ffb066")

func _attack_color() -> Color:
	return Color("d7dcff") if _visual_index == 4 else (Color("7ee7ff") if _visual_index == 5 else Color("ff8c42"))

func _refresh_visual() -> void:
	if is_instance_valid(_visual):
		_visual.region_rect = Rect2(Vector2(_visual_index * 32, 0), FRAME_SIZE)

func _update_visual_motion(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	_visual_time += delta
	var speed_ratio: float = clampf(velocity.length() / maxf(1.0, move_speed), 0.0, 1.4)
	var moving: bool = speed_ratio > 0.08
	var base_y := -7.0
	var bob := 0.0
	var sway := 0.0
	var scale_value := Vector2.ONE

	match _visual_index:
		0: # Brote goblin: pasos cortos e irregulares.
			bob = absf(sin(_visual_time * 9.4)) * 1.35 * speed_ratio if moving else sin(_visual_time * 2.0) * 0.32
			sway = sin(_visual_time * 4.7) * 0.65 * speed_ratio
		1: # Explorador: zancada más rápida y ligera.
			bob = absf(sin(_visual_time * 12.0)) * 1.15 * speed_ratio if moving else sin(_visual_time * 2.4) * 0.25
			sway = sin(_visual_time * 6.0) * 0.85 * speed_ratio
		2: # Slime: squash/stretch, sin sensación de "caminar".
			var pulse: float = sin(_visual_time * (7.0 if moving else 2.5))
			bob = maxf(0.0, pulse) * 1.5 * maxf(0.35, speed_ratio)
			scale_value = Vector2(1.0 + pulse * 0.055, 1.0 - pulse * 0.075)
		3: # Escarabajo: cuerpo bajo, pesado y estable.
			bob = absf(sin(_visual_time * 8.0)) * 0.55 * speed_ratio
			sway = sin(_visual_time * 4.0) * 0.30 * speed_ratio
		4: # Espíritu: flotación continua independiente de los pasos.
			bob = sin(_visual_time * 2.8) * 1.7 + sin(_visual_time * 6.1) * 0.25 * speed_ratio
			sway = sin(_visual_time * 2.2) * 0.75
		5: # Drone: oscilación mecánica controlada.
			bob = sin(_visual_time * 5.2) * 0.45 + (0.35 if moving and fmod(_visual_time * 8.0, 1.0) > 0.82 else 0.0)
			sway = sin(_visual_time * 3.3) * 0.25

	if _ai_state == STATE_WINDUP and _attack_windup_total > 0.0:
		var windup_progress := 1.0 - clampf(_state_timer / _attack_windup_total, 0.0, 1.0)
		var anticipation := sin(windup_progress * PI * 0.5)
		scale_value *= Vector2(1.0 + 0.055 * anticipation, 1.0 - 0.075 * anticipation)
		base_y += 1.5 * anticipation
	elif _attack_impact_left > 0.0:
		var attack_progress := 1.0 - clampf(_attack_impact_left / 0.14, 0.0, 1.0)
		var attack_pulse := sin(attack_progress * PI)
		base_y -= 0.8 * attack_pulse
		sway += _last_move_direction.x * 2.8 * attack_pulse
		scale_value *= Vector2(1.0 + 0.08 * attack_pulse, 1.0 - 0.045 * attack_pulse)
	elif _ai_state == STATE_RECOVER:
		scale_value *= Vector2(0.985, 1.025)

	_visual.position = Vector2(sway, base_y - bob)
	_visual.scale = scale_value
	_visual.rotation = clampf(velocity.x / maxf(1.0, move_speed), -1.0, 1.0) * (0.035 if _visual_index != 4 else 0.06)
	if velocity.x < -2.0:
		_visual.flip_h = true
	elif velocity.x > 2.0:
		_visual.flip_h = false

func take_damage(amount: float) -> void:
	if _production_defeated or amount <= 0.0:
		return
	var applied: float = minf(amount, health)
	health = maxf(0.0, health - amount)
	var impact_direction: Vector2 = _impact_direction()
	_spawn_feedback("hit", impact_direction, Color("ff8c42"), str(roundi(applied)))
	_flash_visual()
	_stagger_left = 0.10 if _visual_index == 3 else 0.14
	_knockback_velocity = impact_direction * (32.0 if _visual_index == 3 else 58.0)
	if health > 0.0:
		_set_state(STATE_CHASE)
		queue_redraw()
		return
	_production_defeated = true
	set_physics_process(false)
	collision_layer = 0
	collision_mask = 0
	EventBus.enemy_defeated.emit(enemy_id, xp_reward, global_position)
	GameState.add_crystals(2)
	_spawn_feedback("death", Vector2.UP, Color("8b5cf6"), "+2 cristales")
	await _play_defeat_sequence(impact_direction)
	if is_instance_valid(self):
		queue_free()

func _play_defeat_sequence(impact_direction: Vector2) -> void:
	if not is_instance_valid(_visual):
		await get_tree().create_timer(0.34).timeout
		return
	var tween := create_tween().set_parallel(true)
	if _visual_index == 4:
		# Espíritu: pierde cohesión y asciende antes de disiparse.
		tween.tween_property(_visual, "position", _visual.position + Vector2(impact_direction.x * 5.0, -11.0), 0.38).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
		tween.tween_property(_visual, "scale", Vector2(1.20, 1.34), 0.36).set_trans(Tween.TRANS_SINE)
	else:
		# Criaturas físicas: reciben el último impulso, colapsan y pierden volumen.
		tween.tween_property(_visual, "position", _visual.position + impact_direction * 8.0 + Vector2(0, 4), 0.34).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tween.tween_property(_visual, "rotation", clampf(impact_direction.x * 0.52, -0.52, 0.52), 0.30).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(_visual, "scale", Vector2(1.10, 0.28), 0.34).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	var fade := tween.tween_property(_visual, "modulate", Color(1.0, 1.0, 1.0, 0.0), 0.28)
	fade.set_delay(0.10)
	await tween.finished

func _impact_direction() -> Vector2:
	if is_instance_valid(_player):
		var direction: Vector2 = global_position - _player.global_position
		if direction.length_squared() > 0.001:
			return direction.normalized()
	return Vector2.UP

func _flash_visual() -> void:
	if not is_instance_valid(_visual):
		return
	_visual.modulate = Color(1.0, 0.58, 0.46, 1.0)
	var tween: Tween = create_tween()
	tween.tween_property(_visual, "modulate", Color.WHITE, 0.11)

func _spawn_feedback(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "", duration_override: float = -1.0) -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var effect_id: String = "enemy_%s" % kind_value
	IzrdralarFxFactory.spawn(scene, effect_id, global_position + Vector2(0, -9), direction_value, color_value, text_value, duration_override)

func _draw() -> void:
	var health_ratio: float = health / max_health if max_health > 0.0 else 0.0
	if _mark_time > 0.0:
		draw_arc(Vector2(0, -5), 17.0, 0.0, TAU, 18, Color("c686ff"), 2.0)
	if _root_time > 0.0:
		draw_line(Vector2(-11, 7), Vector2(11, 7), Color("9f7f5f"), 3.0)
	if _ai_state == STATE_WINDUP and _attack_windup_total > 0.0:
		var telegraph_progress: float = 1.0 - clampf(_state_timer / _attack_windup_total, 0.0, 1.0)
		var danger: Color = _telegraph_color()
		draw_arc(Vector2(0, -5), 14.0 + telegraph_progress * 5.0, 0.0, TAU, 22, Color(danger.r, danger.g, danger.b, 0.45 + telegraph_progress * 0.45), 2.0 + telegraph_progress)
		if _is_ranged() and is_instance_valid(_player):
			var local_target: Vector2 = to_local(_player.global_position)
			draw_line(Vector2(0, -7), local_target, Color(danger.r, danger.g, danger.b, 0.22 + telegraph_progress * 0.40), 1.0)
	if health < max_health or _ai_state == STATE_CHASE or _ai_state == STATE_WINDUP or _ai_state == STATE_RECOVER:
		draw_rect(Rect2(-13, -25, 26, 3), Color("241f22"))
		draw_rect(Rect2(-13, -25, 26 * health_ratio, 3), Color("ff6b6b"))