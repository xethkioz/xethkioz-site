import { test, expect } from '@playwright/test'

test('Home nueva: plataforma y accesos esenciales', async ({page}) => {
  await page.goto('/')
  await expect(page.getByRole('heading',{name:/Ideas que inspiran/})).toBeVisible()
  await expect(page.getByRole('link',{name:/Explorar proyectos/})).toBeVisible()
  await expect(page.locator('.xk-universe-tabs')).toHaveCount(0)
  for(const href of ['/green-node','/science','/mascotas/']) await expect(page.locator('a[href="'+href+'"]').first()).toBeVisible()
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})
test('Explorar: enlace directo, buscador y categorías',async ({page})=>{
  await page.goto('/explorar')
  await expect(page.getByRole('heading',{name:/Descubrí lo próximo/})).toBeVisible()
  await expect(page.getByPlaceholder(/Buscar juegos/)).toBeVisible()
  await page.getByRole('button',{name:/Videojuegos/}).click()
  await expect(page.getByRole('button',{name:/Videojuegos/})).toHaveAttribute('aria-pressed','true')
})
test('Publicar requiere cuenta',async ({page})=>{
  await page.goto('/publicar')
  await expect(page).toHaveURL(/\/account\?mode=signin/)
})
test('Secciones preservadas',async ({page})=>{
  for(const path of ['/green-node','/science']){
    await page.goto(path)
    await expect(page.locator('#main-content')).toBeVisible()
  }
  const response=await page.goto('/mascotas/')
  expect(response?.status()).toBeLessThan(400)
})
