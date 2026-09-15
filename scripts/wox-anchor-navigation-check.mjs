import { chromium } from '@playwright/test'
const base=(process.env.WOX_PREVIEW_URL||'http://127.0.0.1:4173/').replace(/\/$/,'')
const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
const viewports=[{width:1440,height:1000},{width:768,height:900},{width:390,height:844}]
for(const viewport of viewports){
 const context=await browser.newContext({viewport})
 await context.addInitScript(()=>localStorage.setItem('xethkioz.privacy-consent.v1',JSON.stringify({version:1,analytics:false,marketing:false,updatedAt:new Date().toISOString()})))
 const page=await context.newPage(); const errors=[]
 page.on('console',m=>m.type()==='error'&&errors.push(m.text())); page.on('pageerror',e=>errors.push(e.message))
 await page.goto(`${base}/`,{waitUntil:'networkidle'})
 const links=await page.locator('.wox-game-nav a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')).filter(Boolean))
 const landings=[]
 for(const href of links){
  await page.locator(`.wox-game-nav a[href="${href}"]`).click(); await page.waitForTimeout(180)
  const section=await page.locator(href).boundingBox(); const dock=await page.locator('.wox-section-dock').boundingBox()
  if(!section||!dock) throw new Error(`missing landing geometry for ${href}`)
  const clearance=section.y-(dock.y+dock.height); landings.push({href,clearance:Math.round(clearance)})
  if(clearance<6) throw new Error(`${viewport.width}px ${href} hidden by sticky dock: ${clearance}px`)
 }
 if(errors.length) throw new Error(`${viewport.width}px browser errors ${JSON.stringify(errors)}`)
 console.log(JSON.stringify({viewport:viewport.width,landings,errors})); await context.close()
}
await browser.close()
