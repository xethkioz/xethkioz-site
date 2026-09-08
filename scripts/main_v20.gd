extends "res://scripts/main_v19.gd"

# World of Xethkioz — Golden Slice Production v0.10.0
# Production flow for Portada -> Creator -> Intro -> Node 1 and the canonical
# post-Boss-5 mentor/refuge/double-jump sequence.

const PlayerV10Script = preload("res://scripts/player_v10.gd")

var intro_step_v20 := 0
var intro_title_v20: Label
var intro_body_v20: Label
var intro_button_v20: Button

func _ready() -> void:
	super._ready()
	_ensure_production_state_v20()

func _ensure_production_state_v20() -> void:
	if not state.has("intro_seen"): state["intro_seen"] = false
	if not state.has("double_jump_unlocked"): state["double_jump_unlocked"] = false
	if not state.has("refuges_unlocked"): state["refuges_unlocked"] = []
	SaveSystem.save_state(state)

# -----------------------------------------------------------------------------
# PLAYER
func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV10Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var weapon: Dictionary = state.get("weapon",{})
	var armor: Dictionary = state.get("armor",{})
	var charm: Dictionary = state.get("charm",{})
	var parenting_points := int(state.get("parenting_points",0))
	player.setup(
		self,
		100.0+float(armor.get("power",1.0))*2.0+parenting_points*2.0,
		float(weapon.get("power",1.0))+parenting_points*0.12,
		float(armor.get("power",1.0)),
		float(charm.get("power",1.0))
	)
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático")))
	player.died.connect(_on_player_died)

# -----------------------------------------------------------------------------
# TITLE / CREATOR / INTRO
func _show_title() -> void:
	super._show_title()
	# Production menu never exposes prototype/build text to the player.
	if menu_layer:
		for node in menu_layer.get_children():
			if node is Label:
				var txt := (node as Label).text
				if "v0." in txt or "GOLDEN SLICE" in txt or "DEMO 1" in txt:
					(node as Label).visible = false

func _finish_character_setup() -> void:
	var chosen_name:String = character_name_input.text.strip_edges() if character_name_input else "Viajero"
	if chosen_name.is_empty(): chosen_name = "Viajero"
	state["player_name"] = chosen_name
	state["player_gender"] = pending_gender
	state["player_palette"] = pending_palette
	state["creator_body"] = creator_pending["body"]
	state["creator_face"] = creator_pending["face"]
	state["creator_hair"] = creator_pending["hair"]
	state["creator_hair_color"] = creator_pending["hair_color"]
	state["creator_skin"] = creator_pending["skin"]
	state["creator_clothes"] = creator_pending["clothes"]
	state["current_map"] = 1
	state["current_node"] = 1
	state["intro_seen"] = false
	state["double_jump_unlocked"] = false
	current_map = 1
	SaveSystem.save_state(state)
	_show_intro_v20()

func _show_intro_v20() -> void:
	intro_step_v20 = 0
	if hud_layer: hud_layer.visible = false
	if menu_layer: menu_layer.queue_free()
	menu_layer = CanvasLayer.new()
	menu_layer.layer = 115
	add_child(menu_layer)
	_full_screen_texture(menu_layer,BG_IZRDRALAR,Color(0.78,0.84,0.94))
	var shade := ColorRect.new()
	shade.position = Vector2.ZERO
	shade.size = Vector2(1280,720)
	shade.color = Color(0.004,0.008,0.024,0.50)
	menu_layer.add_child(shade)

	var panel := Panel.new()
	panel.position = Vector2(115,390)
	panel.size = Vector2(1050,245)
	panel.add_theme_stylebox_override("panel",_panel_style(Color(0.006,0.010,0.030,0.94),Color(0.45,0.29,0.72,0.96),2))
	menu_layer.add_child(panel)

	intro_title_v20 = _vlabel(panel,Vector2(34,25),Vector2(730,40),"",23,Color(0.96,0.89,1.0))
	intro_body_v20 = _vlabel(panel,Vector2(34,78),Vector2(735,112),"",15,Color(0.90,0.91,0.97))
	intro_body_v20.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	intro_button_v20 = Button.new()
	intro_button_v20.position = Vector2(815,145)
	intro_button_v20.size = Vector2(190,48)
	intro_button_v20.text = "CONTINUAR"
	_style_button(intro_button_v20)
	intro_button_v20.pressed.connect(_advance_intro_v20)
	panel.add_child(intro_button_v20)
	_refresh_intro_v20()

func _refresh_intro_v20() -> void:
	var titles := [
		"ARGENTINA • AÑO 2150",
		"LA FISURA PRISMÁTICA",
		"IZRDRALAR TE ESPERA"
	]
	var bodies := [
		"El mundo que conocíamos sigue ahí, enterrado bajo ruinas, raíces y recuerdos. Pero algo abrió una frontera que nunca debió existir.",
		"La Fisura mezcló el mundo físico con planos espirituales y fuerzas antiguas. El tiempo se quebró. Los cuatro hermanos quedaron atrapados dentro de ese colapso.",
		"Ahora vos sos el Viajero. Xethkioz va a acompañarte. Alexis y su familia todavía siguen acá. El primer paso es descubrir qué queda de Izrdralar."
	]
	intro_title_v20.text = titles[clampi(intro_step_v20,0,2)]
	intro_body_v20.text = bodies[clampi(intro_step_v20,0,2)]
	intro_button_v20.text = "ENTRAR A IZRDRALAR" if intro_step_v20 == 2 else "CONTINUAR"

func _advance_intro_v20() -> void:
	if intro_step_v20 < 2:
		intro_step_v20 += 1
		_refresh_intro_v20()
		return
	state["intro_seen"] = true
	SaveSystem.save_state(state)
	if menu_layer:
		menu_layer.queue_free()
		menu_layer = null
	_start_level()

# Continue resumes gameplay/world state; a brand-new save created by the creator
# always sees the intro exactly once.
func _continue_game() -> void:
	state = SaveSystem.load_state()
	_ensure_v3_state()
	_ensure_demo_state()
	_ensure_production_state_v20()
	current_map = clampi(int(state.get("current_map",1)),1,15)
	supplies = float(state.get("supplies",100.0))
	if not bool(state.get("intro_seen",false)) and current_map == 1:
		_show_intro_v20()
	else:
		_show_overworld()

# -----------------------------------------------------------------------------
# BOSS 5 -> MENTOR -> REFUGE -> ALEXIS TRAVERSAL UNLOCK -> NODE 6
func _select_mentor(index: int) -> void:
	state["selected_hero"] = index
	state["mentor_chosen"] = true
	var refuges: Array = state.get("refuges_unlocked",[])
	if 5 not in refuges: refuges.append(5)
	state["refuges_unlocked"] = refuges
	SaveSystem.save_state(state)
	# Canon: the first mentor choice flows into Elida's refuge instead of
	# returning directly to the overworld.
	transition_finished_map = 5
	transition_next_map = 6
	_show_elida_refuge_v16()

func _show_elida_refuge_v16() -> void:
	super._show_elida_refuge_v16()
	if transition_finished_map != 5 or bool(state.get("double_jump_unlocked",false)):
		return
	# Alexis' traversal lesson is an explicit refuge interaction, not a hidden
	# state mutation. It must be learned before continuing to Node 6.
	var lesson := Panel.new()
	lesson.position = Vector2(155,520)
	lesson.size = Vector2(650,142)
	lesson.add_theme_stylebox_override("panel",_panel_style(Color(0.010,0.014,0.035,0.97),Color(0.38,0.66,0.90,0.96),2))
	menu_layer.add_child(lesson)
	var copy := _vlabel(lesson,Vector2(18,12),Vector2(610,54),"ALEXIS • ENTRENAMIENTO\nLa Fisura puede impulsarte una segunda vez en el aire. Aprendé a controlarla antes de bajar a las rutas nuevas.",12,Color(0.90,0.94,1.0))
	copy.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var learn := Button.new()
	learn.position = Vector2(178,84)
	learn.size = Vector2(295,38)
	learn.text = "APRENDER IMPULSO PRISMÁTICO"
	learn.add_theme_font_size_override("font_size",10)
	_style_button(learn)
	learn.pressed.connect(_unlock_double_jump_v20.bind(lesson))
	lesson.add_child(learn)

func _unlock_double_jump_v20(panel: Control) -> void:
	if bool(state.get("double_jump_unlocked",false)):
		return
	state["double_jump_unlocked"] = true
	SaveSystem.save_state(state)
	_toast("IMPULSO PRISMÁTICO DESBLOQUEADO • doble salto disponible desde el Nodo 6.",3.2)
	if panel and is_instance_valid(panel):
		panel.queue_free()

func _refuge_continue_v16() -> void:
	if transition_finished_map == 5 and not bool(state.get("mentor_chosen",false)):
		_show_mentor_select()
		return
	if transition_finished_map == 5 and not bool(state.get("double_jump_unlocked",false)):
		_toast("Antes de continuar, hablá con Alexis y aprendé Impulso Prismático.",3.0)
		return
	_show_overworld()

func update_hud() -> void:
	super.update_hud()
	if objective_label and current_map >= 6 and bool(state.get("double_jump_unlocked",false)):
		objective_label.text += " • DOBLE SALTO ACTIVO"
