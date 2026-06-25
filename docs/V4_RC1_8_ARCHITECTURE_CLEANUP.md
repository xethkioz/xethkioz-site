# XETHKIOZ v4.0 RC1.8 — Architecture Cleanup + AI Lab + Creator Studio

Fecha: 2026-06-25
Base anterior: v4.0.0-rc.1.7

## Objetivo

Consolidar XETHKIOZ Network como ecosistema modular antes de seguir cargando contenido real y automatizaciones.

## Cambios incluidos

- Se agrega `/ai-lab` como división dedicada a IA, prompts, automatización editorial y control humano.
- Se agrega `/creator-studio` como división de streaming, OBS, audio, video, clips, shorts y herramientas de creación.
- Se actualiza el mapa de XETHKIOZ Network para que AI Lab y Creator Studio dejen de depender de rutas genéricas.
- Se actualiza navegación secundaria y footer.
- Se mantiene Green Node como nodo especial/oculto con acceso por Wisp/EGG, no como navegación principal.
- Se deja preparada una migración SQL RC1.8 para registrar los nuevos módulos, rutas y reglas editoriales.

## Reglas de arquitectura

1. Cada portal debe poder evolucionar con identidad propia.
2. El login, roles, XP, CMS, usuarios y Supabase siguen siendo compartidos.
3. Green Node y Science Lab deben mantenerse visualmente aislados del portal principal.
4. AI Lab no publica automáticamente: genera borradores y sugerencias para revisión humana.
5. Creator Studio centraliza producción, redes, streaming y recursos audiovisuales.

## Rutas nuevas

- `/ai-lab`
- `/creator-studio`

## Rutas principales para QA

- `/`
- `/network`
- `/gaming`
- `/science`
- `/green-node`
- `/ai-lab`
- `/creator-studio`
- `/cms`
- `/content-system`
- `/qa`

## Próxima etapa sugerida

RC1.9 debería enfocarse en:

- Cargar contenido real inicial por división.
- Conectar CMS con Supabase.
- Preparar seeds oficiales.
- Convertir noticias externas en radar con atribución.
- Mejorar responsive móvil de Network, Science Lab y Green Node.
