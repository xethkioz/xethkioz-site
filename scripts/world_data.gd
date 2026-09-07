extends RefCounted
class_name WorldOfXethkiozData

const PLAYER_BASE := {
	"name":"Viajero",
	"class":"Aprendiz Prismático",
	"hp":100.0,
	"speed":1.0,
	"damage":1.0,
	"color":"#8b5cf6",
	"weapon":"Arma de viajero",
	"skills":["Sin mentor","Sin mentor","Sin mentor"]
}

# CANON FAMILIAR BLOQUEADO
# Ashley: femenino | Fermín: masculino | Gael: masculino | Isabella: femenino.
# Los cuatro hermanos son mentores de clase. La elección se realiza tras el jefe del mapa 5.
# El orden mantiene compatibilidad con las partidas v0.3 anteriores.
const HEROES := [
	{"name":"Ashley","gender":"Femenino","pronoun":"ella","relationship":"Hermana","class":"Bardo","role":"Soporte / Control / Buffs","hp":94.0,"speed":1.05,"damage":0.95,"color":"#d96cff","secondary":"#ffd166","weapon":"Laúd rúnico","skills":["Acorde Cortante","Balada de Vigor","Resonancia Arcana"]},
	{"name":"Fermín","gender":"Masculino","pronoun":"él","relationship":"Hermano","class":"Guerrero","role":"Tanque / Fuerza Bruta","hp":122.0,"speed":0.93,"damage":1.14,"color":"#ff754c","secondary":"#d7dde8","weapon":"Espada pesada","skills":["Corte Quebrador","Guardia de Hierro","Embate del León"]},
	{"name":"Isabella","gender":"Femenino","pronoun":"ella","relationship":"Hermana","class":"Bruja del Caos","role":"Daño mágico en área / Debuffs","hp":88.0,"speed":1.00,"damage":1.18,"color":"#a66cff","secondary":"#58d9ff","weapon":"Códice del Caos","skills":["Orbe Inestable","Marca del Vacío","Ruptura Caótica"]},
	{"name":"Gael","gender":"Masculino","pronoun":"él","relationship":"Hermano","class":"Arquero","role":"Ataque a distancia / Trampas","hp":98.0,"speed":1.09,"damage":1.02,"color":"#6ed8ff","secondary":"#71df83","weapon":"Arco de Izrdralar","skills":["Flecha Gemela","Paso del Viento","Lluvia Astral"]}
]

const NPCS := {
	"Alexis":{"gender":"Masculino","pronoun":"él","relationship":"Padre","title":"El Padre Explorador","function":"Mapas, tácticas y Puntos de Paternidad","color":"#ff8c42","secondary":"#8b5cf6"},
	"Elida":{"gender":"Femenino","pronoun":"ella","relationship":"Abuela","title":"La Abuela Mística","function":"Curación, raciones, maldiciones y guardado","color":"#8fd694","secondary":"#f5d77a"},
	"Don Argento":{"gender":"Masculino","pronoun":"él","relationship":"NPC","title":"El Cambista","function":"Mercader de amuletos y suministros","color":"#c4ccd7","secondary":"#ff8c42"},
	"Chamán Nahuel":{"gender":"Masculino","pronoun":"él","relationship":"NPC","title":"Guardián de la Fauna","function":"Misiones de las ocho mascotas legendarias","color":"#6fbf73","secondary":"#d1a15f"},
	"Anahí de Cristal":{"gender":"Femenino","pronoun":"ella","relationship":"NPC","title":"Espíritu del Ceibo","function":"Revela accesos ilusorios a NigZen","color":"#ff729f","secondary":"#9be7ff"}
}

const LEGENDARIES := [
	{"name":"Xethkioz","power":7.0,"element":"Guardián Leal","bonus":"Restauración periódica de salud","auto":"Mordisco místico rápido"},
	{"name":"Itzuke","power":8.0,"element":"Rayo","bonus":"Impulso de velocidad y daño al Dash","auto":"Descargas eléctricas automáticas"},
	{"name":"Mozaruk","power":9.0,"element":"Tierra","bonus":"Aumento temporal de armadura física","auto":"Golpes sísmicos en área"},
	{"name":"Killaruna","power":9.5,"element":"Luz Lunar","bonus":"Regeneración de maná y detección de secretos","auto":"Proyectiles de luz guiados"},
	{"name":"Heller","power":10.0,"element":"Fuego Infernal","bonus":"Aura de quemadura continua","auto":"Orbes de fuego giratorios"},
	{"name":"Kahezer","power":11.0,"element":"Viento del Abismo","bonus":"Dash a través de enemigos","auto":"Ráfagas cortantes"},
	{"name":"Okuninust","power":12.0,"element":"Agua / Mareas","bonus":"Escudo de burbuja que absorbe un golpe","auto":"Chorros de agua a distancia"},
	{"name":"Dvalin","power":13.0,"element":"Dragón Glacial","bonus":"+20% probabilidad de golpe crítico","auto":"Aliento de hielo congelante"}
]

const BOSS_NAMES := [
	"Arconte de Ceniza",
	"Serafín de las Diez Campanas",
	"Madre Raíz de Desfralar",
	"Custodio de la Ciénaga",
	"Guardián de las Cumbres",
	"Dvalin Corrupto",
	"Xethkioz de Ensueño"
]

const BIOMES := [
	{"name":"Bosque Místico","maps":"1-4","realm":"Izrdralar","feature":"Bosques y quebrachos mágicos luminiscentes"},
	{"name":"Ruinas de la Pampa","maps":"5-8","realm":"Izrdralar","feature":"Tecnología de Argentina 2150 cubierta por naturaleza"},
	{"name":"Cavernas Profundas","maps":"9-12","realm":"Desfralar","feature":"Hongos, micelio y espíritus subterráneos"},
	{"name":"Jardín sin Sol","maps":"13-16","realm":"Desfralar","feature":"Raíces vivas, ecos y flora que nunca vio el cielo"},
	{"name":"Ciénaga Espiritual","maps":"17-20","realm":"Desfralar","feature":"Pantanos venenosos y bruma espectral"},
	{"name":"Cumbres Heladas","maps":"21-25","realm":"Xiomalar","feature":"Andes Prismáticos, hielo y ascenso al reino celeste"},
	{"name":"Ciudad Flotante","maps":"26-30","realm":"Xiomalar","feature":"Templos divinos, vacíos y gravedad alterada"},
	{"name":"Dimensión de la Pesadilla","maps":"31-32","realm":"Xiomalar","feature":"Fisura prismática total y miasma del Ensueño"}
]

const MAP_NAMES := [
	"El Despertar de Izrdralar","Sendero de las Luciérnagas","Bosque del Primer Vínculo","Ruinas de Albor","Puerta del Arconte",
	"Campos de Mana","Torre del Viento","Lago de Cristal","Descenso a Desfralar","Templo de las Diez Campanas",
	"Valle de Mozaruk","Cavernas del Micelio","Raíces que Susurran","Jardín sin Sol","Trono de la Madre Raíz",
	"Galerías del Eco","Río Bajo la Piedra","Cámara de Heller","Bosque Invertido","Trono de la Ciénaga",
	"Escalera de los Espíritus","Paso de Hielo Prismático","Primer Cielo de Xiomalar","Puentes del Alba","Guardián de las Cumbres",
	"Mar de Nubes","Biblioteca de Okuninust","Jardines Celestes","Forja de Kahezer","Bastión de Dvalin",
	"Camino del Ensueño","El Sueño de Xethkioz"
]

static func hero(index: int) -> Dictionary:
	return HEROES[clamp(index,0,HEROES.size()-1)]

static func hero_by_name(hero_name: String) -> Dictionary:
	for profile in HEROES:
		if str(profile.get("name","")) == hero_name:
			return profile
	return HEROES[0]

static func family_profile(character_name: String) -> Dictionary:
	for profile in HEROES:
		if str(profile.get("name","")) == character_name:
			return profile
	if NPCS.has(character_name):
		var npc: Dictionary = NPCS[character_name].duplicate(true)
		npc["name"] = character_name
		return npc
	return {"name":character_name,"gender":"No definido","relationship":"NPC","color":"#8b5cf6","secondary":"#ff8c42"}

static func player_base() -> Dictionary:
	return PLAYER_BASE

static func region_for_map(map_no: int) -> String:
	if map_no <= 8:
		return "Izrdralar"
	if map_no <= 20:
		return "Desfralar"
	return "Xiomalar"

static func biome_for_map(map_no: int) -> String:
	if map_no <= 4: return "Bosque Místico"
	if map_no <= 8: return "Ruinas de la Pampa"
	if map_no <= 12: return "Cavernas Profundas"
	if map_no <= 16: return "Jardín sin Sol"
	if map_no <= 20: return "Ciénaga Espiritual"
	if map_no <= 25: return "Cumbres Heladas"
	if map_no <= 30: return "Ciudad Flotante"
	return "Dimensión de la Pesadilla"

static func map_name(map_no: int) -> String:
	return MAP_NAMES[clamp(map_no-1,0,MAP_NAMES.size()-1)]
