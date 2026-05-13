import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext.jsx'

/**
 * @param {{ children: import('react').ReactNode; allow: Array<'tenant' | 'owner' | 'super_admin'>; fallbackTo?: string }} props
 */
export function RoleRoute({ children, allow, fallbackTo = '/' }) {
  const { user, role, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-700 [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-600 [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500" />
        </div>
        <p className="text-sm font-medium text-stone-600">Memuat sesi…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!allow.includes(role)) {
    return <Navigate to={fallbackTo} replace />
  }

  return children
}
