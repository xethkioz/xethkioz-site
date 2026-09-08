extends Node

const CHUNK_PIXELS := 512
const LAKE_CHUNK := Vector2(1, 1)
const LAKE_CENTER_LOCAL := Vector2(344, 184)
const WATER_SAFETY_RADIUS := 136.0
const CARPINCHITO_LOCAL := Vector2(272, 326)
const SAFE_SHORE_LOCAL := Vector2(230, 300)

func _ready() -> void:
	_migrate_legacy_lake_save()
	call_deferred("_align_runtime_entities")

func _world_from_local(local_pos: Vector2) -> Vector2:
	return Vector2(LAKE_CHUNK.x * CHUNK_PIXELS, LAKE_CHUNK.y * CHUNK_PIXELS) + local_pos

func _migrate_legacy_lake_save() -> void:
	var saved := GameState.last_world_position
	if saved == Vector2.ZERO:
		return
	var lake_center := _world_from_local(LAKE_CENTER_LOCAL)
	if saved.distance_to(lake_center) < WATER_SAFETY_RADIUS:
		GameState.set_last_world_position(_world_from_local(SAFE_SHORE_LOCAL))
		SaveService.save_game()

func _align_runtime_entities() -> void:
	var world := get_parent()
	if world == null:
		return
	var carpinchito := world.get_node_or_null("CarpinchitoCristal") as Node2D
	if is_instance_valid(carpinchito):
		carpinchito.global_position = _world_from_local(CARPINCHITO_LOCAL)
