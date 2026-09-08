extends SceneTree

const ROOM_SCENE := "res://scenes/v34/MentorTrialRoom.tscn"

var _failed := false
var _game_state: Node

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	_game_state = root.get_node_or_null("GameState")
	if not is_instance_valid(_game_state):
		_fail("GameState autoload missing")
		quit(1)
		return

	for mentor in ["ashley", "fermin", "isabella", "gael"]:
		await _validate_mentor(mentor)
		if _failed:
			quit(1)
			return

	print("V3.6 mentor trial smoke PASSED")
	quit(0)

func _validate_mentor(mentor: String) -> void:
	if is_instance_valid(current_scene):
		current_scene.queue_free()
		await _wait_frames(2)

	_game_state.call("reset_new_game")
	_game_state.call("choose_mentor", mentor)
	_game_state.call("set_world_flag", "xethkioz_first_intercept", true)
	_game_state.call("set_quest_snapshot", {
		"schema":"golden_v36",
		"state":14,
		"first_brote_defeated":true,
		"ambush_slime_defeated":true,
		"lake_rola_read":true,
		"lake_mela_read":true,
		"lake_val_started":true
	})

	var packed: PackedScene = load(ROOM_SCENE) as PackedScene
	_require(packed != null, "Could not load MentorTrialRoom.tscn")
	if _failed:
		return
	var scene := packed.instantiate()
	root.add_child(scene)
	current_scene = scene
	await _wait_frames(8)

	var quest := scene.get_node_or_null("QuestManager")
	var trial := scene.get_node_or_null("MentorTrial")
	_require(is_instance_valid(quest), "%s room must instantiate QuestManager" % mentor)
	_require(is_instance_valid(trial), "%s room must instantiate MentorTrial" % mentor)
	_require(int(_game_state.call("get_quest_snapshot").get("state", -1)) == 14, "%s trial must start at state 14" % mentor)
	if _failed:
		return

	match mentor:
		"ashley":
			trial.call("_handle_pulse", 0)
			trial.call("_handle_pulse", 2)
			trial.call("_handle_pulse", 1)
		"fermin":
			var weight := Node2D.new()
			scene.add_child(weight)
			for _i in range(4):
				trial.call("_handle_counterweight", weight)
			await create_timer(0.35).timeout
		"isabella":
			var rune_a := Node2D.new()
			var rune_b := Node2D.new()
			scene.add_child(rune_a)
			scene.add_child(rune_b)
			trial.call("_handle_rune", 0, rune_a)
			trial.call("_handle_rune", 1, rune_b)
			await create_timer(0.35).timeout
		"gael":
			var target := Node2D.new()
			scene.add_child(target)
			trial.call("handle_target_hit", 1, target)
			trial.call("handle_target_hit", 0, target)
			trial.call("handle_target_hit", 2, target)

	await _wait_frames(6)
	_require(bool(_game_state.call("has_world_flag", "mentor_first_solution_%s" % mentor)), "%s solution flag missing" % mentor)
	_require(bool(_game_state.call("has_world_flag", "mentor_trial_room_open")), "%s must open the training door" % mentor)
	_require(int(_game_state.call("get_quest_snapshot").get("state", -1)) == 15, "%s solution must advance to state 15" % mentor)

func _wait_frames(count: int) -> void:
	for _i in range(count):
		await process_frame

func _require(condition: bool, message: String) -> void:
	if not condition:
		_fail(message)

func _fail(message: String) -> void:
	_failed = true
	push_error("V3.6 MENTOR TRIAL: %s" % message)
