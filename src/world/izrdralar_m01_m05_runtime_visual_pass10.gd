class_name IzrdralarM01M05RuntimeVisualPass10
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass09.gd"

const GroundDecorScript := preload("res://src/world/izrdralar_authored_ground_decor.gd")

# Pass 10 translates the useful *vocabulary* observed in the external reference
# folders (wear, reeds, rubble, root fractures) into original Godot-drawn ground
# details. No external pixels or XNB resources are loaded by the runtime.
func _ready() -> void:
	super._ready()
	_spawn_authored_ground_decor()

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
				{"kind":"plaza_wear", "position":Vector2(715, 705), "accent":Color("947a62"), "seed":227}
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
