class_name IzrdralarNavigationGraph
extends RefCounted

const GRAPH_PATH := "res://data/regions/izrdralar_m01_m05_navigation.json"

var _graph: Dictionary = {}

func load_graph(path: String = GRAPH_PATH) -> bool:
	_graph.clear()
	if not FileAccess.file_exists(path):
		return false
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return false
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not (parsed is Dictionary):
		return false
	_graph = (parsed as Dictionary).duplicate(true)
	return str(_graph.get("graph_id", "")) == "izrdralar_m01_m05_navigation"

func graph_data() -> Dictionary:
	return _graph.duplicate(true)

func map_data(map_id: String) -> Dictionary:
	var maps: Dictionary = _graph.get("maps", {})
	var value: Variant = maps.get(map_id, {})
	return (value as Dictionary).duplicate(true) if value is Dictionary else {}

func edges_from(map_id: String) -> Array[Dictionary]:
	var result: Array[Dictionary] = []
	var map_value := map_data(map_id)
	for edge_value in map_value.get("edges", []):
		if edge_value is Dictionary:
			result.append((edge_value as Dictionary).duplicate(true))
	return result

func available_edges(map_id: String, world_flags: Dictionary, include_scope_exit: bool = false) -> Array[Dictionary]:
	var normalized_flags := normalize_flags(world_flags)
	var result: Array[Dictionary] = []
	for edge in edges_from(map_id):
		if _edge_unlocked(edge, normalized_flags, include_scope_exit):
			result.append(edge)
	return result

func can_traverse(map_id: String, target_map_id: String, world_flags: Dictionary, include_scope_exit: bool = false) -> bool:
	return not resolve_edge(map_id, target_map_id, world_flags, include_scope_exit).is_empty()

func resolve_edge(map_id: String, target_map_id: String, world_flags: Dictionary, include_scope_exit: bool = false) -> Dictionary:
	var normalized_flags := normalize_flags(world_flags)
	for edge in edges_from(map_id):
		if str(edge.get("to", "")) != target_map_id:
			continue
		if _edge_unlocked(edge, normalized_flags, include_scope_exit):
			return edge
	return {}

func missing_requirements(map_id: String, target_map_id: String, world_flags: Dictionary) -> Array[String]:
	var normalized_flags := normalize_flags(world_flags)
	for edge in edges_from(map_id):
		if str(edge.get("to", "")) != target_map_id:
			continue
		var missing: Array[String] = []
		for flag_value in edge.get("requires_all", []):
			var flag_id := str(flag_value)
			if not bool(normalized_flags.get(flag_id, false)):
				missing.append(flag_id)
		return missing
	return []

func normalize_flags(world_flags: Dictionary) -> Dictionary:
	var normalized := world_flags.duplicate(true)
	var aliases: Dictionary = _graph.get("legacy_flag_aliases", {})
	for old_key_value in aliases.keys():
		var old_key := str(old_key_value)
		var canonical_key := str(aliases[old_key_value])
		if bool(normalized.get(old_key, false)):
			normalized[canonical_key] = true
	return normalized

func validate_checkpoint(map_id: String, entry_id: String) -> bool:
	var map_value := map_data(map_id)
	if map_value.is_empty():
		return false
	var entries: Array = map_value.get("entries", [])
	return entry_id in entries

func _edge_unlocked(edge: Dictionary, world_flags: Dictionary, include_scope_exit: bool) -> bool:
	if bool(edge.get("scope_exit", false)) and not include_scope_exit:
		return false
	for flag_value in edge.get("requires_all", []):
		if not bool(world_flags.get(str(flag_value), false)):
			return false
	var requires_any: Array = edge.get("requires_any", [])
	if not requires_any.is_empty():
		var any_met := false
		for flag_value in requires_any:
			if bool(world_flags.get(str(flag_value), false)):
				any_met = true
				break
		if not any_met:
			return false
	for flag_value in edge.get("blocked_if_any", []):
		if bool(world_flags.get(str(flag_value), false)):
			return false
	return true
