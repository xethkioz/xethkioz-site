extends Node2D

var item_id := "manzana_bruma"
var amount := 1
var profession_id := "botanica"
var profession_xp := 3
var accent_color := Color("8fcf78")
var depleted := false
var persistence_id := ""

func configure(id_value: String, amount_value: int, profession_value: String, xp_value: int, color_value: Color) -> void:
	item_id = id_value
	amount = amount_value
	profession_id = profession_value
	profession_xp = xp_value
	accent_color = color_value
	queue_redraw()

func _ready() -> void:
	if persistence_id.is_empty():
		persistence_id = "resource:%s:%d:%d" % [item_id, roundi(global_position.x), roundi(global_position.y)]
	if GameState.has_world_flag(persistence_id):
		depleted = true
		visible = false
		return
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if depleted:
		return
	if InventoryService.add_item(item_id, amount):
		GameState.add_profession_xp(profession_id, profession_xp)
		EventBus.toast_requested.emit("Recolectaste %s x%d · +%d XP %s" % [InventoryService.item_name(item_id), amount, profession_xp, profession_id.capitalize()])
		depleted = true
		GameState.set_world_flag(persistence_id, true)
		remove_from_group("interactable")
		visible = false
		SaveService.save_game()

func interaction_label() -> String:
	return "Recolectar %s" % InventoryService.item_name(item_id)

func _draw() -> void:
	draw_circle(Vector2.ZERO, 7.0, accent_color)
	draw_circle(Vector2(-5, -6), 4.0, accent_color.lightened(0.15))
	draw_circle(Vector2(5, -5), 4.0, accent_color.darkened(0.1))
