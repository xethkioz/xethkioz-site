import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

const root=process.cwd()
const out='E:\\WEB XETHKIOZ\\03_EXPORTS_QA\\AION_WOW_HUELLAS_20261012'
fs.mkdirSync(out,{recursive:true})
const port=4177
const server=spawn(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:root,windowsHide:true,stdio:'pipe'})
let logs=''
server.stderr.on('data',d=>logs+=d.toString())
server.stdout.on('data',d=>logs+=d.toString())
const wait=ms=>new Promise(r=>setTimeout(r,ms))
async function ready(){
 for(let i=0;i<65;i++){
  if(server.exitCode!==null)throw Error('Preview ended: '+logs.slice(-800))
  try{let r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok)return}catch{}
  await wait(180)
 }throw Error('Preview timeout: '+logs.slice(-800))
}
let browser
let failed=false
const problems=[]
try{
 await ready()
 browser=await chromium.launch({channel:'chrome',headless:true})
 for(const width of [320,360,390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900},locale:'es-AR',reducedMotion:'reduce'})
  const page=await ctx.newPage()
  const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  const response=await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:25000})
  await page.locator('.xk-game-dossier').waitFor()
  await page.getByRole('button',{name:/solo esenciales|essential only/i}).first().click({timeout:1200}).catch(()=>{})
  for(const img of await page.locator('.xk-light-worlds img,.xk-launcher-hero__art img').all()){
    await img.scrollIntoViewIfNeeded()
    await img.evaluate(async el=>{await el.decode().catch(()=>{})})
  }
  const data=await page.evaluate(()=>{
   const dossier=document.querySelector('.xk-game-dossier')
   const cards=[...document.querySelectorAll('nav.xk-light-worlds .xk-light-world')]
   return {overflow:document.documentElement.scrollWidth-innerWidth,count:cards.length,
    petSrc:document.querySelector('.xk-light-world--pets img')?.getAttribute('src'),
    petLoaded:!!document.querySelector('.xk-light-world--pets img')?.naturalWidth,
    aionSrc:document.querySelector('.xk-launcher-hero__art img')?.getAttribute('src'),
    aionLoaded:!!document.querySelector('.xk-launcher-hero__art img')?.naturalWidth,
    dossierRect:dossier?.getBoundingClientRect().width,
    classes:[...dossier.querySelectorAll('.xk-game-dossier__tags span')].map(x=>x.textContent),
    links:[...dossier.querySelectorAll('.xk-game-dossier__source-links a')].map(x=>x.href),
    duplicateGreen:document.querySelectorAll('.xk-launcher-green').length
   }
  })
  const homeOK=response.status()===200&&data.overflow<=1&&data.count===4&&data.petLoaded&&data.aionLoaded&&data.duplicateGreen===0&&data.classes.length===8&&data.links.length>=2&&errors.length===0
  if(!homeOK){failed=true;problems.push({width,page:'home',data,errors})}
  await page.locator('a.xk-launcher-primary').click()
  const target=await page.evaluate(()=>location.hash)
  if(target!=='#xk-universe-spotlight'){failed=true;problems.push({width,issue:'main CTA anchor'})}
  await page.getByRole('tab',{name:/WOWFOREVER/i}).click()
  let count=await page.locator('.xk-game-dossier__tags span').count()
  const wowText=await page.locator('.xk-game-dossier').innerText()
  const wowOK=count===9&&wowText.includes('noviembre')&&wowText.includes('Blizzard')
  if(!wowOK){failed=true;problems.push({width,page:'wow',count,wow: wowText.slice(0,400)})}
  await page.locator('.xk-universe-archive-toggle__button').click()
  const archiveVisible=await page.locator('#xk-universe-archive-content').isVisible()
  await page.getByRole('tab',{name:/AION 2/i}).click()
  const archiveClosed=await page.locator('#xk-universe-archive-content').count()===0
  if(!archiveVisible||!archiveClosed){failed=true;problems.push({width,issue:'archive',archiveVisible,archiveClosed})}
  if([390,1440].includes(width)){
   await page.locator('.xk-game-dossier').screenshot({path:path.join(out,'aion-dossier-'+width+'.png'),animations:'disabled'})
   await page.getByRole('tab',{name:/WOWFOREVER/i}).click()
   await page.locator('.xk-game-dossier').screenshot({path:path.join(out,'wow-dossier-'+width+'.png'),animations:'disabled'})
   await page.getByRole('tab',{name:/AION 2/i}).click()
   if(width===390){
     const axe=await new AxeBuilder({page}).include('.xk-game-dossier').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
     const errs=axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))
     if(errs.length){failed=true;problems.push({width,issue:'dossier axe',errs})}
   }
  }
  console.log(JSON.stringify({width,homeOK,wowOK,archiveVisible,archiveClosed,overflow:data.overflow,petLoaded:data.petLoaded,aionLoaded:data.aionLoaded,errors}))
  await ctx.close()
 }
 for(const width of [320,390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900},locale:'es-AR',reducedMotion:'reduce'})
  const page=await ctx.newPage();const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  const res=await page.goto('http://127.0.0.1:'+port+'/mascotas/',{waitUntil:'domcontentloaded',timeout:25000})
  const hero=page.locator('.hero-photo')
  await hero.evaluate(async img=>await img.decode().catch(()=>{}))
  const data=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    heroLoaded:document.querySelector('.hero-photo')?.naturalWidth>0,
    heroSrc:document.querySelector('.hero-photo')?.getAttribute('src'),
    companions:document.querySelectorAll('.pet-companion-welcome').length,
    portraits:document.querySelectorAll('.action-card .pet-portrait').length,
    noticeForm:!!document.getElementById('postForm'),
    lostBtn:!!document.querySelector('[data-go="publicar"][data-type="Perdido"]')
  }))
  const ok=res.status()===200&&data.overflow<=1&&data.heroLoaded&&data.companions===1&&data.portraits===4&&data.noticeForm&&data.lostBtn&&errors.length===0
  if(!ok){failed=true;problems.push({width,page:'pets',data,errors})}
  if([390,1440].includes(width)){
   await page.locator('.pet-companion-welcome').screenshot({path:path.join(out,'pets-showcase-'+width+'.png'),animations:'disabled'})
   await page.screenshot({path:path.join(out,'pets-first-'+width+'.png'),animations:'disabled'})
   if(width===390){
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    const errs=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary?.slice(0,220)}))}))
    if(errs.length){failed=true;problems.push({width,page:'pets axe',errs})}
   }
  }
  console.log(JSON.stringify({pets:width,ok,...data,errors}))
  await ctx.close()
 }
}catch(e){failed=true;problems.push({fatal:String(e),stack:e.stack?.slice(0,600)})}
finally{
 if(browser)await browser.close().catch(()=>{})
 server.kill('SIGTERM')
 const file=path.join(out,'results.json')
 fs.writeFileSync(file,JSON.stringify({pass:!failed,problems,updated:new Date().toISOString()},null,2))
 console.log(JSON.stringify({final:'XETHKIOZ GAME PETS QA',pass:!failed,problems,report:file}).slice(0,12000))
 if(failed)process.exitCode=2
}
