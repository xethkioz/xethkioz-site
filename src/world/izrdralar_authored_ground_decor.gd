class_name IzrdralarAuthoredGroundDecor
extends Node2D

var decor_kind := "pebbles"
var accent := Color("8b5cf6")
var seed_value := 1

func configure(kind_value: String, accent_value: Color, seed: int) -> void:
	decor_kind = kind_value
	accent = accent_value
	seed_value = seed
	z_index = -6
	queue_redraw()

func _draw() -> void:
	match decor_kind:
		"trail":
			_draw_trail()
		"plaza_wear":
			_draw_plaza_wear()
		"garden_patch":
			_draw_garden_patch()
		"doorstep":
			_draw_doorstep()
		"reeds":
			_draw_reeds()
		"rubble":
			_draw_rubble()
		"root_cracks":
			_draw_root_cracks()
		_:
			_draw_pebbles()

func _draw_trail() -> void:
	for index in range(8):
		var offset := Vector2(float(index) * 9.0 - 31.0, sin(float(index) * 1.7) * 5.0)
		var side := -2.5 if index % 2 == 0 else 2.5
		var color_value := _alpha(accent.darkened(0.38), 0.28 + float(index % 3) * 0.04)
		draw_rect(Rect2(offset + Vector2(-2.0, side - 1.0), Vector2(4.0, 2.0)), color_value, true)
		draw_rect(Rect2(offset + Vector2(0.0, side + 1.0), Vector2(2.0, 1.0)), color_value, true)

func _draw_plaza_wear() -> void:
	for index in range(7):
		var angle := TAU * float(index) / 7.0
		var radius := 18.0 + float((seed_value + index * 13) % 17)
		var center := Vector2.from_angle(angle) * radius
		var length := 7.0 + float((seed_value + index * 5) % 9)
		draw_line(center - Vector2(length * 0.5, 0), center + Vector2(length * 0.5, 0), _alpha(accent.darkened(0.32), 0.22), 1.0)
		if index % 2 == 0:
			draw_rect(Rect2(center + Vector2(2, 3), Vector2(2, 2)), _alpha(accent.lightened(0.10), 0.18), true)

func _draw_garden_patch() -> void:
	var soil := _alpha(accent.darkened(0.46), 0.34)
	draw_rect(Rect2(-28, -9, 56, 18), soil, true)
	for row in range(3):
		var y := -5.0 + float(row) * 5.0
		draw_line(Vector2(-25, y), Vector2(25, y), _alpha(accent.darkened(0.28), 0.30), 1.0)
	for index in range(12):
		var x := float((index * 13 + seed_value * 7) % 49) - 24.0
		var y := float((index * 17 + seed_value * 3) % 13) - 6.0
		var stem := Color("709a64") if index % 2 == 0 else Color("86a75f")
		draw_line(Vector2(x, y + 2), Vector2(x, y - 2), _alpha(stem, 0.58), 1.0)
		var flower := Color("e5b96d") if index % 3 == 0 else Color("d58ca8")
		draw_circle(Vector2(x, y - 3), 1.2, _alpha(flower, 0.64))

func _draw_doorstep() -> void:
	# Flat threshold: readable as habitation detail without creating a prop the
	# player should collide with.
	draw_rect(Rect2(-18, -4, 36, 8), _alpha(accent.darkened(0.34), 0.42), true)
	for index in range(4):
		var x := -15.0 + float(index) * 10.0
		draw_line(Vector2(x, -3), Vector2(x + 6.0, 3), _alpha(accent.lightened(0.08), 0.24), 1.0)
	draw_line(Vector2(-18, 4), Vector2(18, 4), _alpha(Color("3f352b"), 0.48), 1.0)

func _draw_reeds() -> void:
	for cluster in range(5):
		var base := Vector2(float(cluster) * 12.0 - 24.0, float((cluster * 7 + seed_value) % 9) - 4.0)
		for blade in range(3):
			var x := float(blade - 1) * 2.5
			var height := 7.0 + float((cluster * 11 + blade * 5 + seed_value) % 7)
			var lean := -2.0 + float((cluster + blade + seed_value) % 5)
			draw_line(base + Vector2(x, 0), base + Vector2(x + lean, -height), _alpha(accent.darkened(0.16), 0.44), 1.2)
			draw_circle(base + Vector2(x + lean, -height), 1.0, _alpha(accent.lightened(0.18), 0.38))

func _draw_rubble() -> void:
	for index in range(10):
		var x := float((index * 17 + seed_value * 3) % 63) - 31.0
		var y := float((index * 23 + seed_value * 7) % 35) - 17.0
		var size := 2.0 + float((index + seed_value) % 4)
		var stone := _alpha(accent.darkened(0.30 + float(index % 3) * 0.05), 0.36)
		draw_rect(Rect2(Vector2(x, y), Vector2(size + 1.0, size)), stone, true)
		if index % 3 == 0:
			draw_line(Vector2(x, y), Vector2(x + size + 3.0, y - 2.0), _alpha(accent.lightened(0.08), 0.20), 1.0)

func _draw_root_cracks() -> void:
	for index in range(8):
		var angle := TAU * float(index) / 8.0 + float(seed_value % 11) * 0.03
		var ray := Vector2.from_angle(angle)
		var side := Vector2(-ray.y, ray.x)
		var reach := 23.0 + float((index * 9 + seed_value) % 22)
		var mid := ray * (reach * 0.52) + side * float((index % 3) - 1) * 5.0
		var outer := ray * reach
		draw_polyline(PackedVector2Array([Vector2.ZERO, mid, outer]), _alpha(accent.darkened(0.35), 0.32), 1.5)
		if index % 2 == 0:
			draw_line(mid, mid + side * 7.0, _alpha(accent.lightened(0.08), 0.20), 1.0)

func _draw_pebbles() -> void:
	for index in range(9):
		var x := float((index * 19 + seed_value * 5) % 55) - 27.0
		var y := float((index * 13 + seed_value * 11) % 31) - 15.0
		draw_rect(Rect2(Vector2(x, y), Vector2(2 + index % 2, 1 + index % 3)), _alpha(accent.darkened(0.30), 0.25), true)

func _alpha(color_value: Color, alpha_value: float) -> Color:
	return Color(color_value.r, color_value.g, color_value.b, clampf(alpha_value, 0.0, 1.0))
