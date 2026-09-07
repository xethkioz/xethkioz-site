extends RefCounted
class_name WorldOfXethkiozData

const HEROES := [
	{"name":"Ashley","class":"Bardo","hp":94.0,"speed":1.05,"damage":0.95,"color":"#d96cff","weapon":"Laúd rúnico","skills":["Acorde Cortante","Balada de Vigor","Resonancia Arcana"]},
	{"name":"Fermín","class":"Guerrero","hp":122.0,"speed":0.93,"damage":1.14,"color":"#ff754c","weapon":"Espada pesada","skills":["Corte Quebrador","Guardia de Hierro","Embate del León"]},
	{"name":"Isabella","class":"Arquero","hp":98.0,"speed":1.09,"damage":1.02,"color":"#6ed8ff","weapon":"Arco de Izrdralar","skills":["Flecha Gemela","Paso del Viento","Lluvia Astral"]},
	{"name":"Gael","class":"Brujo del Caos","hp":88.0,"speed":1.00,"damage":1.18,"color":"#a66cff","weapon":"Foco del Caos","skills":["Orbe Inestable","Marca del Vacío","Ruptura Caótica"]}
]

const LEGENDARIES := [
	{"name":"Xethkioz","power":7.0,"bonus":"Ensueño primordial"},
	{"name":"Itzuke","power":8.0,"bonus":"Espíritu del viento"},
	{"name":"Mozaruk","power":9.0,"bonus":"Bestia de magma"},
	{"name":"Killaruna","power":9.5,"bonus":"Entidad lunar"},
	{"name":"Heller","power":10.0,"bonus":"Guardián de sombras"},
	{"name":"Kahezer","power":11.0,"bonus":"Dragón de raíces"},
	{"name":"Okuninust","power":12.0,"bonus":"Oráculo celeste"},
	{"name":"Dvalin","power":13.0,"bonus":"Titán antiguo"}
]

const BOSS_NAMES := [
	"Arconte de Ceniza",
	"Serafín de las Diez Campanas",
	"Madre Raíz de Desfralar",
	"Custodio del Umbral",
	"Heraldo de Xiomalar",
	"Dvalin Corrupto",
	"Xethkioz de Ensueño"
]

const MAP_NAMES := [
	"El Despertar de Izrdralar","Sendero de las Luciérnagas","Bosque del Primer Vínculo","Ruinas de Albor","Puerta del Arconte",
	"Campos de Mana","Torre del Viento","Lago de Cristal","Santuario Quebrado","Templo de las Diez Campanas",
	"Valle de Mozaruk","Umbral de Izrdralar","Descenso a Desfralar","Raíces que Susurran","Jardín sin Sol",
	"Galerías del Eco","Río Bajo la Piedra","Cámara de Heller","Bosque Invertido","Trono del Umbral",
	"Corazón de Desfralar","Escalera de los Espíritus","Primer Cielo de Xiomalar","Puentes del Alba","Templo de Killaruna",
	"Mar de Nubes","Biblioteca de Okuninust","Jardines Celestes","Forja de Kahezer","Bastión de Dvalin",
	"Camino del Ensueño","El Sueño de Xethkioz"
]

static func hero(index: int) -> Dictionary:
	return HEROES[clamp(index,0,HEROES.size()-1)]

static func region_for_map(map_no: int) -> String:
	if map_no <= 12:
		return "Izrdralar"
	if map_no <= 22:
		return "Desfralar"
	return "Xiomalar"

static func map_name(map_no: int) -> String:
	return MAP_NAMES[clamp(map_no-1,0,MAP_NAMES.size()-1)]
