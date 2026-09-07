extends "res://scripts/main_v4.gd"

const NPCActorScript = preload("res://scripts/npc_actor.gd")

var dialogue_layer: CanvasLayer
var dialogue_name_label: Label
var dialogue_meta_label: Label
var dialogue_body_label: Label
var dialogue_timer := 0.0

func _process(delta: float) -> void:
	super._process(delta)
	if dialogue_timer > 0.0:
		dialogue_timer -= delta
		if dialogue_timer <= 0.0 and dialogue_layer:
			dialogue_layer.visible = false

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.3.1 GDD MERGE"):
			node.text = "v0.4 FAMILY BUILD • 4 hermanos • mentorías • encuentros narrativos • 32 mapas"

func _generate_level(map_no: int) -> void:
	super._generate_level(map_no)
	_spawn_family_encounters(map_no)

func _spawn_family_encounters(map_no: int) -> void:
	match map_no:
		1:
			_spawn_story_npc("Alexis",Vector2(300,555),"La Fisura Prismática cambió todo, pero todavía podemos elegir qué hacemos con ese poder.")
			_spawn_story_npc("Ashley",Vector2(920,410),"Escuchá Izrdralar. Hasta el bosque tiene ritmo. Si aprendés a sentirlo, después puedo enseñarte a usarlo en combate.")
		2:
			_spawn_story_npc("Fermín",Vector2(900,555),"No todo se resuelve corriendo. A veces hay que aguantar el golpe, romper la defensa y recién entonces avanzar.")
		3:
			_spawn_story_npc("Gael",Vector2(1380,325),"Desde arriba se ven rutas que desde el suelo parecen imposibles. No dispares primero: mirá primero.")
			_spawn_story_npc("Elida",Vector2(1080,395),"Hay heridas que una ración cura y otras que necesitan descanso. Mis refugios siempre van a estar abiertos para ustedes.")
		4:
			_spawn_story_npc("Isabella",Vector2(1540,315),"La magia del caos no significa perder el control. Significa aprender a dirigir algo que nunca va a obedecer del todo.")
		5:
			_spawn_story_npc("Ashley",Vector2(360,555),"Cuando caiga el Arconte, vas a tener que elegir una senda. No elijas por fuerza: elegí por cómo querés pelear.")
			_spawn_story_npc("Fermín",Vector2(700,555),"Si elegís mi mentoría, vas a aprender a entrar primero y seguir de pie cuando todos los demás retrocedan.")
			_spawn_story_npc("Gael",Vector2(1040,375),"La distancia también es una herramienta. Un buen arquero controla dónde empieza la pelea.")
			_spawn_story_npc("Isabella",Vector2(1420,555),"El caos castiga los errores, pero también abre posibilidades que las otras sendas no tienen.")
			_spawn_story_npc("Alexis",Vector2(1850,420),"Los cuatro son distintos. Eso es justamente lo que los mantiene vivos. Después del Arconte, la decisión es tuya.")

func _spawn_story_npc(character_name: String,pos: Vector2,line: String) -> void:
	if not world:
		return
	var actor := Node2D.new()
	actor.set_script(NPCActorScript)
	world.add_child(actor)
	actor.position = pos
	actor.setup(self,WorldData.family_profile(character_name),line)

func show_family_dialogue(speaker: String,text: String,relationship: String,gender: String) -> void:
	_ensure_dialogue_ui()
	dialogue_layer.visible = true
	dialogue_name_label.text = speaker
	dialogue_meta_label.text = "%s • %s" % [relationship,gender]
	dialogue_body_label.text = text
	dialogue_timer = 5.2

func _ensure_dialogue_ui() -> void:
	if dialogue_layer:
		return
	dialogue_layer = CanvasLayer.new()
	dialogue_layer.layer = 70
	add_child(dialogue_layer)
	var shadow := ColorRect.new()
	shadow.position = Vector2(135,520)
	shadow.size = Vector2(1010,155)
	shadow.color = Color(0.015,0.012,0.028,0.94)
	dialogue_layer.add_child(shadow)
	var accent := ColorRect.new()
	accent.position = Vector2(135,520)
	accent.size = Vector2(8,155)
	accent.color = Color(0.66,0.35,0.95)
	dialogue_layer.add_child(accent)
	dialogue_name_label = Label.new()
	dialogue_name_label.position = Vector2(170,536)
	dialogue_name_label.size = Vector2(280,34)
	dialogue_name_label.add_theme_font_size_override("font_size",22)
	dialogue_name_label.add_theme_color_override("font_color",Color(1.0,0.72,0.34))
	dialogue_layer.add_child(dialogue_name_label)
	dialogue_meta_label = Label.new()
	dialogue_meta_label.position = Vector2(455,540)
	dialogue_meta_label.size = Vector2(520,28)
	dialogue_meta_label.add_theme_font_size_override("font_size",14)
	dialogue_meta_label.add_theme_color_override("font_color",Color(0.62,0.63,0.70))
	dialogue_layer.add_child(dialogue_meta_label)
	dialogue_body_label = Label.new()
	dialogue_body_label.position = Vector2(170,576)
	dialogue_body_label.size = Vector2(925,76)
	dialogue_body_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	dialogue_body_label.add_theme_font_size_override("font_size",17)
	dialogue_body_label.add_theme_color_override("font_color",Color(0.94,0.94,0.97))
	dialogue_layer.add_child(dialogue_body_label)

func _show_mentor_select() -> void:
	super._show_mentor_select()
	for profile in WorldData.HEROES:
		for node in menu_layer.get_children():
			if node is Button and node.text.begins_with(str(profile["name"])+" —"):
				var relation := str(profile.get("relationship","Hermano"))
				var gender := str(profile.get("gender",""))
				node.text = "%s %s • %s\n%s" % [relation,str(profile["name"]),gender,node.text]

func update_hud() -> void:
	super.update_hud()
	if bool(state.get("mentor_chosen",false)):
		var mentor: Dictionary = WorldData.hero(int(state.get("selected_hero",0)))
		var mentor_word := "Mentora" if str(mentor.get("gender","Masculino")) == "Femenino" else "Mentor"
		gear_label.text = "%s • %s %s / %s   |   SET %d/4   |   Q/E/R + F" % [str(state.get("player_name","Viajero")),mentor_word,str(mentor["name"]),str(mentor["class"]),min(4,int(state.get("set_pieces",0)))]
