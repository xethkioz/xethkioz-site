extends CharacterBody2D

@export var enemy_id := "boss5_guardian_bosque_velado"
@export var max_health := 360.0
@export var move_speed := 42.0
@export var aggro_range := 260.0
@export var attack_range := 30.0
@export var attack_damage := 13.0
@export var xp_reward := 260

var health := 360.0
var phase := 1
var core_exposed := true
var _player: Node2D
var _attack_cooldown := 0.0
var _pulse_cooldown := 2.8
var _core_timer := 0.0
var _defeated := false

func _ready() -> void:
	add_to_group("enemies")
	add_to_group("bosses")
	health = max_health
	_player = get_tree().get_first_node_in_group("player") as Node2D
	EventBus.boss_phase_changed.emit(enemy_id, phase)
	queue_redraw()

func _physics_process(delta: float) -> void:
	if _defeated:
		return
	_attack_cooldown = maxf(0.0, _attack_cooldown - delta)
	_pulse_cooldown = maxf(0.0, _pulse_cooldown - delta)
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		return
	_update_phase()
	if phase == 3:
		_update_core_cycle(delta)
	var to_player := _player.global_position - global_position
	var distance := to_player.length()
	if distance <= aggro_range and distance > attack_range:
		var speed_bonus := 1.22 if phase >= 2 else 1.0
		velocity = to_player.normalized() * move_speed * speed_bonus
		move_and_slide()
	else:
		velocity = Vector2.ZERO
	if distance <= attack_range and _attack_cooldown <= 0.0:
		_attack_cooldown = 1.05 if phase == 1 else 0.82
		if _player.has_method("take_damage"):
			_player.take_damage(attack_damage + float(phase - 1) * 2.0)
	if phase >= 2 and _pulse_cooldown <= 0.0:
		_pulse_cooldown = 3.2 if phase == 2 else 2.5
		_root_pulse(distance)
	queue_redraw()

func _update_phase() -> void:
	var ratio := health / max_health
	var next_phase := 1
	if ratio <= 0.33:
		next_phase = 3
	elif ratio <= 0.66:
		next_phase = 2
	if next_phase != phase:
		phase = next_phase
		if phase == 3:
			core_exposed = true
			_core_timer = 2.5
		EventBus.boss_phase_changed.emit(enemy_id, phase)
		var text := "Fase II · las raíces convierten el terreno en un arma" if phase == 2 else "Fase III · atacá solamente cuando el núcleo violeta quede expuesto"
		EventBus.toast_requested.emit(text)

func _update_core_cycle(delta: float) -> void:
	_core_timer -= delta
	if _core_timer > 0.0:
		return
	core_exposed = not core_exposed
	_core_timer = 2.4 if core_exposed else 1.8
	EventBus.toast_requested.emit("Núcleo expuesto" if core_exposed else "El Guardián protege su núcleo")

func _root_pulse(distance_to_player: float) -> void:
	EventBus.toast_requested.emit("Raíces prismáticas · salí del círculo")
	if distance_to_player <= 74.0 and is_instance_valid(_player) and _player.has_method("take_damage"):
		_player.take_damage(9.0 if phase == 2 else 12.0)

func take_damage(amount: float) -> void:
	if _defeated:
		return
	if phase == 3 and not core_exposed:
		EventBus.toast_requested.emit("El núcleo está protegido")
		return
	health = maxf(0.0, health - amount)
	_update_phase()
	queue_redraw()
	if health <= 0.0:
		_defeated = true
		EventBus.enemy_defeated.emit(enemy_id, xp_reward, global_position)
		GameState.add_crystals(20)
		GameState.add_pet_bond(8)
		EventBus.toast_requested.emit("Guardián del Bosque Velado purificado")
		queue_free()

func _draw() -> void:
	var ratio := health / max_health if max_health > 0.0 else 0.0
	var body_color := Color("375c45") if phase == 1 else Color("48643f")
	if phase == 3:
		body_color = Color("5a3f63")
	draw_circle(Vector2.ZERO, 20.0, body_color)
	draw_arc(Vector2.ZERO, 25.0, 0.0, TAU, 32, Color("8b5cf6"), 2.0)
	if phase == 3:
		draw_circle(Vector2.ZERO, 7.0, Color("d8ceff") if core_exposed else Color("2c2632"))
	if phase >= 2:
		draw_arc(Vector2.ZERO, 74.0, 0.0, TAU, 40, Color(0.55,0.36,0.96,0.24), 2.0)
	draw_rect(Rect2(-28,-34,56,4), Color("1b1820"))
	draw_rect(Rect2(-28,-34,56 * ratio,4), Color("ff8c42"))
