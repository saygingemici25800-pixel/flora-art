import { useEffect } from 'react'

const LD_ID = 'flora-art-localbusiness-jsonld'

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  name: 'Flora Art Çiçekçi Fethiye',
  alternateName: ['Flora Art Florist', 'Цветы Фетхие', 'Flora Art Fethiye'],
  url: 'https://floraart.com.tr',
  telephone: '+905015317748',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Atatürk Cd. 98/a',
    addressLocality: 'Fethiye',
    addressRegion: 'Muğla',
    postalCode: '48300',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.6219309,
    longitude: 29.1170831,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '08:00',
    closes: '20:00',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '122',
  },
  priceRange: '₺₺',
  image: 'https://floraart.com.tr/og-image.svg',
  sameAs: [
    'https://www.instagram.com/floraart.fethiye',
    'https://maps.google.com/?q=Atat%C3%BCrk+Cd.+98%2Fa+Kesikkap%C4%B1+Fethiye',
  ],
} as const

export default function JsonLd() {
  useEffect(() => {
    let el = document.getElementById(LD_ID) as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.id = LD_ID
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(LOCAL_BUSINESS)
  }, [])

  return null
}
