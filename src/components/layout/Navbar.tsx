import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'

type Lang = 'tr' | 'en' | 'ru'

const LANGS: Lang[] = ['tr', 'en', 'ru']

function detectLangFromPath(pathname: string): Lang {
  if (pathname.startsWith('/en')) return 'en'
  if (pathname.startsWith('/ru')) return 'ru'
  return 'tr'
}

function buildPath(lang: Lang, currentPath: string): string {
  let rest = currentPath
  if (rest.startsWith('/en')) rest = rest.slice(3) || '/'
  else if (rest.startsWith('/ru')) rest = rest.slice(3) || '/'
  if (!rest.startsWith('/')) rest = '/' + rest
  if (lang === 'tr') return rest === '' ? '/' : rest
  return `/${lang}${rest === '/' ? '' : rest}`
}

function langPrefix(lang: Lang): string {
  return lang === 'tr' ? '' : `/${lang}`
}

const linkKeys = ['shop', 'services', 'delivery', 'about', 'contact'] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const lang = detectLangFromPath(location.pathname)
  const prefix = langPrefix(lang)

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    const lenis = getLenis()
    const threshold = 80

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => {
        setScrolled(scroll > threshold)
      }
      lenis.on('scroll', onScroll)
      setScrolled((lenis.scroll ?? 0) > threshold)
      return () => {
        lenis.off('scroll', onScroll)
      }
    }

    const onWindowScroll = () => setScrolled(window.scrollY > threshold)
    onWindowScroll()
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (mobileOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navOpaque = scrolled || mobileOpen

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: navOpaque ? 'rgba(28, 43, 26, 0.92)' : 'rgba(28, 43, 26, 0)',
          backdropFilter: navOpaque ? 'blur(12px)' : 'blur(0px)',
          borderBottomColor: navOpaque ? 'rgba(200, 169, 110, 0.18)' : 'rgba(200, 169, 110, 0)',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-[100] border-b"
        style={{
          borderBottomWidth: '1px',
          WebkitBackdropFilter: navOpaque ? 'blur(12px)' : undefined,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-center justify-between h-[78px]">
          <Link to={prefix || '/'} className="group flex flex-col leading-none">
            <span
              className="text-white text-[26px] md:text-[28px] italic tracking-[0.18em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FLORA ART
            </span>
            <span
              className="text-[10px] md:text-[11px] mt-1 tracking-[0.35em] uppercase"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
            >
              Fethiye · Florist
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {linkKeys.map((key) => {
              const to = `${prefix}/${key}`
              return (
                <NavLink
                  key={key}
                  to={to}
                  className={({ isActive }) =>
                    `relative text-[13px] tracking-[0.22em] uppercase transition-colors ${
                      isActive ? 'text-[var(--color-gold)] active' : 'text-white/85 hover:text-white'
                    } nav-link-underline`
                  }
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t(`nav.${key}`)}
                </NavLink>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <div
              className="flex items-center gap-2 text-[12px] tracking-[0.15em]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {LANGS.map((l, idx) => (
                <span key={l} className="flex items-center gap-2">
                  <Link
                    to={buildPath(l, location.pathname)}
                    className={`uppercase transition-colors ${
                      l === lang ? 'text-[var(--color-gold)]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {l}
                  </Link>
                  {idx < LANGS.length - 1 && <span className="text-white/30">·</span>}
                </span>
              ))}
            </div>

            <button
              type="button"
              aria-label={t('nav.cart')}
              className="relative text-white/90 hover:text-[var(--color-gold)] transition-colors"
            >
              <ShoppingBagIcon />
              <span
                className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-[10px] font-medium"
                style={{
                  background: 'var(--color-gold)',
                  color: 'var(--color-forest)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                122
              </span>
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? t('common.close') : t('common.menu')}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 grid place-items-center text-white"
          >
            <Burger open={mobileOpen} />
          </button>
        </div>

        <style>{`
          .nav-link-underline::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -6px;
            height: 1px;
            background: var(--color-gold);
            transform-origin: left center;
            transform: scaleX(0);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .nav-link-underline:hover::after,
          .nav-link-underline.active::after {
            transform: scaleX(1);
          }
        `}</style>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] md:hidden"
            style={{ background: 'var(--color-forest)' }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8">
              {linkKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`${prefix}/${key}`}
                    className="text-white text-4xl tracking-wide"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-6 flex items-center gap-3 text-sm tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {LANGS.map((l, idx) => (
                  <span key={l} className="flex items-center gap-3">
                    <Link
                      to={buildPath(l, location.pathname)}
                      className={`uppercase ${
                        l === lang ? 'text-[var(--color-gold)]' : 'text-white/60'
                      }`}
                    >
                      {l}
                    </Link>
                    {idx < LANGS.length - 1 && <span className="text-white/30">·</span>}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ShoppingBagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2l-3 4v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function Burger({ open }: { open: boolean }) {
  const base = {
    position: 'absolute' as const,
    left: '8px',
    right: '8px',
    height: '1.5px',
    background: 'currentColor',
    borderRadius: '2px',
    transition:
      'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease, top 0.35s cubic-bezier(0.16,1,0.3,1)',
  }
  return (
    <span className="relative block w-6 h-6">
      <span
        style={{
          ...base,
          top: open ? '11px' : '6px',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}
      />
      <span
        style={{
          ...base,
          top: '11px',
          opacity: open ? 0 : 1,
        }}
      />
      <span
        style={{
          ...base,
          top: open ? '11px' : '16px',
          transform: open ? 'rotate(-45deg)' : 'rotate(0)',
        }}
      />
    </span>
  )
}
