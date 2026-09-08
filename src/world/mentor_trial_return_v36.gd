extends Node2D

const REFUGE_SCENE := "res://scenes/v34/RefugioInterior.tscn"

func _ready() -> void:
	add_to_group("interactable")

func interaction_label() -> String:
	return "Volver al Refugio"

func interact(_actor: Node = null) -> void:
	SaveService.save_game()
	get_tree().change_scene_to_file(REFUGE_SCENE)
