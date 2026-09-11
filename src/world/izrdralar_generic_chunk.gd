class_name IzrdralarGenericChunk
extends "res://src/world/production_chunk.gd"

func _place_chunk_landmarks() -> void:
	# M01-M05 authored maps place landmarks explicitly from their layout data.
	# This intentionally disables GoldenRegion's hard-coded chunk-coordinate landmarks.
	pass
