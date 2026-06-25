import { useMemo } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useProducts } from '../hooks/useProducts'
import { getBlogPost, getRelatedProducts, type BlogPost } from '../data/blogContent'
import ProductCard from '../components/ui/ProductCard'
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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const post = getBlogPost(slug)

  if (!post) return <Navigate to={`${prefix}/blog`} replace />
  return <BlogPostContent key={post.slug} post={post} prefix={prefix} lang={langFromPath(location.pathname)} />
}

function BlogPostContent({
  post,
  prefix,
  lang,
}: {
  post: BlogPost
  prefix: string
  lang: Locale
}) {
  const { t } = useTranslation()
  const { products } = useProducts()

  useSEO({
    title: `${post.title[lang]} | Flora Art Fethiye`,
    description: post.metaDescription[lang],
    image: post.heroImage,
  })

  const related = useMemo(() => getRelatedProducts(post, products), [post, products])

  return (
    <>
      {/* Hero — full-bleed image under a forest gradient (keeps the navbar legible) */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: '46vh' }}
      >
        <img
          src={post.heroImage}
          alt={post.title[lang]}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Top-weighted forest gradient keeps the fixed navbar legible over the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(1,62,55,0.72) 0%, rgba(1,62,55,0.12) 45%, rgba(1,62,55,0) 100%)',
          }}
        />
      </section>

      {/* Article — centered reading column */}
      <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
        <article className="mx-auto max-w-3xl px-6 lg:px-8 py-12 md:py-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bronze)' }}
          >
            <Link to={prefix || '/'} className="transition-colors hover:text-[var(--color-gold)]">
              {t('shop.breadcrumbHome')}
            </Link>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
            <Link to={`${prefix}/blog`} className="transition-colors hover:text-[var(--color-gold)]">
              {t('blog.title')}
            </Link>
          </nav>

          <p
            className="mb-4 text-[0.72rem] uppercase tracking-[0.32em]"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-display)', fontVariant: 'small-caps' }}
          >
            {t(`blog.categories.${post.category}`)}
          </p>

          {/* H1 — forest→gold gradient accent so the flower/topic title stands out */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              backgroundImage:
                'linear-gradient(92deg, var(--color-forest) 0%, var(--color-forest) 55%, var(--color-bronze) 80%, var(--color-gold) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {post.title[lang]}
          </motion.h1>

          {/* Gold accent + clear separation between the title block and the body */}
          <span
            aria-hidden="true"
            className="mt-6 mb-8 block h-px w-16 lg:mb-10"
            style={{ background: 'var(--color-gold)' }}
          />

          <div className="flex flex-col gap-6">
            {post.body[lang].map((paragraph, i) => (
              <p
                key={i}
                className="text-[1.02rem] leading-[1.85] md:text-[1.08rem]"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section
          className="relative w-full"
          style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <h2
              className="italic mb-10 md:mb-14"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('blog.relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
              {related.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to all posts */}
      <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 pb-20 md:pb-28 text-center">
          <Link
            to={`${prefix}/blog`}
            className="back-to-blog group inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base uppercase tracking-[0.22em] transition-colors duration-300"
            style={{
              background: 'transparent',
              color: 'var(--color-forest)',
              border: '1.5px solid var(--color-gold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span
              aria-hidden="true"
              className="inline-flex transition-transform duration-300 group-hover:-translate-x-1"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span>{t('blog.allPosts')}</span>
          </Link>
        </div>

        <style>{`
          .back-to-blog:hover {
            background: var(--color-gold) !important;
            border-color: var(--color-gold) !important;
            color: var(--color-forest) !important;
          }
        `}</style>
      </section>
    </>
  )
}
