(() => {
  const VERSION = '20260925-argentina-1';
  const BASE_PATH = '/mascotas/';

  const careSection = document.querySelector('#cuidados');
  careSection?.setAttribute('data-knowledge-sector', 'pets');
  careSection?.classList.add('knowledge-sector');

  const performanceStyles = document.createElement('style');
  performanceStyles.textContent = '.knowledge-sector{content-visibility:auto;contain-intrinsic-size:auto 680px}.guide summary:focus-visible{outline:3px solid rgba(65,107,53,.42);outline-offset:5px;border-radius:8px}';
  document.head.appendChild(performanceStyles);

  const integrationCopy = document.querySelector('.footer-grid > div:nth-child(2) > p');
  if (integrationCopy) {
    fetch('/version.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const version = typeof payload?.version === 'string' ? payload.version.trim() : '';
        if (version) integrationCopy.textContent = `Argentina es la primera etapa de una red que podrá crecer internacionalmente. · XETHKIOZ v${version}.`;
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
