extends "res://src/ui/hud_controller.gd"

# Compact 640x360 HUD for the authored Izrdralar production pass.
# All gameplay data is inherited from HudController; only composition changes.
# Numeric HP/MP readouts prevent the combat state from depending on color alone.

var hp_value_label: Label
var mana_value_label: Label

func _build_ui() -> void:
	_make_panel(Vector2(8, 8), Vector2(216, 44), C_BG, C_VIOLET)
	hp_label = _make_label(Vector2(15, 12), Vector2(112, 10), "VIAJERO · NIVEL 1", 7, C_TEXT, true)
	progress_label = _make_label(Vector2(132, 12), Vector2(82, 10), "", 5, C_MUTED, false, HORIZONTAL_ALIGNMENT_RIGHT)

	_make_bar_back(Vector2(15, 27), Vector2(130, 6))
	hp_bar = _make_bar_fill(Vector2(15, 27), Vector2(130, 6), C_ORANGE)
	hp_value_label = _make_label(Vector2(150, 24), Vector2(64, 10), "HP 100/100", 5, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)

	_make_bar_back(Vector2(15, 39), Vector2(100, 4))
	mana_bar = _make_bar_fill(Vector2(15, 39), Vector2(100, 4), C_VIOLET)
	mana_value_label = _make_label(Vector2(120, 35), Vector2(94, 10), "MP 80/80", 5, Color("d8ceff"), true, HORIZONTAL_ALIGNMENT_RIGHT)

	# Controls are intentionally not pinned to the center of the screen. Tutorial
	# prompts and context toasts own that information; the world stays readable.
	_make_panel(Vector2(452, 8), Vector2(180, 48), C_BG_SOFT, C_ORANGE)
	quest_label = _make_label(Vector2(461, 13), Vector2(162, 35), "Misión", 6, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	quest_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(8, 306), Vector2(150, 46), C_BG, C_WATER)
	_make_badge(Vector2(15, 313), 20, Color("244958"), C_VIOLET)
	_make_label(Vector2(42, 312), Vector2(105, 9), "XETHKIOZ", 6, Color("d8ceff"), true)
	familiar_label = _make_label(Vector2(15, 326), Vector2(132, 20), "Familiar · Ninguno", 5, C_TEXT, true)
	familiar_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(166, 314), Vector2(232, 38), C_BG, C_VIOLET)
	skill_name_labels["Q"] = _make_compact_skill(Vector2(173, 319), "Q", "CORTE", C_VIOLET)
	skill_name_labels["E"] = _make_compact_skill(Vector2(229, 319), "E", "GUARDIA", C_VIOLET)
	skill_name_labels["R"] = _make_compact_skill(Vector2(285, 319), "R", "DESTELLO", C_VIOLET)
	skill_name_labels["F"] = _make_compact_skill(Vector2(341, 319), "F", "BLOQ.", C_ORANGE)

	_make_panel(Vector2(406, 306), Vector2(226, 46), C_BG_SOFT, Color("244958"))
	world_label = _make_label(Vector2(415, 311), Vector2(208, 14), "", 6, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	lore_label = _make_label(Vector2(415, 329), Vector2(208, 8), "Atlas · Ecos 0/5", 5, C_VIOLET, false, HORIZONTAL_ALIGNMENT_RIGHT)
	inventory_label = _make_label(Vector2(415, 340), Vector2(208, 8), "", 5, C_ORANGE, false, HORIZONTAL_ALIGNMENT_RIGHT)

	toast_label = _make_label(Vector2(188, 282), Vector2(264, 18), "", 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	toast_label.visible = false

	dialog_panel = _make_panel(Vector2(48, 254), Vector2(544, 66), Color(0.025, 0.028, 0.045, 0.95), C_VIOLET)
	dialog_panel.visible = false
	dialog_portrait = TextureRect.new()
	dialog_portrait.position = Vector2(55, 260)
	dialog_portrait.size = Vector2(52, 52)
	dialog_portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	dialog_portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	dialog_portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	dialog_portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dialog_portrait.visible = false
	dialog_portrait.z_index = 3
	add_child(dialog_portrait)
	dialog_label = _make_label(Vector2(116, 260), Vector2(466, 52), "", 7, C_TEXT)
	dialog_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	dialog_label.visible = false

func _make_compact_skill(pos: Vector2, key: String, name: String, accent: Color) -> Label:
	var panel := _make_panel(pos, Vector2(50, 28), Color(0.09, 0.075, 0.12, 0.96), accent)
	panel.z_index = 1
	var key_label := _make_label(pos + Vector2(4, 2), Vector2(14, 9), key, 7, C_TEXT, true)
	key_label.z_index = 2
	var status_label := _make_label(pos + Vector2(19, 2), Vector2(26, 9), "", 5, C_MUTED, true, HORIZONTAL_ALIGNMENT_RIGHT)
	status_label.z_index = 2
	skill_status_labels[key] = status_label
	var skill_label := _make_label(pos + Vector2(4, 16), Vector2(42, 7), name, 5, accent, true, HORIZONTAL_ALIGNMENT_RIGHT)
	skill_label.z_index = 2
	return skill_label

func _on_health(current: float, maximum: float) -> void:
	var ratio := clampf(current / maxf(1.0, maximum), 0.0, 1.0)
	if hp_bar:
		hp_bar.size.x = 130.0 * ratio
		hp_bar.color = C_DANGER if ratio <= 0.30 else C_ORANGE
	if hp_value_label:
		hp_value_label.text = "HP %d/%d" % [roundi(current), roundi(maximum)]
		hp_value_label.add_theme_color_override("font_color", C_DANGER if ratio <= 0.30 else C_TEXT)

func _on_mana(current: float, maximum: float) -> void:
	_mana_current = current
	if mana_bar:
		mana_bar.size.x = 100.0 * clampf(current / maxf(1.0, maximum), 0.0, 1.0)
	if mana_value_label:
		mana_value_label.text = "MP %d/%d" % [roundi(current), roundi(maximum)]
	_update_skill_status()
