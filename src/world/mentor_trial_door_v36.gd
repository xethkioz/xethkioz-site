extends Node2D

const TARGET_SCENE := "res://scenes/v34/MentorTrialRoom.tscn"
const STATE_MENTOR_TRIAL := 14

func _ready() -> void:
	add_to_group("interactable")

func interaction_label() -> String:
	var snapshot := GameState.get_quest_snapshot()
	var state := int(snapshot.get("state", 0))
	if state < STATE_MENTOR_TRIAL or GameState.selected_mentor.is_empty():
		return "Puerta de entrenamiento"
	return "Entrar · prueba de %s" % _mentor_name(GameState.selected_mentor)

func interact(_actor: Node = null) -> void:
	var snapshot := GameState.get_quest_snapshot()
	var state := int(snapshot.get("state", 0))
	if state < STATE_MENTOR_TRIAL:
		EventBus.dialog_requested.emit("Elida", "Primero elegí con quién querés leer esa puerta.")
		return
	if GameState.selected_mentor.is_empty():
		EventBus.dialog_requested.emit("Prisma-Atlas", "No hay una mentoría activa.")
		return
	SaveService.save_game()
	get_tree().change_scene_to_file(TARGET_SCENE)

func _mentor_name(id_value: String) -> String:
	return {
		"ashley":"Ashley",
		"fermin":"Fermín",
		"isabella":"Isabella",
		"gael":"Gael"
	}.get(id_value, id_value.capitalize())
