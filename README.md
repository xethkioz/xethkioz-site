# XETHKIOZ v4.0 Master Project

**Estado:** paquete de transición hacia XETHKIOZ v4.0  
**Fecha:** 2026-06-25  
**Rama recomendada:** `release/v4.0`  
**Repositorio:** https://github.com/xethkioz/xethkioz-site  
**Dominio:** https://xethkioz.com.ar

## Objetivo

Convertir XETHKIOZ en un ecosistema profesional para:

- Noticias
- Gaming
- Tecnología
- IA
- Ciencia
- Comunidad
- Streaming
- CMS propio
- Administración
- SEO
- Automatizaciones

## Estado del paquete

Este ZIP contiene una versión limpia del proyecto actual, preparada para iniciar el trabajo v4.0.

Se excluyeron archivos que no deben distribuirse ni versionarse:

- `node_modules/`
- `dist/`
- `.git/`
- `.env`
- `.env.local`
- `*.tsbuildinfo`

## Instalación

```bash
npm install
npm run build
npm run dev
```

Abrir:

```txt
http://localhost:5173
```

## Próximo paso recomendado

```bash
git switch -c feature/v4-audit
```

Luego comenzar con la auditoría documentada antes de agregar funciones nuevas.
