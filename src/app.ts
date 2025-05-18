import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import config from '../config/config';
import routes from './routes';
import swaggerSpec from './swagger/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Create Express application
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'"],
      'style-src': ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      'font-src': ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

// CORS middleware
app.use(cors({
  origin: config.corsOrigin,
  optionsSuccessStatus: 200,
  credentials: true
}));

// Request logging
app.use(morgan(config.logFormat));

// JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../../public')));

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use(config.apiPrefix, routes);

// Serve SPA index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.url.startsWith(config.apiPrefix) || req.url.startsWith('/api-docs')) {
    return next();
  }
  
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app; 