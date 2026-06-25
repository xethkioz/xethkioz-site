# XETHKIOZ v4.0 RC1.2 — Network Polish Review

## Objetivo

Refinar la base de XETHKIOZ Network sin romper la web clásica. Esta revisión agrega una capa más madura para Science Lab y Green Node antes de seguir con contenido dinámico real.

## Cambios principales

- Green Node: terminal interactiva mock con comandos `whoami`, `sudo truth`, `matrix`, `42`, `protocol` y `clear`.
- Green Node: wisp flotante más orgánico con cola visual y portal con vortex antes de entrar al nodo.
- Green Node: protocolo editorial visible para mantener enfoque educativo/documental.
- Science Lab: matriz editorial formal con fuente, evidencia, trazabilidad y revisión.
- Science Lab: checklist de publicación científica antes de publicar informes.
- Supabase: nueva migración RC1.2 para comandos Green Node, fuentes de evidencia científica y eventos de portales.
- Versionado: actualización a `4.0.0-rc.1.2`.

## Revisión técnica

- No se agregó ninguna dependencia nueva.
- Se mantiene React + Vite + TypeScript.
- Green Node sigue como sección oculta accesible por wisp y ruta `/green-node`.
- Science Lab mantiene estilo formal separado del portal gamer/tech.
- SQL mantiene RLS activa y políticas públicas solo para lectura segura.

## Pendientes antes de v4.0 estable

- Conectar Green Node terminal a Supabase para registrar logs y desbloqueos reales.
- Conectar Science Lab con informes reales desde CMS.
- Reemplazar contenidos mock por artículos editoriales propios o fuentes externas atribuidas.
- Probar responsive móvil completo del portal y de Green Node.
- Probar overlay OBS con una escena real.
