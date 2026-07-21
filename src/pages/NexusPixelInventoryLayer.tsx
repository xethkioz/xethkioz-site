import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  collectPickup,
  inventoryItems,
  inventoryTotal,
  openPixelChest,
  persistInventoryState,
  pixelChests,
  pixelPickups,
  readInventoryState,
  roamingNpcs,
  type PixelChest,
  type PixelInventoryState,
} from '../game/nexusPixelInventory'
import { TILE_SIZE, type AreaId, type PixelLang, type Point } from '../game/nexusPixelRpg'
import { addWispXp } from '../lib/realtimeCommunity'
import './NexusPixelInventory.css'

type Props = {
  area: AreaId
  position: Point
  lang: PixelLang
  questCompleted: boolean
  onNotice: (message: string) => void
}

const copy = {
  es: {
    title: 'Mochila Nexus',
    open: 'Abrir inventario',
    close: 'Cerrar inventario',
    shortcut: 'Tecla I',
    empty: 'Todavía no encontraste objetos.',
    collected: 'Objetos encontrados',
    chests: 'Cofres abiertos',
    pickup: 'Recogiste',
    chestOpened: 'Cofre abierto',
    chestLocked: 'Este cofre se desbloquea al completar Reactivar las señales.',
    chestAlready: 'Este cofre ya fue reclamado.',
    approach: 'Acercate al cofre para abrirlo.',
    interact: 'E · Abrir cofre',
    total: 'objetos',
    roaming: 'Personaje ambulante',
  },
  en: {
    title: 'Nexus Bag',
    open: 'Open inventory',
    close: 'Close inventory',
    shortcut: 'I key',
    empty: 'You have not found any items yet.',
    collected: 'Items found',
    chests: 'Chests opened',
    pickup: 'Collected',
    chestOpened: 'Chest opened',
    chestLocked: 'This chest unlocks after completing Reactivate the signals.',
    chestAlready: 'This chest has already been claimed.',
    approach: 'Move closer to the chest to open it.',
    interact: 'E · Open chest',
    total: 'items',
    roaming: 'Roaming character',
  },
} as const

function rewardSummary(chest: PixelChest, lang: PixelLang) {
  return chest.rewards
    .map((reward) => `${inventoryItems[reward.itemId].name[lang]} ×${reward.amount}`)
    .join(' · ')
}

export default function NexusPixelInventoryLayer({ area, position, lang, questCompleted, onNotice }: Props) {
  const t = copy[lang]
  const [inventory, setInventory] = useState<PixelInventoryState>(readInventoryState)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [roamerTick, setRoamerTick] = useState(0)

  const areaPickups = useMemo(
    () => pixelPickups.filter((pickup) => pickup.area === area && !inventory.collected.includes(pickup.id)),
    [area, inventory.collected],
  )
  const areaChests = useMemo(() => pixelChests.filter((chest) => chest.area === area), [area])
  const nearbyChest = useMemo(
    () => areaChests.find((chest) => Math.abs(chest.x - position.x) + Math.abs(chest.y - position.y) <= 1),
    [areaChests, position.x, position.y],
  )
  const activePickup = useMemo(
    () => areaPickups.find((pickup) => pickup.x === position.x && pickup.y === position.y),
    [areaPickups, position.x, position.y],
  )
  const areaRoamers = useMemo(() => roamingNpcs.filter((npc) => npc.area === area), [area])

  useEffect(() => {
    persistInventoryState(inventory)
  }, [inventory])

  useEffect(() => {
    const timer = window.setInterval(() => setRoamerTick((current) => current + 1), 900)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!activePickup || inventory.collected.includes(activePickup.id)) return
    const item = inventoryItems[activePickup.itemId]
    setInventory((current) => collectPickup(current, activePickup))
    onNotice(`${t.pickup}: ${item.name[lang]} ×${activePickup.amount}`)
    if (activePickup.xp > 0) addWispXp(activePickup.xp, 'mission', `/nexus-city/room/xethkioz#pickup-${activePickup.id}`)
  }, [activePickup, inventory.collected, lang, onNotice, t.pickup])

  function openChest(chest: PixelChest) {
    if (inventory.openedChests.includes(chest.id)) {
      onNotice(t.chestAlready)
      return
    }
    if (chest.requiresQuest && !questCompleted) {
      onNotice(t.chestLocked)
      return
    }
    const distance = Math.abs(chest.x - position.x) + Math.abs(chest.y - position.y)
    if (distance > 1) {
      onNotice(t.approach)
      return
    }
    setInventory((current) => openPixelChest(current, chest))
    onNotice(`${t.chestOpened}: ${rewardSummary(chest, lang)}`)
    if (chest.xp > 0) addWispXp(chest.xp, 'mission', `/nexus-city/room/xethkioz#chest-${chest.id}`)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
      const key = event.key.toLowerCase()
      if (key === 'i') {
        event.preventDefault()
        setInventoryOpen((current) => !current)
        return
      }
      if (key === 'escape' && inventoryOpen) {
        setInventoryOpen(false)
        return
      }
      if (key === 'e' && nearbyChest) {
        event.preventDefault()
        openChest(nearbyChest)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const itemEntries = Object.values(inventoryItems).filter((item) => Number(inventory.items[item.id] || 0) > 0)
  const total = inventoryTotal(inventory)

  return (
    <>
      {areaPickups.map((pickup) => {
        const item = inventoryItems[pickup.itemId]
        return (
          <span
            key={pickup.id}
            className={`xk-pixel-pickup ${pickup.className} is-${item.rarity}`}
            style={{ left: pickup.x * TILE_SIZE, top: pickup.y * TILE_SIZE } as CSSProperties}
            title={item.name[lang]}
            aria-label={`${item.name[lang]} ×${pickup.amount}`}
          >
            <i aria-hidden="true">{item.glyph}</i>
          </span>
        )
      })}

      {areaChests.map((chest) => {
        const opened = inventory.openedChests.includes(chest.id)
        const locked = Boolean(chest.requiresQuest && !questCompleted)
        const near = nearbyChest?.id === chest.id
        return (
          <button
            key={chest.id}
            type="button"
            className={`xk-pixel-chest${opened ? ' is-opened' : ''}${locked ? ' is-locked' : ''}${near ? ' is-nearby' : ''}`}
            style={{ left: chest.x * TILE_SIZE, top: chest.y * TILE_SIZE } as CSSProperties}
            onClick={() => openChest(chest)}
            aria-label={opened ? t.chestAlready : locked ? t.chestLocked : `${t.chestOpened}: ${rewardSummary(chest, lang)}`}
          >
            <span aria-hidden="true">{opened ? '▱' : locked ? '▣' : '▰'}</span>
            {near && !opened ? <small>{t.interact}</small> : null}
          </button>
        )
      })}

      {areaRoamers.map((npc, npcIndex) => {
        const point = npc.path[(roamerTick + npcIndex) % npc.path.length]
        const line = npc.lines[(roamerTick + npcIndex) % npc.lines.length][lang]
        return (
          <button
            key={npc.id}
            type="button"
            className={`xk-pixel-roamer ${npc.className}`}
            style={{ left: point.x * TILE_SIZE, top: point.y * TILE_SIZE } as CSSProperties}
            onClick={() => onNotice(`${npc.name[lang]} · ${line}`)}
            aria-label={`${t.roaming}: ${npc.name[lang]}, ${npc.role[lang]}`}
          >
            <i aria-hidden="true" /><b aria-hidden="true">{npc.glyph}</b><em aria-hidden="true" /><small>{npc.name[lang]}</small>
          </button>
        )
      })}

      {typeof document !== 'undefined' ? createPortal(
        <div className="xk-pixel-inventory-root">
          {nearbyChest && !inventory.openedChests.includes(nearbyChest.id) ? (
            <button type="button" className="xk-pixel-chest-prompt" onClick={() => openChest(nearbyChest)}>{t.interact}</button>
          ) : null}
          <button
            type="button"
            className={`xk-pixel-inventory-toggle${total > 0 ? ' has-items' : ''}`}
            onClick={() => setInventoryOpen((current) => !current)}
            aria-expanded={inventoryOpen}
            aria-controls="nexus-pixel-inventory"
          >
            <span aria-hidden="true">▣</span><strong>{total}</strong><small>{t.shortcut}</small>
          </button>

          {inventoryOpen ? (
            <section id="nexus-pixel-inventory" className="xk-pixel-inventory" role="dialog" aria-modal="false" aria-labelledby="nexus-pixel-inventory-title">
              <header>
                <div><small>NEXUS_PACK // 01</small><h2 id="nexus-pixel-inventory-title">{t.title}</h2></div>
                <button type="button" onClick={() => setInventoryOpen(false)} aria-label={t.close}>×</button>
              </header>

              <div className="xk-pixel-inventory-stats">
                <span><strong>{inventory.collected.length}</strong>{t.collected}</span>
                <span><strong>{inventory.openedChests.length}</strong>{t.chests}</span>
                <span><strong>{total}</strong>{t.total}</span>
              </div>

              {itemEntries.length ? (
                <div className="xk-pixel-inventory-grid">
                  {itemEntries.map((item) => (
                    <article key={item.id} className={`is-${item.rarity}`}>
                      <i aria-hidden="true">{item.glyph}</i>
                      <div><strong>{item.name[lang]}</strong><p>{item.description[lang]}</p></div>
                      <b>×{inventory.items[item.id]}</b>
                    </article>
                  ))}
                </div>
              ) : <p className="xk-pixel-inventory-empty">{t.empty}</p>}
            </section>
          ) : null}
        </div>,
        document.body,
      ) : null}
    </>
  )
}
