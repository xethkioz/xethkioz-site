extends Node2D

var species_id := "creature"
var display_name := "Criatura"
var affinity := ""
var mentor_id := ""
var bait_item_id := ""
var accent_color := Color("9fd6c0")

func configure(id_value: String, name_value: String, affinity_value: String, mentor_value: String, bait_value: String, color_value: Color) -> void:
	species_id = id_value
	display_name = name_value
	affinity = affinity_value
	mentor_id = mentor_value
	bait_item_id = bait_value
	accent_color = color_value
	queue_redraw()

func _ready() -> void:
	if GameState.has_familiar(species_id):
		queue_free()
		return
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if GameState.has_familiar(species_id):
		return
	if not bait_item_id.is_empty() and InventoryService.amount_of(bait_item_id) <= 0:
		EventBus.dialog_requested.emit(display_name, "Te observa, se acerca un poco y vuelve al agua. Parece esperar algo con olor dulce.")
		EventBus.toast_requested.emit("Necesitás una Manzana de Bruma")
		return
	if not bait_item_id.is_empty():
		var bait_cost := {bait_item_id: 1}
		InventoryService.remove_items(bait_cost)
	if GameState.capture_familiar(species_id, display_name, affinity, mentor_id):
		EventBus.dialog_requested.emit(display_name, "Acepta el alimento, toca el Prisma-Atlas con el hocico y decide quedarse cerca de vos.")
		EventBus.toast_requested.emit("Familiar capturado · %s" % display_name)
		queue_free()

func interaction_label() -> String:
	return display_name

func _draw() -> void:
	_draw_body_ellipse(Vector2.ZERO, Vector2(10, 7), accent_color)
	draw_circle(Vector2(8, -2), 5.0, accent_color.lightened(0.08))
	draw_circle(Vector2(10, -3), 1.0, Color("12151a"))
	draw_circle(Vector2(-5, 6), 3.0, accent_color.darkened(0.18))
	draw_circle(Vector2(5, 6), 3.0, accent_color.darkened(0.18))
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(-40, -14), display_name, HORIZONTAL_ALIGNMENT_CENTER, 80, 8, Color("f0f0f5"))

func _draw_body_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var angle := TAU * float(i) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)
