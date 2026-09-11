extends "res://src/world/izrdralar_m01_m05_runtime.gd"

const VisualChunkScript := preload("res://src/world/izrdralar_visual_chunk_pass02.gd")
const CompactHudScript := preload("res://src/ui/hud_controller_production_compact.gd")
const IntegratedLandmarkScript := preload("res://src/world/izrdralar_authored_landmark_pass02.gd")
const ImpactPlayerScript := preload("res://src/player/player_controller_production_pass02.gd")
const AmbientLayerScript := preload("res://src/fx/izrdralar_ambient_layer_pass02.gd")
const ReadableNpcScript := preload("res://src/npc/npc_interactable_production_pass02.gd")
const DepthBinderScript := preload("res://src/world/izrdralar_depth_binder.gd")
const ContactShadowScript := preload("res://src/fx/izrdralar_contact_shadow.gd")

func _ready() -> void:
	super._ready()
	_install_depth_contract()
	_spawn_ambient_layer()

func _build_chunks() -> void:
	var chunks: Dictionary = map_data.get("chunks", {})
	var world_seed := int(map_data.get("world_seed", 21500809))
	for key_value in chunks.keys():
		var key := str(key_value)
		var parts := key.split(",")
		if parts.size() != 2:
			continue
		var coord := Vector2i(int(parts[0]), int(parts[1]))
		var chunk := Node2D.new()
		chunk.name = "Chunk_%s" % key.replace(",", "_")
		chunk.set_script(VisualChunkScript)
		add_child(chunk)
		move_child(chunk, 0)
		chunk.call("configure", coord, chunks[key_value], world_seed)

func _build_landmarks() -> void:
	for landmark_value in map_data.get("landmarks", []):
		if not (landmark_value is Dictionary):
			continue
		var data: Dictionary = landmark_value
		var landmark := Node2D.new()
		landmark.name = "Landmark_%s" % str(data.get("id", "authored"))
		landmark.set_script(IntegratedLandmarkScript)
		landmark.position = _vector_from_array(data.get("position", [0, 0]))
		landmark.call("configure", data)
		add_child(landmark)

func _spawn_player() -> void:
	player = CharacterBody2D.new()
	player.name = "Player"
	player.collision_layer = 1
	player.collision_mask = 2 | 4
	player.set_script(ImpactPlayerScript)
	player.position = _initial_entry_position()
	var collision := CollisionShape2D.new()
	var capsule := CapsuleShape2D.new()
	capsule.radius = 6.0
	capsule.height = 16.0
	collision.shape = capsule
	collision.position = Vector2(0, 4)
	player.add_child(collision)
	var camera := Camera2D.new()
	camera.name = "WorldCamera"
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 7.5
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(_world_size.x)
	camera.limit_bottom = int(_world_size.y)
	camera.zoom = Vector2.ONE
	player.add_child(camera)
	add_child(player)

func _spawn_npcs() -> void:
	for npc_value in map_data.get("npcs", []):
		if not (npc_value is Dictionary):
			continue
		var data: Dictionary = npc_value
		var npc := Node2D.new()
		npc.name = str(data.get("name", "NPC"))
		npc.set_script(ReadableNpcScript)
		npc.position = _vector_from_array(data.get("position", [0, 0]))
		var lines: Array[String] = []
		for line in data.get("lines", []):
			lines.append(str(line))
		npc.call("configure_production", str(data.get("id", "npc")), str(data.get("name", "NPC")), lines, int(data.get("atlas", 0)))
		add_child(npc)

func _install_depth_contract() -> void:
	# 2.5D top-down rule: the visual foot line owns draw order. This keeps the
	# authored scene tree intact while allowing actors to move naturally in front
	# of and behind vegetation, ruins and buildings.
	_apply_static_prop_depth()
	for child in get_children():
		if not (child is Node2D):
			continue
		var node := child as Node2D
		if node == player:
			_bind_depth(node, 6.0)
			_install_contact_shadow(node, Vector2(8.5, 3.0), 0.30, Vector2(0, 7))
		elif node.name == "Xethkioz":
			_bind_depth(node, 6.0)
			_install_contact_shadow(node, Vector2(9.0, 2.6), 0.18, Vector2(0, 10))
		elif node.is_in_group("bosses"):
			# Boss 5 owns a larger custom arena shadow in its production controller.
			_bind_depth(node, 18.0)
		elif node.is_in_group("enemies"):
			_bind_depth(node, 5.0)
			_install_contact_shadow(node, Vector2(9.5, 3.0), 0.28, Vector2(0, 7))
		elif node.is_in_group("izrdralar_authored_landmark"):
			var landmark_offset := 14.0
			var collision_offset: Variant = node.get("collision_offset")
			if collision_offset is Vector2:
				landmark_offset = maxf(8.0, (collision_offset as Vector2).y)
			_bind_depth(node, landmark_offset)
		elif node.get_script() == ReadableNpcScript:
			_bind_depth(node, 6.0)
			_install_contact_shadow(node, Vector2(8.5, 2.8), 0.26, Vector2(0, 7))

func _bind_depth(target: Node2D, foot_offset: float) -> void:
	if target.get_node_or_null("DepthBinder") != null:
		return
	var binder := Node.new()
	binder.name = "DepthBinder"
	binder.set_script(DepthBinderScript)
	target.add_child(binder)
	binder.call("configure", target, foot_offset)

func _install_contact_shadow(target: Node2D, radii: Vector2, alpha: float, offset_value: Vector2) -> void:
	if target.get_node_or_null("ContactShadow") != null:
		return
	var shadow := Node2D.new()
	shadow.name = "ContactShadow"
	shadow.set_script(ContactShadowScript)
	target.add_child(shadow)
	shadow.call("configure", radii, alpha, offset_value)

func _apply_static_prop_depth() -> void:
	for child in get_children():
		if not child.name.begins_with("Chunk_"):
			continue
		var props := child.get_node_or_null("LargeProps") as Node2D
		if props == null:
			continue
		# The former fixed -5 layer made every tree/structure remain behind actors.
		# Individual sprites now sort from their world-space foot line instead.
		props.z_index = 0
		for prop_child in props.get_children():
			if not (prop_child is Sprite2D):
				continue
			var sprite := prop_child as Sprite2D
			var visual_half_height := 16.0
			if sprite.texture != null:
				visual_half_height = maxf(8.0, sprite.texture.get_height() * absf(sprite.scale.y) * 0.42)
			sprite.z_index = clampi(roundi(sprite.global_position.y + visual_half_height), -3900, 3900)

func _spawn_ambient_layer() -> void:
	if map_data.is_empty():
		return
	var ambient := Node2D.new()
	ambient.name = "AmbientPass02"
	ambient.set_script(AmbientLayerScript)
	ambient.call("configure", map_id, _world_size, int(map_data.get("world_seed", 21500809)))
	add_child(ambient)

func _spawn_hud() -> void:
	var hud := CanvasLayer.new()
	hud.name = "HUD"
	hud.set_script(CompactHudScript)
	add_child(hud)
