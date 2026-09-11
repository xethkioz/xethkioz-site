class_name IzrdralarVisualChunkPass04
extends "res://src/world/izrdralar_visual_chunk_pass02.gd"

const GroundTexturePass04 := preload("res://src/world/izrdralar_ground_texture_pass04.gd")

# Visual Pass 04 only changes presentation. Navigation, collisions, exits and
# authored encounter positions remain exactly as defined by the production data.

func _install_ground_texture_pass() -> void:
	if not is_instance_valid(_ground) or get_node_or_null("GroundTexturePass04") != null:
		return
	var old := get_node_or_null("GroundTexturePass03")
	if old != null:
		remove_child(old)
		old.queue_free()
	var texture_pass := Node2D.new()
	texture_pass.name = "GroundTexturePass04"
	texture_pass.set_script(GroundTexturePass04)
	add_child(texture_pass)
	texture_pass.call("configure", _ground, biome, seed_value)

func _paint_boss_arena() -> void:
	# The old arena used a near-perfect circular threshold. At runtime that still
	# read as a test arena, so the same safe combat footprint is now expressed as
	# an irregular forest clearing with a broken fringe.
	var center := Vector2(16, 16)
	for y in range(CHUNK_TILES):
		for x in range(CHUNK_TILES):
			var delta := Vector2(float(x), float(y)) - center
			var distance := delta.length()
			var angle := atan2(delta.y, delta.x)
			var wobble := sin(angle * 3.0 + 0.65) * 0.85
			wobble += sin(angle * 7.0 - 0.35) * 0.48
			wobble += (float(_cell_roll(x + 701, y + 419) % 7) - 3.0) * 0.08
			var dirt_radius := 9.45 + wobble
			var fringe_radius := dirt_radius + 1.65
			if distance < dirt_radius:
				_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DIRT_VARIANTS, x, y, 121))
			elif distance < fringe_radius:
				var roll := _cell_roll(x + 613, y + 337)
				if roll % 4 != 0:
					_ground.set_cell(Vector2i(x, y), 0, _variant(Factory.DARK_GRASS_VARIANTS, x, y, 122))
				if roll % 3 != 0:
					_detail.set_cell(Vector2i(x, y), 0, _variant(Factory.CLIFF_VARIANTS, x, y, 123))
