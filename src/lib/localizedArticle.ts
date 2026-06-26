import type { Article } from './types'
import type { Lang } from './i18n'

const copyBySlug: Record<string, Partial<Record<Lang, { title: string; excerpt?: string }>>> = {
  'gta-vi-lo-que-la-comunidad-gamer-deberia-mirar-en-2026': {
    en: { title: 'GTA VI: what the gaming community should watch in 2026', excerpt: 'A XETHKIOZ view on GTA VI, trends, community and creator opportunities.' },
    zh: { title: 'GTA VI：2026 年玩家社区值得关注的重点', excerpt: 'XETHKIOZ 视角：GTA VI、趋势、社区与创作者机会。' },
  },
  'league-of-legends-lo-que-la-comunidad-gamer-deberia-mirar-en-2026': {
    en: { title: 'League of Legends: what the gaming community should watch in 2026', excerpt: 'A XETHKIOZ view on League of Legends, esports trends and creator opportunities.' },
    zh: { title: '英雄联盟：2026 年玩家社区值得关注的重点', excerpt: 'XETHKIOZ 视角：英雄联盟、电竞趋势与创作者机会。' },
  },
  'pokemon-legends-lo-que-la-comunidad-gamer-deberia-mirar-en-2026': {
    en: { title: 'Pokémon Legends: what the gaming community should watch in 2026', excerpt: 'A XETHKIOZ view on Pokémon Legends, nostalgia, trends and community content.' },
    zh: { title: '宝可梦传说：2026 年玩家社区值得关注的重点', excerpt: 'XETHKIOZ 视角：宝可梦、怀旧、趋势与社区内容。' },
  },
  'mmorpg-asiaticos-lo-que-la-comunidad-gamer-deberia-mirar-en-2026': {
    en: { title: 'Asian MMORPGs: what LATAM should watch before the trend explodes', excerpt: 'A XETHKIOZ Asia Gaming radar for Korean, Japanese, Chinese and SEA releases.' },
    zh: { title: '亚洲 MMORPG：拉美市场爆发前值得关注的趋势', excerpt: 'XETHKIOZ Asia Gaming 观察韩国、日本、中国与东南亚新趋势。' },
  },
  'ia-generativa-como-cambia-el-futuro-de-los-creadores-digitales': {
    en: { title: 'Generative AI: how it changes the future of digital creators', excerpt: 'A clear analysis of generative AI across gaming, streaming and independent media.' },
    zh: { title: '生成式 AI：它如何改变数字创作者的未来', excerpt: '关于生成式 AI、游戏、直播与独立媒体的清晰分析。' },
  },
  'cms-propio-como-cambia-el-futuro-de-los-creadores-digitales': {
    en: { title: 'Custom CMS: how it changes the future of digital creators', excerpt: 'Why XETHKIOZ needs its own CMS to publish faster, safer and with stronger identity.' },
    zh: { title: '自建 CMS：它如何改变数字创作者的未来', excerpt: '为什么 XETHKIOZ 需要自己的 CMS：更快、更安全、更有品牌识别。' },
  },
}

export function getArticleCopy(article: Article, lang: Lang) {
  const direct = article as Article & {
    title_en?: string | null
    title_zh?: string | null
    excerpt_en?: string | null
    excerpt_zh?: string | null
  }

  if (lang === 'en') {
    return {
      title: direct.title_en || copyBySlug[article.slug]?.en?.title || article.title,
      excerpt: direct.excerpt_en || copyBySlug[article.slug]?.en?.excerpt || article.excerpt,
    }
  }

  if (lang === 'zh') {
    return {
      title: direct.title_zh || copyBySlug[article.slug]?.zh?.title || article.title,
      excerpt: direct.excerpt_zh || copyBySlug[article.slug]?.zh?.excerpt || article.excerpt,
    }
  }

  return { title: article.title, excerpt: article.excerpt }
}
