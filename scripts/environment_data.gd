extends RefCounted
class_name XethkiozEnvironmentData

const BLOCKS := [
	{
		"id":1,"maps":Vector2i(1,5),"region":"Izrdralar","biome":"Bosque Místico",
		"stages":[
			{"time":"Amanecer","weather":"Rocío Prismático","effect":"motes","enemy":"normal","tint":"#ffe0c4"},
			{"time":"Mediodía","weather":"Brisa del Quebracho","effect":"wind","enemy":"swift","tint":"#f4f7ff"},
			{"time":"Tarde","weather":"Bruma Espiritual","effect":"mist","enemy":"spectral","tint":"#d9e7ff"},
			{"time":"Noche","weather":"Luna de Killaruna","effect":"night_motes","enemy":"nocturnal","tint":"#889bd6"},
			{"time":"Crepúsculo","weather":"Tormenta Prismática","effect":"storm","enemy":"charged","tint":"#9b86d9"}
		]
	},
	{
		"id":2,"maps":Vector2i(6,10),"region":"Izrdralar","biome":"Ruinas de la Pampa",
		"stages":[
			{"time":"Mañana","weather":"Polvo Pampeano","effect":"dust","enemy":"dusty","tint":"#f5d6a1"},
			{"time":"Mediodía","weather":"Lluvia sobre las Ruinas","effect":"rain","enemy":"wet","tint":"#b8c8d8"},
			{"time":"Atardecer","weather":"Cielo de Cobre","effect":"embers","enemy":"swift","tint":"#ef9b65"},
			{"time":"Noche","weather":"Interferencia Prismática","effect":"corruption","enemy":"corrupted","tint":"#8673bd"},
			{"time":"Medianoche","weather":"Tormenta Eléctrica","effect":"storm","enemy":"charged","tint":"#667bbd"}
		]
	},
	{
		"id":3,"maps":Vector2i(11,15),"region":"Desfralar","biome":"Cavernas Profundas",
		"stages":[
			{"time":"Sin cielo","weather":"Esporas Bioluminiscentes","effect":"spores","enemy":"fungal","tint":"#8fd6c6"},
			{"time":"Sin cielo","weather":"Goteo Ancestral","effect":"drip","enemy":"wet","tint":"#7fa5bd"},
			{"time":"Sin cielo","weather":"Nube Micelial","effect":"toxic_mist","enemy":"toxic","tint":"#8cb676"},
			{"time":"Oscuridad Total","weather":"Ecos del Vacío","effect":"blackout","enemy":"spectral","tint":"#595781"},
			{"time":"Sin cielo","weather":"Temblor de Raíces","effect":"seismic","enemy":"armored","tint":"#846b63"}
		]
	},
	{
		"id":4,"maps":Vector2i(16,20),"region":"Desfralar","biome":"Ciénaga Espiritual",
		"stages":[
			{"time":"Mañana gris","weather":"Cielo Cerrado","effect":"overcast","enemy":"normal","tint":"#a9b7aa"},
			{"time":"Tarde","weather":"Lluvia de Pantano","effect":"rain","enemy":"wet","tint":"#7ea091"},
			{"time":"Ocaso","weather":"Niebla Venenosa","effect":"toxic_mist","enemy":"toxic","tint":"#95aa72"},
			{"time":"Noche","weather":"Fuegos Fatuos","effect":"night_motes","enemy":"spirit","tint":"#7186aa"},
			{"time":"Noche","weather":"Tormenta de Almas","effect":"spirit_storm","enemy":"spectral","tint":"#806ca8"}
		]
	},
	{
		"id":5,"maps":Vector2i(21,25),"region":"Xiomalar","biome":"Cumbres Heladas",
		"stages":[
			{"time":"Mañana","weather":"Frío Seco","effect":"cold","enemy":"frost","tint":"#dcecff"},
			{"time":"Mediodía","weather":"Nevada Suave","effect":"snow","enemy":"frost","tint":"#c8dcf2"},
			{"time":"Tarde","weather":"Ventisca","effect":"blizzard","enemy":"blizzard","tint":"#aebfd7"},
			{"time":"Noche","weather":"Aurora Prismática","effect":"aurora","enemy":"astral","tint":"#8697cc"},
			{"time":"Noche","weather":"Tormenta Blanca","effect":"whiteout","enemy":"blizzard","tint":"#a4b6ca"}
		]
	},
	{
		"id":6,"maps":Vector2i(26,30),"region":"Xiomalar","biome":"Ciudad Flotante",
		"stages":[
			{"time":"Amanecer","weather":"Cielo Abierto","effect":"motes","enemy":"celestial","tint":"#f2ddc7"},
			{"time":"Mediodía","weather":"Viento de Altura","effect":"wind","enemy":"swift","tint":"#d9e9ff"},
			{"time":"Atardecer","weather":"Resplandor Dorado","effect":"embers","enemy":"celestial","tint":"#e9b67c"},
			{"time":"Noche","weather":"Marea Astral","effect":"aurora","enemy":"astral","tint":"#8d8ed0"},
			{"time":"Medianoche","weather":"Tormenta Celeste","effect":"celestial_storm","enemy":"charged","tint":"#747db8"}
		]
	},
	{
		"id":7,"maps":Vector2i(31,32),"region":"Xiomalar","biome":"Dimensión del Ensueño",
		"stages":[
			{"time":"Eclipse","weather":"Miasma del Ensueño","effect":"nightmare","enemy":"nightmare","tint":"#715b8e"},
			{"time":"Sin tiempo","weather":"Colapso Prismático","effect":"reality_storm","enemy":"nightmare_elite","tint":"#9b5d93"}
		]
	}
]

const ENEMY_VARIANTS := {
	"normal":{"label":"Común","tint":"#ffffff","hp":1.0,"damage":1.0,"speed":1.0,"reward":1.0},
	"swift":{"label":"Veloz","tint":"#c7f2ff","hp":0.90,"damage":1.0,"speed":1.28,"reward":1.05},
	"spectral":{"label":"Espectral","tint":"#c8b9ff","hp":0.92,"damage":1.12,"speed":1.08,"reward":1.15},
	"nocturnal":{"label":"Nocturno","tint":"#8fa8ff","hp":1.05,"damage":1.15,"speed":1.12,"reward":1.15},
	"charged":{"label":"Cargado","tint":"#d8a6ff","hp":1.12,"damage":1.25,"speed":1.12,"reward":1.30},
	"dusty":{"label":"Pampeano","tint":"#d8b37c","hp":1.05,"damage":1.05,"speed":0.96,"reward":1.05},
	"wet":{"label":"Empapado","tint":"#9bc9df","hp":1.08,"damage":0.98,"speed":0.92,"reward":1.08},
	"corrupted":{"label":"Corrupto","tint":"#b573d5","hp":1.20,"damage":1.18,"speed":1.02,"reward":1.28},
	"fungal":{"label":"Micelial","tint":"#93d59f","hp":1.08,"damage":1.08,"speed":0.94,"reward":1.10},
	"toxic":{"label":"Tóxico","tint":"#a9ce70","hp":1.12,"damage":1.20,"speed":0.96,"reward":1.22},
	"armored":{"label":"Pétreo","tint":"#b0a092","hp":1.35,"damage":1.08,"speed":0.78,"reward":1.25},
	"spirit":{"label":"Espiritual","tint":"#8ed7ca","hp":0.96,"damage":1.18,"speed":1.18,"reward":1.22},
	"frost":{"label":"Glacial","tint":"#d9f3ff","hp":1.10,"damage":1.08,"speed":0.92,"reward":1.12},
	"blizzard":{"label":"Ventisca","tint":"#b9d4ee","hp":1.18,"damage":1.18,"speed":0.88,"reward":1.22},
	"celestial":{"label":"Celestial","tint":"#f7dfa4","hp":1.18,"damage":1.16,"speed":1.08,"reward":1.24},
	"astral":{"label":"Astral","tint":"#c0a9ff","hp":1.16,"damage":1.22,"speed":1.14,"reward":1.28},
	"nightmare":{"label":"Ensueño","tint":"#d58ad7","hp":1.28,"damage":1.28,"speed":1.12,"reward":1.35},
	"nightmare_elite":{"label":"Ensueño Primigenio","tint":"#ff8acb","hp":1.45,"damage":1.38,"speed":1.16,"reward":1.50}
}

static func profile_for_map(map_no: int) -> Dictionary:
	var n := clampi(map_no,1,32)
	for block in BLOCKS:
		var span: Vector2i = block["maps"]
		if n >= span.x and n <= span.y:
			var stage_index := n - span.x
			var stage: Dictionary = block["stages"][clampi(stage_index,0,block["stages"].size()-1)].duplicate(true)
			stage["map"] = n
			stage["block"] = int(block["id"])
			stage["region"] = str(block["region"])
			stage["biome"] = str(block["biome"])
			stage["boss_stage"] = n in [5,10,15,20,25,30,32]
			return stage
	return {}

static func enemy_variant_for_map(map_no: int) -> Dictionary:
	var profile := profile_for_map(map_no)
	var key := str(profile.get("enemy","normal"))
	var result: Dictionary = ENEMY_VARIANTS.get(key,ENEMY_VARIANTS["normal"]).duplicate(true)
	result["key"] = key
	return result

static func block_for_map(map_no: int) -> int:
	return int(profile_for_map(map_no).get("block",1))

static func validate_all() -> bool:
	for map_no in range(1,33):
		var profile := profile_for_map(map_no)
		if profile.is_empty(): return false
		for required in ["map","block","region","biome","time","weather","effect","enemy","tint"]:
			if not profile.has(required): return false
		if not ENEMY_VARIANTS.has(str(profile["enemy"])): return false
	return true
