extends Node2D

@export var target_scene := ""
@export var label_text := "Entrar"
@export var min_quest_state := 0
@export var locked_message := "El acceso todavía no está disponible."
@export var return_world_position := Vector2.ZERO
@export var accent_color := Color("8b5cf6")

func _ready() -> void:
	add_to_group("interactable")
	queue_redraw()

func interact(_actor: Node = null) -> void:
	var snapshot := GameState.get_quest_snapshot()
	var current_state := int(snapshot.get("state", 0))
	if current_state < min_quest_state:
		EventBus.dialog_requested.emit("Prisma-Atlas", locked_message)
		return
	if target_scene.is_empty():
		return
	if return_world_position != Vector2.ZERO:
		GameState.set_last_world_position(return_world_position)
	SaveService.save_game()
	get_tree().change_scene_to_file(target_scene)

func interaction_label() -> String:
	return label_text

func _draw() -> void:
	draw_rect(Rect2(-13, -18, 26, 28), Color("30262a"), true)
	draw_rect(Rect2(-10, -15, 20, 25), Color("5b4033"), true)
	draw_rect(Rect2(-13, -18, 26, 28), accent_color, false, 1.0)
	draw_circle(Vector2(6, -2), 2.0, Color("ffcf76"))
	draw_arc(Vector2(0, -4), 18.0, 0.0, TAU, 24, Color(accent_color.r, accent_color.g, accent_color.b, 0.22), 1.0)
