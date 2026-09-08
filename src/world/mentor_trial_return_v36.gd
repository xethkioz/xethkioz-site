extends Node2D

const REFUGE_SCENE := "res://scenes/v34/RefugioInterior.tscn"
const STATE_DEMO_COMPLETE := 15

func _ready() -> void:
	add_to_group("interactable")

func interaction_label() -> String:
	var state := int(GameState.get_quest_snapshot().get("state", 0))
	return "Volver al Refugio" if state >= STATE_DEMO_COMPLETE else "Puerta sellada"

func interact(_actor: Node = null) -> void:
	var state := int(GameState.get_quest_snapshot().get("state", 0))
	if state < STATE_DEMO_COMPLETE and not GameState.has_world_flag("mentor_trial_room_open"):
		EventBus.dialog_requested.emit("Prisma-Atlas", "La puerta todavía está leyendo tu solución.")
		return
	SaveService.save_game()
	get_tree().change_scene_to_file(REFUGE_SCENE)
