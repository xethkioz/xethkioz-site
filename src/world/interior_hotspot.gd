extends Node2D

@export var label_text := "Examinar"
@export var speaker := "Refugio"
@export_multiline var body := ""

func _ready() -> void:
	add_to_group("interactable")

func interact(_actor: Node = null) -> void:
	if not body.is_empty():
		EventBus.dialog_requested.emit(speaker, body)

func interaction_label() -> String:
	return label_text

func _draw() -> void:
	pass
