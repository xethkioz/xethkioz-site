extends Control

const SHEET := preload("res://assets/production/characters/viajero_sheet.svg")

var _body_type := 1
var _skin := Color("c88f6a")
var _hair_style := 0
var _hair := Color("1a1718")
var _accent := Color("8b5cf6")

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	queue_redraw()

func configure_visual(body_type: int, skin: Color, hair_style: int, hair: Color, accent: Color) -> void:
	_body_type = clampi(body_type, 0, 2)
	_skin = skin
	_hair_style = clampi(hair_style, 0, 5)
	_hair = hair
	_accent = accent
	queue_redraw()

func _draw() -> void:
	var body_scale: float = float([0.90, 1.0, 1.10][_body_type])
	var target_size := Vector2(90.0 * body_scale, 90.0)
	var target_pos := Vector2((size.x - target_size.x) * 0.5, 8.0)
	draw_texture_rect_region(SHEET, Rect2(target_pos, target_size), Rect2(32, 0, 32, 32))

	var center_x: float = size.x * 0.5
	var pixel: float = 3.0
	var head_y: float = 23.0
	var shoulder: float = 7.0 * pixel * body_scale

	# Reproduce the same visual language as the runtime profile overlay so the
	# creator preview matches what appears in gameplay.
	draw_rect(Rect2(center_x - shoulder, 63.0, shoulder * 2.0, 2.0 * pixel), _accent, true)
	draw_rect(Rect2(center_x - 2.0 * pixel, 60.0, 4.0 * pixel, 5.0 * pixel), _accent.lightened(0.28), true)
	draw_rect(Rect2(center_x - 4.0 * pixel, head_y, 8.0 * pixel, 6.0 * pixel), _skin, true)
	draw_rect(Rect2(center_x - 5.0 * pixel, head_y - 3.0 * pixel, 10.0 * pixel, 4.0 * pixel), _hair, true)
	_draw_hair_style(Vector2(center_x, head_y - pixel), pixel)
	draw_rect(Rect2(center_x - 3.0 * pixel, head_y + 2.0 * pixel, 2.0 * pixel, 2.0 * pixel), Color("26323a"), true)
	draw_rect(Rect2(center_x + 2.0 * pixel, head_y + 2.0 * pixel, 2.0 * pixel, 2.0 * pixel), Color("26323a"), true)
	draw_rect(Rect2(center_x - shoulder - 2.0 * pixel, 69.0, 2.0 * pixel, 4.0 * pixel), _skin.darkened(0.04), true)
	draw_rect(Rect2(center_x + shoulder, 69.0, 2.0 * pixel, 4.0 * pixel), _skin.darkened(0.04), true)

func _draw_hair_style(anchor: Vector2, pixel: float) -> void:
	match _hair_style:
		0:
			draw_rect(Rect2(anchor.x - 4.0 * pixel, anchor.y - 4.0 * pixel, 8.0 * pixel, 2.0 * pixel), _hair.lightened(0.08), true)
		1:
			draw_rect(Rect2(anchor.x - 5.0 * pixel, anchor.y - 4.0 * pixel, 10.0 * pixel, 3.0 * pixel), _hair, true)
			draw_rect(Rect2(anchor.x - 5.0 * pixel, anchor.y - pixel, 2.0 * pixel, 5.0 * pixel), _hair.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 3.0 * pixel, anchor.y - pixel, 2.0 * pixel, 5.0 * pixel), _hair.darkened(0.08), true)
		2:
			draw_rect(Rect2(anchor.x - 5.0 * pixel, anchor.y - 4.0 * pixel, 10.0 * pixel, 3.0 * pixel), _hair, true)
			draw_rect(Rect2(anchor.x - 6.0 * pixel, anchor.y - pixel, 3.0 * pixel, 9.0 * pixel), _hair.darkened(0.10), true)
			draw_rect(Rect2(anchor.x + 3.0 * pixel, anchor.y - pixel, 3.0 * pixel, 9.0 * pixel), _hair.darkened(0.10), true)
		3:
			draw_rect(Rect2(anchor.x - 4.0 * pixel, anchor.y - 3.0 * pixel, 8.0 * pixel, pixel), _hair.darkened(0.18), true)
		4:
			draw_rect(Rect2(anchor.x - 5.0 * pixel, anchor.y - 4.0 * pixel, 10.0 * pixel, 2.0 * pixel), _hair, true)
			draw_rect(Rect2(anchor.x - 6.0 * pixel, anchor.y - pixel, 2.0 * pixel, 8.0 * pixel), _hair.darkened(0.10), true)
			draw_rect(Rect2(anchor.x - 7.0 * pixel, anchor.y + 6.0 * pixel, 4.0 * pixel, 2.0 * pixel), _hair.lightened(0.05), true)
		5:
			draw_rect(Rect2(anchor.x - 6.0 * pixel, anchor.y - 4.0 * pixel, 12.0 * pixel, 3.0 * pixel), _hair, true)
			draw_rect(Rect2(anchor.x - 7.0 * pixel, anchor.y - 2.0 * pixel, 3.0 * pixel, 4.0 * pixel), _hair.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 4.0 * pixel, anchor.y - 3.0 * pixel, 3.0 * pixel, 5.0 * pixel), _hair.lightened(0.05), true)
