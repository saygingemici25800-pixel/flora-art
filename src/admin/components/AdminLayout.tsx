/**
 * Admin shell: fixed 240px sidebar + offset content column + sticky topbar +
 * routed <Outlet/>. Layout offsets are driven by explicit CSS (admin.css,
 * `.admin-sidebar` / `.admin-main`) with a 768px breakpoint rather than
 * Tailwind responsive utilities, so the content can never slide under the
 * fixed sidebar. Below 768px the sidebar collapses to a hamburger drawer.
 */
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useAuth } from '../lib/useAuth'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

const NAV: NavItem[] = [
  { to: '/admin', label: 'Panel', icon: <GridIcon />, end: true },
  { to: '/admin/products', label: 'Ürünler', icon: <FlowerIcon /> },
  { to: '/admin/orders', label: 'Siparişler', icon: <BagIcon /> },
  { to: '/admin/coupons', label: 'Kuponlar', icon: <TagIcon /> },
  { to: '/admin/stock', label: 'Günlük Stok', icon: <CalendarIcon /> },
]

const TODAY = new Intl.DateTimeFormat('tr-TR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const logout = useAuth((s) => s.logout)

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))

  return (
    <div className="admin-shell">
      {/* Desktop sidebar — fixed, 240px, shown ≥768px via .admin-sidebar */}
      <aside className="admin-sidebar">
        <SidebarContent onNavigate={() => {}} onLogout={logout} />
      </aside>

      {/* Mobile drawer (<768px) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="admin-drawer fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: 'rgba(28,43,26,0.45)' }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="admin-drawer fixed inset-y-0 left-0 z-50"
              style={{ width: 240 }}
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
            >
              <SidebarContent onNavigate={() => setDrawerOpen(false)} onLogout={logout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content column — offset by the sidebar width (margin-left:240px ≥768px) */}
      <div className="admin-main">
        <header
          className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 bg-white/85 px-4 backdrop-blur sm:px-7"
          style={{ borderBottom: '1px solid var(--color-beige)' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menüyü aç"
              className="admin-menu-btn h-9 w-9 items-center justify-center"
              style={{ border: '1px solid var(--color-beige)', borderRadius: 2, color: 'var(--color-forest)' }}
            >
              <MenuIcon />
            </button>
            <span className="text-[0.95rem]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-forest)' }}>
              {current?.label ?? 'Panel'}
            </span>
          </div>
          <span className="hidden text-[0.78rem] capitalize sm:block" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
            {TODAY}
          </span>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate, onLogout }: { onNavigate: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--color-forest)' }}>
      <div className="px-6 pb-6 pt-7">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-cream)', lineHeight: 1 }}>
          Flora Art
        </p>
        <p
          className="mt-1 text-[0.62rem] uppercase tracking-[0.3em]"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
        >
          Yönetim Paneli
        </p>
      </div>

      <nav className="flex-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className="admin-nav-link relative flex items-center gap-3 px-3 py-2.5 text-[0.85rem] transition-colors"
            style={{ fontFamily: 'var(--font-body)', borderRadius: 2 }}
          >
            <span className="admin-nav-icon grid h-5 w-5 place-items-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-[0.8rem] transition-colors hover:text-[var(--color-gold)]"
          style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-body)', borderRadius: 2 }}
        >
          <span className="grid h-5 w-5 place-items-center"><ExternalIcon /></span>
          Siteye Dön
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-[0.8rem] transition-colors hover:text-[var(--color-gold)]"
          style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-body)', borderRadius: 2 }}
        >
          <span className="grid h-5 w-5 place-items-center"><LogoutIcon /></span>
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

/* ── Icons ─────────────────────────────────────────────────────── */

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function FlowerIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9c0-2 1-4 0-6-1 2 0 4 0 6ZM12 15c0 2 1 4 0 6-1-2 0-4 0-6ZM9 12c-2 0-4 1-6 0 2-1 4 0 6 0ZM15 12c2 0 4 1 6 0-2-1-4 0-6 0Z" />
    </svg>
  )
}
function BagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
function TagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 13.4 11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6a2 2 0 0 0 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8Z" /><path d="M7.5 7.5h.01" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}
