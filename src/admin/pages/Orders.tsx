/**
 * Orders — filter by status, browse, and open a detail modal to update the
 * order status, courier and tracking number.
 */
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Order, OrderStatus } from '../../types'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { dateTime, money, timeAgo } from '../lib/format'
import { ORDER_STATUSES, PAYMENT_LABELS, STATUS_META } from '../lib/labels'
import {
  Button,
  Card,
  EASE,
  EmptyState,
  Field,
  PageHeader,
  Select,
  Spinner,
  StatusBadge,
  TextInput,
} from '../components/primitives'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'

type Filter = OrderStatus | 'all'

const STATUS_OPTIONS = ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))

export default function Orders() {
  const { data, loading, error, reload } = useResource(() => adminClient.orders.list())
  const [filter, setFilter] = useState<Filter>('all')
  const [active, setActive] = useState<Order | null>(null)

  const orders = data ?? []
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    for (const s of ORDER_STATUSES) c[s] = 0
    for (const o of orders) c[o.status] += 1
    return c
  }, [orders])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <PageHeader title="Siparişler" subtitle={`${orders.length} sipariş`} />

      {/* Status filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip label="Tümü" count={counts.all} active={filter === 'all'} onClick={() => setFilter('all')} />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_META[s].label}
            count={counts[s]}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-28">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <EmptyState title="Siparişler yüklenemedi" hint={error} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Bu durumda sipariş yok" />
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-beige)' }}>
                  <Th>Sipariş</Th>
                  <Th>Müşteri</Th>
                  <Th>Tutar</Th>
                  <Th>Durum</Th>
                  <Th className="text-right">Tarih</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE, delay: Math.min(i, 10) * 0.02 }}
                    onClick={() => setActive(o)}
                    className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: '1px solid var(--color-beige)' }}
                  >
                    <td className="px-5 py-3">
                      <p className="text-[0.84rem]" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                        {o.orderNumber}
                      </p>
                      <p className="text-[0.72rem]" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
                        {o.items.length} kalem · {PAYMENT_LABELS[o.paymentMethod]}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                      {o.customer.name}
                    </td>
                    <td className="px-5 py-3 text-[0.85rem]" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                      {money(o.total)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-[0.74rem] whitespace-nowrap" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
                      {timeAgo(o.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <OrderDetailModal order={active} onClose={() => setActive(null)} onSaved={reload} />
    </div>
  )
}

/* ── Detail modal ──────────────────────────────────────────────── */

function OrderDetailModal({
  order,
  onClose,
  onSaved,
}: {
  order: Order | null
  onClose: () => void
  onSaved: () => void
}) {
  const toast = useToast()
  const [status, setStatus] = useState<OrderStatus>('received')
  const [trackingNo, setTrackingNo] = useState('')
  const [courier, setCourier] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!order) return
    setStatus(order.status)
    setTrackingNo(order.trackingNo ?? '')
    setCourier(order.courier ?? '')
  }, [order])

  const dirty =
    order != null &&
    (status !== order.status ||
      trackingNo !== (order.trackingNo ?? '') ||
      courier !== (order.courier ?? ''))

  async function save() {
    if (!order) return
    setSaving(true)
    try {
      await adminClient.orders.update(order.id, {
        status,
        trackingNo: trackingNo.trim() || undefined,
        courier: courier.trim() || undefined,
      })
      toast.success('Sipariş güncellendi.')
      onSaved()
      onClose()
    } catch {
      toast.error('Güncellenemedi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={order !== null}
      onClose={saving ? () => {} : onClose}
      title={order?.orderNumber}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Kapat
          </Button>
          <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
            Kaydet
          </Button>
        </>
      }
    >
      {order && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.74rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
              {dateTime(order.createdAt)}
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoBlock title="Müşteri">
              <Line>{order.customer.name}</Line>
              <Line muted>{order.customer.phone}</Line>
              <Line muted>{order.customer.email}</Line>
            </InfoBlock>
            <InfoBlock title="Teslimat">
              <Line>{order.delivery.region}</Line>
              <Line muted>
                {order.delivery.date} · {order.delivery.timeSlot}
              </Line>
              <Line muted>{order.delivery.address}</Line>
              {order.delivery.giftNote && <Line muted>“{order.delivery.giftNote}”</Line>}
            </InfoBlock>
          </div>

          {/* Items */}
          <div style={{ border: '1px solid var(--color-beige)', borderRadius: 3 }}>
            {order.items.map((it, i) => (
              <div
                key={it.productId}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-beige)' }}
              >
                <span className="text-[0.82rem]" style={{ color: 'var(--color-forest)' }}>
                  {it.name} <span style={{ opacity: 0.5 }}>× {it.quantity}</span>
                </span>
                <span className="text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                  {money(it.price * it.quantity)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '1px solid var(--color-beige)' }}>
              <span className="text-[0.72rem] uppercase tracking-[0.12em]" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
                Ara toplam · Kargo
              </span>
              <span className="text-[0.78rem]" style={{ color: 'var(--color-ink)', opacity: 0.7 }}>
                {money(order.subtotal)} · {money(order.deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--color-beige)', background: 'rgba(200,169,110,0.07)' }}>
              <span className="text-[0.78rem] uppercase tracking-[0.12em]" style={{ color: 'var(--color-forest)' }}>
                Toplam
              </span>
              <span className="text-[1rem]" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                {money(order.total)}
              </span>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Durum">
              <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} options={STATUS_OPTIONS} />
            </Field>
            <Field label="Kargo / Kurye">
              <TextInput value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Flora Kurye" />
            </Field>
            <Field label="Takip No">
              <TextInput value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="FA-TRK-0000" />
            </Field>
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ── Bits ──────────────────────────────────────────────────────── */

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-1.5 text-[0.76rem] transition-colors"
      style={{
        borderRadius: 999,
        fontFamily: 'var(--font-body)',
        background: active ? 'var(--color-forest)' : 'transparent',
        color: active ? 'var(--color-cream)' : 'var(--color-forest)',
        border: `1px solid ${active ? 'var(--color-forest)' : 'var(--color-beige)'}`,
      }}
    >
      {label}
      <span style={{ opacity: 0.6 }}>{count}</span>
    </button>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-5 py-3 text-[0.64rem] font-normal uppercase tracking-[0.16em] ${className}`}
      style={{ color: 'var(--color-ink)', opacity: 0.5, fontFamily: 'var(--font-body)' }}
    >
      {children}
    </th>
  )
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.64rem] uppercase tracking-[0.18em]" style={{ color: 'var(--color-gold)' }}>
        {title}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function Line({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className="text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: muted ? 0.6 : 1 }}>
      {children}
    </span>
  )
}
