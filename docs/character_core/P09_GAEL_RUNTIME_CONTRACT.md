# P09 — GAEL — CHARACTER CORE RUNTIME CONTRACT

Fecha: 2026-09-12
Estado: implementación funcional aislada / arte provisional.

## Canon protegido
- Edad: 7 años.
- Rol: Mentor de Precisión, Movilidad y Acecho.
- Afinidad: Viento / Acecho Místico.
- Vínculo: Kahezer.
- Heller/Kahezer y los demás Resonantes Primarios no se tratan como mascotas comunes.
- Kahezer no se instancia físicamente ni se adelanta su Convergencia en M01–M05.

## Estados funcionales
- `idle_stealth`
- `sprint_wind`
- `gale_blade`
- `shadow_veil`
- `kahezer_dash`
- `hurt`
- `downed` / recuperación temporal

## Contrato de movilidad y combate
`Sprint Wind` usa aceleración y movimiento físico; no teletransporta durante seguimiento normal.

`Shadow Veil` abre una ventana de evasión authored. Mientras dura, un impacto válido se resuelve como DODGE/MISS, no reduce HP y deja feedback verificable. Además prepara Precisión para el siguiente ataque válido.

`Kahezer Dash` sí respeta la ficha como desplazamiento instantáneo detrás del objetivo. Está limitado por alcance y usa `test_move` antes de cambiar posición; si la trayectoria/destino está bloqueada se cancela. El dash prepara Precisión y orienta a Gael hacia el objetivo desde la posición posterior.

`Gale Blade` afecta únicamente objetivos dentro de su alcance y abanico frontal. Una Precisión preparada por Veil/Dash convierte el siguiente Gale Blade válido en crítico garantizado y luego se consume. Sin Precisión usa daño base.

## QA
Gate dedicado: `Izrdralar P09 Gael Runtime Gate`.
Debe validar identidad, renderer provisional, sprint físico, Shadow Veil/DODGE, rechazo de dash fuera de alcance, blink detrás del objetivo, crítico consumible, cono de Gale Blade y hurt/downed/recovery.

## Visual
`P09_GAEL_PROTOTYPE_RENDERER_NOT_FINAL_ART`.
El renderer procedural es evidencia técnica; no constituye aprobación visual Pixel HD ni reemplaza la futura producción de sprites/animaciones.
