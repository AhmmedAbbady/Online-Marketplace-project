import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/seller">
        Marketplace
      </Link>
      <nav className="navbar__nav">
        <Link to="/seller">Seller</Link>
      </nav>
    </header>
  )
}
