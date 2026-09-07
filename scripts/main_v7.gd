extends "res://scripts/main_v6.gd"

const PlayerV7Script = preload("res://scripts/player_v7.gd")

func _ready() -> void:
	super._ready()
	_bind("slide",KEY_S)
	_bind("slide",KEY_CTRL)
	_bind("slide",KEY_DOWN)

func _show_title() -> void:
	super._show_title()
	for node in menu_layer.get_children():
		if node is Label and node.text.begins_with("v0.5 COMBAT & COMPANIONS"):
			node.text = "v0.6 TRAVERSAL PASS • impulso retro • slide • wall bounce • stomp • cámara dinámica"

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.set_script(PlayerV7Script)
	world.add_child(player)
	player.position = Vector2(120,520)
	var w: Dictionary = state.get("weapon",{})
	var a: Dictionary = state.get("armor",{})
	var c: Dictionary = state.get("charm",{})
	var pp := int(state.get("parenting_points",0))
	player.setup(self,100.0+float(a.get("power",1.0))*2.0+pp*2.0,float(w.get("power",1.0))+pp*0.12,float(a.get("power",1.0)),float(c.get("power",1.0)))
	var build: Dictionary = WorldData.hero(int(state.get("selected_hero",0))) if bool(state.get("mentor_chosen",false)) else WorldData.player_base()
	player.configure_hero(build)
	player.configure_traveler(str(state.get("player_name","Viajero")),int(state.get("player_palette",0)))
	player.finalize_combat_stats(str(build.get("class","Aprendiz Prismático")))
	player.died.connect(_on_player_died)

func traversal_slide_attack(pos: Vector2,facing_dir: int,power: float) -> void:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var delta: Vector2 = e.global_position-pos
		if abs(delta.y) < 42.0 and delta.x*facing_dir > -12.0 and delta.x*facing_dir < 58.0:
			e.take_damage(power)
			screen_shake(2.4,0.06)

func try_traversal_stomp(pos: Vector2,power: float) -> bool:
	for e in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(e): continue
		var delta: Vector2 = e.global_position-pos
		if abs(delta.x) <= 22.0 and delta.y >= 10.0 and delta.y <= 39.0:
			e.take_damage(power)
			screen_shake(3.0,0.07)
			return true
	return false

func update_hud() -> void:
	super.update_hud()
	if player and is_instance_valid(player) and player.has_method("traversal_speed_ratio"):
		var momentum := int(player.traversal_speed_ratio()*100.0)
		objective_label.text += "   •   IMPULSO %d%%   •   S/CTRL/↓ deslizar" % momentum
