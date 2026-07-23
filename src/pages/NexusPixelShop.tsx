import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  announceInventoryChange,
  inventoryItems,
  persistInventoryState,
  purchaseWithShards,
  readInventoryState,
  type InventoryItemId,
  type PixelInventoryState,
} from '../game/nexusPixelInventory'
import type { PixelLang } from '../game/nexusPixelRpg'

type ShopProduct = {
  itemId: Extract<InventoryItemId, 'nexus-berry' | 'signal-tonic' | 'portal-smoke'>
  amount: number
  shardCost: number
}

const products: ShopProduct[] = [
  { itemId: 'nexus-berry', amount: 2, shardCost: 1 },
  { itemId: 'signal-tonic', amount: 1, shardCost: 3 },
  { itemId: 'portal-smoke', amount: 1, shardCost: 5 },
]

const copy = {
  es: {
    eyebrow: 'CASA WISP // SUMINISTROS',
    title: 'Consumibles de aventura',
    description: 'Intercambiá fragmentos encontrados jugando. Ningún objeto comprado da ventaja competitiva.',
    balance: 'Fragmentos disponibles',
    buy: 'Canjear',
    insufficient: 'Necesitás más fragmentos Wisp.',
    success: 'Objeto agregado a la mochila.',
    supportTitle: '¿Querés apoyar el universo?',
    supportText: 'Las donaciones son voluntarias y están separadas del inventario. No compran poder, acceso al chat ni trato preferencial.',
    support: 'Ver formas de apoyo',
    close: 'Cerrar tienda',
  },
  en: {
    eyebrow: 'WISP HOUSE // SUPPLIES',
    title: 'Adventure consumables',
    description: 'Trade shards found while playing. No purchased item grants a competitive advantage.',
    balance: 'Available shards',
    buy: 'Trade',
    insufficient: 'You need more Wisp Shards.',
    success: 'Item added to your bag.',
    supportTitle: 'Want to support the universe?',
    supportText: 'Donations are voluntary and separate from inventory. They never buy power, chat access or preferential treatment.',
    support: 'View support options',
    close: 'Close shop',
  },
} as const

type Props = {
  lang: PixelLang
  onClose: () => void
  onNotice: (message: string) => void
}

export default function NexusPixelShop({ lang, onClose, onNotice }: Props) {
  const t = copy[lang]
  const [inventory, setInventory] = useState<PixelInventoryState>(readInventoryState)
  const shards = Number(inventory.items['wisp-shard'] || 0)

  function purchase(product: ShopProduct) {
    const next = purchaseWithShards(inventory, { itemId: product.itemId, amount: product.amount }, product.shardCost)
    if (!next) {
      onNotice(t.insufficient)
      return
    }
    persistInventoryState(next)
    announceInventoryChange()
    setInventory(next)
    onNotice(`${inventoryItems[product.itemId].name[lang]} · ${t.success}`)
  }

  return (
    <section className="xk-pixel-shop" role="dialog" aria-modal="true" aria-labelledby="nexus-pixel-shop-title">
      <header>
        <div><small>{t.eyebrow}</small><h2 id="nexus-pixel-shop-title">{t.title}</h2></div>
        <button type="button" onClick={onClose} aria-label={t.close}>×</button>
      </header>
      <p>{t.description}</p>
      <strong className="xk-pixel-shop-balance">{t.balance}: <b>✦ {shards}</b></strong>
      <div className="xk-pixel-shop-grid">
        {products.map((product) => {
          const item = inventoryItems[product.itemId]
          return (
            <article key={product.itemId}>
              <i aria-hidden="true">{item.glyph}</i>
              <div><h3>{item.name[lang]} ×{product.amount}</h3><p>{item.description[lang]}</p></div>
              <button type="button" disabled={shards < product.shardCost} onClick={() => purchase(product)}>{t.buy} · ✦ {product.shardCost}</button>
            </article>
          )
        })}
      </div>
      <aside>
        <div><strong>{t.supportTitle}</strong><p>{t.supportText}</p></div>
        <Link to="/support">{t.support} →</Link>
      </aside>
    </section>
  )
}
