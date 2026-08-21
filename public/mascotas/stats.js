(() => {
  const style = document.createElement('style');
  style.textContent = `
    .community-stats{width:min(1120px,calc(100% - 30px));margin:34px auto;padding:22px 24px;border:1px solid var(--line);border-radius:25px;background:linear-gradient(135deg,#f0f5e8,#fffdf8 58%,#fff3e6);box-shadow:var(--shadow)}
    .community-stats-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin-bottom:18px}
    .community-stats-head h2{margin:0;font-size:clamp(1.6rem,3vw,2.25rem);line-height:1;color:var(--ink)}
    .community-stats-head p{margin:6px 0 0;color:var(--muted)}
    .community-stats-live{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:#e8f2df;color:#406028;font-size:.78rem;font-weight:900;white-space:nowrap}
    .community-stats-live::before{content:'';width:8px;height:8px;border-radius:50%;background:#5e923c;box-shadow:0 0 0 4px rgba(94,146,60,.13)}
    .community-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .community-stat{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;min-height:92px;padding:15px;border:1px solid rgba(79,116,47,.12);border-radius:18px;background:rgba(255,255,255,.78)}
    .community-stat-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:#f3eee4;font-size:1.55rem}
    .community-stat strong{display:block;font-size:clamp(1.45rem,2.5vw,2rem);line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}
    .community-stat span:last-child{display:block;margin-top:5px;color:var(--muted);font-size:.86rem;font-weight:750}
    .community-stats-note{margin:14px 0 0;color:var(--muted);font-size:.78rem;text-align:center}
    @media(max-width:800px){.community-stats-grid{grid-template-columns:1fr 1fr}.community-stats-head{align-items:flex-start;flex-direction:column}}
    @media(max-width:480px){.community-stats{padding:18px 14px}.community-stats-grid{gap:8px}.community-stat{grid-template-columns:1fr;text-align:center;justify-items:center;min-height:126px;padding:13px 8px}.community-stat-icon{width:44px;height:44px}.community-stat span:last-child{font-size:.78rem}}
  `;
  document.head.appendChild(style);

  const block = document.createElement('section');
  block.className = 'community-stats';
  block.setAttribute('aria-labelledby', 'community-stats-title');
  block.innerHTML = `
    <div class="community-stats-head">
      <div>
        <h2 id="community-stats-title">🐾 Nuestra comunidad</h2>
        <p>El impacto real de Huellas de Puan, actualizado automáticamente.</p>
      </div>
      <span class="community-stats-live">Datos en vivo</span>
    </div>
    <div class="community-stats-grid" aria-live="polite">
      <div class="community-stat"><span class="community-stat-icon">👀</span><div><strong data-stat="visits">—</strong><span>Visitas al portal</span></div></div>
      <div class="community-stat"><span class="community-stat-icon">📢</span><div><strong data-stat="active_posts">—</strong><span>Publicaciones activas</span></div></div>
      <div class="community-stat"><span class="community-stat-icon">❤️</span><div><strong data-stat="reunited">—</strong><span>Mascotas reunidas</span></div></div>
      <div class="community-stat"><span class="community-stat-icon">🏡</span><div><strong data-stat="adoptions">—</strong><span>Adopciones concretadas</span></div></div>
    </div>
    <p class="community-stats-note">Las cifras se generan a partir de visitas y publicaciones reales del portal.</p>
  `;

  const inicio = document.querySelector('#inicio');
  if (inicio) inicio.appendChild(block);

  const format = new Intl.NumberFormat('es-AR');
  function renderStats(stats) {
    ['visits', 'active_posts', 'reunited', 'adoptions'].forEach((key) => {
      const element = block.querySelector(`[data-stat="${key}"]`);
      if (element) element.textContent = format.format(Number(stats?.[key] || 0));
    });
  }

  async function requestStats(registerVisit, eventId) {
    const response = await fetch('/api/huellas-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registerVisit, eventId }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Stats HTTP ${response.status}`);
    return response.json();
  }

  const eventKey = 'huellas-visit-event-v2';
  const countedKey = 'huellas-visit-counted-v2';
  let eventId = sessionStorage.getItem(eventKey);
  if (!eventId) {
    eventId = crypto.randomUUID();
    sessionStorage.setItem(eventKey, eventId);
  }
  const shouldRegister = !sessionStorage.getItem(countedKey);
  requestStats(shouldRegister, eventId)
    .then((stats) => {
      if (shouldRegister && (stats.counted || stats.rateLimited)) sessionStorage.setItem(countedKey, '1');
      renderStats(stats);
    })
    .catch((error) => {
      console.error('No se pudieron cargar las estadísticas de Huellas.', error);
      const status = block.querySelector('.community-stats-live');
      if (status) status.textContent = 'Datos temporalmente no disponibles';
    });
})();
