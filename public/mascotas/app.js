(() => {
  const VERSION = '20260929-nature-43';
  const BASE_PATH = '/mascotas/';

  const stableHeader = document.createElement('style');
  stableHeader.id = 'huellas-header-prepaint';
  stableHeader.textContent = `
    .top .header-row{width:min(1900px,calc(100% - 20px))!important;max-width:none!important;display:grid!important;grid-template-columns:max-content minmax(0,1fr) max-content max-content!important;align-items:center!important;gap:8px!important;padding:0!important;overflow:visible!important}
    .top .brand{min-width:142px!important;position:relative!important;z-index:2!important;gap:8px!important}
    .top .brand-mark{font-size:31px!important;line-height:1!important}
    .top .brand-text strong{font-size:1.32rem!important;line-height:.9!important}
    .top .brand-text small{font-size:.86rem!important}
    .top .nav{min-width:0!important;width:100%!important;display:flex!important;justify-content:center!important;gap:1px!important;padding:7px 0!important;margin:0!important;overflow-x:auto!important;overflow-y:visible!important;scroll-padding-inline:8px!important;scrollbar-width:none!important}
    .top .nav::-webkit-scrollbar{display:none!important}
    .top .nav button{flex:0 0 auto!important;padding:8px 8px!important;font-size:.74rem!important}
    .top .header-publish{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:40px!important;padding:8px 13px!important;font-size:.74rem!important;white-space:nowrap!important}
    .top .back{flex:0 0 auto!important;padding:8px 12px!important;font-size:.74rem!important;white-space:nowrap!important}
    @media(max-width:1560px){.top .header-row{grid-template-columns:1fr max-content max-content!important;gap:8px 12px!important;padding:7px 0!important}.top .brand{grid-column:1!important;grid-row:1!important}.top .header-publish{grid-column:2!important;grid-row:1!important}.top .back{grid-column:3!important;grid-row:1!important}.top .nav{grid-column:1/-1!important;grid-row:2!important;width:100%!important;justify-content:flex-start!important;padding:2px 0 5px!important}}
    @media(max-width:600px){.top .header-row{width:calc(100% - 20px)!important;grid-template-columns:1fr max-content!important}.top .brand{min-width:0!important}.top .brand-mark{font-size:27px!important}.top .brand-text strong{font-size:1.12rem!important}.top .brand-text small{font-size:.74rem!important}.top .header-publish{display:none!important}.top .back{grid-column:2!important;grid-row:1!important;font-size:.7rem!important;padding:8px 9px!important}.top .nav{grid-column:1/-1!important;grid-row:2!important}.top .nav button{font-size:.78rem!important;padding:8px 9px!important}}
  `;
  document.head.appendChild(stableHeader);

  const careSection = document.querySelector('#cuidados');
  careSection?.setAttribute('data-knowledge-sector', 'pets');
  careSection?.classList.add('knowledge-sector');

  const performanceStyles = document.createElement('style');
  performanceStyles.textContent = '.knowledge-sector{content-visibility:auto;contain-intrinsic-size:auto 680px}.guide summary:focus-visible{outline:3px solid rgba(79,116,47,.42);outline-offset:5px;border-radius:8px}';
  document.head.appendChild(performanceStyles);

  const integrationCopy = document.querySelector('.footer-grid > div:nth-child(2) > p');
  if (integrationCopy) {
    integrationCopy.textContent = 'Proyecto comunitario independiente integrado a XETHKIOZ.';
    fetch('/version.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const version = typeof payload?.version === 'string' ? payload.version.trim() : '';
        if (version) integrationCopy.textContent = `Proyecto comunitario independiente integrado a XETHKIOZ v${version}.`;
      })
      .catch(() => {});
  }

  const loadScript = (file) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${BASE_PATH}${file}?v=${VERSION}`;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${file}`));
    document.head.appendChild(script);
  });

  loadScript('app-core.js')
    .then(() => loadScript('stats.js'))
    .catch((error) => {
      console.error('No se pudo iniciar Huellas Argentina.', error);
      const notice = document.createElement('div');
      notice.setAttribute('role', 'alert');
      notice.style.cssText = 'margin:16px auto;padding:14px;width:min(900px,calc(100% - 24px));border-radius:14px;background:#fff0ed;color:#9f2f24;font-weight:800;text-align:center';
      notice.textContent = 'No se pudieron iniciar las funciones del portal. Recargá la página en unos segundos.';
      document.querySelector('main')?.prepend(notice);
    });
})();