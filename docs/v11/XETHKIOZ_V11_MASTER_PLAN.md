# XETHKIOZ v11 — MASTER PLAN

Fecha de inicio: 2026-08-13
Estado: AUDIT / FOUNDATION
Rama de trabajo: `v11-audit-20260813`
Punto de recuperación de código: `snapshot-20260813-pre-v11`
Commit productivo congelado: `54252877b671d42b8c8902646998a8857b5d2be4`

## 1. Idea central

XETHKIOZ v11 deja de ser una colección de páginas y pasa a funcionar como una **Red de Portales para la vida digital**.

Cinco verbos definen el producto:

1. **Explorar** — Gaming, COMICON, noticias y mundos digitales.
2. **Aprender** — ciencia, tecnología, programación y guías profundas.
3. **Protegerse** — Green Node Protect: seguridad, privacidad, estafas y salud digital.
4. **Crear** — Creación Web y herramientas prácticas.
5. **Conectarse** — Nexus City, perfiles y comunidad.

La home es un **World Gate**. No debe transformarse en un feed infinito ni duplicar el contenido de cada portal.

## 2. Contrato de cada portal

### HOME / WORLD GATE
**Para qué existe:** orientar en segundos y explicar qué es XETHKIOZ.

Debe mostrar los mundos principales, estado de la red, noticias destacadas, contacto y accesos rápidos. Nunca debe intentar contener el portal completo dentro del inicio.

### GAMING
**Idea principal:** videojuegos jugados y entendidos desde la experiencia real del jugador.

Contenido: noticias, MMORPG, supervivencia, shooters, lanzamientos, builds, configuraciones, rendimiento, guías, comunidad, streaming y señales de Asia.

### ARGENCIENCIA / CIENCIA & TECH
**Idea principal:** divulgación científica y tecnológica separada editorialmente de XETHKIOZ, conectada desde el World Gate.

XETHKIOZ puede enlazar y destacar contenido, pero no debe mezclar bases de datos ni arquitectura técnica con el proyecto independiente.

### UNIVERSO COMICON
**Idea principal:** cultura fan con profundidad, no sólo titulares.

Contenido: Marvel, DC, anime, manga, cine, series, cronologías, personajes, equipos, guías de lectura, fichas verificadas y el universo original XETHKIOZ / Dos Almas, Un Guerrero.

### HUELLAS DE PUAN
**Idea principal:** utilidad comunitaria local.

Contenido y herramientas: perdidos, encontrados, adopciones, castración, cuidados, fauna, contactos oficiales y publicaciones de la comunidad. Debe tener una ruta propia y no depender conceptualmente de `/fun`.

### GREEN NODE
**Idea principal:** enseñar a moverse por Internet con más seguridad y criterio, manteniendo el lenguaje visual de archivo clandestino.

Green Node v11 tendrá cuatro zonas:

- **PROTECT** — estafas, phishing, WhatsApp, contraseñas/passkeys, dispositivos, Wi-Fi público, compras, privacidad y recuperación.
- **RADAR** — vulnerabilidades, actualizaciones, Linux, Tor, navegadores, CERT/CISA/NIST y avisos con impacto explicado.
- **LAB** — Linux, open source, privacidad, redes, criptografía conceptual y terminal educativa que no ejecuta comandos reales.
- **VAULT 13** — dossiers, documentos, anomalías y misterios con Protocolo de Verdad: DOCUMENTADO / DISPUTADO / HIPÓTESIS / NO VERIFICADO / FICCIÓN.

`PROTECT`, `RADAR` y `LAB` deben poder ser públicos/indexables. `VAULT 13` puede conservar acceso narrativo y `noindex`.

### NEXUS CITY
**Idea principal:** capa social e identidad de XETHKIOZ.

Avatar, perfil, cápsula, salas, presencia, reputación, inventario y comunidad. Debe vivir en `/nexus-city` de verdad; Chaos Alley puede convertirse en un distrito del Nexus, no en un portal que compita con Huellas.

### CREACIÓN WEB
**Idea principal:** transformar la capacidad técnica de XETHKIOZ en un servicio comercial claro.

Debe ofrecer ejemplos, servicios, proceso, presupuestos, portfolio, preguntas frecuentes, contacto directo y pruebas de rendimiento/calidad.

### NEWS RADAR
**Idea principal:** capa editorial transversal.

No es un mundo independiente: agrega y organiza publicaciones de Gaming, Tech, AI, Science, COMICON, Green y Community con fuentes, actualización y trazabilidad.

## 3. Nuevo complemento: XETHKIOZ INTERNET SOS

No se crea otro portal en la home. Se integra dentro de **Green Node Protect** para evitar inflar la navegación.

MVP privacy-first:

1. Inspector local de URL: explica dominio, HTTPS, punycode, subdominios y señales de riesgo sin abrir el sitio.
2. Decodificador de QR local: muestra el destino antes de navegar.
3. Calculadora SHA-256 de archivos en el navegador: nunca sube el archivo.
4. Checklist de cuenta comprometida: correo, WhatsApp, redes, banco y recuperación.
5. Asistente anti-phishing: preguntas guiadas sin pedir contraseñas ni datos bancarios.
6. Guía de Wi-Fi público y compras online.
7. Guía de teléfono perdido/robado.
8. Limpieza de cuentas y aplicaciones zombie.
9. Centro de passkeys, MFA y gestores de contraseñas.
10. Estado de servicios: enlaces a páginas oficiales de estado, sin scraping peligroso.

Regla: una herramienta que pueda funcionar localmente debe funcionar localmente. XETHKIOZ no debe recolectar contraseñas, códigos 2FA, tarjetas, documentos ni contenido privado para estas utilidades.

## 4. Hallazgos P0 / P1

### P0 — coherencia y seguridad

- Home presenta Huellas pero utiliza `/fun` como acceso.
- `/fun` tiene shell SEO de Chaos Alley pero el runtime normal redirige a `/mascotas/`.
- `/nexus-city` redirige a `/fun#nexus-city` aunque `NexusCity.tsx` ya existe como página completa.
- Green Node recibe shell SEO genérico de Home y está bloqueado por `noindex` completo.
- `register_huellas_visit()` es `SECURITY DEFINER` y tiene ejecución pública, por lo que el contador puede inflarse desde fuera del navegador.
- `get_huellas_stats()` también es `SECURITY DEFINER` y público; requiere rediseñar privilegios/estadísticas.
- Protección de contraseñas filtradas de Supabase Auth está desactivada.

### P1 — calidad editorial / SEO

- 15 publicaciones legacy de humor/Fun están publicadas sin `source_urls` y aparecen en el sitemap editorial.
- Hay 155 publicaciones marcadas como generadas con asistencia de IA: v11 debe priorizar revisión humana, experiencia, fuentes y valor original por encima de volumen.
- Tech y Programming están claramente menos desarrollados que Gaming/Green.
- Huellas carece de un shell SEO completo equivalente a los portales React y conserva una atribución de imagen antigua que ya no coincide claramente con su recurso actual.
- Sitemap y arquitectura todavía reflejan `/fun` y no exponen Huellas como producto propio ni Nexus City como landing propia.

### P1 — rendimiento / mantenimiento

- `/public` pesa aproximadamente 27 MB.
- `public/videos/xethkioz-pixel-banner.mp4` pesa ~8.27 MB.
- Existen ocho MP4 y varios recursos de tamaño idéntico que deben verificarse por hash antes de deduplicar.
- El proyecto tiene 53 páginas TSX; sólo 23 están clasificadas como rutas públicas y 30 son legacy/internas.
- `src/index.css` todavía contiene decenas de tokens potencialmente no referenciados. Nunca borrar por heurística: validar con runtime y cobertura.
- El CSS específico de Huellas se enlaza desde shells generales aunque el portal es una experiencia estática separada.

### P1 — higiene de repositorio

El repositorio web contiene PRs abiertos de Factura Salud/Windows/Python. En v11, los productos técnicamente independientes deben abandonar el repo web y tener su propio ciclo de vida.

## 5. Contenido v11

### Regla editorial

No perseguir cantidad por sí sola. Cada pieza debe responder al menos una de estas preguntas:

- ¿Qué cambió?
- ¿Por qué importa?
- ¿Qué tiene que hacer el lector?
- ¿Cómo se comprueba?
- ¿Qué experiencia o criterio aporta XETHKIOZ que no sea un resumen genérico?

### Primer backlog de guías

Green Node / Internet SOS:
- Cómo detectar una suplantación de banco, empresa o gobierno.
- WhatsApp: verificación en dos pasos y recuperación.
- Qué hacer si perdés o te roban el celular.
- Cómo revisar un link antes de abrirlo.
- Comprar por Internet con menos riesgo.
- Wi-Fi público: qué hacer y qué evitar.
- Cómo cerrar cuentas y aplicaciones zombie.
- Phishing: del remitente al dominio real.
- Passkeys, MFA y gestores de contraseñas en 2026.
- Copias de seguridad contra ransomware.

Tech / Programming:
- Navegador lento: diagnóstico reproducible antes de reinstalar.
- Qué significa realmente HTTPS y qué no garantiza.
- DNS: qué es, cuándo cambiarlo y cómo volver atrás.
- WebP / AVIF / JPEG XL: criterios prácticos.
- Cómo verificar la integridad de una descarga con SHA-256.
- RLS de Supabase explicado con ejemplos seguros.
- CSP y cabeceras: qué protegen en una web moderna.
- Passkeys para desarrolladores: arquitectura y errores comunes.
- Checklist de despliegue Vite/React.
- Cómo medir Core Web Vitals sin perseguir un puntaje aislado.

## 6. Fases de implementación

### FASE 0 — Freeze, backup y evidencia
- [x] Congelar commit productivo.
- [x] Crear snapshot de código.
- [x] Crear snapshot editorial/config en Supabase sin datos privados.
- [x] Ejecutar deep audit automático.
- [ ] Crear manifest de restauración y prueba de recuperación.

### FASE 1 — Information Architecture
- [ ] Huellas apunta directamente a `/mascotas/`.
- [ ] `/fun` se redefine como alias/legacy o distrito Chaos Alley, no como Huellas.
- [ ] `/nexus-city` renderiza Nexus City directamente.
- [ ] Canonicals/SEO/sitemap reflejan el contrato real.
- [ ] Definir redirects permanentes y compatibilidad histórica.

### FASE 2 — Green Node 2.0
- [ ] Nueva navegación PROTECT / RADAR / LAB / VAULT 13.
- [ ] Landing pública y entendible en menos de 10 segundos.
- [ ] Vault conserva gate narrativo y protocolo de evidencia.
- [ ] Internet SOS MVP con herramientas client-side.
- [ ] Security Radar con fuente, fecha, severidad, impacto y “¿qué tengo que hacer?”.

### FASE 3 — Editorial Quality Engine
- [ ] Archivar 15 legacy Fun sin fuentes fuera del feed factual principal.
- [ ] Refuerzo Tech + Programming.
- [ ] Bloques “Cómo lo verificamos”, fuentes, fecha de revisión y changelog.
- [ ] Evitar páginas commodity creadas sólo por volumen.
- [ ] Nuevas guías con material visual propio y ejemplos reproducibles.

### FASE 4 — Performance / Media / CSS
- [ ] Hash de assets para deduplicación real.
- [ ] Optimizar videos grandes y definir presupuestos por portal.
- [ ] Carga de video sólo por interacción/visibilidad/reduced-motion/save-data.
- [ ] Depurar CSS sólo con evidencia de cobertura.
- [ ] Eliminar cargas globales específicas de portales aislados.

### FASE 5 — Nexus City
- [ ] Landing real en `/nexus-city`.
- [ ] Separar identidad social de Chaos Alley.
- [ ] Moderación, privacidad y límites antes de crecer funciones sociales.
- [ ] Vacíos de datos con UX real, no estadísticas inventadas.

### FASE 6 — Huellas 2.0
- [ ] Integración de ruta limpia.
- [ ] SEO/local metadata/schema adecuados.
- [ ] Revisión de contactos y fuentes oficiales.
- [ ] Rediseño de estadísticas para eliminar RPC de contador público.
- [ ] CAPTCHA/rate limiting para publicación si el volumen lo requiere.

### FASE 7 — Security / Database Hygiene
- [ ] Resolver RPC `SECURITY DEFINER` de Huellas.
- [ ] Activar leaked-password protection si el plan de Supabase lo permite.
- [ ] Revisar grants de funciones y defaults.
- [ ] Archivar antes de borrar.
- [ ] No eliminar índices sólo porque el advisor marque “unused”.
- [ ] Retención documentada para logs y datos temporales.

### FASE 8 — v11 Release Candidate
- [ ] CI completo verde.
- [ ] Playwright desktop + mobile.
- [ ] Axe sin violaciones críticas/serias.
- [ ] Lighthouse por portal y mobile, sin relajar budgets para aprobar.
- [ ] Cero advisories high/critical de producción.
- [ ] Revisión manual de enlaces, sitemap, robots, canonicals y redirects.
- [ ] Restore procedure documentado.
- [ ] Vercel preview READY antes de merge.
- [ ] Smoke test de producción después del deploy.

## 7. Definition of Done de XETHKIOZ v11

v11 no está terminado cuando “se ve nuevo”. Está terminado cuando:

- cada portal puede explicar su propósito en una frase;
- no hay dos rutas compitiendo por la misma identidad;
- una persona nueva entiende dónde entrar;
- Green Node resuelve problemas reales además de tener ambientación;
- el contenido tiene trazabilidad y valor propio;
- el sitio funciona con teclado, móvil, reduced motion y conexiones limitadas;
- los assets pesados están justificados y presupuestados;
- seguridad, privacidad, backup y rollback forman parte del producto;
- producción puede evolucionar sin depender de recordar manualmente qué archivo no tocar.
