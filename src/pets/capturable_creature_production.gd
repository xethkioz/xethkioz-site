extends "res://src/pets/capturable_creature.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")

var _visual: Sprite2D
var _motion_clock: float = 0.0
var _capture_in_progress: bool = false
var _curious_left: float = 0.0
var _player: Node2D

func _ready() -> void:
	super._ready()
	if is_queued_for_deletion():
		return
	_visual = Sprite2D.new()
	_visual.name = "CapturableVisual"
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(128, 0), Vector2(32, 32))
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	add_child(_visual)
	_player = get_tree().get_first_node_in_group("player") as Node2D

func _process(delta: float) -> void:
	_motion_clock += delta
	_curious_left = maxf(0.0, _curious_left - delta)
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
	if not is_instance_valid(_visual):
		return
	var player_distance: float = 9999.0
	if is_instance_valid(_player):
		player_distance = global_position.distance_to(_player.global_position)
	var awareness: float = clampf(1.0 - (player_distance - 32.0) / 92.0, 0.0, 1.0)
	var bob_speed: float = 2.0 + awareness * 1.5
	var bob_height: float = 0.7 + awareness * 0.9
	if _curious_left > 0.0:
		bob_speed = 6.2
		bob_height = 2.2
	_visual.position.y = -7.0 + sin(_motion_clock * bob_speed) * bob_height
	if is_instance_valid(_player) and absf(_player.global_position.x - global_position.x) > 3.0:
		_visual.flip_h = _player.global_position.x < global_position.x
	if not _capture_in_progress:
		_visual.scale = Vector2.ONE * (1.0 + awareness * 0.025 + sin(_motion_clock * 2.4) * 0.012)
	queue_redraw()

func interact(actor: Node = null) -> void:
	if _capture_in_progress or GameState.has_familiar(species_id):
		return
	if not bait_item_id.is_empty() and InventoryService.amount_of(bait_item_id) <= 0:
		_curious_left = 0.85
		_spawn_feedback("ward", Color("8fcf78"), "?")
		EventBus.dialog_requested.emit(display_name, "Te observa, se acerca un poco y vuelve hacia los juncos. Parece esperar algo con olor dulce.")
		EventBus.toast_requested.emit("Necesitás una Manzana de Bruma")
		return

	if not bait_item_id.is_empty():
		var bait_cost := {bait_item_id: 1}
		if not InventoryService.remove_items(bait_cost):
			return

	_capture_in_progress = true
	remove_from_group("interactable")
	EventBus.dialog_requested.emit(display_name, "La Manzana de Bruma rompe la desconfianza. Xethkioz baja su resonancia y espera: ahora la decisión es de la criatura.")
	_spawn_feedback("pickup", Color("8fcf78"), "Manzana de Bruma")
	await _play_bond_sequence(actor)
	if not is_instance_valid(self):
		return
	if GameState.capture_familiar(species_id, display_name, affinity, mentor_id):
		_spawn_feedback("burst", Color("b994ff"), "VÍNCULO")
		EventBus.dialog_requested.emit(display_name, "Toca el Prisma-Atlas con el hocico y decide quedarse cerca de vos. No fue atrapado: eligió acompañarte.")
		EventBus.toast_requested.emit("Familiar vinculado · %s" % display_name)
		SaveService.save_game()
		visible = false
		await get_tree().create_timer(0.12).timeout
		if is_instance_valid(self):
			queue_free()
	else:
		_capture_in_progress = false
		add_to_group("interactable")

func _play_bond_sequence(actor: Node) -> void:
	if not is_instance_valid(_visual):
		await get_tree().create_timer(0.42).timeout
		return
	var target_position: Vector2 = global_position
	if actor is Node2D:
		var to_actor: Vector2 = actor.global_position - global_position
		if to_actor.length_squared() > 0.001:
			target_position = global_position + to_actor.normalized() * minf(18.0, maxf(0.0, to_actor.length() - 24.0))
	var tween: Tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "global_position", target_position, 0.30).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tween.tween_property(_visual, "scale", Vector2(1.12, 0.90), 0.14).set_trans(Tween.TRANS_SINE)
	await tween.finished
	var settle: Tween = create_tween()
	settle.tween_property(_visual, "scale", Vector2(0.96, 1.08), 0.12)
	settle.tween_property(_visual, "scale", Vector2.ONE, 0.12)
	await settle.finished

func _spawn_feedback(kind_value: String, color_value: Color, text_value: String) -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -8)
	scene.add_child(fx)
	fx.call("configure", kind_value, Vector2.UP, color_value, text_value)

func interaction_label() -> String:
	return "Acercarse a %s" % display_name

func _draw() -> void:
	if _capture_in_progress:
		draw_arc(Vector2(0, -6), 16.0, -PI * 0.85, PI * 0.85, 24, Color(0.55, 0.36, 0.96, 0.52), 2.0)
	elif _curious_left > 0.0:
		draw_arc(Vector2(0, -6), 13.0, 0.0, TAU, 20, Color(0.56, 0.81, 0.47, 0.30), 1.5)
