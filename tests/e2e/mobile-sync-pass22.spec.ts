import { test, expect } from '@playwright/test'

for(const prefix of ['', '/en']) test(`Menú compacto de portales conserva acceso por teclado ${prefix||'es'}`,async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto(prefix||'/')
  const consent=page.getByRole('button',{name:/solo esenciales|essential only/i}).first();if(await consent.isVisible())await consent.click()
  const toggle=page.locator('.portal-navigation__controls button').last();await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded','true')
  const menu=page.locator('.portal-navigation__more');await expect(menu).toBeVisible();await expect(menu.locator('a')).toHaveCount(4)
  await expect(page.locator('.xk-wisp')).toBeHidden()
  await menu.locator('a').first().focus();await page.keyboard.press('Escape')
  await expect(menu).toBeHidden();await expect(toggle).toBeFocused()
})

test('Portales y sus controles caben en 320–1440 px, con el nodo debajo del trío',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});await page.goto('/');await expect(page.locator('.portal-gate')).toHaveCount(3)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true)
    const bounds=await page.locator('.portal-gate').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom}}))
    expect(bounds.every(r=>r.left>=0&&r.right<=width+1)).toBe(true)
    const node=await page.locator('.portal-node-rift').boundingBox();expect(node!.y).toBeGreaterThanOrEqual(Math.max(...bounds.map(r=>r.bottom))-2)
    if(width<601)expect(bounds[1].top).toBeGreaterThan(bounds[0].top)
    else expect(Math.max(...bounds.map(r=>r.top))-Math.min(...bounds.map(r=>r.top))).toBeLessThan(2)
  }
})

test('El chat conserva su cierre y Veyr no cubre el editor',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  for(const path of ['/', '/world-of-xethkioz/elemental-realms']){
    await page.goto(path);const consent=page.getByRole('button',{name:/solo esenciales|essential only/i}).first();if(await consent.isVisible())await consent.click()
    const launcher=page.locator('button[aria-controls="nexus-chat-panel"]');await launcher.click()
    await expect(page.locator('#nexus-chat-panel')).toBeVisible();await expect(page.locator('.xk-wisp')).toBeHidden()
    await expect(page.locator('#nexus-chat-panel button[type="submit"]')).toBeVisible()
    await launcher.click();await expect(page.locator('#nexus-chat-panel')).toHaveCount(0)
  }
})
