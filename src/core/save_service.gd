extends Node

const SAVE_PATH := "user://world_of_xethkioz_v34.json"
const BACKUP_PATH := "user://world_of_xethkioz_v34.backup.json"
const TEMP_PATH := "user://world_of_xethkioz_v34.tmp.json"
const LEGACY_SAVE_PATH := "user://world_of_xethkioz_v33.json"
const SAVE_SCHEMA_VERSION := 10
const PERSISTENT_METADATA_KEYS := ["intro_seen", "runtime"]

func has_save() -> bool:
	return _read_payload(SAVE_PATH).size() > 0 or _read_payload(BACKUP_PATH).size() > 0 or _read_payload(LEGACY_SAVE_PATH).size() > 0

func delete_save() -> bool:
	var ok := true
	for path in [SAVE_PATH, BACKUP_PATH, TEMP_PATH, LEGACY_SAVE_PATH]:
		if FileAccess.file_exists(path):
			ok = DirAccess.remove_absolute(ProjectSettings.globalize_path(path)) == OK and ok
	return ok

func save_game(extra: Dictionary = {}) -> bool:
	var current_payload := _read_payload(SAVE_PATH)
	var payload: Dictionary = {}
	_copy_persistent_metadata(current_payload, payload)

	var state_payload := GameState.to_dict()
	for key in state_payload.keys():
		payload[key] = state_payload[key]
	payload["inventory"] = InventoryService.to_dict()
	payload["character_profile"] = CharacterProfile.to_dict()
	payload["schema_version"] = SAVE_SCHEMA_VERSION
	payload["saved_at_unix"] = Time.get_unix_time_from_system()
	for key in extra.keys():
		payload[key] = extra[key]

	var encoded := JSON.stringify(payload)
	if encoded.is_empty():
		return false

	if current_payload.size() > 0:
		var current_text := FileAccess.get_file_as_string(SAVE_PATH)
		if not current_text.is_empty() and not _write_text(BACKUP_PATH, current_text):
			return false

	if not _write_text(TEMP_PATH, encoded):
		return false

	var save_absolute := ProjectSettings.globalize_path(SAVE_PATH)
	var temp_absolute := ProjectSettings.globalize_path(TEMP_PATH)
	if FileAccess.file_exists(SAVE_PATH):
		if DirAccess.remove_absolute(save_absolute) != OK:
			return false
	var rename_error := DirAccess.rename_absolute(temp_absolute, save_absolute)
	if rename_error == OK:
		return true

	var backup_payload := _read_payload(BACKUP_PATH)
	if backup_payload.size() > 0:
		_write_text(SAVE_PATH, JSON.stringify(backup_payload))
	return false

func load_game() -> Dictionary:
	var candidates := [SAVE_PATH, BACKUP_PATH, LEGACY_SAVE_PATH]
	for path in candidates:
		var parsed := _read_payload(path)
		if parsed.is_empty():
			continue
		GameState.apply_dict(parsed)
		InventoryService.apply_dict(parsed.get("inventory", {}))
		CharacterProfile.apply_dict(parsed.get("character_profile", {}))
		if path == LEGACY_SAVE_PATH:
			var migration_extra := {"migrated_from": "v33"}
			_copy_persistent_metadata(parsed, migration_extra)
			save_game(migration_extra)
		elif path == BACKUP_PATH:
			var recovery_extra := {"recovered_from": "backup"}
			_copy_persistent_metadata(parsed, recovery_extra)
			save_game(recovery_extra)
		return parsed
	return {}

func _copy_persistent_metadata(source: Dictionary, target: Dictionary) -> void:
	for key in PERSISTENT_METADATA_KEYS:
		if source.has(key):
			target[key] = source[key]

func _read_payload(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if parsed is Dictionary and parsed.has("save_version"):
		return parsed
	return {}

func _write_text(path: String, text: String) -> bool:
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(text)
	file.close()
	return true
