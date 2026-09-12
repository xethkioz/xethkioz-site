extends "res://src/player/player_controller.gd"

const SHEET := preload("res://assets/production/characters/viajero_sheet.svg")
const ProfileOverlayScript := preload("res://src/player/player_profile_overlay.gd")
const IzrdralarFxFactory := preload("res://src/fx/izrdralar_fx_factory.gd")
const FRAME_SIZE := Vector2(32, 32)
const ATTACK_POSE_DURATION := 0.18
const CAST_POSE_DURATION := 0.24

var _visual: Sprite2D
var _profile_overlay: Node2D
var _anim_clock: float = 0.0
var _anim_frame: int = 1
var _hit_flash_left: float = 0.0
var _attack_pose_left: float = 0.0
var _cast_pose_left: float = 0.0
var _body_scale: float = 1.0

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.name = "ViajeroVisual"
	_visual.texture = SHEET
	_visual.region_enabled = true
	_visual.region_rect = Rect2(Vector2(32, 0), FRAME_SIZE)
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.position = Vector2(0, -7)
	_visual.z_index = 2
	_body_scale = float([0.95, 1.0, 1.05][clampi(CharacterProfile.body_type, 0, 2)])
	_visual.scale = Vector2(_body_scale, 1.0)
	add_child(_visual)

	_profile_overlay = Node2D.new()
	_profile_overlay.name = "ProfileOverlay"
	_profile_overlay.set_script(ProfileOverlayScript)
	_profile_overlay.position = Vector2(0, -7)
	_profile_overlay.configure(self)
	add_child(_profile_overlay)
	_update_visual(0.0)

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	_hit_flash_left = maxf(0.0, _hit_flash_left - delta)
	_attack_pose_left = maxf(0.0, _attack_pose_left - delta)
	_cast_pose_left = maxf(0.0, _cast_pose_left - delta)
	_update_visual(delta)

func _update_visual(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	var moving: bool = velocity.length_squared() > 4.0
	if moving and _attack_pose_left <= 0.0 and _cast_pose_left <= 0.0:
		_anim_clock += delta
		var frame_time: float = 0.095 if _dash_time_left > 0.0 else 0.12
		if _anim_clock >= frame_time:
			_anim_clock = 0.0
			_anim_frame = (_anim_frame + 1) % 3
	else:
		_anim_clock = 0.0
		_anim_frame = 1
	var row: int = _direction_row(facing)
	_visual.region_rect = Rect2(Vector2(_anim_frame * 32, row * 32), FRAME_SIZE)
	_visual.modulate = Color(1.0, 0.62, 0.58, 1.0) if _hit_flash_left > 0.0 else Color.WHITE
	_apply_action_pose()

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
			return 1 # down-left
		if horizontal >= DIAGONAL_THRESHOLD:
			return 7 # down-right
		return 0 # down
	if vertical <= -DIAGONAL_THRESHOLD:
		if horizontal <= -DIAGONAL_THRESHOLD:
			return 3 # up-left
		if horizontal >= DIAGONAL_THRESHOLD:
			return 5 # up-right
		return 4 # up
	return 2 if horizontal < 0.0 else 6 # left / right

func _apply_action_pose() -> void:
	if not is_instance_valid(_visual):
		return
	var base_position := Vector2(0.0, -7.0)
	var visual_position: Vector2 = base_position
	var overlay_position: Vector2 = base_position
	var visual_rotation: float = 0.0
	var visual_scale := Vector2(_body_scale, 1.0)
	var overlay_scale := Vector2.ONE

	if _attack_pose_left > 0.0:
		var progress: float = 1.0 - clampf(_attack_pose_left / ATTACK_POSE_DURATION, 0.0, 1.0)
		var pulse: float = sin(progress * PI)
		var action_offset: Vector2 = facing * (4.0 * pulse)
		visual_position += action_offset
		overlay_position += action_offset
		visual_rotation = -facing.x * 0.10 * pulse
		visual_scale = Vector2(_body_scale * (1.0 + 0.06 * pulse), 1.0 - 0.04 * pulse)
		overlay_scale = Vector2(1.0 + 0.06 * pulse, 1.0 - 0.04 * pulse)
	elif _cast_pose_left > 0.0:
		var progress: float = 1.0 - clampf(_cast_pose_left / CAST_POSE_DURATION, 0.0, 1.0)
		var pulse: float = sin(progress * PI)
		var lift := Vector2(0.0, -2.5 * pulse)
		visual_position += lift
		overlay_position += lift
		visual_scale = Vector2(_body_scale * (1.0 + 0.035 * pulse), 1.0 + 0.035 * pulse)
		overlay_scale = Vector2.ONE * (1.0 + 0.035 * pulse)

	_visual.position = visual_position
	_visual.rotation = visual_rotation
	_visual.scale = visual_scale
	if is_instance_valid(_profile_overlay):
		_profile_overlay.position = overlay_position
		_profile_overlay.rotation = visual_rotation
		_profile_overlay.scale = overlay_scale

func _perform_melee_attack() -> void:
	_attack_pose_left = ATTACK_POSE_DURATION
	_cast_pose_left = 0.0
	var attack_direction: Vector2 = facing.normalized() if facing.length_squared() > 0.0001 else Vector2.DOWN
	# Tiny collision-aware lunge adds weight without turning the attack into a dash.
	move_and_collide(attack_direction * 3.0)
	var targets: Array = _damage_area(global_position + attack_direction * 28.0, 22.0, attack_damage)
	var accent: Color = CharacterProfile.accent_color_value()
	_spawn_feedback("slash", global_position + attack_direction * 17.0 + Vector2(0, -7), attack_direction, accent, "")
	if not targets.is_empty():
		_spawn_feedback("burst", global_position + attack_direction * 25.0 + Vector2(0, -7), attack_direction, accent.lightened(0.18), "")

func _use_ability(slot: String) -> void:
	var previous_mana: float = mana
	var previous_cooldown: float = float(_ability_cooldowns.get(slot, 0.0))
	super._use_ability(slot)
	var current_cooldown: float = float(_ability_cooldowns.get(slot, 0.0))
	var activated: bool = current_cooldown > previous_cooldown + 0.01 or mana < previous_mana - 0.01
	if activated:
		_cast_pose_left = CAST_POSE_DURATION
		_attack_pose_left = 0.0
		_spawn_ability_feedback(slot)

func _spawn_ability_feedback(slot: String) -> void:
	var mentor_id: String = GameState.selected_mentor
	var color_value: Color = _mentor_feedback_color(mentor_id)
	var kind_value: String = "burst"
	var world_position: Vector2 = global_position + Vector2(0, -7)

	if slot == "F":
		_spawn_feedback("regen", global_position + Vector2(0, -10), Vector2.UP, Color("8fcf78"), "")
		return

	match mentor_id:
		"ashley":
			match slot:
				"Q":
					kind_value = "wave"
					world_position += facing * 11.0
				"E":
					kind_value = "regen"
				"R":
					kind_value = "wave"
					world_position += facing * 6.0
		"fermin":
			match slot:
				"Q":
					kind_value = "slash"
					world_position += facing * 13.0
				"E":
					kind_value = "guard"
				"R":
					kind_value = "charge"
					world_position += facing * 10.0
		"isabella":
			match slot:
				"Q":
					kind_value = "mark"
					world_position += facing * 13.0
				"E":
					kind_value = "root"
					world_position += facing * 18.0
				"R":
					kind_value = "mark"
		"gael":
			match slot:
				"Q":
					kind_value = "shot"
					world_position += facing * 12.0
				"E":
					kind_value = "trap"
					world_position += facing * 24.0
				"R":
					kind_value = "charge"
					world_position += facing * 12.0
		_:
			match slot:
				"Q":
					kind_value = "line"
					world_position += facing * 12.0
				"E":
					kind_value = "guard"
				"R":
					kind_value = "burst"

	_spawn_feedback(kind_value, world_position, facing, color_value, "")

func _mentor_feedback_color(mentor_id: String) -> Color:
	match mentor_id:
		"ashley":
			return Color("6ed4e8")
		"fermin":
			return Color("ff8c42")
		"isabella":
			return Color("c686ff")
		"gael":
			return Color("8fcf78")
		_:
			return Color("9d7bff")

func take_damage(amount: float) -> void:
	if amount <= 0.0:
		return
	var impact_position: Vector2 = global_position + Vector2(0, -8)
	var applied: float = amount * (0.4 if _guard_time_left > 0.0 else 1.0)
	_hit_flash_left = 0.13
	health = maxf(0.0, health - applied)
	EventBus.player_health_changed.emit(health, max_health)
	_spawn_feedback("hurt", impact_position, -facing, Color("ff6b6b"), "-%d" % roundi(applied))
	if health > 0.0:
		return

	health = max_health
	mana = max_mana
	velocity = Vector2.ZERO
	var respawn_position := _safe_respawn_position()
	global_position = respawn_position
	GameState.set_world_checkpoint(GameState.current_map_id, GameState.current_entry_id, respawn_position)
	SaveService.save_game({"respawned": true, "respawn_map": GameState.current_map_id, "respawn_entry": GameState.current_entry_id})
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_mana_changed.emit(mana, max_mana)
	EventBus.toast_requested.emit("El Prisma te devuelve a la última entrada segura")

func _safe_respawn_position() -> Vector2:
	for node in get_tree().get_nodes_in_group("izrdralar_entry_point"):
		if node is Node2D and str(node.get_meta("entry_id", "")) == GameState.current_entry_id:
			return (node as Node2D).global_position
	if GameState.last_world_position != Vector2.ZERO:
		return GameState.last_world_position
	return global_position

func _use_brote_vivo() -> void:
	var pieces: int = GameState.set_piece_count("brote_vivo")
	if pieces < 4:
		EventBus.toast_requested.emit("F bloqueada · Brote Vivo %d/4" % pieces)
		return
	if not _spend_and_start("F", 20.0, 60.0):
		return
	_heal(max_health * 0.25)
	_cast_pose_left = CAST_POSE_DURATION
	_attack_pose_left = 0.0
	_spawn_feedback("regen", global_position + Vector2(0, -10), Vector2.UP, Color("8fcf78"), "+25% salud")
	EventBus.toast_requested.emit("Brote Vivo · Renovación")

func _spawn_feedback(kind_value: String, world_position: Vector2, direction_value: Vector2, color_value: Color, text_value: String) -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var effect_id: String = "player_%s" % kind_value
	IzrdralarFxFactory.spawn(scene, effect_id, world_position, direction_value, color_value, text_value)

func _draw() -> void:
	if _guard_time_left > 0.0:
		draw_arc(Vector2(0, -5), 18.0, 0.0, TAU, 24, Color("6ed4e8"), 2.0)
	if _dash_time_left > 0.0:
		var dash_color := Color("d8ceff") if GameState.prism_step_unlocked else Color("9d7bff")
		draw_arc(Vector2(0, -5), 16.0, 0.0, TAU, 24, dash_color, 2.0)
		if GameState.prism_step_unlocked:
			draw_line(-facing * 8.0, -facing * 26.0, Color(0.55, 0.36, 0.96, 0.72), 3.0)
