import { useState } from 'react'
import { getCurrentUser } from '../auth/auth'
import './productlistingform.css'

const CATEGORY_OPTIONS = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Groceries',
]

const INITIAL_FORM = {
  name: '',
  category: 'Electronics',
  price: '',
  stock: '',
  imageData: '',
  imageName: '',
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

  function onImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) {
      setForm((prev) => ({ ...prev, imageData: '', imageName: '' }))
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const data = typeof reader.result === 'string' ? reader.result : ''
      setForm((prev) => ({
        ...prev,
        imageData: data,
        imageName: file.name,
      }))
      setError('')
      setSuccess('')
    }
    reader.onerror = () => {
      setError('Failed to upload image. Try another file.')
    }
    reader.readAsDataURL(file)
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

    if (!form.imageData) {
      setError('Please upload a product image.')
      return
    }

    const newProduct = {
      id: Date.now().toString(),
      name: trimmedName,
      category: trimmedCategory,
      price: priceValue,
      stock: stockValue,
      imageData: form.imageData,
      imageName: form.imageName,
      description: trimmedDescription,
      sellerEmail: user.email,
      createdAt: new Date().toISOString(),
    }

    const updated = [newProduct, ...products]

    try {
      localStorage.setItem('marketplace_products', JSON.stringify(updated))
      setProducts(updated)
      setForm(INITIAL_FORM)
      setSuccess('Product listed successfully.')
      setError('')
    } catch {
      setError('Unable to save product. Try a smaller image file.')
    }
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
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                required
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
              Product Image
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                required
              />
            </label>

            {form.imageName ? (
              <p className="listingUploadInfo">Uploaded: {form.imageName}</p>
            ) : null}

            {form.imageData ? (
              <img className="listingPreview" src={form.imageData} alt="Product preview" />
            ) : null}

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

            <button className="btn" type="submit">
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
