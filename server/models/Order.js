import { ObjectId } from 'mongodb'
import { getDB } from '../db.js'

export const ORDER_STATUS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export async function createOrder({ productId, productName, sellerEmail, buyerEmail, status = 'Processing' }) {
  const db = getDB()
  const orders = db.collection('orders')

  const result = await orders.insertOne({
    productId: new ObjectId(productId),
    productName,
    sellerEmail,
    buyerEmail,
    status,
    createdAt: new Date(),
  })

  return { id: result.insertedId, productId, productName, sellerEmail, buyerEmail, status }
}

export async function getAllOrders() {
  const db = getDB()
  const orders = db.collection('orders')
  return await orders.find({}).toArray()
}

export async function getOrderById(id) {
  const db = getDB()
  const orders = db.collection('orders')
  return await orders.findOne({ _id: new ObjectId(id) })
}

export async function getOrdersBySellerEmail(sellerEmail) {
  const db = getDB()
  const orders = db.collection('orders')
  return await orders.find({ sellerEmail }).toArray()
}

export async function getOrdersByBuyerEmail(buyerEmail) {
  const db = getDB()
  const orders = db.collection('orders')
  return await orders.find({ buyerEmail }).toArray()
}

export async function updateOrderStatus(id, status) {
  if (!ORDER_STATUS.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${ORDER_STATUS.join(', ')}`)
  }

  const db = getDB()
  const orders = db.collection('orders')
  
  const result = await orders.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: 'after' }
  )
  
  return result.value
}

export async function deleteOrder(id) {
  const db = getDB()
  const orders = db.collection('orders')
  const result = await orders.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
