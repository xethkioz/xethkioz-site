extends Node2D

var health := 100.0
var stun_left := 0.0
var burn_left := 0.0
var chain_hits := 0
var last_chain_damage := 0.0

func take_damage(amount: float) -> void:
	health = maxf(0.0, health - amount)

func apply_stun(duration: float) -> void:
	stun_left = maxf(stun_left, duration)

func apply_burn(duration: float) -> void:
	burn_left = maxf(burn_left, duration)

func apply_chain_hit(amount: float) -> void:
	chain_hits += 1
	last_chain_damage = amount
	take_damage(amount)

func reset_status() -> void:
	health = 100.0
	stun_left = 0.0
	burn_left = 0.0
	chain_hits = 0
	last_chain_damage = 0.0
