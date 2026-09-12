extends Node2D

var health := 100.0
var stun_left := 0.0
var last_knockback_strength := 0.0
var last_knockback_direction := Vector2.ZERO

func _process(delta: float) -> void:
	stun_left = maxf(0.0, stun_left - delta)

func take_damage(amount: float) -> void:
	health = maxf(0.0, health - maxf(0.0, amount))

func apply_stun(duration: float) -> void:
	stun_left = maxf(stun_left, duration)

func apply_knockback(direction: Vector2, strength: float) -> void:
	last_knockback_direction = direction.normalized() if direction.length_squared() > 0.001 else Vector2.RIGHT
	last_knockback_strength = maxf(0.0, strength)
	global_position += last_knockback_direction * minf(last_knockback_strength * 0.05, 6.0)
