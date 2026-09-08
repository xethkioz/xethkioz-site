extends Control

var _player: Node2D
var _text := ""
var _dialog_suppression := 0.0
var _search_cooldown := 0.0

func configure(player_ref: Node2D) -> void:
	_player = player_ref

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	EventBus.dialog_requested.connect(_on_dialog_requested)
	visible = false

func _process(delta: float) -> void:
	_dialog_suppression = maxf(0.0, _dialog_suppression - delta)
	_search_cooldown = maxf(0.0, _search_cooldown - delta)
	if not is_instance_valid(_player) and _search_cooldown <= 0.0:
		_search_cooldown = 0.25
		_player = get_tree().get_first_node_in_group("player") as Node2D
	if _dialog_suppression > 0.0 or not is_instance_valid(_player):
		visible = false
		return
	var nearest: Node2D = null
	var nearest_distance := 64.0
	for candidate in get_tree().get_nodes_in_group("interactable"):
		if candidate is not Node2D or not candidate.visible:
			continue
		var distance := _player.global_position.distance_to(candidate.global_position)
		if distance <= nearest_distance:
			nearest = candidate
			nearest_distance = distance
	if nearest == null:
		visible = false
		return
	var label := "Interactuar"
	if nearest.has_method("interaction_label"):
		label = str(nearest.interaction_label())
	_text = "[ C ]  %s" % label
	visible = true
	queue_redraw()

func _on_dialog_requested(_speaker: String, _body: String) -> void:
	_dialog_suppression = 2.2
	visible = false

func _draw() -> void:
	if _text.is_empty():
		return
	var rect := Rect2(Vector2.ZERO, size)
	draw_rect(rect, Color(0.025, 0.03, 0.05, 0.92), true)
	draw_rect(rect, Color(0.55, 0.36, 0.96, 0.82), false, 1.0)
	var font := ThemeDB.fallback_font
	draw_string(font, Vector2(7, 16), _text, HORIZONTAL_ALIGNMENT_CENTER, size.x - 14.0, 8, Color("f0f0f5"))
