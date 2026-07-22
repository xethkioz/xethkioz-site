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
] as const
