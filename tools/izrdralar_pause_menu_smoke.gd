extends Node

const PauseMenuScript := preload("res://src/ui/izrdralar_pause_menu.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	get_tree().paused = false
	var menu := CanvasLayer.new()
	menu.name = "PauseMenuSmoke"
	menu.set_script(PauseMenuScript)
	add_child(menu)
	await get_tree().process_frame

	if menu.process_mode != Node.PROCESS_MODE_ALWAYS:
		failures.append("pause menu does not process while tree is paused")
	if bool(menu.get("_is_open")):
		failures.append("pause menu starts open")
	var root: Control = menu.get("_root") as Control
	if root == null or root.visible:
		failures.append("pause root should start hidden")

	menu.call("_open_pause")
	if not get_tree().paused:
		failures.append("opening pause menu did not pause SceneTree")
	if not bool(menu.get("_is_open")):
		failures.append("pause menu open state not recorded")
	if root == null or not root.visible:
		failures.append("pause root did not become visible")

	# Close synchronously before awaiting another frame; the smoke node itself is
	# intentionally not ALWAYS and should never depend on frames while paused.
	menu.call("_close_pause")
	if get_tree().paused:
		failures.append("closing pause menu left SceneTree paused")
	if bool(menu.get("_is_open")):
		failures.append("pause menu close state not recorded")
	if root != null and root.visible:
		failures.append("pause root remained visible after close")

	var resume: Button = menu.get("_resume_button") as Button
	var status: Label = menu.get("_status_label") as Label
	if resume == null:
		failures.append("pause menu missing resume button")
	if status == null:
		failures.append("pause menu missing save status label")

	menu.queue_free()
	await get_tree().process_frame
	_finish()

func _finish() -> void:
	get_tree().paused = false
	if failures.is_empty():
		print("IZRDRALAR_PAUSE_MENU_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_PAUSE_MENU_FAIL")
	get_tree().quit(1)
