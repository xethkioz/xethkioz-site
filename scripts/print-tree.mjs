import fs from 'node:fs';
import path from 'node:path';

const ignore = new Set(['node_modules', 'dist', '.git', '.vscode', '.idea']);
function walk(dir, prefix = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(item => !ignore.has(item.name))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
  for (const [index, item] of items.entries()) {
    const isLast = index === items.length - 1;
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${item.name}${item.isDirectory() ? '/' : ''}`);
    if (item.isDirectory()) {
      walk(path.join(dir, item.name), `${prefix}${isLast ? '    ' : '│   '}`);
    }
  }
}
console.log(path.basename(process.cwd()) + '/');
walk(process.cwd());
