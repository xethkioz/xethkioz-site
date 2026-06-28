import { Link } from 'react-router-dom'
import { getEvidenceLabel, getFusionArticles, getFusionCmsQueue, getFusionMissions, getStatusLabel, type FusionPortalId } from '../../lib/fusionContent'
import { useLang } from '../../lib/LangContext'
import { useProfileProgress } from '../../lib/ProfileProgressContext'
import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

interface FusionContentPanelProps {
  tone: FusionTone
  portal?: FusionPortalId
  mode?: 'portal' | 'news' | 'community' | 'cms' | 'profile'
}

const portalToneById: Record<FusionPortalId, FusionTone> = {
  gaming: 'gaming',
  science: 'science',
  fun: 'fun',
  green: 'green',
}

export default function FusionContentPanel({ tone, portal, mode = 'portal' }: FusionContentPanelProps) {
  const { lang, t } = useLang()
  const { completedMissionIds, toggleMission, xp, level, profile, setFavoritePortal } = useProfileProgress()
  const articles = getFusionArticles(lang, portal)
  const allArticles = getFusionArticles(lang).filter((article) => article.portal !== 'green')
  const missions = getFusionMissions(lang)
  const cmsQueue = getFusionCmsQueue(lang)
  const ui = t.v7.functionality
  const panelKicker = mode === 'news' ? ui.newsEngine : mode === 'community' ? ui.communityEngine : mode === 'cms' ? ui.cmsEngine : mode === 'profile' ? ui.profileEngine : ui.dynamicContent
  const panelTitle = portal ? ui.portalContent : ui.latestContent

  return (
    <section className={`fusion-functionality ${fusionToneClass[tone]} mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-5 px-4 pb-12 sm:px-6 xl:grid-cols-3`}>
      <article className="fusion-system-panel xl:col-span-2">
        <div className="fusion-panel-kicker">{panelKicker}</div>
        <h2>{panelTitle}</h2>
        <div className="fusion-content-list">
          {(portal ? articles : allArticles).map((article) => (
            <div key={article.id} className={`fusion-content-item ${fusionToneClass[portalToneById[article.portal]]}`}>
              <div className="fusion-content-meta">
                <span>{article.category}</span>
                <span>{getStatusLabel(article.status, lang)}</span>
                <span>{article.readMinutes} {t.common.readTime}</span>
                {article.evidence ? <span>{getEvidenceLabel(article.evidence, lang)}</span> : null}
              </div>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <div className="fusion-content-footer">
                <span>{article.source}</span>
                <button type="button" onClick={() => toggleMission(`read-${article.id}`, article.xp)}>
                  {completedMissionIds.includes(`read-${article.id}`) ? ui.saved : `+${article.xp} XP`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <aside className="fusion-system-stack">
        <article className="fusion-system-panel">
          <div className="fusion-panel-kicker">{ui.profileEngine}</div>
          <h2>{profile.alias}</h2>
          <p>{ui.profilePreview}</p>
          <div className="fusion-profile-meter">
            <span>LVL {level}</span>
            <strong>{xp} XP</strong>
          </div>
          <div className="fusion-portal-choice">
            {(['gaming', 'science', 'fun'] as FusionPortalId[]).map((id) => (
              <button key={id} type="button" className={profile.favoritePortal === id ? 'active' : ''} onClick={() => setFavoritePortal(id)}>
                {id}
              </button>
            ))}
          </div>
          <Link to="/profile" className="fusion-panel-link">{ui.openProfile}</Link>
          <Link to="/login" className="fusion-panel-link">Cuenta</Link>
        </article>

        <article className="fusion-system-panel">
          <div className="fusion-panel-kicker">{ui.progressSystem}</div>
          <h2>{ui.missions}</h2>
          <div className="fusion-mission-list">
            {missions.map((mission) => (
              <button key={mission.id} type="button" className={completedMissionIds.includes(mission.id) ? 'completed' : ''} onClick={() => toggleMission(mission.id, mission.rewardXp)}>
                <span>{mission.title}</span>
                <small>{mission.description}</small>
                <strong>{mission.rewardXp} XP</strong>
              </button>
            ))}
          </div>
        </article>

        <article className="fusion-system-panel">
          <div className="fusion-panel-kicker">{ui.cmsEngine}</div>
          <h2>{ui.editorialQueue}</h2>
          <div className="fusion-cms-list">
            {cmsQueue.map((item) => (
              <div key={item.id}>
                <span>{getStatusLabel(item.status, lang)}</span>
                <strong>{item.title}</strong>
                <small>{item.owner}</small>
              </div>
            ))}
          </div>
          <Link to="/cms" className="fusion-panel-link">{ui.openCms}</Link>
        </article>
      </aside>
    </section>
  )
}
