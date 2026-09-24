# SECURITY — XETHKIOZ 11.4

## Principios

- secretos exclusivamente en proveedores de runtime;
- RLS y mínimo privilegio en Supabase;
- autorización administrativa validada en servidor;
- CMS no indexable y protegido por rol;
- CSP, HSTS y headers defensivos;
- consentimiento previo para analítica;
- validación y límites de tamaño en endpoints;
- material privado de World of Xethkioz fuera del repositorio público.

## Variables

Variables públicas permitidas:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Secretos de servidor:

```text
SUPABASE_SERVICE_ROLE_KEY
XETHKIOZ_ADMIN_RECOVERY_TOKEN
HUGGINGFACE_API_KEY
```

Los secretos de servidor nunca deben usar prefijo `VITE_`.

## Estado del repositorio

El árbol actual no debe contener:

- `.env` reales;
- claves privadas;
- credenciales;
- `node_modules`;
- `dist`;
- assets privados del proyecto de juego.

El `.gitignore` protege estas categorías y las auditorías de build verifican parte de este contrato.

## Controles activos

- Supabase RLS.
- roles de usuario/editor/moderador/admin.
- helpers privilegiados en esquema privado.
- auditoría de dependencias.
- auditorías de auth, sesión, telemetría y comunidad.
- CSP/HSTS.
- `security.txt`.
- noindex para CMS, cuenta, perfil y API.
- sanitización y validación de entradas.
- rate limiting básico en endpoints serverless.

## Pendientes de hardening

- proteger `main` y exigir status checks;
- reducir `'unsafe-inline'` en CSP;
- mover rate limiting sensible a almacenamiento durable;
- mantener Actions y dependencias actualizadas;
- revisar periódicamente historial y artefactos por exposición accidental.
