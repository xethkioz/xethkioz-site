extends CharacterBody2D

@export var move_speed := 118.0
@export var acceleration := 920.0
@export var deceleration := 1280.0
@export var turn_acceleration := 1560.0
@export var dash_speed := 290.0
@export var dash_duration := 0.14
@export var dash_cooldown := 0.60
@export var max_health := 100.0
@export var max_mana := 80.0
@export var mana_regen_per_second := 5.0
@export var attack_damage := 22.0
@export var interaction_range := 52.0

var health := 100.0
var mana := 80.0
var facing := Vector2.DOWN
var _dash_time_left := 0.0
var _dash_cooldown_left := 0.0
var _attack_cooldown_left := 0.0
var _guard_time_left := 0.0
var _ability_cooldowns := {"Q": 0.0, "E": 0.0, "R": 0.0, "F": 0.0}

func _ready() -> void:
	add_to_group("player")
	_ensure_core_inputs()
	_ensure_ability_inputs()
	health = max_health
	mana = max_mana
	queue_redraw()
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_mana_changed.emit(mana, max_mana)

func _ensure_core_inputs() -> void:
	var bindings := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"dash": [KEY_SHIFT],
		"attack": [KEY_J],
		"interact": [KEY_C]
	}
	for action in bindings.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		if not InputMap.action_get_events(action).is_empty():
			continue
		for keycode in bindings[action]:
			var event := InputEventKey.new()
			event.physical_keycode = int(keycode)
			InputMap.action_add_event(action, event)

func _ensure_ability_inputs() -> void:
	var bindings := {"ability_q": KEY_Q, "ability_e": KEY_E, "ability_r": KEY_R, "ability_f": KEY_F}
	for action in bindings.keys():
		if InputMap.has_action(action):
			continue
		InputMap.add_action(action)
		var event := InputEventKey.new()
		event.physical_keycode = int(bindings[action])
		InputMap.action_add_event(action, event)

func _physics_process(delta: float) -> void:
	_dash_time_left = maxf(0.0, _dash_time_left - delta)
	_dash_cooldown_left = maxf(0.0, _dash_cooldown_left - delta)
	_attack_cooldown_left = maxf(0.0, _attack_cooldown_left - delta)
	_guard_time_left = maxf(0.0, _guard_time_left - delta)
	for slot in _ability_cooldowns.keys():
		_ability_cooldowns[slot] = maxf(0.0, float(_ability_cooldowns[slot]) - delta)
	_regenerate_mana(delta)

	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if input_vector.length_squared() > 0.01:
		facing = input_vector.normalized()
	if Input.is_action_just_pressed("dash") and _dash_cooldown_left <= 0.0:
		var duration_bonus := 1.18 if GameState.prism_step_unlocked else 1.0
		_dash_time_left = dash_duration * duration_bonus
		_dash_cooldown_left = dash_cooldown
	var current_dash_speed := dash_speed * (1.28 if GameState.prism_step_unlocked else 1.0)
	if _dash_time_left > 0.0:
		velocity = facing * current_dash_speed
	else:
		_apply_ground_movement(input_vector, delta)
	move_and_slide()

	if Input.is_action_just_pressed("attack") and _attack_cooldown_left <= 0.0:
		_attack_cooldown_left = 0.30
		_perform_melee_attack()
	if Input.is_action_just_pressed("ability_q"):
		_use_ability("Q")
	if Input.is_action_just_pressed("ability_e"):
		_use_ability("E")
	if Input.is_action_just_pressed("ability_r"):
		_use_ability("R")
	if Input.is_action_just_pressed("ability_f"):
		_use_ability("F")
	if Input.is_action_just_pressed("interact"):
		_interact_with_nearest()
	queue_redraw()

func _apply_ground_movement(input_vector: Vector2, delta: float) -> void:
	if input_vector.length_squared() <= 0.0001:
		velocity = velocity.move_toward(Vector2.ZERO, deceleration * delta)
		return
	var target_velocity: Vector2 = input_vector * move_speed
	var response: float = acceleration
	if velocity.length_squared() > 1.0:
		var current_direction: Vector2 = velocity.normalized()
		var target_direction: Vector2 = input_vector.normalized()
		if current_direction.dot(target_direction) < 0.70:
			response = turn_acceleration
	velocity = velocity.move_toward(target_velocity, response * delta)

func _regenerate_mana(delta: float) -> void:
	if mana >= max_mana:
		return
	var previous := mana
	mana = minf(max_mana, mana + mana_regen_per_second * delta)
	if absf(mana - previous) >= 0.01:
		EventBus.player_mana_changed.emit(mana, max_mana)

func _use_ability(slot: String) -> void:
	if float(_ability_cooldowns.get(slot, 0.0)) > 0.0:
		EventBus.toast_requested.emit("%s en recarga · %.1fs" % [slot, float(_ability_cooldowns[slot])])
		return
	if slot == "F":
		_use_brote_vivo()
		return
	if GameState.selected_mentor.is_empty():
		_use_apprentice_ability(slot)
		return
	match GameState.selected_mentor:
		"ashley":
			_use_ashley_ability(slot)
		"fermin":
			_use_fermin_ability(slot)
		"isabella":
			_use_isabella_ability(slot)
		"gael":
			_use_gael_ability(slot)
		_:
			_use_apprentice_ability(slot)

func _spend_and_start(slot: String, cost: float, cooldown: float) -> bool:
	if mana < cost:
		EventBus.toast_requested.emit("Mana insuficiente · %d requerido" % roundi(cost))
		return false
	mana -= cost
	_ability_cooldowns[slot] = cooldown
	EventBus.player_mana_changed.emit(mana, max_mana)
	return true

func _use_apprentice_ability(slot: String) -> void:
	match slot:
		"Q":
			if _spend_and_start(slot, 8.0, 3.5):
				_damage_area(global_position + facing * 28.0, 30.0, attack_damage * 1.05)
				EventBus.toast_requested.emit("Corte Prismático")
		"E":
			if _spend_and_start(slot, 10.0, 8.0):
				_guard_time_left = 0.8
				EventBus.toast_requested.emit("Pulso de Guardia")
		"R":
			if _spend_and_start(slot, 15.0, 10.0):
				_damage_area(global_position, 54.0, attack_damage * 0.9)
				EventBus.toast_requested.emit("Destello de Fisura")

func _use_ashley_ability(slot: String) -> void:
	match slot:
		"Q":
			if _spend_and_start(slot, 12.0, 5.0):
				var targets := _damage_area(global_position + facing * 34.0, 34.0, attack_damage)
				_apply_slow(targets, 0.78, 1.5)
				EventBus.toast_requested.emit("Ashley · Onda")
		"E":
			if _spend_and_start(slot, 18.0, 12.0):
				_heal(max_health * 0.08)
				EventBus.toast_requested.emit("Ashley · Melodía")
		"R":
			if _spend_and_start(slot, 24.0, 16.0):
				var targets := _damage_area(global_position, 68.0, attack_damage * 1.5)
				_apply_slow(targets, 0.70, 3.0)
				EventBus.toast_requested.emit("Ashley · Resonancia")

func _use_fermin_ability(slot: String) -> void:
	match slot:
		"Q":
			if _spend_and_start(slot, 12.0, 5.0):
				_damage_area(global_position + facing * 30.0, 38.0, attack_damage * 1.4)
				EventBus.toast_requested.emit("Fermín · Barrido")
		"E":
			if _spend_and_start(slot, 16.0, 10.0):
				_guard_time_left = 1.0
				EventBus.toast_requested.emit("Fermín · Guardia")
		"R":
			if _spend_and_start(slot, 24.0, 14.0):
				move_and_collide(facing * 28.0)
				_damage_area(global_position + facing * 30.0, 42.0, attack_damage * 1.8)
				EventBus.toast_requested.emit("Fermín · Embestida")

func _use_isabella_ability(slot: String) -> void:
	match slot:
		"Q":
			if _spend_and_start(slot, 12.0, 5.0):
				var targets := _damage_area(global_position + facing * 34.0, 32.0, attack_damage * 1.1)
				for target in targets:
					if is_instance_valid(target) and target.has_method("apply_mark"):
						target.apply_mark(8.0)
				EventBus.toast_requested.emit("Isabella · Marca")
		"E":
			if _spend_and_start(slot, 18.0, 12.0):
				var targets := _damage_area(global_position + facing * 42.0, 38.0, attack_damage)
				for target in targets:
					if is_instance_valid(target) and target.has_method("apply_root"):
						target.apply_root(1.5)
				EventBus.toast_requested.emit("Isabella · Runa")
		"R":
			if _spend_and_start(slot, 26.0, 16.0):
				var targets := _damage_area(global_position, 64.0, attack_damage * 1.6)
				for target in targets:
					if is_instance_valid(target) and target.has_method("consume_mark") and target.consume_mark():
						target.take_damage(attack_damage * 0.8)
				EventBus.toast_requested.emit("Isabella · Detonación")

func _use_gael_ability(slot: String) -> void:
	match slot:
		"Q":
			if _spend_and_start(slot, 10.0, 4.0):
				_damage_line(attack_damage * 1.2, 3, 28.0, 18.0)
				EventBus.toast_requested.emit("Gael · Disparo")
		"E":
			if _spend_and_start(slot, 16.0, 10.0):
				var targets := _damage_area(global_position + facing * 48.0, 34.0, attack_damage * 0.8)
				_apply_slow(targets, 0.60, 3.0)
				EventBus.toast_requested.emit("Gael · Trampa")
		"R":
			if _spend_and_start(slot, 24.0, 14.0):
				_damage_line(attack_damage * 2.0, 4, 34.0, 20.0)
				EventBus.toast_requested.emit("Gael · Disparo cargado")

func _use_brote_vivo() -> void:
	var pieces: int = GameState.set_piece_count("brote_vivo")
	if pieces < 4:
		EventBus.toast_requested.emit("F bloqueada · Brote Vivo %d/4" % pieces)
		return
	if not _spend_and_start("F", 20.0, 22.0):
		return
	_heal(max_health * 0.10)
	_damage_area(global_position, 52.0, attack_damage)
	EventBus.toast_requested.emit("Brote Vivo · Renacer Prismático")

func _damage_line(amount: float, steps: int, spacing: float, radius: float) -> void:
	var already_hit: Array = []
	for index in range(1, steps + 1):
		var targets := _targets_in_area(global_position + facing * spacing * float(index), radius)
		for target in targets:
			if already_hit.has(target):
				continue
			already_hit.append(target)
			if is_instance_valid(target) and target.has_method("take_damage"):
				target.take_damage(amount)

func _damage_area(center: Vector2, radius: float, amount: float) -> Array:
	var targets := _targets_in_area(center, radius)
	for target in targets:
		if is_instance_valid(target) and target.has_method("take_damage"):
			target.take_damage(amount)
	return targets

func _targets_in_area(center: Vector2, radius: float) -> Array:
	var shape := CircleShape2D.new()
	shape.radius = radius
	var query := PhysicsShapeQueryParameters2D.new()
	query.shape = shape
	query.transform = Transform2D(0.0, center)
	query.collision_mask = 2
	query.collide_with_areas = false
	query.collide_with_bodies = true
	var hits := get_world_2d().direct_space_state.intersect_shape(query, 24)
	var targets: Array = []
	for hit in hits:
		var collider = hit.get("collider")
		if collider != null and not targets.has(collider):
			targets.append(collider)
	return targets

func _apply_slow(targets: Array, multiplier: float, duration: float) -> void:
	for target in targets:
		if is_instance_valid(target) and target.has_method("apply_slow"):
			target.apply_slow(multiplier, duration)

func _perform_melee_attack() -> void:
	_damage_area(global_position + facing * 28.0, 22.0, attack_damage)

func _interact_with_nearest() -> void:
	var nearest: Node2D = null
	var nearest_distance := interaction_range
	for candidate in get_tree().get_nodes_in_group("interactable"):
		if candidate is not Node2D:
			continue
		var distance := global_position.distance_to(candidate.global_position)
		if distance <= nearest_distance:
			nearest = candidate
			nearest_distance = distance
	if nearest != null and nearest.has_method("interact"):
		nearest.interact(self)

func _heal(amount: float) -> void:
	health = minf(max_health, health + maxf(0.0, amount))
	EventBus.player_health_changed.emit(health, max_health)

func take_damage(amount: float) -> void:
	var applied := amount * (0.4 if _guard_time_left > 0.0 else 1.0)
	health = maxf(0.0, health - applied)
	EventBus.player_health_changed.emit(health, max_health)
	if health <= 0.0:
		health = max_health
		mana = max_mana
		global_position = Vector2(190, 210)
		EventBus.player_health_changed.emit(health, max_health)
		EventBus.player_mana_changed.emit(mana, max_mana)
		EventBus.toast_requested.emit("El Prisma te devuelve al último punto seguro")

func heal_full() -> void:
	health = max_health
	EventBus.player_health_changed.emit(health, max_health)

func _draw() -> void:
	draw_circle(Vector2.ZERO, 9.0, Color("d9e7ff"))
	draw_circle(Vector2(0, -8), 5.0, Color("f1c7a5"))
	draw_line(Vector2.ZERO, facing * 16.0, Color("ff8c42"), 2.0)
	if _guard_time_left > 0.0:
		draw_arc(Vector2.ZERO, 17.0, 0.0, TAU, 24, Color("6ed4e8"), 2.0)
	if _dash_time_left > 0.0:
		var dash_color := Color("d8ceff") if GameState.prism_step_unlocked else Color("9d7bff")
		draw_arc(Vector2.ZERO, 15.0, 0.0, TAU, 24, dash_color, 2.0)
		if GameState.prism_step_unlocked:
			draw_line(-facing * 8.0, -facing * 24.0, Color(0.55,0.36,0.96,0.65), 3.0)
