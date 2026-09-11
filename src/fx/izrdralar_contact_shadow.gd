class_name IzrdralarContactShadow
extends Node2D

var _radii := Vector2(9.0, 3.0)
var _shadow_color := Color(0.02, 0.05, 0.04, 0.30)
var _segments := 16

func configure(radii_value: Vector2, alpha: float = 0.30, offset_value: Vector2 = Vector2(0, 6)) -> void:
	_radii = Vector2(maxf(2.0, radii_value.x), maxf(1.0, radii_value.y))
	_shadow_color = Color(0.02, 0.05, 0.04, clampf(alpha, 0.05, 0.55))
	position = offset_value.round()
	z_index = -8
	queue_redraw()

func _ready() -> void:
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	queue_redraw()

func _draw() -> void:
	var points := PackedVector2Array()
	for index in range(_segments):
		var angle := TAU * float(index) / float(_segments)
		points.append(Vector2(cos(angle) * _radii.x, sin(angle) * _radii.y).round())
	draw_colored_polygon(points, _shadow_color)
