const headers = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Type': 'application/json; charset=utf-8',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

Deno.serve(() => new Response(JSON.stringify({
  ok: false,
  error: 'ENDPOINT_RETIRED',
  replacement: '/api/visit-log',
}), {
  status: 410,
  headers,
}))
