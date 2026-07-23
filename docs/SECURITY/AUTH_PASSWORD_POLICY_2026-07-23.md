# XETHKIOZ — Política de contraseñas

Fecha: 2026-07-23  
Issue relacionado: `#140`

## Estado de Supabase

La organización Supabase `xethkioz` usa actualmente el plan **Free**. La protección nativa contra contraseñas filtradas —basada en la API Pwned Passwords de Have I Been Pwned— está disponible únicamente en Supabase Pro o superior.

Por ese motivo, este cambio no afirma ni simula que Leaked Password Protection esté habilitada. Tampoco envía contraseñas, hashes ni fragmentos a servicios externos desde el navegador.

## Endurecimiento aplicado en la aplicación

Las contraseñas nuevas usadas en registro o recuperación/cambio deben cumplir:

- Mínimo 12 caracteres.
- Al menos una letra minúscula.
- Al menos una letra mayúscula.
- Al menos un número.
- Al menos un símbolo.

La política vive en `src/services/auth/passwordPolicy.ts` y es compartida por:

- `/account` para registro y actualización de contraseña.
- `XethkiozNexusAuth`.
- La pantalla legacy `CreatorAccount`, aunque actualmente no esté enlazada por el router.
- `AuthNexusService.signUp()`, que actúa como segunda barrera dentro de la arquitectura.

Esta barrera reduce el uso accidental de contraseñas débiles a través de las interfaces XETHKIOZ, pero no sustituye una regla de servidor frente a clientes que invoquen directamente Supabase Auth con la clave pública. El enforcement completo requiere configurar Auth en Supabase.

## Compatibilidad

El inicio de sesión no aplica retrospectivamente la política fuerte. Una cuenta existente puede seguir ingresando con su contraseña actual aunque sea anterior a esta regla. La política se exige cuando el usuario crea o modifica su contraseña.

## Accesibilidad

Los formularios muestran una lista de requisitos actualizada en vivo, conectada mediante `aria-describedby`, y marcan el campo con `aria-invalid` sólo cuando corresponde.

## Contratos automáticos

`audit:auth-nexus` verifica:

- Longitud mínima y clases de caracteres.
- Guardia dentro del servicio.
- Cobertura de todas las superficies conocidas de registro.
- Compatibilidad del login con cuentas existentes.
- Feedback accesible.

## Pendiente para cerrar #140

Actualizar Supabase a Pro o superior y activar manualmente **Authentication → Providers → Email → Prevent use of leaked passwords**. Después se debe volver a ejecutar Security Advisor y confirmar que desaparece `Leaked Password Protection Disabled`.
