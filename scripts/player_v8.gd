extends "res://scripts/player_v7.gd"

const TRAVELER_TEX = preload("res://assets/v08/generated/traveler.png")

var visual_sprite: Sprite2D
var visual_time := 0.0

func _ready() -> void:
	super._ready()
	visual_sprite = Sprite2D.new()
	visual_sprite.texture = TRAVELER_TEX
	visual_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	visual_sprite.scale = Vector2(1.45,1.45)
	visual_sprite.position = Vector2(0,-9)
	visual_sprite.z_index = 6
	add_child(visual_sprite)

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	visual_time += delta
	if not visual_sprite:
		return
	visual_sprite.flip_h = facing < 0
	var speed_ratio: float = minf(1.0,absf(velocity.x)/420.0)
	var bob: float = 0.0
	if is_on_floor() and speed_ratio > 0.08:
		bob = sin(visual_time*(9.0+speed_ratio*7.0))*1.5
	visual_sprite.position.y = -9.0+bob
	if dash_timer > 0.0:
		visual_sprite.modulate = Color(1.15,1.05,1.35,0.90)
		visual_sprite.scale = Vector2(1.62,1.34)
	elif invuln_timer > 0.0:
		visual_sprite.modulate = Color(1.25,1.25,1.25,0.78)
		visual_sprite.scale = Vector2(1.45,1.45)
	else:
		visual_sprite.modulate = Color.WHITE
		visual_sprite.scale = Vector2(1.45,1.45)

func _draw() -> void:
	# v0.8 replaces the old debug silhouette with a real pixel-art sprite.
	pass
