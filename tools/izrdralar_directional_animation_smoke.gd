extends Node

const PLAYER_SCRIPT := preload("res://src/player/player_controller_production.gd")
const VIAJERO_SHEET := preload("res://assets/production/characters/viajero_sheet.svg")

func _ready() -> void:
	var failures: Array[String] = []
	_validate_sheet(failures)
	_validate_direction_rows(failures)
	_finish(failures)

func _validate_sheet(failures: Array[String]) -> void:
	if VIAJERO_SHEET == null:
		failures.append("Viajero sheet did not load")
		return
	if VIAJERO_SHEET.get_width() != 96:
		failures.append("Viajero sheet width must be 96 px / 3 frames")
	if VIAJERO_SHEET.get_height() != 256:
		failures.append("Viajero sheet height must be 256 px / 8 directions")

func _validate_direction_rows(failures: Array[String]) -> void:
	var player: Node = PLAYER_SCRIPT.new()
	var cases: Array = [
		{"name":"down", "direction":Vector2.DOWN, "row":0},
		{"name":"down_left", "direction":Vector2(-1, 1), "row":1},
		{"name":"left", "direction":Vector2.LEFT, "row":2},
		{"name":"up_left", "direction":Vector2(-1, -1), "row":3},
		{"name":"up", "direction":Vector2.UP, "row":4},
		{"name":"up_right", "direction":Vector2(1, -1), "row":5},
		{"name":"right", "direction":Vector2.RIGHT, "row":6},
		{"name":"down_right", "direction":Vector2(1, 1), "row":7}
	]
	var rows_seen: Dictionary = {}
	for case_value in cases:
		var case_data: Dictionary = case_value
		var actual_row: int = int(player.call("_direction_row", case_data["direction"]))
		var expected_row: int = int(case_data["row"])
		if actual_row != expected_row:
			failures.append("%s expected row %d, got %d" % [case_data["name"], expected_row, actual_row])
		rows_seen[actual_row] = true
	if rows_seen.size() != 8:
		failures.append("direction mapping must expose eight distinct visual rows")
	player.free()

func _finish(failures: Array[String]) -> void:
	if failures.is_empty():
		print("IZRDRALAR_DIRECTIONAL_ANIMATION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_DIRECTIONAL_ANIMATION_FAIL")
	get_tree().quit(1)
