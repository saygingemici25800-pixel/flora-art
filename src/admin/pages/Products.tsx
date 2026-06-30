/**
 * Products — list, filter, inline availability toggle, create / edit / delete.
 */
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { money } from '../lib/format'
import { BADGE_LABELS, CATEGORY_LABELS, CATEGORY_OPTIONS } from '../lib/labels'
import {
  Button,
  Card,
  EASE,
  EmptyState,
  PageHeader,
  Select,
  Spinner,
  Tag,
  TextInput,
  Toggle,
} from '../components/primitives'
import { ConfirmDialog } from '../components/Modal'
import { useToast } from '../components/Toast'
import ProductFormModal from './ProductFormModal'

export default function Products() {
  const toast = useToast()
  const { data, loading, error, reload } = useResource(() => adminClient.products.list())

  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const products = data ?? []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Most-recently edited/created first, so a product Vahap just saved jumps to
    // the top. ISO-8601 timestamps compare correctly as plain strings.
    const ts = (p: Product) => p.updatedAt || p.createdAt || ''
    return products
      .filter((p) => {
        if (category && p.category !== category) return false
        if (q && !p.name.tr.toLowerCase().includes(q) && !p.slug.includes(q)) return false
        return true
      })
      .sort((a, b) => ts(b).localeCompare(ts(a)))
  }, [products, category, query])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(p: Product) {
    setEditing(p)
    setFormOpen(true)
  }

  async function toggleAvailable(p: Product) {
    setBusyId(p.id)
    try {
      await adminClient.products.update(p.id, { available: !p.available })
      reload()
    } catch {
      toast.error('Durum güncellenemedi.')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await adminClient.products.remove(toDelete.id)
      toast.success('Ürün silindi.')
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
        title="Ürünler"
        subtitle={`${products.length} ürün`}
        actions={
          <Button size="sm" onClick={openCreate}>
            + Yeni Ürün
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ value: '', label: 'Tüm kategoriler' }, ...CATEGORY_OPTIONS]}
          />
        </div>
        <div className="min-w-48 flex-1">
          <TextInput placeholder="Ürün ara…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-28">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <EmptyState title="Ürünler yüklenemedi" hint={error} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" hint="Filtreleri değiştirin ya da yeni ürün ekleyin." />
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-beige)' }}>
                  <Th>Ürün</Th>
                  <Th>Kategori</Th>
                  <Th>Fiyat</Th>
                  <Th>Satışta</Th>
                  <Th className="text-right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE, delay: Math.min(i, 10) * 0.02 }}
                    style={{ borderBottom: '1px solid var(--color-beige)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Thumb product={p} />
                        <div>
                          <p className="text-[0.86rem]" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                            {p.name.tr}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            {p.featured && <Tag tone="gold">Öne çıkan</Tag>}
                            {p.badge && <Tag>{BADGE_LABELS[p.badge]}</Tag>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
                      {CATEGORY_LABELS[p.category]}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[0.85rem]" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                        {money(p.price)}
                      </span>
                      {p.oldPrice != null && (
                        <span className="ml-2 text-[0.74rem] line-through" style={{ color: 'var(--color-ink)', opacity: 0.4 }}>
                          {money(p.oldPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {busyId === p.id ? (
                        <Spinner size={16} />
                      ) : (
                        <Toggle checked={p.available} onChange={() => toggleAvailable(p)} />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label="Düzenle" onClick={() => openEdit(p)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton label="Sil" danger onClick={() => setToDelete(p)}>
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

      <ProductFormModal open={formOpen} product={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

      <ConfirmDialog
        open={toDelete !== null}
        title="Ürünü sil"
        message={
          <>
            <strong>{toDelete?.name.tr}</strong> ürünü kalıcı olarak silinecek. Bu işlem geri alınamaz.
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

function Thumb({ product }: { product: Product }) {
  const letter = product.name.tr.charAt(0).toUpperCase()
  return (
    <span
      className="grid h-10 w-10 shrink-0 place-items-center"
      style={{
        background: 'var(--color-beige)',
        color: 'var(--color-forest)',
        borderRadius: 3,
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        opacity: product.available ? 1 : 0.5,
      }}
    >
      {letter}
    </span>
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
