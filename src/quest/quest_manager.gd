extends Node

const STATE_NOT_STARTED := 0
const STATE_ROOTS_ACTIVE := 1
const STATE_RETURN_TO_ALEXIS := 2
const STATE_SEEK_VAL := 3
const STATE_CAPTURE_ACTIVE := 4
const STATE_RETURN_TO_VAL := 5
const STATE_PET_TUTORIAL_COMPLETE := 6
const REQUIRED_KILLS := 3

var state := STATE_NOT_STARTED
var defeated := 0
var talked_rola := false
var talked_mela := false

func _ready() -> void:
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.npc_interacted.connect(_on_npc_interacted)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.quest_changed.emit("Primeras señales", "Habla con Alexis en la Cuenca del Despertar", false)

func _on_npc_interacted(npc_id: String) -> void:
	if npc_id == "alexis":
		_handle_alexis()
		return
	if npc_id == "val":
		_handle_val()
		return
	if state == STATE_CAPTURE_ACTIVE and npc_id == "rola":
		talked_rola = true
		_update_quest()
	elif state == STATE_CAPTURE_ACTIVE and npc_id == "mela":
		talked_mela = true
		_update_quest()

func _handle_alexis() -> void:
	match state:
		STATE_NOT_STARTED:
			state = STATE_ROOTS_ACTIVE
			EventBus.dialog_requested.emit("Alexis", "No ataques por atacar. Observá qué criaturas están reaccionando a la anomalía y traeme una lectura clara del bosque.")
			_update_quest()
		STATE_RETURN_TO_ALEXIS:
			GameState.add_xp(120)
			GameState.add_pet_bond(5)
			GameState.add_crystals(10)
			var conclusion := "Bien. Esto no es una migración normal. Las raíces están respondiendo a algo más profundo. Seguimos desde acá."
			if GameState.has_lore("nota_elida_raices"):
				conclusion = "Bien. Y con la nota de Elida ya no puedo descartarlo: estas raíces están siguiendo un camino viejo, uno que nosotros todavía no vemos."
			EventBus.dialog_requested.emit("Alexis", conclusion)
			EventBus.toast_requested.emit("Misión completada · +120 XP · +10 cristales")
			state = STATE_SEEK_VAL
			_update_quest()

func _handle_val() -> void:
	match state:
		STATE_SEEK_VAL:
			if GameState.has_familiar("carpinchito_cristal"):
				_complete_familiar_assessment()
			else:
				state = STATE_CAPTURE_ACTIVE
				EventBus.dialog_requested.emit("Val", "Rola vio un Carpinchito de Cristal cerca de la orilla. Hablá con ella y con Mela. Si conseguís una Manzana de Bruma, dejá que la criatura decida acercarse.")
				_update_quest()
		STATE_RETURN_TO_VAL:
			_complete_familiar_assessment()

func _complete_familiar_assessment() -> void:
	if not GameState.has_familiar("carpinchito_cristal"):
		return
	GameState.assess_familiar("carpinchito_cristal")
	GameState.add_xp(60)
	state = STATE_PET_TUTORIAL_COMPLETE
	EventBus.quest_changed.emit("Primer vínculo", "Completada · Afinidad Impacto", true)
	EventBus.dialog_requested.emit("Val", "Es una afinidad de Impacto: estable, física y de ruptura. Fermín va a poder entrenarlo cuando llegue el momento. Yo te voy a indicar qué vínculo necesita cada criatura antes de mandarte con alguno de los hermanos.")
	EventBus.toast_requested.emit("Afinidad descubierta · Impacto · Mentor recomendado: Fermín · +60 XP")

func _on_enemy_defeated(_enemy_id: String, _xp: int, _pos: Vector2) -> void:
	if state != STATE_ROOTS_ACTIVE:
		return
	defeated = mini(defeated + 1, REQUIRED_KILLS)
	if defeated >= REQUIRED_KILLS:
		state = STATE_RETURN_TO_ALEXIS
	_update_quest()

func _on_familiar_captured(species_id: String, _display_name: String) -> void:
	if species_id != "carpinchito_cristal":
		return
	if state == STATE_CAPTURE_ACTIVE or state == STATE_SEEK_VAL:
		state = STATE_RETURN_TO_VAL
		_update_quest()

func _update_quest() -> void:
	match state:
		STATE_ROOTS_ACTIVE:
			EventBus.quest_changed.emit("Raíces alteradas", "Investiga criaturas alteradas (%d/%d)" % [defeated, REQUIRED_KILLS], false)
		STATE_RETURN_TO_ALEXIS:
			EventBus.quest_changed.emit("Raíces alteradas", "Vuelve con Alexis", false)
		STATE_SEEK_VAL:
			EventBus.quest_changed.emit("El lago y sus vínculos", "Habla con Val en el Lago Encantado", false)
		STATE_CAPTURE_ACTIVE:
			if talked_rola and talked_mela:
				EventBus.quest_changed.emit("Primer vínculo", "Captura al Carpinchito con una Manzana de Bruma", false)
			else:
				EventBus.quest_changed.emit("Primer vínculo", "Habla con Rola y Mela; prepara una Manzana de Bruma", false)
		STATE_RETURN_TO_VAL:
			EventBus.quest_changed.emit("Primer vínculo", "Vuelve con Val para evaluar la afinidad", false)
