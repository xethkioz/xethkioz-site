extends CharacterBody2D

@export var enemy_id := "brote_goblin"
@export var max_health := 42.0
@export var move_speed := 52.0
@export var aggro_range := 145.0
@export var attack_range := 22.0
@export var attack_damage := 8.0
@export var xp_reward := 24

var health := 42.0
var _attack_cooldown := 0.0
var _player: Node2D

func _ready() -> void:
	add_to_group("enemies")
	health = max_health
	_player = get_tree().get_first_node_in_group("player") as Node2D
	queue_redraw()

func _physics_process(delta: float) -> void:
	_attack_cooldown = maxf(0.0, _attack_cooldown - delta)
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		return
	var delta_to_player := _player.global_position - global_position
	var distance := delta_to_player.length()
	if distance <= aggro_range and distance > attack_range:
		velocity = delta_to_player.normalized() * move_speed
		move_and_slide()
	else:
		velocity = Vector2.ZERO
	if distance <= attack_range and _attack_cooldown <= 0.0:
		_attack_cooldown = 1.0
		if _player.has_method("take_damage"):
			_player.take_damage(attack_damage)

func take_damage(amount: float) -> void:
	health = maxf(0.0, health - amount)
	queue_redraw()
	if health <= 0.0:
		EventBus.enemy_defeated.emit(enemy_id, xp_reward, global_position)
		GameState.add_crystals(2)
		queue_free()

func _draw() -> void:
	var health_ratio := health / max_health if max_health > 0.0 else 0.0
	draw_circle(Vector2.ZERO, 10.0, Color("5f8f55"))
	draw_circle(Vector2(3, -2), 2.0, Color("d8ff9f"))
	draw_rect(Rect2(-12, -17, 24, 3), Color("241f22"))
	draw_rect(Rect2(-12, -17, 24 * health_ratio, 3), Color("ff6b6b"))
