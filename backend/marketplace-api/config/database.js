const mongoose = require('mongoose');
const config = require('./index');

module.exports = function connectDB() {
  const uri = config.mongoURI;
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✓ MongoDB connected successfully'))
    .catch((err) => {
      console.warn('⚠ MongoDB connection warning:', err.message);
      console.log('ℹ Running in offline mode with mock data');
      // Don't crash - allow the server to run with mock data
    });
};
