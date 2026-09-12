class_name IzrdralarM01M05RuntimeVisualPass11
extends "res://src/world/izrdralar_m01_m05_runtime_visual_pass10.gd"

const NaturePropScript := preload("res://src/world/izrdralar_nature_prop.gd")

# Visual Production Pass 11 — Nature vocabulary pass.
# Uses the useful taxonomy observed in Drive Environment/Forest (multiple tree,
# birch, bush, stump and rock families), but renders original Xethkioz props.
# No collision/navigation/gameplay changes in this pass.
func _ready() -> void:
	super._ready()
	_spawn_nature_pass11()

func _spawn_nature_pass11() -> void:
	var specs: Array[Dictionary] = []
	match map_id:
		"M01":
			specs = [
				{"kind":"tree_canopy","position":Vector2(245,610),"palette":"cuenca","seed":1101,"scale":1.05},
				{"kind":"tree_birch","position":Vector2(370,570),"palette":"cuenca","seed":1103,"scale":0.92},
				{"kind":"tree_canopy","position":Vector2(690,570),"palette":"cuenca","seed":1109,"scale":0.96},
				{"kind":"tree_canopy","position":Vector2(820,650),"palette":"cuenca","seed":1117,"scale":1.12},
				{"kind":"bush_dense","position":Vector2(295,690),"palette":"cuenca","seed":1123,"scale":0.82},
				{"kind":"bush_flower","position":Vector2(745,620),"palette":"cuenca","seed":1129,"scale":0.78},
				{"kind":"stump","position":Vector2(525,700),"palette":"cuenca","seed":1139,"scale":0.88},
				{"kind":"rock_large","position":Vector2(420,655),"palette":"cuenca","seed":1151,"scale":0.90},
				{"kind":"rock_small","position":Vector2(635,705),"palette":"cuenca","seed":1153,"scale":0.78},
				{"kind":"fallen_branch","position":Vector2(770,725),"palette":"cuenca","seed":1163,"scale":0.84}
			]
		"M02":
			specs = [
				{"kind":"tree_canopy","position":Vector2(225,430),"palette":"alba","seed":1201,"scale":0.88},
				{"kind":"tree_birch","position":Vector2(810,430),"palette":"alba","seed":1213,"scale":0.86},
				{"kind":"bush_flower","position":Vector2(285,500),"palette":"alba","seed":1217,"scale":0.70},
				{"kind":"bush_dense","position":Vector2(760,520),"palette":"alba","seed":1223,"scale":0.72},
				{"kind":"stump","position":Vector2(875,650),"palette":"alba","seed":1229,"scale":0.76},
				{"kind":"rock_small","position":Vector2(385,690),"palette":"alba","seed":1231,"scale":0.70}
			]
		"M03":
			specs = [
				{"kind":"tree_birch","position":Vector2(420,515),"palette":"lago","seed":1301,"scale":0.86},
				{"kind":"bush_dense","position":Vector2(745,550),"palette":"lago","seed":1303,"scale":0.72},
				{"kind":"rock_large","position":Vector2(845,520),"palette":"lago","seed":1307,"scale":0.80}
			]
		"M04":
			specs = [
				{"kind":"tree_canopy","position":Vector2(285,450),"palette":"ruinas","seed":1409,"scale":0.92},
				{"kind":"stump","position":Vector2(620,610),"palette":"ruinas","seed":1423,"scale":0.86},
				{"kind":"rock_large","position":Vector2(780,660),"palette":"ruinas","seed":1427,"scale":0.92}
			]

	for index in range(specs.size()):
		var spec: Dictionary = specs[index]
		var prop := Node2D.new()
		prop.name = "NaturePass11_%02d_%s" % [index, str(spec["kind"])]
		prop.set_script(NaturePropScript)
		prop.position = spec["position"]
		add_child(prop)
		prop.call("configure", str(spec["kind"]), str(spec["palette"]), int(spec["seed"]), float(spec["scale"]))
