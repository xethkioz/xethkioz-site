import { test,expect } from '@playwright/test'

test('Home EN llega directamente al juego y mantiene canonical e idioma',async({page})=>{
  await page.goto('/en');const consent=page.getByRole('button',{name:/essential only/i}).first();if(await consent.isVisible())await consent.click()
  await page.locator('.portal-gate[data-tone="fire"]').click()
  await expect(page).toHaveURL(/\/en\/world-of-xethkioz\/elemental-realms$/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.xethkioz.com.ar/en/world-of-xethkioz/elemental-realms')
  await page.getByRole('button',{name:'Switch to Spanish',exact:true}).click()
  await expect(page).toHaveURL(/\/world-of-xethkioz\/elemental-realms$/);await expect(page.locator('html')).toHaveAttribute('lang','es-AR')
})

for(const prefix of ['', '/en'])test(`Green Node abre contenido público sin otra puerta ${prefix||'es'}`,async({page})=>{
  await page.goto(prefix||'/');const consent=page.getByRole('button',{name:/solo esenciales|essential only/i}).first();if(await consent.isVisible())await consent.click()
  await page.locator('.portal-node-rift').click();await expect(page).toHaveURL(new RegExp(`${prefix}/green-node$`))
  await expect(page.locator('.portal-node-interior')).toHaveAttribute('data-portal-theme','node')
  await expect(page.locator('#green-title')).toBeVisible();await expect(page.locator('.xk-green-entry')).toHaveCount(0)
  await expect(page.locator('.xk-green-view-nav button')).toHaveCount(4)
})

test('Green Node no falla cuando el almacenamiento de sesión está bloqueado',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked for test','SecurityError')}}))
  await page.goto('/green-node');await expect(page.locator('#green-title')).toBeVisible();await expect(page).toHaveURL(/\/green-node$/)
})

test('Digital diferencia servicios, IA local, ArgenCiencia y cursos digitales',async({page})=>{
  await page.goto('/digital');await expect(page.locator('.portal-digital')).toHaveAttribute('data-portal-theme','ice')
  await expect(page.locator('.portal-digital__services>article')).toHaveCount(4)
  await expect(page.locator('.portal-digital__services a[href="/creacion-web"]')).toHaveCount(1)
  await expect(page.locator('.portal-digital__services a[href="/digital/cursos"]')).toHaveCount(1)
  await expect(page.locator('.portal-digital__services a[href="https://argenciencia.com/"]')).toHaveAttribute('target','_blank')
  await expect(page.locator('#veyr')).toContainText('VEYR')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true)
})
