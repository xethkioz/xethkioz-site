extends SceneTree

const CONTRACT_PATH := "res://data/visual/izrdralar_m01_m05_visual_contract.json"
const REQUIRED_MAP_IDS := ["M01", "M02", "M03", "M04", "M05"]
const REQUIRED_PALETTE_KEYS := ["forest", "wetland", "water", "prism_violet", "refuge_amber", "ui_primary", "ui_shadow"]
const REQUIRED_SCRIPT_PATHS := [
	"res://src/core/game_state.gd",
	"res://src/core/save_service.gd",
	"res://src/fx/world_feedback_fx.gd",
	"res://src/fx/izrdralar_fx_factory.gd",
	"res://src/player/player_controller_production.gd",
	"res://src/npc/enemy_controller_production.gd"
]

func _init() -> void:
	var failures: Array[String] = []
	_validate_required_scripts(failures)
	if not FileAccess.file_exists(CONTRACT_PATH):
		failures.append("missing contract: %s" % CONTRACT_PATH)
	else:
		var file := FileAccess.open(CONTRACT_PATH, FileAccess.READ)
		var parsed = JSON.parse_string(file.get_as_text()) if file != null else null
		if not (parsed is Dictionary):
			failures.append("contract is not a JSON object")
		else:
			_validate_contract(parsed, failures)
	if failures.is_empty():
		print("IZRDRALAR_VISUAL_CONTRACT_PASS")
		quit(0)
	else:
		for failure in failures:
			push_error(failure)
		print("IZRDRALAR_VISUAL_CONTRACT_FAIL")
		quit(1)

func _validate_required_scripts(failures: Array[String]) -> void:
	for path in REQUIRED_SCRIPT_PATHS:
		if not ResourceLoader.exists(path):
			failures.append("missing required script: %s" % path)
			continue
		var resource := ResourceLoader.load(path)
		if resource == null:
			failures.append("failed to parse/load required script: %s" % path)

func _validate_contract(contract: Dictionary, failures: Array[String]) -> void:
	if str(contract.get("contract_id", "")) != "izrdralar_m01_m05_visual_contract":
		failures.append("unexpected contract_id")
	if str(contract.get("version", "")) != "1.0.0":
		failures.append("unexpected contract version")
	var render: Dictionary = contract.get("render", {})
	if render.get("logical_viewport", []) != [640, 360]:
		failures.append("logical viewport must be 640x360")
	if int(render.get("tile_size_px", 0)) != 16:
		failures.append("tile size must be 16")
	var palette: Dictionary = contract.get("palette", {})
	for key in REQUIRED_PALETTE_KEYS:
		if not palette.has(key):
			failures.append("missing palette key: %s" % key)
	var maps: Array = contract.get("maps", [])
	if maps.size() != REQUIRED_MAP_IDS.size():
		failures.append("expected exactly five production maps")
		return
	for index in range(REQUIRED_MAP_IDS.size()):
		var map_data: Dictionary = maps[index]
		if str(map_data.get("id", "")) != REQUIRED_MAP_IDS[index]:
			failures.append("map order/id mismatch at index %d" % index)
		if str(map_data.get("name", "")).is_empty():
			failures.append("map %s has no canonical name" % REQUIRED_MAP_IDS[index])
	var qa: Dictionary = contract.get("qa", {})
	var checks: Array = qa.get("required_runtime_checks", [])
	if checks.size() < 8:
		failures.append("runtime QA checklist is incomplete")
