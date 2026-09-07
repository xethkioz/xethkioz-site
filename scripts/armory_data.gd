extends RefCounted
class_name XethkiozArmoryData

const SETS := [
	{"id":"brote_vivo","name":"Set del Brote Vivo","affinity":"General","power":1.15,"unlock_map":1,"bonus":"+vida y resistencia","ultimate":"Brote Protector"},
	{"id":"quebracho","name":"Set del Quebracho","affinity":"Guerrero","power":1.30,"unlock_map":5,"bonus":"+armadura y guardia","ultimate":"Embestida del Quebracho"},
	{"id":"resonancia","name":"Set de Resonancia","affinity":"Bardo","power":1.28,"unlock_map":5,"bonus":"+soporte y curación","ultimate":"Aura Rítmica"},
	{"id":"senderista","name":"Set del Senderista","affinity":"Arquero","power":1.28,"unlock_map":5,"bonus":"+movilidad y crítico","ultimate":"Lluvia Prismática"},
	{"id":"cisma_menor","name":"Set del Cisma Menor","affinity":"Bruja del Caos","power":1.32,"unlock_map":5,"bonus":"+maná y daño mágico","ultimate":"Ruptura Caótica"},
	{"id":"arroyo","name":"Set del Arroyo Prismático","affinity":"General","power":1.34,"unlock_map":7,"bonus":"+recuperación y hallazgo","ultimate":"Corriente Viva"},
	{"id":"eco_antiguo","name":"Set del Eco Antiguo","affinity":"Exploración","power":1.38,"unlock_map":9,"bonus":"+detección y energía legendaria","ultimate":"Resonancia Antigua"},
	{"id":"ruina_vigilante","name":"Set de Ruina Vigilante","affinity":"Híbrido","power":1.44,"unlock_map":10,"bonus":"+vida y daño a élites","ultimate":"Vigilia del Cisma"},
	{"id":"umbral","name":"Set del Umbral","affinity":"Mixto","power":1.52,"unlock_map":13,"bonus":"+resistencia y poder de habilidad","ultimate":"Paso del Umbral"},
	{"id":"peregrino_celeste","name":"Set del Peregrino Celeste","affinity":"Movilidad","power":1.60,"unlock_map":15,"bonus":"+movilidad aérea y recuperación","ultimate":"Salto Prismático"}
]

const WEAPONS := [
	{"id":1,"name":"Espada de Brote","affinity":"Guerrero","power":1.05,"unlock_map":1,"rarity":"Common"},
	{"id":2,"name":"Maza de Corteza","affinity":"Guerrero","power":1.12,"unlock_map":2,"rarity":"Common"},
	{"id":3,"name":"Lanza del Arroyo","affinity":"Guerrero","power":1.18,"unlock_map":3,"rarity":"Common"},
	{"id":4,"name":"Hacha del Quebracho","affinity":"Guerrero","power":1.28,"unlock_map":5,"rarity":"Uncommon"},
	{"id":5,"name":"Rodela Prismática","affinity":"Guerrero","power":1.22,"unlock_map":5,"rarity":"Uncommon"},
	{"id":6,"name":"Laúd de Luciérnagas","affinity":"Bardo","power":1.05,"unlock_map":1,"rarity":"Common"},
	{"id":7,"name":"Mandolina de Bruma","affinity":"Bardo","power":1.14,"unlock_map":3,"rarity":"Common"},
	{"id":8,"name":"Flauta del Alba","affinity":"Bardo","power":1.20,"unlock_map":5,"rarity":"Uncommon"},
	{"id":9,"name":"Arpa de Raíces","affinity":"Bardo","power":1.34,"unlock_map":8,"rarity":"Rare"},
	{"id":10,"name":"Tambores del Sendero","affinity":"Bardo","power":1.42,"unlock_map":10,"rarity":"Rare"},
	{"id":11,"name":"Arco del Rocío","affinity":"Arquero","power":1.05,"unlock_map":1,"rarity":"Common"},
	{"id":12,"name":"Arco Largo del Bosque","affinity":"Arquero","power":1.16,"unlock_map":3,"rarity":"Common"},
	{"id":13,"name":"Ballesta de Piedra","affinity":"Arquero","power":1.24,"unlock_map":5,"rarity":"Uncommon"},
	{"id":14,"name":"Arco de Cristal","affinity":"Arquero","power":1.38,"unlock_map":8,"rarity":"Rare"},
	{"id":15,"name":"Honda Prismática","affinity":"Arquero","power":1.48,"unlock_map":10,"rarity":"Rare"},
	{"id":16,"name":"Báculo del Cisma","affinity":"Bruja del Caos","power":1.05,"unlock_map":1,"rarity":"Common"},
	{"id":17,"name":"Orbe de Bruma","affinity":"Bruja del Caos","power":1.16,"unlock_map":3,"rarity":"Common"},
	{"id":18,"name":"Grimorio del Eco","affinity":"Bruja del Caos","power":1.25,"unlock_map":5,"rarity":"Uncommon"},
	{"id":19,"name":"Vara de Musgo Azul","affinity":"Bruja del Caos","power":1.40,"unlock_map":8,"rarity":"Rare"},
	{"id":20,"name":"Cetro de Killaruna","affinity":"Bruja del Caos","power":1.52,"unlock_map":10,"rarity":"Rare"},
	{"id":21,"name":"Daga Prismática","affinity":"Universal","power":1.22,"unlock_map":6,"rarity":"Uncommon"},
	{"id":22,"name":"Guantes del Impulso","affinity":"Universal","power":1.34,"unlock_map":7,"rarity":"Rare"},
	{"id":23,"name":"Pica del Peregrino","affinity":"Universal","power":1.46,"unlock_map":11,"rarity":"Rare"},
	{"id":24,"name":"Reliquia de Alexis","affinity":"Universal","power":1.55,"unlock_map":13,"rarity":"Epic"},
	{"id":25,"name":"Catalizador del Refugio","affinity":"Universal","power":1.62,"unlock_map":14,"rarity":"Epic"}
]

const LEGENDARY_WEAPONS := [
	{"id":101,"name":"Veredicto del Primer Cisma","affinity":"Guerrero / Híbrido","power":2.25,"unlock_map":15,"rarity":"Legendary","description":"Golpe cargado, defensa activa y aura de juicio."},
	{"id":102,"name":"Aria del Umbral Prismático","affinity":"Bardo / Arquero / Bruja del Caos","power":2.20,"unlock_map":15,"rarity":"Legendary","description":"Ráfaga adaptable con eco ofensivo y apoyo mágico."}
]

const PREMIUM_WINGS := {
	"id":"alas_mecenas_prismatico",
	"name":"Alas del Mecenas Prismático",
	"description":"Cosmético PREMIUM. El buff es pequeño y no competitivo.",
	"buffs":[
		{"id":"speed","label":"+3% velocidad","value":0.03},
		{"id":"find","label":"+3% hallazgo","value":0.03},
		{"id":"mana","label":"+2% maná","value":0.02},
		{"id":"resist","label":"+2% resistencia","value":0.02},
		{"id":"ration","label":"+1 ración inicial","value":1.0}
	]
}

static func weapon_by_id(id: int) -> Dictionary:
	for w in WEAPONS:
		if int(w["id"]) == id: return w.duplicate(true)
	for w in LEGENDARY_WEAPONS:
		if int(w["id"]) == id: return w.duplicate(true)
	return WEAPONS[0].duplicate(true)

static func set_by_id(id: String) -> Dictionary:
	for s in SETS:
		if str(s["id"]) == id: return s.duplicate(true)
	return SETS[0].duplicate(true)

static func unlocked_weapon_ids(unlocked_map: int) -> Array[int]:
	var ids: Array[int] = []
	for w in WEAPONS:
		if unlocked_map >= int(w["unlock_map"]): ids.append(int(w["id"]))
	if unlocked_map >= 15:
		for w in LEGENDARY_WEAPONS: ids.append(int(w["id"]))
	return ids

static func unlocked_set_ids(unlocked_map: int) -> Array[String]:
	var ids: Array[String] = []
	for s in SETS:
		if unlocked_map >= int(s["unlock_map"]): ids.append(str(s["id"]))
	return ids

static func random_premium_buff(seed_value: int) -> Dictionary:
	var buffs: Array = PREMIUM_WINGS["buffs"]
	if buffs.is_empty(): return {}
	var index: int = posmod(seed_value,buffs.size())
	return buffs[index].duplicate(true)
