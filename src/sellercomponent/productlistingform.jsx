import { useMemo, useState } from 'react'
import { getCurrentUser } from '../auth/auth'
import './productlistingform.css'

const INITIAL_FORM = {
  name: '',
  category: '',
  price: '',
  stock: '',
  imageUrl: '',
  description: '',
}

function readProducts() {
  try {
    const raw = localStorage.getItem('marketplace_products')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function ProductListingForm() {
  const user = getCurrentUser()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [products, setProducts] = useState(readProducts)

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.category.trim() &&
      Number(form.price) > 0 &&
      Number.isInteger(Number(form.stock)) &&
      Number(form.stock) >= 0 &&
      form.description.trim()
    )
  }, [form])

  if (!user) return null

  if (user.role !== 'seller') {
    return (
      <main className="page">
        <h1>Product Listing</h1>
        <p className="muted">Only seller accounts can list products.</p>
      </main>
    )
  }

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  function onSubmit(event) {
    event.preventDefault()

    const trimmedName = form.name.trim()
    const trimmedCategory = form.category.trim()
    const trimmedDescription = form.description.trim()
    const priceValue = Number(form.price)
    const stockValue = Number(form.stock)

    if (!trimmedName || !trimmedCategory || !trimmedDescription) {
      setError('Please fill all required fields.')
      return
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError('Price must be greater than 0.')
      return
    }

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      setError('Stock must be a whole number 0 or higher.')
      return
    }

    const newProduct = {
      id: Date.now().toString(),
      name: trimmedName,
      category: trimmedCategory,
      price: priceValue,
      stock: stockValue,
      imageUrl: form.imageUrl.trim(),
      description: trimmedDescription,
      sellerEmail: user.email,
      createdAt: new Date().toISOString(),
    }

    const updated = [newProduct, ...products]
    localStorage.setItem('marketplace_products', JSON.stringify(updated))
    setProducts(updated)
    setForm(INITIAL_FORM)
    setSuccess('Product listed successfully.')
    setError('')
  }

  return (
    <main className="page listingPage">
      <div className="listingGrid">
        <section className="card listingCard">
          <h1>List New Product</h1>
          <p className="muted">Add a product so buyers can see it in the marketplace later.</p>

          {error && <div className="alert listingAlert listingAlert--error">{error}</div>}
          {success && <div className="alert listingAlert listingAlert--success">{success}</div>}

          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              Product Name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="Wireless Mouse"
                required
              />
            </label>

            <label className="field">
              Category
              <input
                name="category"
                type="text"
                value={form.category}
                onChange={onChange}
                placeholder="Electronics"
                required
              />
            </label>

            <div className="listingRow">
              <label className="field">
                Price
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                  placeholder="49.99"
                  required
                />
              </label>

              <label className="field">
                Stock
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={onChange}
                  min="0"
                  step="1"
                  placeholder="15"
                  required
                />
              </label>
            </div>

            <label className="field">
              Image URL
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={onChange}
                placeholder="https://example.com/product-image.jpg"
              />
            </label>

            <label className="field">
              Description
              <textarea
                className="listingTextarea"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the product features and condition"
                rows={5}
                required
              />
            </label>

            <button className="btn" type="submit" disabled={!canSubmit}>
              Publish Product
            </button>
          </form>
        </section>

        <section className="panel listingPanel">
          <h2>Your Recent Listings</h2>
          {products.length === 0 ? (
            <p className="muted">No products listed yet.</p>
          ) : (
            <ul className="listingItems">
              {products
                .filter((item) => item.sellerEmail === user.email)
                .slice(0, 6)
                .map((item) => (
                  <li key={item.id} className="listingItem">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted">{item.category}</p>
                    </div>
                    <div className="listingMeta">
                      <span>${item.price.toFixed(2)}</span>
                      <span>Stock: {item.stock}</span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
