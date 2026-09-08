extends "res://src/world/golden_region_controller.gd"

const AuthoredChunkScript := preload("res://src/world/production_chunk_v36.gd")
const HudV36Script := preload("res://src/ui/hud_controller_v36.gd")
const MinimapV36Script := preload("res://src/ui/minimap_overlay.gd")
const PoiTrackerV36Script := preload("res://src/world/poi_tracker.gd")
const QuestV36Script := preload("res://src/quest/quest_manager_v36.gd")
const ClockV36Script := preload("res://src/world/world_clock.gd")
const WeatherV36Script := preload("res://src/world/weather_controller.gd")
const EncounterV36Script := preload("res://src/world/production_encounter_director.gd")

func _load_chunk(coord: Vector2i) -> void:
	var key := _chunk_key(coord)
	var data: Dictionary = manifest.get("chunks", {}).get(key, {})
	if data.is_empty():
		return
	var chunk := Node2D.new()
	chunk.name = "Chunk_%s" % key.replace(",", "_")
	chunk.set_script(AuthoredChunkScript)
	add_child(chunk)
	move_child(chunk, 0)
	chunk.configure(coord, data, int(manifest.get("world_seed", 21500809)))
	active_chunks[key] = chunk

func _spawn_systems() -> void:
	var encounter_director := Node.new()
	encounter_director.name = "ProductionEncounterDirector"
	encounter_director.set_script(EncounterV36Script)
	add_child(encounter_director)

	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudV36Script)
	add_child(hud)

	var minimap := Control.new()
	minimap.name = "GoldenRegionMinimap"
	minimap.set_script(MinimapV36Script)
	minimap.position = Vector2(494, 64)
	minimap.size = Vector2(138, 86)
	minimap.configure(player, _world_size, manifest.get("poi", []))
	hud.add_child(minimap)

	var poi_tracker := Node.new()
	poi_tracker.name = "PoiTracker"
	poi_tracker.set_script(PoiTrackerV36Script)
	poi_tracker.configure(player, manifest.get("poi", []))
	add_child(poi_tracker)

	var quests := Node.new()
	quests.name = "QuestManager"
	quests.set_script(QuestV36Script)
	add_child(quests)

	var clock := Node.new()
	clock.name = "WorldClock"
	clock.set_script(ClockV36Script)
	add_child(clock)

	var weather := Node.new()
	weather.name = "Weather"
	weather.set_script(WeatherV36Script)
	add_child(weather)
