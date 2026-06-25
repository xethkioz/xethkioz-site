# CODING STANDARDS — XETHKIOZ v4.0

## Reglas

- TypeScript estricto donde sea posible.
- Componentes pequeños.
- Hooks fuera de componentes.
- Servicios separados de UI.
- Evitar lógica de Supabase dentro de componentes visuales.
- Documentar cambios grandes.
- No duplicar componentes.
- No agregar dependencias sin motivo.

## React

- Componentes en PascalCase.
- Hooks con prefijo `use`.
- Tipos en `src/types`.
- Configuración en `src/config`.

## Supabase

- Consultas en `src/services`.
- Tipos de DB centralizados.
- Validación de rol para admin.
