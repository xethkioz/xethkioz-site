extends "res://scripts/main_v11.gd"

# v0.8.2 — Izrdalar Block Playtest
# Restores normal campaign progression after Map 1 so the player can test
# the full 1→5 environment block in one run.

func _setup_ui() -> void:
	super._setup_ui()
	# Keep the objective visible but much less intrusive than the v0.8.1 build.
	if objective_label:
		objective_label.position = Vector2(390,86)
		objective_label.size = Vector2(500,22)
		objective_label.add_theme_font_size_override("font_size",10)
		objective_label.add_theme_color_override("font_color",Color(0.78,0.90,1.0,0.92))
	if toast_label:
		toast_label.position = Vector2(420,535)
		toast_label.size = Vector2(440,34)
		toast_label.add_theme_font_size_override("font_size",12)

func _complete_map() -> void:
	# main_v10 deliberately stopped after Map 1 while the visual target was being
	# approved. For the block playtest we need Map 1 to flow into Map 2 normally.
	if current_map != 1:
		super._complete_map()
		return
	if map_complete:
		return
	map_complete = true
	state["unlocked_map"] = max(int(state.get("unlocked_map",1)),2)
	current_map = 2
	state["current_map"] = current_map
	supplies = min(float(state.get("max_supplies",100.0)),supplies+10.0)
	state["supplies"] = supplies
	SaveSystem.save_state(state)
	_show_intermission()

func _show_title() -> void:
	super._show_title()
	# Replace internal slice wording with the purpose of this user-facing test.
	for node in menu_layer.get_children():
		if node is Label and "v0.8.0" in node.text:
			node.text = "v0.8.2 • IZRDALAR BLOCK PLAYTEST • MAPAS 1–5 • XETHKIOZ"

func update_hud() -> void:
	super.update_hud()
	if objective_label:
		match current_map:
			1: objective_label.text = "Llegá al Umbral • G: resonancias"
			2: objective_label.text = "Derrotá guardianes • buscá rutas altas"
			3: objective_label.text = "Bruma espiritual • encontrá el vínculo oculto"
			4: objective_label.text = "Noche • sobreviví la gauntlet"
			5: objective_label.text = "Tormenta Prismática • derrotá al Arconte"
