class_name IzrdralarStoryCapture
extends "res://src/pets/capturable_creature_production.gd"

var required_world_flag := ""
var required_world_message := "Todavía no es seguro acercarse."

func configure_story(data: Dictionary) -> void:
	var color_value := str(data.get("accent", "#8fc6a9"))
	configure(
		str(data.get("id", "creature")),
		str(data.get("name", "Criatura")),
		str(data.get("affinity", "")),
		str(data.get("mentor", "")),
		str(data.get("bait", "")),
		Color(color_value)
	)
	required_world_flag = str(data.get("requires_flag", ""))
	required_world_message = str(data.get("blocked_message", required_world_message))

func interact(actor: Node = null) -> void:
	if not required_world_flag.is_empty() and not GameState.has_world_flag(required_world_flag):
		EventBus.dialog_requested.emit(display_name, required_world_message)
		EventBus.toast_requested.emit("Primero estabilizá el hábitat.")
		return
	await super.interact(actor)
