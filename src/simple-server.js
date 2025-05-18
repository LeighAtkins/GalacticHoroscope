const express = require('express');
const path = require('path');
const { determineZodiacSign, generateFortune, isValidDate } = require('./zodiac');
const zodiacModelController = require('./models/zodiacModelController');

const app = express();
const PORT = process.env.PORT || 3000;

// Set proper MIME types
app.use((req, res, next) => {
  const ext = path.extname(req.url).toLowerCase();
  
  if (ext === '.obj') {
    res.setHeader('Content-Type', 'text/plain');
  } else if (ext === '.js' && req.url.includes('/js/lib/') || req.path.endsWith('.module.js')) {
    // Set the correct MIME type for ES modules
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  
  next();
});

// Add more specific middleware for ES modules
app.use('/js/lib', (req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public'), {
  fallthrough: true,
  index: 'index.html',
  extensions: ['html'],
  etag: true,
  maxAge: '1d'
}));

// API endpoints
app.get('/api/zodiac', (req, res) => {
  const { month, day } = req.query;
  
  // Parse month and day to numbers
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  // Validate date
  if (!isValidDate(monthNum, dayNum)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid date'
    });
  }
  
  // Determine zodiac sign
  const sign = determineZodiacSign(monthNum, dayNum);
  
  if (!sign) {
    return res.status(400).json({
      status: 'error',
      message: 'Unable to determine zodiac sign'
    });
  }
  
  res.json({
    status: 'success',
    data: {
      sign: {
        name: sign.name,
        symbol: sign.symbol,
        period: `${sign.start.month}/${sign.start.day} - ${sign.end.month}/${sign.end.day}`
      }
    }
  });
});

app.get('/api/fortune', (req, res) => {
  const { month, day } = req.query;
  
  // Parse month and day to numbers
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  // Validate date
  if (!isValidDate(monthNum, dayNum)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid date'
    });
  }
  
  // Determine zodiac sign
  const sign = determineZodiacSign(monthNum, dayNum);
  
  if (!sign) {
    return res.status(400).json({
      status: 'error',
      message: 'Unable to determine zodiac sign'
    });
  }
  
  // Generate fortune
  const fortune = generateFortune(sign);
  
  res.json({
    status: 'success',
    data: {
      sign: {
        name: sign.name,
        symbol: sign.symbol
      },
      fortune
    }
  });
});

app.get('/api/horoscope', (req, res) => {
  const { month, day } = req.query;
  
  // Parse month and day to numbers
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  // Validate date
  if (!isValidDate(monthNum, dayNum)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid date'
    });
  }
  
  // Determine zodiac sign
  const sign = determineZodiacSign(monthNum, dayNum);
  
  if (!sign) {
    return res.status(400).json({
      status: 'error',
      message: 'Unable to determine zodiac sign'
    });
  }
  
  // Generate fortune
  const fortune = generateFortune(sign);
  
  res.json({
    status: 'success',
    data: {
      birthDate: {
        month: monthNum,
        day: dayNum
      },
      sign: {
        name: sign.name,
        symbol: sign.symbol,
        period: `${sign.start.month}/${sign.start.day} - ${sign.end.month}/${sign.end.day}`
      },
      fortune
    }
  });
});

// Model metadata endpoint
app.get('/api/models', (req, res) => {
  const { sign } = req.query;
  
  if (sign) {
    // Get metadata for a specific sign
    const metadata = zodiacModelController.getModelMetadata(sign);
    
    if (!metadata) {
      return res.status(404).json({
        status: 'error',
        message: `No model found for sign: ${sign}`
      });
    }
    
    return res.json({
      status: 'success',
      data: {
        ...metadata,
        modelUrl: `/models/${sign.toLowerCase()}.obj`
      }
    });
  }
  
  // Get metadata for all signs
  const signs = Object.keys(zodiacModelController.modelMetadata);
  const models = signs.map(sign => ({
    sign,
    name: zodiacModelController.modelMetadata[sign].name,
    symbol: zodiacModelController.modelMetadata[sign].symbol,
    element: zodiacModelController.modelMetadata[sign].element,
    modelUrl: `/models/${sign}.obj`
  }));
  
  res.json({
    status: 'success',
    data: {
      models,
      groups: zodiacModelController.getSignGroups(),
      colors: zodiacModelController.getSignColors()
    }
  });
});

// Add sign-specific endpoint for the model viewer
app.get('/api/signs/:sign', (req, res) => {
  const { sign } = req.params;
  
  if (!sign) {
    return res.status(400).json({
      status: 'error',
      message: 'Sign parameter is required'
    });
  }
  
  const signName = sign.toLowerCase();
  const metadata = zodiacModelController.getModelMetadata(signName);
  
  if (!metadata) {
    return res.status(404).json({
      status: 'error',
      message: `No data found for sign: ${signName}`
    });
  }
  
  // Generate a daily reading
  const dailyReading = generateFortune({ name: metadata.name }).text;
  
  // Return formatted data for the frontend
  return res.json({
    name: metadata.name,
    symbol: metadata.symbol,
    element: metadata.element,
    dates: metadata.period || `${metadata.start?.month || ''}/${metadata.start?.day || ''} - ${metadata.end?.month || ''}/${metadata.end?.day || ''}`,
    rulingPlanet: metadata.rulingPlanet || 'Unknown',
    traits: metadata.traits || ['Mysterious', 'Cosmic', 'Celestial'],
    dailyReading: dailyReading
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    uptime: process.uptime()
  });
});

// Serve SPA index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.url.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      message: `Not Found - ${req.originalUrl}`
    });
  }
  
  // Handle specific pages
  if (req.path === '/viewer' || req.path === '/viewer.html') {
    return res.sendFile(path.join(__dirname, '../public/viewer.html'));
  }
  
  // Default to index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Web UI available at http://localhost:${PORT}`);
  console.log(`🪐 3D Zodiac models available at http://localhost:${PORT}/models/[sign].obj`);
}); 