const { MongoClient } = require('mongodb');

let database = null;

async function connectToDatabase() {
  if (database) return database;
  
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    database = client.db(); // Uses the database name from the connection string
    return database;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Helper function to convert MongoDB _id to string
function convertId(document) {
  if (!document) return null;
  return {
    ...document,
    _id: document._id.toString()
  };
}

// Helper function to convert array of documents
function convertIds(documents) {
  return documents.map(doc => convertId(doc));
}

module.exports = { connectToDatabase, convertId, convertIds };