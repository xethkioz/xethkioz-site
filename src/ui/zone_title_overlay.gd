extends Control

const CHUNK_PIXELS: float = 512.0

var _player: Node2D
var _panel: Panel
var _title: Label
var _subtitle: Label
var _shown_zones: Dictionary = {"cuenca": true}
var _active_tween: Tween

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_build_ui()

func _process(_delta: float) -> void:
	if not is_instance_valid(_player):
		_player = get_tree().get_first_node_in_group("player") as Node2D
		if not is_instance_valid(_player):
			return
	var chunk := Vector2i(floori(_player.global_position.x / CHUNK_PIXELS), floori(_player.global_position.y / CHUNK_PIXELS))
	var data: Dictionary = _zone_for_chunk(chunk)
	if data.is_empty():
		return
	var zone_id: String = str(data.get("id", ""))
	if zone_id.is_empty() or _shown_zones.has(zone_id):
		return
	_shown_zones[zone_id] = true
	_show_zone(str(data.get("title", "IZRDRALAR")), str(data.get("subtitle", "")), data.get("accent", Color("8b5cf6")))

func _build_ui() -> void:
	_panel = Panel.new()
	_panel.position = Vector2(170, 17)
	_panel.size = Vector2(300, 48)
	_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.025, 0.035, 0.055, 0.92)
	style.border_color = Color("8b5cf6")
	style.set_border_width_all(1)
	style.corner_radius_top_left = 5
	style.corner_radius_top_right = 5
	style.corner_radius_bottom_left = 5
	style.corner_radius_bottom_right = 5
	_panel.add_theme_stylebox_override("panel", style)
	_panel.visible = false
	add_child(_panel)

	_title = Label.new()
	_title.position = Vector2(12, 6)
	_title.size = Vector2(276, 20)
	_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_title.add_theme_font_size_override("font_size", 12)
	_title.add_theme_color_override("font_color", Color("f0f0f5"))
	_title.add_theme_color_override("font_outline_color", Color(0.01, 0.015, 0.025, 0.95))
	_title.add_theme_constant_override("outline_size", 2)
	_panel.add_child(_title)

	_subtitle = Label.new()
	_subtitle.position = Vector2(12, 26)
	_subtitle.size = Vector2(276, 14)
	_subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_subtitle.add_theme_font_size_override("font_size", 7)
	_subtitle.add_theme_color_override("font_color", Color("b9b9c8"))
	_panel.add_child(_subtitle)

func _show_zone(title_value: String, subtitle_value: String, accent_value: Color) -> void:
	_title.text = title_value.to_upper()
	_subtitle.text = subtitle_value
	var style := _panel.get_theme_stylebox("panel") as StyleBoxFlat
	if style != null:
		style.border_color = accent_value
	_panel.visible = true
	_panel.modulate = Color(1, 1, 1, 0)
	if _active_tween != null and _active_tween.is_valid():
		_active_tween.kill()
	_active_tween = create_tween()
	_active_tween.tween_property(_panel, "modulate", Color.WHITE, 0.18)
	_active_tween.tween_interval(1.75)
	_active_tween.tween_property(_panel, "modulate", Color(1, 1, 1, 0), 0.42)
	_active_tween.tween_callback(func(): _panel.visible = false)

func _zone_for_chunk(chunk: Vector2i) -> Dictionary:
	match chunk:
		Vector2i(1, 3):
			return {"id":"cuenca", "title":"Cuenca del Despertar", "subtitle":"Primer pulso de Izrdralar", "accent":Color("8b5cf6")}
		Vector2i(2, 3):
			return {"id":"aldea", "title":"Aldea del Alba", "subtitle":"Refugio humano · rutas y señales antiguas", "accent":Color("ff8c42")}
		Vector2i(1, 1):
			return {"id":"lago", "title":"Lago Encantado", "subtitle":"Hábitat de criaturas · observá antes de intervenir", "accent":Color("3fc7c9")}
		Vector2i(3, 1):
			return {"id":"ruinas", "title":"Ruinas Vivas", "subtitle":"Tecnología de 2150 · memoria prismática inestable", "accent":Color("b994ff")}
		Vector2i(3, 2):
			return {"id":"santuario", "title":"Santuario de las Raíces", "subtitle":"Zona de prueba · resonancia subterránea", "accent":Color("79b99a")}
		Vector2i(4, 3):
			return {"id":"cueva", "title":"Cueva del Ala Silente", "subtitle":"Acceso sellado · condición desconocida", "accent":Color("8ca6bb")}
		Vector2i(4, 0):
			return {"id":"corazon", "title":"Corazón del Bosque Velado", "subtitle":"Territorio hostil · Guardián detectado", "accent":Color("ff6b6b")}
		_:
			return {}
