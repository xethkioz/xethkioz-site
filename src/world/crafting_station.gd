extends Node2D

@export var recipe_id := "racion_bosque"

func _ready() -> void:
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if not InventoryService.craft(recipe_id):
		EventBus.dialog_requested.emit("Fogón", "Necesitás 2 Manzanas de Bruma y 1 Hongo Azul de Rocío para preparar una Ración del Bosque.")

func interaction_label() -> String:
	return "Cocinar"

func _draw() -> void:
	draw_circle(Vector2.ZERO, 10.0, Color("5c4434"))
	draw_circle(Vector2(0, -4), 6.0, Color("ff8c42"))
	draw_circle(Vector2(0, -7), 3.0, Color("ffd075"))
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(-28, -17), "Fogón", HORIZONTAL_ALIGNMENT_CENTER, 56, 9, Color("f0f0f5"))
