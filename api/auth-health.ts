function hasValue(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

export default function handler(_request: any, response: any) {
  const serviceRoleReady = hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY)

  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({
    ok: true,
    supabasePublicConfigReady:
      (hasValue(process.env.VITE_SUPABASE_URL) || hasValue(process.env.SUPABASE_URL)) &&
      (hasValue(process.env.VITE_SUPABASE_ANON_KEY) || hasValue(process.env.SUPABASE_ANON_KEY)),
    serverRecoveryAvailable:
      serviceRoleReady &&
      hasValue(process.env.XETHKIOZ_ADMIN_RECOVERY_TOKEN),
    quoteIntakeAvailable: serviceRoleReady,
    note: 'Diagnostico de auth sin exponer claves ni valores privados.',
  })
}
