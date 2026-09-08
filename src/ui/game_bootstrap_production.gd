extends "res://src/ui/game_bootstrap.gd"

const GOLDEN_REGION_SCENE := "res://scenes/v34/GoldenRegion.tscn"
const TITLE_BACKDROP := preload("res://assets/production/ui/title_izrdralar.svg")
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

func _enter_world() -> void:
	SaveService.save_game({"intro_seen": true})
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)

func _continue_game() -> void:
	var loaded := SaveService.load_game()
	if loaded.is_empty():
		_show_main_menu()
		return
	get_tree().change_scene_to_file(GOLDEN_REGION_SCENE)
