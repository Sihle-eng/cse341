const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API Documentation',
      version: '1.0.0',
      description: 'REST API for managing contacts - CSE 341 Project',
      contact: {
        name: 'Your Name',
        email: 'your.email@byui.edu'
      }
    },
    servers: [
      {
        url: process.env.RENDER_URL || 'http://localhost:8080',
        description: process.env.RENDER_URL ? 'Production Server' : 'Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;