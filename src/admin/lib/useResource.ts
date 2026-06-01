/**
 * Minimal async-resource hook for admin pages.
 *
 * Runs `loader` on mount (and whenever `deps` change), tracks loading / error,
 * and exposes `reload()` to refetch after a mutation. Guards against setting
 * state on an unmounted component and ignores stale responses.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

interface Resource<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useResource<T>(loader: () => Promise<T>, deps: unknown[] = []): Resource<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  // Keep the latest loader without making it a re-run trigger.
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const reload = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    loaderRef.current().then(
      (result) => {
        if (!active) return
        setData(result)
        setLoading(false)
      },
      (err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  return { data, loading, error, reload }
}
