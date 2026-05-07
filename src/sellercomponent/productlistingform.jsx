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
  id: '',
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

    let updated
    let message
    if (form.id) {
      // Edit mode: update existing product
      updated = products.map((p) =>
        p.id === form.id && p.sellerEmail === user.email
          ? {
              ...p,
              name: trimmedName,
              category: trimmedCategory,
              price: priceValue,
              stock: stockValue,
              imageData: form.imageData,
              imageName: form.imageName,
              description: trimmedDescription,
            }
          : p
      )
      message = 'Product updated successfully.'
    } else {
      // New product
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
      updated = [newProduct, ...products]
      message = 'Product listed successfully.'
    }

    try {
      localStorage.setItem('marketplace_products', JSON.stringify(updated))
      setProducts(updated)
      setForm(INITIAL_FORM)
      setSuccess(message)
      setError('')
    } catch {
      setError('Unable to save product. Try a smaller image file.')
    }
  }

  function onEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageData: product.imageData,
      imageName: product.imageName,
      description: product.description,
    })
    setError('')
    setSuccess('Editing product. Make changes and click Publish Product.')
  }

  function onDelete(productId) {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const updated = products.filter(
      (p) => !(p.id === productId && p.sellerEmail === user.email)
    )
    try {
      localStorage.setItem('marketplace_products', JSON.stringify(updated))
      setProducts(updated)
      setSuccess('Product deleted.')
      setError('')
      if (form.id === productId) setForm(INITIAL_FORM)
    } catch {
      setError('Unable to delete product.')
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
                      <button className="listingEditBtn" type="button" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                      <button className="listingDeleteBtn" type="button" onClick={() => onDelete(item.id)}>
                        Delete
                      </button>
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
