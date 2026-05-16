// Force Node.js to use IPv4 and Google DNS
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
console.log('Using connection string:', uri ? uri.substring(0, 50) + '...' : 'undefined');

const client = new MongoClient(uri, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
  useUnifiedTopology: true
});

async function addContacts() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('contacts_db');
    const collection = db.collection('contacts');
    
    // Sample contacts
    const contacts = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        favoriteColor: "Blue",
        birthday: "1985-03-15"
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        favoriteColor: "Green",
        birthday: "1990-07-22"
      },
      {
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
        favoriteColor: "Red",
        birthday: "1982-11-08"
      }
    ];
    
    // Clear existing contacts
    const deleteResult = await collection.deleteMany({});
    console.log(`  Cleared ${deleteResult.deletedCount} existing contacts`);
    
    // Insert new contacts
    const insertResult = await collection.insertMany(contacts);
    console.log(` Added ${insertResult.insertedCount} contacts`);
    
    // Show all contacts
    const allContacts = await collection.find({}).toArray();
    console.log('\n Your contacts:');
    allContacts.forEach(contact => {
      console.log(`   ${contact.firstName} ${contact.lastName}`);
      console.log(`   ID: ${contact._id}`);
      console.log(`   Email: ${contact.email}`);
      console.log(`   ---`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

addContacts();