const app = require('./app');
const config = require('../config/config');

// Start the server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`🔗 API available at http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
  console.log(`🌐 Web UI available at http://localhost:${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = server; 