/**
 * Create / edit a product. Renders the full trilingual Product shape and
 * persists via adminClient (mock in STEP 2). `product === null` → create.
 */
import { useEffect, useState } from 'react'
import type { BadgeKind, CategoryId, MotifKind, Product, ProductInput } from '../../types'
import { adminClient } from '../lib/adminClient'
import { BADGE_OPTIONS, CATEGORY_OPTIONS, MOTIF_OPTIONS } from '../lib/labels'
import { Button, Field, Select, TextArea, TextInput, Toggle } from '../components/primitives'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'

interface Props {
  open: boolean
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  nameTr: string
  nameEn: string
  nameRu: string
  slug: string
  category: CategoryId
  motif: MotifKind
  price: string
  oldPrice: string
  descTr: string
  descEn: string
  descRu: string
  images: string
  badge: BadgeKind | ''
  available: boolean
  featured: boolean
  seoTitle: string
  seoDescription: string
}

const EMPTY: FormState = {
  nameTr: '',
  nameEn: '',
  nameRu: '',
  slug: '',
  category: 'bouquet',
  motif: 'rose',
  price: '',
  oldPrice: '',
  descTr: '',
  descEn: '',
  descRu: '',
  images: '',
  badge: '',
  available: true,
  featured: false,
  seoTitle: '',
  seoDescription: '',
}

function fromProduct(p: Product): FormState {
  return {
    nameTr: p.name.tr,
    nameEn: p.name.en,
    nameRu: p.name.ru,
    slug: p.slug,
    category: p.category,
    motif: p.motif,
    price: String(p.price),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : '',
    descTr: p.description.tr,
    descEn: p.description.en,
    descRu: p.description.ru,
    images: p.images.join('\n'),
    badge: p.badge ?? '',
    available: p.available,
    featured: p.featured,
    seoTitle: p.seoTitle ?? '',
    seoDescription: p.seoDescription ?? '',
  }
}

/** "kırmızı gül buketi" → "kirmizi-gul-buketi". */
function slugify(input: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }
  return input
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductFormModal({ open, product, onClose, onSaved }: Props) {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)

  const isEdit = product !== null

  useEffect(() => {
    if (!open) return
    setForm(product ? fromProduct(product) : EMPTY)
    setErrors({})
  }, [open, product])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nameTr.trim()) next.nameTr = 'Zorunlu'
    const price = Number(form.price)
    if (!form.price.trim() || Number.isNaN(price) || price < 0) next.price = 'Geçerli bir fiyat girin'
    if (form.oldPrice.trim() && Number.isNaN(Number(form.oldPrice))) next.oldPrice = 'Geçersiz'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function toInput(): ProductInput {
    const slug = form.slug.trim() || slugify(form.nameTr)
    const images = form.images
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
    return {
      name: { tr: form.nameTr.trim(), en: form.nameEn.trim() || form.nameTr.trim(), ru: form.nameRu.trim() || form.nameTr.trim() },
      slug,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice.trim() ? Number(form.oldPrice) : undefined,
      description: { tr: form.descTr.trim(), en: form.descEn.trim(), ru: form.descRu.trim() },
      images,
      badge: form.badge || undefined,
      motif: form.motif,
      available: form.available,
      featured: form.featured,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const input = toInput()
      if (isEdit && product) await adminClient.products.update(product.id, input)
      else await adminClient.products.create(input)
      toast.success(isEdit ? 'Ürün güncellendi.' : 'Ürün eklendi.')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      title={isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün'}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Vazgeç
          </Button>
          <Button size="sm" onClick={onSubmit} loading={saving}>
            {isEdit ? 'Kaydet' : 'Ekle'}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Section title="Ürün Adı">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Türkçe" required error={errors.nameTr}>
              <TextInput value={form.nameTr} onChange={(e) => set('nameTr', e.target.value)} placeholder="Kırmızı Gül Buketi" />
            </Field>
            <Field label="English">
              <TextInput value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} placeholder="Red Rose Bouquet" />
            </Field>
            <Field label="Русский">
              <TextInput value={form.nameRu} onChange={(e) => set('nameRu', e.target.value)} placeholder="Букет красных роз" />
            </Field>
          </div>
        </Section>

        <Section title="Sınıflandırma">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Slug" hint="Boş bırakılırsa addan üretilir">
              <TextInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="kirmizi-gul-buketi" />
            </Field>
            <Field label="Kategori">
              <Select value={form.category} onChange={(e) => set('category', e.target.value as CategoryId)} options={CATEGORY_OPTIONS} />
            </Field>
            <Field label="Motif">
              <Select value={form.motif} onChange={(e) => set('motif', e.target.value as MotifKind)} options={MOTIF_OPTIONS} />
            </Field>
          </div>
        </Section>

        <Section title="Fiyat">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Fiyat (₺)" required error={errors.price}>
              <TextInput inputMode="numeric" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="450" />
            </Field>
            <Field label="Eski Fiyat (₺)" hint="İndirimliyse" error={errors.oldPrice}>
              <TextInput inputMode="numeric" value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} placeholder="520" />
            </Field>
            <Field label="Rozet">
              <Select
                value={form.badge}
                onChange={(e) => set('badge', e.target.value as BadgeKind | '')}
                options={[{ value: '', label: '— Yok —' }, ...BADGE_OPTIONS]}
              />
            </Field>
          </div>
        </Section>

        <Section title="Açıklama">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Türkçe">
              <TextArea value={form.descTr} onChange={(e) => set('descTr', e.target.value)} rows={3} />
            </Field>
            <Field label="English">
              <TextArea value={form.descEn} onChange={(e) => set('descEn', e.target.value)} rows={3} />
            </Field>
            <Field label="Русский">
              <TextArea value={form.descRu} onChange={(e) => set('descRu', e.target.value)} rows={3} />
            </Field>
          </div>
        </Section>

        <Section title="Görseller">
          <Field label="Görsel yolları" hint="Her satıra bir URL (veya virgülle ayırın)">
            <TextArea
              value={form.images}
              onChange={(e) => set('images', e.target.value)}
              rows={2}
              placeholder={'/products/red-roses-1.jpg\n/products/red-roses-2.jpg'}
            />
          </Field>
        </Section>

        <Section title="Durum & SEO">
          <div className="flex flex-wrap items-center gap-6 pb-1">
            <Toggle checked={form.available} onChange={(v) => set('available', v)} label="Satışta" />
            <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Öne çıkan" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="SEO Başlık">
              <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
            </Field>
            <Field label="SEO Açıklama">
              <TextInput value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
            </Field>
          </div>
        </Section>
      </form>
    </Modal>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="mb-2 text-[0.66rem] uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}
