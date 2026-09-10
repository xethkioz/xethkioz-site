# IZRDRALAR — Integration Baseline RC0

**Branch:** `game/izrdralar-production-integration-20260910`

This branch starts from the latest v3.6 production runtime and ports the validated 01–32 Izrdralar structural scaffold without replacing the production bootstrap.

## RC0 acceptance

- Production main scene remains `res://scenes/v34/GameBootstrap.tscn`.
- Existing v3.6 autoloads/systems remain intact.
- 01–32 manifest exists and retains 32 ordered nodes.
- Scaffold test scene can boot every map explicitly in Godot 4.7.2.
- This baseline does **not** claim that the 32 maps are finished gameplay.
- Immediate content-production scope is M01–M05.
