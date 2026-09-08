extends "res://scripts/player_v9.gd"

# Golden Slice production player.
# Canon rule: the Viajero has no air double-jump in maps 1–5.
# Alexis unlocks Impulso Prismático in Elida's first refuge after Boss 5.

var double_jump_unlocked_v10 := false

func _ready() -> void:
	super._ready()
	_sync_double_jump_unlock()

func _sync_double_jump_unlock() -> void:
	double_jump_unlocked_v10 = false
	if main_ref:
		double_jump_unlocked_v10 = bool(main_ref.state.get("double_jump_unlocked", false))
	if not double_jump_unlocked_v10:
		air_jumps = 0

func _physics_process(delta: float) -> void:
	# Refresh from save/state so the unlock works immediately after the first refuge.
	if main_ref:
		double_jump_unlocked_v10 = bool(main_ref.state.get("double_jump_unlocked", false))

	# player_v4 grants one air jump whenever grounded. Keeping air_jumps at zero
	# on the frame before leaving the floor prevents an unintended second jump.
	if not double_jump_unlocked_v10 and not is_on_floor():
		air_jumps = 0

	super._physics_process(delta)

	if not double_jump_unlocked_v10:
		air_jumps = 0
	else:
		air_jumps = clampi(air_jumps, 0, 1)

func unlock_double_jump() -> void:
	double_jump_unlocked_v10 = true
	air_jumps = 1
