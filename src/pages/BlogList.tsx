import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { BLOG_POSTS, type BlogCategory, type BlogPost } from '../data/blogContent'
import type { Locale } from '../types'

const EASE = [0.16, 1, 0.3, 1] as const

function langFromPath(pathname: string): Locale {
  if (pathname.startsWith('/en')) return 'en'
  if (pathname.startsWith('/ru')) return 'ru'
  return 'tr'
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

type Filter = 'all' | BlogCategory

export default function BlogList() {
  const { t } = useTranslation()
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const prefix = langPrefix(location.pathname)
  const [filter, setFilter] = useState<Filter>('all')

  useSEO({
    title: `${t('blog.title')} | Flora Art Fethiye`,
    description: t('blog.metaDescription') as string,
  })

  // Only surface category chips that actually have posts.
  const categories = useMemo<Filter[]>(() => {
    const present = Array.from(new Set(BLOG_POSTS.map((p) => p.category)))
    return ['all', ...present]
  }, [])

  const posts = useMemo(
    () => (filter === 'all' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <>
      {/* Hero */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', minHeight: '38vh' }}
      >
        <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[130px] pb-12 md:pb-14 min-h-[38vh] flex flex-col justify-end">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold)' }}
          >
            <Link to={prefix || '/'} className="opacity-80 transition-opacity hover:opacity-100">
              {t('shop.breadcrumbHome')}
            </Link>
            <span aria-hidden="true" style={{ opacity: 0.55 }}>·</span>
            <span style={{ color: 'var(--color-cream)', opacity: 0.85 }}>{t('blog.title')}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              lineHeight: 0.98,
            }}
          >
            {t('blog.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="mt-5 max-w-[56ch] text-[15px] leading-relaxed md:text-[16px]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('blog.intro')}
          </motion.p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-14 md:py-20">
          {/* Category filter */}
          {categories.length > 2 && (
            <div className="mb-10 flex flex-wrap gap-3" role="tablist" aria-label={t('blog.title') as string}>
              {categories.map((c) => {
                const active = filter === c
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(c)}
                    className="rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300"
                    style={{
                      background: active ? 'var(--color-forest)' : 'transparent',
                      color: active ? 'var(--color-cream)' : 'var(--color-forest)',
                      border: `1px solid ${active ? 'var(--color-forest)' : 'rgba(1,62,55,0.25)'}`,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {t(`blog.categories.${c}`)}
                  </button>
                )
              })}
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} lang={lang} prefix={prefix} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function BlogCard({
  post,
  lang,
  prefix,
  index,
}: {
  post: BlogPost
  lang: Locale
  prefix: string
  index: number
}) {
  const { t } = useTranslation()
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.05 * (index % 6) }}
      whileHover={{ y: -4 }}
      className="group flex flex-col transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(1,62,55,0.32)]"
    >
      <Link
        to={`${prefix}/blog/${post.slug}`}
        className="relative block overflow-hidden"
        style={{ background: 'var(--color-beige)', aspectRatio: '3 / 2' }}
      >
        <img
          src={post.heroImage}
          alt={post.title[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <p
          className="mb-2 text-[0.72rem] uppercase tracking-[0.3em]"
          style={{
            color: 'var(--color-bronze)',
            fontFamily: 'var(--font-display)',
            fontVariant: 'small-caps',
          }}
        >
          {t(`blog.categories.${post.category}`)}
        </p>

        <h2 className="mb-3">
          <Link
            to={`${prefix}/blog/${post.slug}`}
            className="italic transition-colors hover:text-[var(--color-gold)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              color: 'var(--color-forest)',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            {post.title[lang]}
          </Link>
        </h2>

        <p
          className="mb-5 text-[14px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.78 }}
        >
          {post.metaDescription[lang]}
        </p>

        <Link
          to={`${prefix}/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 hover:text-[var(--color-gold)]"
          style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-body)' }}
        >
          <span>{t('blog.readMore')}</span>
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </motion.article>
  )
}
