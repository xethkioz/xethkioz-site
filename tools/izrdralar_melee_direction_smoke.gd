extends Node

const PLAYER_SCRIPT := preload("res://src/player/player_controller_production_pass02.gd")

class DamageTarget:
	extends CharacterBody2D
	var damage_taken: float = 0.0
	func take_damage(amount: float) -> void:
		damage_taken += amount

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	var cases: Array = [
		{"name":"down", "direction":Vector2.DOWN},
		{"name":"down_left", "direction":Vector2(-1, 1).normalized()},
		{"name":"left", "direction":Vector2.LEFT},
		{"name":"up_left", "direction":Vector2(-1, -1).normalized()},
		{"name":"up", "direction":Vector2.UP},
		{"name":"up_right", "direction":Vector2(1, -1).normalized()},
		{"name":"right", "direction":Vector2.RIGHT},
		{"name":"down_right", "direction":Vector2(1, 1).normalized()}
	]
	for case_value in cases:
		await _run_case(case_value)
	await _validate_action_commitment()
	_finish()

func _run_case(case_data: Dictionary) -> void:
	var direction: Vector2 = case_data["direction"]
	var player: CharacterBody2D = PLAYER_SCRIPT.new()
	player.name = "MeleeSmokePlayer_%s" % case_data["name"]
	player.position = Vector2(320, 180)
	player.set("facing", direction)
	add_child(player)

	var target := DamageTarget.new()
	target.name = "MeleeSmokeTarget_%s" % case_data["name"]
	target.collision_layer = 2
	target.collision_mask = 0
	target.position = player.position + direction * 29.0
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 8.0
	collision.shape = shape
	target.add_child(collision)
	add_child(target)

	await get_tree().physics_frame
	await get_tree().physics_frame
	var start_position: Vector2 = player.position
	player.call("_perform_melee_attack")
	await get_tree().physics_frame

	if target.damage_taken <= 0.0:
		failures.append("%s melee did not damage target" % case_data["name"])
	var displacement: Vector2 = player.position - start_position
	if displacement.dot(direction) < 2.0:
		failures.append("%s melee lunge did not advance along facing" % case_data["name"])
	if displacement.length() > 3.2:
		failures.append("%s melee lunge exceeded micro-lunge budget: %.2f" % [case_data["name"], displacement.length()])

	player.queue_free()
	target.queue_free()
	await get_tree().physics_frame

func _validate_action_commitment() -> void:
	var player: CharacterBody2D = PLAYER_SCRIPT.new()
	player.name = "ActionCommitmentPlayer"
	add_child(player)
	player.set_physics_process(false)
	await get_tree().process_frame
	var move_speed: float = float(player.get("move_speed"))

	player.velocity = Vector2.RIGHT * move_speed
	player.set("_attack_pose_left", 0.12)
	player.call("_apply_ground_movement", Vector2.RIGHT, 1.0 / 60.0)
	if player.velocity.length() > move_speed * 0.52 + 0.1:
		failures.append("attack commitment exceeded 52%% movement cap: %.2f" % player.velocity.length())

	player.velocity = Vector2.RIGHT * move_speed
	player.set("_attack_pose_left", 0.0)
	player.set("_cast_pose_left", 0.12)
	player.call("_apply_ground_movement", Vector2.RIGHT, 1.0 / 60.0)
	if player.velocity.length() > move_speed * 0.72 + 0.1:
		failures.append("cast commitment exceeded 72%% movement cap: %.2f" % player.velocity.length())

	player.queue_free()
	await get_tree().process_frame

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_MELEE_DIRECTION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_MELEE_DIRECTION_FAIL")
	get_tree().quit(1)
