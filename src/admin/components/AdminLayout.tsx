/**
 * Admin shell: fixed 240px sidebar + offset content column + routed <Outlet/>.
 *
 * Spacing is enforced with explicit CSS (admin.css) rather than Tailwind
 * utilities so it can never be purged or overridden:
 *   .admin-sidebar  → fixed 240px, padding 32/24, forest, border-right
 *   .admin-main     → margin-left 240px, padding 40/48 (content breathes)
 *   .admin-nav-link → padded pills (14/16, radius 8)
 * Chromeless: no topbar. Below 768px the sidebar collapses to a drawer
 * opened by a floating hamburger.
 */
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const logout = useAuth((s) => s.logout)

  return (
    <div className="admin-shell">
      {/* Desktop sidebar — padding/forest/border supplied by .admin-sidebar */}
      <aside className="admin-sidebar">
        <SidebarContent onNavigate={() => {}} onLogout={logout} />
      </aside>

      {/* Mobile drawer (<768px) — mirrors the sidebar's forest + padding inline */}
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
              style={{
                width: 240,
                background: 'var(--color-forest)',
                padding: '32px 24px',
                borderRight: '1px solid rgba(200,169,110,0.15)',
                overflowY: 'auto',
              }}
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

      {/* Floating hamburger — mobile only (.admin-menu-btn hides ≥768px) */}
      <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Menüyü aç" className="admin-menu-btn">
        <MenuIcon />
      </button>

      {/* Content column — padding 40/48 supplied by .admin-main; inner wrapper
          caps the content width so wide monitors don't spread tables edge-to-edge */}
      <div className="admin-main">
        <div style={{ maxWidth: '80rem', marginInline: 'auto', width: '100%' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate, onLogout }: { onNavigate: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div style={{ marginBottom: '28px' }}>
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

      <nav className="flex-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className="admin-nav-link flex items-center gap-3 text-[0.85rem] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="admin-nav-icon grid h-5 w-5 place-items-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: '8px' }}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 text-[0.8rem] transition-colors hover:text-[var(--color-gold)]"
          style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-body)', padding: '12px 16px', borderRadius: 8 }}
        >
          <span className="grid h-5 w-5 place-items-center"><ExternalIcon /></span>
          Siteye Dön
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 text-[0.8rem] transition-colors hover:text-[var(--color-gold)]"
          style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-body)', padding: '12px 16px', borderRadius: 8 }}
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
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
