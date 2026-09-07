extends "res://scripts/main_v10.gd"

const EnvironmentData = preload("res://scripts/environment_data.gd")
const AtmosphereOverlay = preload("res://scripts/atmosphere_overlay.gd")

var atmosphere_layer: CanvasLayer
var environment_badge: Label

func _setup_ui() -> void:
	super._setup_ui()
	var env_panel := Panel.new()
	env_panel.position = Vector2(430,18)
	env_panel.size = Vector2(420,54)
	env_panel.add_theme_stylebox_override("panel",_panel_style(Color(0.012,0.018,0.040,0.82),Color(0.34,0.25,0.52,0.78),1))
	hud_layer.add_child(env_panel)
	environment_badge = _vlabel(hud_layer,Vector2(448,30),Vector2(385,30),"",12,Color(0.88,0.91,1.0))
	environment_badge.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

func _start_level() -> void:
	if atmosphere_layer and is_instance_valid(atmosphere_layer):
		atmosphere_layer.queue_free()
		atmosphere_layer = null
	super._start_level()
	_refresh_map_intro_panel()
	_apply_environment_atmosphere()
	update_hud()

func _refresh_map_intro_panel() -> void:
	if not map_title_panel_v10:
		return
	var profile := EnvironmentData.profile_for_map(current_map)
	for child in map_title_panel_v10.get_children():
		if child is Label:
			child.text = "%s — %s\n%02d • %s" % [
				str(profile.get("region",WorldData.region_for_map(current_map))),
				str(profile.get("biome",WorldData.biome_for_map(current_map))),
				current_map,
				WorldData.map_name(current_map)
			]
			break
	map_title_panel_v10.visible = true
	map_title_timer_v10 = 3.4

func _apply_environment_atmosphere() -> void:
	var profile := EnvironmentData.profile_for_map(current_map)
	if profile.is_empty():
		return
	atmosphere_layer = CanvasLayer.new()
	atmosphere_layer.layer = 18
	add_child(atmosphere_layer)
	var overlay := Control.new()
	overlay.set_script(AtmosphereOverlay)
	atmosphere_layer.add_child(overlay)
	overlay.setup(profile)

# Maps 1-5 intentionally share one Izrdralar ecosystem base. Variety comes
# from time, weather, encounters and routes instead of five separate art packs.
func _build_background(biome: Dictionary,map_no: int) -> void:
	if map_no >= 1 and map_no <= 5:
		_add_visual_background()
		return
	super._build_background(biome,map_no)

func _spawn_enemy(pos: Vector2,difficulty: float,kind: int) -> void:
	var enemy := CharacterBody2D.new()
	enemy.set_script(EnemyScript)
	world.add_child(enemy)
	enemy.position = pos
	enemy.setup(self,difficulty,kind)
	if enemy.has_method("apply_environment_variant"):
		enemy.apply_environment_variant(EnvironmentData.enemy_variant_for_map(current_map))

func update_hud() -> void:
	super.update_hud()
	if not environment_badge:
		return
	var profile := EnvironmentData.profile_for_map(current_map)
	if profile.is_empty():
		environment_badge.text = ""
		return
	environment_badge.text = "%s  •  %s" % [str(profile.get("time","")),str(profile.get("weather",""))]
	if map_label:
		map_label.text = "%s • %02d/32" % [str(profile.get("region","Izrdralar")),current_map]

func environment_profile() -> Dictionary:
	return EnvironmentData.profile_for_map(current_map)

func debug_environment_summary(map_no: int) -> String:
	var profile := EnvironmentData.profile_for_map(map_no)
	var enemy_variant := EnvironmentData.enemy_variant_for_map(map_no)
	return "M%02d | B%d | %s | %s | %s | enemigo:%s" % [
		map_no,
		int(profile.get("block",0)),
		str(profile.get("biome","")),
		str(profile.get("time","")),
		str(profile.get("weather","")),
		str(enemy_variant.get("label","Común"))
	]
