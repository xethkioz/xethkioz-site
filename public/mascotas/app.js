(() => {
  const VERSION = '20260806-1';

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const stabilizeHeader = () => {
    const header = document.querySelector('.top .header-row');
    const nav = document.querySelector('.top .nav');
    if (!header || !nav) return;

    if (!document.getElementById('huellas-header-stable')) {
      const style = document.createElement('style');
      style.id = 'huellas-header-stable';
      style.textContent = `
        .top .header-row{
          width:min(1480px,calc(100% - 32px))!important;
          max-width:none!important;
          margin-inline:auto!important;
          display:grid!important;
          grid-template-columns:max-content minmax(0,1fr) max-content!important;
          align-items:center!important;
          gap:18px!important;
          min-height:76px!important;
          padding:0!important;
          overflow:visible!important;
        }
        .top .brand{min-width:140px!important;flex:none!important;position:relative!important;z-index:2!important;}
        .top .nav{
          min-width:0!important;
          width:100%!important;
          display:flex!important;
          justify-content:flex-start!important;
          gap:2px!important;
          padding:7px 0!important;
          margin:0!important;
          overflow-x:auto!important;
          overflow-y:hidden!important;
          scroll-behavior:auto!important;
          scroll-padding-left:0!important;
          scrollbar-width:none!important;
        }
        .top .nav::-webkit-scrollbar{display:none!important;}
        .top .nav button{flex:0 0 auto!important;white-space:nowrap!important;padding:9px 10px!important;font-size:.86rem!important;}
        .top .back{flex:none!important;padding:10px 15px!important;font-size:.85rem!important;}
        @media (max-width:1180px){
          .top .header-row{grid-template-columns:1fr max-content!important;gap:8px 14px!important;padding:9px 0!important;}
          .top .nav{grid-column:1/-1!important;grid-row:2!important;}
          .top .back{grid-column:2!important;grid-row:1!important;}
        }
        @media (max-width:600px){
          .top .header-row{width:calc(100% - 20px)!important;}
          .top .brand{min-width:0!important;}
          .top .nav button{font-size:.78rem!important;padding:8px 9px!important;}
          .top .back{font-size:.7rem!important;padding:8px 9px!important;}
        }
      `;
      document.head.appendChild(style);
    }

    nav.scrollLeft = 0;
    requestAnimationFrame(() => { nav.scrollLeft = 0; });
    setTimeout(() => { nav.scrollLeft = 0; }, 100);
  };

  loadScript(`./app-core.js?v=${VERSION}`)
    .then(() => {
      stabilizeHeader();
      window.addEventListener('resize', stabilizeHeader, { passive: true });
      return loadScript(`./stats.js?v=${VERSION}`);
    })
    .then(stabilizeHeader)
    .catch((error) => console.error('No se pudo iniciar Huellas de Puan.', error));
})();