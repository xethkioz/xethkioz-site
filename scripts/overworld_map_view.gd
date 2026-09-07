extends Control

const OverworldData = preload("res://scripts/overworld_data.gd")

var completed_nodes: Array = []
var unlocked_nodes: Array = [1]
var demo_limit := 15

func setup(completed: Array,unlocked: Array,active_limit: int = 15) -> void:
	completed_nodes = completed.duplicate()
	unlocked_nodes = unlocked.duplicate()
	demo_limit = active_limit
	custom_minimum_size = Vector2(2200,1100)
	mouse_filter = Control.MOUSE_FILTER_PASS
	queue_redraw()

func _draw() -> void:
	# Background and macro-regions. Kept original and readable rather than copying a commercial overworld.
	draw_rect(Rect2(Vector2.ZERO,Vector2(2200,1100)),Color(0.025,0.035,0.09),true)
	_draw_region(Vector2(80,70),Vector2(860,660),Color(0.06,0.30,0.20),"IZRDRALAR",Color(0.50,1.0,0.72))
	_draw_region(Vector2(880,470),Vector2(760,540),Color(0.18,0.06,0.24),"DESFRALAR",Color(0.78,0.46,1.0))
	_draw_region(Vector2(1120,70),Vector2(880,360),Color(0.10,0.25,0.46),"XIOMALAR",Color(0.54,0.84,1.0))
	_draw_region(Vector2(1710,450),Vector2(390,260),Color(0.30,0.08,0.16),"ENSUEÑO",Color(1.0,0.38,0.54))
	_draw_region(Vector2(1560,760),Vector2(520,270),Color(0.37,0.20,0.06),"NIGZEN / FUTURO",Color(1.0,0.65,0.26))

	# Main route lines 1-32.
	for id in range(1,OverworldData.BASE_GAME_NODES):
		var a: Vector2 = OverworldData.node_position(id)
		var b: Vector2 = OverworldData.node_position(id+1)
		var active_line: bool = id+1 in unlocked_nodes or id in completed_nodes
		var c: Color = Color(0.34,0.82,1.0,0.9) if active_line else Color(0.28,0.30,0.40,0.65)
		draw_dashed_line(a,b,c,4.0,10.0)

	# Future projected connections as faint chains.
	for id in range(33,OverworldData.TOTAL_NODES):
		var a2: Vector2 = OverworldData.node_position(id)
		var b2: Vector2 = OverworldData.node_position(id+1)
		draw_dashed_line(a2,b2,Color(0.28,0.24,0.38,0.38),2.0,7.0)

	for id in range(1,OverworldData.TOTAL_NODES+1):
		_draw_node(id)

func _draw_region(pos: Vector2,size: Vector2,color: Color,label_text: String,label_color: Color) -> void:
	var rect := Rect2(pos,size)
	draw_style_box(_region_style(color),rect)
	draw_string(ThemeDB.fallback_font,pos+Vector2(24,38),label_text,HORIZONTAL_ALIGNMENT_LEFT,-1,24,label_color)

func _region_style(color: Color) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = Color(color.r,color.g,color.b,0.72)
	s.border_color = Color(color.lightened(0.30),0.78)
	s.set_border_width_all(3)
	s.corner_radius_top_left = 30
	s.corner_radius_top_right = 30
	s.corner_radius_bottom_left = 30
	s.corner_radius_bottom_right = 30
	return s

func _draw_node(id: int) -> void:
	var pos: Vector2 = OverworldData.node_position(id)
	var is_future: bool = id > OverworldData.BASE_GAME_NODES
	var is_demo_locked: bool = id > demo_limit and id <= OverworldData.BASE_GAME_NODES
	var is_completed: bool = id in completed_nodes
	var is_unlocked: bool = id in unlocked_nodes and id <= demo_limit
	var type: String = OverworldData.node_type(id)
	var radius: float = 15.0
	var fill := Color(0.26,0.27,0.34)
	var outline := Color(0.48,0.49,0.56)
	if is_completed:
		fill = Color(0.12,0.58,0.82)
		outline = Color(0.58,0.92,1.0)
	elif is_unlocked:
		fill = Color(0.42,0.24,0.72)
		outline = Color(0.84,0.62,1.0)
	elif is_future:
		fill = Color(0.14,0.12,0.18)
		outline = Color(0.30,0.27,0.36)
	elif is_demo_locked:
		fill = Color(0.17,0.19,0.26)
		outline = Color(0.38,0.40,0.48)
	if type == "boss":
		radius = 22.0
		if not is_future:
			fill = Color(0.58,0.11,0.12) if not is_completed else Color(0.62,0.34,0.05)
			outline = Color(1.0,0.52,0.25)
	elif type == "legendary":
		outline = Color(1.0,0.78,0.25)
	elif type == "secret":
		outline = Color(0.78,0.40,1.0)
	elif type == "guide":
		outline = Color(1.0,0.62,0.30)
	draw_circle(pos,radius,fill)
	draw_arc(pos,radius,0.0,TAU,28,outline,3.0)
	if id <= OverworldData.BASE_GAME_NODES:
		var number_color: Color = Color.WHITE if (is_unlocked or is_completed) else Color(0.68,0.70,0.76)
		draw_string(ThemeDB.fallback_font,pos+Vector2(-8,5),str(id),HORIZONTAL_ALIGNMENT_CENTER,16,12,number_color)
	elif id % 3 == 0:
		draw_circle(pos,3.5,Color(0.55,0.48,0.68,0.50))
