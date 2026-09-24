# VERSION POLICY — XETHKIOZ

## Línea activa

Versión actual de la web:

```text
v11.4.11
```

La versión declarada debe coincidir en:

- `package.json`
- `package-lock.json`
- `src/lib/siteConfig.ts`
- documentación operativa de release

## Convención

Se usa SemVer:

- `MAJOR`: cambios incompatibles de arquitectura o producto.
- `MINOR`: nuevas capacidades compatibles.
- `PATCH`: fixes, hardening, contenido, rendimiento o ajustes visuales compatibles.
- prereleases: `-alpha.N`, `-beta.N`, `-rc.N` cuando corresponda.

## Ramas

- `main`: producción estable.
- `feature/*`: funcionalidades.
- `fix/*`: correcciones.
- `security/*`: hardening.
- `content/*`: contenido editorial.
- `release/*`: preparación de release.
- `audit/*`: auditorías y saneamiento temporal.

Las ramas temporales deben eliminarse después de mergear o cerrarse/archivarse cuando ya no tengan valor de recuperación.

## Releases y tags

Cada versión estable publicada debe tener un tag `vX.Y.Z` y, cuando aporte trazabilidad útil, un GitHub Release con resumen y referencia al commit desplegado.

No reutilizar tags ni mantener políticas históricas v3/v4 como fuente de verdad activa.
