// Renacer isolated preview — ESM handler. Do not merge into main.
export default async function handler(req, res) {
  try {
    const source = await fetch('https://at.adobe.com/CSGCmavYSr3202I9', { redirect: 'follow' });

    if (!source.ok) {
      res.status(502).send('No se pudo cargar el sitio de Renacer.');
      return;
    }

    const html = await source.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(html);
  } catch (error) {
    console.error('Renacer proxy error:', error);
    res.status(500).send('Error temporal al cargar el sitio de Renacer.');
  }
}