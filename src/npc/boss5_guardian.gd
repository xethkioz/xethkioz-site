extends CharacterBody2D

@export var enemy_id := "boss5_guardian_bosque_velado"
@export var max_health := 360.0
@export var move_speed := 42.0
@export var aggro_range := 260.0
@export var attack_range := 30.0
@export var attack_damage := 13.0
@export var xp_reward := 260

const ROOT_PULSE_RADIUS := 74.0
const ROOT_PULSE_WINDUP := 0.85

var health := 360.0
var phase := 1
var core_exposed := true
var _player: Node2D
var _attack_cooldown := 0.0
var _pulse_cooldown := 2.8
var _core_timer := 0.0
var _defeated := false
var _purgable := false
var _purged := false
var _pulse_pending := false
var _pulse_windup := 0.0
var _slow_multiplier := 1.0
var _slow_time := 0.0
var _root_time := 0.0
var _mark_time := 0.0

func _ready() -> void:
	add_to_group("enemies")
	add_to_group("bosses")
	health = max_health
	_player = get_tree().get_first_node_in_group("player") as Node2D
	EventBus.boss_phase_changed.emit(enemy_id, phase)
	queue_redraw()

func _physics_process(delta: float) -> void:
	if _defeated:
		velocity = Vector2.ZERO
		return
	_attack_cooldown = maxf(0.0, _attack_cooldown - delta)
	_pulse_cooldown = maxf(0.0, _pulse_cooldown - delta)
	_slow_time = maxf(0.0, _slow_time - delta)
	_root_time = maxf(0.0, _root_time - delta)
	_mark_time = maxf(0.0, _mark_time - delta)
	if _slow_time <= 0.0:
		_slow_multiplier = 1.0
	if _pulse_pending:
		_pulse_windup = maxf(0.0, _pulse_windup - delta)
		if _pulse_windup <= 0.0:
			_resolve_root_pulse()
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		return
	_update_phase()
	if phase == 3:
		_update_core_cycle(delta)
	var to_player := _player.global_position - global_position
	var distance := to_player.length()
	if _root_time <= 0.0 and distance <= aggro_range and distance > attack_range:
		var speed_bonus := 1.22 if phase >= 2 else 1.0
		velocity = to_player.normalized() * move_speed * speed_bonus * _slow_multiplier
		move_and_slide()
	else:
		velocity = Vector2.ZERO
	if distance <= attack_range and _attack_cooldown <= 0.0:
		_attack_cooldown = 1.05 if phase == 1 else 0.82
		if _player.has_method("take_damage"):
			_player.take_damage(attack_damage + float(phase - 1) * 2.0)
	if phase >= 2 and not _pulse_pending and _pulse_cooldown <= 0.0:
		_pulse_cooldown = 3.2 if phase == 2 else 2.5
		_start_root_pulse()
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

func _start_root_pulse() -> void:
	_pulse_pending = true
	_pulse_windup = ROOT_PULSE_WINDUP
	EventBus.toast_requested.emit("Raíces prismáticas · salí del círculo")

func _resolve_root_pulse() -> void:
	_pulse_pending = false
	if not is_instance_valid(_player):
		return
	if global_position.distance_to(_player.global_position) <= ROOT_PULSE_RADIUS and _player.has_method("take_damage"):
		_player.take_damage(9.0 if phase == 2 else 12.0)
		EventBus.toast_requested.emit("Impacto de raíces · evitá el próximo pulso")

func pulse_windup_ratio() -> float:
	if not _pulse_pending:
		return 0.0
	return 1.0 - clampf(_pulse_windup / ROOT_PULSE_WINDUP, 0.0, 1.0)

func take_damage(amount: float) -> void:
	if _defeated or _purged:
		if _purgable:
			EventBus.toast_requested.emit("El Guardián ya no pelea · ESTABILIZALO")
		return
	if phase == 3 and not core_exposed:
		EventBus.toast_requested.emit("El núcleo está protegido")
		return
	health = maxf(0.0, health - amount)
	_update_phase()
	queue_redraw()
	if health <= 0.0:
		_enter_purgable_state()

func _enter_purgable_state() -> void:
	if _purgable or _purged:
		return
	_defeated = true
	_purgable = true
	_pulse_pending = false
	velocity = Vector2.ZERO
	add_to_group("interactable")
	GameState.set_world_flag("boss5_physical_defeated", true)
	EventBus.toast_requested.emit("El Guardián se arrodilla · no lo ataques · ESTABILIZAR")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if not _purgable or _purged:
		return
	_purgable = false
	_purged = true
	remove_from_group("interactable")
	GameState.set_world_flag("boss5_purged", true)
	EventBus.enemy_defeated.emit(enemy_id, xp_reward, global_position)
	GameState.add_crystals(20)
	GameState.add_pet_bond(8)
	EventBus.toast_requested.emit("Guardián del Bosque Velado estabilizado")
	queue_redraw()
	await get_tree().create_timer(0.75).timeout
	if is_instance_valid(self):
		queue_free()

func interaction_label() -> String:
	return "ESTABILIZAR" if _purgable else "Guardián"

func is_purgable() -> bool:
	return _purgable

func is_purged() -> bool:
	return _purged

func apply_slow(multiplier: float, duration: float) -> void:
	_slow_multiplier = clampf(multiplier, 0.65, 1.0)
	_slow_time = maxf(_slow_time, duration * 0.65)

func apply_root(duration: float) -> void:
	_root_time = maxf(_root_time, minf(0.75, duration * 0.45))

func apply_mark(duration: float) -> void:
	_mark_time = maxf(_mark_time, duration)
	queue_redraw()

func consume_mark() -> bool:
	if _mark_time <= 0.0:
		return false
	_mark_time = 0.0
	queue_redraw()
	return true

func _draw() -> void:
	var ratio: float = health / max_health if max_health > 0.0 else 0.0
	var body_color := Color("375c45") if phase == 1 else Color("48643f")
	if phase == 3:
		body_color = Color("5a3f63")
	if _purgable:
		body_color = Color("6a6d55")
	draw_circle(Vector2.ZERO, 20.0, body_color)
	draw_arc(Vector2.ZERO, 25.0, 0.0, TAU, 32, Color("8b5cf6"), 2.0)
	if phase == 3:
		draw_circle(Vector2.ZERO, 7.0, Color("d8ceff") if core_exposed else Color("2c2632"))
	if _pulse_pending:
		var pulse_ratio := pulse_windup_ratio()
		draw_arc(Vector2.ZERO, ROOT_PULSE_RADIUS, 0.0, TAU, 48, Color(0.9, 0.38 + pulse_ratio * 0.25, 1.0, 0.35 + pulse_ratio * 0.45), 3.0)
	if _mark_time > 0.0:
		draw_arc(Vector2.ZERO, 30.0, 0.0, TAU, 24, Color("c686ff"), 2.0)
	if _purgable:
		draw_arc(Vector2.ZERO, 34.0, 0.0, TAU, 32, Color("d8ceff"), 3.0)
	var font := ThemeDB.fallback_font
	draw_rect(Rect2(-28,-34,56,4), Color("1b1820"))
	draw_rect(Rect2(-28,-34,56 * ratio,4), Color("ff8c42"))
	if _purgable:
		draw_string(font, Vector2(-42,-44), "ESTABILIZAR", HORIZONTAL_ALIGNMENT_CENTER, 84, 8, Color("d8ceff"))
