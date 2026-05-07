import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import './buyerdashboard.css'

function readProducts() {
  try {
    const raw = localStorage.getItem('marketplace_products')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function BuyerDashboard() {
  const user = getCurrentUser()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setProducts(readProducts())
  }, [location])

  if (!user) return null

  if (user.role !== 'buyer') {
    return (
      <main className="page">
        <h1>Marketplace</h1>
        <p className="muted">Only buyer accounts can access this page.</p>
      </main>
    )
  }

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase()
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    )
  })

  return (
    <main className="page buyerPage">
      <div className="buyerContainer">
        <section className="buyerHeader">
          <h1>Marketplace</h1>
          <p className="muted">Browse and purchase products from sellers</p>

          <div className="searchBox">
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
            />
          </div>
        </section>

        <section className="productsSection">
          <h2>Available Products ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <p className="muted">
              {searchTerm
                ? 'No products match your search.'
                : 'No products available yet.'}
            </p>
          ) : (
            <div className="productsGrid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="productCard">
                  {product.imageData && (
                    <img
                      src={product.imageData}
                      alt={product.name}
                      className="productImage"
                    />
                  )}
                  <div className="productInfo">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="description">{product.description}</p>
                    <div className="productMeta">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className={`stock ${product.stock > 0 ? 'inStock' : 'outOfStock'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <button
                      className="btn buyBtn"
                      type="button"
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
