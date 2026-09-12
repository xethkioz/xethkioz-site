class_name IzrdralarLevelUpFeedback
extends Node2D

const ProceduralSfx := preload("res://src/audio/izrdralar_procedural_sfx.gd")

var level_value: int = 1
var _elapsed := 0.0
var _duration := 1.15
var _sfx_player: AudioStreamPlayer2D

func configure(level: int) -> void:
	level_value = maxi(1, level)
	queue_redraw()

func _ready() -> void:
	z_index = 120
	if DisplayServer.get_name() != "headless" and AccessibilityService.sfx_enabled:
		_sfx_player = AudioStreamPlayer2D.new()
		_sfx_player.name = "LevelUpSfx"
		_sfx_player.volume_db = AccessibilityService.sfx_volume_db - 2.0
		_sfx_player.stream = ProceduralSfx.build("regen")
		add_child(_sfx_player)
		_sfx_player.play()

func _process(delta: float) -> void:
	_elapsed += delta
	queue_redraw()
	if _elapsed >= _duration:
		queue_free()

func _draw() -> void:
	var progress := clampf(_elapsed / _duration, 0.0, 1.0)
	var fade := 1.0 - progress
	var lift := progress * 16.0
	var pulse := sin(progress * PI)
	var violet := Color(0.55, 0.36, 0.96, fade * 0.82)
	var cyan := Color(0.43, 0.83, 0.91, fade * 0.72)
	var white := Color(0.94, 0.94, 0.96, fade)

	for ring in range(3):
		var radius := 12.0 + progress * 28.0 + float(ring) * 7.0
		draw_arc(Vector2(0, -8), radius, 0.0, TAU, 32, violet if ring % 2 == 0 else cyan, 2.0 - float(ring) * 0.35)
	for index in range(8):
		var angle := TAU * float(index) / 8.0 + progress * 0.65
		var distance := 11.0 + progress * (24.0 + float(index % 3) * 3.0)
		var point := Vector2(0, -8) + Vector2.from_angle(angle) * distance + Vector2(0, -lift * 0.35)
		draw_circle(point, 1.5 + pulse * 0.9, white)

	var font := ThemeDB.fallback_font
	var text := "NIVEL %d" % level_value
	draw_string(font, Vector2(-48, -42 - lift), text, HORIZONTAL_ALIGNMENT_CENTER, 96, 10, white)
