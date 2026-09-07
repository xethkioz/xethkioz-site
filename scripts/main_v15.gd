extends "res://scripts/main_v12_traversal.gd"

# World of Xethkioz v0.9.2 — Steam Demo Production Layer
# Clean integration of the 120-node overworld, demo nodes 1–15, armory,
# block difficulty, scenic presentation and Steam-demo ending.

const OverworldData = preload("res://scripts/overworld_data.gd")
const ArmoryData = preload("res://scripts/armory_data.gd")
const OverworldMapView = preload("res://scripts/overworld_map_view.gd")
const BG_PLAINS: Texture2D = preload("res://assets/v09/generated/izrdalar_plains_bg.png")
const BG_CISM: Texture2D = preload("res://assets/v09/generated/first_cism_bg.png")
const PROP_TREE: Texture2D = preload("res://assets/v09/generated/quebracho_prop.png")
const PROP_RUIN: Texture2D = preload("res://assets/v09/generated/ruin_arch_prop.png")
const PROP_CRYSTALS: Texture2D = preload("res://assets/v09/generated/crystal_cluster_prop.png")

var overworld_layer: CanvasLayer
var armory_layer: CanvasLayer

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
	if not state.has("demo_completed_map15"): state["demo_completed_map15"] = false
	if not state.has("premium_owned"): state["premium_owned"] = false
	if not state.has("premium_wings_equipped"): state["premium_wings_equipped"] = false
	if not state.has("premium_wing_buff"): state["premium_wing_buff"] = {}
	_sync_armory_unlocks()
	SaveSystem.save_state(state)

func _sync_armory_unlocks() -> void:
	var furthest: int = clampi(int(state.get("unlocked_map",1)),1,15)
	state["unlocked_weapon_ids"] = ArmoryData.unlocked_weapon_ids(furthest)
	state["unlocked_set_ids"] = ArmoryData.unlocked_set_ids(furthest)
	if bool(state.get("demo_completed_map15",false)):
		state["legendary_weapon_ids"] = [101,102]
		var ids: Array = state["unlocked_weapon_ids"]
		if 101 not in ids: ids.append(101)
		if 102 not in ids: ids.append(102)
		state["unlocked_weapon_ids"] = ids

# -----------------------------------------------------------------------------
# ENTRY FLOW
func _new_game() -> void:
	state = SaveSystem.reset()
	_ensure_v3_state()
	state["mentor_chosen"] = false
	state["selected_hero"] = -1
	state["set_pieces"] = 0
	state["parenting_points"] = 0
	state["alexis_marks"] = []
	state["current_map"] = 1
	state["current_node"] = 1
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
	current_map = 1
	SaveSystem.save_state(state)
	_start_level()

func _show_title() -> void:
	if overworld_layer: overworld_layer.queue_free(); overworld_layer = null
	if armory_layer: armory_layer.queue_free(); armory_layer = null
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and ("v0.8" in node.text or "v0.7" in node.text):
			node.text = "v0.9.2 • STEAM DEMO PRODUCTION • 15 NIVELES • MUNDO 120 NODOS"
	var world_btn := Button.new()
	world_btn.position = Vector2(835,285)
	world_btn.size = Vector2(350,52)
	world_btn.text = "MAPA GLOBAL"
	world_btn.add_theme_font_size_override("font_size",16)
	_style_button(world_btn)
	world_btn.pressed.connect(_open_saved_overworld)
	menu_layer.add_child(world_btn)
	var armory_btn := Button.new()
	armory_btn.position = Vector2(835,348)
	armory_btn.size = Vector2(350,52)
	armory_btn.text = "ARMERÍA"
	armory_btn.add_theme_font_size_override("font_size",16)
	_style_button(armory_btn)
	armory_btn.pressed.connect(_open_saved_armory)
	menu_layer.add_child(armory_btn)

func _open_saved_overworld() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state(); _ensure_demo_state()
	_show_overworld()

func _open_saved_armory() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state(); _ensure_demo_state()
	_show_armory()

# -----------------------------------------------------------------------------
# OVERWORLD
func _show_overworld() -> void:
	if world:
		world.queue_free(); world = null; player = null; pet = null
	if hud_layer: hud_layer.visible = false
	if dialogue_layer: dialogue_layer.visible = false
	if menu_layer: menu_layer.queue_free(); menu_layer = null
	if armory_layer: armory_layer.queue_free(); armory_layer = null
	if overworld_layer: overworld_layer.queue_free()
	overworld_layer = CanvasLayer.new(); overworld_layer.layer = 130; add_child(overworld_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.010,0.016,0.044); overworld_layer.add_child(bg)
	var top := Panel.new(); top.position=Vector2(24,16); top.size=Vector2(1232,82); top.add_theme_stylebox_override("panel",_panel_style(Color(0.018,0.025,0.06,0.96),Color(0.42,0.28,0.72,0.95),2)); overworld_layer.add_child(top)
	_vlabel(top,Vector2(22,10),Vector2(700,34),"MAPA GLOBAL • WORLD OF XETHKIOZ",24,Color(0.82,0.64,1.0))
	_vlabel(top,Vector2(22,46),Vector2(720,22),"DEMO 1–15 • JUEGO BASE 1–32 • EXPANSIONES PROYECTADAS HASTA 120",11,Color(0.68,0.76,0.92))
	var completed: Array = state.get("completed_nodes",[])
	var unlocked: Array = state.get("unlocked_nodes",[1])
	var st := _vlabel(top,Vector2(770,18),Vector2(425,38),"IZRDRALAR • %d/15 COMPLETADOS" % mini(completed.size(),15),14,Color(1.0,0.72,0.34)); st.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT

	var scroll := ScrollContainer.new(); scroll.position=Vector2(28,110); scroll.size=Vector2(1224,520); scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO; scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO; overworld_layer.add_child(scroll)
	var view: Control = Control.new(); view.set_script(OverworldMapView); scroll.add_child(view); view.call("setup",completed,unlocked,15)
	for id in range(1,33):
		var button := Button.new(); var pos: Vector2 = OverworldData.node_position(id)
		button.position=pos-Vector2(26,26); button.size=Vector2(52,52); button.text=str(id); button.flat=true
		button.tooltip_text="%02d — %s\n%s" % [id,OverworldData.node_name(id),OverworldData.description(id)]
		var available: bool = id in unlocked and id <= 15
		button.disabled = not available
		button.modulate = Color(1,1,1,0.12) if available else Color(1,1,1,0.025)
		if available: button.pressed.connect(_select_overworld_node.bind(id))
		view.add_child(button)
	var back := Button.new(); back.position=Vector2(28,650); back.size=Vector2(210,46); back.text="MENÚ PRINCIPAL"; _style_button(back); back.pressed.connect(_show_title); overworld_layer.add_child(back)
	var armory := Button.new(); armory.position=Vector2(250,650); armory.size=Vector2(210,46); armory.text="ARMERÍA"; _style_button(armory); armory.pressed.connect(_show_armory); overworld_layer.add_child(armory)
	var legend := _vlabel(overworld_layer,Vector2(485,650),Vector2(745,42),"Violeta: disponible • Celeste: completado • Rojo: jefe • Gris: futuro",11,Color(0.72,0.75,0.84)); legend.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT

func _select_overworld_node(id: int) -> void:
	var unlocked: Array = state.get("unlocked_nodes",[1])
	if id not in unlocked or id > 15: return
	state["current_node"] = id; state["current_map"] = id; current_map = id
	supplies = float(state.get("supplies",100.0)); SaveSystem.save_state(state)
	if overworld_layer: overworld_layer.queue_free(); overworld_layer = null
	_start_level()

func _mark_node_completed(id: int) -> void:
	var completed: Array = state.get("completed_nodes",[])
	if id not in completed: completed.append(id)
	state["completed_nodes"] = completed
	var unlocked: Array = state.get("unlocked_nodes",[1])
	if id < 15 and id+1 not in unlocked: unlocked.append(id+1)
	state["unlocked_nodes"] = unlocked
	state["unlocked_map"] = maxi(int(state.get("unlocked_map",1)),mini(15,id+1))
	_sync_armory_unlocks()
	SaveSystem.save_state(state)

func _complete_map() -> void:
	if map_complete: return
	map_complete = true
	var finished: int = current_map
	_mark_node_completed(finished)
	if finished == 15:
		state["demo_complete"] = true; state["demo_completed_map15"] = true
		state["legendary_weapon_ids"] = [101,102]
		_sync_armory_unlocks(); SaveSystem.save_state(state)
		_show_demo_complete()
		return
	current_map = finished+1
	state["current_map"] = current_map; state["current_node"] = current_map
	supplies = min(float(state.get("max_supplies",100.0)),supplies+12.0); state["supplies"] = supplies
	SaveSystem.save_state(state)
	if finished == 5 and not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
	else:
		_show_demo_refuge()

func _select_mentor(index: int) -> void:
	state["selected_hero"] = index; state["mentor_chosen"] = true; SaveSystem.save_state(state)
	_show_overworld()

func _show_demo_refuge() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=118; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.018,0.025,0.055); menu_layer.add_child(bg)
	var title:=_vlabel(menu_layer,Vector2(180,105),Vector2(920,62),"REFUGIO DE ELIDA",34,Color(0.78,0.58,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var copy:=_vlabel(menu_layer,Vector2(245,190),Vector2(790,88),"Elida cura las heridas y marca el siguiente punto del camino. Desde acá podés volver al mapa global o revisar tu equipo.",16,Color(0.84,0.86,0.94)); copy.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; copy.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var nxt:=_vlabel(menu_layer,Vector2(270,315),Vector2(740,72),"PRÓXIMO NODO\n%02d — %s" % [current_map,OverworldData.node_name(current_map)],18,Color(1.0,0.72,0.34)); nxt.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var mapb:=Button.new(); mapb.position=Vector2(420,440); mapb.size=Vector2(440,58); mapb.text="VOLVER AL MAPA GLOBAL"; _style_button(mapb); mapb.pressed.connect(_show_overworld); menu_layer.add_child(mapb)
	var armb:=Button.new(); armb.position=Vector2(420,515); armb.size=Vector2(440,52); armb.text="REVISAR ARMERÍA"; _style_button(armb); armb.pressed.connect(_show_armory); menu_layer.add_child(armb)

func _show_demo_complete() -> void:
	if hud_layer: hud_layer.visible=false
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=140; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.008,0.012,0.035); menu_layer.add_child(bg)
	var title:=_vlabel(menu_layer,Vector2(120,70),Vector2(1040,72),"DEMO COMPLETADA • PRIMER CISMA SUPERADO",34,Color(0.82,0.60,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var copy:=_vlabel(menu_layer,Vector2(200,170),Vector2(880,140),"El Arconte del Umbral cayó. Desfralar comienza a abrirse bajo Izrdralar.\n\nLa campaña completa continúa más allá del Nodo 15 y el mapa global deja ver las regiones futuras.",17,Color(0.86,0.88,0.96)); copy.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; copy.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var reward:=_vlabel(menu_layer,Vector2(240,335),Vector2(800,85),"ARMAS LEGENDARIAS DESBLOQUEADAS\nVeredicto del Primer Cisma • Aria del Umbral Prismático",18,Color(1.0,0.74,0.30)); reward.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var a:=Button.new(); a.position=Vector2(420,465); a.size=Vector2(440,56); a.text="ABRIR ARMERÍA"; _style_button(a); a.pressed.connect(_show_armory); menu_layer.add_child(a)
	var w:=Button.new(); w.position=Vector2(420,535); w.size=Vector2(440,56); w.text="VER MAPA GLOBAL"; _style_button(w); w.pressed.connect(_show_overworld); menu_layer.add_child(w)

# -----------------------------------------------------------------------------
# ARMORY
func _show_armory() -> void:
	if overworld_layer: overworld_layer.queue_free(); overworld_layer=null
	if menu_layer: menu_layer.queue_free(); menu_layer=null
	if armory_layer: armory_layer.queue_free()
	armory_layer=CanvasLayer.new(); armory_layer.layer=132; add_child(armory_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.012,0.016,0.038); armory_layer.add_child(bg)
	var title:=_vlabel(armory_layer,Vector2(70,30),Vector2(1140,54),"ARMERÍA DE IZRDRALAR",30,Color(0.82,0.62,1.0)); title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var current_w:=ArmoryData.weapon_by_id(int(state.get("equipped_weapon_id",1)))
	var current_s:=ArmoryData.set_by_id(str(state.get("equipped_set_id","brote_vivo")))
	var info:=_vlabel(armory_layer,Vector2(100,90),Vector2(1080,58),"EQUIPADO • %s   |   %s" % [str(current_w["name"]),str(current_s["name"])],14,Color(1.0,0.72,0.34)); info.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	var left:=Panel.new(); left.position=Vector2(45,155); left.size=Vector2(720,465); left.add_theme_stylebox_override("panel",_panel_style(Color(0.02,0.025,0.055,0.94),Color(0.34,0.25,0.52,0.92),2)); armory_layer.add_child(left)
	_vlabel(left,Vector2(20,10),Vector2(680,32),"25 ARMAS BASE + 2 LEGENDARIAS",18,Color(0.78,0.82,1.0))
	var wscroll:=ScrollContainer.new(); wscroll.position=Vector2(15,48); wscroll.size=Vector2(690,400); left.add_child(wscroll)
	var wlist:=VBoxContainer.new(); wlist.custom_minimum_size=Vector2(655,0); wscroll.add_child(wlist)
	var unlocked_w:Array=state.get("unlocked_weapon_ids",[])
	var all_weapons:Array=ArmoryData.WEAPONS+ArmoryData.LEGENDARY_WEAPONS
	for variant in all_weapons:
		var weapon:Dictionary=variant; var wid:int=int(weapon["id"]); var available:bool=wid in unlocked_w
		var b:=Button.new(); b.custom_minimum_size=Vector2(635,44); b.text=("" if available else "[BLOQUEADA] ")+str(weapon["name"])+" • "+str(weapon["affinity"])+" • Poder %.2f"%float(weapon["power"]); b.disabled=not available; _style_button(b)
		if available: b.pressed.connect(_equip_weapon.bind(wid))
		wlist.add_child(b)
	var right:=Panel.new(); right.position=Vector2(790,155); right.size=Vector2(445,465); right.add_theme_stylebox_override("panel",_panel_style(Color(0.02,0.025,0.055,0.94),Color(0.34,0.25,0.52,0.92),2)); armory_layer.add_child(right)
	_vlabel(right,Vector2(20,10),Vector2(400,32),"10 CONJUNTOS",18,Color(0.78,0.82,1.0))
	var sscroll:=ScrollContainer.new(); sscroll.position=Vector2(15,48); sscroll.size=Vector2(415,285); right.add_child(sscroll)
	var slist:=VBoxContainer.new(); slist.custom_minimum_size=Vector2(390,0); sscroll.add_child(slist)
	var unlocked_s:Array=state.get("unlocked_set_ids",[])
	for variant in ArmoryData.SETS:
		var setd:Dictionary=variant; var sid:String=str(setd["id"]); var available_s:bool=sid in unlocked_s
		var sb:=Button.new(); sb.custom_minimum_size=Vector2(375,46); sb.text=("" if available_s else "[BLOQUEADO] ")+str(setd["name"])+" • "+str(setd["affinity"]); sb.disabled=not available_s; _style_button(sb)
		if available_s: sb.pressed.connect(_equip_set.bind(sid))
		slist.add_child(sb)
	var premium:=_vlabel(right,Vector2(25,355),Vector2(395,70),"PREMIUM • Alas del Mecenas Prismático\nCosmético con buff leve aleatorio. Entitlement de Steam pendiente de integración.",11,Color(0.82,0.72,1.0)); premium.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; premium.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	var back:=Button.new(); back.position=Vector2(515,645); back.size=Vector2(250,48); back.text="VOLVER AL MAPA"; _style_button(back); back.pressed.connect(_show_overworld); armory_layer.add_child(back)

func _equip_weapon(id:int) -> void:
	var w:Dictionary=ArmoryData.weapon_by_id(id)
	state["equipped_weapon_id"]=id; state["weapon"]={"id":id,"name":str(w["name"]),"power":float(w["power"]),"rarity":str(w["rarity"])}; SaveSystem.save_state(state); _show_armory()

func _equip_set(id:String) -> void:
	var s:Dictionary=ArmoryData.set_by_id(id)
	state["equipped_set_id"]=id; state["armor"]={"set_id":id,"name":str(s["name"]),"power":float(s["power"]),"rarity":"Set"}; SaveSystem.save_state(state); _show_armory()

# -----------------------------------------------------------------------------
# DIFFICULTY & OBJECTIVES
func _difficulty() -> float:
	var tier:int=OverworldData.demo_tier(current_map)
	return 1.0+float(current_map)*0.035+float(tier)*0.16

func _objective_is_complete() -> bool:
	match current_map:
		8: return map_crystals>=5
		12: return map_crystals>=6
		14: return map_crystals>=7
	return super._objective_is_complete()

func _objective_text() -> String:
	match current_map:
		8: return "OBJETIVO • recuperá 5 fragmentos (%d/5)"%mini(map_crystals,5)
		12: return "OBJETIVO • reuní 6 ecos (%d/6)"%mini(map_crystals,6)
		14: return "OBJETIVO • estabilizá la Grieta con 7 fragmentos (%d/7)"%mini(map_crystals,7)
	return super._objective_text()

# -----------------------------------------------------------------------------
# LEVELS 6–15
func _generate_level(map_no:int) -> void:
	if map_no<=5 or map_no>15:
		super._generate_level(map_no)
	else:
		_generate_demo_6_15(map_no)
	if map_no>=1 and map_no<=15: _add_demo_scenery(map_no)

func _generate_demo_6_15(map_no:int) -> void:
	var biome:Dictionary=_biome(); _build_background(biome,map_no)
	var ground:Color=biome["ground"]; var accent:Color=Color(biome["accent"],0.88); var diff:float=_difficulty()
	if map_no<=10:
		_add_platform(Rect2(-100,GROUND_Y,720,120),ground); _add_platform(Rect2(760,GROUND_Y,620,120),ground); _add_platform(Rect2(1460,GROUND_Y,620,120),ground); _add_platform(Rect2(2180,GROUND_Y,1120,120),ground)
		_add_slope(250,GROUND_Y,300,120,true,accent); _add_slope(1120,GROUND_Y,260,105,false,accent); _add_slope(1600,GROUND_Y,300,140,true,accent)
		for r in [Rect2(560,470,180,18),Rect2(820,420,180,18),Rect2(1050,375,160,18),Rect2(1780,430,170,18),Rect2(2010,380,180,18)]: _add_one_way_platform(r,accent)
		_add_prism_boost(Vector2(160,606),1,640.0+float(map_no-6)*12.0); _add_bounce_pad(Vector2(1420,606),670.0); _add_prism_boost(Vector2(2240,606),1,680.0)
		var enemy_count:int=6+(map_no-6)
		for i in range(enemy_count):
			var ex:float=470.0+float(i)*(2600.0/float(maxi(1,enemy_count-1))); _spawn_enemy(Vector2(ex,560),diff,(i+map_no)%4)
		var needed:int=5 if map_no==8 else 7; _crystal_line(Vector2(430,510),needed,Vector2(95,-12)); _crystal_line(Vector2(1760,390),4,Vector2(90,-8)); _spawn_pickup("food",Vector2(1280,555)); _spawn_pickup("chest",Vector2(2500,555))
		if map_no==10:
			boss_alive=true; _spawn_boss(Vector2(2750,545),1,diff+0.15)
		else: _spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))
	else:
		_add_platform(Rect2(-100,GROUND_Y,560,120),ground); _add_platform(Rect2(610,GROUND_Y,500,120),ground); _add_platform(Rect2(1260,GROUND_Y,470,120),ground); _add_platform(Rect2(1880,GROUND_Y,520,120),ground); _add_platform(Rect2(2540,GROUND_Y,760,120),ground)
		for r in [Rect2(360,500,150,18),Rect2(610,445,150,18),Rect2(840,390,150,18),Rect2(1080,335,150,18),Rect2(1380,470,170,18),Rect2(1620,410,150,18),Rect2(1910,350,160,18),Rect2(2190,430,170,18),Rect2(2470,365,160,18),Rect2(2780,430,180,18)]: _add_one_way_platform(r,accent)
		_add_bounce_pad(Vector2(545,606),710.0); _add_bounce_pad(Vector2(1745,606),735.0); _add_prism_boost(Vector2(1180,606),1,690.0); _add_prism_boost(Vector2(2450,606),1,720.0)
		var enemy_count2:int=8+(map_no-11)
		for i in range(enemy_count2):
			var ex2:float=390.0+float(i)*(2700.0/float(maxi(1,enemy_count2-1))); var ey:float=560.0 if i%3!=1 else 430.0; _spawn_enemy(Vector2(ex2,ey),diff+0.08,(i+map_no)%4)
		var needed2:int=7 if map_no==14 else 8; _crystal_line(Vector2(420,455),needed2,Vector2(82,-10)); _crystal_line(Vector2(1940,315),5,Vector2(80,5)); _spawn_pickup("food",Vector2(1520,555)); _spawn_pickup("chest",Vector2(2260,555))
		if map_no==15:
			boss_alive=true; _spawn_boss(Vector2(2760,545),2,diff+0.20)
		else: _spawn_pickup("exit",Vector2(LEVEL_WIDTH-120,545))

# -----------------------------------------------------------------------------
# SCENERY
func _add_demo_scenery(map_no:int) -> void:
	if not world: return
	var texture:Texture2D = BG_IZRDRALAR if map_no<=5 else (BG_PLAINS if map_no<=10 else BG_CISM)
	var tint:Color=_scenic_tint(map_no)
	for i in range(3):
		var bg:=Sprite2D.new(); bg.texture=texture; bg.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; bg.centered=false; bg.position=Vector2(float(i)*1280.0,0); bg.scale=Vector2(4,4); bg.modulate=tint; bg.z_index=-92; world.add_child(bg)
	var positions:Array[float]=[260.0,690.0,1160.0,1580.0,2060.0,2520.0,2980.0]
	for i in range(positions.size()):
		var x:float=positions[i]+float((map_no*37+i*53)%90)-45.0
		_add_prop(PROP_TREE if (i+map_no)%2==0 else PROP_RUIN,Vector2(x,GROUND_Y-72),Vector2(1.55,1.55),-14,Color(0.94,0.97,1.0,0.92))
		if (i+map_no)%3==0: _add_prop(PROP_CRYSTALS,Vector2(x+64,GROUND_Y-30),Vector2(1.7,1.7),-8,Color.WHITE)

func _add_prop(texture:Texture2D,pos:Vector2,scale_value:Vector2,z:int,tint:Color) -> void:
	var s:=Sprite2D.new(); s.texture=texture; s.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST; s.centered=false; s.position=pos; s.scale=scale_value; s.modulate=tint; s.z_index=z; world.add_child(s)

func _scenic_tint(map_no:int) -> Color:
	var tints:Array[Color]=[
		Color(1.02,0.96,0.88),Color(1.0,1.0,0.96),Color(0.88,0.93,1.02),Color(0.64,0.72,0.94),Color(0.82,0.70,0.94),
		Color(1.0,0.98,0.88),Color(1.0,0.98,0.88),Color(0.96,0.90,0.80),Color(0.84,0.88,0.95),Color(0.82,0.74,0.94),
		Color(0.82,0.86,0.96),Color(0.82,0.86,0.96),Color(0.78,0.74,0.90),Color(0.70,0.68,0.86),Color(0.76,0.60,0.88)
	]
	return tints[clampi(map_no-1,0,tints.size()-1)]
