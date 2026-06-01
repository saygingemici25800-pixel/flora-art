/**
 * Admin auth store.
 *
 * STEP 2: a mock gate. `login(password)` checks against DEMO_PASSWORD and
 * persists a boolean session flag in localStorage so a reload keeps you in.
 *
 * STEP 3 swap: `login` → POST /api/auth/login (server sets the httpOnly
 * cookie), `logout` → POST /api/auth/verify?logout=1, and the persisted
 * flag is replaced by a GET /api/auth/verify check on boot.
 */
import { create } from 'zustand'

/** Demo-only password — surfaced as a hint on the login screen. */
export const DEMO_PASSWORD = 'flora2026'

const STORAGE_KEY = 'fa_admin_session'
const LOGIN_DELAY_MS = 450

function readSession(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeSession(authed: boolean): void {
  try {
    if (authed) localStorage.setItem(STORAGE_KEY, '1')
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* localStorage unavailable (private mode) — session stays in-memory only. */
  }
}

interface AuthState {
  authed: boolean
  loading: boolean
  error: string | null
  login: (password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  authed: readSession(),
  loading: false,
  error: null,

  login: async (password) => {
    set({ loading: true, error: null })
    await new Promise((r) => setTimeout(r, LOGIN_DELAY_MS))
    const ok = password === DEMO_PASSWORD
    if (ok) {
      writeSession(true)
      set({ authed: true, loading: false, error: null })
    } else {
      set({ loading: false, error: 'Parola hatalı. Lütfen tekrar deneyin.' })
    }
    return ok
  },

  logout: () => {
    writeSession(false)
    set({ authed: false, error: null })
  },

  clearError: () => set({ error: null }),
}))
