export type GreenDossierCategory = 'hacktivism' | 'law-enforcement' | 'declassified' | 'mystery'
export type GreenEvidenceLevel = 'documented' | 'disputed' | 'unverified'

type LocalText = Record<'es' | 'en', string>

export type GreenDossier = {
  id: string
  code: string
  period: string
  category: GreenDossierCategory
  evidence: GreenEvidenceLevel
  clearance: 1 | 2 | 3
  title: LocalText
  summary: LocalText
  confirmed: LocalText
  unresolved: LocalText
  sourceLabel: string
  sourceHref: string
}

export const greenNodeDossiers: readonly GreenDossier[] = [
  {
    id: 'anonymous-payback', code: 'ANON-2010', period: '2010–2011', category: 'hacktivism', evidence: 'documented', clearance: 1,
    title: { es: 'Anonymous: Operation Avenge Assange', en: 'Anonymous: Operation Avenge Assange' },
    summary: { es: 'Tras el bloqueo de donaciones a WikiLeaks, una acción reivindicada por Anonymous coordinó ataques DDoS contra PayPal. En julio de 2011 el FBI anunció 14 detenciones vinculadas con ese ataque.', en: 'After WikiLeaks donations were blocked, an action claimed by Anonymous coordinated DDoS attacks against PayPal. In July 2011 the FBI announced 14 arrests connected to that attack.' },
    confirmed: { es: 'La acusación, las detenciones y el método DDoS están documentados por el FBI y el Departamento de Justicia.', en: 'The indictment, arrests and DDoS method are documented by the FBI and Department of Justice.' },
    unresolved: { es: 'Anonymous no era una organización centralizada: una reivindicación colectiva no identifica por sí sola a cada participante.', en: 'Anonymous was not a centralized organization: a collective claim alone does not identify every participant.' },
    sourceLabel: 'FBI / U.S. Department of Justice',
    sourceHref: 'https://www.fbi.gov/news/pressrel/press-releases/sixteen-individuals-arrested-in-the-united-states-for-alleged-roles-in-cyber-attacks',
  },
  {
    id: 'antisec-stratfor', code: 'ANTISEC-2011', period: '2011–2013', category: 'hacktivism', evidence: 'documented', clearance: 1,
    title: { es: 'AntiSec y la intrusión a Stratfor', en: 'AntiSec and the Stratfor intrusion' },
    summary: { es: 'Jeremy Hammond admitió su participación en la intrusión de 2011 contra Stratfor y en accesos a otros sitios públicos y privados. Fue condenado a diez años de prisión en 2013.', en: 'Jeremy Hammond admitted his role in the 2011 Stratfor intrusion and access to other public and private websites. He was sentenced to ten years in prison in 2013.' },
    confirmed: { es: 'La declaración de culpabilidad, la sentencia y el alcance atribuido al caso constan en el expediente judicial divulgado por el DOJ.', en: 'The guilty plea, sentence and attributed scope are documented in the court record released by the DOJ.' },
    unresolved: { es: 'El impacto político de la publicación posterior de datos es materia de interpretación; el acceso no autorizado y las víctimas no lo son.', en: 'The political impact of later data publication is open to interpretation; the unauthorized access and victims are not.' },
    sourceLabel: 'U.S. Attorney · Southern District of New York',
    sourceHref: 'https://www.justice.gov/usao-sdny/pr/jeremy-hammond-sentenced-10-years-prison-hacking-stratfor-website-and-other-company',
  },
  {
    id: 'sabu-operation', code: 'SABU-2011', period: '2011–2014', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Sabu: de LulzSec a colaborador del FBI', en: 'Sabu: from LulzSec to FBI cooperator' },
    summary: { es: 'Hector Monsegur, “Sabu”, se declaró culpable y colaboró con las autoridades. El caso conectó investigaciones contra LulzSec, AntiSec y actores alineados con Anonymous.', en: 'Hector Monsegur, “Sabu”, pleaded guilty and cooperated with authorities. The case connected investigations into LulzSec, AntiSec and Anonymous-aligned actors.' },
    confirmed: { es: 'La cooperación, los cargos y la sentencia fueron informados oficialmente por fiscales federales.', en: 'The cooperation, charges and sentence were officially reported by federal prosecutors.' },
    unresolved: { es: 'Los relatos online sobre qué operaciones fueron inducidas o evitadas deben contrastarse con expedientes; no todo hilo viral es evidencia.', en: 'Online claims about which operations were induced or prevented must be checked against records; not every viral thread is evidence.' },
    sourceLabel: 'U.S. Attorney · Southern District of New York',
    sourceHref: 'https://www.justice.gov/usao-sdny/pr/leading-member-international-cybercriminal-group-lulzsec-sentenced-manhattan-federal',
  },
  {
    id: 'lulzsec-charges', code: 'LULZ-2012', period: '2011–2012', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Seis acusados: Anonymous, LulzSec y AntiSec', en: 'Six charged: Anonymous, LulzSec and AntiSec' },
    summary: { es: 'En marzo de 2012 fiscales de Manhattan anunciaron cargos por intrusiones que afectaron a Sony Pictures, PBS, Fox y otros objetivos. El comunicado describe a Anonymous como una confederación flexible, no una jerarquía única.', en: 'In March 2012 Manhattan prosecutors announced charges over intrusions affecting Sony Pictures, PBS, Fox and other targets. The release describes Anonymous as a loose confederation, not a single hierarchy.' },
    confirmed: { es: 'Identidades judiciales, cargos y objetivos figuran en el comunicado archivado del Departamento de Justicia.', en: 'Judicial identities, charges and targets appear in the archived Department of Justice release.' },
    unresolved: { es: 'Alinearse con una etiqueta no prueba que todas las personas compartieran mando, objetivos o responsabilidad por cada operación.', en: 'Sharing a label does not prove every person shared command, goals or responsibility for every operation.' },
    sourceLabel: 'U.S. Department of Justice · Archive',
    sourceHref: 'https://www.justice.gov/archive/usao/nys/pressreleases/March12/ackroyd.html',
  },
  {
    id: 'mkultra', code: 'MKULTRA-1953', period: '1953–1964', category: 'declassified', evidence: 'documented', clearance: 2,
    title: { es: 'MKULTRA: el programa fue real', en: 'MKULTRA: the program was real' },
    summary: { es: 'MKULTRA fue un programa secreto de la CIA que financió investigaciones con drogas y modificación de conducta. Una audiencia del Senado de 1977 examinó documentos recuperados y el alcance de sus subproyectos.', en: 'MKULTRA was a secret CIA program that funded research involving drugs and behavioral modification. A 1977 Senate hearing examined recovered records and the scope of its subprojects.' },
    confirmed: { es: 'La existencia del programa y parte de sus prácticas están documentadas en audiencias oficiales y archivos desclasificados.', en: 'The program and some of its practices are documented in official hearings and declassified records.' },
    unresolved: { es: 'La destrucción de numerosos registros impide reconstruir todo el alcance. Eso no valida afirmaciones modernas sin fuente.', en: 'The destruction of many records prevents a complete reconstruction. That does not validate modern unsourced claims.' },
    sourceLabel: 'U.S. Senate Select Committee on Intelligence',
    sourceHref: 'https://www.intelligence.senate.gov/1977/08/03/hearings-joint-hearing-subcommittee-health-and-scientific-research-committee-human-resources-project/',
  },
  {
    id: 'stargate', code: 'STARGATE-1978', period: '1970s–1995', category: 'declassified', evidence: 'disputed', clearance: 3,
    title: { es: 'Project Stargate y la “visión remota”', en: 'Project Stargate and “remote viewing”' },
    summary: { es: 'Agencias de inteligencia estadounidenses financiaron durante años investigaciones sobre supuesta percepción anómala y visión remota. El programa existió; la utilidad operativa de sus resultados no quedó demostrada de forma confiable.', en: 'U.S. intelligence agencies funded research into alleged anomalous perception and remote viewing for years. The program existed; reliable operational usefulness was not demonstrated.' },
    confirmed: { es: 'La colección desclasificada de la CIA confirma el programa, sus evaluaciones y parte de los experimentos.', en: 'The CIA declassified collection confirms the program, its assessments and part of the experiments.' },
    unresolved: { es: 'Programa real no equivale a fenómeno probado. La evidencia sobre eficacia sigue siendo discutida y no permite afirmar poderes paranormales.', en: 'A real program does not equal a proven phenomenon. Evidence of effectiveness remains disputed and does not establish paranormal powers.' },
    sourceLabel: 'CIA FOIA Reading Room · STARGATE',
    sourceHref: 'https://www.cia.gov/readingroom/collection/stargate',
  },
  {
    id: 'northwoods', code: 'NORTHWOODS-1962', period: '1962', category: 'declassified', evidence: 'documented', clearance: 3,
    title: { es: 'Operation Northwoods: propuesta, no operación ejecutada', en: 'Operation Northwoods: proposal, not an executed operation' },
    summary: { es: 'Documentos del Estado Mayor Conjunto propusieron pretextos para justificar una intervención militar en Cuba. El archivo confirma que la propuesta existió; no que se haya ejecutado.', en: 'Joint Chiefs of Staff papers proposed pretexts to justify military intervention in Cuba. The record confirms that the proposal existed, not that it was carried out.' },
    confirmed: { es: 'El documento desclasificado está disponible en los Archivos Nacionales de Estados Unidos.', en: 'The declassified document is available through the U.S. National Archives.' },
    unresolved: { es: 'Presentar el plan rechazado como una operación consumada altera el hecho histórico y alimenta conclusiones falsas.', en: 'Presenting the rejected plan as a completed operation changes the historical record and fuels false conclusions.' },
    sourceLabel: 'U.S. National Archives · JFK Records',
    sourceHref: 'https://www.archives.gov/files/research/jfk/releases/2018/202-10002-10104.pdf',
  },
  {
    id: 'jfk-hsca', code: 'JFK-HSCA-1979', period: '1963–1979', category: 'mystery', evidence: 'disputed', clearance: 3,
    title: { es: 'JFK: la conclusión disputada del HSCA', en: 'JFK: the disputed HSCA conclusion' },
    summary: { es: 'El comité de la Cámara concluyó que Kennedy “probablemente” fue asesinado como resultado de una conspiración, pero no pudo identificar al otro tirador ni el alcance. También descartó participación institucional de varias organizaciones investigadas.', en: 'The House committee concluded Kennedy was “probably” assassinated as the result of a conspiracy, but could not identify another gunman or its scope. It also rejected institutional involvement by several investigated organizations.' },
    confirmed: { es: 'La conclusión y sus límites figuran en el informe oficial conservado por los Archivos Nacionales.', en: 'The conclusion and its limits appear in the official report preserved by the National Archives.' },
    unresolved: { es: 'La base acústica y la inferencia de un segundo tirador fueron cuestionadas después. El caso no autoriza a elegir cualquier teoría como cierta.', en: 'The acoustic basis and second-gunman inference were later challenged. The case does not make every theory true.' },
    sourceLabel: 'U.S. National Archives · HSCA Findings',
    sourceHref: 'https://www.archives.gov/research/jfk/select-committee-report/part-1c.html',
  },
  {
    id: 'mirai-botnet', code: 'MIRAI-2016', period: '2016–2018', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Mirai: el ejército de dispositivos inseguros', en: 'Mirai: the army of insecure devices' },
    summary: { es: 'Mirai convirtió dispositivos conectados con credenciales débiles en una botnet capaz de lanzar ataques DDoS masivos. Tres responsables se declararon culpables y luego colaboraron con investigaciones del FBI.', en: 'Mirai turned connected devices with weak credentials into a botnet capable of massive DDoS attacks. Three operators pleaded guilty and later cooperated with FBI investigations.' },
    confirmed: { es: 'Las declaraciones de culpabilidad, el funcionamiento de la botnet y la investigación federal están documentados por el Departamento de Justicia.', en: 'The guilty pleas, botnet operation and federal investigation are documented by the Department of Justice.' },
    unresolved: { es: 'El código liberado permitió imitaciones posteriores; atribuir cualquier ataque basado en Mirai a sus autores originales sería incorrecto.', en: 'The released code enabled later copycats; attributing every Mirai-based attack to its original authors would be incorrect.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/usao-nj/pr/justice-department-announces-charges-and-guilty-pleas-three-computer-crime-cases',
  },
  {
    id: 'alphabay-bayonet', code: 'BAYONET-2017', period: '2014–2017', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Operation Bayonet: caída de AlphaBay', en: 'Operation Bayonet: AlphaBay takedown' },
    summary: { es: 'Una operación internacional desmanteló AlphaBay, entonces uno de los mayores mercados criminales de la dark web, y coordinó la incautación de su infraestructura.', en: 'An international operation dismantled AlphaBay, then one of the largest criminal dark-web markets, and coordinated the seizure of its infrastructure.' },
    confirmed: { es: 'La incautación, el arresto del administrador y la cooperación internacional fueron anunciados por el FBI y el Departamento de Justicia.', en: 'The seizure, administrator arrest and international cooperation were announced by the FBI and Department of Justice.' },
    unresolved: { es: 'La caída de un mercado no eliminó la economía criminal de la dark web; usuarios y vendedores migraron a otros servicios.', en: 'Taking down one market did not eliminate the criminal dark-web economy; users and vendors moved to other services.' },
    sourceLabel: 'FBI / U.S. Department of Justice',
    sourceHref: 'https://www.fbi.gov/news/stories/alphabay-takedown',
  },
  {
    id: 'darkside-colonial', code: 'DARKSIDE-2021', period: '2021', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'DarkSide y Colonial Pipeline', en: 'DarkSide and Colonial Pipeline' },
    summary: { es: 'El ransomware atribuido a DarkSide interrumpió Colonial Pipeline. El Departamento de Justicia informó la recuperación de 63,7 bitcoins vinculados con el pago del rescate.', en: 'Ransomware attributed to DarkSide disrupted Colonial Pipeline. The Department of Justice reported recovering 63.7 bitcoins tied to the ransom payment.' },
    confirmed: { es: 'La interrupción, el pago y la orden judicial de incautación están documentados en el comunicado oficial.', en: 'The disruption, payment and judicial seizure warrant are documented in the official release.' },
    unresolved: { es: 'Recuperar parte del pago no equivale a identificar o detener a todos los integrantes y afiliados de la red.', en: 'Recovering part of the payment does not mean every member and affiliate of the network was identified or arrested.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/archives/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside',
  },
  {
    id: 'silk-road', code: 'SILKROAD-2013', period: '2011–2015', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Silk Road: anonimato, Tor y Bitcoin', en: 'Silk Road: anonymity, Tor and Bitcoin' },
    summary: { es: 'Silk Road operó como mercado clandestino sobre Tor y utilizó Bitcoin para dificultar la identificación de sus usuarios. Su creador fue declarado culpable en 2015.', en: 'Silk Road operated as a clandestine market over Tor and used Bitcoin to make identifying users harder. Its creator was found guilty in 2015.' },
    confirmed: { es: 'La operación del sitio, su cierre y el veredicto están documentados por el tribunal y el Departamento de Justicia.', en: 'The site operation, shutdown and verdict are documented by the court and Department of Justice.' },
    unresolved: { es: 'Tor y las criptomonedas no son delitos por sí mismos; el caso juzgó la actividad criminal del mercado, no esas tecnologías en general.', en: 'Tor and cryptocurrencies are not crimes by themselves; the case concerned the market criminal activity, not those technologies in general.' },
    sourceLabel: 'U.S. Attorney · Southern District of New York',
    sourceHref: 'https://www.justice.gov/usao-sdny/pr/ross-ulbricht-creator-and-owner-silk-road-website-found-guilty-manhattan-federal-court',
  },
  {
    id: 'cointelpro', code: 'COINTELPRO-1956', period: '1956–1971', category: 'declassified', evidence: 'documented', clearance: 3,
    title: { es: 'COINTELPRO: vigilancia e infiltración', en: 'COINTELPRO: surveillance and infiltration' },
    summary: { es: 'El FBI mantuvo programas de contrainteligencia destinados a vigilar, infiltrar y perturbar organizaciones consideradas subversivas. Sus propios archivos históricos reconocen el programa.', en: 'The FBI ran counterintelligence programs intended to surveil, infiltrate and disrupt organizations it considered subversive. Its own historical files acknowledge the program.' },
    confirmed: { es: 'La existencia, fechas y archivos del programa están disponibles en el FBI Vault y en registros de los National Archives.', en: 'The program existence, dates and files are available through the FBI Vault and National Archives records.' },
    unresolved: { es: 'Un archivo documentado no valida automáticamente todas las acusaciones modernas de vigilancia ni demuestra continuidad operativa.', en: 'A documented archive does not automatically validate every modern surveillance claim or prove operational continuity.' },
    sourceLabel: 'FBI Vault',
    sourceHref: 'https://vault.fbi.gov/cointel-pro',
  },
  {
    id: 'project-blue-book', code: 'BLUEBOOK-1952', period: '1952–1969', category: 'mystery', evidence: 'disputed', clearance: 3,
    title: { es: 'Project Blue Book: 12.618 reportes', en: 'Project Blue Book: 12,618 reports' },
    summary: { es: 'La Fuerza Aérea de Estados Unidos investigó reportes de objetos voladores no identificados. Los National Archives conservan los expedientes desclasificados; 701 casos quedaron catalogados como no identificados.', en: 'The U.S. Air Force investigated reports of unidentified flying objects. The National Archives preserve the declassified files; 701 cases remained categorized as unidentified.' },
    confirmed: { es: 'El programa, su cierre y la colección documental son hechos públicos preservados por los National Archives.', en: 'The program, its closure and documentary collection are public facts preserved by the National Archives.' },
    unresolved: { es: '“No identificado” significa que el expediente no alcanzó una explicación concluyente; no constituye por sí mismo evidencia extraterrestre.', en: '“Unidentified” means the case did not reach a conclusive explanation; it is not by itself evidence of extraterrestrial origin.' },
    sourceLabel: 'U.S. National Archives',
    sourceHref: 'https://www.archives.gov/research/military/air-force/ufos',
  },
  {
    id: 'wannacry-lazarus', code: 'WANNACRY-2017', period: '2017–2021', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'WannaCry: ransomware con atribución estatal', en: 'WannaCry: ransomware with state attribution' },
    summary: { es: 'WannaCry se propagó globalmente explotando equipos Windows vulnerables. Fiscales estadounidenses acusaron a operadores norcoreanos y vincularon la campaña con Lazarus y otros ataques financieros.', en: 'WannaCry spread globally by exploiting vulnerable Windows systems. U.S. prosecutors charged North Korean operators and linked the campaign to Lazarus and other financial attacks.' },
    confirmed: { es: 'El malware, sus daños y la atribución formal constan en acusaciones y comunicados del Departamento de Justicia.', en: 'The malware, its damage and formal attribution appear in Department of Justice charges and releases.' },
    unresolved: { es: 'Una acusación estatal documenta la teoría del caso; no permite atribuir cada infección individual sin análisis forense.', en: 'A state indictment documents the case theory; it does not attribute every individual infection without forensic analysis.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/archives/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and',
  },
  {
    id: 'notpetya-gru', code: 'NOTPETYA-2017', period: '2015–2020', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'NotPetya: sabotaje disfrazado de ransomware', en: 'NotPetya: sabotage disguised as ransomware' },
    summary: { es: 'NotPetya destruyó sistemas en Ucrania y se extendió a empresas globales. El DOJ acusó a seis oficiales del GRU por campañas que también incluyeron Industroyer y Olympic Destroyer.', en: 'NotPetya destroyed systems in Ukraine and spread to global companies. The DOJ charged six GRU officers over campaigns that also included Industroyer and Olympic Destroyer.' },
    confirmed: { es: 'La acusación identifica personas, infraestructura, malware y víctimas concretas; los daños de tres víctimas superaron los mil millones de dólares.', en: 'The indictment identifies people, infrastructure, malware and specific victims; losses to three named victims exceeded one billion dollars.' },
    unresolved: { es: 'La atribución cibernética combina evidencia técnica e inteligencia; los detalles no publicados no deben rellenarse con especulación.', en: 'Cyber attribution combines technical evidence and intelligence; unpublished details should not be filled with speculation.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/archives/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and',
  },
  {
    id: 'vault7-schulte', code: 'VAULT7-2017', period: '2016–2024', category: 'law-enforcement', evidence: 'documented', clearance: 3,
    title: { es: 'Vault 7: la mayor filtración de la CIA', en: 'Vault 7: the CIA’s largest data breach' },
    summary: { es: 'Joshua Schulte fue condenado por sustraer herramientas de ciberinteligencia de la CIA y transmitirlas a WikiLeaks. La sentencia describió el caso como la mayor brecha de datos de la agencia.', en: 'Joshua Schulte was convicted of stealing CIA cyber-intelligence tools and transmitting them to WikiLeaks. The sentence described it as the agency’s largest data breach.' },
    confirmed: { es: 'Condenas, evidencia del juicio y sentencia están documentadas por el tribunal y fiscales federales.', en: 'Convictions, trial evidence and sentencing are documented by the court and federal prosecutors.' },
    unresolved: { es: 'La publicación revela capacidades de una época concreta; no prueba que cada herramienta siga activa ni que toda intrusión posterior use ese arsenal.', en: 'The release exposes capabilities from a specific period; it does not prove every tool remains active or that every later intrusion uses that arsenal.' },
    sourceLabel: 'U.S. Attorney · Southern District of New York',
    sourceHref: 'https://www.justice.gov/usao-sdny/pr/former-cia-officer-joshua-adam-schulte-sentenced-40-years-prison-espionage-and-child',
  },
  {
    id: 'hive-infiltration', code: 'HIVE-2023', period: '2022–2023', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Hive: el FBI dentro de la red de ransomware', en: 'Hive: the FBI inside a ransomware network' },
    summary: { es: 'Durante meses el FBI penetró la infraestructura de Hive, obtuvo claves de descifrado y las entregó a víctimas sin revelar inmediatamente el acceso.', en: 'For months the FBI penetrated Hive infrastructure, obtained decryption keys and delivered them to victims without immediately revealing the access.' },
    confirmed: { es: 'El DOJ informó más de 1.500 víctimas en 80 países y 130 millones de dólares en rescates evitados.', en: 'The DOJ reported more than 1,500 victims in 80 countries and $130 million in ransom demands prevented.' },
    unresolved: { es: 'Una infiltración exitosa no elimina afiliados, copias de datos ni variantes futuras; el impacto debe medirse a largo plazo.', en: 'A successful infiltration does not erase affiliates, copied data or future variants; impact must be measured over time.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/archives/opa/pr/us-department-justice-disrupts-hive-ransomware-variant',
  },
  {
    id: 'lockbit-cronos', code: 'CRONOS-2024', period: '2019–2024', category: 'law-enforcement', evidence: 'documented', clearance: 2,
    title: { es: 'Operation Cronos: golpe internacional a LockBit', en: 'Operation Cronos: international action against LockBit' },
    summary: { es: 'Estados Unidos, Reino Unido y otros socios incautaron infraestructura de LockBit, publicaron información interna y desarrollaron capacidades de descifrado para víctimas.', en: 'The United States, United Kingdom and other partners seized LockBit infrastructure, released internal information and developed decryption capabilities for victims.' },
    confirmed: { es: 'El operativo, acusaciones y más de 2.000 víctimas atribuidas fueron anunciados oficialmente.', en: 'The operation, charges and more than 2,000 attributed victims were officially announced.' },
    unresolved: { es: 'LockBit operaba como servicio con afiliados. Derribar servidores no identifica automáticamente a todos ni garantiza el final de la marca.', en: 'LockBit operated as a service with affiliates. Taking servers down does not automatically identify everyone or guarantee the brand is finished.' },
    sourceLabel: 'U.S. Department of Justice',
    sourceHref: 'https://www.justice.gov/archives/opa/pr/us-and-uk-disrupt-lockbit-ransomware-variant',
  },
  {
    id: 'prism-section702', code: 'PRISM-2008', period: '2008–2026', category: 'declassified', evidence: 'documented', clearance: 3,
    title: { es: 'PRISM y Section 702: qué está documentado', en: 'PRISM and Section 702: what is documented' },
    summary: { es: 'PRISM es un mecanismo de recolección bajo Section 702 para objetivos extranjeros ubicados fuera de Estados Unidos, con asistencia obligatoria de proveedores. Informes públicos examinan funcionamiento, valor y riesgos de privacidad.', en: 'PRISM is a Section 702 collection mechanism targeting non-U.S. persons abroad with compelled provider assistance. Public reports examine its operation, value and privacy risks.' },
    confirmed: { es: 'PCLOB y NSA publicaron informes que describen PRISM, supervisión, consultas y límites legales.', en: 'PCLOB and NSA published reports describing PRISM, oversight, queries and legal limits.' },
    unresolved: { es: 'El programa real no demuestra vigilancia total de cada usuario. También existen debates documentados sobre comunicaciones incidentales y consultas de datos.', en: 'A real program does not prove total surveillance of every user. Documented debates remain over incidental collection and data queries.' },
    sourceLabel: 'Privacy and Civil Liberties Oversight Board',
    sourceHref: 'https://documents.pclob.gov/prod/Documents/OversightReport/315fe19c-07f3-4cc6-986a-ff199ce5b616/Unclassified%20PCLOB%20702%20Report%202026.pdf',
  },
] as const
