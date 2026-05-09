// Force Node.js to use IPv4 and Google DNS
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

// Root 
app.get('/', (req, res) => {
  res.json({ 
    message: "Contacts API is running!",
    endpoints: {
      getAllContacts: "GET /contacts",
      getOneContact: "GET /contacts/:id"
    }
  });
});

// Contacts routes
const contactsRouters = require('./routes/contacts');
app.use('/contacts', contactsRouters);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server running on port ${PORT}`);
});