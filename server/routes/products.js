import express from 'express'
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsBySellerEmail,
  updateProduct,
  deleteProduct,
} from '../models/Product.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts()
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/seller/:sellerEmail', async (req, res) => {
  try {
    const { sellerEmail } = req.params
    const products = await getProductsBySellerEmail(sellerEmail)
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await getProductById(id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, description, imageData, imageName, sellerEmail } = req.body

    if (!name || !category || !price || !stock || !description || !imageData || !sellerEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const product = await createProduct({
      name,
      category,
      price,
      stock,
      description,
      imageData,
      imageName,
      sellerEmail,
    })

    res.status(201).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const product = await updateProduct(id, updates)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await deleteProduct(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
