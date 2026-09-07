extends RefCounted

const SAVE_PATH := "user://wildbound_save.json"
const SAVE_VERSION := 3

static func default_state() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
		"current_map": 1,
		"unlocked_map": 1,
		"crystals": 0,
		"supplies": 100.0,
		"max_supplies": 100.0,
		"weapon": {"name":"Rustblade","power":1.0,"rarity":"Common"},
		"armor": {"name":"Trail Jacket","power":1.0,"rarity":"Common"},
		"charm": {"name":"Old Compass","power":1.0,"rarity":"Common"},
		"pets": [],
		"active_pet": -1,
		"pet_bond": 0.0,
		"bosses": [],
		"deaths": 0,
		"camp_visits": 0,
		"demo_complete": false,
		"world_discoveries": [],
		"exploration_mastery": 0,
		"revisit_count": 0
	}

static func load_state() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return default_state()
	var file := FileAccess.open(SAVE_PATH,FileAccess.READ)
	if file == null:
		return default_state()
	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return default_state()
	var base := default_state()
	for key in parsed.keys():
		base[key] = parsed[key]
	base["save_version"] = SAVE_VERSION
	return base

static func save_state(state: Dictionary) -> void:
	state["save_version"] = SAVE_VERSION
	var file := FileAccess.open(SAVE_PATH,FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(state,"\t"))

static func reset() -> Dictionary:
	var state := default_state()
	save_state(state)
	return state
