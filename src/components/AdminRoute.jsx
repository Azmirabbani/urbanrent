import { RoleRoute } from '@/components/RoleRoute.jsx'

export function AdminRoute({ children }) {
  return (
    <RoleRoute allow={['super_admin']} fallbackTo="/">
      {children}
    </RoleRoute>
  )
}
