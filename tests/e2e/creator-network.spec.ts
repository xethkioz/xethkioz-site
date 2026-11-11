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

test('Perfil público inválido no expone cuentas ni datos privados',async({page})=>{
  await page.goto('/creador/no-es-uuid')
  await expect(page.getByRole('heading',{name:'Creador XETHKIOZ'})).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Perfil no disponible.')
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toHaveCount(1)
})
test('Registro y acceso conservan el destino del creador',async({page})=>{
  await page.goto('/account?mode=signup&redirect=%2Fpublicar')
  await expect(page.locator('.xk-creator-nav')).toHaveCount(1)
  await expect(page.locator('header').filter({hasText:'CREATOR NETWORK'})).toHaveCount(1)
  await expect(page.getByRole('heading',{name:/Tu cuenta de creador/})).toBeVisible()
  await expect(page.getByPlaceholder('Nombre visible')).toBeVisible()
  await page.getByRole('button',{name:'Ingresar',exact:true}).first().click()
  await expect(page).toHaveURL(/mode=signin/)
  await expect(page).toHaveURL(/redirect=%2Fpublicar/)
  await expect(page.getByPlaceholder('Nombre visible')).toHaveCount(0)
  await page.getByRole('button',{name:'Crear',exact:true}).first().click()
  await expect(page).toHaveURL(/redirect=%2Fpublicar/)
  await expect(page.getByPlaceholder('Nombre visible')).toBeVisible()
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})
test('Búsqueda inicial puede abrirse desde un enlace compartido',async({page})=>{
  await page.goto('/explorar?q=aventura')
  await expect(page.getByPlaceholder(/Buscar juegos/)).toHaveValue('aventura')
})

test('Interfaz compacta de 320 px sin desplazamiento horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  for (const path of ['/', '/explorar', '/account?mode=signup&redirect=%2Fpublicar', '/creador/no-es-uuid']) {
    await page.goto(path)
    await expect(page.locator('.xk-creator-nav')).toBeVisible()
    const extent = await page.evaluate(() => ({
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      viewport: window.innerWidth,
    }))
    expect(extent.scroll - extent.viewport, 'overflow in ' + path).toBeLessThanOrEqual(2)
    const links = page.locator('.xk-creator-nav a')
    for (let i = 0; i < await links.count(); i++) {
      const box = await links.nth(i).boundingBox()
      if (!box) continue
      expect(box.x, path + ': navigation link begins outside screen').toBeGreaterThanOrEqual(-2)
      expect(box.x + box.width, path + ': navigation link overflows screen').toBeLessThanOrEqual(322)
    }
  }
})
