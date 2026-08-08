(() => {
  const VERSION = '20260808-2';
  const BASE_PATH = '/mascotas/';

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
      console.error('No se pudo iniciar Huellas de Puan.', error);
      const notice = document.createElement('div');
      notice.setAttribute('role', 'alert');
      notice.style.cssText = 'margin:16px auto;padding:14px;width:min(900px,calc(100% - 24px));border-radius:14px;background:#fff0ed;color:#9f2f24;font-weight:800;text-align:center';
      notice.textContent = 'No se pudieron iniciar las funciones del portal. Recargá la página en unos segundos.';
      document.querySelector('main')?.prepend(notice);
    });
})();