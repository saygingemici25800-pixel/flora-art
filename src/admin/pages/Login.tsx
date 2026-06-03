/**
 * Admin login. Posts the password to /api/auth/login; on success the server
 * sets the httpOnly cookie, the auth store flips, and the AdminApp guard
 * lets the panel render.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/useAuth'
import { Button, EASE, Field, TextInput } from '../components/primitives'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error, clearError, authed } = useAuth()
  const [password, setPassword] = useState('')

  // Already signed in → skip the form.
  useEffect(() => {
    if (authed) navigate('/admin', { replace: true })
  }, [authed, navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await login(password)
    if (ok) navigate('/admin', { replace: true })
  }

  return (
    <div
      className="admin-scope flex min-h-screen items-center justify-center px-4"
      style={{ background: 'var(--color-forest)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm bg-white"
        style={{ borderRadius: 4, boxShadow: '0 40px 90px -30px rgba(0,0,0,0.6)' }}
      >
        <div className="px-8 pt-9 pb-7 text-center">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--color-forest)', lineHeight: 1 }}>
            Flora Art
          </p>
          <p
            className="mt-2 text-[0.62rem] uppercase tracking-[0.35em]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            Yönetim Paneli
          </p>
        </div>

        <form onSubmit={onSubmit} className="px-8 pb-8">
          <Field label="Parola" htmlFor="admin-password" error={error ?? undefined}>
            <TextInput
              id="admin-password"
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) clearError()
              }}
            />
          </Field>

          <Button type="submit" loading={loading} className="mt-5 w-full">
            Giriş Yap
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
