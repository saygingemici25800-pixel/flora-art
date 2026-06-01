/**
 * Admin design-system primitives.
 *
 * A small, self-contained set of controls styled to the Flora Art palette
 * (forest / gold / cream). Used by every admin page. No data access here —
 * pure presentation.
 */
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { motion } from 'framer-motion'
import type { OrderStatus } from '../../types'
import { STATUS_META } from '../lib/labels'

export const EASE = [0.16, 1, 0.3, 1] as const

/* ── Spinner ───────────────────────────────────────────────────── */

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block animate-spin rounded-full"
      style={{
        width: size,
        height: size,
        border: '2px solid rgba(28,43,26,0.18)',
        borderTopColor: 'var(--color-gold)',
      }}
    />
  )
}

/* ── Button ────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'primary',
  loading = false,
  size = 'md',
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const pad = size === 'sm' ? 'px-3.5 py-1.5 text-[0.7rem]' : 'px-5 py-2.5 text-[0.78rem]'
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      data-variant={variant}
      className={`admin-btn inline-flex items-center justify-center gap-2 border uppercase tracking-[0.12em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${pad} ${className}`}
      style={{ fontFamily: 'var(--font-body)', borderRadius: 2 }}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

/* ── Form field wrapper ────────────────────────────────────────── */

interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function Field({ label, hint, error, required, htmlFor, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[0.7rem] uppercase tracking-[0.16em]"
          style={{ color: 'var(--color-forest)', opacity: 0.7, fontFamily: 'var(--font-body)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-gold)' }}> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-[0.72rem]" style={{ color: '#8A3B30' }}>
          {error}
        </span>
      ) : hint ? (
        <span className="text-[0.72rem]" style={{ color: 'var(--color-ink)', opacity: 0.5 }}>
          {hint}
        </span>
      ) : null}
    </div>
  )
}

const controlBase =
  'admin-control w-full bg-white px-3 py-2.5 text-[0.85rem] outline-none transition-colors'
const controlStyle = {
  fontFamily: 'var(--font-body)',
  color: 'var(--color-ink)',
  border: '1px solid var(--color-beige)',
  borderRadius: 2,
} as const

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input {...rest} className={`${controlBase} ${className}`} style={controlStyle} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', rows = 3, ...rest } = props
  return (
    <textarea
      {...rest}
      rows={rows}
      className={`${controlBase} resize-y ${className}`}
      style={controlStyle}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ options, placeholder, className = '', ...rest }: SelectProps) {
  return (
    <select {...rest} className={`${controlBase} ${className}`} style={controlStyle}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/* ── Toggle (switch) ───────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 disabled:opacity-50"
    >
      <span
        className="relative inline-block transition-colors duration-300"
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? 'var(--color-gold)' : 'rgba(28,43,26,0.22)',
        }}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="absolute top-1/2 block bg-white"
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            left: checked ? 21 : 3,
            transform: 'translateY(-50%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        />
      </span>
      {label && (
        <span className="text-[0.82rem]" style={{ color: 'var(--color-ink)' }}>
          {label}
        </span>
      )}
    </button>
  )
}

/* ── Badges & tags ─────────────────────────────────────────────── */

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.1em] whitespace-nowrap"
      style={{ background: meta.bg, color: meta.fg, borderRadius: 999, fontFamily: 'var(--font-body)' }}
    >
      {meta.label}
    </span>
  )
}

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' }) {
  const gold = tone === 'gold'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[0.66rem] uppercase tracking-[0.1em]"
      style={{
        background: gold ? 'rgba(200,169,110,0.16)' : 'rgba(28,43,26,0.07)',
        color: gold ? '#7A5A1E' : 'var(--color-forest)',
        borderRadius: 2,
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </span>
  )
}

/* ── Surfaces ──────────────────────────────────────────────────── */

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={`bg-white ${padded ? 'p-5' : ''} ${className}`}
      style={{ border: '1px solid var(--color-beige)', borderRadius: 3 }}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-forest)', lineHeight: 1.1 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[0.85rem]" style={{ color: 'var(--color-ink)', opacity: 0.6 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center"
      style={{ border: '1px dashed var(--color-beige)', borderRadius: 3 }}
    >
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--color-forest)' }}>
        {title}
      </p>
      {hint && (
        <p className="text-[0.82rem]" style={{ color: 'var(--color-ink)', opacity: 0.55 }}>
          {hint}
        </p>
      )}
    </div>
  )
}
