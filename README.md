# XETHKIOZ Network

**Versión actual:** `v4.0.0-rc.2.2`  
**Estado:** Release Candidate de estabilidad, arquitectura y preparación hacia v4 estable / base v5.

XETHKIOZ Network es un ecosistema tecnológico modular con portal principal de Gaming & Tech, Science Lab, Green Node, AI Lab, Creator Studio, CMS, comunidad, chat, roles, XP, Wisp y futura integración de noticias dinámicas.

## Módulos principales

- `/` — Home principal XETHKIOZ.
- `/gaming` — Gaming Hub.
- `/tech` — Tech Lab.
- `/science` — Science Lab, con enfoque más formal y profesional.
- `/network` — Hub del ecosistema XETHKIOZ Network.
- `/green-node` — Sección oculta/experimental de Linux, programación, ciberseguridad defensiva y análisis documental.
- `/ai-lab` — Laboratorio IA.
- `/creator-studio` — Centro de creación, streaming y planificación de contenido.
- `/cms` — CMS Studio.
- `/content-system` — Content OS.
- `/roles` — Roles, XP, escalafón y comunidad.
- `/milestones` — Plan de progreso y gobernanza.
- `/qa` — Panel de revisión final.

## Evolución por versiones

### v3.5 / v3.6 / v3.7
Base inicial del portal, comunidad, estructura editorial, autenticación y limpieza.

### v4.0 alpha.4
Portal PRO Polish + CMS Studio + Live Readiness.

### RC1.1
Inicio de XETHKIOZ Network, Science Lab y Green Node.

### RC1.2 - RC1.4
Pulido de Network, Wisp, Green Node, links, integridad visual y SQL inicial.

### RC1.5
Database Baseline y paneles de revisión.

### RC1.6
Content System + QA final.

### RC1.7
Aislamiento de Green Node, video hero y Science Lab formal.

### RC1.8
AI Lab + Creator Studio.

### RC1.9
Milestones + Data Governance.

### RC2.0 / RC2.1
Chat, presencia, Wisp evolucionable y documentación.

### RC2.2
Fix de estabilidad para evitar pantalla vacía: Safe Boot + Error Boundaries + Supabase tolerante.

## Instalación local

```powershell
cd "E:\Proyecto Xethkioz\Pagina Web\Web_GITHUB"
npm install
npm run build
npm run dev
```

Abrir:

```text
http://localhost:5173/
```

## Variables de entorno

Crear o mantener `.env` con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

La app trae fallback de desarrollo, pero producción debe usar variables reales en Netlify.

## Supabase / SQL

Las migraciones están en:

```text
supabase/migrations/
database/migrations/
```

Antes de producción estable se recomienda consolidar una baseline v4 definitiva.

## QA mínimo antes de subir

```powershell
npm run build
git status
```

Rutas a revisar:

```text
/
/network
/gaming
/tech
/science
/green-node
/ai-lab
/creator-studio
/cms
/content-system
/roles
/milestones
/qa
```

## Notas de estabilidad RC2.2

El objetivo principal fue evitar que un error de chat, presencia, Supabase Realtime o Wisp deje la web completamente vacía. Cada módulo crítico queda aislado para que el portal principal siga activo.

## Estado actual — v4.0.0-rc.2.3

**RC2.3 Content Ready UX Polish** consolida la etapa de estabilidad y prepara la carga real de contenido.

### Incluye

- Centro editorial visible en `/cms` y `/content-system`.
- Prioridades de contenido por portal.
- Carriles de publicación: noticia rápida, informe profundo, pack streaming y Green Node log.
- Gates de calidad para revisar antes de publicar.
- SQL incremental para slots editoriales, lanes y quality gates.
- Continuidad del fix de render de RC2.2.

### Comandos

```powershell
npm install
npm run build
npm run dev
```
