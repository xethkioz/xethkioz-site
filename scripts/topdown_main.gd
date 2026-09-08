extends Node2D

const PlayerScript = preload("res://scripts/topdown_player.gd")
const EnemyScript = preload("res://scripts/topdown_enemy.gd")
const WORLD_TEX = preload("res://assets/topdown/generated/izrdalar_node1_topdown.png")

var ui: CanvasLayer
var world: Node2D
var player: CharacterBody2D
var hp_label: Label
var resource_label: Label
var objective_label: Label
var toast_label: Label
var crystals := 0
var food := 0
var kills := 0
var talked_alexis := false
var shrine_reached := false
var player_name := "Viajero"
var player_gender := "male"
var selected_mentor := -1
var creator_name: LineEdit
var creator_preview: TextureRect
var save_path := "user://world_of_xethkioz_topdown_save.json"

func _ready() -> void:
	_ensure_inputs()
	_show_title()

func _ensure_inputs() -> void:
	var actions := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"attack": [KEY_J],
		"dash": [KEY_SHIFT],
		"interact": [KEY_C],
		"skill_q": [KEY_Q],
		"skill_e": [KEY_E],
		"skill_r": [KEY_R],
		"skill_f": [KEY_F]
	}
	for action in actions.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		for keycode in actions[action]:
			var ev := InputEventKey.new()
			ev.physical_keycode = keycode
			InputMap.action_add_event(action, ev)

func _clear_all() -> void:
	if world:
		world.queue_free()
		world = null
	if ui:
		ui.queue_free()
		ui = null
	player = null
	toast_label = null

func _label(parent: Node, pos: Vector2, size: Vector2, text: String, fs := 14, color := Color.WHITE) -> Label:
	var l := Label.new()
	l.position = pos
	l.size = size
	l.text = text
	l.add_theme_font_size_override("font_size", fs)
	l.add_theme_color_override("font_color", color)
	l.add_theme_color_override("font_shadow_color", Color(0,0,0,0.9))
	l.add_theme_constant_override("shadow_offset_x", 1)
	l.add_theme_constant_override("shadow_offset_y", 1)
	parent.add_child(l)
	return l

func _button(parent: Node, pos: Vector2, size: Vector2, text: String) -> Button:
	var b := Button.new()
	b.position = pos
	b.size = size
	b.text = text
	b.add_theme_font_size_override("font_size", 13)
	parent.add_child(b)
	return b

func _show_title() -> void:
	_clear_all()
	ui = CanvasLayer.new()
	ui.layer = 100
	add_child(ui)
	var bg := ColorRect.new()
	bg.position = Vector2.ZERO
	bg.size = Vector2(640,360)
	bg.color = Color("101a32")
	ui.add_child(bg)
	var art := TextureRect.new()
	art.position = Vector2.ZERO
	art.size = Vector2(640,360)
	art.texture = WORLD_TEX
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.modulate = Color(0.55,0.62,0.75,0.70)
	ui.add_child(art)
	var shade := ColorRect.new()
	shade.position = Vector2.ZERO
	shade.size = Vector2(640,360)
	shade.color = Color(0.01,0.02,0.05,0.35)
	ui.add_child(shade)
	var title := _label(ui, Vector2(28,32), Vector2(360,56), "WORLD OF XETHKIOZ", 30, Color("d98cff"))
	title.add_theme_color_override("font_outline_color", Color("101020"))
	title.add_theme_constant_override("outline_size", 4)
	_label(ui, Vector2(31,85), Vector2(320,24), "ARGENTINA 2150 - LA FISURA PRISMATICA", 11, Color("ff9b4a"))
	var new_game := _button(ui, Vector2(34,142), Vector2(170,38), "NUEVA PARTIDA")
	new_game.pressed.connect(_show_creator)
	var continue_button := _button(ui, Vector2(34,188), Vector2(170,38), "CONTINUAR")
	continue_button.disabled = not FileAccess.file_exists(save_path)
	continue_button.pressed.connect(_continue_game)
	var options := _button(ui, Vector2(34,234), Vector2(170,38), "OPCIONES")
	options.pressed.connect(_show_options_stub)
	_label(ui, Vector2(380,300), Vector2(230,40), "PIVOT TOP-DOWN - build tecnica\nArte final aun no integrado", 10, Color(0.85,0.87,0.94))

func _show_options_stub() -> void:
	_toast_menu("Opciones completas se integran en la siguiente pasada.")

func _toast_menu(text: String) -> void:
	if toast_label and is_instance_valid(toast_label):
		toast_label.queue_free()
	toast_label = _label(ui, Vector2(220,315), Vector2(390,30), text, 10, Color("ffd090"))

func _show_creator() -> void:
	_clear_all()
	ui = CanvasLayer.new()
	ui.layer = 100
	add_child(ui)
	var bg := ColorRect.new()
	bg.position = Vector2.ZERO
	bg.size = Vector2(640,360)
	bg.color = Color("0c142c")
	ui.add_child(bg)
	_label(ui, Vector2(32,24), Vector2(560,36), "CREA TU VIAJERO", 25, Color("d98cff"))
	_label(ui, Vector2(32,58), Vector2(560,24), "Un unico protagonista. Las mentorias cambian tu estilo de combate.", 11, Color(0.86,0.89,0.95))
	creator_preview = TextureRect.new()
	creator_preview.position = Vector2(70,108)
	creator_preview.size = Vector2(128,170)
	creator_preview.texture = load("res://assets/topdown/generated/traveler_male.png")
	creator_preview.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	creator_preview.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	ui.add_child(creator_preview)
	_label(ui, Vector2(250,100), Vector2(120,24), "CUERPO", 12, Color("ff9b4a"))
	var male := _button(ui, Vector2(250,130), Vector2(125,36), "MASCULINO")
	male.pressed.connect(_set_creator_gender.bind("male"))
	var female := _button(ui, Vector2(385,130), Vector2(125,36), "FEMENINO")
	female.pressed.connect(_set_creator_gender.bind("female"))
	_label(ui, Vector2(250,185), Vector2(120,24), "NOMBRE", 12, Color("ff9b4a"))
	creator_name = LineEdit.new()
	creator_name.position = Vector2(250,215)
	creator_name.size = Vector2(260,34)
	creator_name.text = "Viajero"
	creator_name.max_length = 18
	ui.add_child(creator_name)
	var note := _label(ui, Vector2(250,260), Vector2(300,42), "Rostro, cabello, piel, ropa y paleta siguen en el diseño final. Este pivot valida primero camara, exploracion y combate top-down.", 9, Color(0.75,0.79,0.88))
	note.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	var start := _button(ui, Vector2(355,310), Vector2(190,36), "ENTRAR A IZRDRALAR")
	start.pressed.connect(_confirm_creator)
	var back := _button(ui, Vector2(95,310), Vector2(120,36), "VOLVER")
	back.pressed.connect(_show_title)

func _set_creator_gender(gender: String) -> void:
	player_gender = gender
	if not creator_preview:
		return
	var path := "res://assets/topdown/generated/traveler_female.png" if gender == "female" else "res://assets/topdown/generated/traveler_male.png"
	creator_preview.texture = load(path)

func _confirm_creator() -> void:
	player_name = creator_name.text.strip_edges() if creator_name else "Viajero"
	if player_name.is_empty():
		player_name = "Viajero"
	_save_game(1)
	_start_node1()

func _continue_game() -> void:
	var f := FileAccess.open(save_path, FileAccess.READ)
	if not f:
		_show_title()
		return
	var parsed = JSON.parse_string(f.get_as_text())
	if parsed is Dictionary:
		player_name = str(parsed.get("player_name","Viajero"))
		player_gender = str(parsed.get("player_gender","male"))
		selected_mentor = int(parsed.get("mentor",-1))
		crystals = int(parsed.get("crystals",0))
		food = int(parsed.get("food",0))
	_start_node1()

func _save_game(node: int) -> void:
	var data := {
		"save_version": 1,
		"mode": "topdown_openworld",
		"current_node": node,
		"player_name": player_name,
		"player_gender": player_gender,
		"mentor": selected_mentor,
		"crystals": crystals,
		"food": food
	}
	var f := FileAccess.open(save_path, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))

func _start_node1() -> void:
	_clear_all()
	world = Node2D.new()
	world.name = "IzrdralarNode1"
	add_child(world)
	var bg := Sprite2D.new()
	bg.texture = WORLD_TEX
	bg.centered = false
	bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	bg.z_index = -100
	world.add_child(bg)
	_add_boundaries()
	_add_river_collision()
	_add_ruin_collision(Rect2(330,240,110,85))
	_add_ruin_collision(Rect2(930,500,120,120))
	_add_ruin_collision(Rect2(1600,260,130,110))
	player = CharacterBody2D.new()
	player.set_script(PlayerScript)
	world.add_child(player)
	player.global_position = Vector2(280,690)
	player.setup(player_gender)
	player.attack_requested.connect(_player_attack)
	player.skill_requested.connect(_player_skill)
	player.interact_requested.connect(_player_interact)
	_spawn_npc("Alexis","alexis",Vector2(470,690))
	_spawn_npc("Ashley","ashley",Vector2(610,735))
	var enemies := [
		[0,Vector2(720,520)], [0,Vector2(820,455)], [1,Vector2(1530,760)],
		[2,Vector2(1690,920)], [0,Vector2(720,1080)], [1,Vector2(390,1060)]
	]
	for info in enemies:
		_spawn_enemy(int(info[0]), info[1])
	_spawn_pickup(Vector2(720,315))
	_spawn_pickup(Vector2(1660,460))
	_spawn_pickup(Vector2(1740,1130))
	_setup_hud()
	_update_hud()
	_toast("NODO 1 - RUINAS DEL ALBA. Explora en cualquier orden.")

func _add_boundaries() -> void:
	var bounds := [
		Rect2(-20,-20,2088,20), Rect2(-20,1400,2088,20),
		Rect2(-20,0,20,1400), Rect2(2048,0,20,1400)
	]
	for r in bounds:
		_add_wall(r)

func _add_river_collision() -> void:
	_add_wall(Rect2(1140,0,370,665))
	_add_wall(Rect2(1140,765,370,635))

func _add_ruin_collision(r: Rect2) -> void:
	_add_wall(r)

func _add_wall(r: Rect2) -> void:
	var body := StaticBody2D.new()
	body.position = r.position + r.size/2.0
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = r.size
	cs.shape = sh
	body.add_child(cs)
	world.add_child(body)

func _spawn_npc(display_name: String, asset: String, pos: Vector2) -> void:
	var n := Node2D.new()
	n.name = display_name
	n.position = pos
	n.add_to_group("npcs")
	n.set_meta("display_name", display_name)
	var s := Sprite2D.new()
	s.texture = load("res://assets/topdown/generated/%s.png" % asset)
	s.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	s.scale = Vector2(1.25,1.25)
	n.add_child(s)
	var l := _label(n, Vector2(-40,-42), Vector2(80,18), display_name, 9, Color.WHITE)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	world.add_child(n)

func _spawn_enemy(kind: int, pos: Vector2) -> void:
	var e := CharacterBody2D.new()
	e.set_script(EnemyScript)
	world.add_child(e)
	e.global_position = pos
	e.setup(player, kind)
	e.damaged_player.connect(_on_enemy_damaged_player)
	e.died.connect(_on_enemy_died)

func _on_enemy_damaged_player(amount: float) -> void:
	if player:
		player.take_damage(amount)
		_update_hud()

func _on_enemy_died(_enemy: Node) -> void:
	kills += 1
	crystals += 2
	_update_hud()
	_check_completion()

func _spawn_pickup(pos: Vector2) -> void:
	var a := Area2D.new()
	a.position = pos
	a.add_to_group("crystal_pickups")
	var cs := CollisionShape2D.new()
	var sh := CircleShape2D.new()
	sh.radius = 13
	cs.shape = sh
	a.add_child(cs)
	var p := Polygon2D.new()
	p.polygon = PackedVector2Array([Vector2(0,-12),Vector2(8,0),Vector2(4,12),Vector2(-6,12),Vector2(-9,0)])
	p.color = Color("9b5cff")
	a.add_child(p)
	a.body_entered.connect(_on_pickup_body_entered.bind(a))
	world.add_child(a)

func _on_pickup_body_entered(body: Node, area: Area2D) -> void:
	if body != player:
		return
	crystals += 1
	if is_instance_valid(area):
		area.queue_free()
	_update_hud()
	_check_completion()

func _setup_hud() -> void:
	ui = CanvasLayer.new()
	ui.layer = 80
	add_child(ui)
	var panel := ColorRect.new()
	panel.position = Vector2(8,8)
	panel.size = Vector2(235,62)
	panel.color = Color(0.02,0.03,0.06,0.86)
	ui.add_child(panel)
	hp_label = _label(ui, Vector2(18,14), Vector2(215,20), "", 11, Color.WHITE)
	resource_label = _label(ui, Vector2(18,38), Vector2(215,20), "", 10, Color("ffd090"))
	objective_label = _label(ui, Vector2(265,10), Vector2(360,54), "", 10, Color(0.90,0.94,1.0))
	objective_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_label(ui, Vector2(18,318), Vector2(420,32), "J ATAQUE  Q CORTE  E PULSO  R DESTELLO  SHIFT DASH  C HABLAR", 9, Color("bdeaff"))
	toast_label = _label(ui, Vector2(180,282), Vector2(440,32), "", 10, Color("ffd090"))

func _update_hud() -> void:
	if not player or not is_instance_valid(player):
		return
	hp_label.text = "%s  VIDA %d/%d   MANA %d/%d" % [player_name,int(player.hp),int(player.max_hp),int(player.mana),int(player.max_mana)]
	resource_label.text = "CRISTALES %d   DERROTADOS %d/4" % [crystals,kills]
	objective_label.text = "OBJETIVOS ABIERTOS: habla con Alexis [%s] - derrota 4 criaturas [%d/4] - recoge 3 cristales [%d/3]" % ["OK" if talked_alexis else " ", mini(kills,4), mini(crystals,3)]

func _toast(text: String) -> void:
	if not toast_label:
		return
	toast_label.text = text
	toast_label.modulate = Color.WHITE
	var tw := create_tween()
	tw.tween_interval(2.4)
	tw.tween_property(toast_label, "modulate", Color(1,1,1,0), 0.5)

func _player_attack(origin: Vector2, facing: Vector2, power: float) -> void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e):
			continue
		var delta := e.global_position-origin
		if delta.length() <= 52.0 and delta.normalized().dot(facing) > 0.10:
			e.take_damage(power, facing)
	_attack_fx(origin+facing*28.0, Color("6be7ff"), 22.0)

func _player_skill(slot: int, origin: Vector2, facing: Vector2) -> void:
	match slot:
		0:
			for e in get_tree().get_nodes_in_group("enemies"):
				if is_instance_valid(e) and e.global_position.distance_to(origin) <= 88.0:
					e.take_damage(24.0, facing)
			_attack_fx(origin, Color("9b5cff"), 52.0)
		1:
			player.hp = minf(player.max_hp, player.hp+8.0)
			_attack_fx(origin, Color("42e0c2"), 42.0)
		2:
			player.global_position += facing*70.0
			_attack_fx(origin+facing*40.0, Color("6be7ff"), 36.0)
	_update_hud()

func _attack_fx(pos: Vector2, color: Color, radius: float) -> void:
	var ring := Line2D.new()
	ring.z_index = 90
	var pts := PackedVector2Array()
	for i in range(17):
		var angle := TAU*float(i)/16.0
		pts.append(Vector2(cos(angle),sin(angle))*radius)
	ring.points = pts
	ring.width = 3.0
	ring.default_color = color
	ring.position = pos
	world.add_child(ring)
	var tw := create_tween()
	tw.tween_property(ring, "modulate", Color(1,1,1,0), 0.20)
	tw.finished.connect(_free_fx.bind(ring))

func _free_fx(node: Node) -> void:
	if is_instance_valid(node):
		node.queue_free()

func _player_interact(origin: Vector2, _facing: Vector2) -> void:
	var best: Node2D = null
	var best_d := 58.0
	for n in get_tree().get_nodes_in_group("npcs"):
		var d := origin.distance_to(n.global_position)
		if d < best_d:
			best = n
			best_d = d
	if not best:
		_toast("No hay nadie cerca con quien interactuar.")
		return
	var who := str(best.get_meta("display_name","NPC"))
	if who == "Alexis":
		talked_alexis = true
		_toast("Alexis: La Fisura cambio el territorio. No sigas un camino: aprende a leer el mundo.")
	elif who == "Ashley":
		_toast("Ashley: El bosque tiene ritmo. Escuchalo antes de elegir como vas a combatir.")
	_update_hud()
	_check_completion()

func _check_completion() -> void:
	if talked_alexis and kills >= 4 and crystals >= 3 and not shrine_reached:
		shrine_reached = true
		_save_game(2)
		_toast("NODO 1 COMPLETO - El Overworld y las rutas 2-5 quedan listos para la siguiente iteracion.")
