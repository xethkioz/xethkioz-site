extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
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
		for child in runtime.get_children():
			if not child.name.begins_with("Chunk_"):
				continue
			chunk_count += 1
			var texture_pass := child.get_node_or_null("GroundTexturePass03")
			if texture_pass == null:
				failures.append("%s %s missing GroundTexturePass03" % [map_id, child.name])
				continue
			var marks: Variant = texture_pass.get("_marks")
			if not (marks is Array) or (marks as Array).is_empty():
				failures.append("%s %s ground texture contains no biome marks" % [map_id, child.name])
		if chunk_count <= 0:
			failures.append("%s spawned no authored chunks" % map_id)
		runtime.queue_free()
		await get_tree().process_frame
	SaveService.delete_save()
	_finish()

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
