import Button from '../Common/Button'
import StatusChip from '../Common/StatusChip'
import './ProductCard.css'

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete,
  onFlag 
}) {
  return (
    <div className="product-card">

      <div className="product-card__image-container">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="product-card__image"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }}
          />
        ) : (
          <div className="product-card__image-placeholder">📦</div>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__category">{product.category?.name || 'Uncategorized'}</p>
        {product.deliveryDays && (
          <p className="product-card__delivery">🚚 {product.deliveryDays} day{product.deliveryDays !== 1 ? 's' : ''} delivery</p>
        )}

        <div className="product-card__footer">
          <div className="product-card__price">${product.price}</div>
          <StatusChip status={product.status || 'In Stock'} />
        </div>
      </div>

      <div className="product-card__actions">
        <Button variant="primary" size="sm" onClick={() => onEdit(product)}>Edit</Button>
        <Button variant="secondary" size="sm" onClick={() => onDelete(product._id)}>Delete</Button>
      </div>
    </div>
  )
}
