extends "res://scripts/main_v20.gd"

# World of Xethkioz — Golden Slice Production v0.10.1
# Canon lock: Elida is an elderly apothecary/alchemist. Her production portrait
# and refuge presentation must never regress to a young/generic character.

const ELIDA_APOTHECARY_PORTRAIT: Texture2D = preload("res://assets/production/generated/elida_apothecary_portrait.png")
const ELIDA_APOTHECARY_SPRITE: Texture2D = preload("res://assets/production/generated/elida_apothecary.png")

func _show_elida_refuge_v16() -> void:
	super._show_elida_refuge_v16()
	if not menu_layer:
		return

	# Locate the inherited hearth panel and convert it into a real character hub.
	var hearth: Panel = null
	for child in menu_layer.get_children():
		if child is Panel:
			var p := child as Panel
			if p.size.x > 700.0 and p.size.y > 430.0 and p.position.x < 200.0:
				hearth = p
				break

	if hearth:
		var portrait_frame := Panel.new()
		portrait_frame.position = Vector2(28,34)
		portrait_frame.size = Vector2(132,150)
		portrait_frame.add_theme_stylebox_override("panel",_panel_style(Color(0.035,0.027,0.025,0.98),Color(0.68,0.46,0.24,0.95),2))
		hearth.add_child(portrait_frame)

		var portrait := TextureRect.new()
		portrait.position = Vector2(8,8)
		portrait.size = Vector2(116,116)
		portrait.texture = ELIDA_APOTHECARY_PORTRAIT
		portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		portrait_frame.add_child(portrait)

		var role := _vlabel(portrait_frame,Vector2(8,126),Vector2(116,18),"BOTICARIA • ALQUIMISTA",8,Color(0.94,0.80,0.53))
		role.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

		# Move the inherited family copy away from the portrait and make Elida's
		# canonical age/role explicit without changing the family staging.
		for hchild in hearth.get_children():
			if hchild is Label:
				var label := hchild as Label
				if label.text.begins_with("ELIDA"):
					label.position = Vector2(182,35)
					label.size = Vector2(535,190)
					label.text = "ELIDA • ABUELA, BOTICARIA Y ALQUIMISTA\n\nElida, ya anciana, prepara remedios y raciones entre hierbas secas, frascos y cuadernos de fórmulas. Alexis revisa el mapa; Ashley acomoda su instrumento; Fermín descansa junto al fuego; Isabella juega con reflejos prismáticos y Gael observa a Xethkioz.\n\nAcá el grupo baja la guardia antes de continuar."
					label.add_theme_font_size_override("font_size",13)

	# Replace the inherited toast-only Elida interaction with a real dialogue.
	for child in menu_layer.get_children():
		if child is Button and (child as Button).text == "HABLAR CON ELIDA":
			var b := child as Button
			for connection in b.pressed.get_connections():
				b.pressed.disconnect(connection["callable"])
			b.pressed.connect(_show_elida_dialogue_v21)
			break

func _show_elida_dialogue_v21() -> void:
	show_family_dialogue(
		"Elida",
		"Acá siempre van a tener un hogar. Si el camino te deja herido, traeme lo que encuentres: hierbas, cristales, raíces. Todo puede transformarse en algo que los ayude a seguir.",
		"Abuela • Boticaria / Alquimista",
		"Femenino"
	)

func show_family_dialogue(speaker:String,text:String,relationship:String,gender:String) -> void:
	super.show_family_dialogue(speaker,text,relationship,gender)
	if speaker == "Elida" and dialogue_portrait_v10:
		dialogue_portrait_v10.texture = ELIDA_APOTHECARY_PORTRAIT
		dialogue_name_label.text = "Elida"
		dialogue_meta_label.text = "Abuela • Boticaria / Alquimista • Anciana"

func _update_dialogue_choices() -> void:
	super._update_dialogue_choices()
	if dialogue_speaker_v16 != "Elida" or not dialogue_layer:
		return
	var options := [
		"¿Qué podés preparar?",
		"¿Qué buscás en Izrdralar?",
		"¿Cómo están los chicos?",
		"Gracias, Elida."
	]
	for i in range(4):
		var choice := dialogue_layer.get_node_or_null("Choice%d" % i) as Button
		if choice:
			choice.text = options[i]

func _dialogue_choice(index:int) -> void:
	if dialogue_speaker_v16 != "Elida":
		super._dialogue_choice(index)
		return
	var answers := [
		"Con hierbas y cristales puedo preparar raciones, tónicos y mezclas para aliviar heridas o maldiciones. Nada reemplaza descansar, pero una buena fórmula puede salvarte lejos del Refugio.",
		"Traeme plantas raras, hongos, raíces y fragmentos prismáticos. Algunos ingredientes sólo aparecen cuando cambia el clima o la hora del día.",
		"Siguen siendo chicos aunque el mundo haya cambiado alrededor de ellos. Por eso este lugar tiene que seguir siendo una casa antes que una base de operaciones.",
		"Andá tranquilo. Yo voy a mantener el fuego encendido hasta que vuelvan."
	]
	if dialogue_body_label:
		dialogue_body_label.text = answers[clampi(index,0,3)]
	if index == 3:
		dialogue_timer = 2.0
