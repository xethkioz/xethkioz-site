extends SceneTree

const NavigationGraph := preload("res://src/world/izrdralar_navigation_graph.gd")

var failures: Array[String] = []

func _init() -> void:
	var navigation = NavigationGraph.new()
	if not navigation.load_graph():
		_fail("navigation graph failed to load")
		_finish()
		return

	_validate_names(navigation)
	_validate_choice_gate(navigation)
	_validate_both_orders(navigation)
	_validate_checkpoint_entries(navigation)
	_validate_legacy_aliases(navigation)
	_validate_scope_exit(navigation)
	_finish()

func _validate_names(navigation) -> void:
	var expected := {
		"M01": "Cuenca del Despertar",
		"M02": "Aldea del Alba",
		"M03": "Lago Encantado",
		"M04": "Ruinas Vivas / Santuario de las Raíces",
		"M05": "Corazón del Bosque Velado"
	}
	for map_id in expected.keys():
		var data: Dictionary = navigation.map_data(str(map_id))
		if str(data.get("name", "")) != str(expected[map_id]):
			_fail("canonical name mismatch for %s" % map_id)

func _validate_choice_gate(navigation) -> void:
	var flags := {"opening_flow_complete": true, "prisma_atlas_unlocked": true}
	if not navigation.can_traverse("M01", "M02", flags):
		_fail("M01 -> M02 should unlock after opening flow")
	if not navigation.can_traverse("M02", "M03", flags):
		_fail("M02 -> M03 choice should be available")
	if not navigation.can_traverse("M02", "M04", flags):
		_fail("M02 -> M04 choice should be available")
	if navigation.can_traverse("M03", "M05", flags):
		_fail("Boss 5 must remain blocked before both routes resolve")
	if navigation.can_traverse("M04", "M05", flags):
		_fail("Boss 5 must remain blocked before both routes resolve")

func _validate_both_orders(navigation) -> void:
	var lake_first := {"prisma_atlas_unlocked": true, "lake_resolved": true}
	if not navigation.can_traverse("M03", "M02", lake_first):
		_fail("lake-first route must allow return to M02")
	if navigation.can_traverse("M03", "M05", lake_first):
		_fail("lake-first route must not bypass unresolved ruins")
	lake_first["ruins_sanctuary_resolved"] = true
	if not navigation.can_traverse("M04", "M05", lake_first):
		_fail("lake-first then ruins must unlock Boss 5")

	var ruins_first := {"prisma_atlas_unlocked": true, "ruins_sanctuary_resolved": true}
	if not navigation.can_traverse("M04", "M02", ruins_first):
		_fail("ruins-first route must allow return to M02")
	if navigation.can_traverse("M04", "M05", ruins_first):
		_fail("ruins-first route must not bypass unresolved lake")
	ruins_first["lake_resolved"] = true
	if not navigation.can_traverse("M03", "M05", ruins_first):
		_fail("ruins-first then lake must unlock Boss 5")

func _validate_checkpoint_entries(navigation) -> void:
	var valid_pairs := [
		["M01", "start"],
		["M02", "from_m01"],
		["M02", "from_m03"],
		["M02", "from_m04"],
		["M03", "from_m02"],
		["M04", "from_m02"],
		["M05", "from_m03"],
		["M05", "from_m04"]
	]
	for pair in valid_pairs:
		if not navigation.validate_checkpoint(str(pair[0]), str(pair[1])):
			_fail("valid checkpoint rejected: %s/%s" % [pair[0], pair[1]])
	if navigation.validate_checkpoint("M05", "start"):
		_fail("invalid M05/start checkpoint accepted")

func _validate_legacy_aliases(navigation) -> void:
	var legacy_flags := {
		"initial_lake_link_resolved": true,
		"custodian_superated": true
	}
	var normalized: Dictionary = navigation.normalize_flags(legacy_flags)
	if not bool(normalized.get("lake_resolved", false)):
		_fail("legacy lake flag did not migrate in navigation resolver")
	if not bool(normalized.get("ruins_sanctuary_resolved", false)):
		_fail("legacy ruins flag did not migrate in navigation resolver")
	if not navigation.can_traverse("M03", "M05", legacy_flags):
		_fail("legacy route flags should still unlock Boss 5")

func _validate_scope_exit(navigation) -> void:
	var flags := {
		"boss5_stabilized": true,
		"prism_step_unlocked": true
	}
	if navigation.can_traverse("M05", "M06", flags):
		_fail("M06 scope exit must remain disabled during Production Pass 01")
	if not navigation.can_traverse("M05", "M06", flags, true):
		_fail("M06 scope exit should be resolvable only when explicitly enabled")

func _fail(message: String) -> void:
	failures.append(message)

func _finish() -> void:
	if failures.is_empty():
		print("IZRDRALAR_M01_M05_NAVIGATION_PASS")
		quit(0)
		return
	for failure in failures:
		push_error(failure)
	print("IZRDRALAR_M01_M05_NAVIGATION_FAIL")
	quit(1)
