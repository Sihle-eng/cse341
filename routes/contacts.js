const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();

// GET all contacts
router.get('/', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not defined');
    return res.status(500).json({ error: 'MONGODB_URI not defined' });
  }
  
  const client = new MongoClient(uri, {
    family: 4,
    serverSelectionTimeoutMS: 30000,
    useUnifiedTopology: true
  });
  
  try {
    console.log('Fetching all contacts...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('contacts_db');
    const collection = db.collection('contacts');
    
    const contacts = await collection.find({}).toArray();
    console.log(`Found ${contacts.length} contacts`);
    
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      _id: contact._id.toString()
    }));
    
    res.status(200).json(formattedContacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

// GET single contact by ID
router.get('/:id', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ error: 'MONGODB_URI not defined' });
  }
  
  const client = new MongoClient(uri, {
    family: 4,
    useUnifiedTopology: true
  });
  
  try {
    const { id } = req.params;
    console.log(`Fetching contact with ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
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