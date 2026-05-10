// Mock data service for development/offline mode

const mockCategories = [
  { _id: '1', name: 'Electronics', description: 'Electronic devices and gadgets' },
  { _id: '2', name: 'Clothing', description: 'Apparel and accessories' },
  { _id: '3', name: 'Books', description: 'Books and educational materials' },
  { _id: '4', name: 'Home & Garden', description: 'Home and garden products' },
];

const mockProducts = [
  {
    _id: '1',
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 79.99,
    category: { _id: '1', name: 'Electronics' },
    seller: { _id: 'seller1', name: 'Tech Store', email: 'seller@tech.com' },
    stock: 15,
    rating: 4.5,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Running Shoes',
    description: 'Comfortable and durable running shoes',
    price: 89.99,
    category: { _id: '2', name: 'Clothing' },
    seller: { _id: 'seller2', name: 'Sport Store', email: 'seller@sport.com' },
    stock: 25,
    rating: 4.2,
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'JavaScript Guide',
    description: 'Complete guide to modern JavaScript development',
    price: 29.99,
    category: { _id: '3', name: 'Books' },
    seller: { _id: 'seller3', name: 'Book Store', email: 'seller@books.com' },
    stock: 50,
    rating: 4.8,
    createdAt: new Date()
  },
  {
    _id: '4',
    title: 'LED Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness',
    price: 39.99,
    category: { _id: '4', name: 'Home & Garden' },
    seller: { _id: 'seller4', name: 'Home Store', email: 'seller@home.com' },
    stock: 30,
    rating: 4.3,
    createdAt: new Date()
  },
  {
    _id: '5',
    title: 'Winter Jacket',
    description: 'Warm winter jacket for cold weather',
    price: 149.99,
    category: { _id: '2', name: 'Clothing' },
    seller: { _id: 'seller2', name: 'Sport Store', email: 'seller@sport.com' },
    stock: 10,
    rating: 4.6,
    createdAt: new Date()
  },
];

const mockUsers = [
  {
    _id: 'buyer1',
    name: 'John Buyer',
    email: 'buyer@example.com',
    role: 'buyer',
    createdAt: new Date()
  },
  {
    _id: 'seller1',
    name: 'Tech Store',
    email: 'seller@tech.com',
    role: 'seller',
    createdAt: new Date()
  },
];

module.exports = {
  mockCategories,
  mockProducts,
  mockUsers
};
