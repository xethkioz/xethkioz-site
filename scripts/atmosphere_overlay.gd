extends Control

var profile: Dictionary = {}
var t := 0.0
var flash := 0.0
var rng := RandomNumberGenerator.new()

func setup(env_profile: Dictionary) -> void:
	profile = env_profile.duplicate(true)
	rng.seed = 2150 + int(profile.get("map",1))*97
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	queue_redraw()

func _process(delta: float) -> void:
	t += delta
	var effect := str(profile.get("effect",""))
	if effect in ["storm","celestial_storm","reality_storm"]:
		if flash <= 0.0 and fmod(t + float(profile.get("map",1))*0.77,4.8) < 0.035:
			flash = 0.12
	if flash > 0.0:
		flash -= delta
	queue_redraw()

func _draw() -> void:
	var tint := Color.from_string(str(profile.get("tint","#ffffff")),Color.WHITE)
	var effect := str(profile.get("effect",""))
	var tint_alpha := 0.08
	if str(profile.get("time","")) in ["Noche","Medianoche","Eclipse","Sin tiempo","Oscuridad Total"]:
		tint_alpha = 0.18
	draw_rect(Rect2(Vector2.ZERO,size),Color(tint.r,tint.g,tint.b,tint_alpha))

	if effect in ["mist","toxic_mist","overcast","blackout","nightmare"]:
		for i in range(7):
			var y := fmod(float(i)*110.0 + t*(9.0+float(i)*1.5),760.0)-40.0
			var c := Color(0.75,0.82,0.90,0.055)
			if effect == "toxic_mist": c = Color(0.58,0.78,0.38,0.07)
			if effect == "nightmare": c = Color(0.62,0.28,0.68,0.08)
			draw_rect(Rect2(-40,y,1360,62),c)

	if effect in ["rain","storm","celestial_storm","spirit_storm","reality_storm"]:
		var count := 75 if effect == "rain" else 135
		for i in range(count):
			var x := fmod(float(i*83 + int(t*430.0)),1320.0)-20.0
			var y := fmod(float(i*47 + int(t*760.0)),760.0)-20.0
			var col := Color(0.66,0.82,1.0,0.34)
			if effect == "spirit_storm": col = Color(0.66,0.95,0.88,0.34)
			if effect == "reality_storm": col = Color(1.0,0.42,0.82,0.40)
			draw_line(Vector2(x,y),Vector2(x-8,y+22),col,1.0)

	if effect in ["snow","blizzard","whiteout"]:
		var count := 70 if effect == "snow" else 120
		for i in range(count):
			var x := fmod(float(i*91 + int(t*(28.0 + (i%5)*4.0))),1300.0)-10.0
			var y := fmod(float(i*59 + int(t*(80.0 + (i%7)*5.0))),740.0)-10.0
			draw_circle(Vector2(x,y),1.5 + float(i%3)*0.5,Color(0.93,0.97,1.0,0.50))

	if effect in ["motes","night_motes","spores","aurora","corruption","embers"]:
		for i in range(42):
			var x := fmod(float(i*101) + sin(t*0.7+i)*32.0,1280.0)
			var y := fmod(float(i*67) - t*(10.0+float(i%6)),720.0)
			var col := Color(0.72,0.88,1.0,0.38)
			if effect == "night_motes": col = Color(0.70,0.55,1.0,0.55)
			if effect == "spores": col = Color(0.55,1.0,0.62,0.42)
			if effect == "aurora": col = Color(0.58,0.92,0.86,0.40)
			if effect == "corruption": col = Color(0.90,0.38,1.0,0.45)
			if effect == "embers": col = Color(1.0,0.52,0.22,0.45)
			draw_circle(Vector2(x,y),1.5 + float(i%2),col)

	if effect in ["wind","dust","blizzard"]:
		for i in range(35):
			var x := fmod(float(i*111) + t*(90.0+float(i%5)*15.0),1320.0)-20.0
			var y := 80.0 + fmod(float(i*73),590.0)
			var col := Color(0.86,0.90,0.95,0.20)
			if effect == "dust": col = Color(0.78,0.63,0.42,0.28)
			draw_line(Vector2(x,y),Vector2(x+18,y-2),col,1.0)

	if flash > 0.0:
		draw_rect(Rect2(Vector2.ZERO,size),Color(0.88,0.90,1.0,minf(0.32,flash*2.2)))
