extends Node

const BODY_NAMES := ["Ágil", "Equilibrado", "Robusto"]
const HAIR_NAMES := ["Corto", "Medio", "Largo", "Rasurado", "Trenzado", "Salvaje"]
const SKIN_COLORS := [
	Color("f2d1b3"), Color("dfb28f"), Color("c88f6a"),
	Color("a96f50"), Color("81513d"), Color("5f3a2d")
]
const HAIR_COLORS := [
	Color("1a1718"), Color("4b3026"), Color("8c5637"),
	Color("d6b06a"), Color("7d6b99"), Color("d9d9dd")
]
const ACCENT_COLORS := [
	Color("8b5cf6"), Color("ff8c42"), Color("3fc7c9"),
	Color("79b99a"), Color("d95c8c"), Color("d8b75b")
]

var player_name := "Viajero"
var body_type := 1
var skin_tone := 2
var hair_style := 0
var hair_color := 0
var accent_color := 0

func reset_default() -> void:
	player_name = "Viajero"
	body_type = 1
	skin_tone = 2
	hair_style = 0
	hair_color = 0
	accent_color = 0

func configure(name_value: String, body_value: int, skin_value: int, hair_style_value: int, hair_color_value: int, accent_value: int) -> void:
	var cleaned := name_value.strip_edges()
	player_name = cleaned.substr(0, 18) if not cleaned.is_empty() else "Viajero"
	body_type = posmod(body_value, BODY_NAMES.size())
	skin_tone = posmod(skin_value, SKIN_COLORS.size())
	hair_style = posmod(hair_style_value, HAIR_NAMES.size())
	hair_color = posmod(hair_color_value, HAIR_COLORS.size())
	accent_color = posmod(accent_value, ACCENT_COLORS.size())

func body_name() -> String:
	return BODY_NAMES[body_type]

func hair_name() -> String:
	return HAIR_NAMES[hair_style]

func skin_color_value() -> Color:
	return SKIN_COLORS[skin_tone]

func hair_color_value() -> Color:
	return HAIR_COLORS[hair_color]

func accent_color_value() -> Color:
	return ACCENT_COLORS[accent_color]

func to_dict() -> Dictionary:
	return {
		"player_name": player_name,
		"body_type": body_type,
		"skin_tone": skin_tone,
		"hair_style": hair_style,
		"hair_color": hair_color,
		"accent_color": accent_color
	}

func apply_dict(data: Dictionary) -> void:
	configure(
		str(data.get("player_name", "Viajero")),
		int(data.get("body_type", 1)),
		int(data.get("skin_tone", 2)),
		int(data.get("hair_style", 0)),
		int(data.get("hair_color", 0)),
		int(data.get("accent_color", 0))
	)
