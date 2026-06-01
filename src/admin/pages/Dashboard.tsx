/**
 * Dashboard — at-a-glance metrics: revenue, order counts, status spread,
 * best sellers and the most recent orders. Read-only.
 *
 * Critical vertical/horizontal rhythm is written as INLINE styles (and a few
 * enforced .admin-* grid classes) so the breathing room can never be purged
 * or overridden by utility-class ordering.
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { money, number, timeAgo } from '../lib/format'
import { ORDER_STATUSES, STATUS_META } from '../lib/labels'
import { Card, EASE, EmptyState, PageHeader, Spinner, StatusBadge } from '../components/primitives'

const ROW_DIVIDER = '1px solid rgba(200,169,110,0.1)'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: stats, loading, error } = useResource(() => adminClient.dashboard.stats())

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size={28} />
      </div>
    )
  }

  if (error || !stats) {
    return <EmptyState title="İstatistikler yüklenemedi" hint={error ?? undefined} />
  }

  const active =
    stats.statusBreakdown.received + stats.statusBreakdown.preparing + stats.statusBreakdown.shipping
  const totalForBar = Math.max(stats.orderCount, 1)

  return (
    <div>
      {/* Header block */}
      <div style={{ marginBottom: '56px' }}>
        <PageHeader title="Panel" subtitle="Mağazanın genel durumu" className="" />
      </div>

      {/* Metric cards — enforced 4-up grid, gap 28px (.admin-stat-grid) */}
      <div className="admin-stat-grid" style={{ marginBottom: '56px' }}>
        <Metric label="Toplam Gelir" value={money(stats.revenue)} accent />
        <Metric label="Sipariş" value={number(stats.orderCount)} />
        <Metric label="Aktif" value={number(active)} />
        <Metric label="Teslim Edildi" value={number(stats.statusBreakdown.delivered)} />
      </div>

      {/* Breakdown + top products — two-up, gap 40px (.admin-two-col) */}
      <div className="admin-two-col" style={{ marginBottom: '56px' }}>
        {/* Status breakdown */}
        <Card>
          <SectionTitle style={{ marginBottom: '24px' }}>Durum Dağılımı</SectionTitle>
          <div className="flex flex-col">
            {ORDER_STATUSES.map((s) => {
              const count = stats.statusBreakdown[s]
              const pct = Math.round((count / totalForBar) * 100)
              const meta = STATUS_META[s]
              return (
                <div key={s} className="flex items-center gap-3" style={{ paddingBlock: '14px' }}>
                  <span className="w-28 shrink-0 text-[0.78rem]" style={{ color: 'var(--color-ink)' }}>
                    {meta.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden" style={{ background: 'rgba(28,43,26,0.07)', borderRadius: 999 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: EASE }}
                      style={{ height: '100%', background: meta.fg, borderRadius: 999 }}
                    />
                  </div>
                  <span className="w-6 text-right text-[0.78rem]" style={{ color: 'var(--color-ink)', opacity: 0.6 }}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Top products */}
        <Card>
          <SectionTitle style={{ marginBottom: '24px' }}>Çok Satanlar</SectionTitle>
          {stats.topProducts.length === 0 ? (
            <p className="text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
              Henüz satış yok.
            </p>
          ) : (
            <div className="flex flex-col">
              {stats.topProducts.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between"
                  style={{ paddingBlock: '14px', borderTop: i === 0 ? 'none' : ROW_DIVIDER }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-6 w-6 place-items-center text-[0.7rem]"
                      style={{ background: 'rgba(200,169,110,0.18)', color: '#7A5A1E', borderRadius: 999 }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[0.85rem]" style={{ color: 'var(--color-forest)' }}>
                      {p.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.85rem]" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                      {money(p.revenue)}
                    </span>
                    <span className="ml-2 text-[0.72rem]" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
                      {p.quantity} adet
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <Card padded={false}>
        <div className="flex items-center justify-between" style={{ padding: '24px 24px 20px' }}>
          <SectionTitle style={{ marginBottom: 0 }}>Son Siparişler</SectionTitle>
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="text-[0.72rem] uppercase tracking-[0.14em] transition-colors hover:text-[var(--color-gold)]"
            style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-body)' }}
          >
            Tümü →
          </button>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: 0.55, padding: '0 24px 24px' }}>
            Sipariş yok.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate('/admin/orders')}
                    className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                    style={{ borderTop: ROW_DIVIDER }}
                  >
                    <Cell bold>{o.orderNumber}</Cell>
                    <Cell>{o.customer.name}</Cell>
                    <Cell>{money(o.total)}</Cell>
                    <Cell>
                      <StatusBadge status={o.status} />
                    </Cell>
                    <td
                      className="text-right text-[0.74rem] whitespace-nowrap"
                      style={{ padding: '20px 24px', color: 'var(--color-ink)', opacity: 0.5 }}
                    >
                      {timeAgo(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function Cell({ children, bold = false }: { children: ReactNode; bold?: boolean }) {
  return (
    <td
      className="text-[0.82rem]"
      style={{
        padding: '20px 24px',
        color: bold ? 'var(--color-forest)' : 'var(--color-ink)',
        fontWeight: bold ? 600 : 400,
      }}
    >
      {children}
    </td>
  )
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        background: '#fff',
        border: '1px solid var(--color-beige)',
        borderRadius: 3,
        padding: '28px 24px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.66rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--color-ink)',
          opacity: 0.5,
          marginBottom: '14px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.7rem',
          lineHeight: 1,
          color: accent ? 'var(--color-gold)' : 'var(--color-forest)',
        }}
      >
        {value}
      </p>
    </motion.div>
  )
}

function SectionTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h2
      className="text-[0.7rem] uppercase tracking-[0.2em]"
      style={{ color: 'var(--color-forest)', opacity: 0.7, fontFamily: 'var(--font-body)', ...style }}
    >
      {children}
    </h2>
  )
}
