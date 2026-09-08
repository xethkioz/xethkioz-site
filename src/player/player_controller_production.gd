extends "res://src/player/player_controller.gd"

const SHEET := preload("res://assets/production/characters/viajero_sheet.svg")
const ProfileOverlayScript := preload("res://src/player/player_profile_overlay.gd")
const FRAME_SIZE := Vector2(32, 32)

var _visual: Sprite2D
var _profile_overlay: Node2D
var _anim_clock := 0.0
var _anim_frame := 1

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
	var body_scale: float = float([0.95, 1.0, 1.05][clampi(CharacterProfile.body_type, 0, 2)])
	_visual.scale = Vector2(body_scale, 1.0)
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
	_update_visual(delta)

func _update_visual(delta: float) -> void:
	if not is_instance_valid(_visual):
		return
	var moving: bool = velocity.length_squared() > 4.0
	if moving:
		_anim_clock += delta
		if _anim_clock >= 0.12:
			_anim_clock = 0.0
			_anim_frame = (_anim_frame + 1) % 3
	else:
		_anim_clock = 0.0
		_anim_frame = 1
	var row: int = 0
	if absf(facing.x) > absf(facing.y):
		row = 1 if facing.x < 0.0 else 2
	elif facing.y < 0.0:
		row = 3
	_visual.region_rect = Rect2(Vector2(_anim_frame * 32, row * 32), FRAME_SIZE)
	_visual.modulate = Color.WHITE

func _use_brote_vivo() -> void:
	var pieces: int = GameState.set_piece_count("brote_vivo")
	if pieces < 4:
		EventBus.toast_requested.emit("F bloqueada · Brote Vivo %d/4" % pieces)
		return
	if not _spend_and_start("F", 20.0, 60.0):
		return
	_heal(max_health * 0.25)
	EventBus.toast_requested.emit("Brote Vivo · Renovación")

func _draw() -> void:
	if _guard_time_left > 0.0:
		draw_arc(Vector2(0, -5), 18.0, 0.0, TAU, 24, Color("6ed4e8"), 2.0)
	if _dash_time_left > 0.0:
		var dash_color := Color("d8ceff") if GameState.prism_step_unlocked else Color("9d7bff")
		draw_arc(Vector2(0, -5), 16.0, 0.0, TAU, 24, dash_color, 2.0)
		if GameState.prism_step_unlocked:
			draw_line(-facing * 8.0, -facing * 26.0, Color(0.55, 0.36, 0.96, 0.72), 3.0)
