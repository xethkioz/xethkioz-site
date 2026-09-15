begin;

with editorial_author as (
  select id as author_id from public.profiles
  order by is_site_owner desc, (upper(role) = 'ADMIN') desc, created_at asc nulls last limit 1
)
insert into public.news_articles (
  slug, title, summary, content, category, author_id, status, published_at,
  tags, source_urls, ai_generated, review_status, editor_notes, created_at, updated_at
)
values
(
  'gaming-helldivers-2-ironclad-democracy-warbond-guia',
  'Gaming · Helldivers 2: qué trae Ironclad Democracy y cómo prepararse para el 22 de septiembre',
  'Arrowhead presentó un Warbond Premium centrado en armamento pesado, resistencia a impactos y nuevas opciones antitanque. Ordenamos sus requisitos, equipo y límites para decidir antes de gastar Super Credits.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un arsenal pesado que llega el 22 de septiembre$x$),
    jsonb_build_object('type','paragraph','text',$x$PlayStation y Arrowhead anunciaron el 15 de septiembre de 2026 Ironclad Democracy, el próximo Warbond Premium de Helldivers 2. Estará disponible el 22 de septiembre y requiere el juego base, Super Credits y progreso suficiente para desbloquear sus recompensas. No es una expansión gratuita ni una mejora automática de la cuenta: el contenido se adquiere dentro del sistema de Warbonds y cada objeto debe habilitarse jugando. La propuesta gira alrededor de potencia, supervivencia ante impactos y herramientas para enfrentar objetivos blindados.$x$),
    jsonb_build_object('type','heading','text',$x$Armas, granadas y armaduras confirmadas$x$),
    jsonb_build_object('type','paragraph','text',$x$El AR-11 Arbitrator combina un rifle de asalto con una escopeta bajo el cañón, mientras el GL-15 Evictor funciona como lanzagranadas de corredera. El P-34 Breacher es una pistola de misiles cuyas cargas adhesivas liberan fósforo. La G-60 Anti-Tank Seeker busca vehículos y enemigos pesados; la G-8 Immolation expulsa combustible incendiario. Las armaduras Tanker ligera e Ironclad pesada comparten Blunt-Force Mitigation: resistencia al derribo, 30 % menos daño por impacto y colisión, y una clasificación de armadura superior.$x$),
    jsonb_build_object('type','list','text',$x$Preparación recomendada: comprobar que Helldivers 2 esté actualizado; revisar el saldo de Super Credits sin comprar por impulso; esperar a ver costos individuales dentro del Warbond; probar el retroceso y la movilidad de cada arma; coordinar granadas antitanque con el escuadrón; evitar fuego amigo con fósforo e incendiarios; comparar la nueva pasiva con la movilidad perdida; y recordar que los valores pueden recibir ajustes de balance posteriores.$x$),
    jsonb_build_object('type','heading','text',$x$Dos boosters y personalización para tanques$x$),
    jsonb_build_object('type','paragraph','text',$x$Integrated Extinguishers extingue automáticamente al Helldiver, al jetpack o al vehículo cuando se incendian. Surplus EAT Allocation concede dos usos gratuitos del estratagema Expendable Anti-Tank por misión. El paquete también incorpora capas, tarjetas, un gesto y patrones de tanque que debutan primero dentro de un Warbond Premium. “Primero” describe su disponibilidad inicial y no garantiza exclusividad permanente. Ninguno de estos objetos asegura por sí solo una victoria: composición del equipo, dificultad y balance siguen determinando su utilidad real.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/gaming-playstation-plus-catalogo-septiembre-2026-fechas-guia y el acceso práctico de /gaming/guides. La fuente primaria es PlayStation Blog, publicada el 15 de septiembre de 2026 con información de Arrowhead Game Studios. XETHKIOZ separa los datos confirmados de las recomendaciones de juego y no presenta estadísticas no publicadas. Conviene revisar la ficha dentro del juego el día de lanzamiento antes de gastar Super Credits.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-09-15T20:30:00Z',
  array['gaming','helldivers-2','ironclad-democracy','warbond','playstation','arrowhead','armas','guia','super-credits','fuente-oficial'],
  array['https://blog.playstation.com/2026/09/15/helldivers-2-ironclad-democracy-warbond-launches-sept-22/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog y Arrowhead Game Studios, 15 de septiembre de 2026. Se distinguen requisitos, contenido confirmado, recomendaciones y posibles cambios de balance.', now(), now()
),
(
  'science-nasa-origen-elementos-universo-guia',
  'Ciencia · De dónde vienen los elementos: una guía para leer la tabla cósmica de NASA',
  'Hidrógeno del Big Bang, carbono creado en estrellas, hierro de supernovas y oro asociado a colisiones estelares: explicamos qué está confirmado y qué continúa bajo investigación.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La materia conserva una historia anterior al Sistema Solar$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA publicó el 14 de septiembre de 2026 una visualización que resume el origen cósmico de los elementos químicos. La idea central es sencilla pero poderosa: los átomos que forman planetas, organismos y tecnología no aparecieron todos en un mismo lugar ni al mismo tiempo. El hidrógeno se remonta principalmente al Big Bang; elementos como carbono y oxígeno se construyen mediante fusión dentro de estrellas; y procesos más violentos completan una parte importante de la tabla periódica. El gráfico es una síntesis científica, no un mapa definitivo de cada átomo.$x$),
    jsonb_build_object('type','heading','text',$x$Estrellas, explosiones y colisiones cumplen papeles distintos$x$),
    jsonb_build_object('type','paragraph','text',$x$Las estrellas transforman núcleos livianos en otros más pesados durante su vida. Cuando algunas estrellas masivas explotan como supernovas, producen y dispersan grandes cantidades de elementos, entre ellos buena parte del hierro que hoy conocemos. Para núcleos todavía más pesados, la evidencia señala acontecimientos con abundancia extrema de neutrones. NASA destaca que el oro probablemente se forma en colisiones de estrellas de neutrones. Esos eventos también distribuyen material por el espacio, donde puede incorporarse a nuevas estrellas, planetas y sistemas.$x$),
    jsonb_build_object('type','list','text',$x$Cómo leer la visualización: empezar por el símbolo químico; observar qué colores o procesos contribuyen a ese elemento; distinguir “origen dominante” de “origen exclusivo”; recordar que un mismo elemento puede surgir por varias rutas; no confundir la formación del núcleo con su llegada a la Tierra; comparar elementos livianos y pesados; revisar la leyenda completa; y tratar como investigación abierta los casos que la propia fuente marca con incertidumbre.$x$),
    jsonb_build_object('type','heading','text',$x$El cobre recuerda que la tabla todavía tiene preguntas$x$),
    jsonb_build_object('type','paragraph','text',$x$La explicación no cierra todos los debates. NASA usa el cobre como ejemplo de un elemento cuyo origen continúa siendo objeto de estudio. Las proporciones atribuidas a supernovas, estrellas de baja masa o fusiones de objetos compactos pueden refinarse cuando aparecen observaciones y modelos mejores. Por eso una infografía debe leerse como el mejor resumen disponible de múltiples líneas de evidencia, no como una receta exacta e inmutable. La ciencia avanza precisamente comparando esas predicciones con espectros, meteoritos y señales de eventos cósmicos.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía se conecta con /news/science-nasa-hubble-webb-objetos-transneptunianos-origen-planetas y /news/science-nasa-cielo-septiembre-2026-venus-equinoccio-luna-guia. La fuente primaria es NASA Astronomy Picture of the Day del 14 de septiembre de 2026. XETHKIOZ conserva expresiones como “probablemente” cuando la fuente describe evidencia en desarrollo y evita atribuir un único origen a elementos producidos mediante varios mecanismos.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-09-15T20:25:00Z',
  array['ciencia','nasa','elementos-quimicos','tabla-periodica','big-bang','estrellas','supernovas','estrellas-de-neutrones','astronomia','fuente-oficial'],
  array['https://science.nasa.gov/image-article/apod-2026-september-14-where-your-elements-came-from/'],
  false, 'approved', 'Fuente primaria: NASA APOD, 14 de septiembre de 2026. Se mantienen las incertidumbres explícitas sobre oro, cobre y contribuciones múltiples.', now(), now()
),
(
  'tech-github-fin-sha1-https-compatibilidad-guia',
  'Tecnología · GitHub desactiva SHA-1 en HTTPS: cómo detectar clientes incompatibles',
  'GitHub completó el retiro programado de SHA-1 para conexiones HTTPS en github.com y sus CDN asociadas. Explicamos a quién afecta, qué revisar y por qué no se trata de los hashes de commits.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$El cambio de HTTPS ya está activo$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub confirmó el 15 de septiembre de 2026 que desactivó SHA-1 en HTTPS para github.com y sus redes de distribución asociadas. El cambio alcanza GitHub Enterprise Cloud, incluidas las instalaciones con Data Residency, y sigue el calendario anunciado previamente. GitHub Enterprise Server no está incluido. La medida afecta la negociación criptográfica de conexiones web seguras: no significa que los identificadores SHA-1 históricos de commits hayan dejado de existir ni que un repositorio moderno necesite reescribir su historial.$x$),
    jsonb_build_object('type','heading','text',$x$Qué equipos pueden notar el retiro$x$),
    jsonb_build_object('type','paragraph','text',$x$Navegadores, sistemas operativos y clientes Git actuales suelen negociar algoritmos más modernos sin intervención. El riesgo aparece en equipos antiguos, bibliotecas TLS desactualizadas, dispositivos integrados, proxies corporativos o herramientas de automatización que sólo aceptan SHA-1 durante HTTPS. Allí una operación clone, fetch, descarga de release o acceso a una API puede fallar antes de autenticarse. Cambiar un token o una clave SSH no arregla una incompatibilidad TLS; primero hay que identificar el cliente y la capa de red que rechazan la conexión.$x$),
    jsonb_build_object('type','list','text',$x$Diagnóstico seguro: registrar el mensaje exacto sin publicar credenciales; comprobar versión de Git, sistema y biblioteca TLS; probar desde una máquina actualizada; revisar proxies y terminación HTTPS; actualizar imágenes de CI y runners antiguos; verificar CDN y descargas automatizadas; evitar reactivar SHA-1 como solución permanente; y repetir clone, fetch y llamadas API después del cambio. Si un equipo no puede actualizarse, conviene aislarlo y usar un intermediario moderno controlado.$x$),
    jsonb_build_object('type','heading','text',$x$No confundir transporte, firmas y objetos Git$x$),
    jsonb_build_object('type','paragraph','text',$x$SHA-1 aparece en varios contextos técnicos y eso puede generar diagnósticos equivocados. Este anuncio se limita a HTTPS: la conexión cifrada entre el cliente y GitHub o sus CDN. Los hashes de objetos Git, las firmas de commits y la elección entre HTTPS o SSH son temas relacionados pero diferentes. Migrar el transporte no altera por sí solo el contenido versionado. Antes de tocar repositorios, hay que confirmar si el error ocurre durante el handshake TLS, la autenticación o una operación interna de Git.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota complementa /news/programming-github-actions-cache-mode-seguridad-guia y /news/tech-github-api-historial-estrellas-privacidad-metricas-guia. La fuente primaria es GitHub Changelog del 15 de septiembre de 2026. XETHKIOZ recomienda actualizar clientes y dependencias de red en una rama o entorno controlado, validar los flujos y recién entonces retirar excepciones temporales. GitHub confirmó el alcance del retiro, pero cada organización debe inventariar sus propios clientes heredados.$x$)
  ),
  'tech', (select author_id from editorial_author), 'published', '2026-09-15T20:20:00Z',
  array['tecnologia','github','sha-1','https','tls','compatibilidad','git','ci-cd','seguridad','fuente-oficial'],
  array['https://github.blog/changelog/2026-09-15-sha-1-in-https-on-github-sunset'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 15 de septiembre de 2026. Se aclara el alcance HTTPS y la diferencia con hashes de objetos, firmas y autenticación.', now(), now()
),
(
  'community-discord-comunidad-segura-moderacion-guia',
  'Nexus City · Guía para una comunidad segura: moderar, reportar y proteger datos en Discord',
  'Una comunidad sana necesita reglas comprensibles, canales de reporte y límites para moderadores. Convertimos las pautas oficiales de Discord en un procedimiento práctico sin prometer riesgo cero.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La seguridad comunitaria empieza antes del primer conflicto$x$),
    jsonb_build_object('type','paragraph','text',$x$Las Community Guidelines de Discord, vigentes desde el 29 de septiembre de 2025, se aplican a contenido, conductas, servidores y aplicaciones. Prohíben acoso, amenazas, divulgación de datos personales sin consentimiento, spam, suplantación, phishing y estafas, entre otras conductas. Para una comunidad como Nexus City, la mejor defensa no es improvisar cuando aparece un problema: conviene transformar esas reglas generales en normas breves, visibles y aplicables por igual a miembros, moderadores y automatizaciones.$x$),
    jsonb_build_object('type','heading','text',$x$Reglas claras, evidencia mínima y escalamiento proporcional$x$),
    jsonb_build_object('type','paragraph','text',$x$El reglamento debe explicar qué se permite, qué se prohíbe, cómo reportar y qué consecuencias son posibles. Cuando ocurre un incidente, la persona afectada debería poder guardar enlaces, identificadores y capturas necesarias sin redistribuir material sensible. Moderación debe separar desacuerdo de hostigamiento, limitar el acceso a la evidencia y aplicar medidas proporcionales. Discord indica que sus equipos revisan reportes y pueden advertir, retirar contenido o suspender cuentas; también desaconseja el vigilantismo porque puede aumentar el riesgo e interferir con investigaciones.$x$),
    jsonb_build_object('type','list','text',$x$Procedimiento recomendado: publicar reglas en un canal de lectura; definir un medio privado de reporte; activar permisos mínimos por rol; exigir autenticación multifactor a moderadores cuando esté disponible; prohibir compartir datos personales y credenciales; no abrir archivos o enlaces inesperados; registrar decisiones sin exponer a la víctima; bloquear y reportar cuentas abusivas mediante las herramientas oficiales; escalar amenazas inmediatas a servicios locales; y revisar periódicamente bots, invitaciones y permisos.$x$),
    jsonb_build_object('type','heading','text',$x$Lo que una política comunitaria no puede garantizar$x$),
    jsonb_build_object('type','paragraph','text',$x$Ninguna configuración elimina por completo el acoso, las cuentas comprometidas o las estafas. Los bots de moderación ayudan a filtrar, pero también pueden equivocarse y deben recibir sólo los permisos indispensables. Una captura aislada puede carecer de contexto; al mismo tiempo, pedir pruebas excesivas puede revictimizar. La comunidad debe indicar tiempos razonables de respuesta, ofrecer apelación y preservar información únicamente durante el período necesario. Si existe peligro físico, explotación infantil o una emergencia, la moderación interna no sustituye a las autoridades y servicios especializados.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía se integra con /community y con las recomendaciones de privacidad de Green Node. La fuente primaria son las Community Guidelines oficiales de Discord, actualizadas el 29 de agosto de 2025 y efectivas desde el 29 de septiembre de 2025. XETHKIOZ resume criterios operativos, pero cada servidor debe adaptar su protocolo, respetar la legislación aplicable y usar el sistema oficial de reportes. La seguridad mejora con reglas consistentes, permisos reducidos y respuesta humana responsable.$x$)
  ),
  'community', (select author_id from editorial_author), 'published', '2026-09-15T20:15:00Z',
  array['nexus-city','comunidad','discord','moderacion','privacidad','reportes','antiphishing','seguridad-digital','convivencia','fuente-oficial'],
  array['https://discord.com/guidelines'],
  false, 'approved', 'Fuente primaria: Discord Community Guidelines, actualizadas el 29 de agosto de 2025 y efectivas desde el 29 de septiembre de 2025. Guía evergreen con límites y escalamiento responsable.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
