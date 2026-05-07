# Backend Setup Guide

## MongoDB Installation

### Option 1: Local MongoDB (Recommended for Development)

#### Windows:
1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will start as a Windows service automatically
4. Verify installation by opening PowerShell and running:
   ```
   mongosh
   ```

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Copy the connection string
5. Update `.env` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace
   ```

## Running the Application

### Start MongoDB (if using local installation)
```bash
# MongoDB should be running as a service, but if not:
mongod
```

### Start the Backend Server
```bash
npm run server
```

The server will start on `http://localhost:5000` and connect to MongoDB.

### Start the Frontend Development Server
In a different terminal:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email, password, and role

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/seller/:sellerEmail` - Get products by seller
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/seller/:sellerEmail` - Get orders for a seller
- `GET /api/orders/buyer/:buyerEmail` - Get orders for a buyer
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete an order

## Environment Variables

Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/marketplace
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_key_change_this_in_production
```

## Testing the API

You can test the API using tools like:
- **Postman** - https://www.postman.com/
- **REST Client** VS Code Extension
- **curl** command line tool

Example signup request:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "seller"
  }'
```

## Troubleshooting

### MongoDB connection failed
- Ensure MongoDB service is running
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB is listening on port 27017 (local) or check connection string (Atlas)

### Port 5000 already in use
- Change `PORT` in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

### CORS errors
- Ensure backend server is running
- Check that frontend is making requests to `http://localhost:5000`
- Verify CORS is enabled in `server/server.js`
