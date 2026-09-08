extends Node

const STATE_NOT_STARTED := 0
const STATE_ACTIVE := 1
const STATE_RETURN_TO_ALEXIS := 2
const STATE_COMPLETED := 3
const REQUIRED_KILLS := 3

var state := STATE_NOT_STARTED
var defeated := 0

func _ready() -> void:
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.npc_interacted.connect(_on_npc_interacted)
	EventBus.quest_changed.emit("Primeras señales", "Habla con Alexis en la Cuenca del Despertar", false)

func _on_npc_interacted(npc_id: String) -> void:
	if npc_id != "alexis":
		return
	match state:
		STATE_NOT_STARTED:
			state = STATE_ACTIVE
			EventBus.dialog_requested.emit("Alexis", "No ataques por atacar. Observá qué criaturas están reaccionando a la anomalía y traeme una lectura clara del bosque.")
			_update_quest()
		STATE_RETURN_TO_ALEXIS:
			state = STATE_COMPLETED
			GameState.add_xp(120)
			GameState.add_pet_bond(5)
			GameState.add_crystals(10)
			EventBus.quest_changed.emit("Raíces alteradas", "Completada", true)
			EventBus.dialog_requested.emit("Alexis", "Bien. Esto no es una migración normal. Las raíces están respondiendo a algo más profundo. Seguimos desde acá.")
			EventBus.toast_requested.emit("Misión completada · +120 XP · +10 cristales")

func _on_enemy_defeated(_enemy_id: String, _xp: int, _pos: Vector2) -> void:
	if state != STATE_ACTIVE:
		return
	defeated = mini(defeated + 1, REQUIRED_KILLS)
	if defeated >= REQUIRED_KILLS:
		state = STATE_RETURN_TO_ALEXIS
	_update_quest()

func _update_quest() -> void:
	match state:
		STATE_ACTIVE:
			EventBus.quest_changed.emit("Raíces alteradas", "Investiga criaturas alteradas (%d/%d)" % [defeated, REQUIRED_KILLS], false)
		STATE_RETURN_TO_ALEXIS:
			EventBus.quest_changed.emit("Raíces alteradas", "Vuelve con Alexis", false)
