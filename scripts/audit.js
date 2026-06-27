import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const reportPath = join(rootDir, 'docs', 'QA', 'FUSION_ALPHA_2_5_CONSOLIDATED_AUDIT.md');

const startedAt = new Date();
const results = [];

const banner = (message) => {
  console.log('\n=================================================================');
  console.log(message);
  console.log('=================================================================\n');
};

const runStep = ({ name, command, args, requiredFiles = [] }) => {
  const missing = requiredFiles.filter((file) => !existsSync(join(rootDir, file)));

  if (missing.length > 0) {
    const detail = `Missing required file(s): ${missing.join(', ')}`;
    console.log(`[ FAILED  ] ${name}`);
    console.log(`           ${detail}\n`);
    results.push({ name, status: 'FAILED', detail });
    return false;
  }

  console.log(`[ RUNNING ] ${name}`);
  console.log(`           ${command} ${args.join(' ')}`);

  const run = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (run.status === 0) {
    console.log(`[ SUCCESS ] ${name}\n`);
    results.push({ name, status: 'SUCCESS', detail: `${command} ${args.join(' ')}` });
    return true;
  }

  const detail = `Exit code: ${run.status ?? 'unknown'}`;
  console.log(`[ FAILED  ] ${name}`);
  console.log(`           ${detail}\n`);
  results.push({ name, status: 'FAILED', detail });
  return false;
};

banner('🛡️  XETHKIOZ FUSION — AUDITORÍA CONSOLIDADA ALPHA 2.5');

const steps = [
  {
    name: 'Portal Registry',
    command: 'node',
    args: ['scripts/portal-registry-check.mjs'],
    requiredFiles: ['scripts/portal-registry-check.mjs']
  },
  {
    name: 'Fusion Safety',
    command: 'node',
    args: ['scripts/fusion-safety-check.mjs'],
    requiredFiles: ['scripts/fusion-safety-check.mjs']
  },
  {
    name: 'Live Candidate',
    command: 'node',
    args: ['scripts/live-candidate-check.mjs'],
    requiredFiles: ['scripts/live-candidate-check.mjs']
  },
  {
    name: 'HUD Persistence',
    command: 'node',
    args: ['scripts/hud-persistence-check.mjs'],
    requiredFiles: ['scripts/hud-persistence-check.mjs']
  },
  {
    name: 'Functionality Core',
    command: 'node',
    args: ['scripts/functionality-core-check.mjs'],
    requiredFiles: ['scripts/functionality-core-check.mjs']
  },
  {
    name: 'Wisp Engine',
    command: 'node',
    args: ['scripts/wisp-engine-check.mjs'],
    requiredFiles: ['scripts/wisp-engine-check.mjs']
  },
  {
    name: 'Media Assets',
    command: 'node',
    args: ['scripts/media-assets-review.mjs'],
    requiredFiles: ['scripts/media-assets-review.mjs']
  },
  {
    name: 'Code Structure',
    command: 'node',
    args: ['scripts/code-structure-review.mjs'],
    requiredFiles: ['scripts/code-structure-review.mjs']
  },
  {
    name: 'SQL Inventory',
    command: 'node',
    args: ['scripts/sql-inventory.mjs'],
    requiredFiles: ['scripts/sql-inventory.mjs']
  },
  {
    name: 'Production Build',
    command: 'npm',
    args: ['run', 'build'],
    requiredFiles: ['package.json', 'vite.config.ts']
  }
];

let allPassed = true;
for (const step of steps) {
  const passed = runStep(step);
  if (!passed) {
    allPassed = false;
    break;
  }
}

const finishedAt = new Date();
const summary = [
  '# XETHKIOZ Fusion Alpha 2.5 — Consolidated Audit',
  '',
  `- Started: ${startedAt.toISOString()}`,
  `- Finished: ${finishedAt.toISOString()}`,
  `- Result: ${allPassed ? 'PASS' : 'FAIL'}`,
  '',
  '## Checks',
  '',
  '| Check | Status | Detail |',
  '|---|---:|---|',
  ...results.map((result) => `| ${result.name} | ${result.status} | ${result.detail.replaceAll('|', '\\|')} |`),
  '',
  '## Gate',
  '',
  allPassed
    ? 'PASS — Plataforma estable para revisión, commit y despliegue.'
    : 'FAIL — Revisar logs antes de commitear o desplegar.',
  ''
].join('\n');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, summary, 'utf8');

if (allPassed) {
  banner('🎉 AUDITORÍA LIMPIA — Plataforma estable para Supabase, CMS y Live');
  process.exit(0);
}

banner('❌ AUDITORÍA CON ALERTAS — Revisar logs antes de hacer push');
process.exit(1);
