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
  'comicon-dc-static-new-titans-dakota-reimpresiones-guia',
  'COMICON · Static vuelve a imprenta: cómo leer New Titans #38 y The Dakota Incident',
  'DC confirmó nuevas ediciones de dos cómics agotados que impulsan la etapa actual de Virgil Hawkins. Ordenamos qué aporta cada historia, cuándo llegan y cómo elegir sin comprar a ciegas.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Dos historias agotadas regresan el 14 de octubre$x$),
    jsonb_build_object('type','paragraph','text',$x$DC anunció el 10 de septiembre de 2026 nuevas impresiones de New Titans #38 y New History of the DC Universe: The Dakota Incident. Ambas estarán disponibles en comiquerías el 14 de octubre, con logotipos renovados, nuevas cubiertas principales y variantes abiertas a pedido. La decisión responde a que las ediciones anteriores se agotaron, pero no convierte los libros en una serie nueva ni cambia su contenido narrativo: son oportunidades adicionales para conseguir capítulos ya publicados.$x$),
    jsonb_build_object('type','heading','text',$x$Qué lugar ocupa cada cómic en la historia de Static$x$),
    jsonb_build_object('type','paragraph','text',$x$The Dakota Incident funciona como la pieza histórica: revisa el episodio que transformó Dakota City y ayuda a entender el origen de los metahumanos conocidos como Bang Babies. Su tercera impresión sirve a lectores que quieren contexto sobre el mundo de Virgil Hawkins. New Titans #38 es la pieza de presente: muestra la incorporación de Static a la alineación más reciente de los Titans. Su segunda impresión interesa especialmente a quien sigue al personaje dentro del equipo y quiere continuar esa etapa.$x$),
    jsonb_build_object('type','list','text',$x$Guía de compra: elegir The Dakota Incident si buscás contexto y origen; elegir New Titans #38 si ya seguís la serie del equipo; consultar a la comiquería antes del 14 de octubre por pedidos; comparar cubierta principal y variante sin confundirlas con historias distintas; revisar créditos y número de edición en la ficha; y evitar sobreprecios basados solamente en la palabra “agotado”. Una reimpresión mejora la disponibilidad, no garantiza valor de colección.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué este regreso importa para Virgil Hawkins$x$),
    jsonb_build_object('type','paragraph','text',$x$La coincidencia de ambas reimpresiones muestra dos caminos complementarios para sostener a Static: reconstruir la memoria de Dakota y darle participación en un grupo central del universo DC. Para un lector nuevo, esa combinación reduce una barrera habitual de los cómics mensuales: entender de dónde viene el héroe y dónde continúa su historia. DC confirmó cuatro portadas nuevas, realizadas por Taurin Clarke, Chris Samnee, Diego Olortegui y Edwin Galmon, pero no anunció material extra ni una edición recopilatoria.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/comicon-dc-bad-seeds-poison-ivy-vandal-savage-guia y /news/comicon-dc-tales-green-lantern-corps-guia-lectura dentro del radar COMICON. La fuente primaria es el comunicado oficial de DC del 10 de septiembre de 2026. XETHKIOZ separa la información confirmada de la recomendación editorial: fecha, títulos y artistas provienen de DC; el orden de lectura es una orientación práctica y puede adaptarse a la colección de cada persona.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-09-13T20:30:00Z',
  array['comicon','dc','static','virgil-hawkins','new-titans','dakota-incident','comics','reimpresion','guia-de-lectura','fuente-oficial'],
  array['https://www.dc.com/blog/2026-09-10/two-sold-out-comics-featuring-static-return-to-print'],
  false, 'approved', 'Fuente primaria: DC Publicity, 10 de septiembre de 2026. Se distinguen reimpresiones, contenido narrativo, cubiertas y recomendación editorial.', now(), now()
),
(
  'green-tor-vpn-beta-android-privacidad-guia',
  'Green Node · Tor VPN Beta protege apps de Android con circuitos separados',
  'Tor Project explicó qué aprendió al llevar su red más allá del navegador. Analizamos el aislamiento por aplicación, los puentes contra bloqueos y los límites que todavía tiene esta beta.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Tor sale del navegador y cubre aplicaciones móviles$x$),
    jsonb_build_object('type','paragraph','text',$x$Tor Project publicó el 9 de septiembre de 2026 un balance de Tor VPN Beta, su aplicación experimental para Android. El objetivo es extender la protección de Tor a mensajería, correo, redes sociales y otras apps que se conectan fuera del navegador. La prueba limitada comenzó durante el otoño boreal anterior y reveló que el uso principal no era simular una ubicación comercial, sino sortear bloqueos de internet en regiones con censura. Esa evidencia reorientó las prioridades del proyecto hacia la elusión y la estabilidad.$x$),
    jsonb_build_object('type','heading','text',$x$Un circuito distinto para cada aplicación$x$),
    jsonb_build_object('type','paragraph','text',$x$A diferencia de una VPN convencional que reúne el tráfico en un solo túnel, Tor VPN Beta asigna un circuito Tor separado a cada aplicación. Ese aislamiento dificulta relacionar la actividad de una app con otra y toma ideas de las defensas contra rastreo entre sitios de Tor Browser. El usuario puede buscar apps y decidir cuáles enrutar. El modelo mejora la separación, pero no vuelve anónimo todo lo que una cuenta revela: iniciar sesión, compartir datos personales o aceptar rastreadores dentro de un servicio sigue creando señales identificables.$x$),
    jsonb_build_object('type','list','text',$x$Uso prudente: descargar sólo desde Tor Project, Google Play o F-Droid; leer el modelo de amenazas antes de depender de la herramienta; seleccionar las apps necesarias; usar puentes cuando la red bloquee Tor; mantener Android y la beta actualizados; comprobar que la conexión esté activa antes de abrir una app sensible; y no esperar la velocidad o el cambio de país típico de una VPN comercial. En situaciones de alto riesgo conviene pedir asesoramiento especializado.$x$),
    jsonb_build_object('type','heading','text',$x$Puentes, Arti y límites de una versión beta$x$),
    jsonb_build_object('type','paragraph','text',$x$El equipo priorizó puentes WebTunnel, que hacen que el tráfico Tor se parezca a tráfico web cifrado, después de observar adopción en Irán, Turkmenistán y otras redes restrictivas. La aplicación se apoya en Arti, la implementación de Tor escrita en Rust, y en Onionmasq. Tor Project informa menos cierres inesperados, mejor manejo de condiciones de red y compilaciones reproducibles; aun así, Arti todavía no incorpora todas las mejoras de rendimiento del cliente clásico, como ciertos controles de congestión.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota se conecta con /news/green-tor-browser-15-0-21-actualizacion-seguridad-guia: Tor Browser sigue siendo la referencia para navegar, mientras Tor VPN Beta cubre tráfico de otras apps. La fuente primaria es Tor Project, 9 de septiembre de 2026, que también enlaza el modelo de amenazas y las descargas. XETHKIOZ presenta la herramienta como beta abierta y no como garantía total de anonimato, velocidad o acceso en cualquier país.$x$)
  ),
  'green', (select author_id from editorial_author), 'published', '2026-09-13T20:25:00Z',
  array['green-node','tor','tor-vpn','android','privacidad','censura','webtunnel','arti','seguridad-digital','fuente-oficial'],
  array['https://blog.torproject.org/tor-vpn-beta/'],
  false, 'approved', 'Fuente primaria: Tor Project, 9 de septiembre de 2026. Se explican aislamiento por app, puentes, base técnica, modelo de amenazas y límites de la beta.', now(), now()
),
(
  'programming-github-actions-cache-mode-seguridad-guia',
  'Creación Web · GitHub Actions suma cache-mode: guía contra el envenenamiento de caché',
  'GitHub habilitó controles de lectura y escritura para la caché de Actions. Explicamos los cuatro modos, la herencia en workflows reutilizables y una adopción segura paso a paso.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Permisos mínimos también para la caché de CI$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 10 de septiembre de 2026 la disponibilidad general de cache-mode en todos sus planes. La opción permite decidir, a nivel de workflow o de job, si GitHub Actions puede restaurar o guardar cachés. El objetivo es aplicar mínimo privilegio a dependencias y artefactos reutilizados durante la integración continua. Una caché manipulada puede introducir contenido no esperado en ejecuciones posteriores; limitar quién escribe reduce la superficie de envenenamiento sin obligar a abandonar la aceleración de builds.$x$),
    jsonb_build_object('type','heading','text',$x$Qué permite cada uno de los cuatro modos$x$),
    jsonb_build_object('type','paragraph','text',$x$El modo read restaura cachés pero impide guardarlas; es el valor predeterminado para eventos de menor confianza como pull_request_target. Write permite restaurar y guardar, y continúa como valor normal para eventos confiables como push. Write-only guarda resultados sin consumir cachés anteriores, mientras none bloquea todo acceso. Una configuración de job prevalece sobre la del workflow. En workflows reutilizables, el llamado nunca puede recibir más acceso que el concedido por quien lo invoca.$x$),
    jsonb_build_object('type','list','text',$x$Plan de adopción: inventariar workflows que usan cache o acciones de setup; clasificar eventos confiables y no confiables; declarar read para validaciones de pull requests cuando sólo necesitan restaurar; reservar write para ramas protegidas o tareas controladas; usar none cuando la caché no aporte valor; revisar excepciones por job; probar tiempos y aciertos antes y después; y auditar cualquier write o write-only sobre pull_request_target, porque GitHub advierte que puede elevar el riesgo.$x$),
    jsonb_build_object('type','heading','text',$x$La configuración explícita requiere contexto$x$),
    jsonb_build_object('type','paragraph','text',$x$Los workflows que no declaren cache-mode conservan los valores seguros existentes, por lo que no hay una migración obligatoria inmediata. Sin embargo, escribir una política explícita ayuda a documentar intención y evita conceder escritura a jobs que sólo compilan o verifican. También exige cuidado: declarar write en un evento de baja confianza reemplaza el valor de sólo lectura. GitHub agrega una anotación de advertencia en esos casos, pero la revisión humana y la protección de ramas siguen siendo controles necesarios.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/tech-github-api-historial-estrellas-privacidad-metricas-guia y /news/ai-github-copilot-agentic-autofix-calidad-lotes-guia-revision dentro de Creación Web. La fuente primaria es GitHub Changelog del 10 de septiembre de 2026 y enlaza la sintaxis oficial. XETHKIOZ recomienda introducir el ajuste en una rama, medir el rendimiento y fusionar sólo el SHA validado: una caché más restringida mejora seguridad, pero no reemplaza dependencias fijadas, revisiones y pruebas.$x$)
  ),
  'programming', (select author_id from editorial_author), 'published', '2026-09-13T20:20:00Z',
  array['creacion-web','github-actions','cache-mode','ci-cd','supply-chain','seguridad','cache-poisoning','workflows','minimo-privilegio','fuente-oficial'],
  array['https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 10 de septiembre de 2026. Se describen los cuatro modos, herencia, valores seguros y riesgo de escritura en eventos de baja confianza.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
