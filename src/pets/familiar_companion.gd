extends Node2D

@export var follow_distance := 48.0
@export var follow_speed := 130.0

var species_id := ""
var display_name := "Familiar"
var accent_color := Color("9fd6c0")
var _player: Node2D
var _pulse := 0.0

func configure(id_value: String, name_value: String, color_value: Color) -> void:
	species_id = id_value
	display_name = name_value
	accent_color = color_value
	queue_redraw()

func _ready() -> void:
	add_to_group("familiars")
	_player = get_tree().get_first_node_in_group("player") as Node2D
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		return
	var desired := _player.global_position + Vector2(-22, 20)
	var offset := desired - global_position
	if offset.length() > follow_distance * 0.35:
		global_position += offset.normalized() * minf(offset.length(), follow_speed * delta)
	queue_redraw()

func _draw() -> void:
	var glow := 0.7 + sin(_pulse * 3.0) * 0.08
	draw_circle(Vector2.ZERO, 7.0, Color(accent_color.r, accent_color.g, accent_color.b, glow))
	draw_circle(Vector2(6, -2), 4.0, accent_color.lightened(0.08))
	draw_circle(Vector2(7, -3), 1.0, Color("12151a"))
