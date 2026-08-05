(() => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  loadScript('./app-core.js?v=20260804-1')
    .then(() => loadScript('./stats.js?v=20260804-1'))
    .catch((error) => console.error('No se pudo iniciar Huellas de Puan.', error));
})();
