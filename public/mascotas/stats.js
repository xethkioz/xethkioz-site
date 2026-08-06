(() => {
  const SUPABASE_URL = 'https://pascicauudfyydzknoop.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_';
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  const style = document.createElement('style');
  style.textContent = `
    /* Layout final del encabezado. Se aplica al final para evitar regresiones. */
    .top .header-row{
      width:min(1480px,calc(100% - 32px))!important;
      max-width:none!important;
      display:grid!important;
      grid-template-columns:max-content minmax(0,1fr) max-content!important;
      align-items:center!important;
      gap:18px!important;
      padding:0!important;
      overflow:visible!important;
    }
    .top .brand{min-width:142px!important;position:relative;z-index:2;gap:8px!important}
    .top .brand-mark{font-size:31px!important;line-height:1!important}
    .top .brand-text strong{font-size:1.32rem!important;line-height:.9!important}
    .top .brand-text small{font-size:.86rem!important}
    .top .nav{
      min-width:0!important;
      width:100%!important;
      display:flex!important;
      justify-content:flex-start!important;
      gap:2px!important;
      padding:7px 0!important;
      margin:0!important;
      overflow-x:auto!important;
      overflow-y:visible!important;
      scroll-padding-inline:8px!important;
      scrollbar-width:none!important;
    }
    .top .nav::-webkit-scrollbar{display:none!important}
    .top .nav button{flex:0 0 auto!important;padding:9px 10px!important;font-size:.86rem!important}
    .top .nav button:first-child{margin-left:0!important}
    .top .back{flex:0 0 auto!important;padding:10px 15px!important;font-size:.85rem!important}

    /* Recupera la identidad visual de las tarjetas principales. */
    .action-card{border:1px solid var(--line)!important;box-shadow:var(--shadow)!important}
    .action-lost{background:#fff0ed!important}
    .action-found{background:#eff6ea!important}
    .action-adopt{background:#f8effc!important}
    .action-cast{background:#fff4df!important}

    .community-stats{width:min(1120px,calc(100% - 30px));margin:0 auto 34px;padding:22px 24px;border:1px solid var(--line);border-radius:25px;background:linear-gradient(135deg,#f0f5e8,#fffdf8 58%,#fff3e6);box-shadow:var(--shadow)}
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

    @media(max-width:1180px){
      .top .header-row{grid-template-columns:1fr max-content!important;gap:8px 14px!important;padding:9px 0!important}
      .top .nav{grid-column:1/-1!important;grid-row:2!important;width:100%!important;padding:2px 0 5px!important}
      .top .back{grid-column:2!important;grid-row:1!important}
    }
    @media(max-width:800px){
      .community-stats-grid{grid-template-columns:1fr 1fr}
      .community-stats-head{align-items:flex-start;flex-direction:column}
    }
    @media(max-width:600px){
      .top .header-row{width:calc(100% - 20px)!important}
      .top .brand{min-width:0!important}
      .top .brand-mark{font-size:27px!important}
      .top .brand-text strong{font-size:1.12rem!important}
      .top .brand-text small{font-size:.74rem!important}
      .top .back{font-size:.7rem!important;padding:8px 9px!important}
      .top .nav button{font-size:.78rem!important;padding:8px 9px!important}
    }
    @media(max-width:480px){
      .community-stats{padding:18px 14px}
      .community-stats-grid{gap:8px}
      .community-stat{grid-template-columns:1fr;text-align:center;justify-items:center;min-height:126px;padding:13px 8px}
      .community-stat-icon{width:44px;height:44px}
      .community-stat span:last-child{font-size:.78rem}
    }
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

  const actions = document.querySelector('.actions');
  if (actions) actions.insertAdjacentElement('afterend', block);
  else document.querySelector('#inicio .content')?.prepend(block);

  const format = new Intl.NumberFormat('es-AR');
  function renderStats(stats) {
    ['visits', 'active_posts', 'reunited', 'adoptions'].forEach((key) => {
      const element = block.querySelector(`[data-stat="${key}"]`);
      if (element) element.textContent = format.format(Number(stats?.[key] || 0));
    });
  }

  async function requestStats(registerVisit) {
    const endpoint = registerVisit ? 'register_huellas_visit' : 'get_huellas_stats';
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${endpoint}`, {
      method: 'POST',
      headers,
      body: '{}',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Stats HTTP ${response.status}`);
    return response.json();
  }

  const sessionKey = 'huellas-visit-counted-v1';
  const shouldRegister = !sessionStorage.getItem(sessionKey);
  requestStats(shouldRegister)
    .then((stats) => {
      if (shouldRegister) sessionStorage.setItem(sessionKey, '1');
      renderStats(stats);
    })
    .catch((error) => {
      console.error('No se pudieron cargar las estadísticas de Huellas.', error);
      block.querySelector('.community-stats-live').textContent = 'Datos temporalmente no disponibles';
    });
})();
