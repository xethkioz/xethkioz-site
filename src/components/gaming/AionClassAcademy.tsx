import { useEffect, useState } from 'react'
import { useAdminSession } from '../../cms/hooks'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'
import './AionClassAcademy.css'

const classes = [
  { id: 'gladiator', name: 'Gladiator', role: 'DPS cuerpo a cuerpo', description: 'Combate frontal, presión sostenida y daño físico contra objetivos y grupos.' },
  { id: 'templar', name: 'Templar', role: 'Tanque / primera línea', description: 'Protección del grupo, control de amenazas y apertura de espacio para avanzar.' },
  { id: 'assassin', name: 'Assassin', role: 'DPS / eliminación', description: 'Movilidad, sigilo y ráfagas de daño para castigar objetivos aislados.' },
  { id: 'ranger', name: 'Ranger', role: 'DPS a distancia', description: 'Daño de largo alcance, control y reposicionamiento táctico.' },
  { id: 'sorcerer', name: 'Sorcerer', role: 'DPS mágico / área', description: 'Poder arcano, control de zona y ventanas de daño de gran impacto.' },
  { id: 'spiritmaster', name: 'Spiritmaster', role: 'DPS mágico / control', description: 'Debilitaciones y presión constante para desgastar y desorganizar rivales.' },
  { id: 'cleric', name: 'Cleric', role: 'Sanación / soporte', description: 'Curación y protección; la prioridad de objetivos sostiene al escuadrón.' },
  { id: 'chanter', name: 'Chanter', role: 'Apoyo / refuerzos', description: 'Mejoras y utilidad para elevar el daño, la resistencia y el ritmo del grupo.' },
] as const

export default function AionClassAcademy({ es }: { es: boolean }) {
  const { user, isAdmin } = useAdminSession()
  const [videos, setVideos] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      if (!isSupabaseConfigured) return
      const { data } = await supabase.from('aion_class_videos').select('class_id, video_url')
      if (alive && data) {
        const next: Record<string, string> = {}
        data.forEach((row: { class_id: string; video_url: string | null }) => { if (row.video_url) next[row.class_id] = row.video_url })
        setVideos(next)
      }
    }
    void load()
    return () => { alive = false }
  }, [])

  async function upload(classId: string, file?: File) {
    if (!file) return
    if (!user || !isAdmin) { setStatus(es ? 'Ingresá con la cuenta administradora para cargar vídeos.' : 'Sign in with the administrator account to upload videos.'); return }
    if (!file.type.startsWith('video/')) { setStatus(es ? 'El archivo debe ser un vídeo.' : 'The file must be a video.'); return }
    if (file.size > 500 * 1024 * 1024) { setStatus(es ? 'El límite por vídeo es 500 MB.' : 'The per-video limit is 500 MB.'); return }
    setBusy(classId); setStatus('')
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = user.id + '/' + classId + '/' + Date.now() + '-' + safeName
      const { error: uploadError } = await supabase.storage.from('aion-class-videos').upload(path, file, { contentType: file.type, upsert: true, cacheControl: '3600' })
      if (uploadError) throw uploadError
      const { data: publicData } = supabase.storage.from('aion-class-videos').getPublicUrl(path)
      const { error: saveError } = await supabase.from('aion_class_videos').upsert({ class_id: classId, video_path: path, video_url: publicData.publicUrl, uploaded_by: user.id, updated_at: new Date().toISOString() }, { onConflict: 'class_id' })
      if (saveError) throw saveError
      setVideos(current => ({ ...current, [classId]: publicData.publicUrl }))
      setStatus(es ? 'Vídeo actualizado correctamente.' : 'Video updated successfully.')
    } catch (error) { setStatus(error instanceof Error ? error.message : (es ? 'No se pudo cargar el vídeo.' : 'Video upload failed.')) }
    finally { setBusy(null) }
  }

  return <section className='portal-section aion-academy' id='clases-aion2' aria-labelledby='aion-academy-title'>
    <header className='aion-academy__heading'><p className='portal-eyebrow'>AION 2 // INNER CIRCLE CLASS ARCHIVE</p><h2 id='aion-academy-title'>{es ? 'Clases de Atreia' : 'Classes of Atreia'}</h2><p>{es ? 'Conocé cada rol y consultá las guías en vídeo de la legión Elyos.' : 'Explore every role and watch class guides from the Elyos legion.'}</p></header>
    {status && <p className='aion-academy__status' role='status'>{status}</p>}
    {!isSupabaseConfigured && <p className='aion-academy__status'>{es ? 'La biblioteca de vídeos necesita que se configure el almacenamiento.' : 'Video library requires storage configuration.'}</p>}
    <div className='aion-academy__grid'>{classes.map(item => <article className='aion-academy__card' key={item.id}>
      <div className='aion-academy__title'><span aria-hidden='true'>♰</span><div><h3>{item.name}</h3><small>{item.role}</small></div></div>
      <p>{item.description}</p>
      <div className='aion-academy__video'>{videos[item.id] ? <video controls preload='metadata' playsInline src={videos[item.id]} aria-label={item.name + ' class guide'} /> : <div className='aion-academy__empty'><span>▶</span><b>{es ? 'Guía en vídeo' : 'Video guide'}</b><small>{es ? 'Próximamente' : 'Coming soon'}</small></div>}</div>
      {user && isAdmin && <label className='aion-academy__upload'><span>{busy === item.id ? (es ? 'Subiendo…' : 'Uploading…') : (es ? 'Cargar / reemplazar vídeo' : 'Upload / replace video')}<input type='file' accept='video/mp4,video/webm,video/ogg,video/quicktime' disabled={busy !== null} onChange={event => { void upload(item.id, event.currentTarget.files?.[0]); event.currentTarget.value = '' }} /></span></label>}
    </article>)}</div>
    {user && isAdmin ? <p className='aion-academy__admin'>{es ? 'Sesión administradora activa · máximo 500 MB por archivo.' : 'Administrator session active · 500 MB max per file.'}</p> : <a className='aion-academy__login' href='/account?mode=signin&redirect=%2Faion2%2Finnercircle%23clases-aion2'>{es ? 'Ingresar para administrar vídeos ↗' : 'Sign in to manage videos ↗'}</a>}
  </section>
}