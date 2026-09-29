import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const base = process.env.PORTAL_QA_BASE || 'http://127.0.0.1:4198'
const out = process.env.PORTAL_QA_OUTPUT || 'artifacts/portal-convergence'
await fs.mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'chrome'}:{})})
const records=[]
try {
  for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
    const context=await browser.newContext({viewport,reducedMotion:'reduce'})
    for(const [label,path] of [['home','/'],['game','/world-of-xethkioz/elemental-realms'],['digital','/digital'],['studio','/creacion-web'],['nature','/mascotas/'],['node','/green-node']]){
      const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message))
      await page.goto(base+path,{waitUntil:'networkidle'})
      const consent=page.getByRole('button',{name:/solo esenciales|essential only/i}).first()
      if(await consent.isVisible())await consent.click()
      await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready)
      await page.waitForTimeout(500)
      const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,h1:document.querySelector('h1')?.textContent,nav:document.querySelectorAll('.portal-navigation').length,footer:document.querySelectorAll('.portal-footer').length,images:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),video:[...document.querySelectorAll('video')].map(v=>({src:v.querySelector('source')?.getAttribute('src'),controls:v.controls,autoplay:v.autoplay,preload:v.preload}))}))
      await page.screenshot({path:`${out}/${name}-${label}.png`,fullPage:false})
      if(label==='home'||label==='game')await page.screenshot({path:`${out}/${name}-${label}-full.png`,fullPage:true})
      records.push({name,label,path,...metrics,errors});console.log(JSON.stringify(records.at(-1)))
      await page.close()
    }
    await context.close()
  }
} finally {await browser.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(records,null,2))}
if(records.some(r=>r.errors.length||r.scrollWidth>r.width+1||r.images.some(i=>!i.loaded)))process.exitCode=1
