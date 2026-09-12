extends Node

const SETTINGS_PATH := "user://accessibility.cfg"

var reduce_camera_motion: bool = false
var sfx_enabled: bool = true
var sfx_volume_db: float = -10.5
var ambience_enabled: bool = true
var ambience_volume_db: float = -22.0

func _ready() -> void:
	load_settings()

func load_settings() -> void:
	var config := ConfigFile.new()
	if config.load(SETTINGS_PATH) != OK:
		return
	reduce_camera_motion = bool(config.get_value("accessibility", "reduce_camera_motion", false))
	sfx_enabled = bool(config.get_value("audio", "sfx_enabled", true))
	sfx_volume_db = clampf(float(config.get_value("audio", "sfx_volume_db", -10.5)), -30.0, 0.0)
	ambience_enabled = bool(config.get_value("audio", "ambience_enabled", true))
	ambience_volume_db = clampf(float(config.get_value("audio", "ambience_volume_db", -22.0)), -36.0, -6.0)

func save_settings() -> bool:
	var config := ConfigFile.new()
	config.set_value("accessibility", "reduce_camera_motion", reduce_camera_motion)
	config.set_value("audio", "sfx_enabled", sfx_enabled)
	config.set_value("audio", "sfx_volume_db", sfx_volume_db)
	config.set_value("audio", "ambience_enabled", ambience_enabled)
	config.set_value("audio", "ambience_volume_db", ambience_volume_db)
	return config.save(SETTINGS_PATH) == OK

func set_reduce_camera_motion(enabled: bool) -> void:
	reduce_camera_motion = enabled
	save_settings()

func set_sfx_enabled(enabled: bool) -> void:
	sfx_enabled = enabled
	save_settings()

func set_sfx_volume_db(value: float) -> void:
	sfx_volume_db = clampf(value, -30.0, 0.0)
	save_settings()

func set_ambience_enabled(enabled: bool) -> void:
	ambience_enabled = enabled
	save_settings()

func set_ambience_volume_db(value: float) -> void:
	ambience_volume_db = clampf(value, -36.0, -6.0)
	save_settings()
