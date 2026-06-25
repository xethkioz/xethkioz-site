import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { useCategories, useAuthors, useArticles, useMedia } from '../lib/hooks'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
export default function Admin() {
  const { t } = useLang()
  const { categories } = useCategories()
  const { authors } = useAuthors()
  const { articles, loading: al } = useArticles({ limit: 50 })
  const { media } = useMedia()
  const [tab, setTab] = useState<'article' | 'media' | 'list'>('article')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [af, setAf] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category_id: '', author_id: '', tags: '', is_featured: false, is_trending: false, is_editors_pick: false, is_popular: false })
  const [mf, setMf] = useState({ title: '', type: 'image', url: '', thumbnail: '', description: '', is_featured: false })
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
  const hc = (f: string, v: string | boolean) => setAf((p) => ({ ...p, [f]: v, ...(f === 'title' ? { slug: slugify(v as string) } : {}) }))
  const pa = async (e: React.FormEvent) => { e.preventDefault(); setStatus('loading'); try { const { error } = await supabase.from('articles').insert({ title: af.title, slug: af.slug, excerpt: af.excerpt, content: af.content, cover_image: af.cover_image || null, category_id: af.category_id || null, author_id: af.author_id || null, tags: af.tags.split(',').map((t) => t.trim()).filter(Boolean), is_featured: af.is_featured, is_trending: af.is_trending, is_editors_pick: af.is_editors_pick, is_popular: af.is_popular, status: 'published' }); if (error) throw error; setStatus('success'); setAf({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category_id: '', author_id: '', tags: '', is_featured: false, is_trending: false, is_editors_pick: false, is_popular: false }) } catch { setStatus('error') }; setTimeout(() => setStatus('idle'), 5000) }
  const um = async (e: React.FormEvent) => { e.preventDefault(); setStatus('loading'); try { const { error } = await supabase.from('media_items').insert({ title: mf.title, type: mf.type, url: mf.url, thumbnail: mf.thumbnail || null, description: mf.description || null, is_featured: mf.is_featured }); if (error) throw error; setStatus('success'); setMf({ title: '', type: 'image', url: '', thumbnail: '', description: '', is_featured: false }) } catch { setStatus('error') }; setTimeout(() => setStatus('idle'), 5000) }
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.admin.title} />
      <div className="text-center mb-8"><div className="text-4xl mb-3">⚙️</div><h1 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-2">{t.admin.title}</h1><p className="text-sm text-gray-400">{t.admin.subtitle}</p></div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">{[{ k: 'article', l: t.admin.newArticle }, { k: 'media', l: t.admin.mediaUpload }, { k: 'list', l: t.admin.articles }].map((tb) => <button key={tb.k} onClick={() => setTab(tb.k as 'article' | 'media' | 'list')} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${tab === tb.k ? 'text-orange border-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>{tb.l}</button>)}</div>
      {status === 'success' && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center animate-fade-in">{t.admin.published}</div>}
      {status === 'error' && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center animate-fade-in">{t.admin.error}</div>}
      {tab === 'article' && (
        <form onSubmit={pa} className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.titleField}</label><input type="text" required value={af.title} onChange={(e) => hc('title', e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.slugField}</label><input type="text" required value={af.slug} onChange={(e) => hc('slug', e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.excerptField}</label><textarea required rows={2} value={af.excerpt} onChange={(e) => hc('excerpt', e.target.value)} className="input-field resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.contentField}</label><textarea required rows={6} value={af.content} onChange={(e) => hc('content', e.target.value)} className="input-field resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.coverImageField}</label><input type="url" value={af.cover_image} onChange={(e) => hc('cover_image', e.target.value)} className="input-field" placeholder="https://..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.categoryField}</label><select value={af.category_id} onChange={(e) => hc('category_id', e.target.value)} className="input-field"><option value="">—</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.authorField}</label><select value={af.author_id} onChange={(e) => hc('author_id', e.target.value)} className="input-field"><option value="">—</option>{authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.tagsField}</label><input type="text" value={af.tags} onChange={(e) => hc('tags', e.target.value)} className="input-field" placeholder="gaming, esports, news" /></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[{ k: 'is_featured', l: t.admin.featuredField }, { k: 'is_trending', l: t.admin.trendingField }, { k: 'is_editors_pick', l: t.admin.editorsPickField }, { k: 'is_popular', l: t.admin.popularField }].map((cb) => <label key={cb.k} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={af[cb.k as keyof typeof af] as boolean} onChange={(e) => hc(cb.k, e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-ink-400 text-orange focus:ring-orange" />{cb.l}</label>)}</div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-50">{status === 'loading' ? t.admin.publishing : t.admin.publish}</button>
        </form>
      )}
      {tab === 'media' && (
        <form onSubmit={um} className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.mediaTitle}</label><input type="text" required value={mf.title} onChange={(e) => setMf({ ...mf, title: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.mediaType}</label><select value={mf.type} onChange={(e) => setMf({ ...mf, type: e.target.value })} className="input-field"><option value="image">Image</option><option value="video">Video</option><option value="short">Short</option><option value="reel">Reel</option><option value="carousel">Carousel</option></select></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.mediaUrl}</label><input type="url" required value={mf.url} onChange={(e) => setMf({ ...mf, url: e.target.value })} className="input-field" placeholder="https://..." /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.admin.mediaThumbnail}</label><input type="url" value={mf.thumbnail} onChange={(e) => setMf({ ...mf, thumbnail: e.target.value })} className="input-field" placeholder="https://..." /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label><textarea rows={2} value={mf.description} onChange={(e) => setMf({ ...mf, description: e.target.value })} className="input-field resize-none" /></div>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={mf.is_featured} onChange={(e) => setMf({ ...mf, is_featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-ink-400 text-orange focus:ring-orange" />{t.admin.featuredField}</label>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-50">{status === 'loading' ? '...' : t.admin.upload}</button>
        </form>
      )}
      {tab === 'list' && (
        <div className="space-y-3">
          {al ? <div className="text-center py-10 text-gray-500">{t.common.loading}</div> : articles.length === 0 ? <div className="text-center py-10 text-gray-500">{t.common.noContent}</div> : articles.map((a) => <div key={a.id} className="glass border border-white/10 rounded-lg p-4 flex items-center gap-4"><SafeImage src={a.cover_image} fallback="/images/articles/fallback.svg" alt={a.title} className="w-16 h-16 rounded object-cover flex-shrink-0" /><div className="flex-1 min-w-0"><h3 className="text-sm font-semibold text-white line-clamp-1">{a.title}</h3><p className="text-xs text-gray-500">{a.category?.name} • {new Date(a.published_at).toLocaleDateString()}</p></div><div className="flex gap-1 flex-shrink-0">{a.is_featured && <span className="text-xs text-orange">⭐</span>}{a.is_trending && <span className="text-xs text-red-400">🔥</span>}</div></div>)}
          <div className="pt-4 text-xs text-gray-500 text-center">{media.length} media items • {articles.length} articles</div>
        </div>
      )}
    </div>
  )
}
