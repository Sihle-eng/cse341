
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - using your contacts router
const contactsRouters = require('./routes/contacts');
app.use('/contacts', contactsRouters);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "Contacts API is running!",
    endpoints: {
      getAllContacts: "GET /contacts",
      getOneContact: "GET /contacts/:id"
    }
  });
});

// Start server (NO database connection here - that's handled in the model)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});