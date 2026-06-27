import { FUSION_LABEL, FUSION_STAGE } from '../../lib/fusionConfig'

interface FusionStatusRailProps {
  items?: string[]
}

export default function FusionStatusRail({ items = [] }: FusionStatusRailProps) {
  const statusItems = items.length > 0 ? items : ['Build estable', 'Portales aislados', 'Wisp activo']

  return (
    <aside className="fusion-status-rail" aria-label="Estado de XETHKIOZ Fusion">
      <span className="fusion-status-kicker">{FUSION_LABEL}</span>
      <strong>{FUSION_STAGE}</strong>
      <ul>
        {statusItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}
