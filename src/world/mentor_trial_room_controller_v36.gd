extends Node2D

const BACKGROUND := preload("res://assets/production/interiors/mentor_trial_room_v36.svg")
const PlayerScript := preload("res://src/player/player_controller_production.gd")
const XethkiozScript := preload("res://src/pets/xethkioz_companion_production.gd")
const TrialScript := preload("res://src/world/mentor_trial_controller_v36.gd")
const QuestScript := preload("res://src/quest/quest_manager_v36.gd")
const HudScript := preload("res://src/ui/hud_controller_v36.gd")
const PromptScript := preload("res://src/ui/interaction_prompt.gd")
const ReturnScript := preload("res://src/world/mentor_trial_return_v36.gd")

var player: CharacterBody2D

func _ready() -> void:
	_prepare_ci_fixture()
	_ensure_inputs()
	_build_background()
	_build_collisions()
	_spawn_player()
	_spawn_xethkioz()
	_spawn_quest()
	_spawn_trial()
	_spawn_return_hotspot()
	_spawn_ui()
	EventBus.toast_requested.emit("SALA DE LECTURA · %s" % _mentor_name(GameState.selected_mentor).to_upper())

func _prepare_ci_fixture() -> void:
	var test_mentor := OS.get_environment("XETHKIOZ_TEST_MENTOR").strip_edges().to_lower()
	if test_mentor.is_empty():
		return
	if not ["ashley", "fermin", "isabella", "gael"].has(test_mentor):
		push_error("Invalid XETHKIOZ_TEST_MENTOR: %s" % test_mentor)
		return
	GameState.choose_mentor(test_mentor)
	GameState.set_world_flag("xethkioz_first_intercept", true)
	GameState.set_quest_snapshot({
		"schema":"golden_v36",
		"state":14,
		"first_brote_defeated":true,
		"ambush_slime_defeated":true,
		"lake_rola_read":true,
		"lake_mela_read":true,
		"lake_val_started":true
	})

func _ensure_inputs() -> void:
	var actions := {
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"move_up": [KEY_W, KEY_UP],
		"move_down": [KEY_S, KEY_DOWN],
		"attack": [KEY_J],
		"dash": [KEY_SHIFT],
		"interact": [KEY_C],
		"ability_q": [KEY_Q],
		"ability_e": [KEY_E],
		"ability_r": [KEY_R],
		"ability_f": [KEY_F]
	}
	for action in actions.keys():
		if not InputMap.has_action(action):
			InputMap.add_action(action)
		for keycode in actions[action]:
			var exists := false
			for current in InputMap.action_get_events(action):
				if current is InputEventKey and current.physical_keycode == keycode:
					exists = true
			if not exists:
				var event := InputEventKey.new()
				event.physical_keycode = keycode
				InputMap.action_add_event(action, event)

func _build_background() -> void:
	var sprite := Sprite2D.new()
	sprite.name = "MentorTrialBackground"
	sprite.texture = BACKGROUND
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.position = Vector2(320, 180)
	sprite.z_index = -30
	add_child(sprite)

func _build_collisions() -> void:
	_add_wall(Rect2(24, 24, 592, 18))
	_add_wall(Rect2(24, 24, 16, 312))
	_add_wall(Rect2(600, 24, 16, 312))
	_add_wall(Rect2(24, 326, 250, 10))
	_add_wall(Rect2(366, 326, 250, 10))
	# La puerta superior es el objetivo del puzle, no un pasillo de salida.
	_add_wall(Rect2(266, 36, 108, 80))

func _add_wall(rect: Rect2) -> void:
	var body := StaticBody2D.new()
	body.collision_layer = 4
	body.collision_mask = 0
	body.position = rect.position + rect.size * 0.5
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(PlayerScript)
	player.position = Vector2(320, 292)
	var collision := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)
	add_child(player)

func _spawn_xethkioz() -> void:
	var pet := Node2D.new()
	pet.name = "Xethkioz"
	pet.set_script(XethkiozScript)
	pet.position = player.position + Vector2(-28, 18)
	add_child(pet)
	if pet.has_method("set_story_active"):
		pet.call("set_story_active", true, false)

func _spawn_quest() -> void:
	var quests := Node.new()
	quests.name = "QuestManager"
	quests.set_script(QuestScript)
	add_child(quests)

func _spawn_trial() -> void:
	var trial := Node2D.new()
	trial.name = "MentorTrial"
	trial.set_script(TrialScript)
	add_child(trial)
	trial.call("configure", GameState.selected_mentor)

func _spawn_return_hotspot() -> void:
	var exit := Node2D.new()
	exit.name = "ReturnToRefuge"
	exit.set_script(ReturnScript)
	exit.position = Vector2(320, 307)
	add_child(exit)

func _spawn_ui() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(HudScript)
	add_child(hud)

	var assist := CanvasLayer.new()
	assist.name = "AssistHUD"
	assist.layer = 20
	add_child(assist)
	var prompt := Control.new()
	prompt.name = "InteractionPrompt"
	prompt.set_script(PromptScript)
	prompt.position = Vector2(218, 218)
	prompt.size = Vector2(204, 24)
	prompt.configure(player)
	assist.add_child(prompt)

func _mentor_name(id_value: String) -> String:
	return {
		"ashley":"Ashley",
		"fermin":"Fermín",
		"isabella":"Isabella",
		"gael":"Gael"
	}.get(id_value, "Sin mentor")
