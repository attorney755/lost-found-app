const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const apiRoutes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();

// Security and Body Parsing Middleware with 50MB Limit (Fixes HTTP 413 Payload Too Large)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🏠 Lost & Found API Server is live!');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('⏳ Connecting to Database...');
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  return server;
}

startServer();

module.exports = app;