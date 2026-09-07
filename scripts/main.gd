extends Node2D

const PlayerScript = preload("res://scripts/player.gd")
const EnemyScript = preload("res://scripts/enemy.gd")
const BossScript = preload("res://scripts/boss.gd")
const PetScript = preload("res://scripts/pet.gd")
const PickupScript = preload("res://scripts/pickup.gd")
const ProjectileScript = preload("res://scripts/projectile.gd")
const SaveSystem = preload("res://scripts/save_system.gd")

const LEVEL_WIDTH := 3200.0
const GROUND_Y := 620.0

var world: Node2D
var player
var pet
var state: Dictionary = {}
var current_map := 1
var map_complete := false
var boss_alive := false
var supplies := 100.0
var survival_tick := 0.0
var rng := RandomNumberGenerator.new()

var hud_layer: CanvasLayer
var menu_layer: CanvasLayer
var health_label: Label
var supply_label: Label
var map_label: Label
var crystal_label: Label
var gear_label: Label
var pet_label: Label
var boss_label: Label
var toast_label: Label
var toast_timer := 0.0

var biomes := [
	{"name":"Mossline Meadows","sky":Color(0.07,0.14,0.20),"ground":Color(0.19,0.36,0.30),"accent":Color(0.38,0.84,0.60)},
	{"name":"Copper Canyons","sky":Color(0.19,0.10,0.11),"ground":Color(0.45,0.25,0.18),"accent":Color(1.0,0.53,0.30)},
	{"name":"Glasswater Ruins","sky":Color(0.06,0.15,0.23),"ground":Color(0.16,0.38,0.46),"accent":Color(0.44,0.84,0.94)},
	{"name":"Sunken Mire","sky":Color(0.12,0.17,0.13),"ground":Color(0.25,0.33,0.25),"accent":Color(0.66,0.83,0.37)},
	{"name":"Frost Circuit","sky":Color(0.09,0.13,0.23),"ground":Color(0.32,0.42,0.56),"accent":Color(0.72,0.86,1.0)},
	{"name":"Neon Hollow","sky":Color(0.13,0.09,0.19),"ground":Color(0.29,0.16,0.39),"accent":Color(0.82,0.42,1.0)},
	{"name":"Iron Barrens","sky":Color(0.17,0.13,0.13),"ground":Color(0.37,0.29,0.25),"accent":Color(1.0,0.70,0.36)},
	{"name":"The Last Rift","sky":Color(0.06,0.05,0.11),"ground":Color(0.21,0.15,0.31),"accent":Color(1.0,0.37,0.57)}
]

var pet_defs := [
	{"name":"Emberkin","power":5.0,"bonus":"burn burst"},{"name":"Mossbit","power":5.8,"bonus":"steady heal"},
	{"name":"Voltling","power":6.6,"bonus":"fast strike"},{"name":"Solwing","power":7.4,"bonus":"wide pulse"},
	{"name":"Nyxcat","power":8.2,"bonus":"rift blink"},{"name":"Rosebyte","power":9.0,"bonus":"lifesteal pulse"},
	{"name":"Sprig","power":9.8,"bonus":"supply aid"},{"name":"Chrome Pup","power":11.0,"bonus":"boss breaker"}
]
var boss_names := ["Graveljaw","Voltwing Prime","Mire Matron","Frostwarden","Rift Stalker","Iron Colossus","The Wild Core"]

func _ready() -> void:
	rng.randomize()
	_setup_input()
	_setup_ui()
	_show_title()

func _setup_input() -> void:
	_bind("move_left",KEY_A); _bind("move_left",KEY_LEFT)
	_bind("move_right",KEY_D); _bind("move_right",KEY_RIGHT)
	_bind("jump",KEY_SPACE); _bind("jump",KEY_W)
	_bind("dash",KEY_SHIFT)
	_bind("attack",KEY_J); _bind("attack",KEY_X)
	_bind("pet_skill",KEY_K); _bind("pet_skill",KEY_C)

func _bind(action: StringName, keycode: Key) -> void:
	if not InputMap.has_action(action): InputMap.add_action(action)
	var ev := InputEventKey.new(); ev.physical_keycode = keycode
	InputMap.action_add_event(action,ev)

func _process(delta: float) -> void:
	if toast_timer > 0.0:
		toast_timer -= delta
		if toast_timer <= 0.0: toast_label.visible = false
	if player and is_instance_valid(player) and not map_complete:
		supplies = max(0.0,supplies-delta*(0.18+current_map*0.006))
		survival_tick -= delta
		if supplies <= 0.0 and survival_tick <= 0.0:
			survival_tick = 2.0; player.take_damage(4.0+current_map*0.08)
		update_hud()

func _setup_ui() -> void:
	hud_layer = CanvasLayer.new(); hud_layer.layer = 20; add_child(hud_layer)
	var topbar := ColorRect.new(); topbar.position=Vector2(18,16); topbar.size=Vector2(1244,80); topbar.color=Color(0.03,0.03,0.055,0.90); hud_layer.add_child(topbar)
	health_label=_make_label(Vector2(36,26),Vector2(220,26),18)
	supply_label=_make_label(Vector2(36,56),Vector2(220,26),18)
	map_label=_make_label(Vector2(315,26),Vector2(370,26),20)
	crystal_label=_make_label(Vector2(315,58),Vector2(220,24),16)
	gear_label=_make_label(Vector2(720,25),Vector2(520,24),14)
	pet_label=_make_label(Vector2(720,55),Vector2(520,24),14)
	boss_label=_make_label(Vector2(360,105),Vector2(560,34),22); boss_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; boss_label.visible=false
	toast_label=_make_label(Vector2(330,628),Vector2(620,56),19); toast_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; toast_label.vertical_alignment=VERTICAL_ALIGNMENT_CENTER; toast_label.add_theme_color_override("font_color",Color(1.0,0.82,0.47)); toast_label.visible=false

func _make_label(pos: Vector2, size: Vector2, font_size: int) -> Label:
	var l:=Label.new(); l.position=pos; l.size=size; l.add_theme_font_size_override("font_size",font_size); l.add_theme_color_override("font_color",Color(0.95,0.95,0.98)); hud_layer.add_child(l); return l

func _show_title() -> void:
	if world:
		world.queue_free(); world=null; player=null; pet=null
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=100; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.04,0.04,0.06); menu_layer.add_child(bg)
	var band:=ColorRect.new(); band.position=Vector2(0,220); band.size=Vector2(1280,220); band.color=Color(0.09,0.06,0.14); menu_layer.add_child(band)
	var title:=Label.new(); title.position=Vector2(190,125); title.size=Vector2(900,90); title.text="XETHKIOZ: WILDBOUND"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",52); title.add_theme_color_override("font_color",Color(0.66,0.33,0.97)); menu_layer.add_child(title)
	var sub:=Label.new(); sub.position=Vector2(240,214); sub.size=Vector2(800,80); sub.text="32 mapas • supervivencia • equipo • compañeros • jefes evolutivos"; sub.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; sub.add_theme_font_size_override("font_size",20); sub.add_theme_color_override("font_color",Color(1.0,0.55,0.26)); menu_layer.add_child(sub)
	var new_btn:=_menu_button("NUEVA PARTIDA",Vector2(440,330)); new_btn.pressed.connect(_new_game)
	var cont_btn:=_menu_button("CONTINUAR",Vector2(440,395)); cont_btn.pressed.connect(_continue_game)
	var info_btn:=_menu_button("CONTROLES",Vector2(440,460)); info_btn.pressed.connect(func(): _toast("A/D mover • ESPACIO/W saltar • SHIFT dash • J/X atacar • K/C habilidad mascota",5.0))

func _menu_button(text: String,pos: Vector2) -> Button:
	var b:=Button.new(); b.position=pos; b.size=Vector2(400,52); b.text=text; b.add_theme_font_size_override("font_size",18); menu_layer.add_child(b); return b

func _new_game() -> void:
	state=SaveSystem.reset(); current_map=1; supplies=100.0; _start_level()
func _continue_game() -> void:
	state=SaveSystem.load_state(); current_map=int(state.get("current_map",1)); supplies=float(state.get("supplies",100.0)); _start_level()

func _start_level() -> void:
	if menu_layer: menu_layer.queue_free(); menu_layer=null
	map_complete=false; boss_alive=false; boss_label.visible=false
	if world: world.queue_free()
	world=Node2D.new(); world.name="World"; add_child(world); move_child(world,0)
	_generate_level(current_map); _spawn_player(); _spawn_pet_if_owned(); update_hud(); _toast("Mapa %02d — %s" % [current_map,_biome()["name"]],3.0)

func _biome() -> Dictionary:
	if current_map==32: return biomes[7]
	return biomes[min(7,int((current_map-1)/4))]
func _difficulty() -> float: return 1.0+current_map*0.10
func _is_boss_map(n:int)->bool: return n in [5,10,15,20,25,30,32]
func _boss_kind(n:int)->int:
	match n:
		5:return 0
		10:return 1
		15:return 2
		20:return 3
		25:return 4
		30:return 5
		32:return 6
	return 0

func _generate_level(map_no:int)->void:
	var biome:=_biome()
	var bg:=Polygon2D.new(); bg.z_index=-100; bg.polygon=PackedVector2Array([Vector2(-500,-500),Vector2(LEVEL_WIDTH+500,-500),Vector2(LEVEL_WIDTH+500,900),Vector2(-500,900)]); bg.color=biome["sky"]; world.add_child(bg)
	for i in range(15):
		var hill:=Polygon2D.new(); hill.z_index=-50; var hx=float(i)*250.0-120.0; var height=120.0+float((i*43+map_no*19)%120); hill.polygon=PackedVector2Array([Vector2(hx,GROUND_Y),Vector2(hx+120,GROUND_Y-height),Vector2(hx+260,GROUND_Y)]); hill.color=Color(biome["ground"],0.35); world.add_child(hill)
	var x:=-100.0; var segment_index:=0
	while x<LEVEL_WIDTH+200.0:
		var gap:=0.0
		if segment_index>1 and segment_index<13 and ((segment_index+map_no)%max(3,7-int(map_no/7)))==0:
			gap=55.0+float((segment_index*17+map_no*11)%38)
		x+=gap; var width:=250.0; _add_platform(Rect2(x,GROUND_Y,width,120.0),biome["ground"])
		if segment_index%2==1:
			var py:=505.0-float((segment_index+map_no)%3)*48.0; _add_platform(Rect2(x+65.0,py,125.0,22.0),Color(biome["accent"],0.8))
		x+=width; segment_index+=1
	var difficulty:=_difficulty(); var enemy_count:=min(18,4+int(map_no*0.45))
	for i in range(enemy_count):
		var ex:=420.0+i*((LEVEL_WIDTH-850.0)/max(1,enemy_count-1))+rng.randf_range(-60.0,60.0); _spawn_enemy(Vector2(ex,560.0),difficulty,(i+map_no)%4)
	for i in range(4): _spawn_pickup("food",Vector2(520.0+i*650.0,500.0-float(i%2)*90.0))
	for i in range(7): _spawn_pickup("crystal",Vector2(300.0+i*390.0,450.0-float((i+map_no)%3)*55.0))
	_spawn_pickup("chest",Vector2(LEVEL_WIDTH*0.48,565.0))
	var pet_map_index:=[3,7,11,15,19,23,27,31].find(map_no)
	if pet_map_index>=0: _spawn_pickup("pet",Vector2(LEVEL_WIDTH*0.72,475.0),{"pet_index":pet_map_index})
	if _is_boss_map(map_no): boss_alive=true; _spawn_boss(Vector2(LEVEL_WIDTH-480.0,545.0),_boss_kind(map_no),difficulty)
	else: _spawn_pickup("exit",Vector2(LEVEL_WIDTH-120.0,545.0))
	var spike_count:=min(10,int(map_no/3))
	for i in range(spike_count): _add_spike(Vector2(850.0+i*215.0+float((map_no*31+i*13)%90),604.0),4.0+map_no*0.22)

func _add_platform(rect:Rect2,color:Color)->void:
	var body:=StaticBody2D.new(); body.collision_layer=2; body.collision_mask=0; body.position=rect.position+rect.size/2.0
	var cs:=CollisionShape2D.new(); var sh:=RectangleShape2D.new(); sh.size=rect.size; cs.shape=sh; body.add_child(cs)
	var poly:=Polygon2D.new(); var hs:=rect.size/2.0; poly.polygon=PackedVector2Array([Vector2(-hs.x,-hs.y),Vector2(hs.x,-hs.y),Vector2(hs.x,hs.y),Vector2(-hs.x,hs.y)]); poly.color=color; body.add_child(poly); world.add_child(body)

func _add_spike(pos:Vector2,dmg:float)->void:
	var area:=Area2D.new(); area.collision_layer=8; area.collision_mask=1; area.position=pos
	var cs:=CollisionShape2D.new(); var sh:=RectangleShape2D.new(); sh.size=Vector2(24,15); cs.shape=sh; area.add_child(cs)
	var poly:=Polygon2D.new(); poly.polygon=PackedVector2Array([Vector2(-12,8),Vector2(-8,-7),Vector2(-4,8),Vector2(0,-7),Vector2(4,8),Vector2(8,-7),Vector2(12,8)]); poly.color=Color(0.78,0.82,0.90); area.add_child(poly)
	area.body_entered.connect(func(body): if body.is_in_group("player"): body.take_damage(dmg,Vector2(0,-170)))
	world.add_child(area)

func _spawn_player()->void:
	player=CharacterBody2D.new(); player.set_script(PlayerScript); world.add_child(player); player.position=Vector2(120,520)
	var w:Dictionary=state.get("weapon",{}); var a:Dictionary=state.get("armor",{}); var c:Dictionary=state.get("charm",{})
	player.setup(self,100.0+float(a.get("power",1.0))*2.0,float(w.get("power",1.0)),float(a.get("power",1.0)),float(c.get("power",1.0))); player.died.connect(_on_player_died)
func _spawn_enemy(pos:Vector2,difficulty:float,kind:int)->void:
	var e:=CharacterBody2D.new(); e.set_script(EnemyScript); world.add_child(e); e.position=pos; e.setup(self,difficulty,kind)
func _spawn_boss(pos:Vector2,kind:int,difficulty:float)->void:
	var b:=CharacterBody2D.new(); b.set_script(BossScript); world.add_child(b); b.position=pos; b.setup(self,kind,current_map,difficulty); boss_label.visible=true; update_boss_hud(b.hp,b.max_hp); _toast("JEFE: %s"%boss_names[kind],3.0)
func _spawn_pet_if_owned()->void:
	pet=null; var idx:=int(state.get("active_pet",-1)); if idx<0 or idx>=pet_defs.size(): return
	pet=Node2D.new(); pet.set_script(PetScript); world.add_child(pet); pet.position=player.position+Vector2(-40,-25); pet.setup(self,idx,float(pet_defs[idx]["power"])+current_map*0.06)
func _spawn_pickup(kind:String,pos:Vector2,payload:Dictionary={})->void:
	var p:=Area2D.new(); p.set_script(PickupScript); world.add_child(p); p.position=pos; p.setup(self,kind,payload)

func pickup_collected(node:Node,kind:String,payload:Dictionary)->void:
	match kind:
		"crystal": state["crystals"]=int(state.get("crystals",0))+1; node.queue_free()
		"food": supplies=min(100.0,supplies+24.0); if player: player.heal(4.0); node.queue_free()
		"chest": _reward_gear(); node.queue_free()
		"pet": _unlock_pet(int(payload.get("pet_index",0))); node.queue_free()
		"exit":
			if not boss_alive: node.queue_free(); _complete_map()
	update_hud()

func _reward_gear()->void:
	var slots:=["weapon","armor","charm"]; var slot:String=slots[(current_map+int(state.get("crystals",0)))%3]; var old:Dictionary=state.get(slot,{"power":1.0})
	var tier:=min(4,int(current_map/7)); var rarities:=["Common","Uncommon","Rare","Epic","Mythic"]; var prefixes:=["Trail","Rift","Primal","Apex","Wild"]
	var item_names:={"weapon":["Blade","Claw","Pulse Saber","Arc Edge","Wildfang"],"armor":["Jacket","Shell","Aegis","Riftcoat","Coreplate"],"charm":["Compass","Totem","Sigil","Beacon","Crown"]}
	var new_item:={"name":"%s %s"%[prefixes[tier],item_names[slot][tier]],"power":snapped(1.0+current_map*0.42+rng.randf_range(0.0,2.4),0.1),"rarity":rarities[tier]}
	if float(new_item["power"])>float(old.get("power",0.0)): state[slot]=new_item; _toast("EQUIPADO: %s +%.1f"%[new_item["name"],new_item["power"]],3.0)
	else: state["crystals"]=int(state.get("crystals",0))+3; _toast("Equipo inferior reciclado: +3 cristales",2.5)

func _unlock_pet(idx:int)->void:
	var owned:Array=state.get("pets",[]); if idx not in owned: owned.append(idx); state["pets"]=owned
	state["active_pet"]=idx; _toast("COMPAÑERO: %s — %s"%[pet_defs[idx]["name"],pet_defs[idx]["bonus"]],4.0)
	if pet and is_instance_valid(pet): pet.queue_free()
	_spawn_pet_if_owned()

func player_attack(pos:Vector2,facing:int,power:float)->void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var d:Vector2=e.global_position-pos
		if abs(d.y)<58.0 and d.x*facing>-10.0 and d.x*facing<78.0: e.take_damage(power)
func enemy_defeated(_enemy:Node,reward:int)->void: state["crystals"]=int(state.get("crystals",0))+reward; update_hud()

func boss_defeated(_boss:Node,kind:int)->void:
	boss_alive=false; boss_label.visible=false; var bosses:Array=state.get("bosses",[]); if current_map not in bosses: bosses.append(current_map); state["bosses"]=bosses
	state["crystals"]=int(state.get("crystals",0))+15+current_map; supplies=min(100.0,supplies+30.0); _toast("%s derrotado. Salida desbloqueada."%boss_names[kind],4.0); _spawn_pickup("exit",Vector2(LEVEL_WIDTH-120.0,545.0)); update_hud()

func boss_attack(boss:Node,kind:int,phase:int)->void:
	if not player or not is_instance_valid(player): return
	var origin:Vector2=boss.global_position; var target:Vector2=player.global_position; var base_dmg:=5.0+current_map*0.28+phase*1.2
	match kind:
		0:
			for i in range(2+phase):
				var dir:=Vector2(-1.0 if i%2==0 else 1.0,-0.22+i*0.05).normalized(); _spawn_projectile(origin+Vector2(0,-20),dir*(185.0+phase*25.0),base_dmg,Color(1.0,0.62,0.36))
		1:
			for i in range(phase+2):
				var xoff:=(i-float(phase+1)/2.0)*105.0; _spawn_projectile(Vector2(target.x+xoff,110),Vector2(0,260+phase*35),base_dmg,Color(0.45,0.84,1.0))
		2:
			for i in range(phase+1): _spawn_enemy(origin+Vector2(-100+i*80,-30),_difficulty()*0.85,0)
			_spawn_projectile(origin,(target-origin).normalized()*210.0,base_dmg+2.0,Color(0.61,0.84,0.36))
		3:
			for i in range(4+phase*2):
				var angle:=TAU*float(i)/float(4+phase*2); _spawn_projectile(origin,Vector2(cos(angle),sin(angle))*205.0,base_dmg,Color(0.72,0.89,1.0))
		4:
			var dir:=(target-origin).normalized()
			for i in range(-phase,phase+1): _spawn_projectile(origin,dir.rotated(i*0.18)*270.0,base_dmg,Color(0.89,0.42,1.0))
		5:
			for i in range(phase+2):
				var vx:=-320.0+i*(640.0/max(1,phase+1)); _spawn_projectile(origin+Vector2(0,-30),Vector2(vx,-80).normalized()*310.0,base_dmg+1.5,Color(1.0,0.69,0.37))
		_:
			boss_attack(boss,rng.randi_range(0,5),max(2,phase))
func _spawn_projectile(pos:Vector2,vel:Vector2,damage:float,color:Color)->void:
	var h:=Area2D.new(); h.set_script(ProjectileScript); world.add_child(h); h.position=pos; h.setup(vel,damage,4.5,color)

func activate_pet_skill()->void:
	if pet and is_instance_valid(pet):
		if pet.activate_skill(): _toast("%s: habilidad activada"%pet_defs[int(state.get("active_pet",0))]["name"],1.8)
	else: _toast("Todavía no encontraste un compañero.",2.0)

func _on_player_died()->void:
	map_complete=true; state["deaths"]=int(state.get("deaths",0))+1; state["supplies"]=max(45.0,supplies); state["current_map"]=current_map; SaveSystem.save_state(state); _show_retry()
func _show_retry()->void:
	if menu_layer: menu_layer.queue_free()
	menu_layer=CanvasLayer.new(); menu_layer.layer=110; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.02,0.02,0.03,0.88); menu_layer.add_child(bg)
	var l:=Label.new(); l.position=Vector2(290,235); l.size=Vector2(700,80); l.text="CAÍSTE EN EL MAPA %02d"%current_map; l.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; l.add_theme_font_size_override("font_size",34); menu_layer.add_child(l)
	var b:=Button.new(); b.position=Vector2(440,350); b.size=Vector2(400,56); b.text="REINTENTAR"; b.pressed.connect(func(): supplies=max(55.0,float(state.get("supplies",60.0))); _start_level()); menu_layer.add_child(b)
	var q:=Button.new(); q.position=Vector2(440,420); q.size=Vector2(400,52); q.text="MENÚ PRINCIPAL"; q.pressed.connect(_show_title); menu_layer.add_child(q)

func _complete_map()->void:
	if map_complete:return
	map_complete=true; state["unlocked_map"]=max(int(state.get("unlocked_map",1)),min(32,current_map+1)); state["supplies"]=supplies
	if current_map>=32: state["current_map"]=32; SaveSystem.save_state(state); _show_victory(); return
	current_map+=1; state["current_map"]=current_map; supplies=min(100.0,supplies+18.0); state["supplies"]=supplies; SaveSystem.save_state(state); _show_intermission()
func _show_intermission()->void:
	menu_layer=CanvasLayer.new(); menu_layer.layer=105; add_child(menu_layer)
	var panel:=ColorRect.new(); panel.position=Vector2(300,195); panel.size=Vector2(680,330); panel.color=Color(0.035,0.03,0.07,0.96); menu_layer.add_child(panel)
	var l:=Label.new(); l.position=Vector2(340,235); l.size=Vector2(600,115); l.text="MAPA SUPERADO\nSiguiente: %02d — %s"%[current_map,_biome()["name"]]; l.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; l.add_theme_font_size_override("font_size",28); menu_layer.add_child(l)
	var stats:=Label.new(); stats.position=Vector2(375,350); stats.size=Vector2(530,70); stats.text="Cristales: %d   •   Suministros: %d%%"%[int(state.get("crystals",0)),int(supplies)]; stats.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; stats.add_theme_font_size_override("font_size",18); menu_layer.add_child(stats)
	var b:=Button.new(); b.position=Vector2(440,435); b.size=Vector2(400,52); b.text="CONTINUAR"; b.pressed.connect(_start_level); menu_layer.add_child(b)
func _show_victory()->void:
	menu_layer=CanvasLayer.new(); menu_layer.layer=120; add_child(menu_layer)
	var bg:=ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.04,0.03,0.07); menu_layer.add_child(bg)
	var l:=Label.new(); l.position=Vector2(170,170); l.size=Vector2(940,220); l.text="WILDBOUND COMPLETADO\n32 MAPAS SUPERADOS"; l.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; l.vertical_alignment=VERTICAL_ALIGNMENT_CENTER; l.add_theme_font_size_override("font_size",46); l.add_theme_color_override("font_color",Color(0.77,0.55,1.0)); menu_layer.add_child(l)
	var s:=Label.new(); s.position=Vector2(260,405); s.size=Vector2(760,80); s.text="Jefes: %d/7   •   Compañeros: %d/8   •   Cristales: %d"%[state.get("bosses",[]).size(),state.get("pets",[]).size(),int(state.get("crystals",0))]; s.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; s.add_theme_font_size_override("font_size",20); menu_layer.add_child(s)
	var b:=Button.new(); b.position=Vector2(440,530); b.size=Vector2(400,56); b.text="VOLVER AL MENÚ"; b.pressed.connect(_show_title); menu_layer.add_child(b)

func update_hud()->void:
	if not health_label:return
	var hp:=0; var max_hp:=100
	if player and is_instance_valid(player): hp=int(max(0.0,player.health)); max_hp=int(player.max_health)
	health_label.text="VIDA  %d / %d"%[hp,max_hp]; supply_label.text="SUMINISTROS  %d%%"%int(supplies); map_label.text="MAPA %02d / 32  •  %s"%[current_map,_biome()["name"]]; crystal_label.text="CRISTALES  %d"%int(state.get("crystals",0))
	var w:Dictionary=state.get("weapon",{"name":"-","power":0}); var a:Dictionary=state.get("armor",{"name":"-","power":0}); var c:Dictionary=state.get("charm",{"name":"-","power":0})
	gear_label.text="W %s %.1f   A %s %.1f   C %s %.1f"%[w.get("name","-"),float(w.get("power",0)),a.get("name","-"),float(a.get("power",0)),c.get("name","-"),float(c.get("power",0))]
	var pi:=int(state.get("active_pet",-1)); pet_label.text="COMPAÑERO: %s   • K/C habilidad"%(pet_defs[pi]["name"] if pi>=0 and pi<pet_defs.size() else "ninguno")
func update_boss_hud(hp:float,max_hp:float)->void:
	boss_label.text="%s  %d / %d"%[boss_names[_boss_kind(current_map)],int(max(0,hp)),int(max_hp)]; boss_label.visible=true
func _toast(text:String,seconds:float=2.5)->void:
	if not toast_label:return
	toast_label.text=text; toast_label.visible=true; toast_timer=seconds
