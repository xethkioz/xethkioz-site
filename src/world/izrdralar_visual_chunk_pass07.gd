class_name IzrdralarVisualChunkPass07
extends "res://src/world/izrdralar_visual_chunk_pass06.gd"

const LARGE_PROPS_VARIANT_B := preload("res://assets/production/izrdralar/large_props_variant_b.svg")

# Visual Pass 07 keeps the validated Pass 06 composition and introduces a second
# original prop family with the exact same semantic frames/collision footprints.
# The swap is deterministic per authored cell, so runtime captures and QA remain
# reproducible while repeated trees, prisms, ruins, rocks and reeds stop reading
# as one repeated procedural stamp across M01-M05.
func _place_large_prop(cell: Vector2i, frame: int, collidable: bool) -> void:
	super._place_large_prop(cell, frame, collidable)
	if not is_instance_valid(_props) or _props.get_child_count() == 0:
		return
	if not _use_variant_b(cell, frame):
		return
	var visual := _props.get_child(_props.get_child_count() - 1)
	if not (visual is Sprite2D):
		return
	var atlas := AtlasTexture.new()
	atlas.atlas = LARGE_PROPS_VARIANT_B
	atlas.region = Rect2(Vector2(frame * 48, 0), Vector2(48, 48))
	(visual as Sprite2D).texture = atlas

func _use_variant_b(cell: Vector2i, frame: int) -> bool:
	var roll: int = _cell_roll(cell.x + 1009 + frame * 43, cell.y + 1877 + frame * 29)
	match frame:
		0, 1:
			# Trees are the most repeated silhouettes, so alternate them more often.
			return roll < 48
		2:
			# Prism landmarks remain rarer and more visually deliberate.
			return roll < 34
		3:
			return roll < 44
		4:
			return roll < 52
		5:
			return roll < 46
		_:
			return false
