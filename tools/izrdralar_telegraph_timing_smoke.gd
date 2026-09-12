extends Node

const ENEMY_SCRIPT := preload("res://src/npc/enemy_controller_production.gd")
const BOSS_SCRIPT := preload("res://src/npc/boss5_guardian_production.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	for atlas_index in range(6):
		await _check_enemy(atlas_index)
	await _check_boss()
	_finish()

func _check_enemy(atlas_index: int) -> void:
	var enemy: CharacterBody2D = ENEMY_SCRIPT.new()
	enemy.name = "TelegraphEnemy_%d" % atlas_index
	enemy.configure_production("telegraph_enemy_%d" % atlas_index, 30.0, 40.0, 3.0, 1, atlas_index)
	add_child(enemy)
	await get_tree().process_frame
	enemy.set_physics_process(false)

	var expected: float = float(enemy.call("_attack_windup_duration"))
	var before_count: int = get_child_count()
	enemy.call("_begin_attack")
	var after_count: int = get_child_count()
	if after_count != before_count + 1:
		failures.append("enemy %d did not spawn exactly one telegraph" % atlas_index)
	else:
		var fx: Node = get_child(after_count - 1)
		var actual: float = float(fx.get("_duration"))
		if absf(actual - expected) > 0.001:
			failures.append("enemy %d telegraph %.3f != windup %.3f" % [atlas_index, actual, expected])
		fx.queue_free()

	enemy.queue_free()
	await get_tree().process_frame

func _check_boss() -> void:
	var boss: CharacterBody2D = BOSS_SCRIPT.new()
	boss.name = "TelegraphBoss5"
	add_child(boss)
	await get_tree().process_frame
	boss.set_physics_process(false)

	var before_count: int = get_child_count()
	boss.call("_start_root_pulse")
	var expected: float = float(boss.get("_pulse_windup"))
	var after_count: int = get_child_count()
	if after_count != before_count + 1:
		failures.append("Boss 5 did not spawn exactly one root-pulse telegraph")
	else:
		var fx: Node = get_child(after_count - 1)
		var actual: float = float(fx.get("_duration"))
		if absf(actual - expected) > 0.001:
			failures.append("Boss 5 telegraph %.3f != root-pulse windup %.3f" % [actual, expected])
		fx.queue_free()

	boss.queue_free()
	await get_tree().process_frame

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_TELEGRAPH_TIMING_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_TELEGRAPH_TIMING_FAIL")
	get_tree().quit(1)
