extends RefCounted

const SAVE_PATH := "user://wildbound_save.json"
const SAVE_VERSION := 4

static func default_state() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
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
		"deaths": 0,
		"camp_visits": 0,
		"demo_complete": false,
		"demo_completed_map15": false,
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
	# Migration for older prototype saves.
	if not base.has("current_node"): base["current_node"] = int(base.get("current_map",1))
	if not base.has("unlocked_nodes"): base["unlocked_nodes"] = [clampi(int(base.get("unlocked_map",1)),1,15)]
	if not base.has("completed_nodes"): base["completed_nodes"] = []
	if not base.has("unlocked_weapon_ids"): base["unlocked_weapon_ids"] = [1,6,11,16]
	if not base.has("unlocked_set_ids"): base["unlocked_set_ids"] = ["brote_vivo"]
	if not base.has("legendary_weapon_ids"): base["legendary_weapon_ids"] = []
	if not base.has("premium_owned"): base["premium_owned"] = false
	if not base.has("premium_wings_equipped"): base["premium_wings_equipped"] = false
	if not base.has("premium_wing_buff"): base["premium_wing_buff"] = {}
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
