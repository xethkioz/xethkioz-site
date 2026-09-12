class_name IzrdralarM01M05RuntimeVisualPass10
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass09.gd"

const GroundDecorScript := preload("res://src/world/izrdralar_authored_ground_decor.gd")
const AmbientAudioScript := preload("res://src/audio/izrdralar_ambient_audio.gd")
const LevelUpFeedbackBridgeScript := preload("res://src/world/izrdralar_level_up_feedback_bridge.gd")
const PauseMenuScript := preload("res://src/ui/izrdralar_pause_menu.gd")

# Pass 10 translates the useful *vocabulary* observed in the external reference
# folders (wear, inhabited thresholds/gardens, reeds, rubble, root fractures)
# into original Godot-drawn ground details. No external pixels or XNB resources
# are loaded by the runtime. It also mounts original procedural ambience and
# non-gameplay production UX layers.
func _ready() -> void:
	super._ready()
	_spawn_authored_ground_decor()
	_spawn_authored_ambience()
	_spawn_level_up_feedback_bridge()
	_spawn_pause_menu()

func _spawn_authored_ambience() -> void:
	var ambience := Node.new()
	ambience.name = "IzrdralarAmbientAudio"
	ambience.set_script(AmbientAudioScript)
	add_child(ambience)
	ambience.call("configure", map_id)

func _spawn_level_up_feedback_bridge() -> void:
	var bridge := Node.new()
	bridge.name = "LevelUpFeedbackBridge"
	bridge.set_script(LevelUpFeedbackBridgeScript)
	add_child(bridge)

func _spawn_pause_menu() -> void:
	var pause_menu := CanvasLayer.new()
	pause_menu.name = "PauseMenu"
	pause_menu.set_script(PauseMenuScript)
	add_child(pause_menu)

func _spawn_authored_ground_decor() -> void:
	var specs: Array[Dictionary] = []
	match map_id:
		"M01":
			specs = [
				{"kind":"trail", "position":Vector2(318, 758), "accent":Color("75806d"), "seed":101},
				{"kind":"pebbles", "position":Vector2(620, 548), "accent":Color("7d7564"), "seed":103},
				{"kind":"trail", "position":Vector2(735, 680), "accent":Color("675f59"), "seed":107}
			]
		"M02":
			specs = [
				{"kind":"plaza_wear", "position":Vector2(530, 500), "accent":Color("a98b68"), "seed":211},
				{"kind":"pebbles", "position":Vector2(430, 650), "accent":Color("8d7d68"), "seed":223},
				{"kind":"plaza_wear", "position":Vector2(715, 705), "accent":Color("947a62"), "seed":227},
				{"kind":"garden_patch", "position":Vector2(265, 490), "accent":Color("795f48"), "seed":229},
				{"kind":"garden_patch", "position":Vector2(760, 680), "accent":Color("725944"), "seed":233},
				{"kind":"doorstep", "position":Vector2(330, 472), "accent":Color("8a6a4d"), "seed":239},
				{"kind":"doorstep", "position":Vector2(705, 662), "accent":Color("846447"), "seed":241}
			]
		"M03":
			specs = [
				{"kind":"reeds", "position":Vector2(610, 590), "accent":Color("77a878"), "seed":307},
				{"kind":"reeds", "position":Vector2(820, 598), "accent":Color("6b9f83"), "seed":311},
				{"kind":"pebbles", "position":Vector2(565, 710), "accent":Color("608486"), "seed":313}
			]
		"M04":
			specs = [
				{"kind":"rubble", "position":Vector2(365, 310), "accent":Color("766878"), "seed":401},
				{"kind":"rubble", "position":Vector2(700, 635), "accent":Color("705f77"), "seed":409},
				{"kind":"plaza_wear", "position":Vector2(805, 790), "accent":Color("75647f"), "seed":419}
			]
		"M05":
			specs = [
				{"kind":"root_cracks", "position":Vector2(256, 220), "accent":Color("76506f"), "seed":503},
				{"kind":"root_cracks", "position":Vector2(256, 300), "accent":Color("62485e"), "seed":509}
			]

	for index in range(specs.size()):
		var spec: Dictionary = specs[index]
		var decor := Node2D.new()
		decor.name = "AuthoredGroundDecor_%02d_%s" % [index, str(spec["kind"])]
		decor.set_script(GroundDecorScript)
		decor.position = spec["position"]
		add_child(decor)
		decor.call("configure", str(spec["kind"]), spec["accent"], int(spec["seed"]))
