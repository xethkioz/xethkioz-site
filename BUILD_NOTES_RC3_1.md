# XETHKIOZ v4.0.0-rc.3.1 — Stability Recovery

Fecha: 2026-06-26

## Objetivo

Corregir la regresión detectada después de RC3:
- chat público no sincronizaba de forma confiable entre usuarios/dispositivos;
- algunas secciones podían quedar frágiles por carga diferida excesiva;
- Green Node quedó demasiado aislado del portal principal.

## Cambios grandes incluidos

### 1. Chat público
- Se agregó lectura periódica desde Supabase cada 2.5s como fallback real.
- Se mantiene Supabase Realtime cuando está disponible.
- Se mantiene BroadcastChannel para pestañas del mismo navegador.
- El envío ahora prioriza persistencia en `xeth_chat_messages`.
- Se agregó migración `20260626_rc31_public_chat_stabilization.sql`.

### 2. Navegación estable
- Las rutas principales vuelven a importarse de forma directa:
  - Home
  - Gaming
  - Tech
  - Science
  - News
  - Article
  - Streaming
  - Media
  - Community
  - Green Node
  - Network
  - AI Lab
- Las rutas secundarias/admin siguen con lazy loading.

### 3. Green Node
- Deja de funcionar como portal aislado.
- Recupera Header, Footer y WispPortal.
- Mantiene estética hacker/matriz verde.
- La navegación interna pasa a modo público dentro del layout general.

## Después de subir

1. Verificar build.
2. Deploy en Netlify.
3. Aplicar SQL RC3.1 en Supabase si el chat sigue sin sincronizar.
4. Probar chat con dos navegadores/dispositivos diferentes.
