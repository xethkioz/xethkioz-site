extends "res://scripts/main_v11.gd"

const CombatFX = preload("res://scripts/combat_fx.gd")
const V083World = preload("res://scripts/v083_world.gd")

func _setup_ui() -> void:
	super._setup_ui()
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
	for node in menu_layer.get_children():
		if node is Label and "v0.8.0" in node.text:
			node.text = "v0.8.3 • GAME FEEL PLAYTEST • IZRDALAR 1–5 • XETHKIOZ"

func update_hud() -> void:
	super.update_hud()
	if objective_label:
		match current_map:
			1: objective_label.text = "Tomá impulso • probá ruta alta/baja • G: resonancias"
			2: objective_label.text = "Usá rampas y pads prismáticos • guardianes más agresivos"
			3: objective_label.text = "Bruma • rebotes verticales • reuní 4 fragmentos"
			4: objective_label.text = "Noche • mantené velocidad sin caer en emboscadas"
			5: objective_label.text = "Tormenta • carrera de aproximación • derrotá al Arconte"
		if bool(state.get("mentor_chosen",false)) and current_map >= 6:
			objective_label.text = "Q/E/R: skills de mentor con efectos • F: definitiva de set"

func _generate_demo_level(map_no: int) -> void:
	V083World.build(self,map_no)

func _spawn_combat_fx(effect_mode: String,pos: Vector2,color: Color,radius: float,duration: float = 0.35,facing_dir: int = 1,intensity: float = 1.0) -> void:
	if not world:
		return
	var fx := Node2D.new()
	fx.set_script(CombatFX)
	world.add_child(fx)
	fx.global_position = pos
	fx.setup(effect_mode,color,radius,duration,facing_dir,intensity)

func enemy_hit_feedback(pos: Vector2,amount: float) -> void:
	_spawn_combat_fx("burst",pos+Vector2(0,-15),Color(1.0,0.55,0.24),26.0,0.18,1,0.8)
	if not world:
		return
	var label := Label.new()
	label.position = pos+Vector2(-18,-58)
	label.size = Vector2(70,28)
	label.text = str(int(round(amount)))
	label.z_index = 95
	label.add_theme_font_size_override("font_size",16)
	label.add_theme_color_override("font_color",Color(1.0,0.82,0.42))
	label.add_theme_color_override("font_shadow_color",Color(0.0,0.0,0.0,0.95))
	world.add_child(label)
	var tween := create_tween()
	tween.tween_property(label,"position",label.position+Vector2(0,-26),0.34)
	tween.parallel().tween_property(label,"modulate",Color(1,1,1,0),0.34)
	tween.finished.connect(func():
		if is_instance_valid(label): label.queue_free()
	)

func player_attack(pos: Vector2,facing_dir: int,power: float) -> void:
	super.player_attack(pos,facing_dir,power)
	_spawn_combat_fx("slash",pos+Vector2(facing_dir*34,-4),Color(0.82,0.54,1.0),58.0,0.16,facing_dir,0.8)

func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	var mentor_ready: bool = bool(state.get("mentor_chosen",false))
	var set_ready: bool = slot != 3 or is_set_skill_unlocked()
	super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class)
	if not mentor_ready or not set_ready:
		return
	var mode: String = "burst"
	var color: Color = Color(0.72,0.42,1.0)
	var radii: Array[float] = [125.0,155.0,245.0,390.0]
	var radius: float = radii[clampi(slot,0,3)]
	match hero_class:
		"Bardo":
			color = Color(1.0,0.38,0.78)
			mode = "slash" if slot == 0 else ("buff" if slot == 1 else "burst")
		"Guerrero":
			color = Color(1.0,0.62,0.22)
			mode = "slash" if slot in [0,2] else "buff"
		"Arquero":
			color = Color(0.36,0.92,0.60)
			mode = "arrow" if slot in [0,2] else "buff"
		"Bruja del Caos":
			color = Color(0.68,0.30,1.0)
			mode = "chaos"
	if slot == 3:
		mode = "chaos" if hero_class == "Bruja del Caos" else "burst"
		radius *= 1.22
	_spawn_combat_fx(mode,pos,color,radius,0.42 if slot < 3 else 0.62,facing_dir,1.0 if slot < 3 else 1.4)
