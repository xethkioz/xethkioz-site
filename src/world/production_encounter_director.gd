extends Node

const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")
const BossScript := preload("res://src/npc/boss5_guardian_production.gd")

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
		"sanctuary":
			_spawned_stages[stage_id] = true
			_spawn_enemy("custodio_raices_menor", _world_pos(3, 2, 256, 246), 145.0, 44.0, 12.0, 90, 3, 120.0, 28.0)
			EventBus.toast_requested.emit("Santuario de las Raíces · una presencia bloquea el núcleo")
		"boss5":
			_spawned_stages[stage_id] = true
			_spawn_boss5()
		"fermin_training":
			_spawned_stages[stage_id] = true
			_spawn_training_cores()

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

func _spawn_training_cores() -> void:
	var positions := [
		_world_pos(1, 3, 390, 170),
		_world_pos(1, 3, 425, 205),
		_world_pos(1, 3, 390, 240)
	]
	for index in range(positions.size()):
		var core := _spawn_enemy("nucleo_entrenamiento_impacto", positions[index], 54.0, 0.0, 0.0, 0, 3, 0.0, 0.0)
		core.name = "NucleoImpacto_%d" % (index + 1)

func _world_pos(chunk_x: int, chunk_y: int, local_x: int, local_y: int) -> Vector2:
	return Vector2(chunk_x * CHUNK_PIXELS + local_x, chunk_y * CHUNK_PIXELS + local_y)
