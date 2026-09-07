extends "res://scripts/main_v13.gd"

# v0.9.1 — Scenic pass for Steam Demo maps 1–15.

const BG_PLAINS: Texture2D = preload("res://assets/v09/generated/izrdalar_plains_bg.png")
const BG_CISM: Texture2D = preload("res://assets/v09/generated/first_cism_bg.png")
const PROP_TREE: Texture2D = preload("res://assets/v09/generated/quebracho_prop.png")
const PROP_RUIN: Texture2D = preload("res://assets/v09/generated/ruin_arch_prop.png")
const PROP_CRYSTALS: Texture2D = preload("res://assets/v09/generated/crystal_cluster_prop.png")

func _generate_level(map_no: int) -> void:
	super._generate_level(map_no)
	if map_no >= 1 and map_no <= 15:
		_add_demo_scenery(map_no)

func _add_demo_scenery(map_no: int) -> void:
	if not world: return
	var texture: Texture2D = BG_IZRDRALAR if map_no <= 5 else (BG_PLAINS if map_no <= 10 else BG_CISM)
	var tint: Color = _scenic_tint(map_no)
	for i in range(3):
		var bg := Sprite2D.new()
		bg.texture = texture
		bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		bg.centered = false
		bg.position = Vector2(float(i)*1280.0,0.0)
		bg.scale = Vector2(4.0,4.0)
		bg.modulate = tint
		bg.z_index = -92
		world.add_child(bg)

	# Reusable original props. They are decorative only; collisions remain authored by the level layout.
	var prop_positions: Array[float] = [260.0,690.0,1160.0,1580.0,2060.0,2520.0,2980.0]
	for i in range(prop_positions.size()):
		var x: float = prop_positions[i]+float((map_no*37+i*53)%90)-45.0
		if (i+map_no)%2 == 0:
			_add_prop(PROP_TREE,Vector2(x,GROUND_Y-72.0),Vector2(1.55,1.55),-14,Color(0.90,1.0,0.94,0.94))
		else:
			_add_prop(PROP_RUIN,Vector2(x,GROUND_Y-72.0),Vector2(1.55,1.55),-13,Color(0.92,0.94,1.0,0.92))
		if (i+map_no)%3 == 0:
			_add_prop(PROP_CRYSTALS,Vector2(x+64.0,GROUND_Y-30.0),Vector2(1.7,1.7),-8,Color(1,1,1,0.96))

	# Block identity overlays: greener first block, dusty/ruined second block, darker cism third block.
	var veil := Polygon2D.new()
	veil.z_index = -70
	veil.polygon = PackedVector2Array([Vector2(-100,-100),Vector2(3400,-100),Vector2(3400,720),Vector2(-100,720)])
	if map_no <= 5:
		veil.color = Color(0.06,0.20,0.12,0.05)
	elif map_no <= 10:
		veil.color = Color(0.20,0.12,0.04,0.07)
	else:
		veil.color = Color(0.14,0.05,0.22,0.10)
	world.add_child(veil)

func _add_prop(texture: Texture2D,pos: Vector2,scale_value: Vector2,z: int,tint: Color) -> void:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.centered = false
	sprite.position = pos
	sprite.scale = scale_value
	sprite.modulate = tint
	sprite.z_index = z
	world.add_child(sprite)

func _scenic_tint(map_no: int) -> Color:
	match map_no:
		1: return Color(1.02,0.96,0.88,1.0)
		2: return Color(1.00,1.00,0.96,1.0)
		3: return Color(0.88,0.93,1.02,1.0)
		4: return Color(0.64,0.72,0.94,1.0)
		5: return Color(0.82,0.70,0.94,1.0)
		6,7: return Color(1.00,0.98,0.88,1.0)
		8: return Color(0.96,0.90,0.80,1.0)
		9: return Color(0.84,0.88,0.95,1.0)
		10: return Color(0.82,0.74,0.94,1.0)
		11,12: return Color(0.82,0.86,0.96,1.0)
		13: return Color(0.78,0.74,0.90,1.0)
		14: return Color(0.70,0.68,0.86,1.0)
		15: return Color(0.76,0.60,0.88,1.0)
	return Color.WHITE
