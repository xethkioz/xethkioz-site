-- Editorial depth pass 01: replace the compressed launch brief with a developed dossier.
-- This migration is intentionally idempotent and preserves the official primary source.

update public.news_articles
set
  summary = 'Grinding Gear Games confirmó el 24 de julio como fecha de apertura de Curse of Allflame. La señal ordena el calendario de la comunidad, pero todavía exige verificar horario regional, descarga, mantenimiento y notas finales antes de entrar a la liga.',
  content = jsonb_build_array(
    jsonb_build_object(
      'type', 'heading',
      'text', 'La señal que abrió el portal'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'Grinding Gear Games fijó el 24 de julio como fecha de lanzamiento de Curse of Allflame y reunió en su publicación oficial el punto de referencia para el inicio de la nueva etapa. No es una filtración, una fecha recuperada de una tienda ni una captura sin contexto: la confirmación proviene del canal del propio estudio y enlaza la presentación de la expansión.'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'Para quienes siguen Path of Exile, una fecha así funciona como el encendido de una ciudad antes de una temporada. Empiezan a moverse las parties, los filtros, las ideas de build y el tiempo disponible. También crece el ruido: predicciones presentadas como hechos, guías todavía incompletas y expectativas construidas antes de conocer todos los cambios.'
    ),
    jsonb_build_object(
      'type', 'heading',
      'text',
      'Qué está confirmado y qué todavía no'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'La información confirmada es la fecha anunciada por GGG y la existencia de una presentación oficial de contenidos. Eso permite marcar el calendario y seguir el canal correcto. No alcanza, por sí solo, para asegurar la hora exacta en cada región, la duración de un eventual mantenimiento, el tamaño final de la descarga o el comportamiento del servidor durante las primeras horas.'
    ),
    jsonb_build_object(
      'type', 'quote',
      'text',
      'Una fecha oficial abre la misión. Las notas de parche, el cliente actualizado y el estado del servidor deciden cómo empieza de verdad.'
    ),
    jsonb_build_object(
      'type', 'heading',
      'text',
      'Por qué importa para la comunidad'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'El comienzo de una liga concentra a veteranos, jugadores que regresan y personas que entran por primera vez. Tener una referencia primaria evita organizarse alrededor de rumores y permite separar dos conversaciones diferentes: la emoción por el universo de Allflame y las decisiones prácticas necesarias para jugar sin transformar el estreno en una obligación.'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'Si vas a jugar en grupo, conviene acordar de antemano región, horario, objetivo y tolerancia a las colas. Si vas solo, preparar espacio en disco, actualizar el cliente y guardar una alternativa para las primeras horas reduce frustración. Ninguna carrera de temporada justifica sacrificar descanso, seguridad de la cuenta o compras impulsivas.'
    ),
    jsonb_build_object(
      'type', 'heading',
      'text',
      'Lectura XETHKIOZ'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'Curse of Allflame encaja con la identidad del Nexus: fuego, amenaza y un mundo que vuelve a encenderse cuando miles de jugadores cruzan el portal al mismo tiempo. Pero el hype funciona mejor cuando conserva un suelo firme. La misión recomendada es simple: seguir la publicación de GGG, esperar la información operativa final y llegar con expectativas reales.'
    ),
    jsonb_build_object(
      'type', 'paragraph',
      'text',
      'Marcá el 24 de julio, prepará tu ritual y dejá espacio para que la liga sorprenda. La primera victoria no es entrar antes que todos: es comenzar con el cliente listo, la cuenta protegida y ganas de descubrir el sistema sin convertir una guía prematura en ley.'
    )
  ),
  editor_notes = 'Depth pass 01: artículo desarrollado desde la fuente primaria de GGG; se amplió contexto sin agregar horarios, mecánicas ni promesas no confirmadas.',
  updated_at = now()
where slug = 'gaming-poe-allflame-july-24';

-- Remove the duplicated editorial checklist from the first library batch.
-- Provenance remains visible in source_urls and in the article trust line.
update public.news_articles
set content = coalesce((
  select jsonb_agg(block order by ordinal)
  from jsonb_array_elements(content) with ordinality as item(block, ordinal)
  where not (
    block->>'type' = 'list'
    and lower(block->>'text') like '%fuente primaria%'
    and lower(block->>'text') like '%límite%'
  )
), '[]'::jsonb), updated_at = now()
where slug like 'gaming-%'
   or slug like 'science-%'
   or slug like 'tech-%'
   or slug like 'green-%';
