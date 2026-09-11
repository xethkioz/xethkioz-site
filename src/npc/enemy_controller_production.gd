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
	_update_visual_motion(delta)
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		velocity = Vector2.ZERO
		return

	if _stagger_left > 0.0:
		_stagger_left = maxf(0.0, _stagger_left - delta)
		velocity = _knockback_velocity
		_knockback_velocity = _knockback_velocity.move_toward(Vector2.ZERO, 520.0 * delta)
		move_and_slide()
		queue_redraw()
		return

	var to_player: Vector2 = _player.global_position - global_position
	var player_distance: float = to_player.length()
	var home_distance: float = global_position.distance_to(_home_position)

	match _ai_state:
		STATE_IDLE:
			velocity = Vector2.ZERO
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
				_move_toward_position(_patrol_target, 0.42)
		STATE_CHASE:
			if player_distance > aggro_range * 1.45 or home_distance > aggro_range * 1.80:
				_set_state(STATE_RETURN)
			elif player_distance <= attack_range and _attack_cooldown <= 0.0:
				_begin_attack()
			elif _root_time <= 0.0:
				_move_toward_position(_player.global_position, 1.0)
			else:
				velocity = Vector2.ZERO
		STATE_WINDUP:
			velocity = Vector2.ZERO
			if player_distance > attack_range * (1.65 if _is_ranged() else 1.85):
				_set_state(STATE_CHASE)
			elif _state_timer <= 0.0:
				_resolve_attack()
		STATE_RECOVER:
			velocity = Vector2.ZERO
			if _state_timer <= 0.0:
				_set_state(STATE_CHASE if player_distance <= aggro_range * 1.25 else STATE_RETURN)
		STATE_RETURN:
			if player_distance <= aggro_range * 0.82:
				_set_state(STATE_CHASE)
			elif home_distance <= 7.0:
				global_position = _home_position
				_set_state(STATE_IDLE, 0.9)
			else:
				_move_toward_position(_home_position, 0.72)

	queue_redraw()

func _update_status_timers(delta: float) -> void:
	_attack_cooldown = maxf(0.0, _attack_cooldown - delta)
	_state_timer = maxf(0.0, _state_timer - delta)
	_slow_time = maxf(0.0, _slow_time - delta)
	_root_time = maxf(0.0, _root_time - delta)
	_mark_time = maxf(0.0, _mark_time - delta)
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

func _move_toward_position(target: Vector2, speed_multiplier: float) -> void:
	if _root_time > 0.0:
		velocity = Vector2.ZERO
		return
	var direction: Vector2 = target - global_position
	if direction.length_squared() <= 0.25:
		velocity = Vector2.ZERO
		return
	velocity = direction.normalized() * move_speed * speed_multiplier * _slow_multiplier
	move_and_slide()

func _begin_attack() -> void:
	var windup: float = _attack_windup_duration()
	_attack_windup_total = windup
	_set_state(STATE_WINDUP, windup)
	_attack_windup_total = windup
	_spawn_feedback("ward", _direction_to_player(), _telegraph_color(), "")

func _resolve_attack() -> void:
	var direction: Vector2 = _direction_to_player()
	var landed: bool = false
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
	return Vector2.DOWN

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
	var moving: bool = velocity.length_squared() > 9.0
	var bob: float = absf(sin(_visual_time * 9.0)) * 1.4 if moving else sin(_visual_time * 2.1) * 0.45
	_visual.position.y = -7.0 - bob
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
	if is_instance_valid(_visual):
		_visual.visible = false
	await get_tree().create_timer(0.16).timeout
	if is_instance_valid(self):
		queue_free()

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

func _spawn_feedback(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "") -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -9)
	scene.add_child(fx)
	fx.call("configure", kind_value, direction_value, color_value, text_value)

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
