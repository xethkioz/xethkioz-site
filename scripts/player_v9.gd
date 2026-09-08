extends "res://scripts/player_v8.gd"

const TRAVELER_MALE = preload("res://assets/v095/generated/traveler_male.png")
const TRAVELER_FEMALE = preload("res://assets/v095/generated/traveler_female.png")

var traveler_gender_v9 := "Masculino"

# Golden Slice player presentation + apprentice skill bridge.
func _ready() -> void:
	super._ready()
	var cam:=get_node_or_null("Camera2D") as Camera2D
	if cam:
		cam.zoom=Vector2(1.34,1.34)
		cam.position_smoothing_speed=9.0

func configure_traveler(name_value: String,palette_index: int) -> void:
	super.configure_traveler(name_value,palette_index)
	if main_ref:
		traveler_gender_v9 = str(main_ref.state.get("player_gender","Masculino"))
	if visual_sprite:
		visual_sprite.texture = TRAVELER_FEMALE if traveler_gender_v9 == "Femenino" else TRAVELER_MALE
		var tints:Array[Color]=[Color.WHITE,Color(1.05,0.88,0.78),Color(0.78,1.03,1.0),Color(1.06,1.0,0.78)]
		visual_sprite.modulate=tints[clampi(palette_index,0,3)]

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	if visual_sprite:
		if dash_timer>0.0:
			visual_sprite.scale=Vector2(1.95,1.66)
		else:
			visual_sprite.scale=Vector2(1.78,1.78)

# The older player chain intentionally blocked skills before mentor selection.
# The Golden Slice requires Q/E/R to work from Map 1 as neutral Prism skills.
func _try_skill(slot: int) -> void:
	if hero_class != "Aprendiz Prismático":
		super._try_skill(slot)
		return
	if slot < 0 or slot >= skill_cooldowns.size() or skill_cooldowns[slot] > 0.0 or main_ref == null:
		return
	if slot == 3:
		if main_ref.has_method("skill_locked_feedback"):
			main_ref.skill_locked_feedback()
		return
	var costs: Array[float] = [10.0,16.0,22.0,58.0]
	var cost: float = costs[slot]
	if mana < cost:
		if main_ref.has_method("mana_feedback"):
			main_ref.mana_feedback(cost,mana)
		return
	mana -= cost
	var cds: Array[float] = [1.9,4.2,5.8,16.0]
	skill_cooldowns[slot] = cds[slot]
	main_ref.use_hero_skill(slot,global_position,facing,damage_multiplier,hero_class)
