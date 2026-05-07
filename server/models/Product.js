import { ObjectId } from 'mongodb'
import { getDB } from '../db.js'

export async function createProduct({ name, category, price, stock, description, imageData, imageName, sellerEmail }) {
  const db = getDB()
  const products = db.collection('products')

  const result = await products.insertOne({
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    description,
    imageData,
    imageName,
    sellerEmail,
    createdAt: new Date(),
  })

  return { id: result.insertedId, ...{ name, category, price, stock, description, imageData, imageName, sellerEmail } }
}

export async function getAllProducts() {
  const db = getDB()
  const products = db.collection('products')
  return await products.find({}).toArray()
}

export async function getProductById(id) {
  const db = getDB()
  const products = db.collection('products')
  return await products.findOne({ _id: new ObjectId(id) })
}

export async function getProductsBySellerEmail(sellerEmail) {
  const db = getDB()
  const products = db.collection('products')
  return await products.find({ sellerEmail }).toArray()
}

export async function updateProduct(id, updates) {
  const db = getDB()
  const products = db.collection('products')
  
  const result = await products.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  )
  
  return result.value
}

export async function deleteProduct(id) {
  const db = getDB()
  const products = db.collection('products')
  const result = await products.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
