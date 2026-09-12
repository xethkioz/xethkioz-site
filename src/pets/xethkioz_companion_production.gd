extends "res://src/pets/xethkioz_companion.gd"

const ApprovedVisualScript := preload("res://src/pets/xethkioz_approved_visual.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")
const TRAIL_SAMPLE_INTERVAL := 0.055
const TRAIL_LENGTH := 14
const TARGET_SAMPLE_INDEX := 6
const SNAP_DISTANCE := 190.0
const APPROVED_VISUAL_SCALE := 0.44

var _visual: Node2D
var _visual_facing := Vector2.DOWN
var _follow_velocity := Vector2.ZERO
var _trail: Array[Vector2] = []
var _sample_clock: float = 0.0
var _hover_clock: float = 0.0
var _was_snapped: bool = false

func _ready() -> void:
	super._ready()
	_visual = Node2D.new()
	# Preserve the production contract used by the visual-readiness gate while
	# rendering the approved P02 implementation inside this node.
	_visual.name = "XethkiozVisual"
	_visual.set_script(ApprovedVisualScript)
	_visual.position = Vector2(0.0, -3.0)
	_visual.scale = Vector2.ONE * APPROVED_VISUAL_SCALE
	_visual.z_index = 2
	add_child(_visual)
	_visual.call("set_tail_count", 3)
	_visual.call("set_rune_color", Color("8b5cf6"))
	for _index in range(TRAIL_LENGTH):
		_trail.append(global_position)

func _process(delta: float) -> void:
	_pulse += delta
	_hover_clock += delta
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return

	_sample_player_trail(delta)
	_update_follow(delta)
	_update_animation()
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

func _update_animation() -> void:
	if not is_instance_valid(_visual):
		return
	var moving: bool = _follow_velocity.length_squared() > 36.0
	if moving:
		_visual_facing = _follow_velocity.normalized()
	else:
		var to_player: Vector2 = _player.global_position - global_position
		if to_player.length_squared() > 64.0:
			_visual_facing = to_player.normalized()

	_visual.call("set_facing", _visual_facing)
	_visual.call("set_action", &"follow_run" if moving else &"idle_companion")
	var speed_ratio: float = clampf(_follow_velocity.length() / maxf(1.0, follow_speed), 0.0, 1.0)
	var breathe := 1.0 + sin(_hover_clock * 2.4) * 0.012
	_visual.scale = Vector2.ONE * (APPROVED_VISUAL_SCALE * breathe * (1.0 + speed_ratio * 0.018))
	_visual.rotation = clampf(_follow_velocity.x / maxf(1.0, follow_speed), -1.0, 1.0) * 0.025

func play_tail_swipe() -> void:
	if is_instance_valid(_visual):
		_visual.call("play_action", &"tail_swipe", 0.46)

func play_resonance_howl() -> void:
	if is_instance_valid(_visual):
		_visual.call("play_action", &"resonance_howl", 0.72)

func set_tail_count(value: int) -> void:
	if is_instance_valid(_visual):
		_visual.call("set_tail_count", value)

func flash_hurt() -> void:
	if is_instance_valid(_visual):
		_visual.call("flash_hurt")

func _spawn_snap_feedback() -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	IzrdralarFxFactory.spawn(scene, "xethkioz_snap", global_position + Vector2(0, -8), Vector2.UP)

func _draw() -> void:
	var glow: float = 0.16 + sin(_pulse * 4.0) * 0.05
	var motion_glow: float = clampf(_follow_velocity.length() / maxf(1.0, follow_speed), 0.0, 1.0) * 0.08
	draw_circle(Vector2(0, 5), 14.0 + motion_glow * 10.0, Color(0.55, 0.36, 0.96, glow + motion_glow))
	draw_circle(Vector2(0, 4), 9.0, Color(0.25, 0.78, 0.79, 0.04 + motion_glow * 0.15))
	if _follow_velocity.length_squared() > 900.0:
		var trail_direction: Vector2 = -_follow_velocity.normalized()
		draw_line(Vector2(0, 2), trail_direction * 20.0 + Vector2(0, 2), Color(0.55, 0.36, 0.96, 0.26), 2.0)
		draw_line(Vector2(0, 4), trail_direction * 14.0 + Vector2(0, 4), Color(0.25, 0.78, 0.79, 0.20), 1.0)
