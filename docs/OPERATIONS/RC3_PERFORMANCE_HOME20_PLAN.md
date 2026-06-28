# XETHKIOZ RC3 Performance + Home 2.0 Plan

## Estado

Rama de trabajo: `rc3-performance-home-2`
Base: `main` posterior a RC2 Infrastructure.
Objetivo: mejorar rendimiento, estructura de carga y experiencia inicial sin romper el Core LIVE.

## Reglas de seguridad

- No modificar directamente `main`.
- Todo cambio debe pasar `npm run deploy:check`.
- No exponer `.env`, `service_role`, `sb_secret` ni claves privadas.
- Mantener compatibilidad con Supabase Auth, RLS, RuntimeBridge, EventBus y Netlify.
- Evitar refactors masivos sobre Runtime/Core salvo que sean estrictamente necesarios.

## Objetivos RC3

1. Reducir peso de carga inicial.
2. Preparar lazy loading de páginas y módulos pesados.
3. Mejorar la Home como portal principal.
4. Mantener Lighthouse objetivo > 95 en producción.
5. Preparar una base visual escalable para futuros portales del ecosistema.

## Backlog inicial

### Performance

- Revisar `src/App.tsx` para detectar imports directos de páginas.
- Aplicar `React.lazy` y `Suspense` donde sea seguro.
- Separar módulos pesados del bundle principal.
- Revisar CSS global y oportunidades de reducción.
- Verificar assets de video e imágenes públicas.

### Home 2.0

- Definir estructura: Hero, tendencias, noticias destacadas, portales, streams, comunidad.
- Mantener identidad visual XETHKIOZ: negro, violeta neón, naranja eléctrico.
- Evitar cambios que rompan rutas existentes.
- Crear componentes reutilizables y compatibles con CMS futuro.

### QA

- Ejecutar `npm run deploy:check` antes de abrir PR.
- Validar Netlify Deploy Preview.
- Confirmar que `xethkioz.com.ar` queda estable después del merge.

## Entregable esperado

PR RC3 con cambios incrementales, medibles y reversibles.
