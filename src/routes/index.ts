import express from 'express';
import zodiacRoutes from './zodiacRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    uptime: process.uptime()
  });
});

// Mount route modules
router.use(zodiacRoutes);

export default router; 