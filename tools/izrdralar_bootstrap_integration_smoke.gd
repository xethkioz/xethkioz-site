extends Node

const BOOTSTRAP_SCENE := preload("res://scenes/v34/GameBootstrap.tscn")
const EXPECTED_RUNTIME := "res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn"

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	if not ResourceLoader.exists(EXPECTED_RUNTIME):
		_fail("authored M01-M05 runtime scene is missing")

	var bootstrap := BOOTSTRAP_SCENE.instantiate()
	add_child(bootstrap)
	await get_tree().process_frame
	if not bootstrap.has_method("world_scene_path"):
		_fail("production bootstrap does not expose world_scene_path")
	else:
		var path := str(bootstrap.call("world_scene_path"))
		if path != EXPECTED_RUNTIME:
			_fail("production bootstrap target mismatch: %s" % path)
	if not bootstrap.has_method("_enter_world"):
		_fail("production bootstrap is missing new-game world entry")
	if not bootstrap.has_method("_continue_game"):
		_fail("production bootstrap is missing continue flow")

	bootstrap.queue_free()
	await get_tree().process_frame
	_finish()

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_BOOTSTRAP_INTEGRATION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_BOOTSTRAP_INTEGRATION_FAIL")
	get_tree().quit(1)
