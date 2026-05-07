import express from 'express'
import { createUser, findUserByEmail, verifyPassword } from '../models/User.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (role !== 'seller' && role !== 'buyer') {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await createUser({ name, email, password, role })
    res.json({ user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (role !== 'seller' && role !== 'buyer') {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (user.role !== role) {
      return res.status(401).json({ error: `This account is a ${user.role} account, not a ${role} account` })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
