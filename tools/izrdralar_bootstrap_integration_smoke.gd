extends Node

const BOOTSTRAP_SCENE := preload("res://scenes/v34/GameBootstrap.tscn")
const EXPECTED_RUNTIME := "res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn"

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	SaveService.delete_save()
	GameState.reset_new_game()
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

	if not SaveService.save_game({"intro_seen": false, "bootstrap_smoke": true}):
		_fail("could not prepare pending-intro save")
	else:
		bootstrap.call("_continue_game")
		await get_tree().process_frame
		if int(bootstrap.get("intro_index")) != 0:
			_fail("Continue did not restart pending intro from chapter zero")
		if not _contains_label_text(bootstrap, "CAPÍTULO CERO"):
			_fail("Continue skipped pending intro instead of rendering it")

	bootstrap.queue_free()
	await get_tree().process_frame
	SaveService.delete_save()
	_finish()

func _contains_label_text(node: Node, fragment: String) -> bool:
	if node is Label and fragment in (node as Label).text:
		return true
	for child in node.get_children():
		if _contains_label_text(child, fragment):
			return true
	return false

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
