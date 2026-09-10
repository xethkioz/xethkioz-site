extends "res://src/ui/hud_controller.gd"

const XETHKIOZ_SHEET := preload("res://assets/production/characters/xethkioz_sheet.svg")

func _build_ui() -> void:
	_make_panel(Vector2(8,8), Vector2(180,44), C_BG, C_VIOLET)
	hp_label = _make_label(Vector2(16,12), Vector2(164,11), "VIAJERO · NIVEL 1", 8, C_TEXT, true)
	_make_bar_back(Vector2(16,27), Vector2(122,6))
	hp_bar = _make_bar_fill(Vector2(16,27), Vector2(122,6), C_ORANGE)
	_make_bar_back(Vector2(16,38), Vector2(92,4))
	mana_bar = _make_bar_fill(Vector2(16,38), Vector2(92,4), C_VIOLET)
	progress_label = _make_label(Vector2(110,35), Vector2(68,10), "", 6, C_MUTED, false, HORIZONTAL_ALIGNMENT_RIGHT)

	_make_panel(Vector2(404,8), Vector2(228,48), C_BG_SOFT, C_ORANGE)
	quest_label = _make_label(Vector2(414,13), Vector2(208,36), "Misión", 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	quest_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(8,318), Vector2(154,34), C_BG, C_WATER)
	_make_xethkioz_icon(Vector2(10,319))
	_make_label(Vector2(43,322), Vector2(109,9), "XETHKIOZ", 6, Color("d8ceff"), true)
	familiar_label = _make_label(Vector2(43,334), Vector2(109,13), "Familiar · Ninguno", 5, C_TEXT, true)
	familiar_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(184,316), Vector2(272,36), C_BG, C_VIOLET)
	skill_name_labels["Q"] = _make_compact_skill(Vector2(192,321), "Q", "CORTE", C_VIOLET)
	skill_name_labels["E"] = _make_compact_skill(Vector2(257,321), "E", "GUARDIA", C_VIOLET)
	skill_name_labels["R"] = _make_compact_skill(Vector2(322,321), "R", "DESTELLO", C_VIOLET)
	skill_name_labels["F"] = _make_compact_skill(Vector2(387,321), "F", "BLOQ.", C_ORANGE)

	_make_panel(Vector2(474,320), Vector2(158,32), C_BG_SOFT, Color("244958"))
	world_label = _make_label(Vector2(482,324), Vector2(142,9), "", 6, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	lore_label = _make_label(Vector2(482,335), Vector2(142,8), "Atlas · Ecos 0/5", 5, C_VIOLET, false, HORIZONTAL_ALIGNMENT_RIGHT)
	inventory_label = _make_label(Vector2(482,344), Vector2(142,7), "", 5, C_ORANGE, false, HORIZONTAL_ALIGNMENT_RIGHT)

	toast_label = _make_label(Vector2(176,285), Vector2(288,18), "", 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	toast_label.visible = false

	dialog_panel = _make_panel(Vector2(44,246), Vector2(552,66), Color(0.025,0.028,0.045,0.96), C_VIOLET)
	dialog_panel.visible = false
	dialog_portrait = TextureRect.new()
	dialog_portrait.position = Vector2(52,253)
	dialog_portrait.size = Vector2(50,50)
	dialog_portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	dialog_portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	dialog_portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	dialog_portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dialog_portrait.visible = false
	dialog_portrait.z_index = 3
	add_child(dialog_portrait)
	dialog_label = _make_label(Vector2(112,252), Vector2(470,54), "", 7, C_TEXT)
	dialog_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	dialog_label.visible = false

func _make_xethkioz_icon(pos: Vector2) -> TextureRect:
	var atlas := AtlasTexture.new()
	atlas.atlas = XETHKIOZ_SHEET
	atlas.region = Rect2(32, 0, 32, 32)
	var icon := TextureRect.new()
	icon.position = pos
	icon.size = Vector2(32,32)
	icon.texture = atlas
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	icon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
	icon.z_index = 3
	add_child(icon)
	return icon

func _make_compact_skill(pos: Vector2, key: String, name: String, accent: Color) -> Label:
	var panel := _make_panel(pos, Vector2(57,26), Color(0.09,0.075,0.12,0.96), accent)
	panel.z_index = 1
	var key_label := _make_label(pos + Vector2(4,3), Vector2(14,9), key, 7, C_TEXT, true)
	key_label.z_index = 2
	var status_label := _make_label(pos + Vector2(19,3), Vector2(33,9), "", 5, C_MUTED, true, HORIZONTAL_ALIGNMENT_RIGHT)
	status_label.z_index = 2
	skill_status_labels[key] = status_label
	var skill_label := _make_label(pos + Vector2(4,15), Vector2(48,8), name, 5, accent, true, HORIZONTAL_ALIGNMENT_RIGHT)
	skill_label.z_index = 2
	return skill_label
