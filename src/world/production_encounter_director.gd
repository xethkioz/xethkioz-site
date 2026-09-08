extends Node

const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")
const BossScript := preload("res://src/npc/boss5_guardian_production.gd")
const StoryItemScript := preload("res://src/world/story_item_v36.gd")

const CHUNK_PIXELS := 512
var _world: Node2D
var _spawned_stages: Dictionary = {}

func _ready() -> void:
	_world = get_parent() as Node2D
	EventBus.demo_stage_changed.connect(_on_stage_changed)

func _on_stage_changed(stage_id: String) -> void:
	if _spawned_stages.has(stage_id):
		return
	match stage_id:
		"awakening_survival":
			_spawned_stages[stage_id] = true
			_spawn_awakening_brote()
		"xethkioz_intercept":
			_spawned_stages[stage_id] = true
			_run_xethkioz_intercept()
		"strange_meter":
			_spawned_stages[stage_id] = true
			_spawn_strange_meter()
		"sanctuary":
			_spawned_stages[stage_id] = true
			_spawn_enemy("custodio_raices_menor", _world_pos(3, 2, 256, 246), 145.0, 44.0, 12.0, 90, 3, 120.0, 28.0)
			EventBus.toast_requested.emit("Santuario de las Raíces · una presencia bloquea el núcleo")
		"boss5":
			_spawned_stages[stage_id] = true
			_spawn_boss5()
		"bridge_broken":
			_spawned_stages[stage_id] = true
			EventBus.toast_requested.emit("La tormenta quebró el puente de la Cuenca")
		"refuge_after_boss":
			_spawned_stages[stage_id] = true
			EventBus.toast_requested.emit("El bosque se calmó · el Refugio de Elida está abierto")
		"mentor_choice":
			_spawned_stages[stage_id] = true
		_:
			pass

func _spawn_awakening_brote() -> void:
	if GameState.has_world_flag("xethkioz_first_intercept"):
		return
	if _world.get_node_or_null("AwakeningBrote") != null:
		return
	var enemy := _spawn_enemy("brote_goblin", _world_pos(1, 3, 330, 270), 40.0, 48.0, 7.0, 18, 0, 110.0, 22.0)
	enemy.name = "AwakeningBrote"
	EventBus.toast_requested.emit("SOBREVIVÍ · J para atacar · SHIFT para esquivar")

func _run_xethkioz_intercept() -> void:
	var pet := _world.get_node_or_null("Xethkioz")
	if is_instance_valid(pet) and pet.has_method("set_story_active"):
		pet.call("set_story_active", true, true)
	GameState.set_world_flag("xethkioz_first_intercept", true)
	EventBus.toast_requested.emit("Una silueta de tres colas desvía el ataque y se queda a tu lado")
	await get_tree().create_timer(0.45).timeout
	if not is_instance_valid(_world) or _world.get_node_or_null("AwakeningSlime") != null:
		return
	var player := get_tree().get_first_node_in_group("player") as Node2D
	var spawn_position := _world_pos(1, 3, 382, 236)
	if is_instance_valid(player):
		spawn_position = player.global_position + Vector2(92, -36)
	var enemy := _spawn_enemy("slime_prismatico", spawn_position, 52.0, 38.0, 8.0, 22, 2, 135.0, 24.0)
	enemy.name = "AwakeningSlime"

func _spawn_strange_meter() -> void:
	if GameState.has_world_flag("strange_meter_collected") or _world.get_node_or_null("StrangeMeter") != null:
		return
	var item := Node2D.new()
	item.name = "StrangeMeter"
	item.set_script(StoryItemScript)
	var player := get_tree().get_first_node_in_group("player") as Node2D
	item.position = _world_pos(1, 3, 310, 210)
	if is_instance_valid(player):
		item.position = player.global_position + Vector2(42, 18)
	item.configure("strange_meter", "strange_meter_collected", "OBJETO EXTRAÑO")
	_world.add_child(item)

func _spawn_enemy(id_value: String, pos: Vector2, hp: float, speed: float, damage: float, xp: int, atlas_index: int, aggro: float = 145.0, attack_range: float = 22.0) -> CharacterBody2D:
	var enemy := CharacterBody2D.new()
	enemy.name = id_value
	enemy.collision_layer = 2
	enemy.collision_mask = 1 | 4
	enemy.set_script(EnemyScript)
	enemy.position = pos
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 10.0
	collision.shape = shape
	collision.position = Vector2(0, 3)
	enemy.add_child(collision)
	enemy.configure_production(id_value, hp, speed, damage, xp, atlas_index)
	enemy.aggro_range = aggro
	enemy.attack_range = attack_range
	_world.add_child(enemy)
	return enemy

func _spawn_boss5() -> void:
	if GameState.has_world_flag("boss5_purged") or _world.get_node_or_null("GuardianBosqueVelado") != null:
		return
	var boss := CharacterBody2D.new()
	boss.name = "GuardianBosqueVelado"
	boss.collision_layer = 2
	boss.collision_mask = 1 | 4
	boss.set_script(BossScript)
	boss.position = _world_pos(4, 0, 256, 256)
	var collision := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 20.0
	collision.shape = shape
	collision.position = Vector2(0, 4)
	boss.add_child(collision)
	_world.add_child(boss)
	EventBus.toast_requested.emit("Corazón del Bosque Velado · Guardián despertado")

func _world_pos(chunk_x: int, chunk_y: int, local_x: int, local_y: int) -> Vector2:
	return Vector2(chunk_x * CHUNK_PIXELS + local_x, chunk_y * CHUNK_PIXELS + local_y)
