# MongoDB Backend Setup - Quick Start

## What's Been Created

✅ **Complete Node.js/Express Backend** with:
- MongoDB database connection (`server/db.js`)
- User authentication (signup/login with password hashing)
- Product CRUD operations
- Order management with status tracking
- API routes for all features
- CORS enabled for frontend communication

✅ **Database Models** (MongoDB Collections):
- `users` - Store seller and buyer accounts
- `products` - Store all product listings
- `orders` - Track all orders with status

✅ **Frontend API Client** (`src/api/client.js`):
- Ready-to-use functions for all API endpoints
- Can be integrated into components anytime

## Quick Start Steps

### 1. Install MongoDB

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer, follow wizard
- MongoDB runs as a service automatically

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. Start Backend Server

```bash
npm run server
```

You should see:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
✓ API available at http://localhost:5000/api
```

### 3. Start Frontend (in another terminal)

```bash
npm run dev
```

### 4. Test Backend (Optional)

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "seller"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "seller"
  }'
```

## Backend API Reference

### Authentication
```
POST   /api/auth/signup          - Create new account
POST   /api/auth/login           - Login (requires role selection)
```

### Products
```
GET    /api/products             - Get all products
GET    /api/products/:id         - Get single product
GET    /api/products/seller/:email - Get seller's products
POST   /api/products             - Create product
PUT    /api/products/:id         - Update product
DELETE /api/products/:id         - Delete product
```

### Orders
```
GET    /api/orders               - Get all orders
GET    /api/orders/:id           - Get single order
GET    /api/orders/seller/:email - Get seller's orders
GET    /api/orders/buyer/:email  - Get buyer's orders
POST   /api/orders               - Create order
PUT    /api/orders/:id/status    - Update order status
DELETE /api/orders/:id           - Delete order
```

## Using API in Frontend

The API client functions are ready in `src/api/client.js`:

```javascript
import {
  apiSignup,
  apiLogin,
  apiGetAllProducts,
  apiCreateProduct,
  apiGetSellerOrders,
  apiCreateOrder,
  // ... more functions
} from '../api/client.js'
```

Example in a component:
```javascript
const products = await apiGetAllProducts()
const newProduct = await apiCreateProduct({
  name: 'Test',
  category: 'Electronics',
  price: 99.99,
  stock: 10,
  description: 'A test product',
  imageData: '...base64...',
  imageName: 'test.jpg',
  sellerEmail: user.email
})
```

## Current State

- **Frontend:** Still using localStorage (backward compatible)
- **Backend:** Ready with MongoDB
- **Option 1:** Continue with localStorage (works fine)
- **Option 2:** Switch to MongoDB by updating components

## See Also

- `BACKEND_SETUP.md` - Detailed MongoDB setup and troubleshooting
- `API_INTEGRATION.md` - Guide to switch frontend to use API
- `.env` - Configuration file (edit MongoDB URI if needed)

## Need Help?

Check `BACKEND_SETUP.md` for detailed troubleshooting and setup instructions.
