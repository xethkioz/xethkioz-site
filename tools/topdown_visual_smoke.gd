extends SceneTree

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://build"))
	var scene := load("res://scenes/Main.tscn").instantiate()
	root.add_child(scene)
	for i in range(8):
		await process_frame
	var title_img := root.get_viewport().get_texture().get_image()
	title_img.save_png("res://build/topdown_title.png")
	scene._start_node1()
	for i in range(12):
		await process_frame
	var node_img := root.get_viewport().get_texture().get_image()
	node_img.save_png("res://build/topdown_node1.png")
	print("Top-down visual smoke: title and node1 captured")	
	quit()
