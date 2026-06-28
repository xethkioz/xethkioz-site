# XETHKIOZ Windows Install Fix

Este paquete corrige dos problemas detectados en Windows:

1. `package-lock.json` ya no apunta al registry interno de OpenAI.
2. `production-ready-check.mjs` ahora usa `npm.cmd` en Windows para ejecutar sub-auditorías.

## Uso recomendado

Abrí PowerShell en la carpeta `Web_GITHUB` y ejecutá:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\windows-clean-install.ps1
```

Si Windows no puede borrar `node_modules` por `EPERM`, cerrá VS Code, Netlify CLI, servidores `npm run dev` y cualquier explorador abierto dentro de esa carpeta. Si sigue bloqueado, reiniciá la PC y repetí.

## Comandos manuales equivalentes

```powershell
npm config set registry https://registry.npmjs.org/
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Force tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
npm ci
npm run deploy:check
```
