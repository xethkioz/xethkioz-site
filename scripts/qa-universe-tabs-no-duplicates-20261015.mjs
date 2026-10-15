import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

const port = 4181
const root = process.cwd()
const preview = spawn(process.execPath, [path.join(root,'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:root,stdio:'pipe',windowsHide:true})
let logs=''
preview.stdout.on('data',chunk=>logs+=chunk)
preview.stderr.on('data',chunk=>logs+=chunk)
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
async function waitUntilReady(){for(let i=0;i<80;i++){try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok)return}catch{};await sleep(170)}throw Error('Preview unavailable: '+logs.slice(-500))}
let browser,failed=false
const failures=[]
try{
 await waitUntilReady()
 browser=await chromium.launch({channel:'chrome',headless:true})
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:850},locale:'es-AR',reducedMotion:'no-preference'})
  const page=await context.newPage()
  const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:28000})
  const c=page.getByRole('button',{name:/solo esenciales/i})
  if(await c.count())await c.first().click({timeout:1500}).catch(()=>{})
  const initial=await page.locator('.xk-launcher-main').evaluate(el=>el.scrollHeight)
  const sequence=['wow','aion2','wow','aion2','wow','aion2','wow','aion2','wow','aion2','wow','aion2']
  for(const [i,next] of sequence.entries()){
    const tab=page.locator(next==='wow'?'#tab-wowforever':'#tab-aion2')
    await tab.click()
    await page.waitForTimeout(120)
    const state=await page.evaluate(()=>{
      const selected=document.querySelector('[role="tab"][aria-selected="true"]')
      const hero=document.querySelector('#universe-panel')
      const rect=hero?.getBoundingClientRect()
      return {heroCount:document.querySelectorAll('.xk-launcher-hero').length,idCount:document.querySelectorAll('#universe-panel').length,dossiers:document.querySelectorAll('.xk-game-dossier').length,selected:selected?.id,heroTitle:hero?.querySelector('h2')?.innerText,theme:document.querySelector('main')?.getAttribute('data-portal-theme'),overflow:document.documentElement.scrollWidth-innerWidth,heroHeight:rect?.height}
    })
    const expected=next==='wow'?'tab-wowforever':'tab-aion2'
    const ok=state.heroCount===1&&state.idCount===1&&state.dossiers===1&&state.selected===expected&&state.theme===next&&state.overflow<=1
    if(!ok){failed=true;failures.push({width,i,next,state})}
    if(i===2||i===11)console.log(JSON.stringify({width,iteration:i,ok,state}))
  }
  const after=await page.locator('.xk-launcher-main').evaluate(el=>el.scrollHeight)
  const stable=after<=initial+35
  if(!stable){failed=true;failures.push({width,issue:'section grows after switches',initial,after})}
  await page.locator('.xk-universe-archive-toggle__button').click()
  const archiveOpen=await page.locator('#xk-universe-archive-content').isVisible()
  await page.locator('#tab-wowforever').click()
  const archiveClosed=await page.locator('#xk-universe-archive-content').count()===0
  if(!archiveOpen||!archiveClosed){failed=true;failures.push({width,issue:'archive',archiveOpen,archiveClosed})}
  if(errors.length){failed=true;failures.push({width,errors})}
  console.log(JSON.stringify({width,passes:!failures.some(x=>x.width===width),initialHeight:initial,finalHeight:after,archiveOpen,archiveClosed,errors}))
  await context.close()
 }
}catch(e){failed=true;failures.push({fatal:String(e),stack:e.stack?.slice(0,1000)})}
finally{
 if(browser)await browser.close().catch(()=>{})
 preview.kill('SIGTERM')
 console.log(JSON.stringify({final:'UNIVERSE TAB DUPLICATION REGRESSION',pass:!failed,failures}).slice(0,9000))
 if(failed)process.exitCode=2
}
