import SEO from '../components/SEO'
import FusionWorldStage, { type FusionWorldPortal } from '../components/fusion/FusionWorldStage'
import { useLang } from '../lib/LangContext'

export default function Home() {
  const { t } = useLang()
  const portals: FusionWorldPortal[] = [
    {
      to: '/gaming',
      title: t.v7.portals.games.title,
      subtitle: t.v7.portals.games.subtitle,
      tone: 'violet',
      icon: '🎮',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.games.title}`,
      panels: t.v7.portals.games.sections.map((section) => section[0]),
    },
    {
      to: '/science',
      title: t.v7.portals.science.title,
      subtitle: t.v7.portals.science.subtitle,
      tone: 'blue',
      icon: '⚛',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.science.title}`,
      panels: t.v7.portals.science.sections.map((section) => section[0]),
    },
    {
      to: '/green-node',
      title: t.v7.portals.green.title,
      subtitle: t.v7.portals.green.subtitle,
      tone: 'green',
      icon: '◉',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.green.title}`,
      panels: t.v7.portals.green.levels.map((level) => level[1]),
    },
    {
      to: '/fun',
      title: t.v7.portals.fun.title,
      subtitle: t.v7.portals.fun.subtitle,
      tone: 'orange',
      icon: '☻',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.fun.title}`,
      panels: t.v7.portals.fun.sections.map((section) => section[0]),
    },
  ]

  return (
    <div className="xeth-core min-h-screen overflow-hidden bg-[#050608] text-white">
      <SEO
        title="XETHKIOZ Fusion Alpha 1.4 Portal Engine"
        description="XETHKIOZ Fusion: World Gate Cyberpunk 3000 con portales funcionales, HUD persistente y Green Wisp como entidad viva."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />

      <FusionWorldStage
        eyebrow={t.v7.core.eyebrow}
        title={t.v7.core.title}
        description={t.v7.core.description}
        choosePortal={t.v7.core.choosePortal}
        enterLabel={t.v7.enter}
        portals={portals}
      />
    </div>
  )
}
