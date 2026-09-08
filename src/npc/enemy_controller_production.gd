extends "res://src/npc/enemy_controller.gd"

const ATLAS := preload("res://assets/production/characters/enemy_atlas.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")
const FRAME_SIZE := Vector2(32, 32)

var _visual: Sprite2D
var _visual_index := 0
var _production_defeated: bool = false

func configure_production(id_value: String, hp: float, speed: float, damage: float, xp: int, atlas_index: int) -> void:
	enemy_id = id_value
	max_health = hp
	health = hp
	move_speed = speed
	attack_damage = damage
	xp_reward = xp
	_visual_index = clampi(atlas_index, 0, 5)
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "EnemyVisual"
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)
	_refresh_visual()

func _refresh_visual() -> void:
	if is_instance_valid(_visual):
		_visual.region_rect = Rect2(Vector2(_visual_index * 32, 0), FRAME_SIZE)

func take_damage(amount: float) -> void:
	if _production_defeated or amount <= 0.0:
		return
	var applied: float = minf(amount, health)
	health = maxf(0.0, health - amount)
	_spawn_feedback("hit", _impact_direction(), Color("ff8c42"), str(roundi(applied)))
	_flash_visual()
	queue_redraw()
	if health > 0.0:
		return
	_production_defeated = true
	set_physics_process(false)
	collision_layer = 0
	collision_mask = 0
	EventBus.enemy_defeated.emit(enemy_id, xp_reward, global_position)
	GameState.add_crystals(2)
	_spawn_feedback("death", Vector2.UP, Color("8b5cf6"), "+2 cristales")
	if is_instance_valid(_visual):
		_visual.visible = false
	await get_tree().create_timer(0.16).timeout
	if is_instance_valid(self):
		queue_free()

func _impact_direction() -> Vector2:
	if is_instance_valid(_player):
		var direction: Vector2 = global_position - _player.global_position
		if direction.length_squared() > 0.001:
			return direction.normalized()
	return Vector2.UP

func _flash_visual() -> void:
	if not is_instance_valid(_visual):
		return
	_visual.modulate = Color(1.0, 0.58, 0.46, 1.0)
	var tween: Tween = create_tween()
	tween.tween_property(_visual, "modulate", Color.WHITE, 0.11)

func _spawn_feedback(kind_value: String, direction_value: Vector2, color_value: Color, text_value: String = "") -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -9)
	scene.add_child(fx)
	fx.call("configure", kind_value, direction_value, color_value, text_value)

func _draw() -> void:
	var health_ratio: float = health / max_health if max_health > 0.0 else 0.0
	if _mark_time > 0.0:
		draw_arc(Vector2(0, -5), 17.0, 0.0, TAU, 18, Color("c686ff"), 2.0)
	if _root_time > 0.0:
		draw_line(Vector2(-11, 7), Vector2(11, 7), Color("9f7f5f"), 3.0)
	draw_rect(Rect2(-13, -25, 26, 3), Color("241f22"))
	draw_rect(Rect2(-13, -25, 26 * health_ratio, 3), Color("ff6b6b"))
