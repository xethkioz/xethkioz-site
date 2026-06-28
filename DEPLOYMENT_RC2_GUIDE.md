# XETHKIOZ RC2 Deployment Kit

Esta carpeta es la base limpia para poner ON la web de XETHKIOZ usando GitHub + Netlify.

## 1. Archivos que NO deben subirse

Nunca subas:

```txt
.env
node_modules/
dist/
.git/
*.tsbuildinfo
```

Ya están protegidos por `.gitignore`.

## 2. Archivo `.env` local

En la raíz de `Web_GITHUB`, el archivo debe llamarse exactamente:

```txt
.env
```

Debe contener:

```env
VITE_SUPABASE_URL=https://pascicauudfyydzknoop.supabase.co
VITE_SUPABASE_ANON_KEY=TU_PUBLISHABLE_KEY_DE_SUPABASE
```

Usar la `Publishable key` de Supabase. Nunca usar `Secret key` ni `service_role`.

## 3. Validación local antes de GitHub

Desde PowerShell, dentro de `Web_GITHUB`:

```powershell
npm ci
npm run deploy:check
```

Debe pasar:

```txt
audit:env PASS
audit:production-ready PASS
npm run build PASS
npm audit --omit=dev: 0 vulnerabilities
```

## 4. Subir a GitHub en rama segura

```powershell
git init
git remote add origin https://github.com/xethkioz/xethkioz-site.git
git checkout -b rc-live-final-candidate
git add .
git commit -m "RC-Live Final Candidate RC2 deployment kit"
git push -u origin rc-live-final-candidate --force
```

## 5. Netlify

En Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Branch preview: `rc-live-final-candidate`

Environment variables en Netlify:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

No poner `service_role`.

## 6. Rutas a probar en Deploy Preview

```txt
/
/gaming
/science
/fun
/green-node
/news
/community
/profile
/cms
/admin
```

Validar:

- no pantalla blanca;
- mobile correcto;
- consola sin errores rojos críticos;
- Supabase Auth responde;
- noticias no rompen layout;
- rutas no existentes van a NotFound y no crashean.

## 7. Pasar a producción

Solo cuando el Deploy Preview esté aprobado:

```powershell
git checkout main
git merge rc-live-final-candidate
git push origin main
```

Netlify desplegará producción desde `main`.


## RC2 Infrastructure Automation

Netlify y GitHub Actions deben ejecutar el mismo contrato:

```bash
npm run deploy:check
```

Variables obligatorias en Netlify y GitHub Actions:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Nunca configurar `SUPABASE_SERVICE_ROLE_KEY` en el frontend.
