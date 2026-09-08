extends Node

const STATE_AWAKEN_SURVIVE := 0
const STATE_XETHKIOZ_AMBUSH := 1
const STATE_FIND_METER := 2
const STATE_FIND_GUSTAVO := 3
const STATE_FIND_ALEXIS := 4
const STATE_REACH_ALDEA := 5
const STATE_ATLAS_LOCAL := 6
const STATE_OPEN_ROUTES := 7
const STATE_SANCTUARY := 8
const STATE_BOSS5 := 9
const STATE_BOSS5_PURGE := 10
const STATE_BRIDGE_SECOND_READ := 11
const STATE_REFUGE := 12
const STATE_MENTOR_CHOICE := 13
const STATE_MENTOR_TRIAL := 14
const STATE_DEMO_COMPLETE := 15

var state := STATE_AWAKEN_SURVIVE
var first_brote_defeated := false
var ambush_slime_defeated := false
var lake_rola_read := false
var lake_mela_read := false
var lake_val_started := false
var _dialogue_busy := false

func _ready() -> void:
	add_to_group("quest_manager")
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.npc_interacted.connect(_on_npc_interacted)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.lore_discovered.connect(_on_lore_discovered)
	EventBus.poi_discovered.connect(_on_poi_discovered)
	EventBus.world_flag_changed.connect(_on_world_flag_changed)
	var saved := GameState.get_quest_snapshot()
	if not saved.is_empty() and str(saved.get("schema", "")) == "golden_v36":
		_apply_snapshot(saved)
	else:
		_initialize_v36_story()
	_update_quest()
	EventBus.demo_stage_changed.emit(_stage_for_state())

func _initialize_v36_story() -> void:
	state = STATE_AWAKEN_SURVIVE
	first_brote_defeated = false
	ambush_slime_defeated = false
	lake_rola_read = false
	lake_mela_read = false
	lake_val_started = false
	GameState.set_world_flag("golden_awaken", true)
	if GameState.xethkioz_tail_stage != 3:
		GameState.set_xethkioz_tail_stage(3)
	EventBus.toast_requested.emit("IZRDRALAR · CUENCA DEL DESPERTAR")

func _on_enemy_defeated(enemy_id: String, _xp: int, _pos: Vector2) -> void:
	if state == STATE_AWAKEN_SURVIVE and enemy_id == "brote_goblin":
		first_brote_defeated = true
		state = STATE_XETHKIOZ_AMBUSH
		EventBus.demo_stage_changed.emit("xethkioz_intercept")
		_update_quest()
		return

	if state == STATE_XETHKIOZ_AMBUSH and enemy_id == "slime_prismatico":
		ambush_slime_defeated = true
		if not GameState.has_world_flag("xethkioz_first_intercept"):
			GameState.set_world_flag("xethkioz_first_intercept", true)
		state = STATE_FIND_METER
		EventBus.demo_stage_changed.emit("strange_meter")
		_update_quest()
		return

	if state == STATE_SANCTUARY and enemy_id == "custodio_raices_menor":
		GameState.set_world_flag("sanctuary_complete", true)
		_grant_brote_piece("Fragmento de Corteza")
		state = STATE_BOSS5
		EventBus.demo_stage_changed.emit("boss5")
		EventBus.dialog_requested.emit("Alexis", "El Santuario estaba conteniendo la presión. El problema está en el Corazón del Bosque. Mirá el terreno, no solamente al Guardián.")
		_update_quest()

func _on_npc_interacted(npc_id: String) -> void:
	match npc_id:
		"gustavo":
			_handle_gustavo()
		"alexis":
			_handle_alexis()
		"ivan":
			_handle_ivan()
		"val":
			_handle_val()
		"rola":
			_handle_rola()
		"mela":
			_handle_mela()
		"elida":
			_handle_elida()
		"ashley", "fermin", "isabella", "gael":
			_handle_mentor(npc_id)
		_:
			pass

func _handle_gustavo() -> void:
	if state == STATE_FIND_GUSTAVO:
		GameState.set_world_flag("gustavo_bridge_warning_01", true)
		_play_scene([
			["?????", "No cruces ese puente cuando esté entero."],
			["Viajero", "Está entero ahora."],
			["?????", "Por eso te digo que no lo cruces."],
			["Viajero", "¿Quién sos?"],
			["?????", "Hoy, alguien que llegó temprano."]
		])
		state = STATE_FIND_ALEXIS
		EventBus.demo_stage_changed.emit("alexis_recognition")
		_update_quest()
		return

	if state == STATE_BRIDGE_SECOND_READ:
		GameState.set_world_flag("gustavo_bridge_second_read", true)
		_play_scene([
			["?????", "Ahora sí."],
			["Viajero", "El puente está roto."],
			["?????", "Te dije que no lo cruzaras cuando estuviera entero."],
			["Viajero", "Podrías haber explicado eso hace tres horas."],
			["?????", "Si te lo explicaba, no ibas a aprender a mirar."]
		])
		state = STATE_REFUGE
		EventBus.demo_stage_changed.emit("refuge_after_boss")
		_update_quest()
		return

	if GameState.has_world_flag("gustavo_bridge_warning_01"):
		EventBus.dialog_requested.emit("?????", "No todas las cosas llegan en el orden en que las entendés.")
	else:
		EventBus.dialog_requested.emit("?????", "Todavía no.")

func _handle_alexis() -> void:
	if state != STATE_FIND_ALEXIS:
		if GameState.has_world_flag("alexis_xethkioz_recognition"):
			EventBus.dialog_requested.emit("Alexis", "Seguí mirando el terreno. Xethkioz suele notar los cambios antes que nosotros.")
		return
	GameState.set_world_flag("alexis_xethkioz_recognition", true)
	_play_scene([
		["Alexis", "Quedate quieto un segundo."],
		["Viajero", "Estoy bien."],
		["Alexis", "No te estoy mirando a vos. Lo estoy mirando a él."],
		["Viajero", "¿Lo conocés?"],
		["Alexis", "Conocer es mucho decir. Hace años que aparece donde algo cambia y desaparece antes de que podamos seguirlo."],
		["Alexis", "Y nunca había elegido caminar al lado de nadie."]
	])
	state = STATE_REACH_ALDEA
	EventBus.demo_stage_changed.emit("reach_aldea")
	_update_quest()

func _handle_ivan() -> void:
	if state == STATE_REACH_ALDEA:
		GameState.set_world_flag("ivan_meter_read", true)
		_play_scene([
			["Ivan", "Esto tendría que darme dos curvas."],
			["Viajero", "¿Y qué te da?"],
			["Ivan", "Una curva y una pregunta."],
			["Alexis", "Traducilo."],
			["Ivan", "Xethkioz está sincronizándose con el Viajero sin fijarlo. Eso no pasa."],
			["Alexis", "Acaba de pasar."],
			["Ivan", "Por eso me preocupa."]
		])
		state = STATE_ATLAS_LOCAL
		_try_complete_atlas_boot()
		_update_quest()
		return
	if state == STATE_ATLAS_LOCAL:
		if not _try_complete_atlas_boot():
			EventBus.dialog_requested.emit("Ivan", "Antes de activar el Prisma-Atlas necesito una referencia local: Cuenca y Aldea. No quiero que empiece aprendiendo un mapa equivocado.")
		_update_quest()
		return
	if GameState.has_world_flag("atlas_boot") and GameState.has_lore("lore_ivan_calc_17b"):
		EventBus.dialog_requested.emit("Ivan", "La Hoja 17-B no tendría que haber sobrevivido. La lectura sigue siendo imposible, pero ya no puedo llamarla error instrumental.")
	else:
		EventBus.dialog_requested.emit("Ivan", "El Atlas registra huellas. No confundas un registro con una explicación.")

func _try_complete_atlas_boot() -> bool:
	if state != STATE_ATLAS_LOCAL:
		return false
	if not GameState.has_poi("awakening") or not GameState.has_poi("initial_village"):
		return false
	GameState.set_world_flag("atlas_boot", true)
	state = STATE_OPEN_ROUTES
	EventBus.toast_requested.emit("Prisma-Atlas I-01 activado · rutas y resonancias disponibles")
	EventBus.demo_stage_changed.emit("open_routes")
	EventBus.dialog_requested.emit("Ivan", "Lago Encantado y Ruinas Vivas están accesibles. El sendero del Santuario también, pero no vas a poder completarlo todavía. Elegí qué querés entender primero.")
	_update_quest()
	return true

func _handle_val() -> void:
	if state < STATE_OPEN_ROUTES:
		EventBus.dialog_requested.emit("Val", "Primero entendé por qué llegaste hasta acá. Después vemos qué está haciendo Xethkioz con las piedras del Lago.")
		return
	if GameState.has_world_flag("route_lake_complete"):
		EventBus.dialog_requested.emit("Val", "El vínculo está estable. Cuando quieras entrenarlo de verdad, seguí la afinidad que te marqué; no la fuerces.")
		return
	lake_val_started = true
	GameState.set_world_flag("lake_route_started", true)
	if GameState.has_familiar("carpinchito_cristal"):
		if not bool(GameState.familiar_data("carpinchito_cristal").get("assessed", false)):
			GameState.assess_familiar("carpinchito_cristal")
		GameState.set_world_flag("route_lake_complete", true)
		EventBus.dialog_requested.emit("Val", "Afinidad de Impacto. No porque pegue fuerte: porque responde bien a ruptura, peso y estabilidad. Fermín va a saber cómo entrenarlo.")
		_check_routes_complete()
		_update_quest()
		return
	if not lake_rola_read or not lake_mela_read:
		EventBus.dialog_requested.emit("Val", "No la toques todavía. Rola leyó las huellas y Mela notó algo en el reflejo. Escuchalas antes de acercarte al Carpinchito.")
	else:
		EventBus.dialog_requested.emit("Val", "Ahora estabilizá el hábitat. No persigas a la criatura: corregí lo que la está asustando y dejá que decida.")
	_update_quest()

func _handle_rola() -> void:
	if state < STATE_OPEN_ROUTES or GameState.has_world_flag("route_lake_complete"):
		EventBus.dialog_requested.emit("Rola", "Las huellas frescas siempre cuentan algo. El problema es aprender qué parte no cuentan.")
		return
	lake_rola_read = true
	GameState.set_world_flag("lake_rola_tracks", true)
	EventBus.dialog_requested.emit("Rola", "Mirá la dirección de escape. Siempre vuelve hacia los juncos y evita la zona con reflejo violeta. No lo corras: le estás cerrando su ruta segura.")
	_update_lake_ready_flag()
	_update_quest()

func _handle_mela() -> void:
	if state < STATE_OPEN_ROUTES or GameState.has_world_flag("route_lake_complete"):
		EventBus.dialog_requested.emit("Mela", "Algunas cosas laten aunque no tengan corazón.")
		return
	lake_mela_read = true
	GameState.set_world_flag("lake_mela_reflection", true)
	EventBus.dialog_requested.emit("Mela", "La piedra late mal. Y el agua repite ese latido. Cuando el violeta desaparece, el Carpinchito deja de esconderse.")
	_update_lake_ready_flag()
	_update_quest()

func _update_lake_ready_flag() -> void:
	if lake_val_started and lake_rola_read and lake_mela_read:
		GameState.set_world_flag("lake_habitat_observed", true)

func _handle_elida() -> void:
	if state != STATE_REFUGE:
		EventBus.dialog_requested.emit("Elida", "Primero volvé entero. Después hablamos.")
		return
	_play_scene([
		["Elida", "Sentate."],
		["Viajero", "Tenemos que hablar de las raíces."],
		["Elida", "Sí. Sentate."],
		["Viajero", "Ivan dice que la lectura..."],
		["Elida", "Ivan puede esperar cinco minutos. Vos venís de pelear con un bosque."],
		["Elida", "Y ese también."]
	])
	state = STATE_MENTOR_CHOICE
	EventBus.demo_stage_changed.emit("mentor_choice")
	_update_quest()

func _handle_mentor(npc_id: String) -> void:
	if state != STATE_MENTOR_CHOICE and state != STATE_MENTOR_TRIAL:
		return
	if state == STATE_MENTOR_CHOICE:
		GameState.choose_mentor(npc_id)
		state = STATE_MENTOR_TRIAL
		EventBus.demo_stage_changed.emit("mentor_trial")
		var names := {"ashley":"Ashley", "fermin":"Fermín", "isabella":"Isabella", "gael":"Gael"}
		var lines := {
			"ashley":"No te voy a enseñar a pegar más fuerte. Te voy a enseñar a decidir cuándo no conviene pegar.",
			"fermin":"Yo sí te voy a enseñar a pegar más fuerte. Pero primero quiero ver si sabés cuándo hacerlo.",
			"isabella":"Puedo hacer que algo explote después. Primero hay que lograr que explote solamente lo que queremos.",
			"gael":"Si seguís sólo el blanco, llegás tarde. Primero mirá las huellas de luz."
		}
		EventBus.dialog_requested.emit(str(names.get(npc_id, npc_id)), str(lines.get(npc_id, "Empezamos.")))
		_update_quest()
		return
	EventBus.dialog_requested.emit(npc_id.capitalize(), "La puerta de entrenamiento sigue ahí. La misma meta puede leerse de cuatro maneras.")

func complete_mentor_trial(solution_id: String) -> void:
	if state != STATE_MENTOR_TRIAL:
		return
	if not ["ashley", "fermin", "isabella", "gael"].has(solution_id):
		return
	GameState.set_world_flag("mentor_first_solution", true)
	GameState.set_world_flag("mentor_first_solution_%s" % solution_id, true)
	state = STATE_DEMO_COMPLETE
	EventBus.demo_stage_changed.emit("demo_complete")
	EventBus.toast_requested.emit("Mentoría inicial completada · Golden Region continúa")
	_update_quest()
	SaveService.save_game()

func _on_familiar_captured(species_id: String, _display_name: String) -> void:
	if species_id != "carpinchito_cristal":
		return
	GameState.set_world_flag("familiar_first_bond", true)
	EventBus.toast_requested.emit("Primer vínculo · la criatura eligió acompañarte")
	_update_quest()

func _on_lore_discovered(lore_id: String, _title: String, _count: int, _total: int) -> void:
	match lore_id:
		"lore_ivan_calc_17b":
			GameState.set_world_flag("route_ruins_complete", true)
			EventBus.toast_requested.emit("Ruinas Vivas · Hoja 17-B registrada · etiqueta A-0")
			_check_routes_complete()
		"lore_lake_resonant_stone":
			GameState.set_world_flag("lore_lake_resonant_stone", true)
		"lore_elida_roots_note":
			GameState.set_world_flag("lore_elida_roots_note", true)
	_update_quest()

func _on_poi_discovered(_poi_id: String, _name: String, _count: int, _xp: int) -> void:
	if state == STATE_ATLAS_LOCAL:
		_try_complete_atlas_boot()

func _on_world_flag_changed(flag_id: String, value: bool) -> void:
	if not value:
		return
	match flag_id:
		"strange_meter_collected":
			if state == STATE_FIND_METER:
				state = STATE_FIND_GUSTAVO
				EventBus.demo_stage_changed.emit("bridge_warning")
				_update_quest()
		"lake_habitat_stable":
			_update_quest()
		"boss5_physical_defeated":
			if state == STATE_BOSS5:
				state = STATE_BOSS5_PURGE
				_update_quest()
		"boss5_purged":
			if state == STATE_BOSS5_PURGE or state == STATE_BOSS5:
				_on_boss5_purged()
		"mentor_first_solution":
			if state == STATE_MENTOR_TRIAL:
				state = STATE_DEMO_COMPLETE
				_update_quest()

func _check_routes_complete() -> void:
	if state != STATE_OPEN_ROUTES:
		return
	if GameState.has_world_flag("route_lake_complete") and GameState.has_world_flag("route_ruins_complete"):
		state = STATE_SANCTUARY
		EventBus.demo_stage_changed.emit("sanctuary")
		EventBus.toast_requested.emit("Las dos rutas convergen · Santuario de las Raíces")

func _on_boss5_purged() -> void:
	if not GameState.has_world_flag("boss5_purged"):
		GameState.set_world_flag("boss5_purged", true)
	GameState.unlock_prism_step()
	_grant_brote_piece("Guardián purgado")
	state = STATE_BRIDGE_SECOND_READ
	EventBus.demo_stage_changed.emit("bridge_broken")
	EventBus.toast_requested.emit("Bosque estabilizado · Paso Prismático desbloqueado")
	_update_quest()
	SaveService.save_game()

func _grant_brote_piece(source: String) -> void:
	var pieces := GameState.add_set_piece("brote_vivo", 1)
	EventBus.toast_requested.emit("Brote Vivo · pieza %d/4 · %s" % [mini(pieces, 4), source])

func _update_quest() -> void:
	match state:
		STATE_AWAKEN_SURVIVE:
			EventBus.quest_changed.emit("SOBREVIVÍ", "Movete, atacá y sobreviví al Brote Goblin", false)
		STATE_XETHKIOZ_AMBUSH:
			EventBus.quest_changed.emit("SOBREVIVÍ", "Una criatura de tres colas se interpuso · enfrentá al Slime Prismático", false)
		STATE_FIND_METER:
			EventBus.quest_changed.emit("Señal imposible", "Examiná el pequeño medidor junto a las ruinas", false)
		STATE_FIND_GUSTAVO:
			EventBus.quest_changed.emit("El hombre del puente", "Hablá con ????? junto al puente intacto", false)
		STATE_FIND_ALEXIS:
			EventBus.quest_changed.emit("Huellas de tres colas", "Encontrá al hombre que está siguiendo el rastro de Xethkioz", false)
		STATE_REACH_ALDEA:
			EventBus.quest_changed.emit("Aldea del Alba", "Llegá a la Aldea y mostrá el OBJETO EXTRAÑO a Ivan", false)
		STATE_ATLAS_LOCAL:
			EventBus.quest_changed.emit("Prisma-Atlas I-01", "Registrá Cuenca del Despertar y Aldea del Alba; luego hablá con Ivan", false)
		STATE_OPEN_ROUTES:
			var lake := "✓" if GameState.has_world_flag("route_lake_complete") else "○"
			var ruins := "✓" if GameState.has_world_flag("route_ruins_complete") else "○"
			EventBus.quest_changed.emit("Dos maneras de entender", "%s Lago Encantado · %s Ruinas Vivas" % [lake, ruins], false)
		STATE_SANCTUARY:
			EventBus.quest_changed.emit("Raíces que beben luz", "Entrá al Santuario y superá sus tres cámaras", false)
		STATE_BOSS5:
			EventBus.quest_changed.emit("Corazón del Bosque", "Liberá al Guardián del Bosque Velado", false)
		STATE_BOSS5_PURGE:
			EventBus.quest_changed.emit("Corazón del Bosque", "El Guardián ya no puede luchar · ESTABILIZALO", false)
		STATE_BRIDGE_SECOND_READ:
			EventBus.quest_changed.emit("Ahora sí", "Volvé al puente y cruzá la fractura con Paso Prismático", false)
		STATE_REFUGE:
			EventBus.quest_changed.emit("Un lugar al que volver", "Entrá al Refugio y hablá con Elida", false)
		STATE_MENTOR_CHOICE:
			EventBus.quest_changed.emit("Cuatro caminos", "Elegí con quién empezar: Ashley, Fermín, Isabella o Gael", false)
		STATE_MENTOR_TRIAL:
			EventBus.quest_changed.emit("La misma puerta, cuatro lecturas", "Resolvé la primera prueba con la mentoría elegida", false)
		STATE_DEMO_COMPLETE:
			EventBus.quest_changed.emit("Golden Region", "Primer arco completado · Izrdralar continúa", true)
	_sync_snapshot()

func _stage_for_state() -> String:
	match state:
		STATE_AWAKEN_SURVIVE:
			return "awakening_survival"
		STATE_XETHKIOZ_AMBUSH:
			return "xethkioz_intercept"
		STATE_FIND_METER:
			return "strange_meter"
		STATE_FIND_GUSTAVO:
			return "bridge_warning"
		STATE_FIND_ALEXIS:
			return "alexis_recognition"
		STATE_REACH_ALDEA, STATE_ATLAS_LOCAL:
			return "reach_aldea"
		STATE_OPEN_ROUTES:
			return "open_routes"
		STATE_SANCTUARY:
			return "sanctuary"
		STATE_BOSS5, STATE_BOSS5_PURGE:
			return "boss5"
		STATE_BRIDGE_SECOND_READ:
			return "bridge_broken"
		STATE_REFUGE:
			return "refuge_after_boss"
		STATE_MENTOR_CHOICE:
			return "mentor_choice"
		STATE_MENTOR_TRIAL:
			return "mentor_trial"
		_:
			return "demo_complete"

func _sync_snapshot() -> void:
	GameState.set_quest_snapshot({
		"schema":"golden_v36",
		"state":state,
		"first_brote_defeated":first_brote_defeated,
		"ambush_slime_defeated":ambush_slime_defeated,
		"lake_rola_read":lake_rola_read,
		"lake_mela_read":lake_mela_read,
		"lake_val_started":lake_val_started
	})

func _apply_snapshot(snapshot: Dictionary) -> void:
	state = clampi(int(snapshot.get("state", STATE_AWAKEN_SURVIVE)), STATE_AWAKEN_SURVIVE, STATE_DEMO_COMPLETE)
	first_brote_defeated = bool(snapshot.get("first_brote_defeated", false))
	ambush_slime_defeated = bool(snapshot.get("ambush_slime_defeated", false))
	lake_rola_read = bool(snapshot.get("lake_rola_read", GameState.has_world_flag("lake_rola_tracks")))
	lake_mela_read = bool(snapshot.get("lake_mela_read", GameState.has_world_flag("lake_mela_reflection")))
	lake_val_started = bool(snapshot.get("lake_val_started", GameState.has_world_flag("lake_route_started")))

func _play_scene(lines: Array) -> void:
	if _dialogue_busy:
		return
	_dialogue_busy = true
	call_deferred("_play_scene_async", lines)

func _play_scene_async(lines: Array) -> void:
	for entry in lines:
		if not (entry is Array) or entry.size() < 2:
			continue
		EventBus.dialog_requested.emit(str(entry[0]), str(entry[1]))
		await get_tree().create_timer(4.0).timeout
	_dialogue_busy = false
