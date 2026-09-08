extends "res://src/world/gatherable.gd"

const ATLAS := preload("res://assets/production/izrdralar/interactables.svg")
const FeedbackFxScript := preload("res://src/fx/world_feedback_fx.gd")

var _visual: Sprite2D
var _atlas_index: int = 0
var _visual_time: float = 0.0

func configure_production(id_value: String, amount_value: int, profession_value: String, xp_value: int, atlas_index: int) -> void:
	_atlas_index = clampi(atlas_index, 0, 3)
	configure(id_value, amount_value, profession_value, xp_value, Color.WHITE)
	if is_inside_tree():
		_refresh_visual()

func _ready() -> void:
	super._ready()
	_visual = Sprite2D.new()
	_visual.texture = ATLAS
	_visual.region_enabled = true
	_visual.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_visual.region_rect = Rect2(Vector2(_atlas_index * 32, 0), Vector2(32, 32))
	_visual.position = Vector2(0, -7)
	_visual.z_index = 1
	add_child(_visual)
	_refresh_visual()

func _process(delta: float) -> void:
	if depleted or not is_instance_valid(_visual):
		return
	_visual_time += delta
	_visual.position.y = -7.0 + sin(_visual_time * 2.4 + float(_atlas_index)) * 1.4
	var pulse: float = 0.94 + sin(_visual_time * 3.1 + float(_atlas_index) * 0.7) * 0.05
	_visual.modulate = Color(pulse, pulse, pulse, 1.0)

func interact(_actor: Node = null) -> void:
	if depleted:
		return
	if not InventoryService.add_item(item_id, amount):
		return
	GameState.add_profession_xp(profession_id, profession_xp)
	EventBus.toast_requested.emit("Recolectaste %s x%d · +%d XP %s" % [InventoryService.item_name(item_id), amount, profession_xp, profession_id.capitalize()])
	_spawn_pickup_feedback()
	depleted = true
	GameState.set_world_flag(persistence_id, true)
	remove_from_group("interactable")
	visible = false
	SaveService.save_game()

func _spawn_pickup_feedback() -> void:
	var scene: Node = get_tree().current_scene
	if scene == null:
		return
	var fx: Node2D = FeedbackFxScript.new() as Node2D
	fx.global_position = global_position + Vector2(0, -8)
	scene.add_child(fx)
	fx.call("configure", "pickup", Vector2.UP, _feedback_color(), "+%d %s" % [amount, InventoryService.item_name(item_id)])

func _feedback_color() -> Color:
	match _atlas_index:
		0:
			return Color("8fcf78")
		1:
			return Color("6ed4e8")
		2:
			return Color("ff8c42")
		3:
			return Color("b994ff")
		_:
			return Color.WHITE

func _refresh_visual() -> void:
	if is_instance_valid(_visual):
		_visual.region_rect = Rect2(Vector2(_atlas_index * 32, 0), Vector2(32, 32))

func _draw() -> void:
	pass
