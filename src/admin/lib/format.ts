/**
 * Small formatting helpers shared across the admin panel.
 * Locale-fixed to Turkish — the admin UI is operated in TR only.
 */

const TRY = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

/** 450 → "₺450". */
export function money(amount: number): string {
  return TRY.format(amount)
}

/** 1234 → "1.234" (grouped, no currency). */
export function number(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value)
}

const DATE = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const DATE_TIME = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** ISO timestamp → "01 Haz 2026". */
export function date(iso: string): string {
  return DATE.format(new Date(iso))
}

/** ISO timestamp → "01 Haz 14:30". */
export function dateTime(iso: string): string {
  return DATE_TIME.format(new Date(iso))
}

/**
 * Relative "time ago" in Turkish, coarse-grained.
 * "az önce" / "5 dk önce" / "3 sa önce" / "2 gün önce" / falls back to date().
 */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const diffMs = now - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60_000)
  if (min < 1) return 'az önce'
  if (min < 60) return `${min} dk önce`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} sa önce`
  const days = Math.floor(hr / 24)
  if (days < 7) return `${days} gün önce`
  return date(iso)
}

/** Today's calendar date as an ISO `YYYY-MM-DD` string (local time). */
export function todayKey(now: number = Date.now()): string {
  const d = new Date(now)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
