extends "res://src/npc/enemy_controller.gd"

const SPRITE := preload("res://assets/production/interiors/training_core.svg")

var _visual: Sprite2D
var _pulse := 0.0

func configure_training() -> void:
	enemy_id = "nucleo_entrenamiento_impacto"
	max_health = 54.0
	health = max_health
	move_speed = 0.0
	attack_damage = 0.0
	xp_reward = 0
	aggro_range = 0.0
	attack_range = 0.0

func _ready() -> void:
	configure_training()
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "TrainingCoreVisual"
	_visual.texture = SPRITE
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)
	queue_redraw()

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	_pulse += delta
	if is_instance_valid(_visual):
		_visual.modulate = Color.WHITE.lerp(Color("d8ceff"), 0.18 + sin(_pulse * 4.0) * 0.08)

func _draw() -> void:
	var ratio: float = health / max_health if max_health > 0.0 else 0.0
	draw_rect(Rect2(-12, -24, 24, 3), Color("241f22"))
	draw_rect(Rect2(-12, -24, 24.0 * ratio, 3), Color("ff8c42"))
