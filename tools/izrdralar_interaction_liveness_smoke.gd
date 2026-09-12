extends Node

const PlayerScript := preload("res://src/player/player_controller_production_pass02.gd")
const GatherableScript := preload("res://src/world/gatherable_production.gd")
const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	InventoryService.reset()

	var player := CharacterBody2D.new()
	player.name = "LivenessPlayer"
	player.set_script(PlayerScript)
	add_child(player)
	await get_tree().process_frame
	player.set_physics_process(false)

	await _check_delayed_consumption(player)
	await _check_interrupted_consumption(player)
	await _check_physical_collection(player)
	await _check_full_stack_collection_guard(player)
	await _check_physical_enemy_defeat(player)

	if is_instance_valid(player):
		player.queue_free()
	await get_tree().process_frame
	InventoryService.reset()
	GameState.reset_new_game()
	SaveService.delete_save()
	_finish()

func _check_delayed_consumption(player: CharacterBody2D) -> void:
	InventoryService.reset()
	player.set("health", 40.0)
	player.set("mana", 30.0)
	if not InventoryService.add_item("manzana_bruma", 1):
		failures.append("could not seed Manzana de Bruma")
		return
	player.call("use_consumable", "manzana_bruma")
	await get_tree().create_timer(0.16).timeout
	if InventoryService.amount_of("manzana_bruma") != 1:
		failures.append("consumable removed before physical use moment")
	if absf(float(player.get("health")) - 40.0) > 0.01:
		failures.append("health changed before physical consumption moment")
	if player.get_node_or_null("ConsumableUseFeedback") == null:
		failures.append("consumable use did not create visible feedback node")
	await get_tree().create_timer(0.34).timeout
	if InventoryService.amount_of("manzana_bruma") != 0:
		failures.append("consumable was not removed at use moment")
	if float(player.get("health")) <= 40.0:
		failures.append("consumable did not restore health after use moment")
	if float(player.get("mana")) <= 30.0:
		failures.append("Manzana de Bruma did not restore authored mana amount")
	await get_tree().create_timer(0.32).timeout

func _check_interrupted_consumption(player: CharacterBody2D) -> void:
	InventoryService.reset()
	player.set("health", 60.0)
	player.set("mana", 40.0)
	InventoryService.add_item("racion_bosque", 1)
	player.call("use_consumable", "racion_bosque")
	await get_tree().create_timer(0.12).timeout
	player.call("take_damage", 1.0)
	var health_after_hit := float(player.get("health"))
	await get_tree().create_timer(1.05).timeout
	if InventoryService.amount_of("racion_bosque") != 1:
		failures.append("interrupted consumable was incorrectly spent")
	if float(player.get("health")) > health_after_hit + 0.01:
		failures.append("interrupted consumable incorrectly applied recovery")
	if player.get_node_or_null("ConsumableUseFeedback") != null:
		failures.append("interrupted consumable visual remained attached")

func _check_physical_collection(player: CharacterBody2D) -> void:
	InventoryService.reset()
	GameState.reset_new_game()
	var gatherable := Node2D.new()
	gatherable.name = "PhysicalGatherable"
	gatherable.position = Vector2(30, 10)
	gatherable.set_script(GatherableScript)
	gatherable.call("configure_production", "manzana_bruma", 1, "botanica", 3, 0)
	add_child(gatherable)
	await get_tree().process_frame
	gatherable.call("interact", player)
	await get_tree().create_timer(0.08).timeout
	if InventoryService.amount_of("manzana_bruma") != 0:
		failures.append("gatherable entered inventory before pickup arc finished")
	if not is_instance_valid(gatherable) or not bool(gatherable.get("_collecting")):
		failures.append("gatherable did not enter collecting state")
	await get_tree().create_timer(0.28).timeout
	if InventoryService.amount_of("manzana_bruma") != 1:
		failures.append("gatherable did not enter inventory after pickup arc")
	if not bool(gatherable.get("depleted")):
		failures.append("gatherable did not persist depleted state after collection")
	gatherable.queue_free()
	await get_tree().process_frame

func _check_full_stack_collection_guard(player: CharacterBody2D) -> void:
	InventoryService.reset()
	GameState.reset_new_game()
	if not InventoryService.add_item("manzana_bruma", 20):
		failures.append("could not seed full consumable stack")
		return
	var gatherable := Node2D.new()
	gatherable.name = "FullStackGatherable"
	gatherable.position = Vector2(34, 12)
	gatherable.set_script(GatherableScript)
	gatherable.call("configure_production", "manzana_bruma", 1, "botanica", 3, 0)
	add_child(gatherable)
	await get_tree().process_frame
	gatherable.call("interact", player)
	await get_tree().create_timer(0.36).timeout
	if InventoryService.amount_of("manzana_bruma") != 20:
		failures.append("full stack amount changed during failed collection")
	if bool(gatherable.get("depleted")):
		failures.append("full stack collection incorrectly depleted world resource")
	if not gatherable.is_in_group("interactable"):
		failures.append("failed collection did not restore interactable state")
	gatherable.queue_free()
	await get_tree().process_frame

func _check_physical_enemy_defeat(player: CharacterBody2D) -> void:
	var enemy := CharacterBody2D.new()
	enemy.name = "PhysicalDefeatEnemy"
	enemy.position = Vector2(80, 20)
	enemy.set_script(EnemyScript)
	add_child(enemy)
	await get_tree().process_frame
	enemy.call("configure_production", "liveness_brote", 20.0, 52.0, 8.0, 1, 0)
	var fallback := enemy.get_node_or_null("EnemyVisual") as Sprite2D
	var live := enemy.get_node_or_null("EnemyLiveVisual") as Node2D
	if fallback == null:
		failures.append("production enemy missing fallback identity sprite")
	if live == null:
		failures.append("production enemy missing articulated live visual")
		enemy.queue_free()
		return
	if live.get_script() == null or not str(live.get_script().resource_path).ends_with("enemy_live_visual.gd"):
		failures.append("production enemy live visual uses wrong renderer")
	if fallback != null and fallback.visible:
		failures.append("legacy single-frame enemy sprite is visible instead of live renderer")
	if not live.has_method("set_motion_state") or not live.has_method("flash_hurt"):
		failures.append("live enemy renderer missing state/hurt animation contract")

	enemy.call("take_damage", 999.0)
	if enemy.collision_layer != 0 or enemy.collision_mask != 0:
		failures.append("defeated mob kept collision during physical defeat sequence")
	if not is_instance_valid(enemy) or not enemy.is_inside_tree():
		failures.append("mob disappeared immediately instead of playing defeat sequence")
		return
	await get_tree().create_timer(0.12).timeout
	if not is_instance_valid(enemy) or not enemy.is_inside_tree():
		failures.append("mob defeat sequence is too short / immediate")
		return
	if live.modulate.a >= 0.999 and live.scale.y >= 0.95 and absf(live.rotation) < 0.02:
		failures.append("live mob body did not visibly collapse/fade/rotate during defeat")
	await get_tree().create_timer(0.38).timeout
	await get_tree().process_frame
	if is_instance_valid(enemy) and enemy.is_inside_tree():
		failures.append("mob remained in world after defeat animation completed")

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_INTERACTION_LIVENESS_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_INTERACTION_LIVENESS_FAIL")
	get_tree().quit(1)