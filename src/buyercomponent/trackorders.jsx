import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import { getOrdersByBuyerEmail, ORDER_STATUS } from '../sellercomponent/orderutils'
import './trackorders.css'

export default function TrackOrders() {
  const user = getCurrentUser()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    if (user && user.email) {
      const buyerOrders = getOrdersByBuyerEmail(user.email)
      setOrders(buyerOrders)
    }
  }, [user, location])

  if (!user) return null

  if (user.role !== 'buyer') {
    return (
      <main className="page">
        <h1>Track Orders</h1>
        <p className="muted">Only buyer accounts can access this page.</p>
      </main>
    )
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Processing':
        return 'statusProcessing'
      case 'Shipped':
        return 'statusShipped'
      case 'Delivered':
        return 'statusDelivered'
      case 'Cancelled':
        return 'statusCancelled'
      default:
        return 'statusDefault'
    }
  }

  function toggleOrderDetails(orderId) {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'Processing':
        return '⏳'
      case 'Shipped':
        return '📦'
      case 'Delivered':
        return '✓'
      case 'Cancelled':
        return '✗'
      default:
        return '•'
    }
  }

  return (
    <main className="page trackOrdersPage">
      <div className="trackOrdersContainer">
        <section className="trackOrdersHeader">
          <h1>Order Tracking</h1>
          <p className="muted">View and track all your orders</p>
        </section>

        <section className="ordersSection">
          {orders.length === 0 ? (
            <div className="emptyState">
              <p className="muted">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="ordersList">
              {orders.map((order) => (
                <div key={order.id} className="orderItem">
                  <div
                    className="orderHeader"
                    onClick={() => toggleOrderDetails(order.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="orderInfo">
                      <h3 className="orderProductName">{order.productName}</h3>
                      <p className="orderDate">
                        Order ID: {order.id.substring(0, 8)}... | Ordered on{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="orderStatus">
                      <span className={`statusBadge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>

                    <div className="expandIcon">
                      {expandedOrderId === order.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="orderDetails">
                      <div className="detailsGrid">
                        <div className="detailItem">
                          <label>Product Name</label>
                          <p>{order.productName}</p>
                        </div>

                        <div className="detailItem">
                          <label>Quantity</label>
                          <p>{order.quantity}</p>
                        </div>

                        <div className="detailItem">
                          <label>Unit Price</label>
                          <p>${order.price.toFixed(2)}</p>
                        </div>

                        <div className="detailItem">
                          <label>Total Price</label>
                          <p className="totalPrice">${(order.price * order.quantity).toFixed(2)}</p>
                        </div>

                        <div className="detailItem">
                          <label>Current Status</label>
                          <p>
                            <span className={`statusBadge ${getStatusBadgeClass(order.status)}`}>
                              {getStatusIcon(order.status)} {order.status}
                            </span>
                          </p>
                        </div>

                        <div className="detailItem">
                          <label>Seller</label>
                          <p>{order.sellerEmail}</p>
                        </div>

                        <div className="detailItem">
                          <label>Order Date</label>
                          <p>{new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="detailItem">
                          <label>Tracking Progress</label>
                          <div className="progressBar">
                            <div
                              className="progressFill"
                              style={{
                                width:
                                  order.status === 'Processing'
                                    ? '25%'
                                    : order.status === 'Shipped'
                                      ? '75%'
                                      : order.status === 'Delivered'
                                        ? '100%'
                                        : order.status === 'Cancelled'
                                          ? '0%'
                                          : '0%',
                              }}
                            ></div>
                          </div>
                          <div className="progressLabels">
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
