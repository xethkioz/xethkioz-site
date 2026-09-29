/* Decorative fireflies only: no data access, tracking, timers or network. */
(() => {
  const hero = document.querySelector('.portal-nature .hero');
  if (!hero) return;
  const preference = 'xethkioz.portal-effects';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const field = document.createElement('span');
  field.className = 'nature-fireflies';
  field.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('i');
    dot.style.setProperty('--x', `${9 + i * 16}%`);
    dot.style.setProperty('--delay', `${-i * 1.1}s`);
    field.append(dot);
  }
  hero.append(field);
  const button = document.querySelector('.pet-portal-effects');
  let visible = false, activePage = true, enabled = true;
  try { enabled = localStorage.getItem(preference) !== 'off'; } catch {}
  const sync = () => {
    const allowed = enabled && !media.matches && !connection?.saveData;
    field.dataset.running = String(allowed && visible && activePage && !document.hidden);
    button?.setAttribute('aria-pressed', String(allowed));
    if (button) button.textContent = allowed ? 'Pausar efectos ✦' : 'Efectos pausados ✦';
  };
  button?.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem(preference, enabled ? 'on' : 'off'); } catch {}
    sync();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
  }
  media.addEventListener('change', sync);
  connection?.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { activePage = false; sync(); });
  window.addEventListener('pageshow', () => { activePage = true; sync(); });
  window.addEventListener('storage', (event) => {
    if (event.key === preference || event.key === null) {
      try { enabled = localStorage.getItem(preference) !== 'off'; } catch {}
      sync();
    }
  });
  sync();
})();
