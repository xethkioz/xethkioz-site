-- XETHKIOZ FUN: 15 original meme dossiers, safe to share and reuse with the brand artwork.

with editorial (slug,title,summary,punchline,scene,tags,cover_image_url,cover_image_alt) as (
  values
  ('fun-wisp-deploy-verde','El Wisp vio el deploy en verde','Después de siete builds y una promesa de “es un cambio chiquito”, producción finalmente respondió.','BUILD: SUCCESS. DIGNIDAD: 404.','El Wisp deja de infectar el monitor, mira el check verde y desaparece antes de que alguien toque otro archivo.',array['meme','wisp','deploy'],'/assets/identity/memes-anime-chaos-v1.webp','Espíritu anime del caos digital saliendo de un teléfono'),
  ('fun-poe-build-video','La build del video versus mi personaje','En el tutorial mata al jefe en tres segundos; en mi pantalla el jefe ya conoce a toda mi familia.','MISMO ÁRBOL. DISTINTO DESTINO.','El personaje entra al mapa con aura legendaria, tropieza con el primer grupo y abre discretamente la guía otra vez.',array['meme','path-of-exile','build'],'/assets/portal-fun-chaos-v2.webp','Portal naranja de FUN con caos, humor y energía de internet'),
  ('fun-mu-solo-un-rato','Entré a MU “sólo un rato”','La idea era revisar el inventario. Tres horas después estoy negociando un ítem como si fuera una cumbre internacional.','TIEMPO JUGADO: CLASIFICADO.','El reloj avanza, el mate se enfría y el personaje sigue parado en el mercado diciendo “última oferta”.',array['meme','mu-online','mmorpg'],'/assets/identity/memes-anime-chaos-v1.webp','Entidad de humor anime rodeada de memes'),
  ('fun-admin-no-toque-nada','“No toqué nada” — edición administrador','El panel dejó de responder exactamente después de que alguien aseguró no haber cambiado absolutamente nada.','AUDITORÍA DETECTA: 47 CAMBIOS.','Una ventana de logs se abre sola. El Wisp señala una línea roja y todos miran hacia otro lado.',array['meme','admin','logs'],'/assets/portal-fun-chaos-v2.webp','Energía naranja y violeta del portal divertido'),
  ('fun-chat-ultimo-mensaje','Cuando el chat por fin baja al último mensaje','Mandás “hola”, la pantalla acompaña la conversación y no te deja leyendo arqueología digital de hace veinte minutos.','AUTOSCROLL DESBLOQUEADO. CIVILIZACIÓN RESTAURADA.','El usuario escribe, el mensaje aparece abajo y un coro anime celebra una función que siempre debió existir.',array['meme','chat','ux'],'/assets/identity/memes-anime-chaos-v1.webp','Caos anime digital para la sección FUN'),
  ('fun-mobile-desktop-perfecto','“En mi monitor se ve perfecto”','El portal ocupa media galaxia en escritorio. En el celular, el botón decidió vivir encima del título.','RESPONSIVE DESIGN: EL JEFE SECRETO.','Un diseñador sostiene tres pantallas; cada una muestra el mismo componente tomando decisiones distintas.',array['meme','mobile','web'],'/assets/portal-fun-chaos-v2.webp','Portal de humor con ciudad cyberpunk naranja'),
  ('fun-cache-version-vieja','La caché defendiendo la versión vieja','Publicaste el arreglo, actualizaste dos veces y el navegador insiste en conservar el bug como patrimonio histórico.','CTRL + F5, EXORCISMO DIGITAL.','El Wisp nuevo golpea la puerta mientras una captura antigua ocupa el trono y dice “acá mando yo”.',array['meme','cache','browser'],'/assets/identity/memes-anime-chaos-v1.webp','Wisp de humor emergiendo de una pantalla'),
  ('fun-green-node-conspiracion-wifi','Green Node investigó quién robaba el Wi-Fi','Había teorías sobre satélites, hackers y una entidad interdimensional. Era una actualización de 80 GB.','CASO CERRADO. ANCHO DE BANDA: FALLECIDO.','La terminal imprime evidencia dramática y termina mostrando la barra de descarga de un juego.',array['meme','green-node','wifi'],'/assets/portal-fun-chaos-v2.webp','Portal FUN irradiando energía naranja fantástica'),
  ('fun-ia-prompt-definitivo','El prompt definitivo, versión 38','Sólo faltaba “una pequeña aclaración”. Ahora el prompt tiene prólogo, anexos y una constitución propia.','LA IA RESPONDIÓ: “¿PODÉS RESUMIR?”','Una persona despliega un pergamino infinito frente a un bot que sostiene una taza de café.',array['meme','ai','prompt'],'/assets/identity/memes-anime-chaos-v1.webp','Espíritu anime bromista dentro de un teléfono'),
  ('fun-segundo-factor-telefono','Activé 2FA y dejé el teléfono en otra habitación','La cuenta está segura. Yo también estoy seguro de que no quiero levantarme.','CIBERSEGURIDAD + CARDIO.','El código vence en treinta segundos y el usuario inicia una carrera épica con música de jefe final.',array['meme','2fa','security'],'/assets/portal-fun-chaos-v2.webp','Ciudad digital naranja con un gran emoji luminoso'),
  ('fun-bug-solo-produccion','El bug que sólo aparece en producción','En local funciona, en preview funciona, en la demo funciona. Producción lo invoca al primer clic.','ENTORNO: POSEÍDO.','Cuatro checks verdes rodean una pantalla roja mientras el Wisp sonríe demasiado tranquilo.',array['meme','bug','production'],'/assets/identity/memes-anime-chaos-v1.webp','Criatura anime de malware humorístico'),
  ('fun-raid-reunion-cinco-minutos','La reunión de cinco minutos se convirtió en raid','Entramos para decidir un color. Salimos con un nuevo sistema de diseño, tres portales y lore oficial.','SIDE QUEST COMPLETADA. OBJETIVO ORIGINAL: PENDIENTE.','Una party de diseñadores posa frente a una pizarra enorme; en una esquina todavía hay dos muestras de color.',array['meme','design','meeting'],'/assets/portal-fun-chaos-v2.webp','Portal de diversión con aura naranja y violeta'),
  ('fun-news-30-por-seccion','“Subamos algunas noticias”','El CMS abrió los ojos y recibió noventa expedientes con fuentes, imágenes y etiquetas.','ALGUNAS = 90 EN EL NEXUS.','Una biblioteca digital cae del cielo mientras el administrador intenta recordar dónde estaba el botón de guardar.',array['meme','cms','news'],'/assets/identity/memes-anime-chaos-v1.webp','Entidad digital de humor rodeada por contenido'),
  ('fun-jefe-uno-por-ciento','El jefe quedó en uno por ciento','La party ya festejaba. El jefe no había firmado el acuerdo.','VICTORIA PREMATURA DETECTADA.','La barra de vida parece vacía, aparece una fase nueva y alguien dice “yo sabía” con el micrófono abierto.',array['meme','gaming','boss'],'/assets/portal-fun-chaos-v2.webp','Mundo de humor gamer en naranja neón'),
  ('fun-mate-parche-nocturno','Mate, parche y una decisión dudosa','La frase “lo arreglo antes de dormir” activó automáticamente el amanecer.','HORA LOCAL: NO PREGUNTAR.','El monitor ilumina la habitación, el mate está vacío y un commit dice “final-final-ahora-si”.',array['meme','argentina','developer'],'/assets/identity/memes-anime-chaos-v1.webp','Caos digital anime con energía de la marca Xethkioz')
), numbered as (
  select editorial.*, row_number() over(order by slug) as position from editorial
), author as (
  select id from auth.users where lower(email)='xethkioz@gmail.com' limit 1
)
insert into public.news_articles (
  slug,title,summary,content,category,author_id,status,published_at,tags,source_urls,
  ai_generated,review_status,editor_notes,metrics,cover_image_url,cover_image_alt,cover_image_path
)
select slug,title,summary,
  jsonb_build_array(
    jsonb_build_object('type','heading','text','MEME_CORE // ESCENA'),
    jsonb_build_object('type','paragraph','text',scene),
    jsonb_build_object('type','quote','text',punchline),
    jsonb_build_object('type','paragraph','text','Meme original de XETHKIOZ. Compartilo desde la web y dejá que el caos encuentre otro chat.')
  ),'community',(select id from author),'published',
  timestamptz '2026-07-17 06:30:00-03'-((position-1)*interval '8 hours'),
  tags||array['xethkioz','fun','original'],array[]::text[],true,'approved',
  'Meme original XETHKIOZ 2026-07: copy propio, arte de identidad y revisión de tono.',
  jsonb_build_object('views',0,'likes',0,'shares',0),cover_image_url,cover_image_alt,cover_image_url
from numbered
on conflict(slug) do update set
  title=excluded.title,summary=excluded.summary,content=excluded.content,category=excluded.category,
  author_id=excluded.author_id,status=excluded.status,published_at=excluded.published_at,
  tags=excluded.tags,source_urls=excluded.source_urls,ai_generated=excluded.ai_generated,
  review_status=excluded.review_status,editor_notes=excluded.editor_notes,
  cover_image_url=excluded.cover_image_url,cover_image_alt=excluded.cover_image_alt,
  cover_image_path=excluded.cover_image_path,updated_at=now();

-- The old placeholder library is preserved for auditability but removed from public feeds.
update public.news_articles
set status='archived', published_at=null,
    editor_notes=concat_ws(' ',nullif(editor_notes,''),'Archivada al activar la biblioteca editorial XETHKIOZ 2026-07.'),
    updated_at=now()
where slug like '%-demo-%' and status='published';
