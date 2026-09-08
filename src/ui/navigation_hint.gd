extends Control

const CHUNK_PIXELS := 512
const TARGETS := {
	"intro": {"name":"Alexis", "pos":Vector2(1 * CHUNK_PIXELS + 326, 3 * CHUNK_PIXELS + 190)},
	"roots": {"name":"Raíces alteradas", "pos":Vector2(1 * CHUNK_PIXELS + 270, 2 * CHUNK_PIXELS + 385)},
	"seek_val": {"name":"Val · Lago Encantado", "pos":Vector2(1 * CHUNK_PIXELS + 164, 1 * CHUNK_PIXELS + 248)},
	"capture": {"name":"Orilla del Lago", "pos":Vector2(1 * CHUNK_PIXELS + 330, 1 * CHUNK_PIXELS + 250)},
	"sanctuary": {"name":"Santuario de las Raíces", "pos":Vector2(3 * CHUNK_PIXELS + 256, 2 * CHUNK_PIXELS + 246)},
	"boss5": {"name":"Corazón del Bosque Velado", "pos":Vector2(4 * CHUNK_PIXELS + 256, 0 * CHUNK_PIXELS + 256)},
	"refuge_after_boss": {"name":"Refugio de Elida", "pos":Vector2(1 * CHUNK_PIXELS + 300, 3 * CHUNK_PIXELS + 135)},
	"mentor_choice": {"name":"Los cuatro caminos", "pos":Vector2(1 * CHUNK_PIXELS + 300, 3 * CHUNK_PIXELS + 190)},
	"training": {"name":"Fermín", "pos":Vector2(1 * CHUNK_PIXELS + 268, 3 * CHUNK_PIXELS + 205)},
	"fermin_training": {"name":"Prueba de Impacto", "pos":Vector2(1 * CHUNK_PIXELS + 420, 3 * CHUNK_PIXELS + 205)}
}

var _player: Node2D
var _stage := "intro"

func configure(player_ref: Node2D) -> void:
	_player = player_ref

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	EventBus.demo_stage_changed.connect(_on_stage_changed)
	queue_redraw()

func _process(_delta: float) -> void:
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
	draw_colored_polygon(points, Color("ff8c42"))
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(36, 13), str(target.get("name", "Objetivo")), HORIZONTAL_ALIGNMENT_LEFT, size.x - 40.0, 7, Color("f0f0f5"))
	draw_string(font, Vector2(36, 25), "%d casillas" % distance_tiles, HORIZONTAL_ALIGNMENT_LEFT, size.x - 40.0, 6, Color("b9b9c8"))
