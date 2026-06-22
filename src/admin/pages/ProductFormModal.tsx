/**
 * Create / edit a product. Renders the full trilingual Product shape and
 * persists via adminClient (mock in STEP 2). `product === null` → create.
 */
import { useEffect, useRef, useState } from 'react'
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
  motif: MotifKind | ''
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
  motif: '',
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

/** Sensible motif per category, used when the admin leaves Motif on "auto". */
const CATEGORY_DEFAULT_MOTIF: Record<CategoryId, MotifKind> = {
  bouquet: 'rose',
  box: 'box',
  plant: 'orchid',
  wedding: 'wedding',
  corporate: 'premium',
  international: 'premium',
}

/** Downscale to ~1200px on the longest side and re-encode as WebP, in-browser. */
async function resizeToWebp(file: File, maxDim = 1200, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Tarayıcı resim işlemeyi desteklemiyor.')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Resim işlenemedi.'))),
      'image/webp',
      quality,
    )
  })
}

/** Read a Blob as bare base64 (no `data:...;base64,` prefix). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      const result = fr.result as string
      resolve(result.slice(result.indexOf(',') + 1))
    }
    fr.onerror = () => reject(new Error('Dosya okunamadı.'))
    fr.readAsDataURL(blob)
  })
}

export default function ProductFormModal({ open, product, onClose, onSaved }: Props) {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const isEdit = product !== null
  const firstImage =
    form.images
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)[0] ?? ''

  useEffect(() => {
    if (!open) return
    setForm(product ? fromProduct(product) : EMPTY)
    setErrors({})
    setUploadError(null)
    setShowAdvanced(false)
  }, [open, product])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen bir resim dosyası seçin.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dosya 5MB’dan büyük. Lütfen daha küçük bir resim seçin.')
      return
    }
    setUploadError(null)
    setUploading(true)
    try {
      const webp = await resizeToWebp(file)
      const base64 = await blobToBase64(webp)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ data: base64, contentType: 'image/webp' }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || 'Yükleme başarısız oldu.')
      }
      const { url } = (await res.json()) as { url: string }
      set('images', url)
      toast.success('Fotoğraf yüklendi.')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Yükleme başarısız oldu.')
    } finally {
      setUploading(false)
    }
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
    const nameTr = form.nameTr.trim()
    // Auto-fill the technical fields Vahap may leave blank, so a product saved
    // with just name + price + category + photo is still complete.
    const slug = form.slug.trim() || slugify(nameTr)
    const motif = form.motif || CATEGORY_DEFAULT_MOTIF[form.category]
    const seoTitle = form.seoTitle.trim() || `${nameTr} | Flora Art Fethiye`
    const seoDescription =
      form.seoDescription.trim() || form.descTr.trim() || nameTr
    const images = form.images
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
    return {
      name: { tr: nameTr, en: form.nameEn.trim() || nameTr, ru: form.nameRu.trim() || nameTr },
      slug,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice.trim() ? Number(form.oldPrice) : undefined,
      description: { tr: form.descTr.trim(), en: form.descEn.trim(), ru: form.descRu.trim() },
      images,
      badge: form.badge || undefined,
      motif,
      available: form.available,
      featured: form.featured,
      seoTitle,
      seoDescription,
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
        {/* ── Simple fields (everything Vahap needs) ───────────────── */}
        <Field label="Ürün Adı" required error={errors.nameTr}>
          <TextInput
            value={form.nameTr}
            onChange={(e) => set('nameTr', e.target.value)}
            placeholder="Kırmızı Gül Buketi"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fiyat (₺)" hint="KDV dahil" required error={errors.price}>
            <TextInput inputMode="numeric" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="1450" />
          </Field>
          <Field label="İndirimli Fiyat (₺)" hint="Eski fiyat — opsiyonel" error={errors.oldPrice}>
            <TextInput inputMode="numeric" value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} placeholder="1850" />
          </Field>
        </div>

        <Field label="Kategori" required>
          <Select value={form.category} onChange={(e) => set('category', e.target.value as CategoryId)} options={CATEGORY_OPTIONS} />
        </Field>

        <Field label="Açıklama" hint="Kısa, 2-3 cümle — opsiyonel">
          <TextArea
            value={form.descTr}
            onChange={(e) => set('descTr', e.target.value)}
            rows={3}
            placeholder="Kırmızı güllerin tutkulu zarafeti. Sevdiklerinize en şık yolu…"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-6 pb-1">
          <Toggle checked={form.available} onChange={(v) => set('available', v)} label="Stokta var" />
        </div>

        <Section title="Fotoğraf">
          <div className="flex items-start gap-4">
            <div
              className="flex h-[120px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-lg border"
              style={{
                borderColor: 'rgba(28,43,26,0.2)',
                background: 'rgba(28,43,26,0.04)',
              }}
            >
              {firstImage ? (
                <img
                  src={firstImage}
                  alt="Ürün fotoğrafı"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="text-[0.62rem]"
                  style={{ color: 'rgba(28,43,26,0.5)' }}
                >
                  Fotoğraf yok
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="hidden"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  loading={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {firstImage ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
                </Button>
                {firstImage && !uploading && (
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => set('images', '')}
                  >
                    Fotoğrafı Sil
                  </Button>
                )}
              </div>
              {uploadError && (
                <p className="text-[0.7rem]" style={{ color: '#8a3b30' }}>
                  {uploadError}
                </p>
              )}
              <p className="text-[0.66rem]" style={{ color: 'rgba(28,43,26,0.5)' }}>
                Telefondan veya bilgisayardan seçin · en fazla 5MB ·
                otomatik olarak ~1200px WebP’ye küçültülür.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Advanced (collapsed by default; auto-filled if untouched) ── */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span>Gelişmiş</span>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                transform: showAdvanced ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              ▾
            </span>
          </button>
          <p className="mt-1 text-[0.66rem]" style={{ color: 'rgba(28,43,26,0.5)' }}>
            SEO, slug, motif, rozet, diğer diller. Boş bırakırsanız otomatik doldurulur.
          </p>

          {showAdvanced && (
            <div
              className="mt-4 flex flex-col gap-5 rounded-lg p-4"
              style={{ border: '1px solid rgba(28,43,26,0.15)', background: 'rgba(28,43,26,0.03)' }}
            >
              <Section title="Ürün Adı — Diğer Diller">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="English" hint="Boşsa Türkçe kullanılır">
                    <TextInput value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} placeholder="Red Rose Bouquet" />
                  </Field>
                  <Field label="Русский" hint="Boşsa Türkçe kullanılır">
                    <TextInput value={form.nameRu} onChange={(e) => set('nameRu', e.target.value)} placeholder="Букет красных роз" />
                  </Field>
                </div>
              </Section>

              <Section title="Açıklama — Diğer Diller">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="English">
                    <TextArea value={form.descEn} onChange={(e) => set('descEn', e.target.value)} rows={2} />
                  </Field>
                  <Field label="Русский">
                    <TextArea value={form.descRu} onChange={(e) => set('descRu', e.target.value)} rows={2} />
                  </Field>
                </div>
              </Section>

              <Section title="Sınıflandırma">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Slug" hint="Boşsa addan üretilir">
                    <TextInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="kirmizi-gul-buketi" />
                  </Field>
                  <Field label="Motif" hint="Boşsa kategoriye göre">
                    <Select
                      value={form.motif}
                      onChange={(e) => set('motif', e.target.value as MotifKind | '')}
                      options={[{ value: '', label: '— Otomatik —' }, ...MOTIF_OPTIONS]}
                    />
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

              <Section title="SEO">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="SEO Başlık" hint="Boşsa addan üretilir">
                    <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
                  </Field>
                  <Field label="SEO Açıklama" hint="Boşsa açıklamadan üretilir">
                    <TextInput value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
                  </Field>
                </div>
              </Section>

              <Section title="Diğer">
                <div className="flex flex-wrap items-center gap-6 pb-2">
                  <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Öne çıkan" />
                </div>
                <Field label="Görsel URL’leri" hint="Her satıra bir URL. Genellikle dokunmanıza gerek yok.">
                  <TextArea
                    value={form.images}
                    onChange={(e) => set('images', e.target.value)}
                    rows={2}
                    placeholder={'/products/red-roses-1.jpg'}
                  />
                </Field>
              </Section>
            </div>
          )}
        </div>
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
