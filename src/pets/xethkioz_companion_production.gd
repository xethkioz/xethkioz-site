extends "res://src/pets/xethkioz_companion.gd"

const SHEET := preload("res://assets/production/characters/xethkioz_sheet.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")
const FRAME_SIZE := Vector2(32, 32)
const TRAIL_SAMPLE_INTERVAL := 0.055
const TRAIL_LENGTH := 14
const TARGET_SAMPLE_INDEX := 6
const SNAP_DISTANCE := 190.0

var _visual: Sprite2D
var _anim_clock: float = 0.0
var _anim_frame: int = 1
var _visual_facing := Vector2.DOWN
var _follow_velocity := Vector2.ZERO
var _trail: Array[Vector2] = []
var _sample_clock: float = 0.0
var _hover_clock: float = 0.0
var _was_snapped: bool = false
var _story_active := false
var _tail_stage := 3

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "XethkiozVisual"
	_visual.texture = SHEET
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(32, 0), FRAME_SIZE)
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -8)
	_visual.z_index = 2
	add_child(_visual)
	for _index in range(TRAIL_LENGTH):
		_trail.append(global_position)
	_tail_stage = GameState.xethkioz_tail_stage
	EventBus.xethkioz_tail_stage_changed.connect(_on_tail_stage_changed)
	set_story_active(GameState.has_world_flag("xethkioz_first_intercept"), false)

func set_story_active(active: bool, play_feedback: bool = true) -> void:
	_story_active = active
	visible = active
	set_process(active)
	if not active:
		_follow_velocity = Vector2.ZERO
		return
	if is_instance_valid(_player):
		global_position = _player.global_position + Vector2(-22, 10)
		for index in range(_trail.size()):
			_trail[index] = _player.global_position
	if play_feedback:
		_spawn_snap_feedback()
	queue_redraw()

func story_active() -> bool:
	return _story_active

func _on_tail_stage_changed(tails: int) -> void:
	_tail_stage = tails
	queue_redraw()

func _process(delta: float) -> void:
	if not _story_active:
		return
	_pulse += delta
	_hover_clock += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return

	_sample_player_trail(delta)
	_update_follow(delta)
	_update_animation(delta)
	queue_redraw()

func _sample_player_trail(delta: float) -> void:
	_sample_clock -= delta
	if _sample_clock > 0.0:
		return
	_sample_clock = TRAIL_SAMPLE_INTERVAL
	_trail.push_front(_player.global_position)
	while _trail.size() > TRAIL_LENGTH:
		_trail.pop_back()

func _update_follow(delta: float) -> void:
	var player_distance: float = global_position.distance_to(_player.global_position)
	if player_distance > SNAP_DISTANCE:
		var player_facing: Vector2 = _player.get("facing") if _player.get("facing") is Vector2 else Vector2.DOWN
		global_position = _player.global_position - player_facing.normalized() * 38.0 + Vector2(-8.0, 10.0)
		_follow_velocity = Vector2.ZERO
		for index in range(_trail.size()):
			_trail[index] = _player.global_position
		if not _was_snapped:
			_spawn_snap_feedback()
		_was_snapped = true
		return
	_was_snapped = false

	var target_index: int = mini(TARGET_SAMPLE_INDEX, _trail.size() - 1)
	var trail_target: Vector2 = _trail[target_index] if target_index >= 0 else _player.global_position
	var toward_target: Vector2 = trail_target - global_position
	var distance: float = toward_target.length()
	if distance <= follow_distance * 0.72:
		_follow_velocity = _follow_velocity.move_toward(Vector2.ZERO, 420.0 * delta)
	else:
		var speed_factor: float = clampf((distance - follow_distance * 0.55) / 70.0, 0.30, 1.55)
		var desired_velocity: Vector2 = toward_target.normalized() * follow_speed * speed_factor
		_follow_velocity = _follow_velocity.move_toward(desired_velocity, 560.0 * delta)
	global_position += _follow_velocity * delta

func _update_animation(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	var moving: bool = _follow_velocity.length_squared() > 36.0
	if moving:
		_visual_facing = _follow_velocity.normalized()
		_anim_clock += delta
		if _anim_clock >= 0.12:
			_anim_clock = 0.0
			_anim_frame = (_anim_frame + 1) % 3
	else:
		_anim_frame = 1
		_anim_clock = 0.0
		var to_player: Vector2 = _player.global_position - global_position
		if to_player.length_squared() > 64.0:
			_visual_facing = to_player.normalized()
	_update_region()
	var hover: float = sin(_hover_clock * 3.2) * 1.45
	var speed_ratio: float = clampf(_follow_velocity.length() / maxf(1.0, follow_speed), 0.0, 1.0)
	_visual.position = Vector2(0.0, -8.0 + hover)
	_visual.rotation = clampf(_follow_velocity.x / maxf(1.0, follow_speed), -1.0, 1.0) * 0.045
	_visual.scale = Vector2.ONE * (1.0 + sin(_hover_clock * 2.4) * 0.018 + speed_ratio * 0.025)

func _update_region() -> void:
	if not is_instance_valid(_visual):
		return
	var row: int = 0
	if absf(_visual_facing.x) > absf(_visual_facing.y):
		row = 1 if _visual_facing.x < 0.0 else 2
	elif _visual_facing.y < 0.0:
		row = 3
	_visual.region_rect = Rect2(Vector2(_anim_frame * 32, row * 32), FRAME_SIZE)

func _spawn_snap_feedback() -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -8)
	scene.add_child(fx)
	fx.call("configure", "burst", Vector2.UP, Color("9d7bff"), "")

func _draw() -> void:
	if not _story_active:
		return
	var glow: float = 0.20 + sin(_pulse * 4.0) * 0.06
	var motion_glow: float = clampf(_follow_velocity.length() / maxf(1.0, follow_speed), 0.0, 1.0) * 0.10
	var visible_tails: int = mini(_tail_stage, 3)
	for tail_index in range(visible_tails):
		var angle: float = lerpf(-2.55, -0.58, float(tail_index) / maxf(1.0, float(visible_tails - 1)))
		var root := Vector2(-2, 1)
		var tip := Vector2(cos(angle), sin(angle)) * 17.0 + Vector2(-4, 2)
		draw_line(root, tip, Color(0.55, 0.36, 0.96, 0.24 + float(tail_index) * 0.05), 3.0)
		draw_circle(tip, 2.1, Color(0.25, 0.78, 0.79, 0.30))
	draw_circle(Vector2(0, 5), 13.0 + motion_glow * 9.0, Color(0.55, 0.36, 0.96, glow + motion_glow))
	draw_circle(Vector2(0, 4), 8.0, Color(0.25, 0.78, 0.79, 0.05 + motion_glow * 0.18))
	if _follow_velocity.length_squared() > 900.0:
		var trail_direction: Vector2 = -_follow_velocity.normalized()
		draw_line(Vector2(0, 2), trail_direction * 17.0 + Vector2(0, 2), Color(0.55, 0.36, 0.96, 0.28), 2.0)
		draw_line(Vector2(0, 4), trail_direction * 12.0 + Vector2(0, 4), Color(0.25, 0.78, 0.79, 0.22), 1.0)
