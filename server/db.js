import { MongoClient } from 'mongodb'

let client
let db

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace'
    client = new MongoClient(mongoURI)
    await client.connect()
    db = client.db('marketplace')
    
    // Ensure indexes
    const users = db.collection('users')
    await users.createIndex({ email: 1 }, { unique: true })
    
    const products = db.collection('products')
    await products.createIndex({ sellerEmail: 1 })
    
    const orders = db.collection('orders')
    await orders.createIndex({ sellerEmail: 1 })
    await orders.createIndex({ buyerEmail: 1 })
    
    console.log('✓ Connected to MongoDB')
    return db
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message)
    throw error
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.')
  }
  return db
}

export async function closeDB() {
  if (client) {
    await client.close()
  }
}
