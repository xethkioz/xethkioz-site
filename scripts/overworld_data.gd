extends RefCounted
class_name XethkiozOverworldData

const TOTAL_NODES := 120
const DEMO_ACTIVE_NODES := 15
const BASE_GAME_NODES := 32

const NODE_NAMES := {
	1:"El Despertar de Izrdralar", 2:"Sendero del Quebracho Vivo", 3:"Bruma sobre el Arroyo Prismático", 4:"Luna de Killaruna", 5:"Guardián del Bosque Velado",
	6:"Pastizales del Resplandor", 7:"Arcos de Piedra Caída", 8:"Ruta de los Cristales Rotos", 9:"Santuario del Eco Viejo", 10:"Centinela de la Llanura Prismática",
	11:"Columnas del Primer Cisma", 12:"Borde del Valle Resonante", 13:"Ruinas del Día Quieto", 14:"La Grieta Bajo Izrdralar", 15:"Arconte del Umbral Subterráneo",
	16:"Raíces de la Tierra Dormida", 17:"Galería de los Susurros", 18:"Estanque del Micelio Azul", 19:"Cámara del Musgo Sagrado", 20:"Behemoth de la Caverna Viva",
	21:"Lianas del Jardín sin Sol", 22:"Cenagal de las Almas Lentas", 23:"Puentes del Fango Luminoso", 24:"Altar de la Flor Negra", 25:"Reina de la Ciénaga Espiritual",
	26:"Escalera de Nubes Rotas", 27:"Terraza del Viento Blanco", 28:"Templo del Horizonte Prismático", 29:"Pasaje de las Campanas Astrales", 30:"Custodio de Xiomalar",
	31:"Velo de la Pesadilla", 32:"Xethkioz de Ensueño"
}

const BOSS_NODES := [5,10,15,20,25,30,32]
const REFUGE_NODES := [5,10,15,20,25,30]
const ALEXIS_NODES := [1,6,11,16,21,26,31]
const SECRET_NODES := [3,9,14,19,24,29]
const LEGENDARY_NODES := [7,11,15,19,23,27,31]

const FUTURE_REGIONS := [
	{"from":33,"to":45,"name":"NigZen Expandido"},
	{"from":46,"to":60,"name":"Archipiélago Fracturado"},
	{"from":61,"to":75,"name":"Profundidades Perdidas"},
	{"from":76,"to":90,"name":"Xiomalar Exterior"},
	{"from":91,"to":105,"name":"Reino del Eco Sombrío"},
	{"from":106,"to":120,"name":"Corona Exterior"}
]

static func region_for_node(id: int) -> String:
	if id <= 15: return "Izrdralar"
	if id <= 25: return "Desfralar"
	if id <= 30: return "Xiomalar"
	if id <= 32: return "Ensueño"
	for region in FUTURE_REGIONS:
		if id >= int(region["from"]) and id <= int(region["to"]): return str(region["name"])
	return "Territorio Desconocido"

static func node_name(id: int) -> String:
	if NODE_NAMES.has(id): return str(NODE_NAMES[id])
	return "Nodo futuro %03d" % id

static func node_type(id: int) -> String:
	if id in BOSS_NODES: return "boss"
	if id in LEGENDARY_NODES: return "legendary"
	if id in SECRET_NODES: return "secret"
	if id in ALEXIS_NODES: return "guide"
	return "normal"

static func next_nodes(id: int) -> Array[int]:
	if id >= TOTAL_NODES: return []
	var result: Array[int] = [id+1]
	# Controlled alternate paths. They rejoin the main route and do not skip bosses.
	if id in [2,7,12,17,22,27,37,52,67,82,97]: result.append(mini(id+2,TOTAL_NODES))
	return result

static func block_index(id: int) -> int:
	if id <= 0: return 0
	return int((id-1)/5)

static func demo_tier(id: int) -> int:
	return clampi(int((id-1)/5),0,2)

static func node_position(id: int) -> Vector2:
	# 2200 x 1100 logical overworld. First 32 nodes are hand-positioned in readable chains.
	if id <= 15:
		var row: int = int((id-1)/5)
		var col: int = int((id-1)%5)
		var x: float = 180.0 + float(col)*175.0
		var y: float = 180.0 + float(row)*220.0
		if row % 2 == 1: x = 880.0 - float(col)*175.0
		return Vector2(x,y)
	if id <= 25:
		var local: int = id-16
		var row2: int = int(local/5)
		var col2: int = int(local%5)
		var x2: float = 980.0 + float(col2)*145.0
		var y2: float = 550.0 + float(row2)*190.0
		if row2 % 2 == 1: x2 = 1560.0 - float(col2)*145.0
		return Vector2(x2,y2)
	if id <= 30:
		return Vector2(1220.0+float(id-26)*155.0,250.0+sin(float(id)*1.7)*45.0)
	if id <= 32:
		return Vector2(1820.0+float(id-31)*180.0,540.0)
	# Future nodes: clustered into six projected expansion territories.
	var region_index: int = 0
	for i in range(FUTURE_REGIONS.size()):
		var r: Dictionary = FUTURE_REGIONS[i]
		if id >= int(r["from"]) and id <= int(r["to"]): region_index = i; break
	var base_positions: Array[Vector2] = [Vector2(1650,820),Vector2(1850,180),Vector2(1120,880),Vector2(1720,360),Vector2(1450,690),Vector2(1980,900)]
	var base: Vector2 = base_positions[region_index]
	var first: int = int(FUTURE_REGIONS[region_index]["from"])
	var offset: int = id-first
	var angle: float = float(offset)*0.72
	var ring: float = 55.0+float(offset%5)*22.0
	return base+Vector2(cos(angle),sin(angle))*ring

static func is_demo_node(id: int) -> bool:
	return id >= 1 and id <= DEMO_ACTIVE_NODES

static func is_base_game_node(id: int) -> bool:
	return id >= 1 and id <= BASE_GAME_NODES

static func description(id: int) -> String:
	if id <= 5: return "Bosque Místico • clima cambiante • aprendizaje de movimiento y familia"
	if id <= 10: return "Llanuras Prismáticas y ruinas • más rutas • enemigos combinados"
	if id <= 15: return "Ruinas del Primer Cisma • puzzles más complejos • transición a Desfralar"
	if id <= 25: return "Desfralar • cavernas, micelio y ciénaga espiritual"
	if id <= 30: return "Xiomalar • islas flotantes y guardianes celestes"
	if id <= 32: return "Frontera del Ensueño • cierre de campaña"
	return "%s • expansión futura" % region_for_node(id)
