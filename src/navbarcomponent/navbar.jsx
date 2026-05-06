import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../auth/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/seller">
        Marketplace
      </Link>
      <nav className="navbar__nav">
        <Link to="/seller">Seller</Link>
        {user ? (
          <button className="linkBtn" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  )
}
