import type { VercelRequest, VercelResponse } from '@vercel/node'

function hasValue(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

export default function handler(_request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    ok: true,
    supabaseUrl: hasValue(process.env.VITE_SUPABASE_URL) || hasValue(process.env.SUPABASE_URL),
    publicAnonKey: hasValue(process.env.VITE_SUPABASE_ANON_KEY) || hasValue(process.env.SUPABASE_ANON_KEY),
    serviceRoleKey: hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
    recoveryToken: hasValue(process.env.XETHKIOZ_ADMIN_RECOVERY_TOKEN),
    note: 'serviceRoleKey y recoveryToken deben estar en Vercel para operar recuperación admin segura.',
  })
}
