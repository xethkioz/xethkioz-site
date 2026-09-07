extends "res://scripts/main.gd"

const WorldData = preload("res://scripts/world_data.gd")
const PlayerV3Script = preload("res://scripts/player_v3.gd")

var in_nigzen := false
var nigzen_return_map := 0
var nigzen_puzzle := 0
var nigzen_wave := 0
var nigzen_wave_delay := 0.0
var nigzen_reward_spawned := false

func _ready() -> void:
	pet_defs = WorldData.LEGENDARIES.duplicate(true)
	boss_names = WorldData.BOSS_NAMES.duplicate()
	super._ready()
	_bind("skill_1",KEY_Q)
	_bind("skill_2",KEY_E)
	_bind("skill_3",KEY_R)
	_bind("set_skill",KEY_F)

func _process(delta: float) -> void:
	super._process(delta)
	_update_nigzen(delta)

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label:
			if node.text == "XETHKIOZ: WILDBOUND":
				node.text = "WORLD OF XETHKIOZ"
			elif node.text.begins_with("DEMO v0.2"):
				node.text = "v0.3 CANON • 4 hermanos • clases • legendarios • 32 mapas"
			elif node.text.begins_with("Original IP"):
				node.text = "Mundo de Xethkioz • Original IP • Windows • Godot 4.7.2"

func _new_game() -> void:
	state = SaveSystem.reset()
	_ensure_v3_state()
	current_map = 1
	supplies = 100.0
	_show_hero_select()

func _continue_game() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state()
	current_map = int(state.get("current_map",1))
	supplies = float(state.get("supplies",100.0))
	_start_level()

func _ensure_v3_state() -> void:
	if not state.has("selected_hero"): state["selected_hero"] = 0
	if not state.has("set_pieces"): state["set_pieces"] = 0
	if not state.has("paladin_unlocked"): state["paladin_unlocked"] = false
	if not state.has("nigzen_complete"): state["nigzen_complete"] = false
	if not state.has("legendary_weapon"): state["legendary_weapon"] = false
	var owned: Array = state.get("pets",[])
	if 0 not in owned: owned.append(0)
	state["pets"] = owned
	if int(state.get("active_pet",-1)) < 0: state["active_pet"] = 0
	state["pet_bond"] = max(1.0,float(state.get("pet_bond",0.0)))
	SaveSystem.save_state(state)

func _show_hero_select() -> void:
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 105; add_child(menu_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.035,0.03,0.07); menu_layer.add_child(bg)
	var title := Label.new(); title.position=Vector2(170,60); title.size=Vector2(940,70); title.text="ELEGÍ A UNO DE LOS CUATRO HERMANOS"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",32); menu_layer.add_child(title)
	var lore := Label.new(); lore.position=Vector2(220,132); lore.size=Vector2(840,60); lore.text="Ashley, Fermín, Isabella y Gael deben reunir poder sin perder el vínculo que mantiene estable a Xethkioz."; lore.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; lore.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; lore.add_theme_font_size_override("font_size",16); lore.add_theme_color_override("font_color",Color(0.70,0.69,0.76)); menu_layer.add_child(lore)
	for i in range(WorldData.HEROES.size()):
		var h: Dictionary = WorldData.hero(i)
		var b := Button.new(); b.position=Vector2(150+(i%2)*500,235+int(i/2)*150); b.size=Vector2(480,125)
		b.text="%s — %s\n%s\nQ %s  •  E %s  •  R %s" % [h["name"],h["class"],h["weapon"],h["skills"][0],h["skills"][1],h["skills"][2]]
		b.add_theme_font_size_override("font_size",14); b.pressed.connect(func(): _select_hero(i)); menu_layer.add_child(b)
	var pal := Label.new(); pal.position=Vector2(300,560); pal.size=Vector2(680,55); pal.text="PALADÍN — se desbloquea al derrotar a Xethkioz de Ensueño"; pal.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; pal.add_theme_font_size_override("font_size",17); pal.add_theme_color_override("font_color",Color(1.0,0.82,0.47)); menu_layer.add_child(pal)

func _select_hero(index: int) -> void:
	state["selected_hero"] = index
	SaveSystem.save_state(state)
	_start_level()

func _start_level() -> void:
	in_nigzen = false
	super._start_level()
	_story_intro_for_map()

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV3Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var w: Dictionary = state.get("weapon",{})
	var a: Dictionary = state.get("armor",{})
	var c: Dictionary = state.get("charm",{})
	player.setup(self,100.0+float(a.get("power",1.0))*2.0,float(w.get("power",1.0)),float(a.get("power",1.0)),float(c.get("power",1.0)))
	player.configure_hero(WorldData.hero(int(state.get("selected_hero",0))))
	player.died.connect(_on_player_died)

func _generate_level(map_no: int) -> void:
	super._generate_level(map_no)
	if map_no in [9,19,29] and not bool(state.get("nigzen_complete",false)):
		_spawn_pickup("nigzen_portal",Vector2(1720,390),{"secret":true})

func pickup_collected(node: Node,kind: String,payload: Dictionary) -> void:
	match kind:
		"nigzen_portal":
			node.queue_free(); _enter_nigzen()
		"rune":
			var order := int(payload.get("order",1))
			if order == nigzen_puzzle+1:
				nigzen_puzzle += 1; node.queue_free(); _toast("Runa %d/3 activada" % nigzen_puzzle,1.4)
				if nigzen_puzzle == 3:
					nigzen_wave_delay=1.0; _toast("PUZZLE RESUELTO — comienzan las diez hordas",3.0)
			else:
				_toast("Secuencia incorrecta. Buscá la siguiente runa correcta.",2.0)
		"legendary_weapon":
			state["legendary_weapon"]=true; state["nigzen_complete"]=true
			state["weapon"]={"name":"Filo del Horizonte de NigZen","power":18.0,"rarity":"Legendary"}
			node.queue_free(); _spawn_pickup("nigzen_exit",Vector2(2860,545)); SaveSystem.save_state(state)
			_toast("ARMA LEGENDARIA: Filo del Horizonte de NigZen",4.0)
		"nigzen_exit":
			node.queue_free(); _leave_nigzen()
		_:
			super.pickup_collected(node,kind,payload)

func boss_defeated(boss: Node,kind: int) -> void:
	var was_new: bool = current_map not in state.get("bosses",[])
	super.boss_defeated(boss,kind)
	if was_new and current_map in [5,10,15,20,25,30]:
		state["set_pieces"] = min(6,int(state.get("set_pieces",0))+1)
		SaveSystem.save_state(state)
		_toast("PIEZA DE CONJUNTO %d/3" % min(3,int(state["set_pieces"])),2.3)
		update_hud()

func _complete_map() -> void:
	if current_map >= 32:
		state["paladin_unlocked"] = true
		SaveSystem.save_state(state)
	super._complete_map()

func _objective_is_complete() -> bool:
	if current_map == 3:
		return map_crystals >= 4
	return super._objective_is_complete()

func _objective_text() -> String:
	if current_map == 3:
		return "OBJETIVO  Reuní 4 fragmentos para Xethkioz  (%d/4)" % min(4,map_crystals)
	if current_map == 5:
		return "OBJETIVO  Derrotá al Arconte de Ceniza"
	return super._objective_text()

func _objective_locked_text() -> String:
	if current_map == 3:
		return "Xethkioz necesita 4 fragmentos mágicos para abrir la puerta."
	return super._objective_locked_text()

func _show_intermission() -> void:
	super._show_intermission()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("CAMPAMENTO DE RIFT RUNNERS"):
			node.text="REFUGIO DE ELIDA\nElida cura las heridas y prepara el próximo camino\nPróximo: %02d — %s" % [current_map,WorldData.map_name(current_map)]
		elif node is Button and node.text.begins_with("REABASTECER"):
			node.text="CUIDADOS DE ELIDA\n+32 suministros"

func _show_demo_milestone() -> void:
	super._show_demo_milestone()
	for node in menu_layer.get_children():
		if node is Label and node.text == "CAPÍTULO DEMO COMPLETADO":
			node.text="PRIMER UMBRAL SUPERADO"
		elif node is Label and node.text.begins_with("Graveljaw cayó"):
			node.text="El Arconte de Ceniza cayó. Alexis advirtió que el poder de Xethkioz está conectado con algo que duerme muy por encima de Izrdralar.\n\nElida mantiene los refugios. El camino continúa hacia Desfralar y luego Xiomalar."

func _show_victory() -> void:
	state["paladin_unlocked"] = true; SaveSystem.save_state(state)
	super._show_victory()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("WILDBOUND COMPLETADO"):
			node.text="WORLD OF XETHKIOZ COMPLETADO\nXETHKIOZ DE ENSUEÑO HA CAÍDO"
		elif node is Label and node.text.begins_with("Jefes:"):
			node.text += "   •   PALADÍN DESBLOQUEADO"

func update_hud() -> void:
	super.update_hud()
	if not map_label: return
	if in_nigzen:
		map_label.text="BONUS • NIGZEN • RUNAS %d/3 • HORDA %d/10" % [nigzen_puzzle,nigzen_wave]
	else:
		map_label.text="%s • %02d/32 • %s" % [WorldData.region_for_map(current_map),current_map,WorldData.map_name(current_map)]
	var hero: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
	gear_label.text="%s • %s   |   SET %d/3   |   Q/E/R + F" % [hero["name"],hero["class"],min(3,int(state.get("set_pieces",0)))]
	var pi := int(state.get("active_pet",0))
	pet_label.text="LEGENDARIO: %s   • vínculo %.0f   • K/C habilidad" % [pet_defs[clamp(pi,0,pet_defs.size()-1)]["name"],float(state.get("pet_bond",1.0))]

func is_set_skill_unlocked() -> bool:
	return int(state.get("set_pieces",0)) >= 3

func skill_locked_feedback() -> void:
	_toast("HABILIDAD DE SET BLOQUEADA — reuní 3 piezas de conjunto.",2.4)

func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	var hero: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
	var skill_name := "Poder de Conjunto" if slot == 3 else str(hero["skills"][slot])
	var power := (18.0+slot*8.0)*multiplier
	match hero_class:
		"Bardo":
			if slot == 1:
				player.heal(14.0); supplies=min(float(state.get("max_supplies",100.0)),supplies+8.0)
			else: _damage_radius(pos,130.0+slot*45.0,power)
		"Guerrero":
			if slot == 1:
				player.invuln_timer=max(player.invuln_timer,1.1); player.heal(6.0)
			elif slot == 2:
				player.velocity.x=facing_dir*720.0; _damage_radius(pos+Vector2(facing_dir*65,0),115.0,power*1.25)
			else: _damage_radius(pos+Vector2(facing_dir*55,0),95.0+slot*30.0,power*1.2)
		"Arquero":
			if slot == 1:
				player.velocity.x=-facing_dir*420.0; player.invuln_timer=max(player.invuln_timer,0.45)
			else: _damage_cone(pos,facing_dir,300.0+slot*85.0,power*(1.0+slot*0.12))
		"Brujo del Caos":
			_damage_radius(pos+Vector2(facing_dir*80,0),145.0+slot*45.0,power*(1.1+slot*0.18))
			if slot >= 2: player.heal(5.0+slot*2.0)
	if slot == 3:
		_damage_radius(pos,330.0,power*1.6); screen_shake(9.0,0.22)
	_toast("%s — %s" % [hero_class,skill_name],1.4); update_hud()

func _damage_radius(pos: Vector2,radius: float,power: float) -> void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if is_instance_valid(e) and pos.distance_to(e.global_position) <= radius: e.take_damage(power)

func _damage_cone(pos: Vector2,facing_dir: int,reach: float,power: float) -> void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var d: Vector2 = e.global_position-pos
		if abs(d.y)<120.0 and d.x*facing_dir>0.0 and d.x*facing_dir<reach: e.take_damage(power)

func _story_intro_for_map() -> void:
	var hero: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
	var messages := {
		1:"Alexis: %s, no busquen poder por orgullo. Manténganse juntos. Xethkioz conoce el camino." % hero["name"],
		6:"Alexis: Izrdralar cambia cuando ustedes cambian. Miren los caminos altos.",
		12:"Alexis: Desfralar está debajo de todo lo que conocen. No confíen en cada espíritu.",
		18:"Alexis: algo está usando los recuerdos para dividirlos. Xethkioz también lo siente.",
		24:"Alexis: Xiomalar está cerca. Las entidades de arriba ya saben que vienen.",
		31:"Alexis: no peleen contra Xethkioz. Peleen por el Xethkioz que viajó con ustedes."
	}
	if messages.has(current_map): _toast(messages[current_map],5.5)

func graveljaw_charge_warning(origin: Vector2,direction: float,phase: int) -> void:
	_toast("ARCONTE CARGA — saltá o usá DASH  •  Fase %d" % phase,1.2)
	screen_shake(2.5,0.10)

func _enter_nigzen() -> void:
	nigzen_return_map=current_map; in_nigzen=true; nigzen_puzzle=0; nigzen_wave=0; nigzen_wave_delay=0.0; nigzen_reward_spawned=false
	if world: world.queue_free()
	world=Node2D.new(); world.name="NigZen"; add_child(world); move_child(world,0)
	var biome={"name":"NigZen","sky":Color(0.13,0.07,0.04),"ground":Color(0.55,0.33,0.18),"accent":Color(1.0,0.80,0.40)}
	_build_background(biome,99); _add_platform(Rect2(-100,GROUND_Y,3300,120),biome["ground"])
	for r in [Rect2(520,470,180,22),Rect2(1250,400,180,22),Rect2(2050,455,180,22)]: _add_platform(r,Color(biome["accent"],0.75))
	_spawn_player(); _spawn_pet_if_owned()
	_spawn_pickup("rune",Vector2(610,425),{"order":1}); _spawn_pickup("rune",Vector2(1340,355),{"order":2}); _spawn_pickup("rune",Vector2(2140,410),{"order":3})
	_toast("NIGZEN — runas 1 → 2 → 3. Después sobreviví a 10 hordas.",5.0); update_hud()

func _update_nigzen(delta: float) -> void:
	if not in_nigzen or nigzen_puzzle < 3 or nigzen_reward_spawned: return
	if get_tree().get_nodes_in_group("enemies").size() > 0: return
	if nigzen_wave >= 10:
		nigzen_reward_spawned=true; _spawn_pickup("legendary_weapon",Vector2(2500,520)); _toast("DIEZ HORDAS SUPERADAS — apareció la reliquia de NigZen",4.0); return
	nigzen_wave_delay -= delta
	if nigzen_wave_delay > 0.0: return
	nigzen_wave += 1
	for i in range(2+nigzen_wave):
		_spawn_enemy(Vector2(520.0+float(i%8)*290.0+rng.randf_range(-35.0,35.0),555),1.4+nigzen_wave*0.16,(i+nigzen_wave)%4)
	nigzen_wave_delay=1.1; _toast("NIGZEN — HORDA %d / 10" % nigzen_wave,1.8); update_hud()

func _leave_nigzen() -> void:
	in_nigzen=false; current_map=max(1,nigzen_return_map); state["current_map"]=current_map; SaveSystem.save_state(state); _start_level()
