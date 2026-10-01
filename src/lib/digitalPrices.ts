// Fixed commercial prices confirmed by the owner on 01/10/2026 (Argentina).
// This is an agreed conversion for this catalog, not a live exchange-rate feed.
export const DIGITAL_USD_TO_ARS = 1900
export const DIGITAL_PRICES = {
  course: { usd: 12, ars: 12 * DIGITAL_USD_TO_ARS },
  project: { usd: 35, ars: 35 * DIGITAL_USD_TO_ARS },
} as const

export function digitalArsLabel(amount: number, language: string): string {
  return `ARS ${amount.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')}`
}
