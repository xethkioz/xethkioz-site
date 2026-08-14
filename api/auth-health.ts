function hasValue(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

export default function handler(_request: any, response: any) {
  const serviceRoleReady = hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const supabaseUrlReady = hasValue(process.env.VITE_SUPABASE_URL) || hasValue(process.env.SUPABASE_URL)
  const publicConfigReady =
    supabaseUrlReady &&
    (hasValue(process.env.VITE_SUPABASE_ANON_KEY) || hasValue(process.env.SUPABASE_ANON_KEY))

  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({
    ok: true,
    release: '11.0.0',
    supabasePublicConfigReady: publicConfigReady,
    visitLoggingConfigured: supabaseUrlReady,
    visitLoggingBackend: serviceRoleReady ? 'vercel' : 'supabase-edge',
    serverRecoveryAvailable:
      serviceRoleReady &&
      hasValue(process.env.XETHKIOZ_ADMIN_RECOVERY_TOKEN),
    quoteProxyConfigured: publicConfigReady,
    note: 'Diagnostico de auth sin exponer claves ni valores privados.',
  })
}
