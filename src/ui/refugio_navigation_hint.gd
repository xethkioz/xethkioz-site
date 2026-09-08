extends Control

const TARGETS := {
	"refuge_after_boss": {"name":"Elida", "pos":Vector2(320, 145)},
	"mentor_choice": {"name":"Los cuatro caminos", "pos":Vector2(320, 244)},
	"training": {"name":"Fermín", "pos":Vector2(238, 244)},
	"fermin_training": {"name":"Prueba de Impacto", "pos":Vector2(420, 188)}
}

var _player: Node2D
var _stage := "refuge_after_boss"
var _search_cooldown := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	EventBus.demo_stage_changed.connect(_on_stage_changed)
	visible = false
	queue_redraw()

func _process(delta: float) -> void:
	_search_cooldown = maxf(0.0, _search_cooldown - delta)
	if not is_instance_valid(_player) and _search_cooldown <= 0.0:
		_search_cooldown = 0.25
		_player = get_tree().get_first_node_in_group("player") as Node2D
	queue_redraw()

func _on_stage_changed(stage_id: String) -> void:
	_stage = stage_id
	visible = TARGETS.has(_stage)
	queue_redraw()

func _draw() -> void:
	if not TARGETS.has(_stage) or not is_instance_valid(_player):
		return
	var target: Dictionary = TARGETS[_stage]
	var target_pos: Vector2 = target["pos"]
	var delta := target_pos - _player.global_position
	var distance_tiles := roundi(delta.length() / 16.0)
	var dir := delta.normalized() if delta.length_squared() > 1.0 else Vector2.UP
	var center := Vector2(17, 17)
	var side := dir.rotated(PI * 0.5)
	var tip := center + dir * 11.0
	var back := center - dir * 6.0
	var points := PackedVector2Array([tip, back + side * 6.0, back - side * 6.0])
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.025, 0.03, 0.05, 0.72), true)
	draw_colored_polygon(points, Color("8b5cf6"))
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(36, 13), str(target.get("name", "Objetivo")), HORIZONTAL_ALIGNMENT_LEFT, size.x - 40.0, 7, Color("f0f0f5"))
	draw_string(font, Vector2(36, 25), "%d casillas" % distance_tiles, HORIZONTAL_ALIGNMENT_LEFT, size.x - 40.0, 6, Color("b9b9c8"))
