extends Node2D

var health: float = 100.0
var hit_count: int = 0
var last_damage: float = 0.0

func take_damage(amount: float) -> void:
	if amount <= 0.0:
		return
	hit_count += 1
	last_damage = amount
	health = maxf(0.0, health - amount)

func reset_status() -> void:
	health = 100.0
	hit_count = 0
	last_damage = 0.0
