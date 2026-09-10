# WORLD OF XETHKIOZ — CURRENT STATE

**Fecha de corte:** 2026-09-10
**Estado:** FUENTE OPERATIVA DE PRODUCCIÓN

## 1. Alcance inmediato

La producción activa se concentra en **IZRDRALAR**. Desfralar y Xiomalar permanecen como expansiones posteriores; Zodnight permanece como cierre narrativo futuro de Saga I; Inframundo pertenece a Saga II y no entra en el scope del juego base.

## 2. Fuente de verdad

1. **Biblia Maestra v3.5**: canon maestro, sistemas y reglas de producción.
2. **Historia Final Canon v3.6**: continuidad narrativa y escenas; no amplía por sí sola el scope comercial inmediato.
3. **Este archivo CURRENT_STATE**: estado operativo actual y siguiente acción.
4. **GitHub**: fuente técnica viva.
5. **Google Drive**: respaldo documental, arte, builds y evidencia.

Ante contradicción de scope, prevalece la Biblia Maestra v3.5 hasta que exista un delta explícito aprobado.

## 3. Estado técnico real

- Motor: Godot 4.7.2.
- Runtime de producción previo: `game/xethkioz-v36-real-demo`.
- Scaffold técnico nuevo: cadena data-driven de **32 mapas de Izrdralar**, validada como PLAYER ONLY.
- Los 32 mapas actuales son estructura navegable/bootable, **no contenido terminado**.
- Character Core P01–P14: baseline RC1 validada por separado; todavía debe integrarse al runtime de mapas de Izrdralar.
- El mapa-chain PLAYER ONLY pasó CI de importación, runtime headless de los 32 nodos y export Windows.
- Un PASS de boot/runtime no equivale a gameplay, campaña ni gate visual terminado.

## 4. Regla de integración

No se toma la rama `game/izrdralar-map-chain-01-32-20260910` como nueva producción directa porque diverge de `game/xethkioz-v36-real-demo` y no contiene todos sus commits posteriores.

La integración oficial debe partir de la rama de producción más completa y portar el scaffold 01–32 sin perder sistemas, arte, escenas o QA ya incorporados.

## 5. Próximo bloque de producción

**IZRDRALAR M01–M05 — PRODUCTION PASS 01**

Objetivo: transformar los primeros cinco nodos del scaffold en un bloque de videojuego real.

Debe incluir progresivamente:
- geometría y rutas definitivas;
- terreno/biomas coherentes;
- Player P01;
- Xethkioz P02;
- NPC necesarios del tramo;
- enemigos y encounter real;
- interacción/contexto;
- secretos y señales de exploración;
- Boss 5 con telegraphs legibles;
- HUD;
- persistencia mínima;
- captura real 640×360;
- QA técnico + visual.

No se avanza a M06–M10 si M01–M05 conserva regresiones críticas o placeholders incompatibles con el gate definido.

## 6. Nomenclatura de builds

Mientras no se supere el Release Gate, los ejecutables se denominan **Internal Development Build** o **Internal Test Build**. La palabra **Demo** se reserva para una build que cumpla menú/creador, gameplay, arte, capturas, QA y presentación suficiente para evaluación pública.

## 7. Legacy y decisiones abiertas

- `MILO` es obsoleto; P14 vigente es **Mela**.
- P15 `La Sombra de Xethkioz` queda fuera del baseline activo hasta resolución de canon.
- Versiones pre-final de bloques se archivan en legacy y no compiten con el artefacto FINAL.
- Prototipos platform/survival antiguos no definen movimiento ni arquitectura actual.

## 8. Definition of Done inmediata para M01–M05

M01–M05 se considera cerrado cuando puede recorrerse como un bloque continuo, con entrada/salida válida, sin errores críticos, con Player y Xethkioz reconocibles, combate e interacción funcionales, Boss 5 implementado, persistencia mínima comprobada y capturas reales aprobadas.
