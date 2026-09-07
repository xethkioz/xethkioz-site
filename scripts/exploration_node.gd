extends Node2D

var discovery_id := ""
var required_legendary := 0
var site_title := "Secreto"
var site_kind := "spirit"
var accent := Color(0.66,0.35,0.95)
var pulse := 0.0
var completed := false

func setup(id_value: String,legendary_index: int,title_value: String,kind_value: String,color_value: Color) -> void:
	discovery_id = id_value
	required_legendary = legendary_index
	site_title = title_value
	site_kind = kind_value
	accent = color_value
	_build_label()
	queue_redraw()

func _process(delta: float) -> void:
	pulse += delta
	queue_redraw()

func _build_label() -> void:
	var title := Label.new()
	title.position = Vector2(-92,-70)
	title.size = Vector2(184,26)
	title.text = site_title
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size",14)
	title.add_theme_color_override("font_color",accent.lightened(0.24))
	add_child(title)
	var hint := Label.new()
	hint.position = Vector2(-92,-47)
	hint.size = Vector2(184,22)
	hint.text = "G • PODER LEGENDARIO"
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.add_theme_font_size_override("font_size",10)
	hint.add_theme_color_override("font_color",Color(0.82,0.83,0.90))
	add_child(hint)

func complete() -> void:
	completed = true
	queue_redraw()
	var tween := create_tween()
	tween.tween_property(self,"modulate:a",0.0,0.32)
	tween.tween_callback(queue_free)

func _draw() -> void:
	var glow := 0.62 + sin(pulse*3.2)*0.14
	var c := Color(accent,glow)
	# Ancient pedestal / discovery marker.
	draw_rect(Rect2(-22,18,44,8),Color(0.12,0.13,0.19),true)
	draw_rect(Rect2(-15,4,30,16),Color(0.18,0.19,0.27),true)
	draw_circle(Vector2.ZERO,16.0,Color(c,0.13),false,3.0)
	draw_polygon(PackedVector2Array([Vector2(0,-17),Vector2(12,0),Vector2(0,17),Vector2(-12,0)]),PackedColorArray([c]))
	draw_circle(Vector2.ZERO,4.0,Color.WHITE)
	for i in range(4):
		var a := pulse*0.7 + TAU*float(i)/4.0
		draw_circle(Vector2(cos(a),sin(a))*24.0,2.0,Color(c,0.82))
