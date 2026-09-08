extends "res://src/quest/quest_manager_v36.gd"

const VALID_MENTORS := ["ashley", "fermin", "isabella", "gael"]

func _handle_mentor(npc_id: String) -> void:
	if not VALID_MENTORS.has(npc_id):
		return
	if state == STATE_MENTOR_CHOICE:
		super._handle_mentor(npc_id)
		return
	if state == STATE_MENTOR_TRIAL or state == STATE_DEMO_COMPLETE:
		GameState.choose_mentor(npc_id)
		var names := {"ashley":"Ashley", "fermin":"Fermín", "isabella":"Isabella", "gael":"Gael"}
		var prompts := {
			"ashley":"La puerta sigue siendo la misma. Esta vez escuchá el ritmo antes de tocar nada.",
			"fermin":"Mismo problema. Distinta lectura. Fijate dónde está el peso antes de moverlo.",
			"isabella":"Dos runas, una relación. No mires símbolos aislados: mirá qué se alimenta de qué.",
			"gael":"No apuntes todavía. Primero encontrá la huella que une los blancos."
		}
		EventBus.dialog_requested.emit(str(names.get(npc_id, npc_id)), str(prompts.get(npc_id, "Probemos otra lectura.")))
		_update_quest()
		return

func complete_mentor_trial(solution_id: String) -> void:
	if not VALID_MENTORS.has(solution_id):
		return
	if state == STATE_MENTOR_TRIAL:
		super.complete_mentor_trial(solution_id)
		_register_solution(solution_id)
		_try_train_active_familiar(solution_id)
		return
	if state == STATE_DEMO_COMPLETE:
		_register_solution(solution_id)
		_try_train_active_familiar(solution_id)
		EventBus.toast_requested.emit("Lectura de %s registrada · podés probar las otras" % _mentor_name(solution_id))
		SaveService.save_game()

func _register_solution(solution_id: String) -> void:
	GameState.set_world_flag("mentor_solution_%s" % solution_id, true)
	var all_complete := true
	for mentor in VALID_MENTORS:
		if not GameState.has_world_flag("mentor_solution_%s" % mentor):
			all_complete = false
			break
	if all_complete:
		GameState.set_world_flag("mentor_all_solutions", true)
		EventBus.toast_requested.emit("Cuatro lecturas completadas · la puerta ya no tiene una sola respuesta")

func _try_train_active_familiar(mentor_id: String) -> void:
	if GameState.active_familiar_id.is_empty():
		return
	if GameState.train_familiar(GameState.active_familiar_id, mentor_id):
		var data := GameState.active_familiar_data()
		var ability := str(data.get("unlocked_ability", ""))
		if ability.is_empty():
			EventBus.toast_requested.emit("Familiar · Disciplina I desbloqueada")
		else:
			EventBus.toast_requested.emit("Familiar · Disciplina I · %s" % ability.replace("_", " ").capitalize())

func _mentor_name(id_value: String) -> String:
	return {
		"ashley":"Ashley",
		"fermin":"Fermín",
		"isabella":"Isabella",
		"gael":"Gael"
	}.get(id_value, id_value.capitalize())
