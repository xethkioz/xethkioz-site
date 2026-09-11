extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const EXPECTED_ENTRY_POSITION := Vector2(520, 900)

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	GameState.set_world_checkpoint("M03", "from_m02", Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	get_tree().root.add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame

	var player := runtime.get_node_or_null("Player")
	if player == null:
		_fail("M03 player did not spawn")
	else:
		player.global_position = Vector2(700, 700)
		GameState.set_last_world_position(Vector2(700, 700))
		player.take_damage(9999.0)
		await get_tree().process_frame
		if not player.global_position.is_equal_approx(EXPECTED_ENTRY_POSITION):
			_fail("lethal damage respawned outside authored entry: %s" % player.global_position)
		if GameState.current_map_id != "M03" or GameState.current_entry_id != "from_m02":
			_fail("respawn changed map or entry identity")
		if not GameState.last_world_position.is_equal_approx(EXPECTED_ENTRY_POSITION):
			_fail("respawn checkpoint did not synchronize exact safe position")

	GameState.reset_new_game()
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_fail("respawn save could not reload")
	else:
		if GameState.current_map_id != "M03" or GameState.current_entry_id != "from_m02":
			_fail("reloaded respawn lost map/entry")
		if not GameState.last_world_position.is_equal_approx(EXPECTED_ENTRY_POSITION):
			_fail("reloaded respawn lost exact safe position")

	if is_instance_valid(runtime):
		runtime.queue_free()
	await get_tree().process_frame
	SaveService.delete_save()
	_finish()

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_RESPAWN_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_RESPAWN_FAIL")
	get_tree().quit(1)
