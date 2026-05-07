import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import { createOrder } from '../sellercomponent/orderutils'
import './buyerdashboard.css'

const CATEGORY_OPTIONS = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Groceries',
]

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
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [orderModal, setOrderModal] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orderMessage, setOrderMessage] = useState('')

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
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)

    const matchesCategory =
      selectedCategory === 'All Categories' || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  function handlePlaceOrder(product) {
    setOrderModal(product)
    setOrderQuantity(1)
    setOrderMessage('')
  }

  function submitOrder() {
    if (!orderModal) return

    if (orderQuantity < 1 || orderQuantity > orderModal.stock) {
      setOrderMessage(`Quantity must be between 1 and ${orderModal.stock}`)
      return
    }

    try {
      // Create the order
      createOrder({
        productId: orderModal.id,
        productName: orderModal.name,
        price: orderModal.price,
        sellerEmail: orderModal.sellerEmail,
        buyerEmail: user.email,
        quantity: orderQuantity,
      })

      // Decrease product stock
      const updatedProducts = products.map((product) =>
        product.id === orderModal.id
          ? { ...product, stock: product.stock - orderQuantity }
          : product
      )
      localStorage.setItem('marketplace_products', JSON.stringify(updatedProducts))
      setProducts(updatedProducts)

      setOrderMessage('✓ Order placed successfully!')
      setTimeout(() => {
        setOrderModal(null)
        setOrderQuantity(1)
      }, 1500)
    } catch (error) {
      setOrderMessage('Failed to place order. Try again.')
    }
  }

  return (
    <main className="page buyerPage">
      <div className="buyerContainer">
        <section className="buyerHeader">
          <h1>Marketplace</h1>
          <p className="muted">Browse and purchase products from sellers</p>

          <div className="filterControls">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchInput"
              />
            </div>

            <div className="categoryFilter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="categorySelect"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="productsSection">
          <h2>Available Products ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <p className="muted">
              {searchTerm || selectedCategory !== 'All Categories'
                ? 'No products match your filters.'
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
                      onClick={() => handlePlaceOrder(product)}
                    >
                      {product.stock > 0 ? 'Place Order' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Order Modal */}
      {orderModal && (
        <div className="modal">
          <div className="modalContent">
            <button className="modalClose" onClick={() => setOrderModal(null)}>
              ✕
            </button>
            <h2>Place Order</h2>
            <div className="orderDetails">
              <img src={orderModal.imageData} alt={orderModal.name} className="orderImage" />
              <div className="orderInfo">
                <p>
                  <strong>Product:</strong> {orderModal.name}
                </p>
                <p>
                  <strong>Price:</strong> ${orderModal.price.toFixed(2)}
                </p>
                <p>
                  <strong>Available Stock:</strong> {orderModal.stock}
                </p>
              </div>
            </div>

            <div className="orderForm">
              <label className="field">
                Quantity
                <input
                  type="number"
                  min="1"
                  max={orderModal.stock}
                  value={orderQuantity}
                  onChange={(e) => {
                    setOrderQuantity(Math.max(1, Math.min(orderModal.stock, Number(e.target.value))))
                    setOrderMessage('')
                  }}
                  className="quantityInput"
                />
              </label>

              <p className="orderTotal">
                <strong>Total: ${(orderModal.price * orderQuantity).toFixed(2)}</strong>
              </p>

              {orderMessage && (
                <div className={`alert ${orderMessage.includes('✓') ? 'alert--success' : 'alert--error'}`}>
                  {orderMessage}
                </div>
              )}

              <div className="modalActions">
                <button className="btn" type="button" onClick={submitOrder}>
                  Confirm Order
                </button>
                <button className="btn btn--secondary" type="button" onClick={() => setOrderModal(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
