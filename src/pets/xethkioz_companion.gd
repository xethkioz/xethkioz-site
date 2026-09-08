extends Node2D

@export var follow_distance := 30.0
@export var follow_speed := 145.0

var _player: Node2D
var _pulse := 0.0

func _ready() -> void:
	add_to_group("pets")
	_player = get_tree().get_first_node_in_group("player") as Node2D
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		return
	var offset := _player.global_position - global_position
	if offset.length() > follow_distance:
		global_position += offset.normalized() * minf(offset.length() - follow_distance, follow_speed * delta)
	queue_redraw()

func _draw() -> void:
	var glow := 0.65 + sin(_pulse * 4.0) * 0.15
	draw_circle(Vector2.ZERO, 7.0, Color(0.65, 0.92, 0.86, glow))
	draw_circle(Vector2(-5, -6), 4.0, Color("c8fff0"))
	draw_circle(Vector2(5, -6), 4.0, Color("c8fff0"))
	draw_circle(Vector2.ZERO, 3.0, Color("8b5cf6"))
