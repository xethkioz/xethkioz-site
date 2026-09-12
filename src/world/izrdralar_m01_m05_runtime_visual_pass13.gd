class_name IzrdralarM01M05RuntimeVisualPass13
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass12.gd"

const GenericReadableNpcScriptP13 := preload("res://src/npc/npc_interactable_production_pass02.gd")
const AlexisGuideRuntimeScriptP13 := preload("res://src/npc/alexis_guide_runtime.gd")
const IvanScientistRuntimeScript := preload("res://src/npc/ivan_scientist_runtime.gd")

# Pass 13 specializes P04/Iván while preserving the validated P03/Alexis
# specialization and every inherited map/encounter/save contract.
func _ready() -> void:
	super._ready()
	_install_ivan_depth_contract()

func _spawn_npcs() -> void:
	for npc_value in map_data.get("npcs", []):
		if not (npc_value is Dictionary):
			continue
		var data: Dictionary = npc_value
		var npc := Node2D.new()
		npc.name = str(data.get("name", "NPC"))
		var npc_id := str(data.get("id", "npc"))
		if npc_id == "alexis":
			npc.set_script(AlexisGuideRuntimeScriptP13)
		elif npc_id == "ivan":
			npc.set_script(IvanScientistRuntimeScript)
		else:
			npc.set_script(GenericReadableNpcScriptP13)
		npc.position = _vector_from_array(data.get("position", [0, 0]))
		var lines: Array[String] = []
		for line_value in data.get("lines", []):
			lines.append(str(line_value))
		var rules: Array = data.get("contextual_rules", [])
		npc.call(
			"configure_production",
			npc_id,
			str(data.get("name", "NPC")),
			lines,
			int(data.get("atlas", 0)),
			rules
		)
		add_child(npc)

func _install_ivan_depth_contract() -> void:
	if map_id != "M02":
		return
	var ivan := get_node_or_null("Iván") as Node2D
	if ivan == null or ivan.get_script() != IvanScientistRuntimeScript:
		return
	_bind_depth(ivan, 12.5)
	_install_contact_shadow(ivan, Vector2(12.0, 3.6), 0.30, Vector2(0, 11))
