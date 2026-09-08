extends Node

const MAX_LEVEL := 60

var player_level: int = 1
var player_xp: int = 0
var crystals: int = 0
var campaign_hito: int = 1
var selected_mentor: String = ""
var xethkioz_bond: int = 0
var profession_xp: Dictionary = {"botanica": 0, "cocina": 0}

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

func reset_new_game() -> void:
	player_level = 1
	player_xp = 0
	crystals = 0
	campaign_hito = 1
	selected_mentor = ""
	xethkioz_bond = 0
	profession_xp = {"botanica": 0, "cocina": 0}
	EventBus.player_progress_changed.emit(player_level, player_xp, xp_to_next())
	EventBus.currency_changed.emit(crystals)
	EventBus.pet_bond_changed.emit(xethkioz_bond)

func to_dict() -> Dictionary:
	return {
		"save_version": 3,
		"player_level": player_level,
		"player_xp": player_xp,
		"crystals": crystals,
		"campaign_hito": campaign_hito,
		"selected_mentor": selected_mentor,
		"xethkioz_bond": xethkioz_bond,
		"profession_xp": profession_xp.duplicate(true)
	}

func apply_dict(data: Dictionary) -> void:
	player_level = clampi(int(data.get("player_level", 1)), 1, MAX_LEVEL)
	player_xp = maxi(0, int(data.get("player_xp", 0)))
	crystals = maxi(0, int(data.get("crystals", 0)))
	campaign_hito = maxi(1, int(data.get("campaign_hito", 1)))
	selected_mentor = str(data.get("selected_mentor", ""))
	xethkioz_bond = clampi(int(data.get("xethkioz_bond", 0)), 0, 100)
	profession_xp = data.get("profession_xp", {"botanica": 0, "cocina": 0}).duplicate(true)
	EventBus.player_progress_changed.emit(player_level, player_xp, 0 if player_level >= MAX_LEVEL else xp_to_next())
	EventBus.currency_changed.emit(crystals)
	EventBus.pet_bond_changed.emit(xethkioz_bond)

func _on_enemy_defeated(_enemy_id: String, xp_reward: int, _world_position: Vector2) -> void:
	add_xp(xp_reward)
