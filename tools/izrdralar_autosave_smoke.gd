extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const TEST_POSITION := Vector2(333, 444)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M04", "from_m02", Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	get_tree().root.add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame

	var saved_position := Vector2.ZERO
	var player := runtime.get_node_or_null("Player")
	var tracker := runtime.get_node_or_null("CheckpointTracker")
	if player == null or tracker == null:
		_fail("M04 runtime missing player or checkpoint tracker")
	else:
		# First allow CharacterBody2D collision recovery to settle without autosaving mid-correction.
		tracker.set("autosave_interval", 999.0)
		tracker.set("autosave_distance", 1.0)
		player.global_position = TEST_POSITION
		for _index in range(12):
			await get_tree().physics_frame
		saved_position = player.global_position
		if saved_position == Vector2.ZERO:
			_fail("physics-valid autosave position was zero")
		else:
			# Trigger the same throttled autosave path once the position is stable.
			tracker.set("autosave_interval", 0.01)
			tracker.set("_autosave_elapsed", 0.02)
			tracker.call("_try_autosave")
			if not SaveService.has_save():
				_fail("position autosave did not create a recoverable save")

	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame

	GameState.reset_new_game()
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_fail("autosave could not reload")
	else:
		if GameState.current_map_id != "M04" or GameState.current_entry_id != "from_m02":
			_fail("autosave lost M04/from_m02 identity")
		if not GameState.last_world_position.is_equal_approx(saved_position):
			_fail("autosave lost physics-valid exact position: saved=%s loaded=%s" % [saved_position, GameState.last_world_position])

	SaveService.delete_save()
	_finish()

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_AUTOSAVE_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_AUTOSAVE_FAIL")
	get_tree().quit(1)
