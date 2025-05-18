import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Galactic Horoscope API',
    version: '1.0.0',
    description: 'API documentation for the Galactic Horoscope application',
    license: {
      name: 'ISC',
    },
    contact: {
      name: 'Galactic Horoscope Support',
      url: 'https://github.com/LeighAtkins/GalacticHoroscope',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 