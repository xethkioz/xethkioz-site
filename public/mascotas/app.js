const places=['Puan','Darregueira','Bordenave','Villa Iris','Felipe Solá','17 de Agosto','Azopardo','Erize','San Germán'];
const MAX_IMAGES=2,VALID_DAYS=15,DAY=86400000,MAX_FILE_SIZE=5*1024*1024,MAX_IMAGE_SIDE=1600,SUBMIT_COOLDOWN=30000;
const SUPABASE_URL='https://pascicauudfyydzknoop.supabase.co';
const SUPABASE_KEY='sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_';
const API_HEADERS={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`};
let posts=[],selectedImages=[];
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const publishedTime=p=>new Date(p.created_at||Date.now()).getTime();
const expiresTime=p=>new Date(p.expires_at||publishedTime(p)+(VALID_DAYS*DAY)).getTime();
const remainingDays=p=>Math.max(0,Math.ceil((expiresTime(p)-Date.now())/DAY));
const elapsedDays=p=>Math.max(0,Math.floor((Date.now()-publishedTime(p))/DAY));
const notice=document.querySelector('#notice');
if(notice){notice.setAttribute('role','status');notice.setAttribute('aria-live','polite')}
function setNotice(message,type='success'){if(!notice)return;notice.style.display='block';notice.style.background=type==='error'?'#fff0ed':'#edf7e8';notice.style.color=type==='error'?'#9f2f24':'#365a2b';notice.textContent=message}
function fill(select){if(!select)return;select.innerHTML='<option value="Todas">📍 Todas las localidades</option>'+places.map(p=>`<option>${p}</option>`).join('')}
fill(document.querySelector('#homeFilter'));document.querySelectorAll('.categoryFilter').forEach(fill);const locality=document.querySelector('#locality');if(locality)locality.innerHTML=places.map(p=>`<option>${p}</option>`).join('');
try{localStorage.removeItem('huellas-puan-posts');indexedDB.deleteDatabase('huellas-puan-media')}catch{}
function typeLabel(type){return type==='Perdido'?'PERDIDO':type==='Encontrado'?'ENCONTRADO':'ADOPCIÓN'}
function sharePost(p){if(!p)return;const section=p.type==='Perdido'?'perdidos':p.type==='Encontrado'?'encontrados':'adopciones';const text=`${p.type}: ${p.name} - ${p.locality}. ${p.description} ${location.origin}/mascotas/#${section}`;if(navigator.share){navigator.share({title:'Huellas de Puan',text}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>alert('Texto copiado para compartir.'))}}
function card(p){const phone=(p.phone||'').replace(/\D/g,'');const images=Array.isArray(p.image_urls)?p.image_urls.slice(0,MAX_IMAGES):[];const gallery=images.length?`<div class="gallery" aria-label="Imágenes de ${esc(p.name)}">${images.map((src,index)=>`<img src="${esc(src)}" alt="Imagen ${index+1} de ${esc(p.name)}" loading="lazy" decoding="async">`).join('')}</div>`:'';const elapsed=elapsedDays(p),age=elapsed===0?'Hoy':elapsed===1?'Hace 1 día':`Hace ${elapsed} días`;return `<article class="card">${gallery}<div class="tag ${esc(p.type)}"><span>${typeLabel(p.type)}</span><span>${age}</span></div><div class="card-body"><h3>${esc(p.name||'Sin nombre')}</h3><div class="meta">📍 ${esc(p.locality)} · ${esc(p.zone)}</div><p>${esc(p.description)}</p><p><strong>Especie:</strong> ${esc(p.species)}<br><strong>Castrado:</strong> ${esc(p.castrated)}</p>${phone?`<a class="contact" href="https://wa.me/54${phone}" target="_blank" rel="noopener">🟢 Contactar por WhatsApp</a>`:''}<button class="share" data-share="${esc(p.id)}">Compartir publicación</button><div class="expiry"><span>◷ Activa durante 15 días</span><strong>Quedan ${remainingDays(p)} días</strong></div></div></article>`}
function bindCards(){document.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>sharePost(posts.find(p=>p.id===b.dataset.share)))}
function emptyMessage(text){return `<div class="info">${text}<br><button class="share" data-go="publicar" style="margin-top:12px">Publicar un aviso</button></div>`}
function bindNavigation(){document.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.preventDefault();if(b.dataset.type){const type=document.querySelector('#type');if(type)type.value=b.dataset.type}show(b.dataset.go)})}
function render(){const hf=document.querySelector('#homeFilter')?.value||'Todas';const home=hf==='Todas'?posts:posts.filter(p=>p.locality===hf);const homeGrid=document.querySelector('#homeGrid');if(homeGrid)homeGrid.innerHTML=home.length?home.map(card).join(''):emptyMessage('No hay avisos activos para esta localidad.');document.querySelectorAll('.categoryGrid').forEach(grid=>{const type=grid.dataset.type,filter=grid.parentElement.querySelector('.categoryFilter')?.value||'Todas';const list=posts.filter(p=>p.type===type&&(filter==='Todas'||p.locality===filter));grid.innerHTML=list.length?list.map(card).join(''):emptyMessage('Todavía no hay publicaciones activas en esta categoría.')});bindCards();bindNavigation()}
function setLoading(){document.querySelectorAll('#homeGrid,.categoryGrid').forEach(grid=>grid.innerHTML='<div class="info">Cargando publicaciones…</div>')}
async function loadPosts(){setLoading();try{const query=`${SUPABASE_URL}/rest/v1/pet_posts?select=id,type,name,species,locality,zone,description,phone,castrated,image_urls,created_at,expires_at&status=eq.approved&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&order=created_at.desc`;const res=await fetch(query,{headers:API_HEADERS,cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);posts=await res.json();render()}catch(error){console.error(error);document.querySelectorAll('#homeGrid,.categoryGrid').forEach(grid=>grid.innerHTML='<div class="info">No pudimos cargar los avisos.<br><button class="share" data-retry style="margin-top:12px">Reintentar</button></div>');document.querySelectorAll('[data-retry]').forEach(button=>button.onclick=loadPosts)}}
function show(id){document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));history.replaceState(null,'','#'+id);scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>show(b.dataset.section));bindNavigation();document.querySelectorAll('#homeFilter,.categoryFilter').forEach(s=>s.onchange=render);
const imageInput=document.querySelector('#images'),preview=document.querySelector('#imagePreview');
function renderPreview(){if(!preview)return;preview.innerHTML='';selectedImages.forEach((file,index)=>{const img=document.createElement('img');img.src=URL.createObjectURL(file);img.alt=`Vista previa ${index+1}`;img.onload=()=>URL.revokeObjectURL(img.src);preview.appendChild(img)})}
function optimizeImage(file){return new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{URL.revokeObjectURL(url);const scale=Math.min(1,MAX_IMAGE_SIDE/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d',{alpha:false}).drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>blob?resolve(new File([blob],`${file.name.replace(/\.[^.]+$/,'')}.jpg`,{type:'image/jpeg'})):reject(new Error('No se pudo procesar una imagen.')),'image/jpeg',.84)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Una imagen no pudo abrirse.'))};img.src=url})}
if(imageInput)imageInput.onchange=async()=>{const files=[...imageInput.files];if(files.length>MAX_IMAGES){alert(`Podés cargar hasta ${MAX_IMAGES} imágenes por publicación.`);imageInput.value='';selectedImages=[];renderPreview();return}const invalid=files.find(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>MAX_FILE_SIZE);if(invalid){alert('Usá imágenes JPG, PNG o WebP de hasta 5 MB cada una.');imageInput.value='';selectedImages=[];renderPreview();return}try{selectedImages=await Promise.all(files.map(optimizeImage));renderPreview()}catch(error){alert(error.message);imageInput.value='';selectedImages=[];renderPreview()}};
async function uploadImages(id){const urls=[];for(let index=0;index<selectedImages.length;index++){const file=selectedImages[index];const path=`submissions/${id}/${index+1}.jpg`;const res=await fetch(`${SUPABASE_URL}/storage/v1/object/pet-posts/${path}`,{method:'POST',headers:{...API_HEADERS,'Content-Type':'image/jpeg','x-upsert':'false'},body:file});if(!res.ok)throw new Error(`No se pudo subir la imagen ${index+1}.`);urls.push(`${SUPABASE_URL}/storage/v1/object/public/pet-posts/${path}`)}return urls}
const postForm=document.querySelector('#postForm');
if(postForm)postForm.onsubmit=async e=>{e.preventDefault();const button=e.currentTarget.querySelector('.submit');button.disabled=true;button.textContent='Enviando…';if(notice)notice.style.display='none';try{const lastSubmit=Number(localStorage.getItem('huellas-last-submit')||0);if(Date.now()-lastSubmit<SUBMIT_COOLDOWN)throw new Error('Esperá unos segundos antes de enviar otro aviso.');const f=new FormData(e.currentTarget),id=crypto.randomUUID(),phone=String(f.get('phone')||'').replace(/\D/g,''),zone=String(f.get('zone')||'').trim(),description=String(f.get('description')||'').trim(),name=String(f.get('name')||'Sin nombre').trim();if(phone.length<8||phone.length>15)throw new Error('Ingresá un número de WhatsApp válido.');if(zone.length<3)throw new Error('Indicá una zona aproximada.');if(description.length<20)throw new Error('Agregá una descripción de al menos 20 caracteres.');if(name.length>80)throw new Error('El nombre es demasiado largo.');const image_urls=await uploadImages(id);const payload={id,type:f.get('type'),name:name||'Sin nombre',species:f.get('species'),locality:f.get('locality'),zone:zone.slice(0,140),description:description.slice(0,1200),phone,castrated:f.get('castrated'),image_urls,status:'pending'};const res=await fetch(`${SUPABASE_URL}/rest/v1/pet_posts`,{method:'POST',headers:{...API_HEADERS,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('No se pudo registrar el aviso.');localStorage.setItem('huellas-last-submit',String(Date.now()));localStorage.setItem('huellas-last-receipt',id);e.currentTarget.reset();selectedImages=[];renderPreview();setNotice(`Aviso recibido. Código de seguimiento: ${id.slice(0,8).toUpperCase()}. Será revisado antes de publicarse.`);button.textContent='Enviado';setTimeout(()=>{button.textContent='Publicar información'},1800)}catch(error){console.error(error);setNotice(error.message||'No se pudo enviar la publicación. Intentá nuevamente.','error')}finally{button.disabled=false;if(button.textContent==='Enviando…')button.textContent='Publicar información'}};
loadPosts();const initial=location.hash.slice(1);if(document.getElementById(initial))show(initial);

// Encabezado de Huellas: distribución independiente del ancho del contenido.
const headerStyle=document.createElement('style');
headerStyle.textContent=`
.top .header-row{width:min(1480px,calc(100% - 32px));display:grid;grid-template-columns:max-content minmax(0,1fr) max-content;gap:18px;padding:0;}
.top .brand{min-width:136px;gap:8px;}
.top .brand-mark{font-size:31px;line-height:1;}
.top .brand-text strong{font-size:1.32rem;line-height:.9;}
.top .brand-text small{font-size:.86rem;}
.top .nav{min-width:0;justify-content:flex-start;gap:2px;padding:7px 0;overflow-x:auto;overscroll-behavior-inline:contain;scroll-padding-inline:8px;}
.top .nav button{flex:0 0 auto;padding:9px 10px;font-size:.86rem;}
.top .back{padding:10px 15px;font-size:.85rem;}
@media(max-width:1180px){
 .top .header-row{grid-template-columns:1fr max-content;gap:8px 14px;padding:9px 0;}
 .top .nav{grid-column:1/-1;grid-row:2;order:initial;width:100%;padding:2px 0 5px;}
 .top .back{grid-column:2;grid-row:1;}
}
@media(max-width:600px){
 .top .header-row{width:calc(100% - 20px);}
 .top .brand{min-width:0;}
 .top .brand-mark{font-size:27px;}
 .top .brand-text strong{font-size:1.12rem;}
 .top .brand-text small{font-size:.74rem;}
 .top .back{font-size:.7rem;padding:8px 9px;}
 .top .nav button{font-size:.78rem;padding:8px 9px;}
}
`;
document.head.appendChild(headerStyle);