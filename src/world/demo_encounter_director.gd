extends Node

const EnemyScript = preload("res://src/npc/enemy_controller.gd")
const Boss5Script = preload("res://src/npc/boss5_guardian.gd")
const NpcScript = preload("res://src/npc/npc_interactable.gd")

func _ready() -> void:
	EventBus.demo_stage_changed.connect(_on_demo_stage_changed)

func _on_demo_stage_changed(stage_id: String) -> void:
	match stage_id:
		"sanctuary":
			_spawn_sanctuary_miniboss()
		"boss5":
			_spawn_boss5()
		"refuge_after_boss":
			_spawn_refuge_cast()
		"mentor_choice":
			_spawn_refuge_cast()
		_:
			pass

func _scene_root() -> Node:
	return get_tree().current_scene

func _spawn_sanctuary_miniboss() -> void:
	var root := _scene_root()
	if root == null or root.get_node_or_null("CustodioRaicesMenor") != null:
		return
	var enemy := CharacterBody2D.new()
	enemy.name = "CustodioRaicesMenor"
	enemy.collision_layer = 2
	enemy.collision_mask = 1 | 4
	enemy.set_script(EnemyScript)
	enemy.set("enemy_id", "custodio_raices_menor")
	enemy.set("max_health", 120.0)
	enemy.set("move_speed", 46.0)
	enemy.set("aggro_range", 190.0)
	enemy.set("attack_range", 25.0)
	enemy.set("attack_damage", 11.0)
	enemy.set("xp_reward", 90)
	enemy.position = Vector2(930, 520)
	var shape_node := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 13.0
	shape_node.shape = shape
	enemy.add_child(shape_node)
	root.add_child(enemy)
	EventBus.toast_requested.emit("Santuario de las Raíces · presencia hostil detectada")

func _spawn_boss5() -> void:
	var root := _scene_root()
	if root == null or root.get_node_or_null("GuardianBosqueVelado") != null:
		return
	var boss := CharacterBody2D.new()
	boss.name = "GuardianBosqueVelado"
	boss.collision_layer = 2
	boss.collision_mask = 1 | 4
	boss.set_script(Boss5Script)
	boss.position = Vector2(1080, 220)
	var shape_node := CollisionShape2D.new()
	var shape := CircleShape2D.new()
	shape.radius = 20.0
	shape_node.shape = shape
	boss.add_child(shape_node)
	root.add_child(boss)
	EventBus.dialog_requested.emit("Xethkioz", "La resonancia cambia. Algo enorme está respondiendo desde el corazón del bosque.")

func _spawn_refuge_cast() -> void:
	var root := _scene_root()
	if root == null:
		return
	_spawn_npc(root, "elida", "Elida", Vector2(118,120), Color("d6a77a"), "Las plantas ya dejaron de temblar. Pero esto no terminó: aprendé de los chicos antes de seguir avanzando.")
	_spawn_npc(root, "ashley", "Ashley", Vector2(162,110), Color("c686d8"), "Yo trabajo con resonancia. Si aprendés a escuchar el ritmo del combate, podés controlarlo.")
	_spawn_npc(root, "fermin", "Fermín", Vector2(205,120), Color("d28a62"), "Aguantar no alcanza. Hay que saber cuándo romper la defensa del otro.")
	_spawn_npc(root, "isabella", "Isabella", Vector2(146,154), Color("9a75d8"), "El caos no es azar. Si marcás bien algo, después podés hacerlo explotar.")
	_spawn_npc(root, "gael", "Gael", Vector2(196,158), Color("77b98a"), "Si te ven venir, ya llegaste tarde. Yo te enseño a elegir el momento.")

func _spawn_npc(root: Node, npc_id: String, display_name: String, pos: Vector2, color: Color, line: String) -> void:
	var node_name := "DemoNPC_%s" % npc_id
	if root.get_node_or_null(node_name) != null:
		return
	var npc := Node2D.new()
	npc.name = node_name
	npc.set_script(NpcScript)
	npc.position = pos
	npc.configure(npc_id, display_name, [line], color, [])
	root.add_child(npc)
