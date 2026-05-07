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
      <Link className="navbar__brand" to="/">
        Marketplace
      </Link>
      <nav className="navbar__nav">
        {user && user.role === 'seller' && <Link to="/seller">Seller Dashboard</Link>}
        {user && user.role === 'buyer' && <Link to="/buyer">Marketplace</Link>}
        {user && user.role === 'buyer' && <Link to="/buyer/track-orders">Track Orders</Link>}
        {user ? (
          <>
            {user.role === 'seller' && (
              <button
                className="linkBtn"
                type="button"
                onClick={() => navigate('/seller/products/new', { state: { t: Date.now() } })}
              >
                List Product
              </button>
            )}
            <button className="linkBtn" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
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
