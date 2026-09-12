class_name IzrdralarRouteObjective
extends Node2D

@export var objective_id: String = ""
@export var display_name: String = "Resonancia"
@export var world_flag: String = ""
@export var requires_flag: String = ""
@export var unlock_prism_step := false
@export var completed_message: String = "La Resonancia quedó estabilizada."
@export var blocked_message: String = "Todavía no podés estabilizar este punto."
@export var accent := Color("8b5cf6")
@export var xp_reward: int = 0

var _pulse := 0.0

func configure(data: Dictionary) -> void:
	objective_id = str(data.get("id", objective_id))
	display_name = str(data.get("name", display_name))
	world_flag = str(data.get("world_flag", world_flag))
	requires_flag = str(data.get("requires_flag", requires_flag))
	unlock_prism_step = bool(data.get("unlock_prism_step", unlock_prism_step))
	completed_message = str(data.get("completed_message", completed_message))
	blocked_message = str(data.get("blocked_message", blocked_message))
	xp_reward = maxi(0, int(data.get("xp_reward", authored_xp_reward(objective_id))))
	var color_value := str(data.get("accent", ""))
	if not color_value.is_empty():
		accent = Color(color_value)
	queue_redraw()

func _ready() -> void:
	add_to_group("interactable")
	add_to_group("izrdralar_route_objective")
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	queue_redraw()

func interaction_label() -> String:
	if not world_flag.is_empty() and GameState.has_world_flag(world_flag):
		return "%s · estabilizado" % display_name
	return "Estabilizar · %s" % display_name

func interact(_actor: Node) -> void:
	if not requires_flag.is_empty() and not GameState.has_world_flag(requires_flag):
		EventBus.toast_requested.emit(blocked_message)
		return
	if not world_flag.is_empty() and GameState.has_world_flag(world_flag):
		EventBus.toast_requested.emit("%s ya está estabilizado." % display_name)
		return
	if not world_flag.is_empty():
		GameState.set_world_flag(world_flag)
	if unlock_prism_step:
		GameState.unlock_prism_step()
	if xp_reward > 0:
		GameState.add_xp(xp_reward)
	var reward_suffix := " · +%d XP" % xp_reward if xp_reward > 0 else ""
	if SaveService.save_game({"objective_id": objective_id, "objective_xp": xp_reward}):
		EventBus.toast_requested.emit(completed_message + reward_suffix)
	else:
		EventBus.toast_requested.emit("Objetivo resuelto%s, pero el guardado falló." % reward_suffix)
	queue_redraw()

static func authored_xp_reward(id_value: String) -> int:
	# These rewards deliberately keep both authored route orders convergent.
	# M01+M02 = 38 objective XP; M03 = 30; M04 = 35; M05 stabilization = 50.
	# Combat/lore remain additional sources, but story/puzzle progress now also
	# advances the character instead of making combat the only meaningful XP path.
	match id_value:
		"m01_opening_resonance":
			return 18
		"m02_prisma_atlas":
			return 20
		"m03_lake_resonance":
			return 30
		"m04_sanctuary_resonance":
			return 35
		"m05_stabilization":
			return 50
		_:
			return 0

func _draw() -> void:
	var done := not world_flag.is_empty() and GameState.has_world_flag(world_flag)
	var breathe := 0.5 + 0.5 * sin(_pulse * 3.0)
	var ring_color := Color("8fcf78") if done else accent
	var fill_alpha := 0.08 if done else 0.10 + breathe * 0.07
	draw_circle(Vector2.ZERO, 18.0, Color(ring_color.r, ring_color.g, ring_color.b, fill_alpha))
	draw_arc(Vector2.ZERO, 18.0 + breathe * 2.0, 0.0, TAU, 28, Color(ring_color.r, ring_color.g, ring_color.b, 0.75), 2.0)
	for index in range(4):
		var angle := TAU * float(index) / 4.0 + _pulse * 0.35
		draw_circle(Vector2.from_angle(angle) * 11.0, 2.0, Color("f0f0f5"))
