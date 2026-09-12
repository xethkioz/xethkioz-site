class_name IzrdralarM01M05RuntimeVisualPass12
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass11.gd"

const GenericReadableNpcScript := preload("res://src/npc/npc_interactable_production_pass02.gd")
const AlexisGuideRuntimeScript := preload("res://src/npc/alexis_guide_runtime.gd")

# Pass 12 specializes only Alexis/P03. Every other validated M01-M05 actor,
# encounter, route, collision, save flag and visual pass remains inherited.
func _ready() -> void:
	super._ready()
	_install_alexis_depth_contract()

func _spawn_npcs() -> void:
	for npc_value in map_data.get("npcs", []):
		if not (npc_value is Dictionary):
			continue
		var data: Dictionary = npc_value
		var npc := Node2D.new()
		npc.name = str(data.get("name", "NPC"))
		var npc_id := str(data.get("id", "npc"))
		npc.set_script(AlexisGuideRuntimeScript if npc_id == "alexis" else GenericReadableNpcScript)
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

func _install_alexis_depth_contract() -> void:
	if map_id != "M01":
		return
	var alexis := get_node_or_null("Alexis") as Node2D
	if alexis == null or alexis.get_script() != AlexisGuideRuntimeScript:
		return
	_bind_depth(alexis, 12.0)
	_install_contact_shadow(alexis, Vector2(12.5, 3.8), 0.31, Vector2(0, 11))
