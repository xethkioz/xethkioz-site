extends Node2D

const PieceScript := preload("res://src/world/mentor_trial_piece_v36.gd")
const TargetScript := preload("res://src/npc/mentor_trial_target_v36.gd")

var mentor_id := ""
var completed := false
var progress := 0
var pieces: Array[Node] = []
var rune_states := [false, false]
var weight_pushes := 0
var plate_loaded := false
var counter_pushes := 0
var target_order := [1,0,2]

func configure(mentor_value: String) -> void:
	mentor_id = mentor_value
	if is_inside_tree():
		_build_trial()

func _ready() -> void:
	if mentor_id.is_empty():
		mentor_id = GameState.selected_mentor
	_build_trial()

func _build_trial() -> void:
	if not pieces.is_empty() or completed:
		return
	match mentor_id:
		"ashley":
			_build_ashley()
		"fermin":
			_build_fermin()
		"isabella":
			_build_isabella()
		"gael":
			_build_gael()
		_:
			EventBus.toast_requested.emit("Elegí una mentoría en el Refugio antes de entrar")
	queue_redraw()

func _build_ashley() -> void:
	EventBus.dialog_requested.emit("Ashley", "La puerta escucha. Repetí la secuencia de pulsos: grave, agudo, medio. Si apurás uno, empieza de nuevo.")
	_spawn_piece("pulse",0,Vector2(220,190),"Pulso grave",0,Color("6ed4e8"))
	_spawn_piece("pulse",1,Vector2(320,160),"Pulso medio",0,Color("8b5cf6"))
	_spawn_piece("pulse",2,Vector2(420,190),"Pulso agudo",0,Color("d8ceff"))

func _build_fermin() -> void:
	EventBus.dialog_requested.emit("Fermín", "No empujes la puerta. Primero llevá el bloque a la placa para mantener presión. Con la placa cargada, recién ahí mové el contrapeso.")
	_spawn_piece("training_weight",0,Vector2(115,196),"Empujar bloque hacia la placa",2,Color("ffb066"))
	_spawn_piece("plate",0,Vector2(215,196),"Placa de presión",1,Color("ff8c42"))
	_spawn_piece("counterweight",0,Vector2(435,196),"Mover contrapeso",2,Color("ff8c42"))

func _build_isabella() -> void:
	EventBus.dialog_requested.emit("Isabella", "Dos runas se alimentan entre sí. Invertí las dos. Si sólo cambiás una, el problema cambia de lado y sigue siendo problema.")
	_spawn_piece("rune",0,Vector2(270,190),"Invertir runa izquierda",3,Color("c686ff"))
	_spawn_piece("rune",1,Vector2(370,190),"Invertir runa derecha",3,Color("c686ff"))

func _build_gael() -> void:
	EventBus.dialog_requested.emit("Gael", "No mires los blancos. Mirá la huella de luz entre ellos. Usá Q y seguí el orden que dejó la sala.")
	_spawn_target(0,Vector2(235,194))
	_spawn_target(1,Vector2(320,158))
	_spawn_target(2,Vector2(405,194))

func _spawn_piece(role: String, index: int, pos: Vector2, label: String, frame: int, color: Color) -> Node:
	var node := Node2D.new()
	node.name = "Trial_%s_%d" % [role,index]
	node.set_script(PieceScript)
	node.position = pos
	add_child(node)
	node.configure(self, role, index, label, frame, color)
	pieces.append(node)
	return node

func _spawn_target(index: int, pos: Vector2) -> Node:
	var node := CharacterBody2D.new()
	node.name = "LightTarget_%d" % index
	node.set_script(TargetScript)
	node.position = pos
	add_child(node)
	node.configure(self,index)
	pieces.append(node)
	return node

func handle_trial_interaction(role: String, index: int, _actor: Node, node: Node) -> void:
	if completed:
		return
	match role:
		"pulse":
			_handle_pulse(index)
		"training_weight":
			_handle_training_weight(node)
		"counterweight":
			_handle_counterweight(node)
		"plate":
			if plate_loaded:
				EventBus.toast_requested.emit("Placa estable · presión mantenida por el bloque")
			else:
				EventBus.toast_requested.emit("La placa se libera cuando te alejás · necesitás dejar peso encima")
		"rune":
			_handle_rune(index,node)

func _handle_pulse(index: int) -> void:
	var sequence := [0,2,1]
	if index != int(sequence[progress]):
		progress = 0
		for piece in pieces:
			if is_instance_valid(piece) and piece.has_method("set_piece_active"):
				piece.call("set_piece_active", true)
		EventBus.toast_requested.emit("Resonancia quebrada · la secuencia reinicia")
		return
	progress += 1
	var current := pieces[index] if index < pieces.size() else null
	if is_instance_valid(current) and current.has_method("set_piece_active"):
		current.call("set_piece_active", false)
	EventBus.toast_requested.emit("Pulso %d/3 sincronizado" % progress)
	if progress >= 3:
		_complete("ashley")

func _handle_training_weight(node: Node) -> void:
	if plate_loaded:
		EventBus.toast_requested.emit("El bloque ya sostiene la placa")
		return
	weight_pushes += 1
	var target_x := minf(215.0, 115.0 + float(weight_pushes) * 50.0)
	var tween := create_tween()
	tween.tween_property(node,"position:x",target_x,0.22).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	EventBus.toast_requested.emit("Bloque de presión · %d/2" % mini(weight_pushes,2))
	if weight_pushes >= 2:
		await tween.finished
		plate_loaded = true
		if node.has_method("set_piece_active"):
			node.call("set_piece_active", false)
		var plate := _find_piece("plate")
		if is_instance_valid(plate) and plate.has_method("set_piece_active"):
			plate.call("set_piece_active", false)
		EventBus.toast_requested.emit("PLACA CARGADA · ahora mové el contrapeso")
		queue_redraw()

func _handle_counterweight(node: Node) -> void:
	if not plate_loaded:
		EventBus.toast_requested.emit("El contrapeso vuelve a trabarse · mantené la placa bajo presión")
		return
	counter_pushes += 1
	var tween := create_tween()
	tween.tween_property(node,"position:x",435.0 - float(counter_pushes) * 45.0,0.18).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	EventBus.toast_requested.emit("Contrapeso · %d/4" % mini(counter_pushes,4))
	if counter_pushes >= 4:
		await tween.finished
		_complete("fermin")

func _find_piece(role_value: String) -> Node:
	for piece in pieces:
		if is_instance_valid(piece) and str(piece.get("role")) == role_value:
			return piece
	return null

func _handle_rune(index: int, node: Node) -> void:
	if index < 0 or index >= rune_states.size():
		return
	rune_states[index] = not bool(rune_states[index])
	var tween := create_tween()
	tween.tween_property(node,"rotation",PI if bool(rune_states[index]) else 0.0,0.22).set_trans(Tween.TRANS_BACK)
	EventBus.toast_requested.emit("Runa %s · %s" % ["izquierda" if index == 0 else "derecha", "invertida" if rune_states[index] else "restaurada"])
	if bool(rune_states[0]) and bool(rune_states[1]):
		await tween.finished
		_complete("isabella")

func handle_target_hit(index: int, node: Node) -> void:
	if completed or mentor_id != "gael":
		return
	var expected := int(target_order[progress])
	if index != expected:
		progress = 0
		for target in pieces:
			if is_instance_valid(target) and target.has_method("set_target_active"):
				target.call("set_target_active", true)
		EventBus.toast_requested.emit("Orden perdido · seguí otra vez la huella de luz")
		return
	progress += 1
	if is_instance_valid(node) and node.has_method("set_target_active"):
		node.call("set_target_active", false)
	EventBus.toast_requested.emit("Blanco %d/3" % progress)
	if progress >= 3:
		_complete("gael")

func _complete(solution_id: String) -> void:
	if completed:
		return
	completed = true
	GameState.set_world_flag("mentor_trial_room_open", true)
	var quest := get_tree().get_first_node_in_group("quest_manager")
	if is_instance_valid(quest) and quest.has_method("complete_mentor_trial"):
		quest.call("complete_mentor_trial", solution_id)
	EventBus.dialog_requested.emit(_mentor_name(solution_id), "La puerta respondió. No era una prueba de fuerza: era una forma de leer el mismo problema.")
	EventBus.toast_requested.emit("PUERTA DE ENTRENAMIENTO · lectura registrada")
	SaveService.save_game()
	queue_redraw()

func _mentor_name(id_value: String) -> String:
	return {
		"ashley":"Ashley",
		"fermin":"Fermín",
		"isabella":"Isabella",
		"gael":"Gael"
	}.get(id_value, id_value.capitalize())

func _draw() -> void:
	if mentor_id == "gael" and not completed:
		var route := [Vector2(320,158),Vector2(235,194),Vector2(405,194)]
		for i in range(route.size()-1):
			draw_dashed_line(route[i],route[i+1],Color(0.56,0.81,0.47,0.34),2.0,8.0)
	if mentor_id == "fermin" and plate_loaded and not completed:
		draw_arc(Vector2(215,196),22.0,0.0,TAU,24,Color(1.0,0.55,0.26,0.55),2.0)
	if completed:
		draw_arc(Vector2(320,92),26.0,0.0,TAU,32,Color("8fcf78"),3.0)
