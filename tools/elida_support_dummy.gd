extends Node2D

var max_health := 100.0
var health := 50.0
var guard_left := 0.0
var guard_multiplier := 1.0
var status_immunity_left := 0.0

func _process(delta: float) -> void:
	guard_left = maxf(0.0, guard_left - delta)
	status_immunity_left = maxf(0.0, status_immunity_left - delta)
	if guard_left <= 0.0:
		guard_multiplier = 1.0

func heal(amount: float) -> void:
	health = minf(max_health, health + maxf(0.0, amount))

func apply_external_guard(duration: float, multiplier: float) -> void:
	guard_left = maxf(guard_left, duration)
	guard_multiplier = clampf(multiplier, 0.0, 1.0)

func apply_status_immunity(duration: float) -> void:
	status_immunity_left = maxf(status_immunity_left, duration)
