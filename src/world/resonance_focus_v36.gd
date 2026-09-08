extends Node2D

const FOCUS_IDS := ["a", "b", "noise"]

var focus_id := "a"
var _active := true
var _pulse := 0.0

func configure(id_value: String) -> void:
	focus_id = id_value

func _ready() -> void:
	add_to_group("interactable")
	if not GameState.has_world_flag("lake_focus_initialized"):
		GameState.set_world_flag("lake_focus_initialized", true)
		for id_value in FOCUS_IDS:
			GameState.set_world_flag("lake_focus_%s_active" % id_value, true)
	_active = GameState.has_world_flag("lake_focus_%s_active" % focus_id)
	_update_stability()
	queue_redraw()

func _process(delta: float) -> void:
	_pulse += delta
	queue_redraw()

func interact(_actor: Node = null) -> void:
	if not GameState.has_world_flag("lake_habitat_observed"):
		EventBus.dialog_requested.emit("Prisma-Atlas", "El foco responde, pero todavía no sabés qué efecto tiene sobre el hábitat.")
		return
	_active = not _active
	GameState.set_world_flag("lake_focus_%s_active" % focus_id, _active)
	if focus_id == "noise":
		GameState.set_world_flag("lake_noise_blocked", not _active)
	EventBus.toast_requested.emit("Foco prismático · %s" % ("ACTIVO" if _active else "APAGADO"))
	_update_stability()
	SaveService.save_game()
	queue_redraw()

func interaction_label() -> String:
	return "%s foco prismático" % ("Apagar" if _active else "Activar")

func _update_stability() -> void:
	var active_count := 0
	for id_value in FOCUS_IDS:
		if GameState.has_world_flag("lake_focus_%s_active" % id_value):
			active_count += 1
	var stable := active_count == 1 and GameState.has_world_flag("lake_habitat_observed")
	GameState.set_world_flag("lake_habitat_stable", stable)
	if stable:
		EventBus.toast_requested.emit("Hábitat estabilizado · el Carpinchito vuelve hacia los juncos")

func _draw() -> void:
	var base := Color("8b5cf6") if _active else Color("3c4650")
	var glow := 0.18 + maxf(0.0, sin(_pulse * 3.0)) * 0.12 if _active else 0.05
	draw_circle(Vector2(0, -5), 7.0, Color(base.r, base.g, base.b, 0.78))
	draw_circle(Vector2(0, -5), 11.0, Color(0.55, 0.36, 0.96, glow), false, 1.0)
	draw_line(Vector2(0, 2), Vector2(0, 8), Color("5a4638"), 3.0)
