class_name IzrdralarBossForestPass03
extends Node2D

const CENTER := Vector2(256, 256)
const SAFE_RADIUS := 142.0
const ROOT_START_RADIUS := 154.0
const OUTER_RADIUS := 236.0

var _seed_value := 0
var _roots: Array[Dictionary] = []
var _canopy_patches: Array[Dictionary] = []
var _stones: Array[Dictionary] = []

func configure(seed_value: int) -> void:
	_seed_value = seed_value
	z_index = -9
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_build_layout()
	queue_redraw()

func _build_layout() -> void:
	_roots.clear()
	_canopy_patches.clear()
	_stones.clear()

	# Eight broken root systems frame the arena. Their tips stop outside the
	# authored safe combat radius, so the art never suggests a false blocker.
	for index in range(8):
		var base_angle := TAU * float(index) / 8.0
		var angle_jitter := deg_to_rad(float(_signed_roll(index, 19, 14)))
		var start_angle := base_angle + angle_jitter
		var start_radius := OUTER_RADIUS - float(_roll(index, 23) % 22)
		var end_radius := ROOT_START_RADIUS + float(_roll(index, 31) % 13)
		var bend := deg_to_rad(float(_signed_roll(index, 41, 18)))
		var thickness := 5.0 + float(_roll(index, 47) % 4)
		_roots.append({
			"start": CENTER + Vector2.from_angle(start_angle) * start_radius,
			"mid": CENTER + Vector2.from_angle(start_angle + bend) * lerpf(start_radius, end_radius, 0.52),
			"end": CENTER + Vector2.from_angle(start_angle + bend * 0.35) * end_radius,
			"width": thickness,
			"accent": index % 3 == 0
		})

	# Perimeter canopy masses are intentionally uneven; the lower opening is
	# lighter so the player's entry and boss telegraphs remain readable.
	for index in range(14):
		var angle := TAU * float(index) / 14.0 + deg_to_rad(float(_signed_roll(index, 59, 9)))
		if angle > 0.34 * PI and angle < 0.66 * PI and index % 2 == 0:
			continue
		var radius := 218.0 + float(_roll(index, 61) % 42)
		var center := CENTER + Vector2.from_angle(angle) * radius
		_canopy_patches.append({
			"center": center.round(),
			"radius": Vector2(24 + int(_roll(index, 67) % 20), 10 + int(_roll(index, 71) % 9)),
			"light": index % 4 == 0
		})

	# Small stone/root anchors make the dirt-to-forest ring feel embedded rather
	# than like a circular tile cutout. They are decorative and non-colliding.
	for index in range(18):
		var angle := TAU * float(index) / 18.0 + deg_to_rad(float(_signed_roll(index, 79, 7)))
		var radius := 166.0 + float(_roll(index, 83) % 27)
		_stones.append({
			"position": (CENTER + Vector2.from_angle(angle) * radius).round(),
			"size": Vector2(5 + int(_roll(index, 89) % 8), 3 + int(_roll(index, 97) % 5)),
			"prism": index % 7 == 0
		})

func _draw() -> void:
	_draw_arena_floor_integration()
	_draw_canopy_perimeter()
	_draw_roots()
	_draw_stone_anchors()
	_draw_resonance_marks()

func _draw_arena_floor_integration() -> void:
	# Broken dark ring, not a full circle: keeps the centre readable while
	# visually tying the authored dirt arena back into the forest floor.
	for index in range(20):
		if index in [4, 5, 14]:
			continue
		var a0 := TAU * float(index) / 20.0 + 0.035
		var a1 := TAU * float(index + 1) / 20.0 - 0.035
		draw_arc(CENTER, 169.0 + float(index % 3) * 2.0, a0, a1, 7, Color(0.08, 0.18, 0.13, 0.52), 5.0)
		draw_arc(CENTER, 174.0 + float((index + 1) % 2) * 2.0, a0, a1, 7, Color(0.19, 0.34, 0.22, 0.32), 2.0)

func _draw_canopy_perimeter() -> void:
	for patch in _canopy_patches:
		var c: Vector2 = patch["center"]
		var r: Vector2 = patch["radius"]
		var points := PackedVector2Array([
			c + Vector2(-r.x, 1),
			c + Vector2(-r.x * 0.72, -r.y * 0.72),
			c + Vector2(-r.x * 0.25, -r.y),
			c + Vector2(r.x * 0.45, -r.y * 0.82),
			c + Vector2(r.x, -r.y * 0.08),
			c + Vector2(r.x * 0.78, r.y * 0.72),
			c + Vector2(0, r.y),
			c + Vector2(-r.x * 0.75, r.y * 0.62)
		])
		draw_colored_polygon(points, Color(0.055, 0.14, 0.10, 0.88))
		var inner := PackedVector2Array()
		for p in points:
			inner.append(c + (p - c) * 0.72 + Vector2(-2, -2))
		draw_colored_polygon(inner, Color(0.10, 0.25, 0.16, 0.84))
		if bool(patch["light"]):
			draw_rect(Rect2((c + Vector2(-r.x * 0.34, -r.y * 0.55)).round(), Vector2(maxf(5.0, r.x * 0.42), 2)), Color(0.28, 0.47, 0.27, 0.62), true)

func _draw_roots() -> void:
	for root in _roots:
		var points := PackedVector2Array([root["start"], root["mid"], root["end"]])
		var width: float = float(root["width"])
		# dark underside then warm upper ridge provides height without baked shadow.
		draw_polyline(points, Color(0.13, 0.085, 0.06, 0.90), width + 3.0)
		draw_polyline(points, Color(0.29, 0.18, 0.105, 0.96), width)
		draw_polyline(points, Color(0.43, 0.28, 0.15, 0.78), maxf(1.0, width * 0.28))
		var end: Vector2 = root["end"]
		var inward: Vector2 = (CENTER - end).normalized()
		var tangent := inward.rotated(PI * 0.5)
		draw_line(end, end + inward * 15.0 + tangent * 6.0, Color(0.24, 0.14, 0.08, 0.88), 3.0)
		draw_line(end, end + inward * 12.0 - tangent * 7.0, Color(0.20, 0.12, 0.07, 0.84), 2.0)
		if bool(root["accent"]):
			draw_line(root["mid"], root["end"], Color(0.49, 0.35, 0.72, 0.48), 1.0)

func _draw_stone_anchors() -> void:
	for stone in _stones:
		var p: Vector2 = stone["position"]
		var size: Vector2 = stone["size"]
		var lower := Rect2(p - Vector2(size.x * 0.5, 0), Vector2(size.x, size.y))
		draw_rect(lower, Color(0.20, 0.24, 0.23, 0.86), true)
		draw_rect(Rect2(lower.position + Vector2(1, -2), Vector2(maxf(2.0, size.x - 3.0), 2)), Color(0.39, 0.43, 0.39, 0.82), true)
		if bool(stone["prism"]):
			draw_rect(Rect2(p + Vector2(0, -4), Vector2(2, 4)), Color(0.55, 0.36, 0.96, 0.72), true)
			draw_rect(Rect2(p + Vector2(1, -5), Vector2(1, 2)), Color(0.84, 0.79, 1.0, 0.74), true)

func _draw_resonance_marks() -> void:
	# Sparse violet/cyan marks make this recognisably Xethkioz without turning the
	# boss floor into a neon arena.
	for index in range(6):
		var angle := TAU * float(index) / 6.0 + 0.24
		var radius := 151.0 + float(index % 2) * 8.0
		var p := (CENTER + Vector2.from_angle(angle) * radius).round()
		var color_value := Color(0.55, 0.36, 0.96, 0.44) if index % 2 == 0 else Color(0.25, 0.78, 0.79, 0.40)
		draw_rect(Rect2(p + Vector2(-2, -1), Vector2(5, 2)), color_value, true)
		draw_rect(Rect2(p + Vector2(0, -3), Vector2(1, 6)), color_value, true)

func _roll(index: int, salt: int) -> int:
	var n := _seed_value ^ (index * 73856093) ^ (salt * 19349663)
	n = (n ^ (n >> 13)) * 1274126177
	return absi(n)

func _signed_roll(index: int, salt: int, span: int) -> int:
	return posmod(_roll(index, salt), span * 2 + 1) - span
