extends Node2D

var _player: CharacterBody2D

func configure(player_ref: CharacterBody2D) -> void:
	_player = player_ref

func _ready() -> void:
	z_index = 5
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _draw() -> void:
	if not is_instance_valid(_player):
		_player = get_parent() as CharacterBody2D
	if not is_instance_valid(_player):
		return
	var facing: Vector2 = _player.get("facing") if _player.get("facing") is Vector2 else Vector2.DOWN
	var skin := CharacterProfile.skin_color_value()
	var hair := CharacterProfile.hair_color_value()
	var accent := CharacterProfile.accent_color_value()
	var body_scale := [0.90, 1.0, 1.10][clampi(CharacterProfile.body_type, 0, 2)]
	var shoulder := 7.0 * body_scale
	var head_y := -10.0

	# Equipment accent that remains readable over the dark base sprite.
	draw_rect(Rect2(-shoulder, 2, shoulder * 2.0, 2), accent, true)
	draw_rect(Rect2(-2, 1, 4, 5), accent.lightened(0.28), true)

	if absf(facing.x) > absf(facing.y):
		var side := -1.0 if facing.x < 0.0 else 1.0
		draw_rect(Rect2(-4 + side, head_y, 8, 6), skin, true)
		draw_rect(Rect2(-5 + side, head_y - 3, 9, 4), hair, true)
		_draw_hair_style(Vector2(side, head_y - 1), hair, side)
		draw_rect(Rect2(side * 4 - 1, head_y + 2, 2, 2), Color("26323a"), true)
	else:
		if facing.y < 0.0:
			draw_rect(Rect2(-5, head_y - 1, 10, 8), hair, true)
			_draw_hair_style(Vector2(0, head_y), hair, 0.0)
		else:
			draw_rect(Rect2(-4, head_y, 8, 6), skin, true)
			draw_rect(Rect2(-5, head_y - 3, 10, 4), hair, true)
			_draw_hair_style(Vector2(0, head_y - 1), hair, 0.0)
			draw_rect(Rect2(-3, head_y + 2, 2, 2), Color("26323a"), true)
			draw_rect(Rect2(2, head_y + 2, 2, 2), Color("26323a"), true)

	# Hands keep the chosen skin tone visible while moving.
	draw_rect(Rect2(-shoulder - 2, 4, 2, 4), skin.darkened(0.04), true)
	draw_rect(Rect2(shoulder, 4, 2, 4), skin.darkened(0.04), true)

func _draw_hair_style(anchor: Vector2, color: Color, side: float) -> void:
	match CharacterProfile.hair_style:
		0: # corto
			draw_rect(Rect2(anchor.x - 4, anchor.y - 4, 8, 2), color.lightened(0.08), true)
		1: # medio
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 3), color, true)
			draw_rect(Rect2(anchor.x - 5, anchor.y - 1, 2, 5), color.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 3, anchor.y - 1, 2, 5), color.darkened(0.08), true)
		2: # largo
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 3), color, true)
			draw_rect(Rect2(anchor.x - 6, anchor.y - 1, 3, 9), color.darkened(0.10), true)
			draw_rect(Rect2(anchor.x + 3, anchor.y - 1, 3, 9), color.darkened(0.10), true)
		3: # rasurado
			draw_rect(Rect2(anchor.x - 4, anchor.y - 3, 8, 1), color.darkened(0.18), true)
		4: # trenzado
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 2), color, true)
			var braid_x := anchor.x - 5 if side <= 0.0 else anchor.x + 3
			draw_rect(Rect2(braid_x, anchor.y - 1, 2, 8), color.darkened(0.10), true)
			draw_rect(Rect2(braid_x - 1, anchor.y + 6, 4, 2), color.lightened(0.05), true)
		5: # salvaje
			draw_rect(Rect2(anchor.x - 6, anchor.y - 4, 12, 3), color, true)
			draw_rect(Rect2(anchor.x - 7, anchor.y - 2, 3, 4), color.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 4, anchor.y - 3, 3, 5), color.lightened(0.05), true)
