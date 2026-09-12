extends Node

const PLAYER_SCRIPT := preload("res://src/player/player_controller_production.gd")
const VIAJERO_SHEET := preload("res://assets/production/characters/viajero_sheet.svg")

func _ready() -> void:
	var failures: Array[String] = []
	_validate_sheet(failures)
	_validate_direction_rows(failures)
	_validate_movement_response(failures)
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

func _validate_movement_response(failures: Array[String]) -> void:
	var player = PLAYER_SCRIPT.new()
	var speed: float = float(player.get("move_speed"))

	player.velocity = Vector2.ZERO
	player.call("_apply_ground_movement", Vector2.RIGHT, 0.05)
	if player.velocity.x <= 0.0 or player.velocity.x >= speed:
		failures.append("ground movement must accelerate progressively instead of snapping to full speed")

	for _step in range(5):
		player.call("_apply_ground_movement", Vector2.RIGHT, 0.05)
	if absf(player.velocity.length() - speed) > 0.1:
		failures.append("ground movement must converge to configured move_speed")

	player.velocity = Vector2.RIGHT * speed
	player.call("_apply_ground_movement", Vector2.ZERO, 0.05)
	if player.velocity.x <= 0.0 or player.velocity.x >= speed:
		failures.append("release must brake progressively without an instant stop")

	player.velocity = Vector2.RIGHT * speed
	player.call("_apply_ground_movement", Vector2.LEFT, 0.05)
	player.call("_apply_ground_movement", Vector2.LEFT, 0.05)
	if player.velocity.x >= 0.0:
		failures.append("opposite-direction input must use fast turn response")

	player.velocity = Vector2.ZERO
	var diagonal := Vector2(1.0, 1.0).normalized()
	for _step in range(5):
		player.call("_apply_ground_movement", diagonal, 0.05)
	if absf(player.velocity.length() - speed) > 0.1:
		failures.append("diagonal movement must preserve the same top speed as cardinal movement")

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
