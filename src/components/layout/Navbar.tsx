import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'
import { selectItemCount, useCartStore } from '../../store/cartStore'

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

const linkKeys = ['about', 'delivery', 'blog', 'contact'] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const lang = detectLangFromPath(location.pathname)
  const prefix = langPrefix(lang)
  const cartCount = useCartStore(selectItemCount)
  const openCart = useCartStore((s) => s.open)
  const bagControls = useAnimationControls()
  const prevCount = useRef(cartCount)

  useEffect(() => {
    if (cartCount > prevCount.current) {
      bagControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      })
    }
    prevCount.current = cartCount
  }, [cartCount, bagControls])

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

  // Pages whose top section is cream/light (product detail, checkout) need a
  // solid forest header from the start — otherwise the light logo/nav vanish
  // against the light background. Dark-hero pages (home, etc.) stay transparent
  // at the top as before, going solid only on scroll.
  const lightBgPage =
    location.pathname.includes('/product/') || location.pathname.endsWith('/checkout')
  const navOpaque = scrolled || mobileOpen || lightBgPage

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: navOpaque ? 'rgba(1,62,55, 0.92)' : 'rgba(1,62,55, 0)',
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

            <motion.button
              type="button"
              aria-label={t('nav.cart')}
              onClick={openCart}
              animate={bagControls}
              data-cursor-large
              className="relative text-white/90 hover:text-[var(--color-gold)] transition-colors"
            >
              <ShoppingBagIcon />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-[10px] font-medium"
                    style={{
                      background: 'var(--color-gold)',
                      color: 'var(--color-forest)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* MOBILE — cart + hamburger; the language switcher lives at the top
              of the opened menu so the bar stays uncramped on small phones. */}
          <div className="flex items-center gap-1 md:hidden">
            <motion.button
              type="button"
              aria-label={t('nav.cart')}
              onClick={openCart}
              animate={bagControls}
              className="relative w-10 h-10 grid place-items-center text-white"
            >
              <ShoppingBagIcon />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge-mobile"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-[10px] font-medium"
                    style={{
                      background: 'var(--color-gold)',
                      color: 'var(--color-forest)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              type="button"
              aria-label={mobileOpen ? t('common.close') : t('common.menu')}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative w-10 h-10 grid place-items-center text-white"
            >
              <Burger open={mobileOpen} />
            </button>
          </div>
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
          <>
            {/* dimmed backdrop — tap to close */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90] md:hidden"
              style={{
                background: 'rgba(1,30,27,0.6)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
              }}
              aria-hidden="true"
            />

            {/* forest sheet sliding down from the header */}
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 inset-x-0 z-[95] md:hidden"
              style={{
                background: 'var(--color-forest)',
                borderBottom: '1px solid rgba(200,169,110,0.22)',
                boxShadow: '0 30px 70px -28px rgba(0,0,0,0.7)',
              }}
              role="dialog"
              aria-modal="true"
            >
              <div className="px-6 pb-9" style={{ paddingTop: '94px' }}>
                {/* language switcher — compact, tappable, active highlighted */}
                <div
                  className="flex items-center gap-2 pb-6 mb-6"
                  style={{ borderBottom: '1px solid rgba(255,239,179,0.14)' }}
                >
                  {LANGS.map((l) => {
                    const active = l === lang
                    return (
                      <Link
                        key={l}
                        to={buildPath(l, location.pathname)}
                        aria-current={active ? 'true' : undefined}
                        className="grid place-items-center rounded-full uppercase text-[13px] tracking-[0.2em] transition-colors"
                        style={{
                          minWidth: '46px',
                          minHeight: '40px',
                          padding: '0 16px',
                          fontFamily: 'var(--font-body)',
                          background: active ? 'var(--color-gold)' : 'transparent',
                          color: active ? 'var(--color-forest)' : 'var(--color-cream)',
                          border: active
                            ? '1px solid var(--color-gold)'
                            : '1px solid rgba(255,239,179,0.28)',
                        }}
                      >
                        {l}
                      </Link>
                    )
                  })}
                </div>

                {/* primary nav — large, airy, Cormorant headings */}
                <nav className="flex flex-col">
                  {linkKeys.map((key, i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={`${prefix}/${key}`}
                        className="flex items-center text-[2rem] leading-none tracking-wide"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-cream)',
                          minHeight: '60px',
                          borderBottom:
                            i < linkKeys.length - 1
                              ? '1px solid rgba(255,239,179,0.1)'
                              : 'none',
                        }}
                      >
                        {t(`nav.${key}`)}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
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
