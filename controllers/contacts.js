
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

// Get all contacts
async function getAllContacts(req, res) {
    try {
        const db = getDB();
        const collection = db.collection('contacts');
        const contacts = await collection.find({}).toArray();
        res.json(contacts);
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
}

// Get single contact by ID
async function getContactById(req, res) {
    try {
        const db = getDB();
        const collection = db.collection('contacts');
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid contact ID' });
        }
        
        const contact = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (error) {
        console.error('Error getting contact:', error);
        res.status(500).json({ error: 'Failed to get contact' });
    }
}

// Create new contact
async function createContact(req, res) {
    try {
        const db = getDB();
        const collection = db.collection('contacts');
        const newContact = req.body;
        
        // Basic validation
        if (!newContact.firstName || !newContact.lastName) {
            return res.status(400).json({ error: 'firstName and lastName are required' });
        }
        
        const result = await collection.insertOne(newContact);
        const createdContact = await collection.findOne({ _id: result.insertedId });
        
        res.status(201).json(createdContact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
}

// Update contact
async function updateContact(req, res) {
    try {
        const db = getDB();
        const collection = db.collection('contacts');
        const id = req.params.id;
        const updates = req.body;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid contact ID' });
        }
        
        // Remove _id from updates if it exists
        delete updates._id;
        
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        const updatedContact = await collection.findOne({ _id: new ObjectId(id) });
        res.json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
}

// Delete contact
async function deleteContact(req, res) {
    try {
        const db = getDB();
        const collection = db.collection('contacts');
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid contact ID' });
        }
        
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
