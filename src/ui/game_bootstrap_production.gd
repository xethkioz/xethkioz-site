extends "res://src/ui/game_bootstrap.gd"

const GOLDEN_REGION_SCENE := "res://scenes/v34/GoldenRegion.tscn"
const TITLE_BACKDROP := preload("res://assets/production/ui/title_izrdralar.svg")
const VIAJERO_SHEET := preload("res://assets/production/characters/viajero_sheet.svg")

var _creator_sprite: TextureRect

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
	_creator_sprite = TextureRect.new()
	_creator_sprite.name = "ViajeroCreatorPreview"
	_creator_sprite.position = Vector2(51, 45)
	_creator_sprite.size = Vector2(96, 96)
	_creator_sprite.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	_creator_sprite.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	_creator_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_creator_sprite.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(_creator_sprite)
	for node in parent.get_children():
		if node is Label and "Vista provisional" in node.text:
			node.text = "Tu apariencia se conserva\nen partida y guardado."
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
	if not is_instance_valid(_creator_sprite):
		return
	var atlas := AtlasTexture.new()
	atlas.atlas = VIAJERO_SHEET
	atlas.region = Rect2(32, 0, 32, 32)
	_creator_sprite.texture = atlas
	var accent_index: int = accent_option.selected if is_instance_valid(accent_option) else CharacterProfile.accent_color
	var accent: Color = CharacterProfile.ACCENT_COLORS[clampi(accent_index, 0, CharacterProfile.ACCENT_COLORS.size() - 1)]
	_creator_sprite.modulate = accent.lerp(Color.WHITE, 0.72)

func _enter_world() -> void:
	SaveService.save_game({"intro_seen": true})
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)
