// Force IPv4 and custom DNS
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
console.log('Testing connection...');

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4
});

async function test() {
  try {
    await client.connect();
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    
    const db = client.db('contacts_db');
    console.log('✅ Database selected:', db.databaseName);
    
    await client.close();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();