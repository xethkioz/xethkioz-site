module.exports = async function handler(req, res) {
  try {
    const source = await fetch('https://at.adobe.com/CSGCmavYSr3202I9', { redirect: 'follow' });
    if (!source.ok) {
      res.status(502).send('No se pudo cargar el sitio de Renacer.');
      return;
    }

    const html = Buffer.from(await source.arrayBuffer());
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error temporal al cargar el sitio de Renacer.');
  }
};