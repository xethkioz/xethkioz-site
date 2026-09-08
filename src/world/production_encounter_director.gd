extends Node

const EnemyScript := preload("res://src/npc/enemy_controller_production.gd")
const BossScript := preload("res://src/npc/boss5_guardian_production.gd")
const NpcScript := preload("res://src/npc/npc_interactable_production.gd")

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
		"refuge_after_boss", "mentor_choice":
			_spawned_stages[stage_id] = true
			_spawn_refuge_family()
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
	if _world.get_node_or_null("GuardianBosqueVelado") != null:
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

func _spawn_refuge_family() -> void:
	if _world.get_node_or_null("Elida") != null:
		return
	_spawn_npc("elida", "Elida", _world_pos(1,3,300,135), 1, [
		"Acá siempre vas a tener un lugar donde volver. Un refugio no es esconderse: es saber desde dónde podés salir otra vez.",
		"Los chicos crecieron de formas distintas dentro del mismo desastre. Escuchalos antes de elegir por dónde empezar."
	])
	_spawn_npc("ashley", "Ashley", _world_pos(1,3,230,185), 2, [
		"La resonancia sirve para escuchar el combate antes de que empiece. Si elegís mi camino, vas a aprender a mover el ritmo de una pelea."
	])
	_spawn_npc("fermin", "Fermín", _world_pos(1,3,268,205), 3, [
		"Impacto no es fuerza sin control. Si querés entrenar al Carpinchito, primero demostrame que sabés cuándo romper una defensa."
	])
	_spawn_npc("isabella", "Isabella", _world_pos(1,3,338,205), 4, [
		"El caos no siempre está fuera de control. A veces solamente usa reglas que todavía no entendiste."
	])
	_spawn_npc("gael", "Gael", _world_pos(1,3,375,185), 5, [
		"Si podés ver el camino antes que el enemigo, no necesitás quedarte quieto para acertar."
	])
	EventBus.toast_requested.emit("Refugio de Elida · los cuatro caminos están disponibles")

func _spawn_npc(id_value: String, display_name: String, pos: Vector2, atlas_index: int, lines: Array[String]) -> Node2D:
	var npc := Node2D.new()
	npc.name = display_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure_production(id_value, display_name, lines, atlas_index)
	_world.add_child(npc)
	return npc

func _spawn_training_cores() -> void:
	var positions := [
		_world_pos(1, 3, 410, 150),
		_world_pos(1, 3, 442, 205),
		_world_pos(1, 3, 410, 260)
	]
	for index in range(positions.size()):
		var core := _spawn_enemy("nucleo_entrenamiento_impacto", positions[index], 54.0, 0.0, 0.0, 0, 3, 0.0, 0.0)
		core.name = "NucleoImpacto_%d" % (index + 1)

func _world_pos(chunk_x: int, chunk_y: int, local_x: int, local_y: int) -> Vector2:
	return Vector2(chunk_x * CHUNK_PIXELS + local_x, chunk_y * CHUNK_PIXELS + local_y)
