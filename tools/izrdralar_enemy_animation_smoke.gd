extends Node

const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	GameState.reset_new_game()
	for species in range(6):
		await _check_species(species)
	_finish()

func _check_species(species: int) -> void:
	var enemy := CharacterBody2D.new()
	enemy.name = "AnimatedEnemy_%d" % species
	enemy.set_script(EnemyScript)
	add_child(enemy)
	await get_tree().process_frame
	enemy.call("configure_production", "animation_species_%d" % species, 50.0, 60.0 + species * 2.0, 8.0, 1, species)
	enemy.set_physics_process(false)

	var fallback := enemy.get_node_or_null("EnemyVisual") as Sprite2D
	var live := enemy.get_node_or_null("EnemyLiveVisual") as Node2D
	if fallback == null:
		failures.append("species %d missing fallback identity atlas" % species)
	elif fallback.visible:
		failures.append("species %d still renders legacy single-frame sprite" % species)
	if live == null:
		failures.append("species %d missing EnemyLiveVisual" % species)
		enemy.queue_free()
		await get_tree().process_frame
		return
	if live.get_script() == null or not str(live.get_script().resource_path).ends_with("enemy_live_visual.gd"):
		failures.append("species %d uses wrong live visual script" % species)
	if int(live.get("species_index")) != species:
		failures.append("species %d live renderer configured as %d" % [species, int(live.get("species_index"))])

	_set_and_check(enemy, live, "idle", Vector2.ZERO, "idle", species)
	_set_and_check(enemy, live, "chase", Vector2(55, 0), "move", species)
	_set_and_check(enemy, live, "windup", Vector2.ZERO, "windup", species)
	enemy.set("_attack_impact_left", 0.10)
	_set_and_check(enemy, live, "recover", Vector2.ZERO, "attack", species)
	enemy.set("_attack_impact_left", 0.0)
	_set_and_check(enemy, live, "recover", Vector2.ZERO, "recover", species)
	enemy.set("_stagger_left", 0.10)
	_set_and_check(enemy, live, "chase", Vector2(-35, 0), "hurt", species)
	enemy.set("_stagger_left", 0.0)
	live.call("flash_hurt", 0.13)
	if float(live.get("_hurt_left")) <= 0.0:
		failures.append("species %d live renderer did not enter hurt flash state" % species)

	enemy.queue_free()
	await get_tree().process_frame

func _set_and_check(enemy: CharacterBody2D, live: Node2D, ai_state: String, velocity_value: Vector2, expected_visual_state: String, species: int) -> void:
	enemy.set("_ai_state", ai_state)
	enemy.velocity = velocity_value
	enemy.call("_update_visual_motion", 0.016)
	if str(live.get("action_state")) != expected_visual_state:
		failures.append("species %d state %s rendered as %s instead of %s" % [species, ai_state, str(live.get("action_state")), expected_visual_state])
	if velocity_value.length_squared() > 0.1 and float(live.get("speed_ratio")) <= 0.0:
		failures.append("species %d movement state did not receive speed ratio" % species)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_ENEMY_ANIMATION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_ENEMY_ANIMATION_FAIL")
	get_tree().quit(1)