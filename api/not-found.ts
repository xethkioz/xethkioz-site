function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export default function handler(request: any, response: any) {
  const rawUrl = typeof request?.url === 'string' ? request.url : '/'
  let pathname = '/'
  try {
    pathname = new URL(rawUrl, 'https://www.xethkioz.com.ar').pathname
  } catch {
    pathname = '/'
  }

  const safePath = escapeHtml(pathname.slice(0, 240))
  const html = `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="theme-color" content="#0A0A0F" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>404 · Señal no encontrada | XETHKIOZ</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0f;color:#f0f0f5;font-family:Inter,system-ui,sans-serif;padding:24px}main{width:min(720px,100%);border:1px solid rgba(139,92,246,.42);border-radius:28px;padding:clamp(28px,6vw,58px);background:radial-gradient(circle at 80% 0,rgba(139,92,246,.2),transparent 40%),rgba(5,5,9,.92);box-shadow:0 0 65px rgba(139,92,246,.16)}small{color:#ff8c42;font-weight:900;letter-spacing:.2em}h1{font-size:clamp(2rem,7vw,4.8rem);line-height:.95;margin:18px 0;text-transform:uppercase}p{color:#b8b8c7;line-height:1.7}.path{display:block;margin:22px 0;padding:12px 14px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#050507;color:#a78bfa;font:700 .78rem/1.5 ui-monospace,monospace;overflow-wrap:anywhere}a{display:inline-flex;margin-top:8px;border:1px solid #ff6b1a;border-radius:999px;padding:13px 18px;color:#fff;text-decoration:none;font-weight:900;letter-spacing:.08em}a:focus-visible{outline:3px solid #a855f7;outline-offset:4px}
  </style>
</head>
<body>
  <main>
    <small>XETHKIOZ // ERROR 404</small>
    <h1>Señal no encontrada</h1>
    <p>La ruta solicitada no existe o fue retirada de la Red de Portales.<br /><span lang="en">The requested route does not exist or was removed from the Portal Network.</span></p>
    <code class="path">${safePath}</code>
    <a href="/">VOLVER AL WORLD GATE</a>
  </main>
</body>
</html>`

  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Content-Language', 'es-AR')
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
  response.status(404).send(html)
}
