# Build Review — XETHKIOZ v4.0.0-rc.1.8

## Resultado

Build probado correctamente en entorno Linux del asistente tras reinstalar dependencias limpias.

```bash
npm install --ignore-scripts
npm run build
```

## Salida relevante

- Vite: 5.4.21
- Módulos transformados: 149
- Build: aprobado
- CSS: ~66.81 kB
- JS principal: ~370.62 kB

## Observaciones

- El ZIP final no incluye `.env`, `.git`, `node_modules`, `dist` ni `tsconfig.tsbuildinfo`.
- En Windows local se recomienda ejecutar:

```powershell
npm install
npm run build
npm run dev
```

## Rutas para revisar

- `/`
- `/network`
- `/ai-lab`
- `/creator-studio`
- `/science`
- `/green-node`
- `/cms`
- `/content-system`
- `/qa`
