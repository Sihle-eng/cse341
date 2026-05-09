const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();

// GET all contacts
router.get('/', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI is not defined');
    return res.status(500).json({ error: 'Database configuration error' });
  }
  
  console.log('Connecting to MongoDB...');
  console.log('URI (first 50 chars):', uri.substring(0, 50));
  
  // Force IPv4
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('contacts_db');
    const collection = db.collection('contacts');
    
    const contacts = await collection.find({}).toArray();
    console.log(`📁 Found ${contacts.length} contacts`);
    
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      _id: contact._id.toString()
    }));
    
    res.status(200).json(formattedContacts);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch contacts', 
      message: error.message 
    });
  } finally {
    await client.close();
    console.log('Connection closed');
  }
});

// GET single contact by ID
router.get('/:id', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ error: 'Database configuration error' });
  }
  
  const client = new MongoClient(uri, { family: 4 });
  
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format. Must be 24 characters.' });
    }
    
    await client.connect();
    const db = client.db('contacts_db');
    const collection = db.collection('contacts');
    
    const contact = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const formattedContact = {
      ...contact,
      _id: contact._id.toString()
    };
    
    res.status(200).json(formattedContact);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = router;