const places=['Puan','Darregueira','Bordenave','Villa Iris','Felipe Solá','17 de Agosto','Azopardo','Erize','San Germán'];
const MAX_IMAGES=2;
const VALID_DAYS=15;
const DAY=86400000;
const castIcon=document.querySelector('.action-cast .icon');if(castIcon)castIcon.textContent='🩹';
const nowIso=()=>new Date().toISOString();
const basePosts=[
  {id:'barby-2026',type:'Perdido',name:'Barby',species:'Perra tipo galgo',locality:'Puan',zone:'Zona céntrica',description:'Desaparecida desde el 11/07. Pelaje atigrado y blanco, hocico blanco, patas largas blancas y orejas paradas. Está castrada y tiene una C marcada en la oreja.',phone:'2923413848',castrated:'Sí',real:true,staticImages:['/assets/barby-real.svg'],publishedAt:'2026-08-01T12:00:00.000Z'},
  {id:'demo-found',type:'Encontrado',name:'Sin nombre',species:'Perro',locality:'Puan',zone:'Cerca de la laguna',description:'Ejemplo de aviso de animal encontrado. Macho y dócil.',phone:'2923555123',castrated:'Desconocido',publishedAt:'2026-08-01T12:00:00.000Z'},
  {id:'demo-adopt',type:'Adopción',name:'Michi',species:'Gato',locality:'Puan',zone:'Hogar de tránsito',description:'Ejemplo de adopción. Macho, joven, cariñoso y juguetón.',phone:'2923444567',castrated:'No',publishedAt:'2026-08-01T12:00:00.000Z'},
  {id:'demo-found-2',type:'Encontrado',name:'Sin nombre',species:'Perra',locality:'Darregueira',zone:'Cerca de la plaza',description:'Ejemplo de aviso. Muy tranquila y sin collar.',phone:'2923666789',castrated:'Desconocido',publishedAt:'2026-08-01T12:00:00.000Z'}
];
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const publishedTime=p=>new Date(p.publishedAt||p.createdAt||Date.now()).getTime();
const expiresTime=p=>publishedTime(p)+(VALID_DAYS*DAY);
const remainingDays=p=>Math.max(0,Math.ceil((expiresTime(p)-Date.now())/DAY));
const elapsedDays=p=>Math.max(0,Math.floor((Date.now()-publishedTime(p))/DAY));
const isActive=p=>expiresTime(p)>Date.now();
function normalizePost(p){return {...p,publishedAt:p.publishedAt||p.createdAt||nowIso(),imageCount:Math.min(Number(p.imageCount)||0,MAX_IMAGES)}}
let stored=[];try{stored=JSON.parse(localStorage.getItem('huellas-puan-posts')||'[]').map(normalizePost).filter(isActive)}catch{}
localStorage.setItem('huellas-puan-posts',JSON.stringify(stored));
let posts=[...stored.filter(p=>!basePosts.some(b=>b.id===p.id)),...basePosts.map(normalizePost)].filter(isActive);
let selectedImages=[];
function fill(select){if(!select)return;select.innerHTML='<option value="Todas">📍 Todas las localidades</option>'+places.map(p=>`<option>${p}</option>`).join('')}
fill(document.querySelector('#homeFilter'));document.querySelectorAll('.categoryFilter').forEach(fill);const locality=document.querySelector('#locality');if(locality)locality.innerHTML=places.map(p=>`<option>${p}</option>`).join('');

const DB_NAME='huellas-puan-media',STORE='images';
function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'key'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function saveImages(postId,files){if(!files.length)return;const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);files.forEach((file,index)=>store.put({key:`${postId}:${index}`,postId,index,blob:file}));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
async function getImages(postId,count){if(!count)return[];const db=await openDb();return Promise.all(Array.from({length:Math.min(count,MAX_IMAGES)},(_,index)=>new Promise(resolve=>{const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(`${postId}:${index}`);req.onsuccess=()=>resolve(req.result?.blob||null);req.onerror=()=>resolve(null)}))).then(items=>items.filter(Boolean))}

function sharePost(p){if(!p)return;const section=p.type==='Perdido'?'perdidos':p.type==='Encontrado'?'encontrados':'adopciones';const text=`${p.type}: ${p.name} - ${p.locality}. ${p.description} ${location.origin}/mascotas/#${section}`;if(navigator.share){navigator.share({title:'Huellas de Puan',text}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>alert('Texto copiado para compartir.'))}}
function typeLabel(type){return type==='Perdido'?'PERDIDOS':type==='Encontrado'?'ENCONTRADOS':'ADOPCIONES'}
function card(p){
  const phone=(p.phone||'').replace(/\D/g,'');
  const staticImages=Array.isArray(p.staticImages)?p.staticImages.slice(0,MAX_IMAGES):[];
  const gallery=staticImages.length?`<div class="gallery" aria-label="Imágenes de ${esc(p.name)}">${staticImages.map((src,index)=>`<img src="${esc(src)}" alt="Imagen ${index+1} de ${esc(p.name)}" loading="lazy">`).join('')}</div>`:p.imageCount?`<div class="gallery" data-gallery="${esc(p.id)}" data-count="${Math.min(Number(p.imageCount)||0,MAX_IMAGES)}" aria-label="Imágenes de ${esc(p.name)}"></div>`:'';
  const elapsed=elapsedDays(p),remaining=remainingDays(p);
  const age=elapsed===0?'Hoy':elapsed===1?'Hace 1 día':`Hace ${elapsed} días`;
  const canRenew=stored.some(item=>item.id===p.id);
  return `<article class="card">${gallery}<div class="tag ${esc(p.type)}"><span>${typeLabel(p.type)}</span><span>${age}</span></div><div class="card-body"><h3>${esc(p.name||'Sin nombre')}</h3><div class="meta">📍 ${esc(p.locality)} · ${esc(p.zone)}</div><p>${esc(p.description)}</p><p><strong>Especie:</strong> ${esc(p.species)}<br><strong>Castrado:</strong> ${esc(p.castrated)}</p>${phone?`<a class="contact" href="https://wa.me/54${phone}" target="_blank" rel="noopener">🟢 ${esc(p.phone)} · Ver en WhatsApp</a>`:''}<button class="share" data-share="${esc(p.id)}">Compartir publicación</button>${canRenew?`<button class="renew" data-renew="${esc(p.id)}">Renovar por 15 días</button>`:''}<div class="expiry"><span>◷ Publicación válida por 15 días</span><strong>Quedan ${remaining} días</strong></div></div></article>`
}
async function hydrateGalleries(){document.querySelectorAll('[data-gallery]').forEach(async gallery=>{const blobs=await getImages(gallery.dataset.gallery,Number(gallery.dataset.count));gallery.innerHTML='';blobs.forEach((blob,index)=>{const img=document.createElement('img');img.src=URL.createObjectURL(blob);img.alt=`Imagen ${index+1} de la publicación`;img.onload=()=>URL.revokeObjectURL(img.src);gallery.appendChild(img)})})}
function renewPost(id){const index=stored.findIndex(p=>p.id===id);if(index<0)return;stored[index]={...stored[index],publishedAt:nowIso()};localStorage.setItem('huellas-puan-posts',JSON.stringify(stored));posts=[...stored.filter(p=>!basePosts.some(b=>b.id===p.id)),...basePosts.map(normalizePost)].filter(isActive);render();alert('La publicación fue renovada por 15 días.');}
function render(){
  posts=posts.filter(isActive);
  const hf=document.querySelector('#homeFilter')?.value||'Todas';
  const home=hf==='Todas'?posts:posts.filter(p=>p.locality===hf);
  const homeGrid=document.querySelector('#homeGrid');if(homeGrid)homeGrid.innerHTML=home.length?home.map(card).join(''):'<div class="info">No hay publicaciones activas para esta localidad.</div>';
  document.querySelectorAll('.categoryGrid').forEach(grid=>{const type=grid.dataset.type,filter=grid.parentElement.querySelector('.categoryFilter')?.value||'Todas';const list=posts.filter(p=>p.type===type&&(filter==='Todas'||p.locality===filter));grid.innerHTML=list.length?list.map(card).join(''):'<div class="info">Todavía no hay publicaciones activas.</div>'});
  document.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>sharePost(posts.find(p=>p.id===b.dataset.share)));
  document.querySelectorAll('[data-renew]').forEach(b=>b.onclick=()=>renewPost(b.dataset.renew));
  hydrateGalleries();
}
function show(id){document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));history.replaceState(null,'','#'+id);scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>show(b.dataset.section));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.preventDefault();if(b.dataset.type){const type=document.querySelector('#type');if(type)type.value=b.dataset.type}show(b.dataset.go)});document.querySelectorAll('#homeFilter,.categoryFilter').forEach(s=>s.onchange=render);

const imageInput=document.querySelector('#images'),preview=document.querySelector('#imagePreview');
function renderPreview(){if(!preview)return;preview.innerHTML='';selectedImages.forEach((file,index)=>{const img=document.createElement('img');img.src=URL.createObjectURL(file);img.alt=`Vista previa ${index+1}`;img.onload=()=>URL.revokeObjectURL(img.src);preview.appendChild(img)})}
if(imageInput)imageInput.onchange=()=>{const files=[...imageInput.files];if(files.length>MAX_IMAGES){alert(`Podés cargar hasta ${MAX_IMAGES} imágenes por publicación.`);imageInput.value='';selectedImages=[];renderPreview();return}const invalid=files.find(file=>!['image/jpeg','image/png','image/webp'].includes(file.type));if(invalid){alert('Usá imágenes JPG, PNG o WebP.');imageInput.value='';selectedImages=[];renderPreview();return}selectedImages=files;renderPreview()};

const postForm=document.querySelector('#postForm');
if(postForm)postForm.onsubmit=async e=>{e.preventDefault();const button=e.currentTarget.querySelector('.submit');button.disabled=true;button.textContent='Guardando…';try{const f=new FormData(e.currentTarget),id=crypto.randomUUID();const p={id,type:f.get('type'),name:f.get('name')||'Sin nombre',species:f.get('species'),locality:f.get('locality'),zone:f.get('zone'),description:f.get('description'),phone:f.get('phone'),castrated:f.get('castrated'),imageCount:selectedImages.length,publishedAt:nowIso()};await saveImages(id,selectedImages);stored=[p,...stored.filter(isActive)];localStorage.setItem('huellas-puan-posts',JSON.stringify(stored));posts=[...stored.filter(x=>!basePosts.some(b=>b.id===x.id)),...basePosts.map(normalizePost)].filter(isActive);e.currentTarget.reset();selectedImages=[];renderPreview();const n=document.querySelector('#notice');n.style.display='block';n.textContent='Publicación creada. Estará activa durante 15 días y luego deberá renovarse.';render();show('inicio')}catch{alert('No se pudo guardar la publicación. Revisá el espacio disponible del navegador.')}finally{button.disabled=false;button.textContent='Publicar información'}};
render();const initial=location.hash.slice(1);if(document.getElementById(initial))show(initial);