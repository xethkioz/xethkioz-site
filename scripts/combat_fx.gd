extends Node2D

var mode := "burst"
var tint := Color(0.65,0.35,1.0)
var radius := 120.0
var duration := 0.35
var age := 0.0
var facing := 1
var intensity := 1.0

func setup(effect_mode: String,effect_tint: Color,effect_radius: float,effect_duration: float = 0.35,effect_facing: int = 1,effect_intensity: float = 1.0) -> void:
	mode = effect_mode
	tint = effect_tint
	radius = effect_radius
	duration = maxf(0.08,effect_duration)
	facing = 1 if effect_facing >= 0 else -1
	intensity = effect_intensity
	z_index = 80
	queue_redraw()

func _process(delta: float) -> void:
	age += delta
	if age >= duration:
		queue_free()
		return
	queue_redraw()

func _fade_color(alpha: float) -> Color:
	return Color(tint.r,tint.g,tint.b,clampf(alpha,0.0,1.0))

func _draw() -> void:
	var t := clampf(age/duration,0.0,1.0)
	var alpha := (1.0-t)*0.92
	var col := _fade_color(alpha)
	match mode:
		"slash":
			var center_angle := 0.0 if facing > 0 else PI
			var rr := radius*(0.72+0.28*t)
			draw_arc(Vector2.ZERO,rr,center_angle-0.82,center_angle+0.82,16,col,5.0,false)
			draw_arc(Vector2.ZERO,rr*0.72,center_angle-0.64,center_angle+0.64,12,_fade_color(alpha*0.55),3.0,false)
		"arrow":
			for i in range(3):
				var yy := float(i-1)*9.0
				var reach := radius*(0.35+0.65*t)
				draw_line(Vector2(0,yy),Vector2(facing*reach,yy),col,3.0,false)
				draw_line(Vector2(facing*(reach-10.0),yy-5.0),Vector2(facing*reach,yy),col,2.0,false)
				draw_line(Vector2(facing*(reach-10.0),yy+5.0),Vector2(facing*reach,yy),col,2.0,false)
		"buff":
			var rr := radius*(0.65+0.35*t)
			draw_circle(Vector2.ZERO,rr,_fade_color(alpha*0.10),true)
			draw_arc(Vector2.ZERO,rr,0.0,TAU,24,col,4.0,false)
			for i in range(6):
				var a := float(i)/6.0*TAU + t
				var p := Vector2(cos(a),sin(a))*rr
				draw_circle(p,3.0*intensity,col,true)
		"chaos":
			var rr := radius*(0.45+0.55*t)
			draw_circle(Vector2.ZERO,rr,_fade_color(alpha*0.09),true)
			draw_arc(Vector2.ZERO,rr,0.0,TAU,20,col,4.0,false)
			for i in range(8):
				var a := float(i)/8.0*TAU + t*2.0
				draw_line(Vector2.ZERO,Vector2(cos(a),sin(a))*rr,col,2.0,false)
		_:
			var rr := radius*(0.30+0.70*t)
			draw_circle(Vector2.ZERO,rr,_fade_color(alpha*0.08),true)
			draw_arc(Vector2.ZERO,rr,0.0,TAU,24,col,4.0,false)
			draw_arc(Vector2.ZERO,rr*0.62,0.0,TAU,20,_fade_color(alpha*0.55),2.0,false)
