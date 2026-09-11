class_name IzrdralarEntryPoint
extends Marker2D

@export var entry_id: String = "start"

func _ready() -> void:
	add_to_group("izrdralar_entry_point")
	set_meta("entry_id", entry_id)
