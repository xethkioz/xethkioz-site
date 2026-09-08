extends CharacterBody2D

@export var move_speed := 118.0
@export var dash_speed := 290.0
@export var dash_duration := 0.14
@export var dash_cooldown := 0.60
@export var max_health := 100.0
@export var attack_damage := 22.0
@export var interaction_range := 52.0

var health := 100.0
var facing := Vector2.DOWN
var _dash_time_left := 0.0
var _dash_cooldown_left := 0.0
var _attack_cooldown_left := 0.0

func _ready() -> void:
	add_to_group("player")
	health = max_health
	queue_redraw()
	EventBus.player_health_changed.emit(health, max_health)

func _physics_process(delta: float) -> void:
	_dash_time_left = maxf(0.0, _dash_time_left - delta)
	_dash_cooldown_left = maxf(0.0, _dash_cooldown_left - delta)
	_attack_cooldown_left = maxf(0.0, _attack_cooldown_left - delta)
	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if input_vector.length_squared() > 0.01:
		facing = input_vector.normalized()
	if Input.is_action_just_pressed("dash") and _dash_cooldown_left <= 0.0:
		_dash_time_left = dash_duration
		_dash_cooldown_left = dash_cooldown
	velocity = facing * dash_speed if _dash_time_left > 0.0 else input_vector * move_speed
	move_and_slide()
	if Input.is_action_just_pressed("attack") and _attack_cooldown_left <= 0.0:
		_attack_cooldown_left = 0.30
		_perform_melee_attack()
	if Input.is_action_just_pressed("interact"):
		_interact_with_nearest()
	queue_redraw()

func _perform_melee_attack() -> void:
	var shape := CircleShape2D.new()
	shape.radius = 22.0
	var query := PhysicsShapeQueryParameters2D.new()
	query.shape = shape
	query.transform = Transform2D(0.0, global_position + facing * 28.0)
	query.collision_mask = 2
	query.collide_with_areas = false
	query.collide_with_bodies = true
	var hits := get_world_2d().direct_space_state.intersect_shape(query, 12)
	for hit in hits:
		var collider = hit.get("collider")
		if collider != null and collider.has_method("take_damage"):
			collider.take_damage(attack_damage)

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

func take_damage(amount: float) -> void:
	health = maxf(0.0, health - amount)
	EventBus.player_health_changed.emit(health, max_health)
	if health <= 0.0:
		health = max_health
		global_position = Vector2(190, 210)
		EventBus.player_health_changed.emit(health, max_health)
		EventBus.toast_requested.emit("El Prisma te devuelve al último punto seguro")

func heal_full() -> void:
	health = max_health
	EventBus.player_health_changed.emit(health, max_health)

func _draw() -> void:
	draw_circle(Vector2.ZERO, 9.0, Color("d9e7ff"))
	draw_circle(Vector2(0, -8), 5.0, Color("f1c7a5"))
	draw_line(Vector2.ZERO, facing * 16.0, Color("ff8c42"), 2.0)
	if _dash_time_left > 0.0:
		draw_arc(Vector2.ZERO, 15.0, 0.0, TAU, 24, Color("9d7bff"), 2.0)
