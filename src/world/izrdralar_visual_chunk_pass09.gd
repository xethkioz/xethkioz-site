class_name IzrdralarVisualChunkPass09
extends "res://src/world/izrdralar_visual_chunk_pass08.gd"

const AUTHORED_GROUND_LANDMARKS := preload("res://assets/production/izrdralar/authored_ground_landmarks.svg")
const LANDMARK_FRAME_SIZE := Vector2(192, 160)

# Pass 09 adds one low-frequency ground signature to the maps that still read
# too generic in real 640x360 captures. These are transparent visual inlays:
# they do not own collision, objectives or puzzle logic.
func _build() -> void:
	super._build()
	_install_authored_ground_landmark()

func _install_authored_ground_landmark() -> void:
	match authored_world_seed:
		M01_WORLD_SEED:
			if chunk_coord == Vector2i(1, 1):
				_place_authored_ground_landmark(0, Vector2(178, 8), "CuencaResonanceBasin")
		M02_WORLD_SEED:
			if chunk_coord == Vector2i(1, 0):
				_place_authored_ground_landmark(1, Vector2(18, 500), "AlbaPrismaPlaza")
		M04_WORLD_SEED:
			if chunk_coord == Vector2i(1, 1):
				_place_authored_ground_landmark(2, Vector2(248, 218), "SanctuaryRuneChannels")

func _place_authored_ground_landmark(frame: int, local_position: Vector2, node_name: String) -> void:
	var sprite := Sprite2D.new()
	sprite.name = node_name
	var atlas := AtlasTexture.new()
	atlas.atlas = AUTHORED_GROUND_LANDMARKS
	atlas.region = Rect2(Vector2(frame * int(LANDMARK_FRAME_SIZE.x), 0), LANDMARK_FRAME_SIZE)
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = local_position
	sprite.z_index = -9
	add_child(sprite)
