extends CanvasLayer

const C_BG := Color(0.039, 0.039, 0.059, 0.90)
const C_BG_SOFT := Color(0.039, 0.039, 0.059, 0.78)
const C_TEXT := Color("f0f0f5")
const C_MUTED := Color("9b9baa")
const C_VIOLET := Color("8b5cf6")
const C_ORANGE := Color("ff8c42")
const C_GREEN := Color("79b99a")
const C_WATER := Color("6ed4e8")
const DIALOG_PORTRAITS := preload("res://assets/production/characters/dialog_portraits.svg")
const PORTRAIT_INDEX := {
	"alexis": 0,
	"elida": 1,
	"ashley": 2,
	"fermin": 3,
	"fermín": 3,
	"isabella": 4,
	"gael": 5,
	"ivan": 6,
	"val": 7,
	"rola": 8,
	"mela": 9
}

var hp_label: Label
var hp_bar: ColorRect
var mana_bar: ColorRect
var progress_label: Label
var quest_label: Label
var world_label: Label
var familiar_label: Label
var lore_label: Label
var inventory_label: Label
var toast_label: Label
var dialog_panel: Panel
var dialog_label: Label
var dialog_portrait: TextureRect
var skill_name_labels: Dictionary = {}
var _toast_timer := 0.0
var _dialog_timer := 0.0
var _weather := "despejado"
var _hour := 8.0
var _lore_total_hint := 5

func _ready() -> void:
	_build_ui()
	EventBus.player_health_changed.connect(_on_health)
	EventBus.player_mana_changed.connect(_on_mana)
	EventBus.player_progress_changed.connect(_on_progress)
	EventBus.currency_changed.connect(_on_currency)
	EventBus.inventory_changed.connect(_on_inventory)
	EventBus.quest_changed.connect(_on_quest)
	EventBus.weather_changed.connect(_on_weather)
	EventBus.time_changed.connect(_on_time)
	EventBus.lore_discovered.connect(_on_lore_discovered)
	EventBus.familiar_captured.connect(_on_familiar_captured)
	EventBus.familiar_assessed.connect(_on_familiar_assessed)
	EventBus.active_familiar_changed.connect(_on_active_familiar_changed)
	EventBus.mentor_selected.connect(_on_mentor_selected)
	EventBus.toast_requested.connect(_on_toast)
	EventBus.dialog_requested.connect(_on_dialog)
	_on_progress(GameState.player_level, GameState.player_xp, GameState.xp_to_next())
	_on_currency(GameState.crystals)
	_on_inventory(InventoryService.stacks)
	_update_familiar_label()
	_update_lore_label()
	_update_world_label()
	_update_combat_loadout()

func _process(delta: float) -> void:
	_toast_timer = maxf(0.0, _toast_timer - delta)
	_dialog_timer = maxf(0.0, _dialog_timer - delta)
	if _toast_timer <= 0.0 and toast_label:
		toast_label.visible = false
	if _dialog_timer <= 0.0 and dialog_panel:
		dialog_panel.visible = false
		dialog_label.visible = false
		if dialog_portrait:
			dialog_portrait.visible = false

func _build_ui() -> void:
	_make_panel(Vector2(8,8), Vector2(190,50), C_BG, C_VIOLET)
	hp_label = _make_label(Vector2(16,13), Vector2(172,12), "VIAJERO · NIVEL 1", 8, C_TEXT, true)
	_make_bar_back(Vector2(16,29), Vector2(128,7))
	hp_bar = _make_bar_fill(Vector2(16,29), Vector2(128,7), C_ORANGE)
	_make_bar_back(Vector2(16,42), Vector2(96,5))
	mana_bar = _make_bar_fill(Vector2(16,42), Vector2(96,5), C_VIOLET)
	progress_label = _make_label(Vector2(116,37), Vector2(72,12), "", 6, C_MUTED, false, HORIZONTAL_ALIGNMENT_RIGHT)

	_make_label(Vector2(214,8), Vector2(210,10), "J ATAQUE · Q/E/R/F · C INTERACTUAR · B ATLAS", 5, C_MUTED, false, HORIZONTAL_ALIGNMENT_CENTER)

	_make_panel(Vector2(438,8), Vector2(194,58), C_BG_SOFT, C_ORANGE)
	quest_label = _make_label(Vector2(448,14), Vector2(174,42), "Misión", 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	quest_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(8,286), Vector2(168,64), C_BG, C_WATER)
	_make_badge(Vector2(16,294), 26, Color("244958"), C_VIOLET)
	_make_label(Vector2(48,294), Vector2(116,10), "XETHKIOZ", 7, Color("d8ceff"), true)
	_make_label(Vector2(48,306), Vector2(116,9), "Vínculo activo", 6, C_MUTED)
	familiar_label = _make_label(Vector2(16,323), Vector2(148,23), "Familiar · Ninguno", 6, C_TEXT, true)
	familiar_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	_make_panel(Vector2(194,304), Vector2(252,46), C_BG, C_VIOLET)
	skill_name_labels["Q"] = _make_skill(Vector2(204,311), "Q", "CORTE", C_VIOLET)
	skill_name_labels["E"] = _make_skill(Vector2(262,311), "E", "GUARDIA", C_VIOLET)
	skill_name_labels["R"] = _make_skill(Vector2(320,311), "R", "DESTELLO", C_VIOLET)
	skill_name_labels["F"] = _make_skill(Vector2(378,311), "F", "BLOQ.", C_ORANGE)

	_make_panel(Vector2(458,292), Vector2(174,58), C_BG_SOFT, Color("244958"))
	world_label = _make_label(Vector2(468,298), Vector2(154,19), "", 7, C_TEXT, true, HORIZONTAL_ALIGNMENT_RIGHT)
	lore_label = _make_label(Vector2(468,321), Vector2(154,9), "Atlas · Ecos 0/5", 6, C_VIOLET, false, HORIZONTAL_ALIGNMENT_RIGHT)
	inventory_label = _make_label(Vector2(468,334), Vector2(154,9), "", 6, C_ORANGE, false, HORIZONTAL_ALIGNMENT_RIGHT)

	toast_label = _make_label(Vector2(190,270), Vector2(260,20), "", 8, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	toast_label.visible = false

	dialog_panel = _make_panel(Vector2(44,246), Vector2(552,76), Color(0.025,0.028,0.045,0.95), C_VIOLET)
	dialog_panel.visible = false
	dialog_portrait = TextureRect.new()
	dialog_portrait.position = Vector2(52,252)
	dialog_portrait.size = Vector2(62,62)
	dialog_portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	dialog_portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	dialog_portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	dialog_portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dialog_portrait.visible = false
	dialog_portrait.z_index = 3
	add_child(dialog_portrait)
	dialog_label = _make_label(Vector2(124,254), Vector2(458,62), "", 8, C_TEXT)
	dialog_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	dialog_label.visible = false

func _make_panel(pos: Vector2, size: Vector2, fill: Color, border: Color) -> Panel:
	var panel := Panel.new()
	panel.position = pos
	panel.size = size
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var box := StyleBoxFlat.new()
	box.bg_color = fill
	box.border_color = Color(border.r, border.g, border.b, 0.65)
	box.set_border_width_all(1)
	box.set_corner_radius_all(6)
	panel.add_theme_stylebox_override("panel", box)
	add_child(panel)
	return panel

func _make_label(pos: Vector2, size: Vector2, text: String, font_size: int, color: Color = C_TEXT, bold := false, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var label := Label.new()
	label.position = pos
	label.size = size
	label.text = text
	label.horizontal_alignment = align
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_shadow_color", Color(0,0,0,0.85))
	label.add_theme_constant_override("shadow_offset_x", 1)
	label.add_theme_constant_override("shadow_offset_y", 1)
	if bold:
		label.add_theme_constant_override("outline_size", 1)
	add_child(label)
	return label

func _make_bar_back(pos: Vector2, size: Vector2) -> void:
	var bar := ColorRect.new()
	bar.position = pos
	bar.size = size
	bar.color = Color("20232b")
	bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bar)

func _make_bar_fill(pos: Vector2, size: Vector2, color: Color) -> ColorRect:
	var bar := ColorRect.new()
	bar.position = pos
	bar.size = size
	bar.color = color
	bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bar)
	return bar

func _make_badge(pos: Vector2, diameter: float, fill: Color, border: Color) -> void:
	var badge := Panel.new()
	badge.position = pos
	badge.size = Vector2(diameter, diameter)
	badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var box := StyleBoxFlat.new()
	box.bg_color = fill
	box.border_color = border
	box.set_border_width_all(1)
	box.set_corner_radius_all(roundi(diameter * 0.5))
	badge.add_theme_stylebox_override("panel", box)
	add_child(badge)

func _make_skill(pos: Vector2, key: String, name: String, accent: Color) -> Label:
	var panel := _make_panel(pos, Vector2(48,30), Color(0.09,0.075,0.12,0.96), accent)
	panel.z_index = 1
	var key_label := _make_label(pos + Vector2(4,3), Vector2(15,10), key, 8, C_TEXT, true)
	key_label.z_index = 2
	var skill_label := _make_label(pos + Vector2(4,17), Vector2(40,8), name, 5, accent, true, HORIZONTAL_ALIGNMENT_RIGHT)
	skill_label.z_index = 2
	return skill_label

func _on_health(current: float, maximum: float) -> void:
	if hp_bar:
		hp_bar.size.x = 128.0 * clampf(current / maxf(1.0, maximum), 0.0, 1.0)

func _on_mana(current: float, maximum: float) -> void:
	if mana_bar:
		mana_bar.size.x = 96.0 * clampf(current / maxf(1.0, maximum), 0.0, 1.0)

func _on_progress(level: int, xp: int, xp_to_next: int) -> void:
	if hp_label:
		hp_label.text = "VIAJERO · NIVEL %d" % level
	if progress_label:
		progress_label.text = "XP %d/%d" % [xp, xp_to_next]

func _on_currency(_crystals: int) -> void:
	_update_inventory_summary()

func _on_inventory(_stacks: Dictionary) -> void:
	_update_inventory_summary()

func _update_inventory_summary() -> void:
	if inventory_label:
		inventory_label.text = "Cristales %d · Bolsa %d/%d/%d" % [GameState.crystals, InventoryService.amount_of("manzana_bruma"), InventoryService.amount_of("hongo_azul_rocio"), InventoryService.amount_of("racion_bosque")]

func _on_lore_discovered(_lore_id: String, _title: String, _discovered_count: int, total_hint: int) -> void:
	if total_hint > 0:
		_lore_total_hint = total_hint
	_update_lore_label()

func _update_lore_label() -> void:
	if lore_label:
		lore_label.text = "Atlas · Ecos %d/%d" % [GameState.discovered_lore.size(), _lore_total_hint]

func _on_familiar_captured(_species_id: String, _display_name: String) -> void:
	_update_familiar_label()

func _on_familiar_assessed(_species_id: String, _affinity: String, _mentor_id: String) -> void:
	_update_familiar_label()

func _on_active_familiar_changed(_species_id: String) -> void:
	_update_familiar_label()

func _update_familiar_label() -> void:
	if familiar_label == null:
		return
	if GameState.active_familiar_id.is_empty():
		familiar_label.text = "Familiar · Ninguno"
		return
	var data := GameState.active_familiar_data()
	if data.is_empty():
		familiar_label.text = "Familiar · Ninguno"
		return
	var name := str(data.get("display_name", GameState.active_familiar_id))
	if not bool(data.get("assessed", false)):
		familiar_label.text = "%s\nAfinidad desconocida" % name
		return
	var affinity := str(data.get("affinity", "desconocida")).capitalize()
	var mentor := str(data.get("mentor_id", "")).capitalize()
	var rank := int(data.get("training_rank", 0))
	familiar_label.text = "%s\n%s · %s · R%d" % [name, affinity, mentor, rank]

func _on_mentor_selected(_mentor_id: String) -> void:
	_update_combat_loadout()

func _update_combat_loadout() -> void:
	if skill_name_labels.is_empty():
		return
	var names := {"Q":"CORTE", "E":"GUARDIA", "R":"DESTELLO", "F":"BLOQ."}
	match GameState.selected_mentor:
		"ashley":
			names = {"Q":"ONDA", "E":"MELODÍA", "R":"RESON.", "F":"BROTE"}
		"fermin":
			names = {"Q":"BARRIDO", "E":"GUARDIA", "R":"EMBEST.", "F":"BROTE"}
		"isabella":
			names = {"Q":"MARCA", "E":"RUNA", "R":"DETON.", "F":"BROTE"}
		"gael":
			names = {"Q":"DISPARO", "E":"TRAMPA", "R":"CARGADO", "F":"BROTE"}
	for slot in names.keys():
		var label: Label = skill_name_labels.get(slot)
		if label:
			label.text = str(names[slot])

func _on_quest(title: String, objective: String, completed: bool) -> void:
	if quest_label:
		quest_label.text = "%s%s\n%s" % ["✓ " if completed else "", title.to_upper(), objective]

func _on_weather(weather_id: String) -> void:
	_weather = weather_id
	_update_world_label()

func _on_time(hour: float) -> void:
	_hour = hour
	_update_world_label()

func _update_world_label() -> void:
	if world_label:
		world_label.text = "IZRDRALAR · %02d:00\n%s" % [int(_hour), _weather.replace("_", " ").capitalize()]

func _on_toast(message: String) -> void:
	if toast_label:
		toast_label.text = message
		toast_label.visible = true
		_toast_timer = 3.0

func _on_dialog(speaker: String, text: String) -> void:
	if dialog_panel and dialog_label:
		dialog_label.text = "%s\n%s" % [speaker.to_upper(), text]
		_set_dialog_portrait(speaker)
		dialog_panel.visible = true
		dialog_label.visible = true
		_dialog_timer = 5.5

func _set_dialog_portrait(speaker: String) -> void:
	if dialog_portrait == null:
		return
	var key := speaker.strip_edges().to_lower()
	if not PORTRAIT_INDEX.has(key):
		dialog_portrait.visible = false
		return
	var atlas := AtlasTexture.new()
	atlas.atlas = DIALOG_PORTRAITS
	atlas.region = Rect2(Vector2(int(PORTRAIT_INDEX[key]) * 64, 0), Vector2(64, 64))
	dialog_portrait.texture = atlas
	dialog_portrait.visible = true
