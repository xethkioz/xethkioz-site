-- Editorial depth pass 03: expand fifteen source-verified articles.
-- Idempotent data migration. It changes editorial copy only and preserves sources, authors and publication dates.

with editorial_updates(slug, summary, content, editor_notes) as (
  values
  (
    'gaming-poe-329-reliquarian-ascendancy',
    'La Reliquarian vuelve a cambiar con Curse of the Allflame. GGG confirma que esta ascendencia de la Scion fue concebida para mutar en cada liga; repasamos qué significa para una build y qué todavía debe validarse en el parche jugable.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Una ascendencia diseñada para cambiar'),
      jsonb_build_object('type','paragraph','text','Grinding Gear Games presentó a la Reliquarian en Path of Exile: Mirage como la segunda ascendencia disponible para la Scion. Su rasgo diferencial no es solamente una colección de pasivas: el estudio explica que la clase fue pensada para cambiar con cada liga. La publicación del 14 de julio muestra la versión correspondiente a Curse of the Allflame y funciona como referencia oficial previa al lanzamiento.'),
      jsonb_build_object('type','paragraph','text','Eso vuelve peligrosa una costumbre habitual de Path of Exile: abrir una build antigua y copiarla sin mirar la versión. Una ruta que funcionó en Mirage puede conservar el nombre y, al mismo tiempo, haber cambiado su lógica. Antes de gastar moneda o fijar objetos obligatorios conviene guardar la versión del árbol, revisar las imágenes oficiales del anuncio y compararlas con el texto final dentro del cliente.'),
      jsonb_build_object('type','heading','text','Cómo leer el cambio sin inventar números'),
      jsonb_build_object('type','paragraph','text','El anuncio confirma el regreso de la Reliquarian y su nueva configuración para Allflame. No alcanza para declarar una build ganadora, estimar su porcentaje de uso ni anticipar precios. Las capturas muestran nodos, pero el rendimiento real depende de interacciones con gemas, objetos, enemigos, economía y ajustes que pueden aparecer en notas posteriores.'),
      jsonb_build_object('type','paragraph','text','La preparación útil es modular. Separá el núcleo de la build de los lujos, anotá qué estadísticas son imprescindibles y conservá una ruta alternativa si una interacción no se comporta como esperabas. Path of Building, las notas de parche y una prueba temprana valen más que una captura viral sin versión.'),
      jsonb_build_object('type','heading','text','Lectura XETHKIOZ'),
      jsonb_build_object('type','paragraph','text','La Reliquarian se parece a un artefacto vivo del Nexus: conserva su identidad, pero reescribe el grimorio cada temporada. Esa idea es atractiva porque obliga a investigar de nuevo. También exige disciplina editorial: distinguir lo que GGG mostró de lo que la comunidad proyecta sobre esas imágenes.'),
      jsonb_build_object('type','quote','text','Primero registrá la versión. Después calculá. Recién entonces convertí una posibilidad en build.'),
      jsonb_build_object('type','paragraph','text','Para el estreno, la misión es sencilla: leer el anuncio oficial, esperar el conjunto completo de notas, simular sin comprometer todo el presupuesto y probar. Una ascendencia cambiante premia la curiosidad, pero castiga tratar un plan viejo como si fuera una ley eterna.')
    ),
    'Depth pass 03: ampliado desde el anuncio oficial de GGG. No se atribuyen nodos, cifras de uso ni resultados no visibles en la fuente.'
  ),
  (
    'gaming-poe-329-timeline',
    'GGG fijó el calendario operativo de Path of Exile 3.29: revelación el 16 de julio, cierre de Mirage el 20 y lanzamiento el 24. Esta guía breve traduce los horarios oficiales y separa fechas confirmadas de posibles cambios de servicio.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','El calendario confirmado'),
      jsonb_build_object('type','paragraph','text','Grinding Gear Games publicó el 8 de junio la hoja de ruta de Path of Exile 3.29. El anuncio fija GGG Live para el 16 de julio a la 1 PM PDT y el lanzamiento de la versión 3.29 para el 24 de julio a la 1 PM PDT. También informa que la liga Mirage termina el 20 de julio a las 3 PM PDT.'),
      jsonb_build_object('type','paragraph','text','La misma publicación adelanta un evento especial, aunque en ese momento no desarrolla sus reglas. Esa diferencia importa: las tres fechas y horas están escritas por el estudio; el formato, las recompensas y la duración del evento necesitaban una comunicación posterior. Un timeline es útil cuando conserva esas fronteras.'),
      jsonb_build_object('type','heading','text','Qué conviene preparar'),
      jsonb_build_object('type','paragraph','text','Si todavía tenés desafíos de Mirage pendientes, el cierre de liga es el límite real para completarlos. Si tu foco es Allflame, el directo del 16 es el punto para conocer el contenido y empezar a leer información oficial. Entre la revelación y el lanzamiento queda una ventana para actualizar filtros, limpiar espacio, revisar seguridad de cuenta y conversar objetivos con la party.'),
      jsonb_build_object('type','paragraph','text','Los horarios están expresados en PDT. Antes de organizar una noche de juego, convertí la hora con una fuente confiable y volvé a revisar el foro cerca del estreno. Mantenimiento, descarga, colas y ajustes de último momento no quedan garantizados por el anuncio inicial.'),
      jsonb_build_object('type','heading','text','Un mapa, no una profecía'),
      jsonb_build_object('type','paragraph','text','El calendario ordena la expectativa, pero no convierte cada minuto en una obligación. En un ARPG de temporada, llegar descansado, con autenticación de dos factores y una build flexible suele mejorar más la experiencia que perseguir una ventaja mínima en la cola.'),
      jsonb_build_object('type','quote','text','La hoja de ruta marca los portales. El estado del servidor decide cuándo se pueden cruzar.'),
      jsonb_build_object('type','paragraph','text','XETHKIOZ usará esta secuencia como eje del radar: anuncio, revelación, notas y versión jugable. Si alguno de esos puntos cambia, la fuente correcta sigue siendo el mismo canal oficial de GGG, no una captura recortada que perdió fecha y zona horaria.')
    ),
    'Depth pass 03: fechas y horas tomadas del timeline oficial de GGG; se explicitan zona horaria y límites operativos.'
  ),
  (
    'gaming-poe-allflame-they-rise-again',
    '“They Rise Again” es el teaser oficial que encendió Curse of the Allflame antes de su revelación. Analizamos qué comunica sobre tono e identidad y por qué un avance no debe confundirse con notas de parche o balance confirmado.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','La señal debajo de la superficie'),
      jsonb_build_object('type','paragraph','text','El 12 de julio, Grinding Gear Games publicó “They Rise Again”, una pieza breve para anticipar Path of Exile: Curse of the Allflame. El texto oficial invita a mirar el teaser y dirige a la comunidad hacia GGG Live del 16 de julio. Su función es abrir el clima narrativo de la expansión, no documentar todos sus sistemas.'),
      jsonb_build_object('type','paragraph','text','El título, la oscuridad y la idea de algo que vuelve a levantarse construyen una promesa de fantasía. Para una comunidad que vive entre jefes, cadáveres, fuego y ciclos de liga, el mensaje es deliberadamente reconocible. Genera preguntas antes de entregar respuestas.'),
      jsonb_build_object('type','heading','text','Lo que un teaser puede confirmar'),
      jsonb_build_object('type','paragraph','text','La pieza confirma el nombre Curse of the Allflame, la existencia de un avance oficial y el momento elegido para ampliar detalles. No confirma por sí sola números de daño, rareza de objetos, frecuencia de encuentros, economía, dificultad final ni viabilidad de una build. Esas respuestas pertenecen a la revelación, las notas y el cliente.'),
      jsonb_build_object('type','paragraph','text','Leer bien una campaña también forma parte de jugar bien. Un fotograma puede sugerir un enemigo o una mecánica, pero una sugerencia visual no reemplaza una descripción. Si una teoría de la comunidad resulta entretenida, conviene etiquetarla como teoría hasta que GGG publique evidencia adicional.'),
      jsonb_build_object('type','heading','text','Lectura XETHKIOZ'),
      jsonb_build_object('type','paragraph','text','Este teaser pertenece al lado más cinematográfico del Nexus. Funciona porque deja espacio para imaginar el portal antes de atravesarlo. La cobertura editorial puede conservar esa emoción sin transformar cada sombra en una promesa técnica.'),
      jsonb_build_object('type','quote','text','El teaser enciende la antorcha. Las notas de parche muestran el camino.'),
      jsonb_build_object('type','paragraph','text','La recomendación es disfrutar la señal y después ordenar la información: teaser para atmósfera, directo para presentación, foro para referencia y juego para validación. Así el hype suma identidad sin obligar a defender como hecho algo que el estudio todavía no explicó.')
    ),
    'Depth pass 03: análisis de comunicación basado en el teaser oficial. Se evita adjudicar mecánicas no descritas por GGG.'
  ),
  (
    'gaming-poe-curse-of-allflame-twitch-drops',
    'La campaña oficial de Curse of the Allflame entregó el efecto cosmético Abyssal Soul Shatter por 45 minutos de visualización. Repasamos requisitos, ventana, canje y los errores que podían dejar el Drop fuera de la cuenta.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Qué recompensa estaba disponible'),
      jsonb_build_object('type','paragraph','text','Grinding Gear Games habilitó el Abyssal Soul Shatter Rare Finisher Effect como Twitch Drop durante la revelación de Curse of the Allflame. La condición oficial era acumular 45 minutos en GGG Live o en cualquier canal de la categoría Path of Exile con Drops activados.'),
      jsonb_build_object('type','paragraph','text','La ventana comenzó el 16 de julio a la 1 PM PDT y terminó el 17 de julio a la misma hora. GGG indicó que la promoción estaba disponible para todas las cuentas y que el tiempo podía acumularse en canales elegibles. Se trató de un efecto visual: no aumentaba daño ni modificaba el poder del personaje.'),
      jsonb_build_object('type','heading','text','Enlazar, mirar y reclamar'),
      jsonb_build_object('type','paragraph','text','Antes de mirar, la cuenta de Path of Exile debía estar conectada con Twitch desde la sección de conexiones. Cumplir el tiempo no era el último paso: el efecto debía reclamarse en el inventario de Twitch antes del cierre promocional. Una pestaña abierta sin enlace o un premio sin canjear podían dejar el ritual incompleto.'),
      jsonb_build_object('type','paragraph','text','Una vez reclamado, GGG señaló que el cosmético quedaría disponible en la lista de microtransacciones de Path of Exile y Path of Exile 2. También anticipó que el efecto se vendería en la tienda más adelante; el Drop ofrecía acceso gratuito durante la campaña, no exclusividad permanente.'),
      jsonb_build_object('type','heading','text','La comprobación útil'),
      jsonb_build_object('type','paragraph','text','Para futuras campañas, el procedimiento seguro es siempre el mismo: confirmar fechas en el anuncio oficial, revisar el estado de la conexión, entrar a un canal que muestre Drops habilitados, controlar el progreso en Twitch y reclamar antes del límite. No hace falta compartir contraseñas ni usar extensiones desconocidas.'),
      jsonb_build_object('type','quote','text','Mirar era opcional. Enlazar y reclamar eran los pasos técnicos que convertían el tiempo en recompensa.'),
      jsonb_build_object('type','paragraph','text','La campaña ya tuvo una ventana definida; esta nota queda como registro y guía para entender el sistema. Si aparece un nuevo Drop, no conviene reutilizar fechas o recompensas antiguas: cada promoción necesita su propia verificación oficial.')
    ),
    'Depth pass 03: requisitos, ventana y recompensa verificados en el post oficial de GGG. Se aclara que la campaña tenía fecha de cierre.'
  ),
  (
    'science-artemis-iii-lander-test',
    'Artemis III será una misión de demostración en órbita terrestre baja: Orion practicará encuentros y acoplamientos con prototipos de alunizadores de Blue Origin y SpaceX antes de futuras misiones humanas a la superficie lunar.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Una misión para ensayar la arquitectura'),
      jsonb_build_object('type','paragraph','text','NASA describe Artemis III como una misión de demostración prevista para 2027, anterior a los alunizajes tripulados proyectados para 2028. La tripulación viajará en Orion, lanzada por SLS, y practicará en órbita terrestre baja maniobras de encuentro, acoplamiento y separación con artículos de prueba de los alunizadores comerciales.'),
      jsonb_build_object('type','paragraph','text','Blue Origin y SpaceX aportarán prototipos basados en sus futuras arquitecturas lunares. El plan obliga a coordinar tres lanzamientos en un período corto, centros de control, redes y dos secuencias de acoplamiento consecutivas. El objetivo no es simular una Luna de utilería: es probar interfaces reales entre naves, software, operaciones y equipos humanos.'),
      jsonb_build_object('type','heading','text','Dos vehículos, pruebas diferentes'),
      jsonb_build_object('type','paragraph','text','El artículo de prueba Blue Moon incorporará aviónica, software de vuelo y sistemas de control. Hasta dos astronautas de Orion ingresarán en su cabina durante la demostración. También llevará un simulador instrumentado de la masa de un traje para registrar el ambiente interior.'),
      jsonb_build_object('type','paragraph','text','El prototipo Starship usará una versión 3 con un sistema de acoplamiento en la nariz. NASA y SpaceX evaluarán control y comunicaciones del conjunto integrado, pero los astronautas no entrarán en Starship durante Artemis III. Esa diferencia evita contar ambas pruebas como si fueran idénticas.'),
      jsonb_build_object('type','heading','text','Qué puede aprender NASA'),
      jsonb_build_object('type','paragraph','text','Los ensayos permitirán observar interoperabilidad de hardware y software, dinámica de las naves unidas y capacidad de llegar al mismo punto en el momento previsto. Según el plan publicado, Orion actuará como perseguidor en ambos acoplamientos, mientras cada sistema tendrá una geometría y un control integrado diferentes.'),
      jsonb_build_object('type','quote','text','Artemis III no es todavía el alunizaje: es la prueba coordinada que busca reducir incertidumbre antes de llevar una tripulación a la superficie.'),
      jsonb_build_object('type','paragraph','text','Fechas y arquitectura pueden evolucionar a medida que maduren los vehículos. La lectura responsable consiste en seguir la actualización de NASA y no convertir un objetivo programático en un hecho ya cumplido. La misión será valiosa precisamente porque expone problemas antes de que el destino sea la Luna.')
    ),
    'Depth pass 03: arquitectura, secuencia y límites tomados del artículo oficial de NASA del 15 de julio de 2026.'
  ),
  (
    'science-curiosity-ancient-sandstorm',
    'Capas inclinadas dentro de rocas marcianas conservan el rastro de una tormenta de arena de hace miles de millones de años. Curiosity registró la formación en Jawbone Canyon y NASA la presenta como la primera evidencia de estratos de ondulación eólica ascendente en Marte.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Un evento antiguo guardado en piedra'),
      jsonb_build_object('type','paragraph','text','NASA publicó una imagen de rocas formadas por numerosas capas onduladas apiladas. La interpretación científica es que, hace miles de millones de años, una tormenta marciana de varias horas movió arena con suficiente intensidad para que las ondulaciones treparan unas sobre otras. El sedimento terminó endurecido y conservó el patrón.'),
      jsonb_build_object('type','paragraph','text','Curiosity tomó la fotografía el 12 de diciembre de 2024, durante el sol 4.391 de su misión, en un lugar apodado Jawbone Canyon. La imagen fue incorporada al Photojournal de NASA en julio de 2026, junto con el vínculo al trabajo publicado en la revista Geology.'),
      jsonb_build_object('type','heading','text','Cómo se infiere una tormenta sin haberla visto'),
      jsonb_build_object('type','paragraph','text','El rover no filmó el evento. Los investigadores leen la geometría de los estratos y la comparan con procesos de transporte de sedimentos conocidos. Las llamadas “climbing wind ripple strata” aparecen cuando nuevas ondulaciones avanzan y se depositan sobre las anteriores en vez de borrarlas por completo.'),
      jsonb_build_object('type','paragraph','text','NASA señala que sería la primera evidencia de este tipo identificada en Marte. “Primera evidencia” no significa que fuera la primera tormenta del planeta ni que ya se conozca todo su clima antiguo. Define una observación concreta y una interpretación respaldada por un estudio científico.'),
      jsonb_build_object('type','heading','text','Por qué importa el registro'),
      jsonb_build_object('type','paragraph','text','Una estructura sedimentaria puede revelar dirección, intensidad relativa y persistencia del viento en un ambiente que ya no existe. Marte no conserva archivos escritos, pero sus rocas funcionan como logs físicos: cada capa limita las historias posibles y permite reconstruir procesos de otra época.'),
      jsonb_build_object('type','quote','text','La imagen muestra las capas actuales; la tormenta es una reconstrucción basada en la forma en que esas capas se organizaron.'),
      jsonb_build_object('type','paragraph','text','La fuente ofrece además la descarga de la imagen en alta resolución y sus créditos NASA/JPL-Caltech/MSSS. Para explorar el hallazgo conviene mirar la fotografía original y el estudio enlazado, manteniendo separadas observación, interpretación y alcance.')
    ),
    'Depth pass 03: datos de la imagen y descripción oficial de NASA; se diferencia observación directa de inferencia geológica.'
  ),
  (
    'science-davinci-venus-helicopter',
    'Diez vuelos sobre Crater Island probaron un prototipo del sistema de cámaras de DAVINCI. El equipo recreó desde un helicóptero la geometría de descenso que usará la sonda para observar Alpha Regio a través de la atmósfera de Venus.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Ensayar Venus desde Utah'),
      jsonb_build_object('type','paragraph','text','Entre el 23 y el 25 de junio de 2026, el equipo de DAVINCI realizó diez vuelos de helicóptero sobre siete sitios geológicos de Crater Island, Utah. El objetivo fue probar un prototipo del sistema de imágenes que algún día descenderá por la atmósfera de Venus.'),
      jsonb_build_object('type','paragraph','text','La carga colgaba de un cable de 50 pies e incluía nueve instrumentos: cámaras infrarrojas, sensores de presión y temperatura, GPS, giróscopos y un magnetómetro. Los descensos lentos y casi verticales comenzaron desde altitudes de hasta 18.000 pies para aproximar la geometría de observación de la misión.'),
      jsonb_build_object('type','heading','text','Qué necesita ver DAVINCI'),
      jsonb_build_object('type','paragraph','text','La sonda tendrá alrededor de 60 minutos durante su descenso en Venus para tomar imágenes, medir química atmosférica y estudiar el entorno. Su blanco es Alpha Regio, una región montañosa cuya historia podría ayudar a responder si Venus tuvo océanos y continentes parecidos a los terrestres.'),
      jsonb_build_object('type','paragraph','text','Las cámaras deberán atravesar visualmente las nubes en longitudes de onda del infrarrojo cercano y producir información sobre topografía y composición de las rocas. En una demostración, el equipo unió 37 imágenes infrarrojas obtenidas durante un descenso sobre Crater Island.'),
      jsonb_build_object('type','heading','text','La calibración antes del misterio'),
      jsonb_build_object('type','paragraph','text','Utah no reproduce la temperatura, presión ni química de Venus. Sirve porque presenta relieves y variedades minerales conocidas. Si el sistema puede reconstruir mapas coherentes y compararlos con cartografía geológica del Servicio Geológico de Estados Unidos, el equipo gana evidencia sobre cómo interpretar datos futuros de un terreno desconocido.'),
      jsonb_build_object('type','quote','text','El análogo terrestre no pretende ser Venus: ofrece una respuesta conocida contra la cual calibrar instrumentos y métodos.'),
      jsonb_build_object('type','paragraph','text','Esta clase de campaña muestra una parte poco espectacular pero esencial de la ciencia planetaria. Antes de pedirle a una sonda que revele otro mundo, se prueba el hardware, se registra su movimiento y se comprueba si el análisis puede describir correctamente un paisaje que ya conocemos.')
    ),
    'Depth pass 03: campaña, instrumentos y propósito verificados en el blog de campo oficial de NASA.'
  ),
  (
    'science-hubble-clusters-missing-black-holes',
    'Más de veinte años de datos de Hubble, refinados con observaciones de Webb, permitieron detectar el primer agujero negro de masa estelar conocido en Omega Centauri siguiendo el movimiento de su estrella compañera.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','El objeto que faltaba en Omega Centauri'),
      jsonb_build_object('type','paragraph','text','Omega Centauri reúne alrededor de diez millones de estrellas ligadas por gravedad. Los modelos indican que debería contener cerca de diez mil agujeros negros de masa estelar, restos de estrellas que explotaron, pero las búsquedas anteriores habían encontrado muy poca evidencia de esa población.'),
      jsonb_build_object('type','paragraph','text','Un equipo analizó más de veinte años de datos astrométricos de Hubble y añadió observaciones recientes de Webb. En vez de buscar radio o rayos X del material que cae en un agujero negro, midió desplazamientos diminutos de una estrella visible que orbita un compañero invisible y muy masivo.'),
      jsonb_build_object('type','heading','text','Qué se detectó realmente'),
      jsonb_build_object('type','paragraph','text','El sistema, llamado oMEGACat BH-2, se encuentra a unos 18.000 años luz. La masa calculada del objeto oscuro permitió descartar que fuera una estrella de neutrones y sostener la interpretación de un agujero negro de masa estelar. Es el primero detectado de esa clase dentro de Omega Centauri.'),
      jsonb_build_object('type','paragraph','text','NASA destaca dos rasgos inesperados: su masa es menor de lo previsto y el par formado por el agujero negro y su estrella compañera tiene el período orbital más largo conocido para un sistema binario de agujero negro. Los resultados fueron publicados en The Astrophysical Journal Letters.'),
      jsonb_build_object('type','heading','text','Por qué una ausencia puede ser ciencia'),
      jsonb_build_object('type','paragraph','text','Los astrónomos no “vieron” una esfera negra en una fotografía. Detectaron el efecto gravitatorio sobre una estrella y ajustaron hipótesis con mediciones de precisión. La anomalía inicial era la diferencia entre la población predicha y la observada; encontrar un integrante permite revisar cómo se forman y sobreviven estos objetos en cúmulos densos.'),
      jsonb_build_object('type','quote','text','El agujero negro se vuelve visible por la órbita que impone a una estrella que sí podemos medir.'),
      jsonb_build_object('type','paragraph','text','Un primer caso no prueba que ya aparecieron los miles restantes. Abre una ruta de búsqueda y muestra el valor de los archivos científicos: datos reunidos entre 2002 y 2023 adquirieron nueva precisión al combinarse con otro observatorio.')
    ),
    'Depth pass 03: cifras, método y límites basados en la comunicación oficial del equipo Hubble de NASA.'
  ),
  (
    'green-digital-footprint',
    'La huella digital no es un solo dato sino la combinación de perfiles, publicaciones, registros y bases comerciales. Este expediente transforma la guía de EFF en una auditoría defensiva para descubrir exposición y reducirla según tu riesgo real.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','SEÑAL // Muchas piezas forman un perfil'),
      jsonb_build_object('type','paragraph','text','EFF advierte que una dirección, un usuario, una fotografía o el nombre de un familiar pueden parecer inofensivos por separado. Reunidos, facilitan phishing dirigido, acoso, seguimiento y fraude. Parte de esa información fue publicada voluntariamente; otra parte puede estar agregada y vendida por intermediarios de datos.'),
      jsonb_build_object('type','paragraph','text','No existe una limpieza idéntica para todos. Una persona pública, alguien que teme acoso dirigido y quien sólo quiere reducir fraude enfrentan amenazas distintas. El primer paso no es desaparecer de Internet, sino definir qué datos causarían más daño y quién podría intentar usarlos.'),
      jsonb_build_object('type','heading','text','PROTOCOLO // Auditar sin exponerte más'),
      jsonb_build_object('type','paragraph','text','La guía propone buscar tu nombre, alias, avatar, correos, teléfonos y direcciones como lo haría un desconocido. Conviene hacerlo en una ventana privada para reducir resultados personalizados, registrar dónde aparece cada dato y empezar por lo más sensible. No publiques el inventario ni lo compartas con servicios desconocidos.'),
      jsonb_build_object('type','paragraph','text','Antes de solicitar bajas, reforzá las cuentas: contraseñas únicas mediante un gestor y autenticación de dos factores. Después revisá perfiles antiguos, privacidad en redes, anuncios clasificados y sitios de búsqueda de personas. Los procesos de exclusión pueden ser repetitivos porque las bases vuelven a poblarse.'),
      jsonb_build_object('type','heading','text','LÍMITE // Reducir no es borrar el pasado'),
      jsonb_build_object('type','paragraph','text','Pedir a Google que retire un resultado puede disminuir su visibilidad, pero no elimina la página que aloja el dato ni impide que otro buscador la encuentre. Del mismo modo, borrar una publicación propia no garantiza que no existan capturas, copias o archivos.'),
      jsonb_build_object('type','quote','text','La meta realista es hacer que la información peligrosa sea más difícil de encontrar, combinar y reutilizar.'),
      jsonb_build_object('type','paragraph','text','Repetí la auditoría de forma periódica y después de cambios de trabajo, domicilio o exposición pública. Green Node no promete invisibilidad: enseña a cartografiar el rastro, priorizar riesgo y dejar menos piezas disponibles para que otro construya tu perfil.')
    ),
    'Depth pass 03: procedimiento defensivo resumido desde Surveillance Self-Defense de EFF; sin promesas de eliminación total.'
  ),
  (
    'green-encrypt-windows',
    'El cifrado de disco protege los datos cuando una computadora apagada o bloqueada cae en manos ajenas. Este expediente explica cómo verificar Device Encryption o BitLocker y por qué la clave de recuperación es tan importante como activar el cifrado.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','SEÑAL // Proteger datos en reposo'),
      jsonb_build_object('type','paragraph','text','El cifrado completo del disco transforma la información almacenada para que no pueda leerse sin la clave adecuada. EFF lo recomienda como defensa ante pérdida, robo o acceso físico al dispositivo. También dificulta extraer la unidad y leerla desde otra computadora.'),
      jsonb_build_object('type','paragraph','text','La protección es más fuerte cuando el equipo está apagado. Después de iniciar sesión, el sistema necesita descifrar datos para trabajar; por eso una sesión abierta, malware activo o una contraseña comprometida pertenecen a otro escenario de riesgo. Cifrar no reemplaza bloquear la pantalla, actualizar ni mantener copias de seguridad.'),
      jsonb_build_object('type','heading','text','PROTOCOLO // Revisar qué ofrece Windows'),
      jsonb_build_object('type','paragraph','text','En Windows 11, Device Encryption y BitLocker pueden aparecer en Configuración, Privacidad y seguridad, Cifrado de dispositivo. La disponibilidad depende de versión y hardware. BitLocker se ofrece en ediciones Pro, Education y Enterprise; Device Encryption requiere características compatibles y puede estar activado de fábrica en algunos equipos.'),
      jsonb_build_object('type','paragraph','text','No fuerces una receta si la opción no aparece. Confirmá versión de Windows, soporte TPM y documentación vigente del fabricante o Microsoft. Antes de cambiar particiones o usar herramientas alternativas, realizá un backup comprobable: una copia que nunca intentaste restaurar sigue siendo una apuesta.'),
      jsonb_build_object('type','heading','text','LÍMITE // La clave que también puede bloquearte'),
      jsonb_build_object('type','paragraph','text','La clave de recuperación permite acceder si olvidás la contraseña o el sistema exige verificación adicional. Guardarla en la cuenta de Microsoft facilita recuperación, pero deposita confianza en ese proveedor. Conservarla por cuenta propia reduce esa dependencia y aumenta tu responsabilidad: perderla puede volver irrecuperables los archivos.'),
      jsonb_build_object('type','quote','text','No guardes la única clave de recuperación dentro del mismo disco que esa clave debe desbloquear.'),
      jsonb_build_object('type','paragraph','text','Elegí una ubicación separada y protegida, verificá que puedas encontrarla y documentá el procedimiento sin exponer el secreto. La defensa correcta combina cifrado, credenciales fuertes, recuperación y backup; activar un interruptor sin plan deja un punto único de falla.')
    ),
    'Depth pass 03: guía defensiva basada en EFF; se evita indicar cambios destructivos sin backup y verificación de compatibilidad.'
  ),
  (
    'green-encryption-basics',
    'Cifrar no significa lo mismo en un disco, una web y un chat. EFF distingue datos en reposo, protección de transporte y cifrado de extremo a extremo; el expediente muestra qué actor todavía puede ver contenido o metadatos en cada caso.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','SEÑAL // Un candado, varias capas'),
      jsonb_build_object('type','paragraph','text','El cifrado es un proceso matemático que vuelve ilegible un mensaje o archivo para quien no posee la clave. Puede proteger datos almacenados en un teléfono o una computadora, y también información que cruza una red. La palabra es la misma, pero el adversario y el punto protegido cambian.'),
      jsonb_build_object('type','paragraph','text','El cifrado completo de disco protege datos en reposo, sobre todo cuando el dispositivo está apagado o bloqueado. No garantiza que el disco esté cifrado sólo porque exista una pantalla con contraseña. Cada sistema operativo debe confirmar qué función está activa y cómo se recupera.'),
      jsonb_build_object('type','heading','text','PROTOCOLO // Transporte no es extremo a extremo'),
      jsonb_build_object('type','paragraph','text','HTTPS usa cifrado de transporte entre el navegador y el sitio. Impide que un observador de la red lea el contenido de cada página o formulario, pero el servidor del sitio recibe los datos y puede procesarlos. Un candado tampoco certifica que la página sea honesta ni impide cookies de seguimiento o malware alojado allí.'),
      jsonb_build_object('type','paragraph','text','En un chat con cifrado de extremo a extremo, el mensaje se cifra en el dispositivo emisor y sólo el receptor previsto puede descifrarlo. El proveedor no debería leer el contenido durante el tránsito. Aun así puede conocer metadatos como direcciones IP, horarios o participantes, según el diseño del servicio.'),
      jsonb_build_object('type','heading','text','LÍMITE // Los extremos siguen siendo humanos y dispositivos'),
      jsonb_build_object('type','paragraph','text','Si uno de los teléfonos está comprometido, la comunicación puede leerse después de descifrada. El destinatario puede guardar una copia o hacer una captura. Y si una conversación cifrada termina en un backup sin la misma protección, el archivo de nube se convierte en una ruta alternativa.'),
      jsonb_build_object('type','quote','text','El cifrado protege un tramo del camino; el modelo de amenaza decide si ese tramo es suficiente.'),
      jsonb_build_object('type','paragraph','text','La defensa en profundidad combina protección en tránsito y en reposo, actualizaciones, control de acceso y decisiones sobre qué servicio merece confianza. Una VPN, por ejemplo, mueve parte de la visibilidad desde el proveedor de Internet hacia el proveedor de VPN: no elimina la necesidad de confiar, la traslada.')
    ),
    'Depth pass 03: conceptos y límites derivados de la guía básica de cifrado de EFF.'
  ),
  (
    'green-fbi-ufo-context',
    'El FBI Vault publica dieciséis partes documentales bajo la etiqueta UFO. Su existencia prueba que los archivos fueron conservados y divulgados; no convierte automáticamente cada relato interno en una conclusión verificada del FBI.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','SEÑAL // Dieciséis partes en el archivo'),
      jsonb_build_object('type','paragraph','text','La página UFO del FBI Vault reúne enlaces a dieciséis partes, desde “UFO Part 01” hasta “UFO Part 16 (Final)”. El Vault es una biblioteca de documentos divulgados. Ese origen permite establecer procedencia y consultar páginas completas en vez de depender de una captura que circula sin contexto.'),
      jsonb_build_object('type','paragraph','text','La presencia de un memo en un archivo oficial no significa que la institución confirme todas las afirmaciones que aparecen dentro. Un organismo puede registrar denuncias, informes de terceros, hipótesis, pedidos y comunicaciones sin adoptar su contenido como conclusión propia.'),
      jsonb_build_object('type','heading','text','PROTOCOLO // Leer el expediente completo'),
      jsonb_build_object('type','paragraph','text','Empezá por identificar número de parte, fecha, remitente, destinatario y tipo de documento. Después buscá anexos, respuestas, referencias cruzadas y páginas contiguas. Un sello prueba circulación administrativa; una tachadura indica información omitida bajo una regla, pero ninguna de las dos cosas demuestra por sí sola la verdad material de un relato.'),
      jsonb_build_object('type','paragraph','text','Separá tres niveles: el documento existe, una persona escribió determinada afirmación y esa afirmación fue comprobada. Los dos primeros pueden verificarse en el archivo. El tercero exige evidencia adicional, metodología y, cuando corresponde, fuentes independientes.'),
      jsonb_build_object('type','heading','text','LÍMITE // Desclasificado no significa demostrado'),
      jsonb_build_object('type','paragraph','text','Las colecciones históricas suelen contener lenguaje incompleto, copias de baja calidad y categorías que cambiaron con el tiempo. También pueden carecer del resultado final de una investigación. Elegir la frase más extraña y omitir la cronología produce una historia viral, no una lectura responsable.'),
      jsonb_build_object('type','quote','text','La procedencia vuelve auténtico al documento como objeto; la evidencia decide cuánto creer de lo que el documento relata.'),
      jsonb_build_object('type','paragraph','text','Green Node puede explorar misterio sin abandonar el método. El portal enlaza la colección original para que cada lector consulte las dieciséis partes y distinga registro, testimonio, análisis y conclusión. La conspiración se vuelve más interesante cuando resiste una lectura completa.')
    ),
    'Depth pass 03: alcance de la colección verificado en FBI Vault; se explicita que archivo oficial no equivale a validación de cada afirmación.'
  ),
  (
    'ai-deepmind-co-scientist',
    'Co-Scientist usa una coalición de agentes Gemini para generar, debatir, clasificar y refinar hipótesis. Google DeepMind lo presenta como socio experimental para investigadores, no como reemplazo de experimentos, revisión científica o criterio clínico.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','Una mesa de agentes para construir hipótesis'),
      jsonb_build_object('type','paragraph','text','Google DeepMind publicó en mayo de 2026 una nueva etapa de Co-Scientist, un sistema multiagente construido con Gemini. La propuesta organiza la exploración científica en un ciclo de generación, crítica, clasificación y evolución de ideas, en lugar de pedirle a un único modelo una respuesta definitiva.'),
      jsonb_build_object('type','paragraph','text','Agentes especializados proponen hipótesis, agrupan alternativas, actúan como revisores, comparan ideas y combinan las mejor posicionadas. Un supervisor coordina el proceso. El sistema puede consultar literatura, búsqueda web y bases especializadas para mantener las propuestas vinculadas a conocimiento existente.'),
      jsonb_build_object('type','heading','text','Qué mostró el proyecto'),
      jsonb_build_object('type','paragraph','text','DeepMind informa colaboraciones en resistencia antimicrobiana, inmunidad vegetal, fibrosis hepática y otras áreas. La nueva investigación fue publicada en Nature y el acceso individual se prepara mediante una herramienta experimental de generación de hipótesis dentro de Gemini for Science.'),
      jsonb_build_object('type','paragraph','text','Los ejemplos descriptos incluyen priorización de candidatos, síntesis de literatura y propuestas que luego fueron evaluadas en laboratorios. El orden es crucial: el sistema sugiere y organiza; los experimentos y expertos deciden si una hipótesis sobrevive.'),
      jsonb_build_object('type','heading','text','El límite que evita convertirlo en oráculo'),
      jsonb_build_object('type','paragraph','text','La propia publicación dice que Co-Scientist es un compañero de investigación, no un sustituto de experiencia científica o clínica. Una hipótesis coherente puede seguir siendo falsa. Sesgos en publicaciones, datos incompletos o errores de razonamiento también pueden propagarse entre agentes si no existen controles humanos.'),
      jsonb_build_object('type','quote','text','La IA puede ampliar la pizarra; la naturaleza, el experimento y la revisión deciden qué queda escrito.'),
      jsonb_build_object('type','paragraph','text','Para estudiantes y adultos curiosos, la lección práctica es útil más allá del producto: separar ideación de validación. Co-Scientist muestra cómo una arquitectura puede estructurar preguntas complejas, pero la autoridad sigue viniendo de métodos reproducibles y evidencia revisable.')
    ),
    'Depth pass 03: arquitectura, disponibilidad y límites basados en la publicación oficial y su advertencia de uso.'
  ),
  (
    'ai-deepmind-multi-agent-safety',
    'DeepMind y organizaciones asociadas abrieron una convocatoria de hasta 10 millones de dólares para estudiar seguridad multiagente: bancos de prueba, redes de agentes, infraestructura confiable y mecanismos de supervisión.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','La seguridad cambia cuando los modelos interactúan'),
      jsonb_build_object('type','paragraph','text','Google DeepMind, Schmidt Sciences, Cooperative AI Foundation, ARIA y Google.org anunciaron en junio de 2026 una convocatoria de financiación técnica de hasta diez millones de dólares. El foco no es solamente evaluar un modelo aislado, sino entender poblaciones de agentes que se comunican, negocian y actúan en entornos compartidos.'),
      jsonb_build_object('type','paragraph','text','La preocupación central es que muchos sistemas independientes pueden producir conductas colectivas difíciles de anticipar. Un agente que parece estable por separado puede cambiar al competir, coordinarse o depender de otros. También aparecen problemas de identidad, reputación, compromisos y monitoreo entre plataformas.'),
      jsonb_build_object('type','heading','text','Cuatro áreas de investigación'),
      jsonb_build_object('type','paragraph','text','La convocatoria prioriza sandboxes y bancos de prueba reproducibles; ciencia de redes de agentes; infraestructura resistente para identidad y confianza; y supervisión capaz de detectar o mitigar daños colectivos. Los ejemplos incluyen mercados virtuales, ecosistemas simulados y flujos entre organizaciones.'),
      jsonb_build_object('type','paragraph','text','DeepMind presenta la iniciativa como una invitación global a investigadores académicos e independientes. La fecha publicada para enviar propuestas es el 8 de agosto de 2026, con anuncios de seleccionados previstos para el otoño boreal del mismo año.'),
      jsonb_build_object('type','heading','text','Qué no demuestra la convocatoria'),
      jsonb_build_object('type','paragraph','text','Financiar un campo no prueba que millones de agentes ya operen de la forma proyectada ni que cada riesgo vaya a materializarse. Sí muestra que los evaluadores actuales, concentrados en modelos individuales, pueden resultar insuficientes para sistemas conectados y que existe una agenda concreta para construir mejores instrumentos.'),
      jsonb_build_object('type','quote','text','Una party de agentes necesita reglas, identidad y observabilidad; multiplicar modelos no multiplica automáticamente seguridad.'),
      jsonb_build_object('type','paragraph','text','Para el Nexus, esta noticia conecta tecnología con gobernanza. Si los agentes empiezan a realizar tareas entre servicios, la pregunta no será sólo qué puede hacer cada uno, sino cómo falla el conjunto, quién lo observa y cómo se detiene una cadena de decisiones antes de que escale.')
    ),
    'Depth pass 03: monto, áreas y fechas verificados en la convocatoria oficial de DeepMind y socios.'
  ),
  (
    'tech-diffusion-gemma-text-generation',
    'DiffusionGemma es un modelo abierto experimental de 26B parámetros totales que genera bloques de texto en paralelo. Google reporta hasta cuatro veces más velocidad en GPU dedicada, con una advertencia explícita: su calidad general es menor que Gemma 4 estándar.',
    jsonb_build_array(
      jsonb_build_object('type','heading','text','De la máquina de escribir a un bloque paralelo'),
      jsonb_build_object('type','paragraph','text','Google presentó DiffusionGemma el 10 de junio de 2026 como un modelo experimental abierto bajo licencia Apache 2.0. En lugar de producir texto estrictamente token por token, trabaja con bloques de 256 tokens y los refina en varias pasadas, una idea inspirada en los procesos de difusión usados en imágenes.'),
      jsonb_build_object('type','paragraph','text','El modelo tiene 26 mil millones de parámetros totales en una arquitectura Mixture of Experts, pero activa 3.8 mil millones durante la inferencia. Google afirma que una versión cuantizada puede funcionar dentro de 18 GB de VRAM y apunta a flujos locales interactivos como edición en línea, completado de código y generación no lineal.'),
      jsonb_build_object('type','heading','text','Dónde aparece la velocidad'),
      jsonb_build_object('type','paragraph','text','Según las mediciones publicadas, DiffusionGemma alcanza hasta cuatro veces más salida de tokens en GPU dedicada, con más de 1.000 tokens por segundo en una NVIDIA H100 y más de 700 en una RTX 5090. Son cifras de configuraciones concretas, no una promesa para cualquier computadora.'),
      jsonb_build_object('type','paragraph','text','La ventaja está diseñada para inferencia local y baja o mediana concurrencia, donde una aceleradora puede trabajar sobre un bloque grande. En servicios de nube con muchas solicitudes simultáneas, los modelos autoregresivos pueden aprovechar mejor el procesamiento por lotes y reducir o invertir esa ventaja.'),
      jsonb_build_object('type','heading','text','El intercambio entre rapidez y calidad'),
      jsonb_build_object('type','paragraph','text','Google advierte que la calidad general de salida es inferior a Gemma 4 estándar y recomienda la familia autoregresiva cuando el objetivo principal es máxima calidad de producción. También señala que arquitecturas de memoria unificada, como Apple Silicon, pueden no experimentar la misma aceleración.'),
      jsonb_build_object('type','quote','text','“Hasta cuatro veces” describe un escenario medido; no elimina hardware, memoria, calidad y costo de la comparación.'),
      jsonb_build_object('type','paragraph','text','La prueba útil consiste en medir una tarea real: latencia hasta la primera respuesta, velocidad sostenida, memoria, precisión y consumo. DiffusionGemma abre otra forma de generar texto y puede ser valiosa para interfaces rápidas, pero su estado experimental obliga a evaluar antes de reemplazar un modelo de producción.')
    ),
    'Depth pass 03: arquitectura, benchmarks y trade-offs tomados del anuncio oficial de Google; se conservan límites de hardware y calidad.'
  )
)
update public.news_articles as article
set
  summary = editorial_updates.summary,
  content = editorial_updates.content,
  editor_notes = editorial_updates.editor_notes,
  updated_at = now()
from editorial_updates
where article.slug = editorial_updates.slug
  and article.status = 'published';
