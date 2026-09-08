extends Node2D

const PROPS := preload("res://assets/production/interiors/mentor_trial_props_v36.svg")

var controller: Node
var role := "pulse"
var piece_index := 0
var label_text := "Activar"
var frame := 0
var accent := Color("8b5cf6")
var active := true
var _sprite: Sprite2D
var _pulse := 0.0

func configure(owner: Node, role_value: String, index_value: int, label_value: String, frame_value: int, accent_value: Color) -> void:
	controller = owner
	role = role_value
	piece_index = index_value
	label_text = label_value
	frame = frame_value
	accent = accent_value
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	add_to_group("interactable")
	_sprite = Sprite2D.new()
	_sprite.name = "TrialPieceVisual"
	_sprite.texture = PROPS
	_sprite.region_enabled = true
	_sprite.region_rect = Rect2(Vector2(frame * 32, 0), Vector2(32,32))
	_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_sprite.position = Vector2(0,-7)
	_sprite.z_index = 2
	add_child(_sprite)
	_refresh_visual()

func _process(delta: float) -> void:
	_pulse += delta
	if is_instance_valid(_sprite):
		var beat := 1.0 + sin(_pulse * 3.2 + piece_index * 0.8) * 0.035
		_sprite.scale = Vector2.ONE * beat
	queue_redraw()

func interact(actor: Node = null) -> void:
	if not active:
		return
	if is_instance_valid(controller) and controller.has_method("handle_trial_interaction"):
		controller.call("handle_trial_interaction", role, piece_index, actor, self)

func set_piece_active(value: bool) -> void:
	active = value
	modulate = Color.WHITE if active else Color(0.55,0.55,0.58,0.72)
	queue_redraw()

func interaction_label() -> String:
	return label_text

func _refresh_visual() -> void:
	if is_instance_valid(_sprite):
		_sprite.region_rect = Rect2(Vector2(frame * 32,0), Vector2(32,32))

func _draw() -> void:
	if active:
		draw_arc(Vector2(0,-7), 14.0, 0.0, TAU, 20, Color(accent.r,accent.g,accent.b,0.18), 1.0)
