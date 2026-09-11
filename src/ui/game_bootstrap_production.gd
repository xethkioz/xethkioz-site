extends "res://src/ui/game_bootstrap.gd"

const IZRDRALAR_RUNTIME_SCENE := "res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn"

func world_scene_path() -> String:
	return IZRDRALAR_RUNTIME_SCENE

func _enter_world() -> void:
	GameState.set_world_checkpoint("M01", "start", Vector2.ZERO)
	if not SaveService.save_game({"intro_seen": true, "runtime": "m01_m05"}):
		EventBus.toast_requested.emit("No se pudo guardar el inicio de la partida.")
		return
	get_tree().change_scene_to_file(world_scene_path())

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	if not bool(loaded.get("intro_seen", false)):
		intro_index = 0
		_show_intro()
		return
	get_tree().change_scene_to_file(world_scene_path())
