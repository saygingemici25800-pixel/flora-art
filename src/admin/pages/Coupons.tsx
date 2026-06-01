/**
 * Coupons — list, create / edit (modal), toggle active, delete.
 * On create the client upserts by code; on edit the code is immutable.
 */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Coupon, CouponType } from '../../types'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { date, money } from '../lib/format'
import {
  Button,
  Card,
  EASE,
  EmptyState,
  Field,
  PageHeader,
  Select,
  Spinner,
  Tag,
  TextInput,
  Toggle,
} from '../components/primitives'
import { ConfirmDialog, Modal } from '../components/Modal'
import { useToast } from '../components/Toast'

const TYPE_OPTIONS = [
  { value: 'percent', label: 'Yüzde (%)' },
  { value: 'fixed', label: 'Sabit (₺)' },
]

export default function Coupons() {
  const toast = useToast()
  const { data, loading, error, reload } = useResource(() => adminClient.coupons.list())

  const [editing, setEditing] = useState<Coupon | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Coupon | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [busyCode, setBusyCode] = useState<string | null>(null)

  const coupons = data ?? []

  async function toggleActive(c: Coupon) {
    setBusyCode(c.code)
    try {
      await adminClient.coupons.update(c.code, { active: !c.active })
      reload()
    } catch {
      toast.error('Güncellenemedi.')
    } finally {
      setBusyCode(null)
    }
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await adminClient.coupons.remove(toDelete.code)
      toast.success('Kupon silindi.')
      setToDelete(null)
      reload()
    } catch {
      toast.error('Silinemedi.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Kuponlar"
        subtitle={`${coupons.length} kupon`}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            + Yeni Kupon
          </Button>
        }
      />

      {loading && !data ? (
        <div className="flex items-center justify-center py-28">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <EmptyState title="Kuponlar yüklenemedi" hint={error} />
      ) : coupons.length === 0 ? (
        <EmptyState title="Henüz kupon yok" hint="İlk kuponu eklemek için “Yeni Kupon”." />
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-beige)' }}>
                  <Th>Kod</Th>
                  <Th>İndirim</Th>
                  <Th>Min. Sepet</Th>
                  <Th>Son Tarih</Th>
                  <Th>Aktif</Th>
                  <Th className="text-right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => (
                  <motion.tr
                    key={c.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE, delay: Math.min(i, 10) * 0.02 }}
                    style={{ borderBottom: '1px solid var(--color-beige)' }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="text-[0.84rem] tracking-[0.05em]"
                        style={{ color: 'var(--color-forest)', fontWeight: 600, fontFamily: 'var(--font-body)' }}
                      >
                        {c.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Tag tone="gold">{c.type === 'percent' ? `%${c.value}` : money(c.value)}</Tag>
                    </td>
                    <td className="px-6 py-4 text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                      {c.minOrder != null ? money(c.minOrder) : '—'}
                    </td>
                    <td className="px-6 py-4 text-[0.8rem]" style={{ color: 'var(--color-ink)', opacity: 0.7 }}>
                      {c.expiresAt ? date(c.expiresAt) : 'Süresiz'}
                    </td>
                    <td className="px-6 py-4">
                      {busyCode === c.code ? (
                        <Spinner size={16} />
                      ) : (
                        <Toggle checked={c.active} onChange={() => toggleActive(c)} />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label="Düzenle"
                          onClick={() => {
                            setEditing(c)
                            setFormOpen(true)
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton label="Sil" danger onClick={() => setToDelete(c)}>
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CouponFormModal open={formOpen} coupon={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

      <ConfirmDialog
        open={toDelete !== null}
        title="Kuponu sil"
        message={
          <>
            <strong>{toDelete?.code}</strong> kuponu silinecek.
          </>
        }
        confirmLabel="Sil"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}

/* ── Form modal ────────────────────────────────────────────────── */

function CouponFormModal({
  open,
  coupon,
  onClose,
  onSaved,
}: {
  open: boolean
  coupon: Coupon | null
  onClose: () => void
  onSaved: () => void
}) {
  const toast = useToast()
  const isEdit = coupon !== null

  const [code, setCode] = useState('')
  const [type, setType] = useState<CouponType>('percent')
  const [value, setValue] = useState('')
  const [minOrder, setMinOrder] = useState('')
  const [expires, setExpires] = useState('')
  const [active, setActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    if (coupon) {
      setCode(coupon.code)
      setType(coupon.type)
      setValue(String(coupon.value))
      setMinOrder(coupon.minOrder != null ? String(coupon.minOrder) : '')
      setExpires(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '')
      setActive(coupon.active)
    } else {
      setCode('')
      setType('percent')
      setValue('')
      setMinOrder('')
      setExpires('')
      setActive(true)
    }
  }, [open, coupon])

  async function save() {
    const trimmedCode = code.trim().toUpperCase()
    const numValue = Number(value)
    if (!trimmedCode) return setError('Kupon kodu zorunlu.')
    if (!value.trim() || Number.isNaN(numValue) || numValue <= 0) return setError('Geçerli bir değer girin.')
    if (type === 'percent' && numValue > 100) return setError('Yüzde 100’den büyük olamaz.')

    setSaving(true)
    setError(null)
    try {
      const expiresAt = expires ? new Date(`${expires}T23:59:59`).toISOString() : undefined
      const minOrderNum = minOrder.trim() ? Number(minOrder) : undefined
      if (isEdit && coupon) {
        await adminClient.coupons.update(coupon.code, { type, value: numValue, active, expiresAt, minOrder: minOrderNum })
      } else {
        await adminClient.coupons.create({ code: trimmedCode, type, value: numValue, active, expiresAt, minOrder: minOrderNum })
      }
      toast.success(isEdit ? 'Kupon güncellendi.' : 'Kupon eklendi.')
      onSaved()
      onClose()
    } catch {
      toast.error('Kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      title={isEdit ? 'Kuponu Düzenle' : 'Yeni Kupon'}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Vazgeç
          </Button>
          <Button size="sm" onClick={save} loading={saving}>
            {isEdit ? 'Kaydet' : 'Ekle'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Kupon Kodu" required error={error ?? undefined} hint={isEdit ? 'Kod değiştirilemez' : undefined}>
          <TextInput
            value={code}
            disabled={isEdit}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="HOSGELDIN10"
            style={{ letterSpacing: '0.05em' }}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tür">
            <Select value={type} onChange={(e) => setType(e.target.value as CouponType)} options={TYPE_OPTIONS} />
          </Field>
          <Field label={type === 'percent' ? 'Değer (%)' : 'Değer (₺)'} required>
            <TextInput inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === 'percent' ? '10' : '50'} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Min. Sepet (₺)" hint="İsteğe bağlı">
            <TextInput inputMode="numeric" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="300" />
          </Field>
          <Field label="Son Geçerlilik" hint="Boşsa süresiz">
            <TextInput type="date" value={expires} onChange={(e) => setExpires(e.target.value)} />
          </Field>
        </div>

        <div className="pt-1">
          <Toggle checked={active} onChange={setActive} label="Aktif" />
        </div>
      </div>
    </Modal>
  )
}

/* ── Bits ──────────────────────────────────────────────────────── */

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-6 py-4 text-[0.64rem] font-normal uppercase tracking-[0.16em] ${className}`}
      style={{ color: 'var(--color-ink)', opacity: 0.5, fontFamily: 'var(--font-body)' }}
    >
      {children}
    </th>
  )
}

function IconButton({
  children,
  label,
  danger = false,
  onClick,
}: {
  children: React.ReactNode
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center transition-colors hover:bg-black/[0.05]"
      style={{ borderRadius: 2, color: danger ? '#8A3B30' : 'var(--color-forest)' }}
    >
      {children}
    </button>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  )
}
