extends Node

const XETHKIOZ_SCRIPT := preload("res://src/pets/xethkioz_companion_production.gd")
const XETHKIOZ_SHEET := preload("res://assets/production/characters/xethkioz_sheet.svg")

func _ready() -> void:
	var failures: Array[String] = []
	_validate_sheet(failures)
	_validate_direction_rows(failures)
	_finish(failures)

func _validate_sheet(failures: Array[String]) -> void:
	if XETHKIOZ_SHEET == null:
		failures.append("Xethkioz sheet did not load")
		return
	if XETHKIOZ_SHEET.get_width() != 96:
		failures.append("Xethkioz sheet width must be 96 px / 3 frames")
	if XETHKIOZ_SHEET.get_height() != 128:
		failures.append("Xethkioz sheet height must be 128 px / 4 directions")

func _validate_direction_rows(failures: Array[String]) -> void:
	var companion: Node = XETHKIOZ_SCRIPT.new()
	var cases: Array = [
		{"name":"down", "direction":Vector2.DOWN, "row":0},
		{"name":"right", "direction":Vector2.RIGHT, "row":1},
		{"name":"left", "direction":Vector2.LEFT, "row":2},
		{"name":"up", "direction":Vector2.UP, "row":3}
	]
	for case_value in cases:
		var case_data: Dictionary = case_value
		var actual_row: int = int(companion.call("_direction_row", case_data["direction"]))
		var expected_row: int = int(case_data["row"])
		if actual_row != expected_row:
			failures.append("%s expected row %d, got %d" % [case_data["name"], expected_row, actual_row])
	companion.free()

func _finish(failures: Array[String]) -> void:
	if failures.is_empty():
		print("IZRDRALAR_XETHKIOZ_DIRECTION_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_XETHKIOZ_DIRECTION_FAIL")
	get_tree().quit(1)
