extends Control

var body_type := 1
var skin_tone := 2
var hair_style := 0
var hair_color := 0
var accent_color := 0

func configure(body_value: int, skin_value: int, hair_value: int, hair_color_value: int, accent_value: int) -> void:
	body_type = clampi(body_value, 0, 2)
	skin_tone = clampi(skin_value, 0, CharacterProfile.SKIN_COLORS.size() - 1)
	hair_style = clampi(hair_value, 0, CharacterProfile.HAIR_NAMES.size() - 1)
	hair_color = clampi(hair_color_value, 0, CharacterProfile.HAIR_COLORS.size() - 1)
	accent_color = clampi(accent_value, 0, CharacterProfile.ACCENT_COLORS.size() - 1)
	queue_redraw()

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()

func _draw() -> void:
	var skin := CharacterProfile.SKIN_COLORS[skin_tone]
	var hair := CharacterProfile.HAIR_COLORS[hair_color]
	var accent := CharacterProfile.ACCENT_COLORS[accent_color]
	var body_width := [30.0, 36.0, 42.0][body_type]
	var center_x := size.x * 0.5
	var foot_y := size.y - 8.0

	# shadow
	draw_ellipse(Vector2(center_x, foot_y), Vector2(26, 6), Color(0.02, 0.03, 0.04, 0.45))
	# legs
	draw_rect(Rect2(center_x - 14, foot_y - 30, 10, 24), Color("171b23"), true)
	draw_rect(Rect2(center_x + 4, foot_y - 30, 10, 24), Color("171b23"), true)
	# boots
	draw_rect(Rect2(center_x - 16, foot_y - 9, 13, 7), Color("0f1218"), true)
	draw_rect(Rect2(center_x + 3, foot_y - 9, 13, 7), Color("0f1218"), true)
	# torso
	draw_rect(Rect2(center_x - body_width * 0.5, foot_y - 67, body_width, 39), Color("222833"), true)
	draw_rect(Rect2(center_x - body_width * 0.5, foot_y - 56, body_width, 7), accent, true)
	draw_rect(Rect2(center_x - 5, foot_y - 53, 10, 11), accent.lightened(0.30), true)
	# arms and hands
	draw_rect(Rect2(center_x - body_width * 0.5 - 8, foot_y - 62, 8, 30), Color("171b23"), true)
	draw_rect(Rect2(center_x + body_width * 0.5, foot_y - 62, 8, 30), Color("171b23"), true)
	draw_rect(Rect2(center_x - body_width * 0.5 - 7, foot_y - 34, 7, 8), skin, true)
	draw_rect(Rect2(center_x + body_width * 0.5, foot_y - 34, 7, 8), skin, true)
	# head
	draw_rect(Rect2(center_x - 14, foot_y - 94, 28, 28), skin, true)
	draw_rect(Rect2(center_x - 9, foot_y - 83, 4, 4), Color("28343c"), true)
	draw_rect(Rect2(center_x + 5, foot_y - 83, 4, 4), Color("28343c"), true)
	_draw_hair(center_x, foot_y - 94, hair)
	# prism clasp
	draw_colored_polygon(PackedVector2Array([
		Vector2(center_x, foot_y - 51), Vector2(center_x + 5, foot_y - 45),
		Vector2(center_x, foot_y - 38), Vector2(center_x - 5, foot_y - 45)
	]), accent.lightened(0.35))

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var angle := TAU * float(i) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)

func _draw_hair(center_x: float, top_y: float, color: Color) -> void:
	match hair_style:
		0:
			draw_rect(Rect2(center_x - 15, top_y - 5, 30, 10), color, true)
			draw_rect(Rect2(center_x - 16, top_y + 2, 7, 10), color.darkened(0.08), true)
			draw_rect(Rect2(center_x + 9, top_y + 2, 7, 10), color.darkened(0.08), true)
		1:
			draw_rect(Rect2(center_x - 16, top_y - 6, 32, 11), color, true)
			draw_rect(Rect2(center_x - 18, top_y + 1, 8, 24), color.darkened(0.08), true)
			draw_rect(Rect2(center_x + 10, top_y + 1, 8, 24), color.darkened(0.08), true)
		2:
			draw_rect(Rect2(center_x - 17, top_y - 6, 34, 12), color, true)
			draw_rect(Rect2(center_x - 20, top_y + 1, 9, 35), color.darkened(0.10), true)
			draw_rect(Rect2(center_x + 11, top_y + 1, 9, 35), color.darkened(0.10), true)
		3:
			draw_rect(Rect2(center_x - 14, top_y - 2, 28, 4), color.darkened(0.20), true)
		4:
			draw_rect(Rect2(center_x - 16, top_y - 5, 32, 9), color, true)
			draw_rect(Rect2(center_x - 18, top_y + 3, 6, 28), color.darkened(0.12), true)
			draw_rect(Rect2(center_x - 20, top_y + 28, 10, 5), color.lightened(0.05), true)
		5:
			draw_rect(Rect2(center_x - 18, top_y - 8, 36, 13), color, true)
			draw_rect(Rect2(center_x - 21, top_y - 2, 9, 16), color.darkened(0.08), true)
			draw_rect(Rect2(center_x + 12, top_y - 4, 10, 18), color.lightened(0.05), true)
