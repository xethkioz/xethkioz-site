extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
	var cases := [
		{"id":"M01","entry":"start","chunks":4,"transitions":1,"objectives":1,"enemies":3,"npcs":0,"boss":false},
		{"id":"M02","entry":"from_m01","chunks":4,"transitions":3,"objectives":1,"enemies":0,"npcs":1,"boss":false},
		{"id":"M03","entry":"from_m02","chunks":4,"transitions":2,"objectives":1,"enemies":3,"npcs":0,"boss":false},
		{"id":"M04","entry":"from_m02","chunks":4,"transitions":2,"objectives":1,"enemies":3,"npcs":0,"boss":false},
		{"id":"M05","entry":"from_m03","chunks":1,"transitions":2,"objectives":1,"enemies":0,"npcs":0,"boss":true}
	]
	for test_case in cases:
		await _validate_map(test_case)
	SaveService.delete_save()
	_finish()

func _validate_map(test_case: Dictionary) -> void:
	GameState.world_flags.clear()
	GameState.set_world_checkpoint(str(test_case["id"]), str(test_case["entry"]), Vector2.ZERO)
	var runtime := RUNTIME_SCENE.instantiate()
	get_tree().root.add_child(runtime)
	await get_tree().process_frame
	await get_tree().process_frame

	var map_id := str(test_case["id"])
	var player := runtime.get_node_or_null("Player")
	if player == null or not player.is_in_group("player"):
		_fail("%s missing playable Player" % map_id)
	var xethkioz := runtime.get_node_or_null("Xethkioz")
	if xethkioz == null or not xethkioz.is_in_group("pets"):
		_fail("%s missing Xethkioz companion" % map_id)
	if runtime.get_node_or_null("HUD") == null:
		_fail("%s missing HUD" % map_id)
	if runtime.get_node_or_null("CheckpointTracker") == null:
		_fail("%s missing checkpoint tracker" % map_id)

	_assert_prefix_count(runtime, "Chunk_", int(test_case["chunks"]), "%s chunks" % map_id)
	_assert_prefix_count(runtime, "Transition_", int(test_case["transitions"]), "%s transitions" % map_id)
	_assert_prefix_count(runtime, "Objective_", int(test_case["objectives"]), "%s objectives" % map_id)
	_assert_group_count(runtime, "enemies", int(test_case["enemies"]) + (1 if bool(test_case["boss"]) else 0), "%s enemies" % map_id)
	_assert_group_minimum(runtime, "interactable", int(test_case["objectives"]) + int(test_case["npcs"]), "%s interactables minimum" % map_id)

	if bool(test_case["boss"]):
		var boss := runtime.get_node_or_null("Boss5Guardian")
		if boss == null or not boss.is_in_group("bosses"):
			_fail("M05 missing Boss 5 guardian")
	elif runtime.get_node_or_null("Boss5Guardian") != null:
		_fail("%s unexpectedly spawned Boss 5" % map_id)

	if GameState.current_map_id != map_id:
		_fail("%s changed GameState map during boot" % map_id)
	if GameState.current_entry_id != str(test_case["entry"]):
		_fail("%s changed entry during boot" % map_id)

	runtime.queue_free()
	await get_tree().process_frame

func _assert_prefix_count(parent: Node, prefix: String, expected: int, label: String) -> void:
	var count := 0
	for child in parent.get_children():
		if child.name.begins_with(prefix):
			count += 1
	if count != expected:
		_fail("%s expected=%d actual=%d" % [label, expected, count])

func _assert_group_count(parent: Node, group_name: String, expected: int, label: String) -> void:
	var count := 0
	for node in get_tree().get_nodes_in_group(group_name):
		if parent.is_ancestor_of(node):
			count += 1
	if count != expected:
		_fail("%s expected=%d actual=%d" % [label, expected, count])

func _assert_group_minimum(parent: Node, group_name: String, expected_minimum: int, label: String) -> void:
	var count := 0
	for node in get_tree().get_nodes_in_group(group_name):
		if parent.is_ancestor_of(node):
			count += 1
	if count < expected_minimum:
		_fail("%s expected-at-least=%d actual=%d" % [label, expected_minimum, count])

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_M01_M05_RUNTIME_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_M01_M05_RUNTIME_FAIL")
	get_tree().quit(1)
