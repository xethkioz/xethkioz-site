extends "res://scripts/main_v3.gd"

const PlayerV4Script = preload("res://scripts/player_v4.gd")

var pending_palette := 0
var character_name_input: LineEdit
var palette_status_label: Label

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.3 CANON"):
			node.text = "v0.3.1 GDD MERGE • Argentina 2150 • mentorías • 8 biomas • NigZen secreto"

func _new_game() -> void:
	state = SaveSystem.reset()
	_ensure_v3_state()
	state["mentor_chosen"] = false
	state["selected_hero"] = -1
	state["set_pieces"] = 0
	state["parenting_points"] = 0
	state["alexis_marks"] = []
	current_map = 1
	supplies = 100.0
	SaveSystem.save_state(state)
	_show_character_setup()

func _continue_game() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state()
	current_map = int(state.get("current_map",1))
	supplies = float(state.get("supplies",100.0))
	if current_map > 5 and not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
	else:
		_start_level()

func _ensure_v3_state() -> void:
	var had_mentor_key := state.has("mentor_chosen")
	var previous_selection := int(state.get("selected_hero",0))
	super._ensure_v3_state()
	if not had_mentor_key:
		state["mentor_chosen"] = int(state.get("current_map",1)) > 5
		state["selected_hero"] = previous_selection if bool(state["mentor_chosen"]) else -1
	if not state.has("player_name"): state["player_name"] = "Viajero"
	if not state.has("player_palette"): state["player_palette"] = 0
	if not state.has("parenting_points"): state["parenting_points"] = 0
	if not state.has("alexis_marks"): state["alexis_marks"] = []
	if not state.has("necromancer_path"): state["necromancer_path"] = false
	SaveSystem.save_state(state)

func _show_character_setup() -> void:
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer = 108; add_child(menu_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.032,0.028,0.06); menu_layer.add_child(bg)
	var title := Label.new(); title.position=Vector2(170,70); title.size=Vector2(940,70); title.text="CREÁ TU VIAJERO"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",36); title.add_theme_color_override("font_color",Color(0.68,0.42,1.0)); menu_layer.add_child(title)
	var lore := Label.new(); lore.position=Vector2(220,145); lore.size=Vector2(840,70); lore.text="Argentina, año 2150. La Fisura Prismática abrió Izrdralar. Tu viajero acompañará a los cuatro hermanos y elegirá una mentoría después del primer gran jefe."; lore.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; lore.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; lore.add_theme_font_size_override("font_size",16); menu_layer.add_child(lore)
	var name_label := Label.new(); name_label.position=Vector2(320,245); name_label.size=Vector2(180,36); name_label.text="Nombre:"; name_label.add_theme_font_size_override("font_size",18); menu_layer.add_child(name_label)
	character_name_input = LineEdit.new(); character_name_input.position=Vector2(480,238); character_name_input.size=Vector2(470,46); character_name_input.placeholder_text="Viajero"; character_name_input.text=str(state.get("player_name","Viajero")); character_name_input.max_length=20; menu_layer.add_child(character_name_input)
	palette_status_label = Label.new(); palette_status_label.position=Vector2(320,315); palette_status_label.size=Vector2(640,35); palette_status_label.text="Paleta: Violeta Prismática"; palette_status_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; palette_status_label.add_theme_font_size_override("font_size",17); menu_layer.add_child(palette_status_label)
	var palette_names := ["VIOLETA PRISMÁTICA","COBRE PAMPEANO","TURQUESA ANCESTRAL","ORO CELESTE"]
	for i in range(4):
		var b := Button.new(); b.position=Vector2(220+i*215,375); b.size=Vector2(195,70); b.text=palette_names[i]; b.add_theme_font_size_override("font_size",13); b.pressed.connect(func(): _choose_palette(i,palette_names[i])); menu_layer.add_child(b)
	var start := Button.new(); start.position=Vector2(440,510); start.size=Vector2(400,58); start.text="ENTRAR A IZRD RALAR".replace("IZRD RALAR","IZRDRALAR"); start.add_theme_font_size_override("font_size",18); start.pressed.connect(_finish_character_setup); menu_layer.add_child(start)
	var note := Label.new(); note.position=Vector2(260,595); note.size=Vector2(760,55); note.text="Editor base v0.3.1. Rostros, peinados, ropa y paletas avanzadas se incorporan en la capa visual."; note.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; note.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; note.add_theme_font_size_override("font_size",14); note.add_theme_color_override("font_color",Color(0.58,0.58,0.64)); menu_layer.add_child(note)

func _choose_palette(index: int,label_text: String) -> void:
	pending_palette = clamp(index,0,3)
	if palette_status_label:
		palette_status_label.text = "Paleta: %s" % label_text.capitalize()

func _finish_character_setup() -> void:
	var chosen_name := character_name_input.text.strip_edges() if character_name_input else "Viajero"
	if chosen_name.is_empty(): chosen_name = "Viajero"
	state["player_name"] = chosen_name
	state["player_palette"] = pending_palette
	SaveSystem.save_state(state)
	_start_level()

func _show_mentor_select() -> void:
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new(); menu_layer.layer=112; add_child(menu_layer)
	var bg := ColorRect.new(); bg.position=Vector2.ZERO; bg.size=Vector2(1280,720); bg.color=Color(0.035,0.03,0.07); menu_layer.add_child(bg)
	var title := Label.new(); title.position=Vector2(170,48); title.size=Vector2(940,80); title.text="EL PRIMER UMBRAL CAYÓ — ELEGÍ TU MENTOR"; title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; title.add_theme_font_size_override("font_size",31); title.add_theme_color_override("font_color",Color(1.0,0.72,0.34)); menu_layer.add_child(title)
	var lore := Label.new(); lore.position=Vector2(220,125); lore.size=Vector2(840,68); lore.text="Los cuatro hermanos comparten su poder con vos. La mentoría define tu senda de combate; el equipo seguirá modificando tus tres habilidades y la definitiva del conjunto."; lore.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; lore.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; lore.add_theme_font_size_override("font_size",16); menu_layer.add_child(lore)
	for i in range(WorldData.HEROES.size()):
		var h: Dictionary = WorldData.hero(i)
		var b := Button.new(); b.position=Vector2(145+(i%2)*505,225+int(i/2)*155); b.size=Vector2(490,132)
		b.text="%s — %s\n%s\n%s\nQ %s • E %s • R %s" % [h["name"],h["class"],h["role"],h["weapon"],h["skills"][0],h["skills"][1],h["skills"][2]]
		b.add_theme_font_size_override("font_size",13); b.pressed.connect(func(): _select_mentor(i)); menu_layer.add_child(b)
	var pal := Label.new(); pal.position=Vector2(260,565); pal.size=Vector2(760,58); pal.text="PALADÍN: desbloqueo garantizado al completar la campaña. La Senda Oscura queda reservada como contenido opcional de NG+."; pal.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER; pal.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART; pal.add_theme_font_size_override("font_size",15); pal.add_theme_color_override("font_color",Color(0.78,0.65,1.0)); menu_layer.add_child(pal)

func _select_mentor(index: int) -> void:
	state["selected_hero"] = index
	state["mentor_chosen"] = true
	SaveSystem.save_state(state)
	_start_level()

func _show_demo_milestone() -> void:
	if not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
	else:
		super._show_demo_milestone()

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV4Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var w: Dictionary = state.get("weapon",{})
	var a: Dictionary = state.get("armor",{})
	var c: Dictionary = state.get("charm",{})
	var pp := int(state.get("parenting_points",0))
	player.setup(self,100.0+float(a.get("power",1.0))*2.0+pp*2.0,float(w.get("power",1.0))+pp*0.12,float(a.get("power",1.0)),float(c.get("power",1.0)))
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.died.connect(_on_player_died)

func pickup_collected(node: Node,kind: String,payload: Dictionary) -> void:
	if kind == "legendary_weapon":
		state["legendary_weapon"] = true
		state["nigzen_complete"] = true
		state["weapon"] = {"name":"Cazadora de Sombras","power":18.0,"rarity":"Legendary"}
		node.queue_free()
		_spawn_pickup("nigzen_exit",Vector2(2860,545))
		SaveSystem.save_state(state)
		_toast("ARMA LEGENDARIA: CAZADORA DE SOMBRAS",4.0)
		return
	super.pickup_collected(node,kind,payload)

func boss_defeated(boss: Node,kind: int) -> void:
	var was_new := current_map not in state.get("bosses",[])
	super.boss_defeated(boss,kind)
	if was_new and current_map in [5,10,15,20,25,30]:
		_toast("PIEZA DE CONJUNTO %d/4 — Casco • Pecho • Guantes • Botas" % min(4,int(state.get("set_pieces",0))),2.8)
		update_hud()

func is_set_skill_unlocked() -> bool:
	return int(state.get("set_pieces",0)) >= 4

func skill_locked_feedback() -> void:
	_toast("HABILIDAD DE SET BLOQUEADA — necesitás las 4 piezas del conjunto.",2.5)

func mentor_locked_feedback() -> void:
	_toast("Las habilidades de clase se desbloquean al elegir mentor después del Mapa 5.",2.6)

func use_hero_skill(slot: int,pos: Vector2,facing_dir: int,multiplier: float,hero_class: String) -> void:
	if not bool(state.get("mentor_chosen",false)):
		mentor_locked_feedback()
		return
	super.use_hero_skill(slot,pos,facing_dir,multiplier,hero_class)

func update_hud() -> void:
	super.update_hud()
	if not map_label: return
	if not in_nigzen:
		map_label.text="%s • %s • %02d/32 • %s" % [WorldData.region_for_map(current_map),WorldData.biome_for_map(current_map),current_map,WorldData.map_name(current_map)]
	var player_name := str(state.get("player_name","Viajero"))
	if bool(state.get("mentor_chosen",false)):
		var mentor: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
		gear_label.text="%s • Mentor %s / %s   |   SET %d/4   |   Q/E/R + F" % [player_name,mentor["name"],mentor["class"],min(4,int(state.get("set_pieces",0)))]
	else:
		gear_label.text="%s • Aprendiz Prismático   |   Mentor tras Mapa 5   |   SET %d/4" % [player_name,min(4,int(state.get("set_pieces",0)))]
	crystal_label.text="CRISTALES %d   •   PUNTOS DE PATERNIDAD %d" % [int(state.get("crystals",0)),int(state.get("parenting_points",0))]

func _story_intro_for_map() -> void:
	var traveler := str(state.get("player_name","Viajero"))
	var messages := {
		1:"Alexis: %s, la Fisura Prismática cambió la Pampa. Xethkioz conoce senderos que nosotros no podemos ver." % traveler,
		4:"Elida: no todo lo mágico cura. Volvé a mis refugios cuando las heridas pesen más que el orgullo.",
		6:"Alexis: las ruinas son de nuestro mundo, pero Izrdralar aprendió a crecer encima de ellas.",
		9:"Chamán Nahuel: las ocho criaturas legendarias no se capturan. Primero hay que ganarse su confianza.",
		12:"Alexis: Desfralar está vivo. Escuchá el micelio antes de elegir por dónde bajar.",
		18:"Anahí de Cristal: algunas paredes no existen. NigZen aparece ante quien aprende a mirar entre los glifos.",
		24:"Alexis: Xiomalar ya sabe que venís. Las entidades celestes observan cada decisión.",
		27:"Don Argento: hasta en el cielo alguien necesita suministros. Los cristales siguen hablando el mismo idioma.",
		31:"Alexis: cuando Xethkioz cambie, recordá todo lo que hizo para protegerte. Peleá por él, no contra él."
	}
	if messages.has(current_map):
		_toast(messages[current_map],5.8)
	if current_map in [1,6,12,18,24,31]:
		var marks: Array = state.get("alexis_marks",[])
		if current_map not in marks:
			marks.append(current_map)
			state["alexis_marks"] = marks
			state["parenting_points"] = int(state.get("parenting_points",0))+1
			SaveSystem.save_state(state)
