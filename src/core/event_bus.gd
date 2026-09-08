extends Node

signal toast_requested(message: String)
signal dialog_requested(speaker: String, text: String)
signal npc_interacted(npc_id: String)
signal player_health_changed(current: float, maximum: float)
signal player_progress_changed(level: int, xp: int, xp_to_next: int)
signal currency_changed(crystals: int)
signal enemy_defeated(enemy_id: String, xp_reward: int, world_position: Vector2)
signal quest_changed(title: String, objective: String, completed: bool)
signal weather_changed(weather_id: String)
signal time_changed(hour: float)
signal pet_bond_changed(bond: int)
