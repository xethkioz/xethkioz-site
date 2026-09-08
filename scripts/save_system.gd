extends RefCounted

const SAVE_PATH := "user://wildbound_save.json"
const TEMP_PATH := "user://wildbound_save.tmp"
const BACKUP_PATH := "user://wildbound_save_backup.json"
const SAVE_VERSION := 5

static func default_state() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
		"player_name": "Viajero",
		"player_gender": "Masculino",
		"player_palette": 0,
		"creator_body": 0,
		"creator_face": 0,
		"creator_hair": 0,
		"creator_hair_color": 0,
		"creator_skin": 0,
		"creator_clothes": 0,
		"intro_seen": false,
		"mentor_chosen": false,
		"selected_hero": -1,
		"double_jump_unlocked": false,
		"current_map": 1,
		"current_node": 1,
		"unlocked_map": 1,
		"unlocked_nodes": [1],
		"completed_nodes": [],
		"crystals": 0,
		"supplies": 100.0,
		"max_supplies": 100.0,
		"weapon": {"name":"Espada de Brote","power":1.05,"rarity":"Common","id":1},
		"armor": {"name":"Set del Brote Vivo","power":1.15,"rarity":"Common","set_id":"brote_vivo"},
		"charm": {"name":"Brújula Antigua","power":1.0,"rarity":"Common"},
		"equipped_weapon_id": 1,
		"equipped_set_id": "brote_vivo",
		"unlocked_weapon_ids": [1,6,11,16],
		"unlocked_set_ids": ["brote_vivo"],
		"legendary_weapon_ids": [],
		"premium_owned": false,
		"premium_wings_equipped": false,
		"premium_wing_buff": {},
		"pets": [],
		"active_pet": -1,
		"pet_bond": 0.0,
		"bosses": [],
		"bosses_defeated": [],
		"deaths": 0,
		"camp_visits": 0,
		"refuges_unlocked": [],
		"refuge_rests": 0,
		"demo_complete": false,
		"demo_completed_map15": false,
		"world_discoveries": [],
		"exploration_mastery": 0,
		"revisit_count": 0
	}

static func _merge_with_defaults(parsed: Dictionary) -> Dictionary:
	var base := default_state()
	for key in parsed.keys():
		base[key] = parsed[key]
	base["save_version"] = SAVE_VERSION

	# Normalize legacy prototype data.
	base["current_map"] = clampi(int(base.get("current_map",1)),1,15)
	base["current_node"] = clampi(int(base.get("current_node",base["current_map"])),1,15)
	base["unlocked_map"] = clampi(int(base.get("unlocked_map",1)),1,15)
	if typeof(base.get("unlocked_nodes",[])) != TYPE_ARRAY:
		base["unlocked_nodes"] = [1]
	if typeof(base.get("completed_nodes",[])) != TYPE_ARRAY:
		base["completed_nodes"] = []
	if typeof(base.get("bosses_defeated",[])) != TYPE_ARRAY:
		base["bosses_defeated"] = []
	if typeof(base.get("refuges_unlocked",[])) != TYPE_ARRAY:
		base["refuges_unlocked"] = []

	# Canon migration: old saves that already defeated/completed node 5 receive
	# the traversal unlock so Continue never regresses their movement kit.
	var completed: Array = base.get("completed_nodes",[])
	var bosses: Array = base.get("bosses",[])
	if 5 in completed or 5 in bosses or int(base.get("unlocked_map",1)) >= 6:
		base["double_jump_unlocked"] = true

	return base

static func _read_dictionary(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var file := FileAccess.open(path,FileAccess.READ)
	if file == null:
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if typeof(parsed) == TYPE_DICTIONARY else {}

static func load_state() -> Dictionary:
	var parsed := _read_dictionary(SAVE_PATH)
	if parsed.is_empty():
		parsed = _read_dictionary(BACKUP_PATH)
	if parsed.is_empty():
		return default_state()
	return _merge_with_defaults(parsed)

static func save_state(state: Dictionary) -> void:
	state["save_version"] = SAVE_VERSION
	var serialized := JSON.stringify(state,"\t")

	# Keep the last readable save as a recovery copy before replacing it.
	if FileAccess.file_exists(SAVE_PATH):
		var old_file := FileAccess.open(SAVE_PATH,FileAccess.READ)
		if old_file:
			var backup := FileAccess.open(BACKUP_PATH,FileAccess.WRITE)
			if backup:
				backup.store_string(old_file.get_as_text())
				backup.flush()

	var temp := FileAccess.open(TEMP_PATH,FileAccess.WRITE)
	if temp == null:
		return
	temp.store_string(serialized)
	temp.flush()
	temp = null

	var save_abs := ProjectSettings.globalize_path(SAVE_PATH)
	var temp_abs := ProjectSettings.globalize_path(TEMP_PATH)
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(save_abs)
	var err := DirAccess.rename_absolute(temp_abs,save_abs)
	if err != OK:
		var fallback := FileAccess.open(SAVE_PATH,FileAccess.WRITE)
		if fallback:
			fallback.store_string(serialized)
			fallback.flush()

static func reset() -> Dictionary:
	var state := default_state()
	save_state(state)
	return state
