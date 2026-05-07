const API_URL = 'http://localhost:5000/api'

export async function apiSignup({ name, email, password, role }) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Signup failed')
  }
  
  const data = await response.json()
  return data.user
}

export async function apiLogin({ email, password, role }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }
  
  const data = await response.json()
  return data.user
}

export async function apiGetAllProducts() {
  const response = await fetch(`${API_URL}/products`)
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  return data.products
}

export async function apiGetProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`)
  if (!response.ok) throw new Error('Product not found')
  const data = await response.json()
  return data.product
}

export async function apiGetSellerProducts(sellerEmail) {
  const response = await fetch(`${API_URL}/products/seller/${sellerEmail}`)
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  return data.products
}

export async function apiCreateProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create product')
  }
  
  const data = await response.json()
  return data.product
}

export async function apiUpdateProduct(id, updates) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }
  
  const data = await response.json()
  return data.product
}

export async function apiDeleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) throw new Error('Failed to delete product')
}

export async function apiGetAllOrders() {
  const response = await fetch(`${API_URL}/orders`)
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return data.orders
}

export async function apiGetOrderById(id) {
  const response = await fetch(`${API_URL}/orders/${id}`)
  if (!response.ok) throw new Error('Order not found')
  const data = await response.json()
  return data.order
}

export async function apiGetSellerOrders(sellerEmail) {
  const response = await fetch(`${API_URL}/orders/seller/${sellerEmail}`)
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return data.orders
}

export async function apiGetBuyerOrders(buyerEmail) {
  const response = await fetch(`${API_URL}/orders/buyer/${buyerEmail}`)
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return data.orders
}

export async function apiCreateOrder(order) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create order')
  }
  
  const data = await response.json()
  return data.order
}

export async function apiUpdateOrderStatus(id, status) {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update order')
  }
  
  const data = await response.json()
  return data.order
}

export async function apiDeleteOrder(id) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) throw new Error('Failed to delete order')
}
