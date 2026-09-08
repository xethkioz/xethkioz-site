extends Node

const ITEMS := {
	"manzana_bruma": {"name": "Manzana de Bruma", "max_stack": 20},
	"hongo_azul_rocio": {"name": "Hongo Azul de Rocío", "max_stack": 20},
	"racion_bosque": {"name": "Ración del Bosque", "max_stack": 10}
}

const RECIPES := {
	"racion_bosque": {
		"name": "Ración del Bosque",
		"ingredients": {"manzana_bruma": 2, "hongo_azul_rocio": 1},
		"outputs": {"racion_bosque": 1},
		"profession": "cocina",
		"profession_xp": 8
	}
}

var stacks: Dictionary = {}

func item_name(item_id: String) -> String:
	return str(ITEMS.get(item_id, {"name": item_id}).get("name", item_id))

func amount_of(item_id: String) -> int:
	return int(stacks.get(item_id, 0))

func add_item(item_id: String, amount: int = 1) -> bool:
	if not ITEMS.has(item_id) or amount <= 0:
		return false
	var maximum := int(ITEMS[item_id].get("max_stack", 99))
	stacks[item_id] = mini(amount_of(item_id) + amount, maximum)
	_emit_changed()
	return true

func has_items(requirements: Dictionary) -> bool:
	for item_id in requirements.keys():
		if amount_of(str(item_id)) < int(requirements[item_id]):
			return false
	return true

func remove_items(requirements: Dictionary) -> bool:
	if not has_items(requirements):
		return false
	for item_id in requirements.keys():
		var id := str(item_id)
		var remaining := amount_of(id) - int(requirements[item_id])
		if remaining <= 0:
			stacks.erase(id)
		else:
			stacks[id] = remaining
	_emit_changed()
	return true

func craft(recipe_id: String) -> bool:
	if not RECIPES.has(recipe_id):
		return false
	var recipe: Dictionary = RECIPES[recipe_id]
	var ingredients: Dictionary = recipe["ingredients"]
	if not has_items(ingredients):
		return false
	remove_items(ingredients)
	var outputs: Dictionary = recipe["outputs"]
	for item_id in outputs.keys():
		add_item(str(item_id), int(outputs[item_id]))
	GameState.add_profession_xp(str(recipe.get("profession", "cocina")), int(recipe.get("profession_xp", 0)))
	EventBus.toast_requested.emit("Creaste: %s" % recipe.get("name", recipe_id))
	return true

func reset() -> void:
	stacks.clear()
	_emit_changed()

func to_dict() -> Dictionary:
	return {"stacks": stacks.duplicate(true)}

func apply_dict(data: Dictionary) -> void:
	stacks = data.get("stacks", {}).duplicate(true)
	_emit_changed()

func _emit_changed() -> void:
	EventBus.inventory_changed.emit(stacks.duplicate(true))
