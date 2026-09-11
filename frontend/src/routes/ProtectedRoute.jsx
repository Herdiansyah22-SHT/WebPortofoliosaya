import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from '../components/common/LoadingScreen'

/** Blokir akses guest: hanya user terautentikasi yang lolos. UX-only — backend tetap security boundary. */
export function ProtectedRoute({ children }) {
  const { status } = useAuth()

  if (status === 'loading') return <LoadingScreen />

  if (status !== 'authenticated') return <Navigate to="/admin/login" replace />

  return children
}

/** Blokir akses user terautentikasi: hanya guest yang boleh lihat halaman ini. */
export function GuestRoute({ children }) {
  const { status } = useAuth()

  if (status === 'loading') return <LoadingScreen />

  if (status === 'authenticated') return <Navigate to="/admin" replace />

  return children
}
