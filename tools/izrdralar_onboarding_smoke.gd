extends Node

const GuideScript := preload("res://src/ui/izrdralar_onboarding_guide.gd")

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	GameState.reset_new_game()
	GameState.set_world_flag(GuideScript.COMPLETION_FLAG, false)

	var guide := CanvasLayer.new()
	guide.name = "OnboardingGuideSmoke"
	guide.set_script(GuideScript)
	guide.call("configure", "M01", false)
	add_child(guide)
	await get_tree().process_frame

	var label: Label = guide.get("_label") as Label
	if label == null or not label.text.contains("MOVER"):
		failures.append("onboarding did not start with movement hint")

	guide.call("_mark_seen", "attack")
	guide.call("_mark_seen", "dash")
	guide.call("_mark_seen", "interact")
	if label == null or not label.text.contains("MOVER"):
		failures.append("onboarding skipped unmet movement requirement")

	guide.call("_mark_seen", "move")
	if not GameState.has_world_flag(GuideScript.COMPLETION_FLAG):
		failures.append("onboarding completion flag was not set")
	if label == null or not label.text.contains("LISTO"):
		failures.append("onboarding completion feedback missing")

	var second := CanvasLayer.new()
	second.name = "OnboardingGuideCompletedSmoke"
	second.set_script(GuideScript)
	second.call("configure", "M01", false)
	add_child(second)
	await get_tree().process_frame
	if is_instance_valid(second) and not second.is_queued_for_deletion():
		failures.append("completed onboarding respawned instead of self-removing")

	guide.queue_free()
	if is_instance_valid(second):
		second.queue_free()
	GameState.reset_new_game()
	await get_tree().process_frame
	_finish()

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_ONBOARDING_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_ONBOARDING_FAIL")
	get_tree().quit(1)
