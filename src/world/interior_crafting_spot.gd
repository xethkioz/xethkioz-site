extends Node2D

@export var recipe_id := "racion_bosque"
@export var label_text := "Cocinar"

func _ready() -> void:
	add_to_group("interactable")

func interact(_actor: Node = null) -> void:
	if not InventoryService.craft(recipe_id):
		EventBus.dialog_requested.emit("Fogón de Elida", "Para una Ración del Bosque necesitás 2 Manzanas de Bruma y 1 Hongo Azul de Rocío.")

func interaction_label() -> String:
	return label_text

func _draw() -> void:
	pass
