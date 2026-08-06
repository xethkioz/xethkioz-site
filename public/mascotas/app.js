(() => {
  const VERSION = '20260806-2';

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const installStableHeader = () => {
    const nav = document.querySelector('.top .nav');
    if (!nav) return;

    if (!document.getElementById('huellas-header-two-rows')) {
      const style = document.createElement('style');
      style.id = 'huellas-header-two-rows';
      style.textContent = `
        .top .header-row{
          width:min(1480px,calc(100% - 32px))!important;
          max-width:none!important;
          margin:0 auto!important;
          display:grid!important;
          grid-template-columns:1fr max-content!important;
          grid-template-rows:auto auto!important;
          align-items:center!important;
          gap:6px 18px!important;
          padding:10px 0 8px!important;
          min-height:0!important;
          overflow:visible!important;
        }
        .top .brand{
          grid-column:1!important;
          grid-row:1!important;
          min-width:0!important;
          justify-self:start!important;
          position:relative!important;
          z-index:2!important;
        }
        .top .back{
          grid-column:2!important;
          grid-row:1!important;
          justify-self:end!important;
          flex:none!important;
          padding:9px 14px!important;
          font-size:.82rem!important;
        }
        .top .nav{
          grid-column:1/-1!important;
          grid-row:2!important;
          width:100%!important;
          min-width:0!important;
          display:flex!important;
          align-items:center!important;
          justify-content:center!important;
          flex-wrap:wrap!important;
          gap:4px!important;
          margin:0!important;
          padding:2px 0 0!important;
          overflow:visible!important;
          scroll-behavior:auto!important;
        }
        .top .nav button{
          flex:0 0 auto!important;
          white-space:nowrap!important;
          padding:8px 10px!important;
          font-size:.84rem!important;
        }
        @media (max-width:900px){
          .top .nav{
            justify-content:flex-start!important;
            flex-wrap:nowrap!important;
            overflow-x:auto!important;
            overflow-y:hidden!important;
            scrollbar-width:none!important;
          }
          .top .nav::-webkit-scrollbar{display:none!important;}
        }
        @media (max-width:600px){
          .top .header-row{width:calc(100% - 20px)!important;padding:8px 0 6px!important;}
          .top .brand-mark{font-size:27px!important;}
          .top .brand-text strong{font-size:1.12rem!important;}
          .top .brand-text small{font-size:.74rem!important;}
          .top .back{font-size:.7rem!important;padding:7px 9px!important;}
          .top .nav button{font-size:.78rem!important;padding:8px 9px!important;}
        }
      `;
      document.head.appendChild(style);
    }

    nav.scrollLeft = 0;
    requestAnimationFrame(() => { nav.scrollLeft = 0; });
  };

  loadScript(`./app-core.js?v=${VERSION}`)
    .then(() => {
      installStableHeader();
      window.addEventListener('resize', installStableHeader, { passive: true });
      return loadScript(`./stats.js?v=${VERSION}`);
    })
    .then(installStableHeader)
    .catch((error) => console.error('No se pudo iniciar Huellas de Puan.', error));
})();