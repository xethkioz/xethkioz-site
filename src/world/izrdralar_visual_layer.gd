extends Node2D

## Presentation-only layer for the Golden Region vertical slice.
## Keep gameplay/collision logic out of this script so art iteration stays safe.

func _ready() -> void:
	z_index = -35
	_build_ground()
	_build_water()
	_build_ruins()
	_build_vegetation()
	_build_prism_accents()

func _build_ground() -> void:
	_draw_patch(Rect2(0, 0, 1280, 720), Color("1c322d"), -40)
	_draw_patch(Rect2(36, 68, 338, 226), Color("29493d"), -39)
	_draw_patch(Rect2(255, 374, 452, 264), Color("273c31"), -39)
	_draw_patch(Rect2(750, 72, 450, 280), Color("3f3a34"), -39)
	_draw_patch(Rect2(750, 390, 380, 240), Color("312d39"), -39)

func _build_water() -> void:
	var lake := Polygon2D.new()
	lake.polygon = PackedVector2Array([
		Vector2(442, 90), Vector2(505, 62), Vector2(620, 72), Vector2(708, 118),
		Vector2(724, 205), Vector2(676, 286), Vector2(560, 306), Vector2(462, 272),
		Vector2(422, 190)
	])
	lake.color = Color("244958")
	lake.z_index = -37
	add_child(lake)
	for i in 5:
		var ripple := Line2D.new()
		ripple.width = 1.0
		ripple.default_color = Color(0.43, 0.83, 0.91, 0.18)
		ripple.points = PackedVector2Array([
			Vector2(480 + i * 36, 155 + (i % 2) * 24),
			Vector2(520 + i * 36, 149 + (i % 2) * 24),
			Vector2(558 + i * 36, 157 + (i % 2) * 24)
		])
		ripple.z_index = -36
		add_child(ripple)

func _build_ruins() -> void:
	for rect in [
		Rect2(805, 122, 58, 18), Rect2(874, 166, 86, 22), Rect2(982, 116, 28, 82),
		Rect2(1040, 226, 94, 18), Rect2(890, 260, 64, 16)
	]:
		_draw_patch(rect, Color("6a5c4a"), -34)
		var prism := Polygon2D.new()
		prism.position = rect.position + rect.size * 0.5
		prism.polygon = PackedVector2Array([Vector2(0,-7), Vector2(4,0), Vector2(0,7), Vector2(-4,0)])
		prism.color = Color(0.55, 0.36, 0.96, 0.48)
		prism.z_index = -33
		add_child(prism)

func _build_vegetation() -> void:
	var tree_points := [
		Vector2(72,104), Vector2(124,78), Vector2(186,92), Vector2(328,118),
		Vector2(92,266), Vector2(300,286), Vector2(344,432), Vector2(410,402),
		Vector2(516,584), Vector2(620,432), Vector2(670,566), Vector2(1160,302)
	]
	for p in tree_points:
		var trunk := ColorRect.new()
		trunk.position = p + Vector2(-2, 4)
		trunk.size = Vector2(4, 13)
		trunk.color = Color("66503e")
		trunk.mouse_filter = Control.MOUSE_FILTER_IGNORE
		trunk.z_index = -32
		add_child(trunk)
		var canopy := Polygon2D.new()
		canopy.position = p
		canopy.polygon = PackedVector2Array([Vector2(0,-13),Vector2(11,-2),Vector2(7,9),Vector2(-8,10),Vector2(-12,-2)])
		canopy.color = Color("315847")
		canopy.z_index = -31
		add_child(canopy)

func _build_prism_accents() -> void:
	for p in [Vector2(226,132), Vector2(602,98), Vector2(790,302), Vector2(1018,164), Vector2(914,510)]:
		var glow := Polygon2D.new()
		glow.position = p
		glow.polygon = PackedVector2Array([Vector2(0,-11), Vector2(6,0), Vector2(0,11), Vector2(-6,0)])
		glow.color = Color(0.55, 0.36, 0.96, 0.42)
		glow.z_index = -30
		add_child(glow)

func _draw_patch(rect: Rect2, color: Color, layer: int) -> void:
	var patch := ColorRect.new()
	patch.position = rect.position
	patch.size = rect.size
	patch.color = color
	patch.mouse_filter = Control.MOUSE_FILTER_IGNORE
	patch.z_index = layer
	add_child(patch)
