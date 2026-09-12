extends Node

const RUNTIME_SCENE := preload("res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn")
const LAYOUT_PATH := "res://data/regions/izrdralar_m01_m05_layouts.json"

const EXPECTED_MAP_NAMES := {
	"M01": "Cuenca del Despertar",
	"M02": "Aldea del Alba",
	"M03": "Lago Encantado",
	"M04": "Ruinas Vivas / Santuario de las Raíces",
	"M05": "Corazón del Bosque Velado"
}

const REQUIRED_TEXTURES := [
	{"path":"res://assets/production/characters/viajero_sheet.svg", "min_width":96, "min_height":256, "min_bytes":4000},
	{"path":"res://assets/production/characters/xethkioz_sheet.svg", "min_width":96, "min_height":256, "min_bytes":4000},
	{"path":"res://assets/production/characters/npc_atlas.svg", "min_width":320, "min_height":32, "min_bytes":5000},
	{"path":"res://assets/production/characters/enemy_atlas.svg", "min_width":192, "min_height":32, "min_bytes":3000},
	{"path":"res://assets/production/characters/boss5_guardian_v2.svg", "min_width":64, "min_height":64, "min_bytes":1800}
]

var failures: Array[String] = []

func _ready() -> void:
	call_deferred("_run")

func _run() -> void:
	_validate_required_assets()
	var layouts := _load_layouts()
	if not layouts.is_empty():
		_validate_layout_metadata(layouts)

	await _validate_runtime_case("M01", "start", [])
	await _validate_runtime_case("M02", "from_m01", ["opening_flow_complete"])
	await _validate_runtime_case("M03", "from_m02", ["opening_flow_complete", "prisma_atlas_unlocked"])
	await _validate_runtime_case("M04", "from_m02", ["opening_flow_complete", "prisma_atlas_unlocked"])
	await _validate_runtime_case("M05", "from_m03", ["opening_flow_complete", "prisma_atlas_unlocked", "lake_resolved", "ruins_sanctuary_resolved"])

	SaveService.delete_save()
	if failures.is_empty():
		print("IZRDRALAR_VISUAL_READINESS_PASS")
		get_tree().quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_VISUAL_READINESS_FAIL")
	get_tree().quit(1)

func _validate_required_assets() -> void:
	for asset_value in REQUIRED_TEXTURES:
		var asset: Dictionary = asset_value
		var path := str(asset["path"])
		if not FileAccess.file_exists(path):
			failures.append("required production asset missing: %s" % path)
			continue
		var file := FileAccess.open(path, FileAccess.READ)
		if file == null:
			failures.append("required production asset unreadable: %s" % path)
			continue
		var length := file.get_length()
		if length < int(asset["min_bytes"]):
			failures.append("production asset too small / placeholder-risk: %s (%d bytes)" % [path, length])
		var texture := load(path) as Texture2D
		if texture == null:
			failures.append("production texture failed to import: %s" % path)
			continue
		if texture.get_width() < int(asset["min_width"]) or texture.get_height() < int(asset["min_height"]):
			failures.append("production texture dimensions below contract: %s (%dx%d)" % [path, texture.get_width(), texture.get_height()])

func _load_layouts() -> Dictionary:
	if not FileAccess.file_exists(LAYOUT_PATH):
		failures.append("layout JSON missing")
		return {}
	var file := FileAccess.open(LAYOUT_PATH, FileAccess.READ)
	if file == null:
		failures.append("layout JSON unreadable")
		return {}
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not (parsed is Dictionary):
		failures.append("layout JSON invalid")
		return {}
	return parsed as Dictionary

func _validate_layout_metadata(layouts: Dictionary) -> void:
	var maps: Dictionary = layouts.get("maps", {})
	for map_id_value in EXPECTED_MAP_NAMES.keys():
		var map_id := str(map_id_value)
		if not maps.has(map_id):
			failures.append("canonical map missing from layouts: %s" % map_id)
			continue
		var data: Dictionary = maps[map_id]
		if str(data.get("name", "")) != str(EXPECTED_MAP_NAMES[map_id]):
			failures.append("%s canonical name mismatch: %s" % [map_id, str(data.get("name", ""))])
		for npc_value in data.get("npcs", []):
			if not (npc_value is Dictionary):
				failures.append("%s has malformed NPC data" % map_id)
				continue
			var npc: Dictionary = npc_value
			var npc_text := JSON.stringify(npc).to_lower()
			if npc_text.contains("milo"):
				failures.append("obsolete MILO reference reintroduced in %s" % map_id)
			if npc_text.contains("placeholder") or npc_text.contains("[todo]") or npc_text.contains("todo:"):
				failures.append("placeholder/TODO NPC metadata remains in %s: %s" % [map_id, str(npc.get("id", "npc"))])
			var atlas := int(npc.get("atlas", -1))
			if atlas < 0 or atlas > 9:
				failures.append("%s NPC atlas index outside production atlas: %d" % [map_id, atlas])
		for enemy_value in data.get("enemies", []):
			if not (enemy_value is Dictionary):
				failures.append("%s has malformed enemy data" % map_id)
				continue
			var enemy: Dictionary = enemy_value
			var atlas := int(enemy.get("atlas", -1))
			if atlas < 0 or atlas > 5:
				failures.append("%s enemy atlas index outside production atlas: %d" % [map_id, atlas])

	var m05: Dictionary = maps.get("M05", {})
	var boss: Dictionary = m05.get("boss", {})
	if str(boss.get("id", "")) != "boss5_guardian_bosque_velado":
		failures.append("M05 must use canonical Boss 5 production id")

func _validate_runtime_case(map_id: String, entry_id: String, flags: Array) -> void:
	GameState.reset_new_game()
	for flag_value in flags:
		GameState.set_world_flag(str(flag_value))
	GameState.set_world_checkpoint(map_id, entry_id, Vector2.ZERO)

	var runtime := RUNTIME_SCENE.instantiate()
	add_child(runtime)
	for _frame in range(3):
		await get_tree().process_frame

	var player := runtime.get_node_or_null("Player") as Node2D
	if player == null:
		failures.append("%s runtime missing Player" % map_id)
	else:
		_validate_named_sprite(player, "ViajeroVisual", "%s Viajero" % map_id)
		if player.get_node_or_null("ContactShadow") == null:
			failures.append("%s Viajero missing authored contact shadow" % map_id)
		if player.get_script() == null or not str(player.get_script().resource_path).ends_with("player_controller_production_pass02.gd"):
			failures.append("%s Viajero is not using production pass controller" % map_id)

	var xethkioz := runtime.get_node_or_null("Xethkioz") as Node2D
	if xethkioz == null:
		failures.append("%s runtime missing Xethkioz" % map_id)
	else:
		_validate_xethkioz_live_visual(xethkioz, "%s Xethkioz" % map_id)
		if xethkioz.get_node_or_null("ContactShadow") == null:
			failures.append("%s Xethkioz missing authored contact shadow" % map_id)

	var npc_count := 0
	var enemy_count := 0
	for child in runtime.get_children():
		if not (child is Node2D) or child.get_script() == null:
			continue
		var script_path := str(child.get_script().resource_path)
		if script_path.ends_with("npc_interactable_production_pass02.gd"):
			npc_count += 1
			_validate_named_sprite(child, "NpcVisual", "%s NPC %s" % [map_id, child.name])
		elif script_path.ends_with("alexis_guide_runtime.gd"):
			npc_count += 1
			_validate_alexis_production_visual(child as Node2D, "%s NPC Alexis" % map_id)
		elif script_path.ends_with("enemy_controller_production.gd"):
			enemy_count += 1
			_validate_named_sprite(child, "EnemyVisual", "%s enemy %s" % [map_id, child.name])

	if map_id == "M03":
		_validate_m03_family(runtime)
	if map_id == "M05":
		_validate_boss5(runtime)

	var layout_npc_count := _current_layout_count(runtime, "npcs")
	var layout_enemy_count := _current_layout_count(runtime, "enemies")
	if npc_count != layout_npc_count:
		failures.append("%s runtime NPC visual count mismatch: %d != %d" % [map_id, npc_count, layout_npc_count])
	if enemy_count != layout_enemy_count:
		failures.append("%s runtime enemy visual count mismatch: %d != %d" % [map_id, enemy_count, layout_enemy_count])

	await _dispose_runtime(runtime)

func _validate_xethkioz_live_visual(actor: Node2D, label: String) -> void:
	var live_visual := actor.get_node_or_null("XethkiozVisual")
	if live_visual == null:
		failures.append("%s missing approved live XethkiozVisual" % label)
		return
	if live_visual.get_script() == null or not str(live_visual.get_script().resource_path).ends_with("xethkioz_approved_visual.gd"):
		failures.append("%s is not using approved P02 live renderer" % label)
	if not live_visual.has_method("set_facing") or not live_visual.has_method("set_action"):
		failures.append("%s live renderer missing movement/action state contract" % label)
	if not live_visual.has_method("set_tail_count") or not live_visual.has_method("set_rune_color"):
		failures.append("%s live renderer missing tail/rune identity contract" % label)
	if live_visual is CanvasItem and not (live_visual as CanvasItem).visible:
		failures.append("%s approved live renderer is hidden" % label)

func _validate_alexis_production_visual(actor: Node2D, label: String) -> void:
	var legacy := actor.get_node_or_null("NpcVisual") as Sprite2D
	if legacy == null:
		failures.append("%s missing compatibility NpcVisual" % label)
	elif legacy.visible:
		failures.append("%s generic compatibility sprite must stay hidden" % label)
	var approved := actor.get_node_or_null("AlexisApprovedVisual") as Node2D
	if approved == null:
		failures.append("%s missing AlexisApprovedVisual" % label)
		return
	if approved.get_script() == null or not str(approved.get_script().resource_path).ends_with("alexis_approved_visual.gd"):
		failures.append("%s is not using approved P03 renderer" % label)
	var sprite := approved.get_node_or_null("ApprovedSprite") as Sprite2D
	if sprite == null:
		failures.append("%s missing ApprovedSprite" % label)
		return
	if not sprite.visible:
		failures.append("%s approved sprite is hidden" % label)
	if sprite.texture == null:
		failures.append("%s approved sprite has no production texture" % label)
		return
	if sprite.texture.get_width() != 52 or sprite.texture.get_height() != 48:
		failures.append("%s approved frame must be 52x48 native" % label)
	if sprite.region_enabled:
		failures.append("%s approved frame must use independent texture, not atlas region" % label)
	if sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("%s approved sprite is not using nearest filtering" % label)
	if not approved.has_method("approved_texture_paths") or (approved.call("approved_texture_paths") as Array).size() != 9:
		failures.append("%s approved renderer must expose nine production states" % label)
	if not actor.has_method("is_field_support_enabled") or bool(actor.call("is_field_support_enabled")):
		failures.append("%s temporary field support must remain disabled by default" % label)

func _validate_named_sprite(actor: Node2D, sprite_name: String, label: String) -> void:
	var sprite := actor.get_node_or_null(sprite_name) as Sprite2D
	if sprite == null:
		failures.append("%s missing %s" % [label, sprite_name])
		return
	if sprite.texture == null:
		failures.append("%s sprite has no production texture" % label)
	if not sprite.region_enabled:
		failures.append("%s sprite must use authored atlas region" % label)
	if sprite.region_rect.size != Vector2(32, 32):
		failures.append("%s sprite region must be 32x32" % label)
	if sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("%s sprite is not using nearest filtering" % label)

func _validate_m03_family(runtime: Node) -> void:
	var names := ["Val", "Rola", "Mela"]
	var regions: Dictionary = {}
	var scales: Dictionary = {}
	for name_value in names:
		var actor := runtime.get_node_or_null(str(name_value)) as Node2D
		if actor == null:
			failures.append("M03 missing canonical NPC %s" % name_value)
			continue
		var sprite := actor.get_node_or_null("NpcVisual") as Sprite2D
		if sprite == null:
			failures.append("M03 %s missing NpcVisual" % name_value)
			continue
		regions[str(name_value)] = sprite.region_rect.position.x
		scales[str(name_value)] = sprite.scale.x
	if regions.size() == 3:
		var unique_regions: Dictionary = {}
		for value in regions.values():
			unique_regions[value] = true
		if unique_regions.size() != 3:
			failures.append("Val/Rola/Mela must use three distinct production silhouettes")
	if scales.has("Val") and scales.has("Rola") and scales.has("Mela"):
		if not (float(scales["Val"]) > float(scales["Rola"]) and float(scales["Rola"]) > float(scales["Mela"])):
			failures.append("Val/Rola/Mela authored scale hierarchy regressed")

func _validate_boss5(runtime: Node) -> void:
	var bosses := get_tree().get_nodes_in_group("bosses")
	var runtime_bosses: Array[Node] = []
	for boss_value in bosses:
		if boss_value is Node and runtime.is_ancestor_of(boss_value):
			runtime_bosses.append(boss_value)
	if runtime_bosses.size() != 1:
		failures.append("M05 must instantiate exactly one Boss 5 before defeat")
		return
	var boss := runtime_bosses[0] as Node2D
	if boss.get_script() == null or not str(boss.get_script().resource_path).ends_with("boss5_guardian_production.gd"):
		failures.append("M05 Boss 5 is not using production controller")
	var production_sprite: Sprite2D = null
	for child in boss.get_children():
		if child is Sprite2D and (child as Sprite2D).texture != null:
			production_sprite = child as Sprite2D
			break
	if production_sprite == null:
		failures.append("M05 Boss 5 missing production sprite")
	elif production_sprite.texture_filter != CanvasItem.TEXTURE_FILTER_NEAREST:
		failures.append("M05 Boss 5 sprite is not using nearest filtering")

func _current_layout_count(runtime: Node, key: String) -> int:
	var runtime_data: Variant = runtime.get("map_data")
	if runtime_data is Dictionary:
		return (runtime_data as Dictionary).get(key, []).size()
	return 0

func _dispose_runtime(runtime: Node) -> void:
	runtime.queue_free()
	await get_tree().process_frame
	for child in get_children():
		if child is Node2D and child != runtime:
			var child_name := str(child.name)
			if child_name.begins_with("WorldFeedbackFx"):
				child.queue_free()
	await get_tree().process_frame