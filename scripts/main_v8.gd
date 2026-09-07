extends "res://scripts/main_v7.gd"

const ExplorationNodeScript = preload("res://scripts/exploration_node.gd")

var exploration_nodes: Array = []
var atlas_page := 0
var revisit_mode := false
var revisit_progress_map := 1
var revisit_unlocked_map := 1

const EXPLORATION_COLORS := [
	Color(0.72,0.52,1.0), Color(0.45,0.82,1.0), Color(0.67,0.48,0.28), Color(0.82,0.78,1.0),
	Color(1.0,0.36,0.14), Color(0.30,0.82,0.76), Color(0.28,0.72,1.0), Color(0.72,0.91,1.0)
]

const EXPLORATION_SITES := {
	1: [{"id":"iz1_spirit_cache","legendary":0,"pos":Vector2(810,455),"title":"Eco Prismático","kind":"spirit"}],
	2: [{"id":"iz2_storm_rail","legendary":1,"pos":Vector2(1080,455),"title":"Raíl Dormido","kind":"electric"}],
	3: [{"id":"iz3_ancient_wall","legendary":2,"pos":Vector2(1160,505),"title":"Muro Agrietado","kind":"earth"}],
	4: [{"id":"iz4_moon_path","legendary":3,"pos":Vector2(1460,405),"title":"Senda Invisible","kind":"moon"}],
	6: [{"id":"iz6_corrupt_roots","legendary":4,"pos":Vector2(1060,500),"title":"Raíces Corruptas","kind":"fire"}],
	7: [{"id":"iz7_void_current","legendary":5,"pos":Vector2(1370,455),"title":"Corriente Abisal","kind":"wind"}],
	8: [{"id":"iz8_tide_seal","legendary":6,"pos":Vector2(1660,500),"title":"Sello de Mareas","kind":"water"}],
	12:[{"id":"df12_frozen_memory","legendary":7,"pos":Vector2(1820,500),"title":"Memoria Glacial","kind":"ice"}]
}

func _ready() -> void:
	super._ready()
	_bind("world_power",KEY_G)

func _ensure_v3_state() -> void:
	super._ensure_v3_state()
	if not state.has("world_discoveries"): state["world_discoveries"] = []
	if not state.has("exploration_mastery"): state["exploration_mastery"] = 0
	if not state.has("revisit_count"): state["revisit_count"] = 0
	SaveSystem.save_state(state)

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.6 TRAVERSAL PASS"):
			node.text = "v0.7.1 LIVING WORLD • exploración legendaria • secretos • revisita • rutas desbloqueables"
	var atlas_btn: Button = _menu_button("ATLAS / REVISITAR MAPAS",Vector2(440,525))
	atlas_btn.pressed.connect(_open_atlas_from_title)

func _process(delta: float) -> void:
	super._process(delta)
	if player and is_instance_valid(player) and world and Input.is_action_just_pressed("world_power"):
		_try_contextual_exploration()

func _start_level() -> void:
	exploration_nodes.clear()
	super._start_level()

func _generate_level(map_no: int) -> void:
	super._generate_level(map_no)
	# NigZen is no longer a visible free portal. Killaruna reveals the distortion.
	if map_no in [9,19,29] and not bool(state.get("nigzen_complete",false)):
		_remove_legacy_nigzen_portals()
		_spawn_exploration_site({"id":"nigzen_distortion_%d" % map_no,"legendary":3,"pos":Vector2(1720,390),"title":"Distorsión de NigZen","kind":"nigzen"})
	if EXPLORATION_SITES.has(map_no):
		for site_variant in EXPLORATION_SITES[map_no]:
			var site: Dictionary = site_variant
			_spawn_exploration_site(site)

func _remove_legacy_nigzen_portals() -> void:
	if not world: return
	for child in world.get_children():
		if child.get_script() == PickupScript and str(child.kind) == "nigzen_portal":
			child.queue_free()

func _spawn_exploration_site(site: Dictionary) -> void:
	var discoveries: Array = state.get("world_discoveries",[])
	var id: String = str(site.get("id","site"))
	if id in discoveries:
		return
	var idx: int = clampi(int(site.get("legendary",0)),0,WorldData.LEGENDARIES.size()-1)
	var node: Node2D = Node2D.new()
	node.set_script(ExplorationNodeScript)
	world.add_child(node)
	var site_position: Vector2 = site.get("pos",Vector2(900,500))
	node.position = site_position
	node.setup(id,idx,str(site.get("title","Secreto")),str(site.get("kind","spirit")),EXPLORATION_COLORS[idx])
	exploration_nodes.append(node)

func _nearest_exploration_node(max_distance: float = 150.0) -> Node:
	if not player or not is_instance_valid(player): return null
	var best: Node = null
	var best_dist: float = max_distance
	for node_variant in exploration_nodes:
		var node: Node = node_variant
		if not is_instance_valid(node) or bool(node.completed): continue
		var distance_to_site: float = player.global_position.distance_to(node.global_position)
		if distance_to_site < best_dist:
			best_dist = distance_to_site
			best = node
	return best

func _try_contextual_exploration() -> void:
	var node: Node = _nearest_exploration_node(165.0)
	if node == null:
		_toast("No hay ninguna resonancia legendaria cerca.",1.5)
		return
	var idx: int = int(node.required_legendary)
	var legendary: Dictionary = WorldData.LEGENDARIES[idx]
	var owned: Array = state.get("pets",[])
	if idx not in owned:
		_toast("%s responde a este lugar. %s" % [str(legendary["name"]),_legendary_unlock_hint(idx)],3.0)
		return
	_activate_exploration_site(node,idx)

func _legendary_unlock_hint(idx: int) -> String:
	var maps: Array = [1,7,11,15,19,23,27,31]
	if idx == 0: return "Xethkioz ya viaja con vos."
	return "Su vínculo aparece alrededor del Mapa %d." % int(maps[clampi(idx,0,maps.size()-1)])

func _activate_exploration_site(node: Node,idx: int) -> void:
	var discoveries: Array = state.get("world_discoveries",[])
	var id: String = str(node.discovery_id)
	if id in discoveries: return
	discoveries.append(id)
	state["world_discoveries"] = discoveries
	state["exploration_mastery"] = int(state.get("exploration_mastery",0))+1
	state["crystals"] = int(state.get("crystals",0))+4+idx
	# Automatically bring the relevant companion forward so the world reaction is visible.
	if int(state.get("active_pet",0)) != idx:
		state["active_pet"] = idx
		if pet and is_instance_valid(pet): pet.queue_free()
		_spawn_pet_if_owned()
	_apply_exploration_reward(idx,str(node.site_kind),node.global_position)
	SaveSystem.save_state(state)
	_toast("%s — %s" % [str(WorldData.LEGENDARIES[idx]["name"]),str(WorldData.LEGENDARIES[idx]["explore"])],3.2)
	node.complete()
	update_hud()

func _apply_exploration_reward(idx: int,kind: String,pos: Vector2) -> void:
	var biome: Dictionary = _biome()
	var accent_color: Color = biome["accent"]
	match kind:
		"spirit":
			_spawn_pickup("chest",pos+Vector2(105,75))
			for i in range(3): _spawn_pickup("crystal",pos+Vector2(55+i*42,-12-i*18))
		"electric":
			for i in range(4):
				_add_platform(Rect2(pos.x+80+i*118,pos.y-20-i*34,92,18),accent_color)
				_spawn_pickup("crystal",Vector2(pos.x+126+i*118,pos.y-48-i*34))
		"earth":
			_spawn_pickup("chest",pos+Vector2(125,60))
			state["crystals"] = int(state.get("crystals",0))+10
		"moon":
			for i in range(4): _add_platform(Rect2(pos.x+70+i*105,pos.y-35-i*48,82,16),Color(accent_color,0.72))
			_spawn_pickup("chest",pos+Vector2(455,-205))
		"fire":
			_spawn_pickup("food",pos+Vector2(80,40))
			_spawn_pickup("chest",pos+Vector2(150,55))
		"wind":
			player.velocity.y = -650.0
			_add_platform(Rect2(pos.x+45,pos.y-230,170,18),accent_color)
			for i in range(3): _spawn_pickup("crystal",Vector2(pos.x+85+i*50,pos.y-275))
		"water":
			if player.has_method("apply_bubble_shield"): player.apply_bubble_shield(1)
			supplies = min(float(state.get("max_supplies",100.0)),supplies+24.0)
			_spawn_pickup("chest",pos+Vector2(120,55))
		"ice":
			for i in range(5): _add_platform(Rect2(pos.x+70+i*96,pos.y+45,88,15),Color(0.70,0.90,1.0,0.86))
			_spawn_pickup("chest",pos+Vector2(535,55))
		"nigzen":
			_spawn_pickup("nigzen_portal",pos+Vector2(95,60),{"secret":true,"revealed_by":"Killaruna"})
			_toast("KILLARUNA REVELÓ NIGZEN — el portal ya puede cruzarse.",3.4)

func update_hud() -> void:
	super.update_hud()
	if not objective_label: return
	var nearby: Node = _nearest_exploration_node(175.0)
	if nearby:
		var idx: int = int(nearby.required_legendary)
		objective_label.text += "   •   G: %s" % str(WorldData.LEGENDARIES[idx]["name"])
	else:
		objective_label.text += "   •   G poder de exploración"

# --- Atlas / revisita -------------------------------------------------------
func _open_atlas_from_title() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state()
	atlas_page = 0
	_show_atlas_menu()

func _show_atlas_menu() -> void:
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 115; add_child(menu_layer)
	var bg: ColorRect = ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.025,0.025,0.055); menu_layer.add_child(bg)
	var title: Label = Label.new(); title.position=Vector2(150,42); title.size=Vector2(980,58); title.text="ATLAS DE ELIDA — REVISITAR EL MUNDO"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",30); title.add_theme_color_override("font_color",Color(0.70,0.48,1.0)); menu_layer.add_child(title)
	var unlocked: int = clampi(int(state.get("unlocked_map",1)),1,32)
	var info: Label = Label.new(); info.position=Vector2(180,102); info.size=Vector2(920,54); info.text="Mapas alcanzados: %d/32   •   Secretos legendarios: %d   •   Revisitas: %d" % [unlocked,int(state.get("exploration_mastery",0)),int(state.get("revisit_count",0))]; info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; info.add_theme_font_size_override("font_size",15); menu_layer.add_child(info)
	var first: int = atlas_page*8+1
	for slot in range(8):
		var map_no: int = first+slot
		if map_no > unlocked or map_no > 32: continue
		var b: Button = Button.new(); b.position=Vector2(95+(slot%4)*285,205+int(slot/4)*150); b.size=Vector2(255,112); b.text="%02d — %s\n%s" % [map_no,WorldData.map_name(map_no),WorldData.region_for_map(map_no)]; b.add_theme_font_size_override("font_size",12); b.pressed.connect(_start_revisit.bind(map_no)); menu_layer.add_child(b)
	var max_page: int = int((unlocked-1)/8)
	if atlas_page > 0:
		var prev: Button = Button.new(); prev.position=Vector2(230,545); prev.size=Vector2(230,48); prev.text="◀ ANTERIORES"; prev.pressed.connect(func(): atlas_page-=1; _show_atlas_menu()); menu_layer.add_child(prev)
	if atlas_page < max_page:
		var next: Button = Button.new(); next.position=Vector2(820,545); next.size=Vector2(230,48); next.text="SIGUIENTES ▶"; next.pressed.connect(func(): atlas_page+=1; _show_atlas_menu()); menu_layer.add_child(next)
	var back: Button = Button.new(); back.position=Vector2(490,620); back.size=Vector2(300,48); back.text="VOLVER AL MENÚ"; back.pressed.connect(_show_title); menu_layer.add_child(back)

func _start_revisit(map_no: int) -> void:
	revisit_mode = true
	revisit_progress_map = int(state.get("current_map",1))
	revisit_unlocked_map = int(state.get("unlocked_map",1))
	state["revisit_count"] = int(state.get("revisit_count",0))+1
	SaveSystem.save_state(state)
	current_map = clampi(map_no,1,revisit_unlocked_map)
	supplies = float(state.get("supplies",100.0))
	_start_level()
	_toast("REVISITA • Mapa %02d — buscá rutas que antes no podías abrir." % current_map,3.0)

func _show_intermission() -> void:
	if not revisit_mode:
		super._show_intermission()
		return
	# Base completion can advance progression. A revisit must never overwrite the real campaign position.
	current_map = revisit_progress_map
	state["current_map"] = revisit_progress_map
	state["unlocked_map"] = revisit_unlocked_map
	SaveSystem.save_state(state)
	_show_revisit_result()

func _show_revisit_result() -> void:
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer=116; add_child(menu_layer)
	var bg: ColorRect = ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.028,0.026,0.060); menu_layer.add_child(bg)
	var title: Label = Label.new(); title.position=Vector2(180,120); title.size=Vector2(920,70); title.text="REVISITA COMPLETADA"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",34); title.add_theme_color_override("font_color",Color(1.0,0.72,0.34)); menu_layer.add_child(title)
	var info: Label = Label.new(); info.position=Vector2(250,220); info.size=Vector2(780,100); info.text="El progreso principal se mantiene intacto.\nSecretos legendarios descubiertos: %d" % int(state.get("exploration_mastery",0)); info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; info.add_theme_font_size_override("font_size",18); menu_layer.add_child(info)
	var atlas: Button = Button.new(); atlas.position=Vector2(390,380); atlas.size=Vector2(500,56); atlas.text="VOLVER AL ATLAS"; atlas.pressed.connect(_show_atlas_menu); menu_layer.add_child(atlas)
	var campaign: Button = Button.new(); campaign.position=Vector2(390,455); campaign.size=Vector2(500,56); campaign.text="CONTINUAR CAMPAÑA PRINCIPAL"; campaign.pressed.connect(_resume_campaign_after_revisit); menu_layer.add_child(campaign)

func _resume_campaign_after_revisit() -> void:
	revisit_mode = false
	state = SaveSystem.load_state()
	_ensure_v3_state()
	current_map = int(state.get("current_map",1))
	supplies = float(state.get("supplies",100.0))
	_start_level()
