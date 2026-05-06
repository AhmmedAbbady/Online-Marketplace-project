import { getCurrentUser } from '../auth/auth'
import "./sellerhome.css";

export default function SellerHome() {
  const user = getCurrentUser()

  if (!user) return null

  if (user.role !== 'seller') {
    return (
      <main className="page">
        <h1>Seller Dashboard</h1>
        <p className="muted">
          Your account role is <strong>{user.role}</strong>. This area is for sellers.
        </p>
      </main>
    )
  }

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-bg">
          <h1>Seller Dashboard</h1>
          <div className="dashboard-icons-row">
            <span className="dashboard-icon">📦</span>
            <span className="dashboard-icon">🛒</span>
            <span className="dashboard-icon">📈</span>
            <span className="dashboard-icon">💬</span>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-stats">
          <div className="stat-card stat-card--blue">
            <div className="stat-label">Products</div>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card stat-card--magenta">
            <div className="stat-label">Orders</div>
            <div className="stat-value">34</div>
          </div>
          <div className="stat-card stat-card--plain">
            <div className="stat-label">Categories</div>
            <div className="stat-value">5</div>
          </div>
        </section>
        <section className="dashboard-panels">
          <div className="dashboard-panel">
            <h2>Recent Orders</h2>
            <ul>
              <li>Order #1234 - Pending</li>
              <li>Order #1233 - Shipped</li>
              <li>Order #1232 - Delivered</li>
            </ul>
          </div>
          <div className="dashboard-panel">
            <h2>Top Products</h2>
            <ul>
              <li>Product A</li>
              <li>Product B</li>
              <li>Product C</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
