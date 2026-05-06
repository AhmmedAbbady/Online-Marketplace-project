import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from './auth'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
