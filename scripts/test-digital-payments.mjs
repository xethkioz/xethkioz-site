import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const temp = await mkdtemp(join(tmpdir(), 'xethkioz-payments-'))
try {
  const outfile = join(temp, 'payments.test.mjs')
  await build({ entryPoints: ['tests/payments/payments.test.ts'], outfile, bundle: true, platform: 'node', target: 'node22', format: 'esm' })
  const result = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' })
  process.exitCode = result.status ?? 1
} finally {
  await rm(temp, { recursive: true, force: true })
}
