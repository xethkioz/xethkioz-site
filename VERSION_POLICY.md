# VERSION POLICY — XETHKIOZ

## Línea actual

La línea estable actual es **11.x**.

Versión de este pass:

```txt
11.4.11 — Repository Remediation · Pass 34
```

## SemVer

- `11.4.x`: correcciones, hardening, QA y mejoras compatibles.
- `11.5.0`: nuevas funciones compatibles dentro de Web 11.
- `12.0.0`: cambio mayor de arquitectura o experiencia pública.

No volver a crear releases nuevas bajo las líneas históricas v2, v3, v4 o v7.

## Fuente de verdad

La versión debe coincidir en:

- `package.json`
- `package-lock.json`
- `src/lib/siteConfig.ts`

Los documentos históricos pueden conservar su versión original, pero deben vivir bajo `docs/` o quedar claramente marcados como históricos.

## Git

- `main`: producción estable.
- `feature/*`, `fix/*`, `audit/*`, `security/*`: ramas temporales.
- `release/*`: sólo para una release explícita.
- ramas cerradas/mergeadas deben eliminarse cuando ya no sean necesarias.

Cada release estable debería crear un tag `vMAJOR.MINOR.PATCH` y una GitHub Release con resumen y rollback SHA.
