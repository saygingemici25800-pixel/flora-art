/**
 * Admin auth store — live API (STEP 3).
 *
 * - login        → POST /api/auth/login   { password }  (server sets httpOnly cookie)
 * - checkSession → GET  /api/auth/verify  → { authenticated }   (run on app mount)
 * - logout       → POST /api/auth/verify?logout=1            (server clears cookie)
 *
 * No password lives on the client. `checked` gates the route guard so a valid
 * cookie isn't bounced to the login screen before the session is verified.
 */
import { create } from 'zustand'

async function readError(res: Response): Promise<string | undefined> {
  try {
    const data = (await res.json()) as { error?: string }
    return data?.error
  } catch {
    return undefined
  }
}

interface AuthState {
  authed: boolean
  /** True once the initial /verify has resolved (guard waits on this). */
  checked: boolean
  /** True while a login request is in flight. */
  loading: boolean
  error: string | null
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  authed: false,
  checked: false,
  loading: false,
  error: null,

  login: async (password) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        set({ authed: true, checked: true, loading: false, error: null })
        return true
      }
      const serverMsg = await readError(res)
      const message =
        res.status === 401
          ? 'Parola hatalı. Lütfen tekrar deneyin.'
          : serverMsg ?? `Giriş başarısız (${res.status})`
      set({ loading: false, error: message })
      return false
    } catch {
      set({ loading: false, error: 'Sunucuya ulaşılamadı.' })
      return false
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/verify?logout=1', { method: 'POST', credentials: 'include' })
    } catch {
      /* ignore network errors — clear local state regardless */
    }
    set({ authed: false, checked: true, error: null })
  },

  checkSession: async () => {
    try {
      const res = await fetch('/api/auth/verify', { credentials: 'include' })
      const data = (await res.json()) as { authenticated?: boolean }
      set({ authed: Boolean(data?.authenticated), checked: true })
    } catch {
      set({ authed: false, checked: true })
    }
  },

  clearError: () => set({ error: null }),
}))
