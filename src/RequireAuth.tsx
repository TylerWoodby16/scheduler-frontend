import { Navigate } from 'react-router-dom'
import jwtDecode, { JwtPayload } from 'jwt-decode'

export const RequireAuth = ({ children }: { children: any }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />
  }

  const decodedToken = jwtDecode<JwtPayload>(token)

  if (!decodedToken || !decodedToken.exp) {
    return <Navigate to="/login" />
  }

  // Check if token is expired.
  const currentTime = Date.now() / 1000
  if (currentTime > decodedToken.exp) {
    return <Navigate to="/login" />
  }

  return children
}
