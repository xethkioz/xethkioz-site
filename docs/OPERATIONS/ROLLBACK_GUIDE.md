# XETHKIOZ Rollback Guide

## Netlify rollback rápido

1. Entrar a Netlify.
2. Abrir el proyecto XETHKIOZ.
3. Ir a `Deploys`.
4. Seleccionar el último deploy estable.
5. Elegir `Publish deploy`.

## Git rollback

Si el error fue introducido por un merge reciente:

```bash
git checkout main
git pull origin main
git revert <commit_sha>
git push origin main
```

## Reglas

- No borrar historial.
- No usar `reset --hard` en `main` compartido.
- Documentar el incidente en `docs/OPERATIONS/INCIDENT_LOG.md`.
