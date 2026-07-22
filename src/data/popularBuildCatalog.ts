export type BuildLang = 'es' | 'en'
export type PopularBuildGameId = 'wow' | 'diablo' | 'ffxiv' | 'poe'
export type BuildPopularity = 'most-used' | 'meta' | 'starter' | 'standard'

type LocalText = Record<BuildLang, string>
type LocalList = Record<BuildLang, readonly string[]>

export type PopularBuild = {
  id: string
  gameId: PopularBuildGameId
  classId: string
  name: string
  activity: LocalText
  popularity: BuildPopularity
  snapshot: LocalText
  summary: LocalText
  skills: LocalList
  stats: LocalList
  gear: LocalList
  rotation: LocalList
  progression: LocalList
  sourceLabel: string
  sourceHref: string
}

type BuildSeed = {
  id: string
  classId: string
  name: string
  activityEs: string
  activityEn: string
  popularity?: BuildPopularity
  focusEs: string
  focusEn: string
  skills: readonly string[]
  stats?: readonly string[]
  gear?: readonly string[]
  sourceHref: string
  sourceLabel: string
}

const snapshots: Record<PopularBuildGameId, LocalText> = {
  wow: { es: 'Midnight · Temporada 2 · revisión 22/07/2026', en: 'Midnight · Season 2 · reviewed Jul 22, 2026' },
  diablo: { es: 'Lord of Hatred · Temporada 14 · revisión 22/07/2026', en: 'Lord of Hatred · Season 14 · reviewed Jul 22, 2026' },
  ffxiv: { es: 'Dawntrail · parche 7.5 · nivel 100 · revisión 22/07/2026', en: 'Dawntrail · patch 7.5 · level 100 · reviewed Jul 22, 2026' },
  poe: { es: 'PoE 2 · Runes of Aldur 0.5.4b · revisión 22/07/2026', en: 'PoE 2 · Runes of Aldur 0.5.4b · reviewed Jul 22, 2026' },
}

const defaultStats: Record<PopularBuildGameId, LocalList> = {
  wow: {
    es: ['Nivel de objeto y arma útil primero', 'Simulá tu personaje: las secundarias cambian con el equipo', 'No rompas bonus de conjunto por una mejora mínima'],
    en: ['Useful item level and weapon first', 'Sim your character: secondary stats change with gear', 'Do not break a set bonus for a tiny upgrade'],
  },
  diablo: {
    es: ['Cap de resistencias y armadura antes del push', 'Daño de la habilidad núcleo y multiplicadores compatibles', 'Reducción de enfriamiento, recurso y velocidad según la variante'],
    en: ['Cap resistances and armour before pushing', 'Core-skill damage and compatible multipliers', 'Cooldown reduction, resource and speed for the chosen variant'],
  },
  ffxiv: {
    es: ['Cumplí primero el mínimo de velocidad de la rotación', 'Weapon Damage y atributo principal mandan', 'Materia: Crítico / Direct Hit / Determinación según el set enlazado'],
    en: ['Meet the rotation speed threshold first', 'Weapon Damage and main stat come first', 'Meld Critical Hit / Direct Hit / Determination according to the linked set'],
  },
  poe: {
    es: ['Resistencias y vida/ES antes de daño de lujo', 'Nivel de gemas o DPS del arma según el arquetipo', 'Velocidad, crítico y recuperación sólo cuando el recurso esté resuelto'],
    en: ['Resistances and Life/ES before luxury damage', 'Gem levels or weapon DPS according to the archetype', 'Speed, crit and recovery only after resource is solved'],
  },
}

const defaultGear: Record<PopularBuildGameId, LocalList> = {
  wow: {
    es: ['Bonus de 4 piezas de la temporada vigente', 'Arma y abalorios comparados con datos de la especialización', 'Engarces, encantamientos y consumibles antes de contenido serio'],
    en: ['Current-season four-piece set bonus', 'Weapon and trinkets compared with specialization data', 'Sockets, enchants and consumables before serious content'],
  },
  diablo: {
    es: ['Usá la variante sin únicos hasta conseguir los requisitos', 'Aplicá aspectos/poderes sólo sobre bases con estadísticas correctas', 'Masterwork: priorizá la afijación que habilita recurso, supervivencia o escalado'],
    en: ['Use the no-unique variant until requirements drop', 'Apply aspects/powers only to bases with correct affixes', 'Masterwork the affix that enables resource, survival or scaling'],
  },
  ffxiv: {
    es: ['Arma del mayor nivel disponible', 'Set Savage/Tomestones vigente con comida y materia del GCD elegido', 'No copies un BiS de Ultimate para contenido sin sincronización equivalente'],
    en: ['Highest available item-level weapon', 'Current Savage/Tomestone set with food and melds for the selected GCD', 'Do not copy an Ultimate BiS into content with different sync rules'],
  },
  poe: {
    es: ['Raros con vida/ES y resistencias para campaña y primeros mapas', 'Únicos obligatorios sólo cuando la guía indique transición', 'Runas, amuleto y arma deben apoyar una sola condición de daño'],
    en: ['Rares with Life/ES and resistances for campaign and early maps', 'Mandatory uniques only when the guide calls for the transition', 'Runes, amulet and weapon should support one damage condition'],
  },
}

function makeBuild(gameId: PopularBuildGameId, seed: BuildSeed): PopularBuild {
  return {
    id: seed.id,
    gameId,
    classId: seed.classId,
    name: seed.name,
    activity: { es: seed.activityEs, en: seed.activityEn },
    popularity: seed.popularity ?? 'meta',
    snapshot: snapshots[gameId],
    summary: { es: seed.focusEs, en: seed.focusEn },
    skills: { es: seed.skills, en: seed.skills },
    stats: seed.stats ? { es: seed.stats, en: seed.stats } : defaultStats[gameId],
    gear: seed.gear ? { es: seed.gear, en: seed.gear } : defaultGear[gameId],
    rotation: {
      es: [`Prepará recursos y buffs antes de ${seed.skills[0]}.`, `Usá ${seed.skills.slice(0, 3).join(' → ')} como núcleo; reservá movilidad para mecánicas.`, 'Gastá cooldowns en ventanas reales de daño y no cuando el objetivo vaya a desaparecer.'],
      en: [`Prepare resources and buffs before ${seed.skills[0]}.`, `Use ${seed.skills.slice(0, 3).join(' → ')} as the core loop; save mobility for mechanics.`, 'Spend cooldowns in real damage windows, not when the target is about to disappear.'],
    },
    progression: {
      es: ['Probá la versión inicial con equipo accesible.', 'Asegurá recurso y supervivencia antes de escalar daño.', 'Revisá la fuente enlazada después de cada hotfix o parche.'],
      en: ['Test the starter version with accessible gear.', 'Secure resource and survival before scaling damage.', 'Recheck the linked source after every hotfix or patch.'],
    },
    sourceLabel: seed.sourceLabel,
    sourceHref: seed.sourceHref,
  }
}

const archon = (spec: string, classSlug: string, activity = 'mythic-plus') => `https://www.archon.gg/wow/builds/${spec}/${classSlug}/${activity}/overview/10/all-dungeons/this-week`
const wowSeed = (classId: string, spec: string, classSlug: string, name: string, role: string, skills: readonly string[]): PopularBuild => makeBuild('wow', {
  id: `${classId}-${spec}-${role.includes('Raid') ? 'raid' : 'mplus'}`,
  classId,
  name,
  activityEs: role,
  activityEn: role.replace('Míticas+', 'Mythic+').replace('Sanador', 'Healer').replace('Tanque', 'Tank').replace('Daño', 'Damage'),
  popularity: 'most-used',
  focusEs: `Configuración popular de ${name} para ${role} en Midnight. El árbol exacto, Hero Talents, abalorios y variantes se actualizan desde registros de la semana.`,
  focusEn: `Popular ${name} setup for ${role} in Midnight. The exact tree, Hero Talents, trinkets and variants are refreshed from this week’s logs.`,
  skills,
  sourceLabel: 'Archon · datos de Warcraft Logs',
  sourceHref: archon(spec, classSlug),
})

const wowBuilds: readonly PopularBuild[] = [
  wowSeed('death-knight', 'blood', 'death-knight', 'Blood · build de supervivencia', 'Tanque · Míticas+', ['Death Strike', 'Marrowrend', 'Dancing Rune Weapon']),
  wowSeed('death-knight', 'frost', 'death-knight', 'Frost · burst de escarcha', 'Daño · Míticas+', ['Obliterate', 'Frost Strike', 'Pillar of Frost']),
  wowSeed('death-knight', 'unholy', 'death-knight', 'Unholy · ejército y enfermedades', 'Daño · Míticas+', ['Festering Strike', 'Scourge Strike', 'Apocalypse']),
  wowSeed('demon-hunter', 'havoc', 'demon-hunter', 'Havoc · Fel-Scarred', 'Daño · Míticas+', ['Eye Beam', 'Blade Dance', 'Metamorphosis']),
  wowSeed('demon-hunter', 'vengeance', 'demon-hunter', 'Vengeance · sigilos defensivos', 'Tanque · Míticas+', ['Demon Spikes', 'Soul Cleave', 'Fiery Brand']),
  wowSeed('demon-hunter', 'devourer', 'demon-hunter', 'Devourer · caster del Vacío', 'Daño · Míticas+', ['Void Ray', 'Soul Harvest', 'Shift']),
  wowSeed('druid', 'balance', 'druid', 'Balance · eclipses', 'Daño · Míticas+', ['Wrath', 'Starfire', 'Celestial Alignment']),
  wowSeed('druid', 'feral', 'druid', 'Feral · sangrados', 'Daño · Míticas+', ['Rake', 'Rip', 'Berserk']),
  wowSeed('druid', 'guardian', 'druid', 'Guardian · Ursoc', 'Tanque · Míticas+', ['Ironfur', 'Mangle', 'Incarnation']),
  wowSeed('druid', 'restoration', 'druid', 'Restoration · Wildstalker', 'Sanador · Míticas+', ['Rejuvenation', 'Wild Growth', 'Flourish']),
  wowSeed('evoker', 'devastation', 'evoker', 'Devastation · aliento dracónico', 'Daño · Míticas+', ['Disintegrate', 'Fire Breath', 'Dragonrage']),
  wowSeed('evoker', 'preservation', 'evoker', 'Preservation · ecos', 'Sanador · Míticas+', ['Echo', 'Dream Breath', 'Rewind']),
  wowSeed('evoker', 'augmentation', 'evoker', 'Augmentation · soporte', 'Daño/soporte · Míticas+', ['Ebon Might', 'Prescience', 'Breath of Eons']),
  wowSeed('hunter', 'beast-mastery', 'hunter', 'Beast Mastery · manada móvil', 'Daño · Míticas+', ['Kill Command', 'Barbed Shot', 'Bestial Wrath']),
  wowSeed('hunter', 'marksmanship', 'hunter', 'Marksmanship · precisión', 'Daño · Míticas+', ['Aimed Shot', 'Rapid Fire', 'Trueshot']),
  wowSeed('hunter', 'survival', 'hunter', 'Survival · melee y bombas', 'Daño · Míticas+', ['Wildfire Bomb', 'Raptor Strike', 'Coordinated Assault']),
  wowSeed('mage', 'arcane', 'mage', 'Arcane · burn/conserve', 'Daño · Míticas+', ['Arcane Blast', 'Arcane Barrage', 'Arcane Surge']),
  wowSeed('mage', 'fire', 'mage', 'Fire · Combustion', 'Daño · Míticas+', ['Fire Blast', 'Pyroblast', 'Combustion']),
  wowSeed('mage', 'frost', 'mage', 'Frost · Shatter', 'Daño · Míticas+', ['Frostbolt', 'Ice Lance', 'Icy Veins']),
  wowSeed('monk', 'brewmaster', 'monk', 'Brewmaster · Stagger', 'Tanque · Míticas+', ['Keg Smash', 'Purifying Brew', 'Celestial Brew']),
  wowSeed('monk', 'mistweaver', 'monk', 'Mistweaver · fistweaving', 'Sanador · Míticas+', ['Renewing Mist', 'Rising Sun Kick', 'Revival']),
  wowSeed('monk', 'windwalker', 'monk', 'Windwalker · combo', 'Daño · Míticas+', ['Rising Sun Kick', 'Fists of Fury', 'Storm, Earth, and Fire']),
  wowSeed('paladin', 'holy', 'paladin', 'Holy · combate cercano', 'Sanador · Míticas+', ['Holy Shock', 'Word of Glory', 'Avenging Wrath']),
  wowSeed('paladin', 'protection', 'paladin', 'Protection · escudo y consagración', 'Tanque · Míticas+', ['Shield of the Righteous', 'Consecration', 'Ardent Defender']),
  wowSeed('paladin', 'retribution', 'paladin', 'Retribution · Templar', 'Daño · Míticas+', ['Blade of Justice', 'Templar’s Verdict', 'Avenging Wrath']),
  wowSeed('priest', 'discipline', 'priest', 'Discipline · Atonement', 'Sanador · Míticas+', ['Power Word: Shield', 'Penance', 'Power Word: Radiance']),
  wowSeed('priest', 'holy', 'priest', 'Holy · palabras sagradas', 'Sanador · Míticas+', ['Prayer of Mending', 'Holy Word: Serenity', 'Divine Hymn']),
  wowSeed('priest', 'shadow', 'priest', 'Shadow · Voidweaver', 'Daño · Míticas+', ['Vampiric Touch', 'Devouring Plague', 'Void Eruption']),
  wowSeed('rogue', 'assassination', 'rogue', 'Assassination · venenos', 'Daño · Míticas+', ['Garrote', 'Rupture', 'Deathmark']),
  wowSeed('rogue', 'outlaw', 'rogue', 'Outlaw · pistolero', 'Daño · Míticas+', ['Sinister Strike', 'Dispatch', 'Adrenaline Rush']),
  wowSeed('rogue', 'subtlety', 'rogue', 'Subtlety · Shadow Dance', 'Daño · Míticas+', ['Shadowstrike', 'Eviscerate', 'Shadow Dance']),
  wowSeed('shaman', 'elemental', 'shaman', 'Elemental · tormenta', 'Daño · Míticas+', ['Lava Burst', 'Earth Shock', 'Stormkeeper']),
  wowSeed('shaman', 'enhancement', 'shaman', 'Enhancement · armas imbuidas', 'Daño · Míticas+', ['Stormstrike', 'Lava Lash', 'Feral Spirit']),
  wowSeed('shaman', 'restoration', 'shaman', 'Restoration · mareas', 'Sanador · Míticas+', ['Riptide', 'Chain Heal', 'Spirit Link Totem']),
  wowSeed('warlock', 'affliction', 'warlock', 'Affliction · DoTs', 'Daño · Míticas+', ['Agony', 'Unstable Affliction', 'Malefic Rapture']),
  wowSeed('warlock', 'demonology', 'warlock', 'Demonology · ejército demoníaco', 'Daño · Míticas+', ['Hand of Gul’dan', 'Demonbolt', 'Demonic Tyrant']),
  wowSeed('warlock', 'destruction', 'warlock', 'Destruction · Chaos Bolt', 'Daño · Míticas+', ['Immolate', 'Chaos Bolt', 'Summon Infernal']),
  wowSeed('warrior', 'arms', 'warrior', 'Arms · heridas profundas', 'Daño · Míticas+', ['Mortal Strike', 'Overpower', 'Bladestorm']),
  wowSeed('warrior', 'fury', 'warrior', 'Fury · Enrage', 'Daño · Míticas+', ['Bloodthirst', 'Rampage', 'Recklessness']),
  wowSeed('warrior', 'protection', 'warrior', 'Protection · bloqueo activo', 'Tanque · Míticas+', ['Shield Block', 'Ignore Pain', 'Shield Wall']),
]

const icyD4 = 'https://www.icy-veins.com/d4/guides/tier-lists/'
const d4Seed = (classId: string, id: string, name: string, activity: string, skills: readonly string[], gear: readonly string[], popularity: BuildPopularity = 'meta'): PopularBuild => makeBuild('diablo', {
  id,
  classId,
  name,
  activityEs: activity,
  activityEn: activity,
  popularity,
  focusEs: `${name} aparece entre las rutas destacadas de Season 14. Usá la variante de leveleo antes de exigir los únicos o afijos de endgame.`,
  focusEn: `${name} appears among the highlighted Season 14 routes. Use the leveling variant before requiring endgame uniques or affixes.`,
  skills,
  gear,
  sourceLabel: 'Icy Veins · Tier Lists Season 14',
  sourceHref: icyD4,
})

const d4Builds: readonly PopularBuild[] = [
  d4Seed('barbarian', 'barbarian-whirlwind', 'Whirlwind', 'Endgame / speed / boss', ['Whirlwind', 'Rallying Cry', 'Wrath of the Berserker'], ['Arma con DPS alto', 'Aspectos que sostienen Whirlwind y Furia', 'Crítico, velocidad y reducción de daño']),
  d4Seed('barbarian', 'barbarian-hota', 'Hammer of the Ancients', 'Leveleo / endgame', ['Hammer of the Ancients', 'War Cry', 'Leap'], ['Martillo de dos manos', 'Generación máxima de Furia', 'Overpower/crit según variante']),
  d4Seed('druid', 'druid-lightning-storm', 'Lightning Storm', 'Endgame / speed / boss', ['Lightning Storm', 'Blood Howl', 'Cataclysm'], ['Poderes de tormenta', 'Recurso espiritual estable', 'Crítico y daño a enemigos vulnerables']),
  d4Seed('druid', 'druid-shred', 'Shred', 'Endgame / speed / boss', ['Shred', 'Debilitating Roar', 'Grizzly Rage'], ['Arma rápida', 'Sinergias de Werewolf', 'Velocidad, crítico y fortificación']),
  d4Seed('necromancer', 'necromancer-naz-mages', 'Naz Mages', 'Endgame / speed / boss', ['Raise Skeleton', 'Corpse Tendrils', 'Army of the Dead'], ['Bonos de magos esqueléticos', 'Vida/daño de esbirros', 'Generación de cadáveres y reducción de cooldown']),
  d4Seed('necromancer', 'necromancer-reaper', 'Reaper Summoner', 'Endgame / boss', ['Raise Skeleton', 'Golem', 'Army of the Dead'], ['Bonos de Reapers', 'Daño de esbirros', 'Armadura, resistencias y control']),
  d4Seed('rogue', 'rogue-rapid-fire', 'Rapid Fire', 'Endgame / speed / boss', ['Heartseeker', 'Rapid Fire', 'Cold Imbuement'], ['Arco/ballesta con DPS alto', 'Bonos de Rapid Fire', 'Crítico, vulnerable y energía']),
  d4Seed('rogue', 'rogue-dance-knives', 'Dance of Knives', 'Leveleo / speed', ['Dance of Knives', 'Dark Shroud', 'Shadow Clone'], ['Bonos de Dance of Knives', 'Velocidad de movimiento', 'Reducción de daño y recurso']),
  d4Seed('sorcerer', 'sorcerer-crackling', 'Crackling Energy', 'Endgame / speed / boss', ['Spark', 'Teleport', 'Unstable Currents'], ['Bonos de Crackling Energy', 'Reducción de cooldown', 'Crítico, barrera y resource sustain']),
  d4Seed('sorcerer', 'sorcerer-charged-bolts', 'Charged Bolts', 'Leveleo / endgame', ['Charged Bolts', 'Teleport', 'Unstable Currents'], ['Bonos de Charged Bolts', 'Mana por segundo', 'Crítico y daño de rayos']),
  d4Seed('spiritborn', 'spiritborn-soar-swarm', 'Soar Swarm', 'Endgame / speed / boss', ['Soar', 'Scourge', 'The Hunter'], ['Sinergias de guardianes', 'Daño de enjambre', 'Movilidad y reducción de cooldown']),
  d4Seed('spiritborn', 'spiritborn-withering-fist', 'Withering Fist', 'Endgame / boss', ['Withering Fist', 'Ravager', 'Armored Hide'], ['Arma/guantes para skill principal', 'Ferocity y recurso', 'Crítico y supervivencia']),
  d4Seed('paladin', 'paladin-blessed-shield', 'Blessed Shield', 'Endgame / speed / boss', ['Blessed Shield', 'Aura', 'Defensive Oath'], ['Escudo con bloqueo y daño', 'Poderes de rebote', 'Reducción de cooldown y recurso']),
  d4Seed('paladin', 'paladin-arbiter', 'Arbiter Disciple', 'Endgame / boss', ['Arbiter', 'Judgement', 'Holy Aura'], ['Arma sagrada adecuada', 'Bonos de Arbiter/Judgement', 'Crítico, resource sustain y defensa']),
  d4Seed('warlock', 'warlock-saws', 'Tortured Saws Demons', 'Endgame / boss', ['Tortured Saws', 'Demon Summon', 'Forbidden Pact'], ['Bonos de sierras y demonios', 'Reducción de cooldown', 'Daño sostenido y mitigación']),
  d4Seed('warlock', 'warlock-infinistep', 'Infinistep Blazing Abyss', 'Endgame / speed / boss', ['Infinistep', 'Blazing Abyss', 'Hellfire'], ['Movilidad/cooldown para Infinistep', 'Daño de fuego y abismo', 'Barreras y recurso']),
]

const balance = (role: string, slug: string) => `https://www.thebalanceffxiv.com/jobs/${role}/${slug}/`
const ffxivSeed = (classId: string, name: string, roleEs: string, rolePath: string, slug: string, skills: readonly string[]): PopularBuild => makeBuild('ffxiv', {
  id: `${classId}-standard-75`,
  classId,
  name: `${name} · rotación 7.5`,
  activityEs: `${roleEs} · raids / dungeons`,
  activityEn: `${roleEs} · raids / dungeons`,
  popularity: 'standard',
  focusEs: `Ruta estándar de nivel 100 para ${name}. FFXIV no usa árboles de talentos tradicionales: la guía prioriza opener, loop, mitigación y equipo por velocidad.`,
  focusEn: `Standard level-100 route for ${name}. FFXIV has no traditional talent trees: this guide focuses on opener, loop, mitigation and speed-specific gear.`,
  skills,
  sourceLabel: 'The Balance · Job Guide',
  sourceHref: balance(rolePath, slug),
})

const ffxivBuilds: readonly PopularBuild[] = [
  ffxivSeed('paladin', 'Paladin', 'Tank', 'tanks', 'paladin', ['Fight or Flight', 'Confiteor', 'Holy Sheltron']),
  ffxivSeed('warrior', 'Warrior', 'Tank', 'tanks', 'warrior', ['Inner Release', 'Fell Cleave', 'Bloodwhetting']),
  ffxivSeed('dark-knight', 'Dark Knight', 'Tank', 'tanks', 'dark-knight', ['The Blackest Night', 'Delirium', 'Living Shadow']),
  ffxivSeed('gunbreaker', 'Gunbreaker', 'Tank', 'tanks', 'gunbreaker', ['No Mercy', 'Gnashing Fang', 'Heart of Corundum']),
  ffxivSeed('white-mage', 'White Mage', 'Healer', 'healers', 'white-mage', ['Glare', 'Afflatus Misery', 'Temperance']),
  ffxivSeed('scholar', 'Scholar', 'Healer', 'healers', 'scholar', ['Biolysis', 'Chain Stratagem', 'Sacred Soil']),
  ffxivSeed('astrologian', 'Astrologian', 'Healer', 'healers', 'astrologian', ['Divination', 'Earthly Star', 'Macrocosmos']),
  ffxivSeed('sage', 'Sage', 'Healer', 'healers', 'sage', ['Kardia', 'Phlegma', 'Kerachole']),
  ffxivSeed('monk', 'Monk', 'Melee DPS', 'melee', 'monk', ['Perfect Balance', 'Rising Phoenix', 'Phantom Rush']),
  ffxivSeed('dragoon', 'Dragoon', 'Melee DPS', 'melee', 'dragoon', ['Lance Charge', 'Geirskogul', 'Stardiver']),
  ffxivSeed('ninja', 'Ninja', 'Melee DPS', 'melee', 'ninja', ['Mudra', 'Kunai’s Bane', 'Ten Chi Jin']),
  ffxivSeed('samurai', 'Samurai', 'Melee DPS', 'melee', 'samurai', ['Meikyo Shisui', 'Midare Setsugekka', 'Ogi Namikiri']),
  ffxivSeed('reaper', 'Reaper', 'Melee DPS', 'melee', 'reaper', ['Gluttony', 'Enshroud', 'Communio']),
  ffxivSeed('viper', 'Viper', 'Melee DPS', 'melee', 'viper', ['Reawaken', 'Uncoiled Fury', 'Serpent’s Ire']),
  ffxivSeed('bard', 'Bard', 'Physical Ranged', 'ranged', 'bard', ['The Wanderer’s Minuet', 'Radiant Finale', 'Apex Arrow']),
  ffxivSeed('machinist', 'Machinist', 'Physical Ranged', 'ranged', 'machinist', ['Wildfire', 'Hypercharge', 'Automaton Queen']),
  ffxivSeed('dancer', 'Dancer', 'Physical Ranged', 'ranged', 'dancer', ['Standard Step', 'Technical Step', 'Devilment']),
  ffxivSeed('black-mage', 'Black Mage', 'Magical Ranged', 'casters', 'black-mage', ['Fire IV', 'Despair', 'Ley Lines']),
  ffxivSeed('summoner', 'Summoner', 'Magical Ranged', 'casters', 'summoner', ['Summon Bahamut', 'Astral Flow', 'Searing Light']),
  ffxivSeed('red-mage', 'Red Mage', 'Magical Ranged', 'casters', 'red-mage', ['Dualcast', 'Manafication', 'Vermilion Scourge']),
  ffxivSeed('pictomancer', 'Pictomancer', 'Magical Ranged', 'casters', 'pictomancer', ['Creature Motif', 'Starry Muse', 'Hammer Stamp']),
  makeBuild('ffxiv', { id: 'blue-mage-limited', classId: 'blue-mage', name: 'Blue Mage · Masked Carnivale', activityEs: 'Limited Job · desafíos', activityEn: 'Limited Job · challenges', popularity: 'standard', focusEs: 'Set flexible de hechizos para objetivos de Blue Mage; no corresponde al matchmaking normal.', focusEn: 'Flexible spell set for Blue Mage objectives; it is not a standard matchmaking job.', skills: ['Aetherial Mimicry', 'Mighty Guard', 'Diamondback'], sourceLabel: 'Square Enix · Blue Mage', sourceHref: 'https://na.finalfantasyxiv.com/jobguide/bluemage/' }),
]

const ninjaPoe = 'https://poe.ninja/poe2/builds'
const poeSeed = (classId: string, id: string, name: string, activity: string, skills: readonly string[], gear: readonly string[], href = ninjaPoe): PopularBuild => makeBuild('poe', {
  id,
  classId,
  name,
  activityEs: activity,
  activityEn: activity,
  popularity: 'most-used',
  focusEs: `${name} es una de las rutas visibles en el meta de Runes of Aldur. La versión económica y la de inversión alta deben tratarse como builds distintas.`,
  focusEn: `${name} is one of the visible Runes of Aldur meta routes. Treat the budget and high-investment variants as different builds.`,
  skills,
  gear,
  sourceLabel: href === ninjaPoe ? 'poe.ninja · ladder PoE 2' : 'Mobalytics · build verificada 0.5',
  sourceHref: href,
})

const poeBuilds: readonly PopularBuild[] = [
  poeSeed('martial-artist', 'martial-artist-whirling', 'Whirling Assault / Hollow Form', 'Endgame · clear / boss', ['Whirling Assault', 'Falling Thunder', 'Hollow Form'], ['Bastón/guantes con DPS físico', 'Velocidad de ataque y crítico', 'Capas defensivas antes de Hollow Form'], 'https://mobalytics.gg/poe-2/builds/martial-artist-league-starter-build'),
  poeSeed('gemling-legionnaire', 'gemling-quality-stack', 'Gemling · quality stack', 'Endgame · inversión alta', ['Skill principal de calidad', 'Supports alternativas', 'Buffs de Gemling'], ['Gemas con calidad/alternativa', 'Equipo para atributos', 'No comenzar esta variante sin presupuesto']),
  poeSeed('spirit-walker', 'spirit-walker-twister', 'Twister Spirit Walker', 'Starter → endgame', ['Twister', 'Spearfield', 'Wind setup'], ['Arma de lanza adecuada', 'Duración y crítico', 'Recuperación y evasión'], 'https://mobalytics.gg/poe-2/builds/twister-spirit-walker-snoobae'),
  poeSeed('deadeye', 'deadeye-ice-shot', 'Ice Shot / Snipe', 'Starter · mapas', ['Lightning Arrow', 'Ice Shot', 'Snipe'], ['Arco con DPS elemental', 'Proyectiles y frío', 'Vida, evasión y resistencias'], 'https://mobalytics.gg/poe-2/builds/ice-shot-deadeye-leveling-guide'),
  poeSeed('stormweaver', 'stormweaver-lightning', 'Stormweaver · Lightning', 'Starter → endgame', ['Spark', 'Ball Lightning', 'Arcane Tempo'], ['Niveles de gemas de rayo', 'Mana/ES estable', 'Crítico sólo después de resistencias']),
  poeSeed('oracle', 'oracle-plants', 'Plant / Totem Oracle', 'Starter · endgame', ['Plant skill', 'Totem setup', 'Nature buffs'], ['Niveles de gemas', 'Spirit y duración', 'Raros defensivos antes de únicos'], 'https://mobalytics.gg/poe-2/builds/plant-druid-oracle-endgame-guide'),
  poeSeed('infernalist', 'infernalist-demon', 'Demon Form / CoC Comet', 'Endgame', ['Demon Form', 'Cast on Critical', 'Comet'], ['Niveles de hechizos', 'Sustain de vida/ES', 'Crítico y cooldown sólo con base estable']),
  poeSeed('blood-mage', 'blood-mage-ballcano', 'Ball Lightning + Volcano', 'Endgame all-rounder', ['Ball Lightning', 'Volcano', 'Ignite setup'], ['Sire of Shards para la variante 360°', 'Niveles de hechizo y fuego', 'Vida/recuperación de Blood Mage'], 'https://mobalytics.gg/poe-2/builds/ballcano-bloodmage-endgame-annihilator'),
  poeSeed('tactician', 'tactician-galvanic', 'Galvanic / Stormblast Tactician', 'Starter · clear', ['Galvanic Shards', 'Stormblast Bolts', 'Pin setup'], ['Ballesta con DPS alto', 'Daño de rayos/proyectiles', 'Control y reducción de cooldown']),
  poeSeed('titan', 'titan-whirling', 'Whirling Assault Titan', 'Starter · melee resistente', ['Whirling Assault', 'Warcry', 'Heavy Stun'], ['Arma física con DPS alto', 'Armadura y vida', 'Velocidad suficiente para el loop']),
  poeSeed('shaman', 'shaman-bear', 'Bear / Calamity Shaman', 'Starter · endgame', ['Bear Form', 'Calamity', 'Herald setup'], ['Arma física/fuego', 'Runas de la liga coherentes', 'Armadura, vida y resistencias']),
  poeSeed('witchhunter', 'witchhunter-grenades', 'Grenade Witchhunter', 'Starter · mapas', ['Explosive Grenade', 'Gas Grenade', 'Detonator'], ['Ballesta con DPS alto', 'Daño de granadas/AoE', 'Velocidad de recarga y defensas']),
]

export const popularBuilds: readonly PopularBuild[] = [...wowBuilds, ...d4Builds, ...ffxivBuilds, ...poeBuilds]

export function getPopularBuilds(gameId: PopularBuildGameId, classId?: string) {
  return popularBuilds.filter((build) => build.gameId === gameId && (!classId || build.classId === classId))
}

export function getPopularBuild(gameId: PopularBuildGameId, classId: string, buildId: string | null | undefined) {
  const builds = getPopularBuilds(gameId, classId)
  return builds.find((build) => build.id === buildId) ?? builds[0]
}
