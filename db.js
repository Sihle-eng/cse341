require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let db;

async function connectDB() {
    try {
        if (client && client.topology && client.topology.isConnected()) {
            return db;
        }

        console.log('Connecting to MongoDB...');
        
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        await client.connect();
        console.log('Connected to MongoDB successfully!');
        
        db = client.db(dbName);
        console.log(` Using database: ${dbName}`);
        
        // Create contacts collection if it doesn't exist
        const collections = await db.listCollections({ name: 'contacts' }).toArray();
        if (collections.length === 0) {
            await db.createCollection('contacts');
            console.log(' Created contacts collection');
        }
        
        return db;
    } catch (error) {
        console.error(' MongoDB connection error:', error.message);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
}

function getContactsCollection() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db.collection('contacts');
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

module.exports = { connectDB, getDB, getContactsCollection, closeDB };