extends Node

const SAVE_PATH := "user://world_of_xethkioz_v33.json"

func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH)

func delete_save() -> bool:
	if not has_save():
		return true
	return DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH)) == OK

func save_game(extra: Dictionary = {}) -> bool:
	var payload := GameState.to_dict()
	payload["inventory"] = InventoryService.to_dict()
	payload["character_profile"] = CharacterProfile.to_dict()
	for key in extra.keys():
		payload[key] = extra[key]
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(payload))
	return true

func load_game() -> Dictionary:
	if not has_save():
		return {}
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		GameState.apply_dict(parsed)
		InventoryService.apply_dict(parsed.get("inventory", {}))
		CharacterProfile.apply_dict(parsed.get("character_profile", {}))
		return parsed
	return {}
