extends Node

const MAX_LEVEL := 60
const LEGENDARY_SPECIES := ["xethkioz", "itzuke", "mozaruk", "killaruna", "heller", "kahezer", "okuninust", "dvalin"]

var player_level: int = 1
var player_xp: int = 0
var crystals: int = 0
var campaign_hito: int = 1
var selected_mentor: String = ""
var prism_step_unlocked := false
var xethkioz_bond: int = 0
var profession_xp: Dictionary = {"botanica": 0, "cocina": 0}
var set_piece_counts: Dictionary = {"brote_vivo": 0}
var discovered_lore: Array[String] = []
var captured_familiars: Dictionary = {}
var active_familiar_id: String = ""

func _ready() -> void:
	EventBus.enemy_defeated.connect(_on_enemy_defeated)

func xp_to_next(level: int = player_level) -> int:
	var safe_level := clampi(level, 1, MAX_LEVEL - 1)
	return 100 + 40 * safe_level + 10 * safe_level * safe_level

func xp_total_for_level(target_level: int) -> int:
	var total := 0
	for level in range(1, clampi(target_level, 1, MAX_LEVEL)):
		total += xp_to_next(level)
	return total

func add_xp(amount: int) -> void:
	if amount <= 0 or player_level >= MAX_LEVEL:
		return
	player_xp += amount
	while player_level < MAX_LEVEL and player_xp >= xp_to_next():
		player_xp -= xp_to_next()
		player_level += 1
		EventBus.toast_requested.emit("Nivel %d alcanzado" % player_level)
	EventBus.player_progress_changed.emit(player_level, player_xp, 0 if player_level >= MAX_LEVEL else xp_to_next())

func add_crystals(amount: int) -> void:
	crystals = maxi(0, crystals + amount)
	EventBus.currency_changed.emit(crystals)

func add_pet_bond(amount: int) -> void:
	xethkioz_bond = clampi(xethkioz_bond + amount, 0, 100)
	EventBus.pet_bond_changed.emit(xethkioz_bond)

func add_profession_xp(profession_id: String, amount: int) -> void:
	profession_xp[profession_id] = int(profession_xp.get(profession_id, 0)) + maxi(amount, 0)

func add_set_piece(set_id: String, amount: int = 1) -> int:
	if set_id.is_empty() or amount <= 0:
		return set_piece_count(set_id)
	var pieces := clampi(int(set_piece_counts.get(set_id, 0)) + amount, 0, 5)
	set_piece_counts[set_id] = pieces
	EventBus.set_progress_changed.emit(set_id, pieces)
	return pieces

func set_piece_count(set_id: String) -> int:
	return int(set_piece_counts.get(set_id, 0))

func has_set_bonus(set_id: String, required_pieces: int) -> bool:
	return set_piece_count(set_id) >= required_pieces

func has_lore(lore_id: String) -> bool:
	return discovered_lore.has(lore_id)

func discover_lore(lore_id: String, title: String, total_hint: int = 0) -> bool:
	if lore_id.is_empty() or discovered_lore.has(lore_id):
		return false
	discovered_lore.append(lore_id)
	EventBus.lore_discovered.emit(lore_id, title, discovered_lore.size(), total_hint)
	add_xp(8)
	return true

func is_legendary_species(species_id: String) -> bool:
	return LEGENDARY_SPECIES.has(species_id.to_lower())

func has_familiar(species_id: String) -> bool:
	return captured_familiars.has(species_id)

func capture_familiar(species_id: String, display_name: String, affinity: String, mentor_id: String) -> bool:
	if species_id.is_empty() or captured_familiars.has(species_id) or is_legendary_species(species_id):
		return false
	captured_familiars[species_id] = {
		"display_name": display_name,
		"level": 1,
		"bond": 0,
		"affinity": affinity,
		"mentor_id": mentor_id,
		"assessed": false,
		"training_rank": 0,
		"trained_with": "",
		"unlocked_ability": ""
	}
	active_familiar_id = species_id
	EventBus.familiar_captured.emit(species_id, display_name)
	EventBus.active_familiar_changed.emit(species_id)
	return true

func assess_familiar(species_id: String) -> bool:
	if is_legendary_species(species_id) or not captured_familiars.has(species_id):
		return false
	var data: Dictionary = captured_familiars[species_id]
	if bool(data.get("assessed", false)):
		return false
	data["assessed"] = true
	captured_familiars[species_id] = data
	EventBus.familiar_assessed.emit(species_id, str(data.get("affinity", "")), str(data.get("mentor_id", "")))
	return true

func train_familiar(species_id: String, mentor_id: String) -> bool:
	if is_legendary_species(species_id) or not captured_familiars.has(species_id):
		return false
	var data: Dictionary = captured_familiars[species_id]
	if not bool(data.get("assessed", false)):
		return false
	if str(data.get("mentor_id", "")) != mentor_id:
		return false
	if int(data.get("training_rank", 0)) >= 1:
		return false
	data["training_rank"] = 1
	data["trained_with"] = mentor_id
	data["bond"] = clampi(int(data.get("bond", 0)) + 10, 0, 100)
	if species_id == "carpinchito_cristal":
		data["unlocked_ability"] = "embate_cristal"
	captured_familiars[species_id] = data
	EventBus.familiar_trained.emit(species_id, 1, mentor_id)
	EventBus.active_familiar_changed.emit(species_id)
	return true

func choose_mentor(mentor_id: String) -> bool:
	if mentor_id.is_empty():
		return false
	selected_mentor = mentor_id
	EventBus.mentor_selected.emit(mentor_id)
	return true

func unlock_prism_step() -> bool:
	if prism_step_unlocked:
		return false
	prism_step_unlocked = true
	EventBus.traversal_unlocked.emit("paso_prismatico")
	return true

func familiar_data(species_id: String) -> Dictionary:
	if not captured_familiars.has(species_id):
		return {}
	return captured_familiars[species_id].duplicate(true)

func active_familiar_data() -> Dictionary:
	return familiar_data(active_familiar_id)

func reset_new_game() -> void:
	player_level = 1
	player_xp = 0
	crystals = 0
	campaign_hito = 1
	selected_mentor = ""
	prism_step_unlocked = false
	xethkioz_bond = 0
	profession_xp = {"botanica": 0, "cocina": 0}
	set_piece_counts = {"brote_vivo": 0}
	discovered_lore.clear()
	captured_familiars.clear()
	active_familiar_id = ""
	EventBus.player_progress_changed.emit(player_level, player_xp, xp_to_next())
	EventBus.currency_changed.emit(crystals)
	EventBus.pet_bond_changed.emit(xethkioz_bond)
	EventBus.set_progress_changed.emit("brote_vivo", 0)
	EventBus.active_familiar_changed.emit(active_familiar_id)

func to_dict() -> Dictionary:
	return {
		"save_version": 7,
		"player_level": player_level,
		"player_xp": player_xp,
		"crystals": crystals,
		"campaign_hito": campaign_hito,
		"selected_mentor": selected_mentor,
		"prism_step_unlocked": prism_step_unlocked,
		"xethkioz_bond": xethkioz_bond,
		"profession_xp": profession_xp.duplicate(true),
		"set_piece_counts": set_piece_counts.duplicate(true),
		"discovered_lore": discovered_lore.duplicate(),
		"captured_familiars": captured_familiars.duplicate(true),
		"active_familiar_id": active_familiar_id
	}

func apply_dict(data: Dictionary) -> void:
	player_level = clampi(int(data.get("player_level", 1)), 1, MAX_LEVEL)
	player_xp = maxi(0, int(data.get("player_xp", 0)))
	crystals = maxi(0, int(data.get("crystals", 0)))
	campaign_hito = maxi(1, int(data.get("campaign_hito", 1)))
	selected_mentor = str(data.get("selected_mentor", ""))
	prism_step_unlocked = bool(data.get("prism_step_unlocked", false))
	xethkioz_bond = clampi(int(data.get("xethkioz_bond", 0)), 0, 100)
	profession_xp = data.get("profession_xp", {"botanica": 0, "cocina": 0}).duplicate(true)
	set_piece_counts = data.get("set_piece_counts", {"brote_vivo": 0}).duplicate(true)
	discovered_lore.clear()
	for raw_id in data.get("discovered_lore", []):
		discovered_lore.append(str(raw_id))
	captured_familiars = data.get("captured_familiars", {}).duplicate(true)
	active_familiar_id = str(data.get("active_familiar_id", ""))
	if not active_familiar_id.is_empty() and not captured_familiars.has(active_familiar_id):
		active_familiar_id = ""
	EventBus.player_progress_changed.emit(player_level, player_xp, 0 if player_level >= MAX_LEVEL else xp_to_next())
	EventBus.currency_changed.emit(crystals)
	EventBus.pet_bond_changed.emit(xethkioz_bond)
	EventBus.set_progress_changed.emit("brote_vivo", set_piece_count("brote_vivo"))
	EventBus.active_familiar_changed.emit(active_familiar_id)

func _on_enemy_defeated(_enemy_id: String, xp_reward: int, _world_position: Vector2) -> void:
	add_xp(xp_reward)
