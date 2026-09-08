extends "res://scripts/main_v22.gd"

# World of Xethkioz — Golden Slice Production v0.10.3
# Terrain visual pass: collision geometry remains simple, but visible ground is
# tiled organic Izrdralar soil + moss/stone instead of flat debug rectangles.

func _add_platform(rect: Rect2,color: Color) -> void:
	if current_map < 1 or current_map > 5:
		super._add_platform(rect,color)
		return

	var body := StaticBody2D.new()
	body.collision_layer = 2
	body.collision_mask = 0
	body.position = rect.position + rect.size/2.0

	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = rect.size
	cs.shape = sh
	body.add_child(cs)

	# Ground fill uses the production soil tile. Physics stays rectangular and
	# invisible; the artwork is what the player actually reads.
	var fill := TextureRect.new()
	fill.position = -rect.size/2.0
	fill.size = rect.size
	fill.texture = TILE_GROUND
	fill.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	fill.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	fill.stretch_mode = TextureRect.STRETCH_TILE
	fill.mouse_filter = Control.MOUSE_FILTER_IGNORE
	fill.modulate = Color(0.92,0.98,0.94,1.0)
	body.add_child(fill)

	# Mossy top edge visually integrates the collision into the forest floor.
	var lip_height := minf(16.0,rect.size.y)
	var lip := TextureRect.new()
	lip.position = Vector2(-rect.size.x/2.0,-rect.size.y/2.0-2.0)
	lip.size = Vector2(rect.size.x,lip_height)
	lip.texture = TILE_PLATFORM
	lip.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	lip.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	lip.stretch_mode = TextureRect.STRETCH_TILE
	lip.mouse_filter = Control.MOUSE_FILTER_IGNORE
	lip.z_index = 2
	body.add_child(lip)

	# Sparse roots/crystal flecks stop long ground segments looking mechanically
	# repeated while adding no extra collision complexity.
	if rect.size.x >= 420.0:
		var root_count := clampi(int(rect.size.x/430.0),1,6)
		for i in range(root_count):
			var root := Line2D.new()
			var local_x := -rect.size.x/2.0 + 150.0 + float(i)*minf(430.0,rect.size.x/float(root_count))
			root.points = PackedVector2Array([
				Vector2(local_x,-rect.size.y/2.0+18.0),
				Vector2(local_x+12.0,-rect.size.y/2.0+36.0),
				Vector2(local_x+4.0,-rect.size.y/2.0+54.0)
			])
			root.width = 3.0
			root.default_color = Color(0.30,0.20,0.16,0.70)
			root.z_index = 3
			body.add_child(root)

	world.add_child(body)
