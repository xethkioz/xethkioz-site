extends "res://src/world/izrdralar_authored_landmark.gd"

# Terrain integration layer for authored landmarks. The atlas remains original
# World of Xethkioz art; this pass only adds pixel-snapped context around it so
# buildings/ruins stop reading like isolated stickers on top of the ground.

func _build_visual() -> void:
	super._build_visual()
	var old := get_node_or_null("VisualIntegration")
	if old != null:
		remove_child(old)
		old.queue_free()

	var integration := Node2D.new()
	integration.name = "VisualIntegration"
	add_child(integration)

	if landmark_id.begins_with("alba_house"):
		_build_house_integration(integration)
	elif landmark_id == "roots_sanctuary_gate":
		_build_sanctuary_integration(integration)
	elif landmark_id in ["living_ruin_tower", "awakening_ruin"]:
		_build_ruin_integration(integration)
	else:
		_build_neutral_integration(integration)

func _build_house_integration(root: Node2D) -> void:
	var s := visual_scale
	_add_polygon(root, _scaled([Vector2(-53, 18), Vector2(53, 18), Vector2(46, 32), Vector2(-46, 32)], s), Color("69513d"), -4)
	_add_polygon(root, _scaled([Vector2(-17, 17), Vector2(17, 17), Vector2(14, 28), Vector2(-14, 28)], s), Color("9b7450"), -2)
	_add_polygon(root, _scaled([Vector2(-50, 20), Vector2(-30, 20), Vector2(-32, 28), Vector2(-52, 28)], s), Color("315f3f"), -2)
	_add_polygon(root, _scaled([Vector2(30, 20), Vector2(50, 20), Vector2(52, 28), Vector2(32, 28)], s), Color("315f3f"), -2)
	_add_pixel(root, Vector2(-43, 20) * s, Color("d7c7ff"), -1, 2.0 * s)
	_add_pixel(root, Vector2(-36, 24) * s, Color("ff8c42"), -1, 2.0 * s)
	_add_pixel(root, Vector2(40, 21) * s, Color("6ed4e8"), -1, 2.0 * s)
	_add_pixel(root, Vector2(47, 25) * s, Color("d7c7ff"), -1, 2.0 * s)

func _build_sanctuary_integration(root: Node2D) -> void:
	var s := visual_scale
	_add_polygon(root, _scaled([Vector2(-58, 18), Vector2(58, 18), Vector2(50, 34), Vector2(-50, 34)], s), Color("4d5352"), -4)
	_add_polygon(root, _scaled([Vector2(-39, 21), Vector2(39, 21), Vector2(33, 31), Vector2(-33, 31)], s), Color("666d6b"), -3)
	_add_line(root, _scaled([Vector2(-52, 27), Vector2(-40, 19), Vector2(-30, 16)], s), Color("3f7246"), 3.0 * s, -2)
	_add_line(root, _scaled([Vector2(52, 27), Vector2(40, 19), Vector2(30, 16)], s), Color("3f7246"), 3.0 * s, -2)
	_add_pixel(root, Vector2(-47, 20) * s, Color("8b5cf6"), -1, 3.0 * s)
	_add_pixel(root, Vector2(47, 20) * s, Color("8b5cf6"), -1, 3.0 * s)

func _build_ruin_integration(root: Node2D) -> void:
	var s := visual_scale
	_add_polygon(root, _scaled([Vector2(-48, 20), Vector2(48, 20), Vector2(43, 33), Vector2(-43, 33)], s), Color("48504e"), -4)
	_add_polygon(root, _scaled([Vector2(-52, 23), Vector2(-38, 20), Vector2(-34, 29), Vector2(-50, 31)], s), Color("6b7270"), -2)
	_add_polygon(root, _scaled([Vector2(37, 21), Vector2(54, 24), Vector2(49, 31), Vector2(35, 28)], s), Color("5a6260"), -2)
	_add_line(root, _scaled([Vector2(-44, 19), Vector2(-34, 13), Vector2(-27, 17)], s), Color("376b42"), 2.0 * s, -2)
	_add_line(root, _scaled([Vector2(45, 19), Vector2(36, 12), Vector2(29, 16)], s), Color("376b42"), 2.0 * s, -2)
	_add_pixel(root, Vector2(-43, 24) * s, Color("a855f7"), -1, 2.0 * s)
	_add_pixel(root, Vector2(45, 25) * s, Color("3fc7c9"), -1, 2.0 * s)

func _build_neutral_integration(root: Node2D) -> void:
	var s := visual_scale
	_add_polygon(root, _scaled([Vector2(-42, 19), Vector2(42, 19), Vector2(38, 29), Vector2(-38, 29)], s), Color(0.12, 0.18, 0.16, 0.72), -4)

func _scaled(points: Array[Vector2], scale_value: float) -> PackedVector2Array:
	var scaled := PackedVector2Array()
	for point in points:
		scaled.append(point * scale_value)
	return scaled

func _add_polygon(root: Node2D, points: PackedVector2Array, color: Color, z_value: int) -> void:
	var polygon := Polygon2D.new()
	polygon.polygon = points
	polygon.color = color
	polygon.z_index = z_value
	root.add_child(polygon)

func _add_line(root: Node2D, points: PackedVector2Array, color: Color, width: float, z_value: int) -> void:
	var line := Line2D.new()
	line.points = points
	line.default_color = color
	line.width = maxf(1.0, width)
	line.antialiased = false
	line.z_index = z_value
	root.add_child(line)

func _add_pixel(root: Node2D, position_value: Vector2, color: Color, z_value: int, size_value: float) -> void:
	var half := maxf(1.0, size_value) * 0.5
	_add_polygon(root, PackedVector2Array([
		position_value + Vector2(0, -half),
		position_value + Vector2(half, 0),
		position_value + Vector2(0, half),
		position_value + Vector2(-half, 0)
	]), color, z_value)
