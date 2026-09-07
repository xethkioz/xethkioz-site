extends "res://scripts/player_v8.gd"

# Slightly stronger screen presence for the Golden Slice. The collider and
# movement remain unchanged; only presentation/camera are tuned.
func _ready() -> void:
	super._ready()
	var cam:=get_node_or_null("Camera2D") as Camera2D
	if cam:
		cam.zoom=Vector2(1.34,1.34)
		cam.position_smoothing_speed=9.0

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	if visual_sprite:
		if dash_timer>0.0: visual_sprite.scale=Vector2(1.95,1.66)
		else: visual_sprite.scale=Vector2(1.78,1.78)
