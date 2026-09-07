extends "res://scripts/main_v12.gd"

# v0.9.0 — Steam Demo Foundation
# 15 playable nodes, 120-node projected overworld, armory and tiered difficulty.

const OverworldData = preload("res://scripts/overworld_data.gd")
const ArmoryData = preload("res://scripts/armory_data.gd")
const OverworldMapView = preload("res://scripts/overworld_map_view.gd")

var overworld_layer: CanvasLayer
var armory_layer: CanvasLayer
var armory_page := 0

func _ready() -> void:
	super._ready()
	_ensure_demo_state()

func _ensure_demo_state() -> void:
	if not state.has("current_node"): state["current_node"] = int(state.get("current_map",1))
	if not state.has("unlocked_nodes"): state["unlocked_nodes"] = [1]
	if not state.has("completed_nodes"): state["completed_nodes"] = []
	if not state.has("equipped_weapon_id"): state["equipped_weapon_id"] = 1
	if not state.has("equipped_set_id"): state["equipped_set_id"] = "brote_vivo"
	if not state.has("legendary_weapon_ids"): state["legendary_weapon_ids"] = []
	if not state.has("premium_owned"): state["premium_owned"] = false
	if not state.has("premium_wings_equipped"): state["premium_wings_equipped"] = false
	if not state.has("premium_wing_buff"): state["premium_wing_buff"] = {}
	_sync_armory_unlocks()
	SaveSystem.save_state(state)

func _sync_armory_unlocks() -> void:
	var unlocked_map: int = clampi(int(state.get("unlocked_map",1)),1,OverworldData.DEMO_ACTIVE_NODES)
	state["unlocked_weapon_ids"] = ArmoryData.unlocked_weapon_ids(unlocked_map)
	state["unlocked_set_ids"] = ArmoryData.unlocked_set_ids(unlocked_map)
	if bool(state.get("demo_completed_map15",false)):
		state["legendary_weapon_ids"] = [101,102]
		var ids: Array = state["unlocked_weapon_ids"]
		if 101 not in ids: ids.append(101)
		if 102 not in ids: ids.append(102)
		state["unlocked_weapon_ids"] = ids

# ---------------------------------------------------------------------------
# Entry flow
func _new_game() -> void:
	state = SaveSystem.reset()
	_ensure_v3_state()
	state["mentor_chosen"] = false
	state["selected_hero"] = -1
	state["set_pieces"] = 0
	state["parenting_points"] = 0
	state["alexis_marks"] = []
	state["current_node"] = 1
	state["current_map"] = 1
	state["unlocked_map"] = 1
	state["unlocked_nodes"] = [1]
	state["completed_nodes"] = []
	current_map = 1
	supplies = 100.0
	_ensure_demo_state()
	SaveSystem.save_state(state)
	_show_character_setup()

func _continue_game() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state()
	_ensure_demo_state()
	current_map = clampi(int(state.get("current_map",1)),1,15)
	supplies = float(state.get("supplies",100.0))
	_show_overworld()

func _finish_character_setup() -> void:
	var chosen_name: String = character_name_input.text.strip_edges() if character_name_input else "Viajero"
	if chosen_name.is_empty(): chosen_name = "Viajero"
	state["player_name"] = chosen_name
	state["player_palette"] = pending_palette
	state["current_map"] = 1
	state["current_node"] = 1
	SaveSystem.save_state(state)
	current_map = 1
	_start_level()

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.8.0"):
			node.text = "v0.9.0 • STEAM DEMO PRODUCTION • NODOS 1–15 / MUNDO 1–120"
	var world_btn := Button.new()
	world_btn.position = Vector2(835,285)
	world_btn.size = Vector2(350,52)
	world_btn.text = "MAPA GLOBAL"
	world_btn.add_theme_font_size_override("font_size",16)
	_style_button(world_btn)
	world_btn.pressed.connect(func(): state=SaveSystem.load_state(); _ensure_v3_state(); _ensure_demo_state(); _show_overworld())
	menu_layer.add_child(world_btn)
	var armory_btn := Button.new()
	armory_btn.position = Vector2(835,348)
	armory_btn.size = Vector2(350,52)
	armory_btn.text = "ARMERÍA"
	armory_btn.add_theme_font_size_override("font_size",16)
	_style_button(armory_btn)
	armory_btn.pressed.connect(func(): state=SaveSystem.load_state(); _ensure_v3_state(); _ensure_demo_state(); _show_armory())
	menu_layer.add_child(armory_btn)

# ---------------------------------------------------------------------------
# Overworld
func _show_overworld() -> void:
	if world:
		world.queue_free(); world = null; player = null; pet = null
	if hud_layer: hud_layer.visible = false
	if dialogue_layer: dialogue_layer.visible = false
	if menu_layer: menu_layer.queue_free(); menu_layer = null
	if armory_layer: armory_layer.queue_free(); armory_layer = null
	if overworld_layer: overworld_layer.queue_free()
	overworld_layer = CanvasLayer.new()
	overworld_layer.layer = 130
	add_child(overworld_layer)
	var bg := ColorRect.new()
	bg.position = Vector2.ZERO; bg.size = Vector2(1280,720); bg.color = Color(0.012,0.018,0.045)
	overworld_layer.add_child(bg)
	var top := Panel.new()
	top.position = Vector2(24,18); top.size = Vector2(1232,82)
	top.add_theme_stylebox_override("panel",_panel_style(Color(0.018,0.025,0.06,0.96),Color(0.42,0.28,0.72,0.95),2))
	overworld_layer.add_child(top)
	var title := _vlabel(top,Vector2(22,12),Vector2(640,34),"MAPA GLOBAL • WORLD OF XETHKIOZ",24,Color(0.82,0.64,1.0))
	var completed: Array = state.get("completed_nodes",[])
	var unlocked: Array = state.get("unlocked_nodes",[1])
	_vlabel(top,Vector2(22,47),Vector2(700,24),"DEMO: 1–15 activos • Base: 1–32 • Mundo proyectado: 120 nodos",12,Color(0.70,0.78,0.94))
	var status := _vlabel(top,Vector2(760,18),Vector2(440,38),"Completados %d/15   •   Próximo %02d" % [mini(completed.size(),15),_next_demo_node()],14,Color(1.0,0.72,0.34))
	status.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT

	var scroll := ScrollContainer.new()
	scroll.position = Vector2(28,112); scroll.size = Vector2(1224,520)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
	scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
	overworld_layer.add_child(scroll)
	var view := Control.new()
	view.set_script(OverworldMapView)
	scroll.add_child(view)
	view.setup(completed,unlocked,15)
	for id in range(1,33):
		var button := Button.new()
		var p: Vector2 = OverworldData.node_position(id)
		button.position = p-Vector2(25,25)
		button.size = Vector2(50,50)
		button.text = str(id)
		button.flat = true
		button.tooltip_text = "%02d — %s\n%s" % [id,OverworldData.node_name(id),OverworldData.description(id)]
		var available: bool = id in unlocked and id <= 15
		button.disabled = not available
		button.modulate = Color(1,1,1,0.03) if button.disabled else Color(1,1,1,0.10)
		if available: button.pressed.connect(_select_overworld_node.bind(id))
		view.add_child(button)

	var back := Button.new(); back.position=Vector2(28,650); back.size=Vector2(210,46); back.text="MENÚ PRINCIPAL"; _style_button(back); back.pressed.connect(_show_title); overworld_layer.add_child(back)
	var armory := Button.new(); armory.position=Vector2(250,650); armory.size=Vector2(210,46); armory.text="ARMERÍA"; _style_button(armory); armory.pressed.connect(_show_armory); overworld_layer.add_child(armory)
	var legend := _vlabel(overworld_layer,Vector2(485,652),Vector2(745,40),"Violeta: disponible  •  Celeste: completado  •  Rojo: jefe  •  Gris: juego completo / expansión futura",11,Color(0.72,0.75,0.84))
	legend.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	# Start scroll near the active Izrdralar route.
	await get_tree().process_frame
	scroll.scroll_horizontal = 0
	scroll.scroll_vertical = 0

func _next_demo_node() -> int:
	var completed: Array = state.get("completed_nodes",[])
	for id in range(1,16):
		if id not in completed: return id
	return 15

func _select_overworld_node(id: int) -> void:
	var unlocked: Array = state.get("unlocked_nodes",[1])
	if id not in unlocked or id > 15:
		return
	state["current_node"] = id
	state["current_map"] = id
	current_map = id
	supplies = float(state.get("supplies",100.0))
	SaveSystem.save_state(state)
	if overworld_layer: overworld_layer.queue_free(); overworld_layer = null
	_start_level()

func _mark_node_completed(id: int) -> void:
	var completed: Array = state.get("completed_nodes",[])
	if id not in completed: completed.append(id)
	state["completed_nodes"] = completed
	var unlocked: Array = state.get("unlocked_nodes",[1])
	if id < 15 and id+1 not in unlocked: unlocked.append(id+1)
	state["unlocked_nodes"] = unlocked
	state["unlocked_map"] = max(int(state.get("unlocked_map",1)),mini(id+1,15))
	_sync_armory_unlocks()
	SaveSystem.save_state(state)

func _complete_map() -> void:
	if map_complete: return
	var finished: int = current_map
	_mark_node_completed(finished)
	if finished == 15:
		map_complete = true
		state["demo_complete"] = true
		state["demo_completed_map15"] = true
		state["set_pieces"] = maxi(4,int(state.get("set_pieces",0)))
		state["legendary_weapon_ids"] = [101,102]
		_sync_armory_unlocks()
		SaveSystem.save_state(state)
		_show_demo_complete_v13()
		return
	super._complete_map()

func _show_intermission() -> void:
	# Revisit mode keeps its original result screen.
	if revisit_mode:
		super._show_intermission(); return
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 118; add_child(menu_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.018,0.025,0.055); menu_layer.add_child(bg)
	var title := _vlabel(menu_layer,Vector2(180,105),Vector2(920,62),"REFUGIO DE ELIDA",34,Color(0.78,0.58,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var copy := _vlabel(menu_layer,Vector2(250,190),Vector2(780,95),"Elida cura las heridas, reordena las raciones y marca el camino siguiente en el mapa global.",16,Color(0.84,0.86,0.94)); copy.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; copy.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	supplies = min(float(state.get("max_supplies",100.0)),supplies+18.0)
	state["supplies"] = supplies
	SaveSystem.save_state(state)
	var next_id: int = clampi(current_map,1,15)
	var next_info := _vlabel(menu_layer,Vector2(270,315),Vector2(740,70),"SIGUIENTE NODO\n%02d — %s" % [next_id,OverworldData.node_name(next_id)],18,Color(1.0,0.72,0.34)); next_info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var map_btn := Button.new(); map_btn.position=Vector2(420,440); map_btn.size=Vector2(440,58); map_btn.text="VOLVER AL MAPA GLOBAL"; map_btn.add_theme_font_size_override("font_size",18); _style_button(map_btn); map_btn.pressed.connect(_show_overworld); menu_layer.add_child(map_btn)
	var armory_btn := Button.new(); armory_btn.position=Vector2(420,515); armory_btn.size=Vector2(440,52); armory_btn.text="REVISAR ARMERÍA"; _style_button(armory_btn); armory_btn.pressed.connect(_show_armory); menu_layer.add_child(armory_btn)

func _select_mentor(index: int) -> void:
	state["selected_hero"] = index
	state["mentor_chosen"] = true
	SaveSystem.save_state(state)
	_show_overworld()

func _show_demo_complete_v13() -> void:
	if hud_layer: hud_layer.visible = false
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 140; add_child(menu_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.008,0.012,0.035); menu_layer.add_child(bg)
	var title := _vlabel(menu_layer,Vector2(120,75),Vector2(1040,70),"DEMO COMPLETADA — PRIMER CISMA SUPERADO",34,Color(0.82,0.60,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var copy := _vlabel(menu_layer,Vector2(210,175),Vector2(860,135),"El Arconte cayó y el acceso a Desfralar comenzó a abrirse. El mundo completo continúa más allá del Nodo 15.\n\nDesbloqueaste dos armas legendarias para rejugar Izrdralar y probar builds antes de la versión completa.",17,Color(0.86,0.88,0.96)); copy.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; copy.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var reward := _vlabel(menu_layer,Vector2(250,335),Vector2(780,85),"LEGENDARIAS DESBLOQUEADAS\nVeredicto del Primer Cisma  •  Aria del Umbral Prismático",18,Color(1.0,0.74,0.30)); reward.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var armory := Button.new(); armory.position=Vector2(420,465); armory.size=Vector2(440,56); armory.text="ABRIR ARMERÍA"; _style_button(armory); armory.pressed.connect(_show_armory); menu_layer.add_child(armory)
	var worldb := Button.new(); worldb.position=Vector2(420,535); worldb.size=Vector2(440,56); worldb.text="VER MAPA GLOBAL"; _style_button(worldb); worldb.pressed.connect(_show_overworld); menu_layer.add_child(worldb)

# ---------------------------------------------------------------------------
# Armory
func _show_armory() -> void:
	if overworld_layer: overworld_layer.queue_free(); overworld_layer = null
	if menu_layer: menu_layer.queue_free(); menu_layer = null
	if armory_layer: armory_layer.queue_free()
	armory_layer = CanvasLayer.new(); armory_layer.layer = 132; add_child(armory_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.012,0.016,0.038); armory_layer.add_child(bg)
	var title := _vlabel(armory_layer,Vector2(70,35),Vector2(1140,54),"ARMERÍA DE IZRDRALAR",30,Color(0.82,0.62,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var weapon_id: int = int(state.get("equipped_weapon_id",1))
	var set_id: String = str(state.get("equipped_set_id","brote_vivo"))
	var equipped_w: Dictionary = ArmoryData.weapon_by_id(weapon_id)
	var equipped_s: Dictionary = ArmoryData.set_by_id(set_id)
	var info := _vlabel(armory_layer,Vector2(110,95),Vector2(1060,58),"EQUIPADO: %s [%s]   •   %s [%s]" % [str(equipped_w["name"]),str(equipped_w["rarity"]),str(equipped_s["name"]),str(equipped_s["affinity"])],14,Color(1.0,0.72,0.34)); info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	var left := Panel.new(); left.position=Vector2(55,165); left.size=Vector2(710,455); left.add_theme_stylebox_override("panel",_panel_style(Color(0.02,0.025,0.055,0.94),Color(0.34,0.25,0.52,0.92),2)); armory_layer.add_child(left)
	_vlabel(left,Vector2(20,12),Vector2(665,32),"25 ARMAS + 2 LEGENDARIAS",18,Color(0.78,0.82,1.0))
	var wscroll := ScrollContainer.new(); wscroll.position=Vector2(15,50); wscroll.size=Vector2(680,390); left.add_child(wscroll)
	var wlist := VBoxContainer.new(); wlist.custom_minimum_size=Vector2(650,0); wscroll.add_child(wlist)
	var unlocked_weapons: Array = state.get("unlocked_weapon_ids",[])
	var all_weapons: Array = ArmoryData.WEAPONS+ArmoryData.LEGENDARY_WEAPONS
	for variant in all_weapons:
		var w: Dictionary = variant
		var wid: int = int(w["id"])
		var b := Button.new(); b.custom_minimum_size=Vector2(630,44)
		var available: bool = wid in unlocked_weapons
		b.text = "%s%s • %s • Poder %.2f" % ["" if available else "🔒 ",str(w["name"]),str(w["affinity"]),float(w["power"])]
		b.disabled = not available
		_style_button(b)
		if available: b.pressed.connect(_equip_weapon.bind(wid))
		wlist.add_child(b)

	var right := Panel.new(); right.position=Vector2(790,165); right.size=Vector2(435,455); right.add_theme_stylebox_override("panel",_panel_style(Color(0.02,0.025,0.055,0.94),Color(0.34,0.25,0.52,0.92),2)); armory_layer.add_child(right)
	_vlabel(right,Vector2(20,12),Vector2(390,32),"10 CONJUNTOS",18,Color(0.78,0.82,1.0))
	var sscroll := ScrollContainer.new(); sscroll.position=Vector2(15,50); sscroll.size=Vector2(405,270); right.add_child(sscroll)
	var slist := VBoxContainer.new(); slist.custom_minimum_size=Vector2(380,0); sscroll.add_child(slist)
	var unlocked_sets: Array = state.get("unlocked_set_ids",[])
	for variant in ArmoryData.SETS:
		var s: Dictionary = variant
		var sid: String = str(s["id"])
		var sb := Button.new(); sb.custom_minimum_size=Vector2(365,46)
		var available_s: bool = sid in unlocked_sets
		sb.text = "%s%s • %s" % ["" if available_s else "🔒 ",str(s["name"]),str(s["affinity"])]
		sb.disabled = not available_s
		_style_button(sb)
		if available_s: sb.pressed.connect(_equip_set.bind(sid))
		slist.add_child(sb)
	var premium_text: String = "ALAS PREMIUM: EQUIPADAS" if bool(state.get("premium_wings_equipped",false)) else ("ALAS PREMIUM: DISPONIBLES" if bool(state.get("premium_owned",false)) else "ALAS PREMIUM: BLOQUEADAS")
	var premium := Button.new(); premium.position=Vector2(30,345); premium.size=Vector2(375,48); premium.text=premium_text; _style_button(premium); premium.disabled=not bool(state.get("premium_owned",false)); premium.pressed.connect(_toggle_premium_wings); right.add_child(premium)
	var buff: Dictionary = state.get("premium_wing_buff",{})
	var buff_label: String = str(buff.get("label","Buff leve aleatorio al equipar"))
	var wing_info := _vlabel(right,Vector2(30,399),Vector2(375,40),buff_label,11,Color(0.70,0.75,0.86)); wing_info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER

	var back := Button.new(); back.position=Vector2(515,645); back.size=Vector2(250,48); back.text="VOLVER AL MAPA"; _style_button(back); back.pressed.connect(_show_overworld); armory_layer.add_child(back)

func _equip_weapon(id: int) -> void:
	var w: Dictionary = ArmoryData.weapon_by_id(id)
	state["equipped_weapon_id"] = id
	state["weapon"] = {"id":id,"name":str(w["name"]),"power":float(w["power"]),"rarity":str(w["rarity"])}
	SaveSystem.save_state(state)
	_show_armory()

func _equip_set(id: String) -> void:
	var s: Dictionary = ArmoryData.set_by_id(id)
	state["equipped_set_id"] = id
	state["armor"] = {"set_id":id,"name":str(s["name"]),"power":float(s["power"]),"rarity":"Set"}
	SaveSystem.save_state(state)
	_show_armory()

func _toggle_premium_wings() -> void:
	if not bool(state.get("premium_owned",false)): return
	var equipped: bool = not bool(state.get("premium_wings_equipped",false))
	state["premium_wings_equipped"] = equipped
	if equipped:
		state["premium_wing_buff"] = ArmoryData.random_premium_buff(int(Time.get_unix_time_from_system()))
	else:
		state["premium_wing_buff"] = {}
	SaveSystem.save_state(state)
	_show_armory()

func _spawn_player() -> void:
	super._spawn_player()
	if not player or not is_instance_valid(player): return
	if bool(state.get("premium_wings_equipped",false)) and bool(state.get("premium_owned",false)):
		var buff: Dictionary = state.get("premium_wing_buff",{})
		match str(buff.get("id","")):
			"speed": player.base_speed *= 1.03
			"mana": player.max_mana *= 1.02; player.mana = player.max_mana
			"resist": player.armor_reduction = minf(0.72,float(player.armor_reduction)+0.02)
			"ration": supplies = min(float(state.get("max_supplies",100.0)),supplies+1.0)

# ---------------------------------------------------------------------------
# Difficulty: complexity increases every 5 nodes, damage stays readable.
func _difficulty() -> float:
	var tier: int = OverworldData.demo_tier(current_map)
	return 1.0+float(current_map)*0.035+float(tier)*0.16

func _objective_is_complete() -> bool:
	match current_map:
		8: return map_crystals >= 5
		12: return map_crystals >= 6
		14: return map_crystals >= 7
	return super._objective_is_complete()

func _objective_text() -> String:
	match current_map:
		8: return "OBJETIVO • recuperá 5 fragmentos de la Ruta Rota (%d/5)" % mini(map_crystals,5)
		12: return "OBJETIVO • reuní 6 ecos del Valle Resonante (%d/6)" % mini(map_crystals,6)
		14: return "OBJETIVO • estabilizá la Grieta con 7 fragmentos (%d/7)" % mini(map_crystals,7)
	return super._objective_text()

# ---------------------------------------------------------------------------
# Hand-authored demo maps 6–15. Same 5-map ecosystems, rising complexity.
func _generate_level(map_no: int) -> void:
	if map_no <= 5 or map_no > 15:
		super._generate_level(map_no)
		return
	_generate_demo_6_15(map_no)

func _generate_demo_6_15(map_no: int) -> void:
	var biome: Dictionary = _biome()
	_build_background(biome,map_no)
	var ground: Color = biome["ground"]
	var accent: Color = Color(biome["accent"],0.88)
	var diff: float = _difficulty()
	if map_no <= 10:
		# Block 2: Llanuras / ruinas. Wider routes, more enemies, simple collection objectives.
		_add_platform(Rect2(-100,GROUND_Y,720,120),ground)
		_add_platform(Rect2(760,GROUND_Y,620,120),ground)
		_add_platform(Rect2(1460,GROUND_Y,620,120),ground)
		_add_platform(Rect2(2180,GROUND_Y,1120,120),ground)
		_add_slope(250,GROUND_Y,300,120,true,accent)
		_add_slope(1120,GROUND_Y,260,105,false,accent)
		_add_slope(1600,GROUND_Y,300,140,true,accent)
		_add_one_way_platform(Rect2(560,470,180,18),accent)
		_add_one_way_platform(Rect2(820,420,180,18),accent)
		_add_one_way_platform(Rect2(1050,375,160,18),accent)
		_add_one_way_platform(Rect2(1780,430,170,18),accent)
		_add_one_way_platform(Rect2(2010,380,180,18),accent)
		_add_prism_boost(Vector2(160,606),1,640.0+float(map_no-6)*12.0)
		_add_bounce_pad(Vector2(1420,606),670.0)
		_add_prism_boost(Vector2(2240,606),1,680.0)
		var enemy_count: int = 6+(map_no-6)
		for i in range(enemy_count):
			var ex: float = 470.0+float(i)*((2600.0)/float(maxi(1,enemy_count-1)))
			_spawn_enemy(Vector2(ex,560),diff,(i+map_no)%4)
		var needed: int = 5 if map_no == 8 else 7
		_crystal_line(Vector2(430,510),needed,Vector2(95,-12))
		_crystal_line(Vector2(1760,390),4,Vector2(90,-8))
		_spawn_pickup("food",Vector2(1280,555))
		_spawn_pickup("chest",Vector2(2500,555))
		if map_no == 10:
			boss_alive = true
			_spawn_boss(Vector2(2750,545),1,diff+0.15)
		else:
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
	else:
		# Block 3: First Cism. More verticality, denser enemy mixes and collection gates.
		_add_platform(Rect2(-100,GROUND_Y,560,120),ground)
		_add_platform(Rect2(610,GROUND_Y,500,120),ground)
		_add_platform(Rect2(1260,GROUND_Y,470,120),ground)
		_add_platform(Rect2(1880,GROUND_Y,520,120),ground)
		_add_platform(Rect2(2540,GROUND_Y,760,120),ground)
		for r in [Rect2(360,500,150,18),Rect2(610,445,150,18),Rect2(840,390,150,18),Rect2(1080,335,150,18),Rect2(1380,470,170,18),Rect2(1620,410,150,18),Rect2(1910,350,160,18),Rect2(2190,430,170,18),Rect2(2470,365,160,18),Rect2(2780,430,180,18)]:
			_add_one_way_platform(r,accent)
		_add_bounce_pad(Vector2(545,606),710.0)
		_add_bounce_pad(Vector2(1745,606),735.0)
		_add_prism_boost(Vector2(1180,606),1,690.0)
		_add_prism_boost(Vector2(2450,606),1,720.0)
		var enemy_count2: int = 8+(map_no-11)
		for i in range(enemy_count2):
			var ex2: float = 390.0+float(i)*((2700.0)/float(maxi(1,enemy_count2-1)))
			var ey: float = 560.0 if i%3 != 1 else 430.0
			_spawn_enemy(Vector2(ex2,ey),diff+0.08,(i+map_no)%4)
		var crystals_needed: int = 7 if map_no == 14 else 8
		_crystal_line(Vector2(420,455),crystals_needed,Vector2(82,-10))
		_crystal_line(Vector2(1940,315),5,Vector2(80,5))
		_spawn_pickup("food",Vector2(1520,555))
		_spawn_pickup("chest",Vector2(2260,555))
		if map_no == 15:
			boss_alive = true
			_spawn_boss(Vector2(2760,545),2,diff+0.20)
		else:
			_spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))

func boss_defeated(boss: Node,kind: int) -> void:
	var was_new: bool = current_map not in state.get("bosses",[])
	super.boss_defeated(boss,kind)
	if was_new and current_map == 15:
		state["set_pieces"] = maxi(4,int(state.get("set_pieces",0)))
		state["demo_completed_map15"] = true
		state["legendary_weapon_ids"] = [101,102]
		_sync_armory_unlocks()
		SaveSystem.save_state(state)
