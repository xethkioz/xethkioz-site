extends "res://src/ui/game_bootstrap.gd"

const GOLDEN_REGION_SCENE := "res://scenes/v34/GoldenRegion.tscn"
const TITLE_BACKDROP := preload("res://assets/production/ui/title_izrdralar.svg")
const INTRO_ART := preload("res://assets/production/ui/intro_chapters.svg")
const CreatorPreviewScript := preload("res://src/ui/creator_avatar_preview.gd")

var _creator_avatar: Control

func _build_shell() -> void:
	var background := TextureRect.new()
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.texture = TITLE_BACKDROP
	background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	background.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	background.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)

	var vignette := ColorRect.new()
	vignette.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	vignette.color = Color(0.015, 0.024, 0.038, 0.14)
	vignette.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(vignette)

	content = Control.new()
	content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(content)

func _show_creator() -> void:
	super._show_creator()
	if is_instance_valid(preview_head):
		preview_head.visible = false
	if is_instance_valid(preview_hair):
		preview_hair.visible = false
	if is_instance_valid(preview_body):
		preview_body.visible = false
	var parent: Control = preview_head.get_parent() as Control if is_instance_valid(preview_head) else content
	_creator_avatar = Control.new()
	_creator_avatar.name = "ViajeroCreatorPreview"
	_creator_avatar.position = Vector2(51, 42)
	_creator_avatar.size = Vector2(96, 148)
	_creator_avatar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_creator_avatar.set_script(CreatorPreviewScript)
	parent.add_child(_creator_avatar)
	for node in parent.get_children():
		if node is Label and "Vista provisional" in node.text:
			node.text = "Esta apariencia se conserva\nen partida y guardado."
	_update_creator_preview()

func _update_creator_preview() -> void:
	if is_instance_valid(preview_head):
		preview_head.visible = false
	if is_instance_valid(preview_hair):
		preview_hair.visible = false
	if is_instance_valid(preview_body):
		preview_body.visible = false
	if is_instance_valid(preview_name):
		var display_name: String = name_edit.text.strip_edges() if is_instance_valid(name_edit) else CharacterProfile.player_name
		preview_name.text = display_name.to_upper() if not display_name.is_empty() else "VIAJERO"
	if not is_instance_valid(_creator_avatar):
		return
	var body_index: int = body_option.selected if is_instance_valid(body_option) else CharacterProfile.body_type
	var skin_index: int = skin_option.selected if is_instance_valid(skin_option) else CharacterProfile.skin_tone
	var hair_index: int = hair_option.selected if is_instance_valid(hair_option) else CharacterProfile.hair_style
	var hair_color_index: int = hair_color_option.selected if is_instance_valid(hair_color_option) else CharacterProfile.hair_color
	var accent_index: int = accent_option.selected if is_instance_valid(accent_option) else CharacterProfile.accent_color
	_creator_avatar.configure(body_index, skin_index, hair_index, hair_color_index, accent_index)

func _show_intro() -> void:
	_clear_content()
	var slide: Dictionary = INTRO[intro_index]
	var art_panel: Panel = _panel(Vector2(24, 56), Vector2(300, 206), Color(0.02, 0.035, 0.05, 0.96), C_VIOLET)
	var atlas := AtlasTexture.new()
	atlas.atlas = INTRO_ART
	atlas.region = Rect2(Vector2(float(intro_index) * 256.0, 0.0), Vector2(256, 144))
	var artwork := TextureRect.new()
	artwork.position = Vector2(10, 10)
	artwork.size = Vector2(280, 158)
	artwork.texture = atlas
	artwork.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	artwork.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	artwork.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	artwork.mouse_filter = Control.MOUSE_FILTER_IGNORE
	art_panel.add_child(artwork)
	var chapter := _local_label(Vector2(12, 174), Vector2(276, 15), "CAPÍTULO CERO · %d/%d" % [intro_index + 1, INTRO.size()], 7, C_ORANGE, true, HORIZONTAL_ALIGNMENT_CENTER)
	art_panel.add_child(chapter)

	var text_panel: Panel = _panel(Vector2(340, 56), Vector2(276, 206), Color(0.025, 0.035, 0.055, 0.96), C_WATER)
	var title := _local_label(Vector2(16, 18), Vector2(244, 54), str(slide["title"]), 15, C_TEXT, true, HORIZONTAL_ALIGNMENT_CENTER)
	title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	text_panel.add_child(title)
	var divider := ColorRect.new()
	divider.position = Vector2(42, 78)
	divider.size = Vector2(192, 2)
	divider.color = C_VIOLET if intro_index in [1, 2, 3] else C_ORANGE
	divider.mouse_filter = Control.MOUSE_FILTER_IGNORE
	text_panel.add_child(divider)
	var body := _local_label(Vector2(20, 92), Vector2(236, 90), str(slide["text"]), 9, C_TEXT, false, HORIZONTAL_ALIGNMENT_CENTER)
	body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	body.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	text_panel.add_child(body)

	var skip := _button(Vector2(24, 310), Vector2(104, 28), "OMITIR")
	skip.pressed.connect(_enter_world)
	content.add_child(skip)
	if intro_index > 0:
		var previous := _button(Vector2(142, 310), Vector2(112, 28), "ANTERIOR")
		previous.pressed.connect(func(): intro_index -= 1; _show_intro())
		content.add_child(previous)
	var next_text: String = "ENTRAR A IZRDRALAR" if intro_index == INTRO.size() - 1 else "CONTINUAR"
	var next_x: float = 270.0 if intro_index > 0 else 142.0
	var next_width: float = 346.0 if intro_index > 0 else 474.0
	var next := _button(Vector2(next_x, 310), Vector2(next_width, 28), next_text)
	next.pressed.connect(_next_intro)
	content.add_child(next)

func _enter_world() -> void:
	SaveService.save_game({"intro_seen": true})
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)
