/**
 * Daily stock — pick which products can be ordered today. Loads the product
 * catalogue plus today's stock set, lets the admin toggle each in/out, and
 * saves the whole set at once.
 */
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { DailyStock, Product } from '../../types'
import { adminClient } from '../lib/adminClient'
import { useResource } from '../lib/useResource'
import { date, money } from '../lib/format'
import { CATEGORY_LABELS } from '../lib/labels'
import { Button, Card, EASE, EmptyState, PageHeader, Spinner, Toggle } from '../components/primitives'
import { useToast } from '../components/Toast'

interface StockData {
  products: Product[]
  stock: DailyStock
}

export default function Stock() {
  const toast = useToast()
  const { data, loading, error, reload } = useResource<StockData>(async () => {
    const [products, stock] = await Promise.all([adminClient.products.list(), adminClient.stock.get()])
    return { products, stock }
  })

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setSelected(new Set(data.stock.availableProductIds))
  }, [data])

  const products = data?.products ?? []
  const dirty = useMemo(() => {
    if (!data) return false
    const original = new Set(data.stock.availableProductIds)
    if (original.size !== selected.size) return true
    for (const id of selected) if (!original.has(id)) return true
    return false
  }, [data, selected])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(products.map((p) => p.id)))
  }
  function clearAll() {
    setSelected(new Set())
  }

  async function save() {
    setSaving(true)
    try {
      await adminClient.stock.set([...selected])
      toast.success('Günlük stok kaydedildi.')
      reload()
    } catch {
      toast.error('Kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Günlük Stok"
        subtitle={data ? `${date(data.stock.date)} · ${selected.size}/${products.length} ürün satışta` : undefined}
        actions={
          <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
            Kaydet
          </Button>
        }
      />

      {loading && !data ? (
        <div className="flex items-center justify-center py-28">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <EmptyState title="Stok yüklenemedi" hint={error} />
      ) : products.length === 0 ? (
        <EmptyState title="Ürün yok" hint="Önce ürün ekleyin." />
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Tümünü Seç
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Temizle
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => {
              const on = selected.has(p.id)
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: Math.min(i, 12) * 0.02 }}
                >
                  <Card padded={false} className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-black/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.86rem]" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                          {p.name.tr}
                        </p>
                        <p className="text-[0.72rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
                          {CATEGORY_LABELS[p.category]} · {money(p.price)}
                        </p>
                      </div>
                      <span style={{ pointerEvents: 'none' }}>
                        <Toggle checked={on} onChange={() => toggle(p.id)} />
                      </span>
                    </button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
