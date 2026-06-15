/**
 * KVKK Aydınlatma Metni & Gizlilik / Çerez Politikası.
 *
 * The legal body is presented in Turkish — KVKK is Turkish data-protection law
 * and the Turkish text is the governing version. A short note tells EN/RU
 * visitors as much. The business should review and finalise this template.
 */
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const EASE = [0.16, 1, 0.3, 1] as const
const X_PAD = {
  paddingLeft: 'clamp(20px, 5vw, 64px)',
  paddingRight: 'clamp(20px, 5vw, 64px)',
} as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

interface Section {
  h: string
  body: string[]
}

const SECTIONS: Section[] = [
  {
    h: '1. Veri Sorumlusu',
    body: [
      'İşbu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Flora Art Çiçekçilik (Atatürk Cd. 98/a, Kesikkapı, Fethiye/Muğla) tarafından hazırlanmıştır.',
    ],
  },
  {
    h: '2. İşlenen Kişisel Verileriniz',
    body: [
      'Kimlik (ad-soyad), iletişim (telefon, e-posta, teslimat adresi), sipariş ve teslimat bilgileri ile ödeme işlemine ilişkin gerekli bilgiler işlenmektedir.',
    ],
  },
  {
    h: '3. İşleme Amaçları',
    body: [
      'Kişisel verileriniz; siparişlerinizin alınması ve teslimi, müşteri iletişiminin yürütülmesi, faturalandırma ve yasal yükümlülüklerin yerine getirilmesi, talep ve şikâyetlerin yönetimi amaçlarıyla işlenir.',
    ],
  },
  {
    h: '4. Aktarım',
    body: [
      'Verileriniz; teslimat/kargo firmaları, ödeme kuruluşları ve yasal olarak yetkili kamu kurum ve kuruluşları ile yalnızca gerekli olduğu ölçüde ve mevzuata uygun şekilde paylaşılır.',
    ],
  },
  {
    h: '5. Toplama Yöntemi ve Hukuki Sebep',
    body: [
      'Kişisel verileriniz; web sitesi, telefon, WhatsApp ve mağaza aracılığıyla; KVKK m.5 kapsamında bir sözleşmenin kurulması/ifası, hukuki yükümlülüğün yerine getirilmesi ve meşru menfaat hukuki sebeplerine dayanılarak toplanır.',
    ],
  },
  {
    h: '6. KVKK m.11 Kapsamındaki Haklarınız',
    body: [
      'Kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltilmesini/silinmesini isteme, işlemenin sınırlandırılmasını talep etme ve işlemeye itiraz etme haklarına sahipsiniz.',
    ],
  },
  {
    h: '7. Çerezler (Cookies)',
    body: [
      'Web sitemiz, deneyiminizi iyileştirmek için zorunlu ve işlevsel çerezler kullanabilir. Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.',
    ],
  },
  {
    h: '8. Başvuru ve İletişim',
    body: [
      'Haklarınıza ilişkin taleplerinizi 0501 531 77 48 numarası veya mağaza adresimiz üzerinden bize iletebilirsiniz. Talebiniz en kısa sürede ve en geç 30 gün içinde sonuçlandırılır.',
    ],
  },
]

export default function Legal() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const isTr = prefix === ''

  useSEO({ title: `${t('footer.kvkk')} · Flora Art`, description: t('footer.kvkk') as string })

  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', minHeight: '36vh' }}
      >
        <div
          className="relative z-[2] mx-auto flex min-h-[36vh] max-w-[1100px] flex-col justify-end pb-12 pt-[120px] md:pb-16 md:pt-[140px]"
          style={X_PAD}
        >
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold)', opacity: 0.9 }}
          >
            <Link to={prefix || '/'} className="opacity-80 transition-opacity hover:opacity-100">
              {t('shop.breadcrumbHome')}
            </Link>
            <span aria-hidden="true" style={{ opacity: 0.55 }}>·</span>
            <span style={{ color: 'var(--color-cream)', opacity: 0.85 }}>{t('footer.kvkk')}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {t('footer.kvkk')}
          </motion.h1>
        </div>
      </section>

      <section className="relative w-full" style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}>
        <div className="mx-auto max-w-[1100px]" style={X_PAD}>
          {!isTr && (
            <p
              className="mb-10 text-[13px] italic"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.6 }}
            >
              This legal notice is provided in Turkish, the governing language under Turkish data-protection law. · Этот
              правовой текст приводится на турецком языке.
            </p>
          )}

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-8 md:col-start-1">
              {SECTIONS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mb-9"
                >
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      color: 'var(--color-forest)',
                      letterSpacing: '-0.005em',
                      lineHeight: 1.2,
                    }}
                  >
                    {s.h}
                  </h2>
                  {s.body.map((p, j) => (
                    <p
                      key={j}
                      className="max-w-[68ch] text-[15px] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.85 }}
                    >
                      {p}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
