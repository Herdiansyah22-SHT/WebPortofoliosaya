import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/auth'
import { AuthContext } from './authContextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  const reset = useCallback(() => {
    setUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    let active = true

    authApi
      .me()
      .then(({ data }) => {
        if (!active) return
        setUser(data.data.user) // 'data' = axios body, 'data.data.user' = payload API
        setStatus('authenticated')
      })
      .catch(() => {
        if (active) reset()
      })

    return () => {
      active = false
    }
  }, [reset])

  useEffect(() => {
    const onUnauthorized = () => reset()
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [reset])

  const login = useCallback(async (email, password) => {
    // Meminta token CSRF terlebih dahulu
    await authApi.csrf()

    const { data } = await authApi.login(email, password)
    setUser(data.data.user)
    setStatus('authenticated')
    return data.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Abaikan error jaringan saat logout
    }
    reset()
  }, [reset])

  const hasPermission = useCallback(
    (permission) => Boolean(user?.permissions?.includes(permission)),
    [user],
  )

  const value = useMemo(
    () => ({ status, user, login, logout, hasPermission, isAuthenticated: status === 'authenticated' }),
    [status, user, login, logout, hasPermission],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
