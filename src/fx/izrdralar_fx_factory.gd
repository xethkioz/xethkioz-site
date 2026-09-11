class_name IzrdralarFxFactory
extends RefCounted

const WorldFeedbackFx := preload("res://src/fx/world_feedback_fx.gd")

const PALETTE := {
	"amber": Color("ff8c42"),
	"violet": Color("8b5cf6"),
	"violet_hi": Color("d8ceff"),
	"cyan": Color("6ed4e8"),
	"wetland": Color("3fc7c9"),
	"hurt": Color("ff6b6b"),
	"heal": Color("8fcf78"),
	"shadow": Color("0a0a0f")
}

static func spawn(parent: Node, effect_id: String, world_position: Vector2, direction: Vector2 = Vector2.RIGHT, color_override: Color = Color.TRANSPARENT, text_value: String = "") -> Node2D:
	if parent == null:
		return null
	var spec: Dictionary = _spec(effect_id)
	var fx: Node2D = WorldFeedbackFx.new() as Node2D
	parent.add_child(fx)
	fx.global_position = world_position
	var selected_color: Color = color_override if color_override != Color.TRANSPARENT else spec["color"]
	fx.call("configure", str(spec["kind"]), direction, selected_color, text_value)
	return fx

static func _spec(effect_id: String) -> Dictionary:
	match effect_id:
		"player_slash":
			return {"kind": "slash", "color": PALETTE["amber"]}
		"player_burst":
			return {"kind": "burst", "color": PALETTE["violet"]}
		"player_line":
			return {"kind": "line", "color": PALETTE["cyan"]}
		"player_ward":
			return {"kind": "rune", "color": PALETTE["violet"]}
		"player_hurt":
			return {"kind": "hurt", "color": PALETTE["hurt"]}
		"player_pickup":
			return {"kind": "pickup", "color": PALETTE["heal"]}
		"enemy_ward":
			return {"kind": "telegraph", "color": PALETTE["amber"]}
		"enemy_line":
			return {"kind": "line", "color": PALETTE["cyan"]}
		"enemy_slash":
			return {"kind": "slash", "color": PALETTE["amber"]}
		"enemy_hit":
			return {"kind": "hit", "color": PALETTE["amber"]}
		"enemy_death":
			return {"kind": "death", "color": PALETTE["violet"]}
		"boss_phase":
			return {"kind": "burst", "color": PALETTE["violet_hi"]}
		"boss_hit":
			return {"kind": "hit", "color": PALETTE["amber"]}
		"boss_death":
			return {"kind": "death", "color": PALETTE["violet_hi"]}
		"boss_telegraph":
			return {"kind": "telegraph", "color": PALETTE["violet"]}
		_:
			return {"kind": "hit", "color": PALETTE["violet"]}
