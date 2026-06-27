import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const rel = (file) => path.relative(root, file).replaceAll('\\\\', '/');

function listFiles(dir, extensions = ['.tsx', '.ts']) {
  const abs = path.join(root, dir);
  const out = [];
  if (!fs.existsSync(abs)) return out;
  function walk(current) {
    for (const item of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) walk(full);
      else if (extensions.includes(path.extname(item.name))) out.push(full);
    }
  }
  walk(abs);
  return out;
}

const app = read(path.join(root, 'src/App.tsx'));
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<([^\s/>]+)/g)].map((m) => ({ path: m[1], component: m[2] }));
const redirects = [...app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<Navigate\s+to="([^"]+)"/g)].map((m) => ({ from: m[1], to: m[2] }));
const pageFiles = listFiles('src/pages');
const componentFiles = listFiles('src/components');
const libFiles = listFiles('src/lib');

const publicRouteComponents = new Set(routes.map((r) => r.component));
const pageStatus = pageFiles.map((file) => {
  const base = path.basename(file, path.extname(file));
  const status = publicRouteComponents.has(base) ? 'PUBLIC_ROUTE' : 'LEGACY_OR_INTERNAL';
  return { file: rel(file), base, status };
});

const globalImports = ['Header', 'Analytics', 'ScrollToTop', 'AppErrorBoundary'];

console.log('# XETHKIOZ Fusion Architecture Audit');
console.log(`Generated: ${new Date().toISOString()}\n`);
console.log('## Public route map');
for (const route of routes) console.log(`- ${route.path} -> ${route.component}`);
console.log('');
console.log('## Legacy redirects');
for (const r of redirects) console.log(`- ${r.from} -> ${r.to}`);
console.log('');
console.log('## Global shell components');
for (const name of globalImports) console.log(`- ${name}`);
console.log('');
console.log('## Page classification');
for (const page of pageStatus) console.log(`- ${page.file} | ${page.status}`);
console.log('');
console.log('## Counts');
console.log(`- pages: ${pageFiles.length}`);
console.log(`- public route pages: ${pageStatus.filter((p) => p.status === 'PUBLIC_ROUTE').length}`);
console.log(`- legacy/internal pages: ${pageStatus.filter((p) => p.status === 'LEGACY_OR_INTERNAL').length}`);
console.log(`- components: ${componentFiles.length}`);
console.log(`- libs: ${libFiles.length}`);
console.log('');
console.log('## Safety decision');
console.log('- Do not delete legacy/internal files in current Fusion Alpha. They remain quarantined until Fusion 0.6/0.7 decides which modules are recovered, archived, or rewritten.');
console.log('- Public runtime must stay limited to Home, Gaming, Science, Fun, Green Node, global controls and safe redirects.');
