extends Node

var quest_started := false
var quest_completed := false
var defeated := 0
const REQUIRED := 3

func _ready() -> void:
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	_start_intro_quest()

func _start_intro_quest() -> void:
	quest_started = true
	EventBus.quest_changed.emit("Raíces alteradas", "Derrota criaturas corrompidas (%d/%d)" % [defeated, REQUIRED], false)

func _on_enemy_defeated(_enemy_id: String, _xp: int, _pos: Vector2) -> void:
	if not quest_started or quest_completed:
		return
	defeated += 1
	if defeated >= REQUIRED:
		quest_completed = true
		GameState.add_pet_bond(5)
		GameState.add_crystals(10)
		EventBus.quest_changed.emit("Raíces alteradas", "Completada — vuelve al claro seguro", true)
		EventBus.toast_requested.emit("Misión completada: Raíces alteradas")
	else:
		EventBus.quest_changed.emit("Raíces alteradas", "Derrota criaturas corrompidas (%d/%d)" % [defeated, REQUIRED], false)
