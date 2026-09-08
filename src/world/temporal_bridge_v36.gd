extends Node2D

var fallback_position := Vector2.ZERO
var _area: Area2D
var _pulse := 0.0
var _cooldown := false

func configure(return_position: Vector2) -> void:
	fallback_position = return_position

func _ready() -> void:
	_area = Area2D.new()
	_area.name = "TemporalBridgeArea"
	_area.collision_layer = 0
	_area.collision_mask = 1
	var shape_node := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = Vector2(42, 54)
	shape_node.shape = shape
	_area.add_child(shape_node)
	_area.body_entered.connect(_on_body_entered)
	add_child(_area)
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	queue_redraw()

func _on_body_entered(body: Node2D) -> void:
	if _cooldown or not body.is_in_group("player"):
		return
	if GameState.has_world_flag("boss5_purged") and GameState.prism_step_unlocked:
		return
	_cooldown = true
	if fallback_position != Vector2.ZERO:
		body.global_position = fallback_position
	if GameState.has_world_flag("boss5_purged"):
		EventBus.toast_requested.emit("El puente está roto · Paso Prismático requerido")
	elif GameState.has_world_flag("gustavo_bridge_warning_01"):
		EventBus.toast_requested.emit("La anomalía te devuelve al borde del puente")
	else:
		EventBus.toast_requested.emit("Una presión temporal te obliga a retroceder")
	await get_tree().create_timer(0.65).timeout
	_cooldown = false

func _draw() -> void:
	var broken := GameState.has_world_flag("boss5_purged")
	var alpha := 0.13 + maxf(0.0, sin(_pulse * 2.4)) * 0.07
	if broken:
		draw_line(Vector2(-20, -10), Vector2(-5, -2), Color(0.55, 0.36, 0.96, 0.42), 2.0)
		draw_line(Vector2(5, 2), Vector2(20, 10), Color(0.55, 0.36, 0.96, 0.42), 2.0)
	else:
		draw_rect(Rect2(-20, -10, 40, 20), Color(0.45, 0.31, 0.20, 0.35), true)
		draw_arc(Vector2.ZERO, 26.0, 0.0, TAU, 28, Color(0.55, 0.36, 0.96, alpha), 1.0)
