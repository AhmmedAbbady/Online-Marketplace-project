# Frontend API Integration Guide

The backend is now ready with MongoDB. To use the API instead of localStorage, follow these steps:

## Update Auth Module

Replace `src/auth/auth.js` with API calls. The file now has API helpers in `src/api/client.js`.

### Example Updated Auth (Optional)

If you want to switch to MongoDB:

1. **Import API functions in auth.js:**
```javascript
import { apiSignup, apiLogin } from '../api/client.js'
```

2. **Replace signup function:**
```javascript
export async function signup({ name, email, password, role }) {
  const user = await apiSignup({ name, email, password, role })
  const currentUser = { name: user.name, email: user.email, role: user.role }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
  return currentUser
}
```

3. **Replace login function:**
```javascript
export async function login({ email, password, role }) {
  const user = await apiLogin({ email, password, role })
  const currentUser = { name: user.name, email: user.email, role: user.role }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
  return currentUser
}
```

## Update Components

### Seller Dashboard (sellerhome.jsx)
Replace localStorage calls with API:
- `apiGetSellerOrders(user.email)` instead of `readOrders()`

### Product Listing Form (productlistingform.jsx)
Replace localStorage calls with API:
- `apiGetSellerProducts(user.email)` instead of `readProducts()`
- `apiCreateProduct()` instead of localStorage.setItem()
- `apiUpdateProduct()` instead of localStorage.setItem()
- `apiDeleteProduct()` instead of localStorage filtering

### Buyer Dashboard (buyerdashboard.jsx)
Replace localStorage calls with API:
- `apiGetAllProducts()` instead of localStorage.getItem()

## Running Both Frontend and Backend

Open two terminals:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Current Status

- ✅ Backend API created with Express
- ✅ MongoDB models for Users, Products, Orders
- ✅ Frontend API client functions ready
- ⏳ Frontend components still using localStorage
- ⏳ Frontend components can be updated to use API anytime

## When Ready to Switch

When you're ready to fully use the MongoDB backend:
1. Update each component to use API functions from `src/api/client.js`
2. Remove localStorage calls
3. Test with MongoDB running
4. Data will now persist in MongoDB instead of browser localStorage

## Keep Both Working

For now, the frontend still uses localStorage, so you can:
- Continue using the app without MongoDB running
- The API is ready whenever you want to switch
- Simply update components one by one as needed
