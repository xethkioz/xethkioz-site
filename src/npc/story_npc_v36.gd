extends "res://src/npc/npc_interactable_production.gd"

var quest_driven := true
var fallback_line := "..."

func configure_story(id_value: String, name_value: String, index: int, fallback: String = "...") -> void:
	fallback_line = fallback
	configure_production(id_value, name_value, [fallback_line], index)

func interact(_actor: Node = null) -> void:
	if quest_driven:
		EventBus.npc_interacted.emit(npc_id)
		return
	super.interact(_actor)
