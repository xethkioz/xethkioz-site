extends "res://src/npc/enemy_controller.gd"

const ATLAS := preload("res://assets/production/characters/enemy_atlas.svg")
const FRAME_SIZE := Vector2(32, 32)

var _visual: Sprite2D
var _visual_index := 0

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

func _draw() -> void:
	var health_ratio := health / max_health if max_health > 0.0 else 0.0
	if _mark_time > 0.0:
		draw_arc(Vector2(0, -5), 17.0, 0.0, TAU, 18, Color("c686ff"), 2.0)
	if _root_time > 0.0:
		draw_line(Vector2(-11, 7), Vector2(11, 7), Color("9f7f5f"), 3.0)
	draw_rect(Rect2(-13, -25, 26, 3), Color("241f22"))
	draw_rect(Rect2(-13, -25, 26 * health_ratio, 3), Color("ff6b6b"))
