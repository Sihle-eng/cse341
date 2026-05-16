const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Simple Swagger document
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
    description: 'This is a test',
  },
  paths: {
    '/test': {
      get: {
        summary: 'Test endpoint',
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/test', (req, res) => res.json({ message: 'test' }));

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000/api-docs');
});