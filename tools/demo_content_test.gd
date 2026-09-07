extends SceneTree

const OverworldData = preload("res://scripts/overworld_data.gd")
const ArmoryData = preload("res://scripts/armory_data.gd")

func _init() -> void:
	var failures: Array[String] = []
	if OverworldData.TOTAL_NODES != 120: failures.append("TOTAL_NODES must be 120")
	if OverworldData.DEMO_ACTIVE_NODES != 15: failures.append("DEMO_ACTIVE_NODES must be 15")
	if OverworldData.BASE_GAME_NODES != 32: failures.append("BASE_GAME_NODES must be 32")
	if ArmoryData.WEAPONS.size() != 25: failures.append("Armory must contain 25 base weapons")
	if ArmoryData.SETS.size() != 10: failures.append("Armory must contain 10 sets")
	if ArmoryData.LEGENDARY_WEAPONS.size() != 2: failures.append("Armory must contain 2 legendary weapons")
	for id in range(1,33):
		if OverworldData.node_name(id).is_empty(): failures.append("Missing name for node %d" % id)
		if OverworldData.node_position(id) == Vector2.ZERO: failures.append("Missing position for node %d" % id)
	for id in range(1,15):
		if id+1 not in OverworldData.next_nodes(id): failures.append("Main route broken at %d" % id)
	var unlocks_1: Array[int] = ArmoryData.unlocked_weapon_ids(1)
	var unlocks_15: Array[int] = ArmoryData.unlocked_weapon_ids(15)
	if unlocks_1.is_empty(): failures.append("No starter weapons")
	if 101 not in unlocks_15 or 102 not in unlocks_15: failures.append("Legendary weapons must unlock at map 15")
	if failures.is_empty():
		print("Steam demo content model valid: 120 nodes / 15 demo / 32 base / 25 weapons / 10 sets / 2 legendary")
		quit(0)
	else:
		for f in failures: push_error(f)
		quit(1)
