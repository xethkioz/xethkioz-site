import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const sqlRoots = ['database/migrations', 'supabase/migrations', 'supabase'];
const tableRegex = /create\s+table\s+(?:if\s+not\s+exists\s+)?([\w.]+)/gi;
const policyRegex = /create\s+policy\s+([\s\S]*?)\s+on\s+([\w.]+)/gi;

function listSqlFiles(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  function walk(current) {
    for (const item of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) walk(full);
      else if (item.name.endsWith('.sql')) out.push(full);
    }
  }
  walk(abs);
  return out;
}

function classify(file) {
  const name = file.toLowerCase();
  if (name.includes('baseline') || name.endsWith('schema.sql')) return 'CORE';
  if (name.includes('cms') || name.includes('editorial') || name.includes('publishing') || name.includes('content')) return 'CMS';
  if (name.includes('chat') || name.includes('community') || name.includes('presence')) return 'COMMUNITY';
  if (name.includes('role') || name.includes('xp') || name.includes('badge') || name.includes('moderation')) return 'ROLES_XP';
  if (name.includes('science')) return 'SCIENCE';
  if (name.includes('green') || name.includes('wisp')) return 'GREEN_NODE';
  if (name.includes('news')) return 'NEWS';
  if (name.includes('layout') || name.includes('polish') || name.includes('audit')) return 'SUPPORT';
  return 'LEGACY_REVIEW';
}

const seenHashes = new Map();
const entries = [];
for (const dir of sqlRoots) {
  for (const abs of listSqlFiles(dir)) {
    const rel = path.relative(root, abs).replaceAll('\\', '/');
    const text = fs.readFileSync(abs, 'utf8');
    const hash = crypto.createHash('sha1').update(text).digest('hex').slice(0, 10);
    const tables = [...text.matchAll(tableRegex)].map((m) => m[1]);
    const policies = [...text.matchAll(policyRegex)].map((m) => m[2]);
    const duplicateOf = seenHashes.get(hash) || null;
    if (!seenHashes.has(hash)) seenHashes.set(hash, rel);
    entries.push({ rel, hash, duplicateOf, size: text.length, category: classify(rel), tables, policyCount: policies.length });
  }
}

const byCategory = new Map();
for (const e of entries) {
  if (!byCategory.has(e.category)) byCategory.set(e.category, []);
  byCategory.get(e.category).push(e);
}

console.log('# XETHKIOZ Fusion SQL Inventory');
console.log(`Generated: ${new Date().toISOString()}\n`);
console.log(`Total SQL files: ${entries.length}`);
console.log(`Duplicate content files: ${entries.filter((e) => e.duplicateOf).length}\n`);

for (const [category, files] of [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`## ${category}`);
  for (const e of files) {
    const dup = e.duplicateOf ? ` DUPLICATE_OF=${e.duplicateOf}` : '';
    console.log(`- ${e.rel} | sha=${e.hash} | tables=${e.tables.length} | policies=${e.policyCount}${dup}`);
    if (e.tables.length) console.log(`  - creates: ${e.tables.slice(0, 12).join(', ')}${e.tables.length > 12 ? ', ...' : ''}`);
  }
  console.log('');
}

console.log('## Safety notes');
console.log('- This report does not execute SQL.');
console.log('- Duplicate hashes indicate identical migration contents across database/ and supabase/.');
console.log('- Keep current migrations frozen until Supabase target schema is explicitly selected.');
