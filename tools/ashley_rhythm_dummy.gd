extends Node2D

var health := 100.0
var rhythm_buff_left := 0.0
var rhythm_multiplier := 1.0
var stun_left := 0.0

func _process(delta: float) -> void:
	rhythm_buff_left = maxf(0.0, rhythm_buff_left - delta)
	stun_left = maxf(0.0, stun_left - delta)
	if rhythm_buff_left <= 0.0:
		rhythm_multiplier = 1.0

func apply_rhythm_cadence(duration: float, multiplier: float) -> void:
	rhythm_buff_left = maxf(rhythm_buff_left, duration)
	rhythm_multiplier = maxf(1.0, multiplier)

func take_damage(amount: float) -> void:
	health = maxf(0.0, health - maxf(0.0, amount))

func apply_stun(duration: float) -> void:
	stun_left = maxf(stun_left, duration)
