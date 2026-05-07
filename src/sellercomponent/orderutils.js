const ORDERS_KEY = 'marketplace_orders'

export const ORDER_STATUS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function createOrder({ productId, productName, price, sellerEmail, buyerEmail, quantity = 1 }) {
  const orders = readOrders()
  const newOrder = {
    id: Date.now().toString(),
    productId,
    productName,
    price,
    sellerEmail,
    buyerEmail,
    quantity,
    status: ORDER_STATUS[0], // 'Processing'
    createdAt: new Date().toISOString(),
  }
  writeOrders([newOrder, ...orders])
  return newOrder
}

export function getOrdersByBuyerEmail(buyerEmail) {
  const orders = readOrders()
  return orders.filter((order) => order.buyerEmail === buyerEmail)
}

export function getOrdersBySellerEmail(sellerEmail) {
  const orders = readOrders()
  return orders.filter((order) => order.sellerEmail === sellerEmail)
}

export function updateOrderStatus(orderId, status) {
  const orders = readOrders()
  const updated = orders.map((order) =>
    order.id === orderId ? { ...order, status } : order
  )
  writeOrders(updated)
  return updated.find((order) => order.id === orderId)
}
