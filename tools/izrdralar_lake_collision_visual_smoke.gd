extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const Factory := preload("res://src/world/production_tileset_factory.gd")

const LAKE_CHUNKS := ["Chunk_1_0", "Chunk_0_1"]
const BLOCKER_CENTER := Vector2(344, 184)
const BLOCKER_RADIUS := 124.0
const SAMPLE_STEP := 4

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.world_flags.clear()
	GameState.set_world_checkpoint("M03", "from_m02", Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	get_tree().root.add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame

	for chunk_name in LAKE_CHUNKS:
		_validate_lake_chunk(runtime, chunk_name)

	runtime.queue_free()
	await get_tree().process_frame
	SaveService.delete_save()
	_finish()

func _validate_lake_chunk(runtime: Node, chunk_name: String) -> void:
	var chunk := runtime.get_node_or_null(chunk_name)
	if chunk == null:
		failures.append("M03 missing authored lake chunk %s" % chunk_name)
		return
	var ground := chunk.get_node_or_null("Ground") as TileMapLayer
	if ground == null:
		failures.append("%s missing Ground TileMapLayer" % chunk_name)
		return

	var sampled := 0
	var dry_points: Array[Vector2] = []
	for py in range(-int(BLOCKER_RADIUS), int(BLOCKER_RADIUS) + 1, SAMPLE_STEP):
		for px in range(-int(BLOCKER_RADIUS), int(BLOCKER_RADIUS) + 1, SAMPLE_STEP):
			var offset := Vector2(px, py)
			if offset.length() > BLOCKER_RADIUS:
				continue
			sampled += 1
			var local_point := BLOCKER_CENTER + offset
			var cell := ground.local_to_map(local_point)
			var tile := ground.get_cell_atlas_coords(cell)
			if not Factory.is_water(tile):
				dry_points.append(local_point)
				if dry_points.size() >= 8:
					break
		if dry_points.size() >= 8:
			break

	if sampled < 1000:
		failures.append("%s lake blocker alignment smoke sampled too few points: %d" % [chunk_name, sampled])
	if not dry_points.is_empty():
		failures.append("%s blocker reaches visually dry tiles near %s" % [chunk_name, str(dry_points)])

	# The macro shoreline must not regress to a perfect circular disk. Sample the
	# last visible water distance on 24 rays and require meaningful variation.
	var extents: Array[float] = []
	for ray in range(24):
		var angle := TAU * float(ray) / 24.0
		var direction := Vector2(cos(angle), sin(angle))
		var last_water := 0.0
		for sample_index in range(1, 49):
			var radius := float(sample_index) * 4.0
			var point := BLOCKER_CENTER + direction * radius
			var cell := ground.local_to_map(point)
			var tile := ground.get_cell_atlas_coords(cell)
			if Factory.is_water(tile):
				last_water = radius
			else:
				break
		extents.append(last_water)

	var min_extent := extents[0]
	var max_extent := extents[0]
	for extent in extents:
		min_extent = minf(min_extent, extent)
		max_extent = maxf(max_extent, extent)
	if max_extent - min_extent < 12.0:
		failures.append("%s shoreline variation too small: %.1f px" % [chunk_name, max_extent - min_extent])

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_LAKE_COLLISION_VISUAL_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_LAKE_COLLISION_VISUAL_FAIL")
	get_tree().quit(1)
