extends Node2D

const METER_TEXTURE := preload("res://assets/production/v36/strange_meter.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")

var item_id := "strange_meter"
var flag_id := "strange_meter_collected"
var display_name := "OBJETO EXTRAÑO"
var _visual: Sprite2D
var _pulse := 0.0
var _available := true

func configure(item_value: String, flag_value: String, name_value: String) -> void:
	item_id = item_value
	flag_id = flag_value
	display_name = name_value

func _ready() -> void:
	if GameState.has_world_flag(flag_id):
		queue_free()
		return
	add_to_group("interactable")
	_visual = Sprite2D.new()
	_visual.texture = METER_TEXTURE
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -6)
	_visual.z_index = 3
	add_child(_visual)

func _process(delta: float) -> void:
	_pulse += delta
	if is_instance_valid(_visual):
		_visual.position.y = -6.0 + sin(_pulse * 2.7) * 0.8
		_visual.modulate = Color.WHITE.lerp(Color("bca7ff"), 0.08 + maxf(0.0, sin(_pulse * 3.1)) * 0.10)
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if not _available or GameState.has_world_flag(flag_id):
		return
	_available = false
	remove_from_group("interactable")
	GameState.set_world_flag(flag_id, true)
	EventBus.dialog_requested.emit("Registro", "El medidor no tiene batería. Al acercarlo a Xethkioz, una línea violeta aparece durante un segundo y vuelve a apagarse.")
	EventBus.toast_requested.emit("Objeto de historia · OBJETO EXTRAÑO")
	_spawn_feedback()
	SaveService.save_game()
	visible = false
	await get_tree().create_timer(0.14).timeout
	if is_instance_valid(self):
		queue_free()

func interaction_label() -> String:
	return "Recoger · %s" % display_name

func _spawn_feedback() -> void:
	var scene := get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -8)
	scene.add_child(fx)
	fx.call("configure", "pickup", Vector2.UP, Color("8b5cf6"), "OBJETO EXTRAÑO")

func _draw() -> void:
	if not _available:
		return
	var alpha := 0.18 + maxf(0.0, sin(_pulse * 3.1)) * 0.12
	draw_arc(Vector2(0, -6), 15.0, 0.0, TAU, 24, Color(0.55, 0.36, 0.96, alpha), 1.0)
