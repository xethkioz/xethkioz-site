extends Node

const SAVE_PATH := "user://world_of_xethkioz_v33.json"

func save_game(extra: Dictionary = {}) -> bool:
	var payload := GameState.to_dict()
	payload["inventory"] = InventoryService.to_dict()
	for key in extra.keys():
		payload[key] = extra[key]
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(payload))
	return true

func load_game() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		GameState.apply_dict(parsed)
		InventoryService.apply_dict(parsed.get("inventory", {}))
		return parsed
	return {}
