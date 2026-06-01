/**
 * Dashboard — at-a-glance metrics: revenue, order counts, status spread,
 * best sellers and the most recent orders. Read-only.
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { money, number, timeAgo } from '../lib/format'
import { ORDER_STATUSES, STATUS_META } from '../lib/labels'
import { Card, EASE, EmptyState, PageHeader, Spinner, StatusBadge } from '../components/primitives'

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
      <PageHeader title="Panel" subtitle="Mağazanın genel durumu" />

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Toplam Gelir" value={money(stats.revenue)} accent />
        <Metric label="Sipariş" value={number(stats.orderCount)} />
        <Metric label="Aktif" value={number(active)} />
        <Metric label="Teslim Edildi" value={number(stats.statusBreakdown.delivered)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <Card>
          <SectionTitle>Durum Dağılımı</SectionTitle>
          <div className="mt-4 flex flex-col gap-3">
            {ORDER_STATUSES.map((s) => {
              const count = stats.statusBreakdown[s]
              const pct = Math.round((count / totalForBar) * 100)
              const meta = STATUS_META[s]
              return (
                <div key={s} className="flex items-center gap-3">
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
          <SectionTitle>Çok Satanlar</SectionTitle>
          {stats.topProducts.length === 0 ? (
            <p className="mt-4 text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
              Henüz satış yok.
            </p>
          ) : (
            <div className="mt-4 flex flex-col">
              {stats.topProducts.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-beige)' }}
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
      <Card className="mt-6" padded={false}>
        <div className="flex items-center justify-between px-5 pt-5">
          <SectionTitle>Son Siparişler</SectionTitle>
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
          <div className="px-5 pb-5">
            <p className="mt-3 text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
              Sipariş yok.
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate('/admin/orders')}
                    className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                    style={{ borderTop: '1px solid var(--color-beige)' }}
                  >
                    <td className="px-5 py-3 text-[0.82rem]" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                      {o.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                      {o.customer.name}
                    </td>
                    <td className="px-5 py-3 text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                      {money(o.total)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-[0.74rem] whitespace-nowrap" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
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

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <Card>
        <p className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
          {label}
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.7rem',
            color: accent ? 'var(--color-gold)' : 'var(--color-forest)',
            lineHeight: 1,
          }}
        >
          {value}
        </p>
      </Card>
    </motion.div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[0.7rem] uppercase tracking-[0.2em]" style={{ color: 'var(--color-forest)', opacity: 0.7, fontFamily: 'var(--font-body)' }}>
      {children}
    </h2>
  )
}
