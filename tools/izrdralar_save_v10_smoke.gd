extends Node

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()

	GameState.set_world_checkpoint("M03", "from_m02", Vector2(321.5, 144.25))
	GameState.set_world_flag("prisma_atlas_unlocked")
	GameState.set_world_flag("lake_resolved")
	if not SaveService.save_game({"smoke_marker": "first", "intro_seen": true, "runtime": "m01_m05"}):
		_fail("first save failed")

	GameState.set_world_checkpoint("M04", "from_m02", Vector2(812.0, 512.0))
	GameState.set_world_flag("ruins_sanctuary_resolved")
	# Simulates later autosaves/objective saves that do not explicitly resend intro/runtime metadata.
	if not SaveService.save_game({"smoke_marker": "second"}):
		_fail("second save failed")

	GameState.reset_new_game()
	var loaded: Dictionary = SaveService.load_game()
	if loaded.is_empty():
		_fail("live save failed to load")
	_assert_checkpoint("M04", "from_m02", Vector2(812.0, 512.0), "live save")
	if not GameState.has_world_flag("lake_resolved") or not GameState.has_world_flag("ruins_sanctuary_resolved"):
		_fail("world flags were not restored from live save")
	_assert_persistent_metadata(loaded, "live save after metadata-free autosave")

	_corrupt_live_save()
	GameState.reset_new_game()
	if not SaveService.has_save():
		_fail("backup should keep has_save true after live corruption")
	var recovered: Dictionary = SaveService.load_game()
	if recovered.is_empty():
		_fail("backup recovery failed")
	_assert_checkpoint("M03", "from_m02", Vector2(321.5, 144.25), "backup recovery")
	if not GameState.has_world_flag("lake_resolved"):
		_fail("backup did not restore first-save world flags")
	if GameState.has_world_flag("ruins_sanctuary_resolved"):
		_fail("backup unexpectedly contains second-save-only flag")
	_assert_persistent_metadata(recovered, "backup recovery")

	# Recovery rewrites a valid live save. Confirm persistent metadata survives that rewrite too.
	GameState.reset_new_game()
	var reloaded_after_recovery := SaveService.load_game()
	if reloaded_after_recovery.is_empty():
		_fail("rewritten recovery save failed to load")
	else:
		_assert_persistent_metadata(reloaded_after_recovery, "rewritten recovery save")
		_assert_checkpoint("M03", "from_m02", Vector2(321.5, 144.25), "rewritten recovery save")

	SaveService.delete_save()
	_finish()

func _corrupt_live_save() -> void:
	var file := FileAccess.open(SaveService.SAVE_PATH, FileAccess.WRITE)
	if file == null:
		_fail("could not open live save for corruption test")
		return
	file.store_string("{corrupted-json")
	file.close()

func _assert_persistent_metadata(payload: Dictionary, label: String) -> void:
	if not bool(payload.get("intro_seen", false)):
		_fail("%s lost intro_seen=true" % label)
	if str(payload.get("runtime", "")) != "m01_m05":
		_fail("%s lost runtime metadata" % label)

func _assert_checkpoint(expected_map: String, expected_entry: String, expected_position: Vector2, label: String) -> void:
	if GameState.current_map_id != expected_map:
		_fail("%s map mismatch: %s" % [label, GameState.current_map_id])
	if GameState.current_entry_id != expected_entry:
		_fail("%s entry mismatch: %s" % [label, GameState.current_entry_id])
	if not GameState.last_world_position.is_equal_approx(expected_position):
		_fail("%s position mismatch: %s" % [label, GameState.last_world_position])

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_SAVE_V10_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_SAVE_V10_FAIL")
	get_tree().quit(1)
