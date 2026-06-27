# QA — Fusion Alpha 0.9 HUD Foundation

## Validado
- HUD global sigue fuera de las rutas.
- Sound ON/OFF persiste en `localStorage`.
- Volumen base persiste en `localStorage`.
- No se agregó audio real ni autoplay.
- Green Wisp no fue alterado.
- SQL/Supabase runtime no fue modificado.

## Comandos esperados
```bash
npm install
npm run audit:hud
npm run audit:wisp
npm run audit:fusion
npm run audit:architecture
npm run audit:inventory
npm run audit:sql
npm run build
```
