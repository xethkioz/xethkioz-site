/* Decorative fireflies only: no data access, tracking or network. */
(() => {
  const hero=document.querySelector('.portal-nature .hero'); if(!hero)return
  const preference='xethkioz.portal-effects',media=matchMedia('(prefers-reduced-motion: reduce)')
  const field=document.createElement('span');field.className='nature-fireflies';field.setAttribute('aria-hidden','true')
  for(let i=0;i<6;i++){const dot=document.createElement('i');dot.style.setProperty('--x',`${9+i*16}%`);dot.style.setProperty('--delay',`${-i*1.1}s`);field.append(dot)}
  hero.append(field)
  const button=document.querySelector('.pet-portal-effects');let visible=false,enabled=!media.matches
  try{enabled=enabled&&localStorage.getItem(preference)!=='off'}catch{}
  const sync=()=>{field.dataset.running=String(enabled&&visible&&!document.hidden&&!media.matches);button?.setAttribute('aria-pressed',String(enabled&&!media.matches))}
  button?.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(preference,enabled?'on':'off')}catch{};sync()})
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});observer.observe(hero)
  media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync()
})()
