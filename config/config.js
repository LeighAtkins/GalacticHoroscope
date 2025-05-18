/**
 * Application configuration
 */
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API configuration
  apiPrefix: '/api',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Logging configuration
  logFormat: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};

module.exports = config; 