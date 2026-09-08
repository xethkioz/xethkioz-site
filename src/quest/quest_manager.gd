extends Node

const STATE_NOT_STARTED := 0
const STATE_ROOTS_ACTIVE := 1
const STATE_RETURN_TO_ALEXIS := 2
const STATE_SEEK_VAL := 3
const STATE_CAPTURE_ACTIVE := 4
const STATE_RETURN_TO_VAL := 5
const STATE_SANCTUARY_ACTIVE := 6
const STATE_BOSS5_ACTIVE := 7
const STATE_RETURN_TO_ELIDA := 8
const STATE_MENTOR_CHOICE := 9
const STATE_TRAIN_WITH_FERMIN := 10
const STATE_FERMIN_TRAINING_ACTIVE := 11
const STATE_RETURN_TO_FERMIN := 12
const STATE_DEMO_COMPLETE := 13
const REQUIRED_KILLS := 3
const REQUIRED_TRAINING_TARGETS := 3

var state := STATE_NOT_STARTED
var defeated := 0
var training_defeated := 0
var talked_rola := false
var talked_mela := false

func _ready() -> void:
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.npc_interacted.connect(_on_npc_interacted)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.quest_changed.emit("Primeras señales", "Habla con Alexis en la Cuenca del Despertar", false)
	EventBus.demo_stage_changed.emit("intro")

func _on_npc_interacted(npc_id: String) -> void:
	if npc_id == "alexis":
		_handle_alexis()
		return
	if npc_id == "val":
		_handle_val()
		return
	if npc_id == "elida":
		_handle_elida()
		return
	if npc_id in ["ashley", "fermin", "isabella", "gael"]:
		_handle_sibling(npc_id)
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
			EventBus.demo_stage_changed.emit("roots")
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
			EventBus.demo_stage_changed.emit("seek_val")
			_update_quest()

func _handle_val() -> void:
	match state:
		STATE_SEEK_VAL:
			if GameState.has_familiar("carpinchito_cristal"):
				_complete_familiar_assessment()
			else:
				state = STATE_CAPTURE_ACTIVE
				EventBus.dialog_requested.emit("Val", "Rola vio un Carpinchito de Cristal cerca de la orilla. Hablá con ella y con Mela. Si conseguís una Manzana de Bruma, dejá que la criatura decida acercarse.")
				EventBus.demo_stage_changed.emit("capture")
				_update_quest()
		STATE_RETURN_TO_VAL:
			_complete_familiar_assessment()

func _complete_familiar_assessment() -> void:
	if not GameState.has_familiar("carpinchito_cristal"):
		return
	GameState.assess_familiar("carpinchito_cristal")
	GameState.add_xp(60)
	state = STATE_SANCTUARY_ACTIVE
	EventBus.dialog_requested.emit("Val", "Es una afinidad de Impacto: estable, física y de ruptura. Fermín va a poder entrenarlo. Antes, el Santuario de las Raíces tiene que quedar libre: algo está cortando la resonancia del bosque.")
	EventBus.toast_requested.emit("Afinidad descubierta · Impacto · Mentor recomendado: Fermín · +60 XP")
	EventBus.demo_stage_changed.emit("sanctuary")
	_update_quest()

func _handle_elida() -> void:
	if state != STATE_RETURN_TO_ELIDA:
		return
	state = STATE_MENTOR_CHOICE
	EventBus.dialog_requested.emit("Elida", "Volviste distinto. El bosque también. Los cuatro chicos pueden enseñarte caminos diferentes, pero ninguno te encierra para siempre. Elegí con quién querés empezar.")
	EventBus.demo_stage_changed.emit("mentor_choice")
	_update_quest()

func _handle_sibling(npc_id: String) -> void:
	if state == STATE_MENTOR_CHOICE:
		GameState.choose_mentor(npc_id)
		GameState.unlock_prism_step()
		GameState.add_xp(80)
		state = STATE_TRAIN_WITH_FERMIN
		var names := {"ashley":"Ashley", "fermin":"Fermín", "isabella":"Isabella", "gael":"Gael"}
		EventBus.dialog_requested.emit(str(names.get(npc_id, npc_id)), "Empezamos por acá. No es una jaula: después vas a poder aprender de los demás. Alexis ya puede mostrarte cómo convertir tu dash en Paso Prismático.")
		EventBus.toast_requested.emit("Mentoría inicial desbloqueada · Paso Prismático · +80 XP")
		EventBus.demo_stage_changed.emit("training")
		_update_quest()
		return
	if state == STATE_TRAIN_WITH_FERMIN and npc_id == "fermin":
		training_defeated = 0
		state = STATE_FERMIN_TRAINING_ACTIVE
		EventBus.dialog_requested.emit("Fermín", "Impacto no significa pegar a lo bruto. Rompé los tres núcleos cuando estés bien colocado y no persigas el golpe. Quiero ver control antes de entrenar al Carpinchito.")
		EventBus.demo_stage_changed.emit("fermin_training")
		_update_quest()
		return
	if state == STATE_RETURN_TO_FERMIN and npc_id == "fermin":
		if GameState.train_familiar("carpinchito_cristal", "fermin"):
			GameState.add_xp(80)
			state = STATE_DEMO_COMPLETE
			EventBus.dialog_requested.emit("Fermín", "Ahora sí. No necesitaba pegar más fuerte: necesitaba aprender cuándo romper la guardia. El Carpinchito ya puede usar Embate de Cristal. Esto recién empieza.")
			EventBus.quest_changed.emit("Golden Region", "Demo completada · Izrdralar continúa más allá del Bosque Velado", true)
			EventBus.toast_requested.emit("Familiar Rango I · Embate de Cristal desbloqueado")
			EventBus.demo_stage_changed.emit("demo_complete")

func _on_enemy_defeated(enemy_id: String, _xp: int, _pos: Vector2) -> void:
	if state == STATE_ROOTS_ACTIVE:
		if enemy_id == "brote_goblin":
			defeated = mini(defeated + 1, REQUIRED_KILLS)
			if defeated >= REQUIRED_KILLS:
				state = STATE_RETURN_TO_ALEXIS
			_update_quest()
		return
	if state == STATE_SANCTUARY_ACTIVE and enemy_id == "custodio_raices_menor":
		state = STATE_BOSS5_ACTIVE
		EventBus.dialog_requested.emit("Alexis", "La presión del Santuario cayó. Ahora sí: el Guardián del Bosque Velado quedó expuesto. Mirá el terreno, no solamente su cuerpo.")
		EventBus.demo_stage_changed.emit("boss5")
		_update_quest()
		return
	if state == STATE_BOSS5_ACTIVE and enemy_id == "boss5_guardian_bosque_velado":
		state = STATE_RETURN_TO_ELIDA
		EventBus.demo_stage_changed.emit("refuge_after_boss")
		_update_quest()
		return
	if state == STATE_FERMIN_TRAINING_ACTIVE and enemy_id == "nucleo_entrenamiento_impacto":
		training_defeated = mini(training_defeated + 1, REQUIRED_TRAINING_TARGETS)
		if training_defeated >= REQUIRED_TRAINING_TARGETS:
			state = STATE_RETURN_TO_FERMIN
			EventBus.toast_requested.emit("Prueba de Impacto completada · volvé con Fermín")
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
		STATE_SANCTUARY_ACTIVE:
			EventBus.quest_changed.emit("Santuario de las Raíces", "Entra al Santuario y derrota al Custodio Menor", false)
		STATE_BOSS5_ACTIVE:
			EventBus.quest_changed.emit("Corazón del Bosque", "Derrota al Guardián del Bosque Velado", false)
		STATE_RETURN_TO_ELIDA:
			EventBus.quest_changed.emit("Después de la tormenta", "Vuelve al Refugio y habla con Elida", false)
		STATE_MENTOR_CHOICE:
			EventBus.quest_changed.emit("Cuatro caminos", "Habla con Ashley, Fermín, Isabella o Gael", false)
		STATE_TRAIN_WITH_FERMIN:
			EventBus.quest_changed.emit("Disciplina de Impacto", "Habla con Fermín para iniciar el entrenamiento", false)
		STATE_FERMIN_TRAINING_ACTIVE:
			EventBus.quest_changed.emit("Disciplina de Impacto", "Rompe los núcleos de entrenamiento (%d/%d)" % [training_defeated, REQUIRED_TRAINING_TARGETS], false)
		STATE_RETURN_TO_FERMIN:
			EventBus.quest_changed.emit("Disciplina de Impacto", "Vuelve con Fermín", false)
