const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Parse request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Centralized request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Setup API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'Mini CRM API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
