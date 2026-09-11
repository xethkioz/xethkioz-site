class_name IzrdralarAuthoredLandmarkPass04
extends "res://src/world/izrdralar_authored_landmark_pass02.gd"

# Pass 04 preserves the original landmark atlas and collision contract while
# giving the repeated Aldea del Alba houses small authored identities.

func _build_visual() -> void:
	super._build_visual()
	if not landmark_id.begins_with("alba_house"):
		return
	if is_instance_valid(_sprite):
		_sprite.flip_h = landmark_id == "alba_house_east"
	_build_house_identity_details()

func _build_house_identity_details() -> void:
	var old := get_node_or_null("IdentityDetails")
	if old != null:
		remove_child(old)
		old.queue_free()
	var root := Node2D.new()
	root.name = "IdentityDetails"
	add_child(root)
	var s := visual_scale
	if landmark_id == "alba_house_west":
		# Small herb bed + timber stack: warmer, lived-in western residence.
		_add_polygon(root, _scaled([
			Vector2(-52, 26), Vector2(-27, 26), Vector2(-25, 32), Vector2(-54, 32)
		], s), Color("315f3f"), -1)
		_add_pixel(root, Vector2(-46, 23) * s, Color("8fcf78"), 0, 3.0 * s)
		_add_pixel(root, Vector2(-38, 24) * s, Color("6ed4e8"), 0, 2.0 * s)
		_add_polygon(root, _scaled([
			Vector2(34, 24), Vector2(50, 24), Vector2(48, 28), Vector2(35, 28)
		], s), Color("765030"), -1)
	else:
		# East house gets a cool prism marker and a compact bench/landing.
		_add_polygon(root, _scaled([
			Vector2(-48, 25), Vector2(-24, 25), Vector2(-22, 30), Vector2(-50, 30)
		], s), Color("5a4838"), -1)
		_add_pixel(root, Vector2(43, 20) * s, Color("8b5cf6"), 0, 4.0 * s)
		_add_pixel(root, Vector2(43, 16) * s, Color("d7c7ff"), 1, 2.0 * s)
		_add_polygon(root, _scaled([
			Vector2(27, 27), Vector2(51, 27), Vector2(48, 31), Vector2(29, 31)
		], s), Color("2f5f63"), -1)
