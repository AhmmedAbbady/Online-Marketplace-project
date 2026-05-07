import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersBySellerEmail,
  getOrdersByBuyerEmail,
  updateOrderStatus,
  deleteOrder,
  ORDER_STATUS,
} from '../models/Order.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders()
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/seller/:sellerEmail', async (req, res) => {
  try {
    const { sellerEmail } = req.params
    const orders = await getOrdersBySellerEmail(sellerEmail)
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/buyer/:buyerEmail', async (req, res) => {
  try {
    const { buyerEmail } = req.params
    const orders = await getOrdersByBuyerEmail(buyerEmail)
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await getOrderById(id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json({ order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { productId, productName, sellerEmail, buyerEmail, status } = req.body

    if (!productId || !productName || !sellerEmail || !buyerEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const order = await createOrder({
      productId,
      productName,
      sellerEmail,
      buyerEmail,
      status: status || 'Processing',
    })

    res.status(201).json({ order })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const order = await updateOrderStatus(id, status)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ order })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await deleteOrder(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ message: 'Order deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/status/options', (req, res) => {
  res.json({ statuses: ORDER_STATUS })
})

export default router
