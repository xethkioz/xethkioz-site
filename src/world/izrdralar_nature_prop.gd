class_name IzrdralarNatureProp
extends Node2D

# Prop visual-only. La taxonomía (árboles, birches, arbustos, tocones y rocas)
# parte de la biblioteca Environment/Forest de Drive; el dibujo es original de
# World of Xethkioz y no carga/copia pixels XNB externos.

var prop_kind := "tree_canopy"
var palette_id := "cuenca"
var variant_seed := 1
var prop_scale := 1.0
var _phase := 0.0
var _rng := RandomNumberGenerator.new()

func configure(kind_value: String, palette_value: String, seed_value: int, scale_value: float = 1.0) -> void:
	prop_kind = kind_value
	palette_id = palette_value
	variant_seed = seed_value
	prop_scale = scale_value
	_rng.seed = variant_seed
	queue_redraw()

func _ready() -> void:
	# Pass 11 sits above terrain and below actors. It remains visual-only.
	z_index = 1
	_phase = float(variant_seed % 37) * 0.17
	set_process(prop_kind in ["tree_canopy", "tree_birch", "bush_dense", "bush_flower"])
	queue_redraw()

func _process(delta: float) -> void:
	_phase += delta * (0.72 + float(variant_seed % 5) * 0.055)
	queue_redraw()

func _draw() -> void:
	var p: Dictionary = _palette()
	match prop_kind:
		"tree_canopy": _draw_tree_canopy(p)
		"tree_birch": _draw_tree_birch(p)
		"bush_dense": _draw_bush(p, false)
		"bush_flower": _draw_bush(p, true)
		"stump": _draw_stump(p)
		"rock_small": _draw_rock(p, false)
		"rock_large": _draw_rock(p, true)
		"fallen_branch": _draw_fallen_branch(p)
		_: _draw_bush(p, false)

func _palette() -> Dictionary:
	match palette_id:
		"alba":
			return {"leaf":Color("4c7a4a"), "leaf_dark":Color("315b39"), "leaf_light":Color("79a85d"), "wood":Color("77513c"), "wood_dark":Color("51392f"), "rock":Color("726c65"), "rock_light":Color("99927f"), "accent":Color("d9b15f")}
		"lago":
			return {"leaf":Color("3f7660"), "leaf_dark":Color("28564c"), "leaf_light":Color("6ca781"), "wood":Color("684f43"), "wood_dark":Color("44352f"), "rock":Color("60787a"), "rock_light":Color("8da3a0"), "accent":Color("67d1c5")}
		"ruinas":
			return {"leaf":Color("455d49"), "leaf_dark":Color("303f37"), "leaf_light":Color("667c59"), "wood":Color("625047"), "wood_dark":Color("40342f"), "rock":Color("67616e"), "rock_light":Color("91879b"), "accent":Color("9d78c7")}
		_:
			return {"leaf":Color("396b43"), "leaf_dark":Color("244d35"), "leaf_light":Color("629256"), "wood":Color("6d4936"), "wood_dark":Color("493127"), "rock":Color("666a63"), "rock_light":Color("929486"), "accent":Color("8b5cf6")}

func _draw_tree_canopy(p: Dictionary) -> void:
	var s: float = prop_scale
	var sway: float = sin(_phase) * 1.15 * s
	_draw_shadow(Vector2(0, 5*s), Vector2(25*s, 7*s))
	draw_rect(Rect2(-6*s, -32*s, 12*s, 38*s), p.wood_dark, true)
	draw_rect(Rect2(-3*s, -34*s, 7*s, 39*s), p.wood, true)
	draw_line(Vector2(-2*s,-19*s), Vector2(-15*s+sway,-31*s), p.wood_dark, 4*s)
	draw_line(Vector2(2*s,-23*s), Vector2(15*s+sway,-38*s), p.wood_dark, 4*s)
	var centers: Array[Vector2] = [Vector2(-17,-43),Vector2(0,-53),Vector2(18,-44),Vector2(-7,-35),Vector2(10,-31)]
	for i in range(centers.size()):
		var c: Vector2 = centers[i] * s + Vector2(sway * (0.55 + i*0.07),0)
		var radius: float = (16.0 + float((variant_seed + i) % 4) * 2.1) * s
		draw_circle(c, radius+2*s, p.leaf_dark)
		draw_circle(c + Vector2(-2*s,-2*s), radius, p.leaf)
		draw_circle(c + Vector2(-5*s,-6*s), radius*0.43, p.leaf_light)
		if i % 2 == 0:
			draw_circle(c + Vector2(radius*0.45, radius*0.2), 2.0*s, p.accent.darkened(0.12))

func _draw_tree_birch(p: Dictionary) -> void:
	var s: float = prop_scale
	var sway: float = sin(_phase+0.8) * 1.35*s
	_draw_shadow(Vector2(0,5*s), Vector2(19*s,6*s))
	var bark := Color("d8d4c2")
	var bark_shadow := Color("97968b")
	draw_rect(Rect2(-4*s,-39*s,8*s,44*s), bark_shadow, true)
	draw_rect(Rect2(-2*s,-40*s,6*s,44*s), bark, true)
	for y in [-31,-21,-12]:
		draw_rect(Rect2(-3*s,float(y)*s,5*s,2*s), p.wood_dark, true)
	var centers: Array[Vector2] = [Vector2(-9,-48),Vector2(5,-55),Vector2(13,-44),Vector2(-14,-36)]
	for i in range(centers.size()):
		var c: Vector2 = centers[i]*s + Vector2(sway,0)
		var r: float = (12.0 + float(i%2)*2.0)*s
		draw_circle(c,r+1*s,p.leaf_dark)
		draw_circle(c+Vector2(-1*s,-2*s),r,p.leaf_light if i==1 else p.leaf)

func _draw_bush(p: Dictionary, flowers: bool) -> void:
	var s: float = prop_scale
	var sway: float = sin(_phase) * 0.65*s
	_draw_shadow(Vector2(0,3*s), Vector2(17*s,5*s))
	var centers: Array[Vector2] = [Vector2(-12,-5),Vector2(0,-10),Vector2(12,-4),Vector2(-5,1),Vector2(7,2)]
	for i in range(centers.size()):
		var c: Vector2 = centers[i]*s + Vector2(sway*(0.4+i*0.08),0)
		var r: float = (8.5+float((variant_seed+i)%3))*s
		draw_circle(c,r+1*s,p.leaf_dark)
		draw_circle(c+Vector2(-1*s,-2*s),r,p.leaf)
		draw_circle(c+Vector2(-3*s,-4*s),r*0.34,p.leaf_light)
	if flowers:
		for i in range(4):
			var x: float = (-10.0 + float(i)*7.0 + float((variant_seed+i)%3))*s
			var y: float = (-8.0 + float((variant_seed+i*3)%7))*s
			draw_circle(Vector2(x,y),1.8*s,p.accent)
			draw_circle(Vector2(x-0.7*s,y-0.6*s),0.7*s,Color("f4e9c6"))

func _draw_stump(p: Dictionary) -> void:
	var s: float = prop_scale
	_draw_shadow(Vector2(0,4*s),Vector2(13*s,4*s))
	draw_rect(Rect2(-10*s,-11*s,20*s,14*s),p.wood_dark,true)
	draw_rect(Rect2(-8*s,-10*s,16*s,13*s),p.wood,true)
	_draw_ellipse_shape(Vector2(0,-10*s),Vector2(10*s,4*s),p.wood_dark)
	_draw_ellipse_shape(Vector2(0,-11*s),Vector2(8*s,3*s),Color("a47b54"))
	draw_arc(Vector2(0,-11*s),4*s,0,TAU,14,p.wood_dark,1*s)
	draw_line(Vector2(-8*s,-5*s),Vector2(-14*s,1*s),p.wood_dark,3*s)
	draw_line(Vector2(8*s,-4*s),Vector2(14*s,2*s),p.wood_dark,3*s)

func _draw_rock(p: Dictionary, large: bool) -> void:
	var s: float = prop_scale*(1.35 if large else 1.0)
	_draw_shadow(Vector2(0,4*s),Vector2(15*s,5*s))
	var pts := PackedVector2Array([Vector2(-14,2),Vector2(-11,-10),Vector2(-3,-16),Vector2(9,-13),Vector2(15,-3),Vector2(11,6),Vector2(-7,7)])
	for i in range(pts.size()): pts[i] *= s
	draw_colored_polygon(pts,p.rock)
	var hi := PackedVector2Array([Vector2(-9,-8),Vector2(-2,-13),Vector2(7,-10),Vector2(3,-4),Vector2(-5,-4)])
	for i in range(hi.size()): hi[i] *= s
	draw_colored_polygon(hi,p.rock_light)
	draw_line(Vector2(-2*s,-13*s),Vector2(-5*s,-4*s),p.rock.darkened(0.22),1.4*s)
	if large:
		draw_circle(Vector2(7*s,0),2*s,p.accent.darkened(0.22))

func _draw_fallen_branch(p: Dictionary) -> void:
	var s: float = prop_scale
	_draw_shadow(Vector2(0,3*s),Vector2(22*s,4*s))
	draw_line(Vector2(-22*s,0),Vector2(22*s,-6*s),p.wood_dark,5*s)
	draw_line(Vector2(-20*s,-1*s),Vector2(20*s,-7*s),p.wood,2.6*s)
	draw_line(Vector2(-4*s,-3*s),Vector2(-11*s,-13*s),p.wood_dark,3*s)
	draw_line(Vector2(10*s,-5*s),Vector2(16*s,-14*s),p.wood_dark,3*s)

func _draw_shadow(center: Vector2, radii: Vector2) -> void:
	_draw_ellipse_shape(center,radii,Color(0,0,0,0.22))

func _draw_ellipse_shape(center: Vector2, radii: Vector2, color_value: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var a: float = TAU*float(i)/24.0
		points.append(center+Vector2(cos(a)*radii.x,sin(a)*radii.y))
	draw_colored_polygon(points,color_value)