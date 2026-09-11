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
	var direction_row: int = _direction_row(facing)
	var skin := CharacterProfile.skin_color_value()
	var hair := CharacterProfile.hair_color_value()
	var accent := CharacterProfile.accent_color_value()
	var body_scale: float = float([0.90, 1.0, 1.10][clampi(CharacterProfile.body_type, 0, 2)])
	var shoulder: float = 7.0 * body_scale
	var head_y: float = -10.0

	draw_rect(Rect2(-shoulder, 2, shoulder * 2.0, 2), accent, true)
	draw_rect(Rect2(-2, 1, 4, 5), accent.lightened(0.28), true)

	match direction_row:
		0:
			_draw_front_head(head_y, skin, hair, 0.0)
		1:
			_draw_front_head(head_y, skin, hair, -1.0)
		2:
			_draw_side_head(head_y, skin, hair, -1.0)
		3:
			_draw_back_diagonal_head(head_y, skin, hair, -1.0)
		4:
			_draw_back_head(head_y, hair)
		5:
			_draw_back_diagonal_head(head_y, skin, hair, 1.0)
		6:
			_draw_side_head(head_y, skin, hair, 1.0)
		7:
			_draw_front_head(head_y, skin, hair, 1.0)

	var hand_shift: float = clampf(facing.x, -1.0, 1.0)
	draw_rect(Rect2(-shoulder - 2 + hand_shift, 4, 2, 4), skin.darkened(0.04), true)
	draw_rect(Rect2(shoulder + hand_shift, 4, 2, 4), skin.darkened(0.04), true)

func _direction_row(direction_value: Vector2) -> int:
	var direction: Vector2 = direction_value
	if direction.length_squared() <= 0.0001:
		return 0
	direction = direction.normalized()
	var horizontal: float = direction.x
	var vertical: float = direction.y
	const DIAGONAL_THRESHOLD := 0.38268343
	if vertical >= DIAGONAL_THRESHOLD:
		if horizontal <= -DIAGONAL_THRESHOLD:
			return 1
		if horizontal >= DIAGONAL_THRESHOLD:
			return 7
		return 0
	if vertical <= -DIAGONAL_THRESHOLD:
		if horizontal <= -DIAGONAL_THRESHOLD:
			return 3
		if horizontal >= DIAGONAL_THRESHOLD:
			return 5
		return 4
	return 2 if horizontal < 0.0 else 6

func _draw_front_head(head_y: float, skin: Color, hair: Color, side: float) -> void:
	var shift: float = side
	draw_rect(Rect2(-4 + shift, head_y, 8, 6), skin, true)
	draw_rect(Rect2(-5 + shift, head_y - 3, 10, 4), hair, true)
	_draw_hair_style(Vector2(shift, head_y - 1), hair, side)
	if side < 0.0:
		draw_rect(Rect2(-3 + shift, head_y + 2, 2, 2), Color("26323a"), true)
		draw_rect(Rect2(1 + shift, head_y + 2, 1, 2), Color("26323a"), true)
	elif side > 0.0:
		draw_rect(Rect2(-2 + shift, head_y + 2, 1, 2), Color("26323a"), true)
		draw_rect(Rect2(2 + shift, head_y + 2, 2, 2), Color("26323a"), true)
	else:
		draw_rect(Rect2(-3, head_y + 2, 2, 2), Color("26323a"), true)
		draw_rect(Rect2(2, head_y + 2, 2, 2), Color("26323a"), true)

func _draw_side_head(head_y: float, skin: Color, hair: Color, side: float) -> void:
	draw_rect(Rect2(-4 + side, head_y, 8, 6), skin, true)
	draw_rect(Rect2(-5 + side, head_y - 3, 9, 4), hair, true)
	_draw_hair_style(Vector2(side, head_y - 1), hair, side)
	draw_rect(Rect2(side * 4 - 1, head_y + 2, 2, 2), Color("26323a"), true)

func _draw_back_head(head_y: float, hair: Color) -> void:
	draw_rect(Rect2(-5, head_y - 1, 10, 8), hair, true)
	_draw_hair_style(Vector2(0, head_y), hair, 0.0)

func _draw_back_diagonal_head(head_y: float, skin: Color, hair: Color, side: float) -> void:
	var shift: float = side
	draw_rect(Rect2(-5 + shift, head_y - 1, 10, 8), hair, true)
	_draw_hair_style(Vector2(shift, head_y), hair, side)
	var cheek_x: float = -5.0 if side < 0.0 else 4.0
	draw_rect(Rect2(cheek_x + shift, head_y + 2, 2, 4), skin.darkened(0.03), true)

func _draw_hair_style(anchor: Vector2, color: Color, side: float) -> void:
	match CharacterProfile.hair_style:
		0:
			draw_rect(Rect2(anchor.x - 4, anchor.y - 4, 8, 2), color.lightened(0.08), true)
		1:
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 3), color, true)
			draw_rect(Rect2(anchor.x - 5, anchor.y - 1, 2, 5), color.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 3, anchor.y - 1, 2, 5), color.darkened(0.08), true)
		2:
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 3), color, true)
			draw_rect(Rect2(anchor.x - 6, anchor.y - 1, 3, 9), color.darkened(0.10), true)
			draw_rect(Rect2(anchor.x + 3, anchor.y - 1, 3, 9), color.darkened(0.10), true)
		3:
			draw_rect(Rect2(anchor.x - 4, anchor.y - 3, 8, 1), color.darkened(0.18), true)
		4:
			draw_rect(Rect2(anchor.x - 5, anchor.y - 4, 10, 2), color, true)
			var braid_x: float = anchor.x - 5 if side <= 0.0 else anchor.x + 3
			draw_rect(Rect2(braid_x, anchor.y - 1, 2, 8), color.darkened(0.10), true)
			draw_rect(Rect2(braid_x - 1, anchor.y + 6, 4, 2), color.lightened(0.05), true)
		5:
			draw_rect(Rect2(anchor.x - 6, anchor.y - 4, 12, 3), color, true)
			draw_rect(Rect2(anchor.x - 7, anchor.y - 2, 3, 4), color.darkened(0.08), true)
			draw_rect(Rect2(anchor.x + 4, anchor.y - 3, 3, 5), color.lightened(0.05), true)
