class_name IzrdralarVisualChunkPass08
extends "res://src/world/izrdralar_visual_chunk_pass07.gd"

const GROUND_ACCENTS := preload("res://assets/production/izrdralar/ground_accents.svg")

# Pass 08 addresses the remaining clean/procedural floor read without changing
# traversal. Every accent is visual-only, deterministic and restricted to a
# compatible existing ground family. No collision, route, encounter or story
# coordinate is added or moved here.
func _build() -> void:
	super._build()
	_install_ground_accents()

func _install_ground_accents() -> void:
	if not is_instance_valid(_ground) or get_node_or_null("GroundAccentsPass08") != null:
		return
	var accents := Node2D.new()
	accents.name = "GroundAccentsPass08"
	accents.z_index = -8
	add_child(accents)

	match authored_world_seed:
		M01_WORLD_SEED:
			if biome == "river":
				_scatter_accents(accents, [5, 0, 2, 1], 7, 801)
			else:
				_scatter_accents(accents, [0, 2, 3, 1], 10, 811)
		M02_WORLD_SEED:
			if biome == "refuge":
				_scatter_accents(accents, [0, 3, 1], 6, 821)
				_scatter_accents(accents, [4], 7, 823)
			else:
				_scatter_accents(accents, [0, 2, 3], 7, 827)
		M03_WORLD_SEED:
			if biome == "lake":
				_scatter_accents(accents, [5, 5, 3, 1], 9, 839)
			else:
				_scatter_accents(accents, [0, 3, 2, 1], 8, 853)
		M04_WORLD_SEED:
			if biome == "ruins":
				_scatter_accents(accents, [6], 10, 857)
				_scatter_accents(accents, [0, 1], 4, 859)
			elif biome == "sanctuary":
				_scatter_accents(accents, [6, 7, 7], 11, 863)
			else:
				_scatter_accents(accents, [0, 2, 1], 7, 877)
		M05_WORLD_SEED:
			# Boss 5 readability and telegraph contrast remain authoritative.
			pass

func _scatter_accents(layer: Node2D, frames: Array, target_count: int, salt: int) -> void:
	if frames.is_empty() or target_count <= 0:
		return
	var used := {}
	var placed := 0
	var max_attempts := target_count * 20
	for index in range(max_attempts):
		if placed >= target_count:
			break
		var x_roll := _cell_roll(index * 17 + salt, index * index + salt * 3)
		var y_roll := _cell_roll(index * 29 + salt * 5, index * index * 3 + salt)
		var cell := Vector2i(2 + posmod(x_roll + index * 7, 28), 2 + posmod(y_roll + index * 11, 28))
		var key := "%d,%d" % [cell.x, cell.y]
		if used.has(key):
			continue
		var frame := int(frames[posmod(_cell_roll(cell.x + salt, cell.y + index), frames.size())])
		var base: Vector2i = _ground.get_cell_atlas_coords(cell)
		if not _accent_allowed(base, frame):
			continue
		used[key] = true
		_place_ground_accent(layer, cell, frame, salt + index)
		placed += 1

func _accent_allowed(base: Vector2i, frame: int) -> bool:
	if Factory.is_water(base) or Factory.is_bridge(base):
		return false
	match frame:
		4:
			return Factory.is_path(base)
		6, 7:
			return Factory.is_ruin_floor(base)
		_:
			return not Factory.is_protected_ground(base)

func _place_ground_accent(layer: Node2D, cell: Vector2i, frame: int, salt: int) -> void:
	var sprite := Sprite2D.new()
	var atlas := AtlasTexture.new()
	atlas.atlas = GROUND_ACCENTS
	atlas.region = Rect2(Vector2(frame * 32, 0), Vector2(32, 32))
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = Vector2(cell.x * TILE_SIZE + 8, cell.y * TILE_SIZE + 8)
	var orientation_roll := _cell_roll(cell.x + salt * 5, cell.y + salt * 7)
	sprite.flip_h = (orientation_roll % 2) == 0
	sprite.flip_v = (orientation_roll % 5) == 0 and frame in [0, 1, 4, 6, 7]
	layer.add_child(sprite)
