extends "res://src/npc/npc_interactable_production.gd"

const GUSTAVO_TEXTURE := preload("res://assets/production/characters/gustavo_story.svg")

var quest_driven := true
var fallback_line := "..."

func configure_story(id_value: String, name_value: String, index: int, fallback: String = "...") -> void:
	fallback_line = fallback
	configure_production(id_value, name_value, [fallback_line], index)

func _ready() -> void:
	super._ready()
	if npc_id == "gustavo" and is_instance_valid(_visual):
		_visual.texture = GUSTAVO_TEXTURE
		_visual.region_enabled = false
		_visual.position = Vector2(0, -7)

func interact(_actor: Node = null) -> void:
	if quest_driven:
		EventBus.npc_interacted.emit(npc_id)
		return
	super.interact(_actor)
