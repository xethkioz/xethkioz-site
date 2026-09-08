extends Node

const SAVE_PATH := "user://world_of_xethkioz_v34.json"
const LEGACY_SAVE_PATH := "user://world_of_xethkioz_v33.json"

func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH) or FileAccess.file_exists(LEGACY_SAVE_PATH)

func delete_save() -> bool:
	var ok := true
	for path in [SAVE_PATH, LEGACY_SAVE_PATH]:
		if FileAccess.file_exists(path):
			ok = DirAccess.remove_absolute(ProjectSettings.globalize_path(path)) == OK and ok
	return ok

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
	var path := SAVE_PATH if FileAccess.file_exists(SAVE_PATH) else LEGACY_SAVE_PATH
	if not FileAccess.file_exists(path):
		return {}
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		GameState.apply_dict(parsed)
		InventoryService.apply_dict(parsed.get("inventory", {}))
		CharacterProfile.apply_dict(parsed.get("character_profile", {}))
		if path == LEGACY_SAVE_PATH:
			save_game({"migrated_from": "v33"})
		return parsed
	return {}
