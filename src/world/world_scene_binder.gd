extends Node

var _bound := false

func _process(_delta: float) -> void:
	if _bound:
		return
	var player := get_tree().get_first_node_in_group("player") as Node2D
	if not is_instance_valid(player):
		return
	var root := get_parent()
	var prompt := root.get_node_or_null("AssistHUD/InteractionPrompt")
	if prompt != null and prompt.has_method("configure"):
		prompt.configure(player)
	var navigation := root.get_node_or_null("AssistHUD/NavigationHint")
	if navigation != null and navigation.has_method("configure"):
		navigation.configure(player)
	_bound = true
