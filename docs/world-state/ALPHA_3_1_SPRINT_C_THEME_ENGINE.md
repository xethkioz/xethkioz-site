# XETHKIOZ Alpha 3.1 — Sprint C: Theme Engine

## Objetivo

Crear un motor de temas globales para el Stage mundial, capaz de cambiar el entorno visual según el portal activo sin acoplarse a providers de negocio, Supabase, ProfileEngine o servicios externos.

## Archivos

```txt
src/engines/world/theme/themeTypes.ts
src/engines/world/theme/themeMatrix.ts
src/engines/world/theme/themeVariables.ts
src/engines/world/theme/ThemeEngineContext.tsx
src/engines/world/theme/index.ts
```

## Temas oficiales

```txt
gaming
scienceLab
greenNode
asiaGaming
studio
```

## API

```tsx
const { theme, config, cssVariables, motion, setTheme, cycleTheme } = useWorldTheme();
```

## Encapsulamiento

No modifica:

```txt
src/providers/
src/services/
src/engines/profile/
```

## Uso futuro

El siguiente sprint puede conectar `WorldThemeProvider` con el Stage:

```tsx
<WorldThemeProvider initialTheme="gaming">
  <WorldHeroStage />
</WorldThemeProvider>
```

Los componentes visuales podrán usar `cssVariables` en un contenedor root y `motion` para ajustar partículas, fog y velocidad sin disparar cálculos pesados.
