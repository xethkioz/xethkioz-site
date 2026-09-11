extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const LARGE_PROPS := preload("res://assets/production/izrdralar/large_props.svg")
const LANDMARKS := preload("res://assets/production/izrdralar/landmarks.svg")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	_validate_environment_atlases()
	SaveService.delete_save()
	GameState.reset_new_game()
	for map_id in ["M01", "M02", "M03", "M04", "M05"]:
		GameState.world_flags.clear()
		GameState.set_world_checkpoint(map_id, _entry_for(map_id), Vector2.ZERO)
		var runtime := RUNTIME_SCENE.instantiate()
		get_tree().root.add_child(runtime)
		await get_tree().process_frame
		await get_tree().process_frame
		var chunk_count := 0
		var boss_forest_found := false
		for child in runtime.get_children():
			if not child.name.begins_with("Chunk_"):
				continue
			chunk_count += 1
			var texture_pass := child.get_node_or_null("GroundTexturePass03")
			if texture_pass == null:
				failures.append("%s %s missing GroundTexturePass03" % [map_id, child.name])
			else:
				var marks: Variant = texture_pass.get("_marks")
				if not (marks is Array) or (marks as Array).is_empty():
					failures.append("%s %s ground texture contains no biome marks" % [map_id, child.name])
			var edge_pass := child.get_node_or_null("TerrainEdgePass03")
			if edge_pass == null:
				failures.append("%s %s missing TerrainEdgePass03" % [map_id, child.name])
			var boss_forest := child.get_node_or_null("BossForestPass03")
			if boss_forest != null:
				boss_forest_found = true
				var roots: Variant = boss_forest.get("_roots")
				if not (roots is Array) or (roots as Array).size() != 8:
					failures.append("%s boss forest must expose eight framing root systems" % map_id)
		if chunk_count <= 0:
			failures.append("%s spawned no authored chunks" % map_id)
		if map_id == "M05" and not boss_forest_found:
			failures.append("M05 missing Corazon del Bosque forest framing pass")
		if map_id != "M05" and boss_forest_found:
			failures.append("%s unexpectedly spawned BossForestPass03" % map_id)
		runtime.queue_free()
		await get_tree().process_frame
	SaveService.delete_save()
	_finish()

func _validate_environment_atlases() -> void:
	if LARGE_PROPS == null:
		failures.append("large prop atlas did not load")
	elif LARGE_PROPS.get_width() != 288 or LARGE_PROPS.get_height() != 48:
		failures.append("large prop atlas must remain 288x48 / six 48px frames")
	if LANDMARKS == null:
		failures.append("landmark atlas did not load")
	elif LANDMARKS.get_width() != 384 or LANDMARKS.get_height() != 80:
		failures.append("landmark atlas must remain 384x80 / four 96x80 frames")

func _entry_for(map_id: String) -> String:
	match map_id:
		"M01": return "start"
		"M02": return "from_m01"
		"M03": return "from_m02"
		"M04": return "from_m02"
		"M05": return "from_m03"
		_: return "start"

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_GROUND_TEXTURE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_GROUND_TEXTURE_FAIL")
	get_tree().quit(1)
