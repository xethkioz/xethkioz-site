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
    },
    {
      to: '/science',
      title: t.v7.portals.science.title,
      subtitle: t.v7.portals.science.subtitle,
      tone: 'blue',
      icon: '⚛',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.science.title}`,
    },
    {
      to: '/fun',
      title: t.v7.portals.fun.title,
      subtitle: t.v7.portals.fun.subtitle,
      tone: 'orange',
      icon: '☻',
      ariaLabel: `${t.v7.enter}: ${t.v7.portals.fun.title}`,
    },
  ]

  return (
    <div className="xeth-core min-h-screen overflow-hidden bg-[#050608] text-white">
      <SEO
        title="XETHKIOZ Fusion Alpha Live"
        description="XETHKIOZ Fusion: base live estable con portales funcionales, HUD persistente y Green Wisp como Easter Egg."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />

      <FusionWorldStage
        eyebrow={t.v7.core.eyebrow}
        title={t.v7.core.title}
        description={t.v7.core.description}
        choosePortal={t.v7.core.choosePortal}
        enterLabel={t.v7.enter}
        wispLabel={t.v7.core.wispLabel}
        portals={portals}
      />
    </div>
  )
}
