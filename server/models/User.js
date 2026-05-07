import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { getDB } from '../db.js'

export async function createUser({ name, email, password, role }) {
  const db = getDB()
  const users = db.collection('users')

  const existing = await users.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  const result = await users.insertOne({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    createdAt: new Date(),
  })

  return { id: result.insertedId, name, email: email.toLowerCase(), role }
}

export async function findUserByEmail(email) {
  const db = getDB()
  const users = db.collection('users')
  return await users.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id) {
  const db = getDB()
  const users = db.collection('users')
  return await users.findOne({ _id: new ObjectId(id) })
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
