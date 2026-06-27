import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = ['src/pages', 'src/components', 'src/lib', 'database/migrations', 'supabase/migrations'];
const ignore = new Set(['node_modules', 'dist', '.git']);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  function walk(current) {
    for (const item of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (ignore.has(item.name)) continue;
      const full = path.join(current, item.name);
      if (item.isDirectory()) walk(full);
      else out.push(path.relative(root, full).replaceAll('\\\\', '/'));
    }
  }
  walk(path.join(root, dir));
  return out;
}

const sections = targets.map((dir) => ({ dir, files: listFiles(dir) }));
console.log('# XETHKIOZ Fusion Inventory');
console.log(`Generated: ${new Date().toISOString()}\n`);
for (const section of sections) {
  console.log(`## ${section.dir}`);
  if (!section.files.length) console.log('- No files found.');
  for (const file of section.files) console.log(`- ${file}`);
  console.log('');
}
