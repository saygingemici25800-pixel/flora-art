import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface SEOOptions {
  title: string
  description: string
  image?: string
  canonicalPath?: string
}

type Lang = 'tr' | 'en' | 'ru'

function detectLang(pathname: string): Lang {
  if (pathname.startsWith('/en')) return 'en'
  if (pathname.startsWith('/ru')) return 'ru'
  return 'tr'
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSEO({ title, description, image, canonicalPath }: SEOOptions) {
  const location = useLocation()
  const { t } = useTranslation()
  const siteUrl = (t('seo.siteUrl') as string) || 'https://floraartfethiye.com'
  const defaultImage = (t('seo.image') as string) || `${siteUrl}/og-image.svg`
  const siteName = (t('seo.siteName') as string) || 'Flora Art Fethiye'

  useEffect(() => {
    const lang = detectLang(location.pathname)
    const path = canonicalPath ?? location.pathname
    const canonicalUrl = `${siteUrl}${path}`
    const ogImage = image ?? defaultImage

    document.title = title
    document.documentElement.lang = lang

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', siteName)
    setMeta(
      'property',
      'og:locale',
      lang === 'tr' ? 'tr_TR' : lang === 'en' ? 'en_US' : 'ru_RU',
    )

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)

    setLink('canonical', canonicalUrl)
  }, [
    title,
    description,
    image,
    canonicalPath,
    location.pathname,
    siteUrl,
    defaultImage,
    siteName,
  ])
}
