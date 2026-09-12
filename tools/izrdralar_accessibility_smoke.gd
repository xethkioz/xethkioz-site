extends Node

const PlayerScript := preload("res://src/player/player_controller_production_pass02.gd")

var failures: Array[String] = []
var _original_reduce_motion := false
var _original_sfx_enabled := true
var _original_sfx_volume := -10.5
var _original_ambience_enabled := true
var _original_ambience_volume := -22.0

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	_original_reduce_motion = AccessibilityService.reduce_camera_motion
	_original_sfx_enabled = AccessibilityService.sfx_enabled
	_original_sfx_volume = AccessibilityService.sfx_volume_db
	_original_ambience_enabled = AccessibilityService.ambience_enabled
	_original_ambience_volume = AccessibilityService.ambience_volume_db

	AccessibilityService.set_reduce_camera_motion(true)
	AccessibilityService.set_sfx_enabled(false)
	AccessibilityService.set_sfx_volume_db(-17.0)
	AccessibilityService.set_ambience_enabled(false)
	AccessibilityService.set_ambience_volume_db(-27.0)

	# Deliberately mutate memory without saving, then reload the file to prove
	# preferences are actually persisted rather than only held in the singleton.
	AccessibilityService.reduce_camera_motion = false
	AccessibilityService.sfx_enabled = true
	AccessibilityService.sfx_volume_db = -3.0
	AccessibilityService.ambience_enabled = true
	AccessibilityService.ambience_volume_db = -8.0
	AccessibilityService.load_settings()
	if not AccessibilityService.reduce_camera_motion:
		failures.append("reduce_camera_motion did not persist")
	if AccessibilityService.sfx_enabled:
		failures.append("sfx_enabled did not persist")
	_check_close("persisted SFX volume", AccessibilityService.sfx_volume_db, -17.0)
	if AccessibilityService.ambience_enabled:
		failures.append("ambience_enabled did not persist")
	_check_close("persisted ambience volume", AccessibilityService.ambience_volume_db, -27.0)

	var player: CharacterBody2D = PlayerScript.new()
	player.name = "AccessibilityPlayer"
	var camera := Camera2D.new()
	camera.name = "WorldCamera"
	player.add_child(camera)
	add_child(player)
	player.set_physics_process(false)
	await get_tree().process_frame

	AccessibilityService.reduce_camera_motion = true
	player.call("_kick_camera", 0.10, 4.0)
	_check_close("reduced shake strength", float(player.get("_camera_shake_strength")), 0.88)
	_check_close("reduced shake duration", float(player.get("_camera_shake_duration")), 0.055)

	player.set("_camera_shake_left", 0.0)
	player.set("_camera_shake_strength", 0.0)
	AccessibilityService.reduce_camera_motion = false
	player.call("_kick_camera", 0.10, 4.0)
	_check_close("normal shake strength", float(player.get("_camera_shake_strength")), 4.0)
	_check_close("normal shake duration", float(player.get("_camera_shake_duration")), 0.10)

	player.queue_free()
	_restore_preferences()
	await get_tree().process_frame
	_finish()

func _restore_preferences() -> void:
	AccessibilityService.reduce_camera_motion = _original_reduce_motion
	AccessibilityService.sfx_enabled = _original_sfx_enabled
	AccessibilityService.sfx_volume_db = _original_sfx_volume
	AccessibilityService.ambience_enabled = _original_ambience_enabled
	AccessibilityService.ambience_volume_db = _original_ambience_volume
	AccessibilityService.save_settings()

func _check_close(label: String, actual: float, expected: float) -> void:
	if absf(actual - expected) > 0.005:
		failures.append("%s %.3f != %.3f" % [label, actual, expected])

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_ACCESSIBILITY_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_ACCESSIBILITY_FAIL")
	get_tree().quit(1)
