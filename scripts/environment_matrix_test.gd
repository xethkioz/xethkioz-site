extends SceneTree

const EnvironmentData = preload("res://scripts/environment_data.gd")

func _initialize() -> void:
	if not EnvironmentData.validate_all():
		push_error("Environment matrix validation failed")
		quit(1)
		return
	var expected_blocks := {
		1:1,5:1,6:2,10:2,11:3,15:3,16:4,20:4,21:5,25:5,26:6,30:6,31:7,32:7
	}
	for map_no in expected_blocks.keys():
		var actual := EnvironmentData.block_for_map(int(map_no))
		if actual != int(expected_blocks[map_no]):
			push_error("Wrong block for map %d: %d" % [map_no,actual])
			quit(2)
			return
	for map_no in range(1,33):
		var p := EnvironmentData.profile_for_map(map_no)
		var e := EnvironmentData.enemy_variant_for_map(map_no)
		print("M%02d B%d %s | %s | %s | %s" % [map_no,int(p["block"]),str(p["biome"]),str(p["time"]),str(p["weather"]),str(e["label"])])
	print("Environment matrix: 32/32 profiles valid")
	quit(0)
