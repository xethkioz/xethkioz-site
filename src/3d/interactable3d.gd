class_name XethkiozInteractable3D
extends Area3D

signal interacted(actor: Node)

@export var interaction_text: String = "Inspeccionar"
@export var toast_text: String = "Objeto de prueba 3D"
@export var one_shot: bool = false

var _used := false

func _ready() -> void:
	add_to_group("interactable3d")

func interaction_label() -> String:
	return interaction_text

func interact(actor: Node) -> bool:
	if one_shot and _used:
		return false
	_used = true
	interacted.emit(actor)
	if Engine.has_singleton("EventBus"):
		pass
	if is_instance_valid(EventBus):
		EventBus.toast_requested.emit(toast_text)
	return true
