require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const sampleContacts = [
    {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        favoriteColor: 'Blue',
        birthday: '1985-03-15'
    },
    {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        favoriteColor: 'Green',
        birthday: '1990-07-22'
    },
    {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        favoriteColor: 'Red',
        birthday: '1982-11-08'
    }
];

async function seed() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('contacts_db');
        const collection = db.collection('contacts');
        
        // Clear existing
        await collection.deleteMany({});
        console.log('Cleared existing contacts');
        
        // Insert samples
        const result = await collection.insertMany(sampleContacts);
        console.log(` Added ${result.insertedCount} contacts`);
        
        // Verify
        const contacts = await collection.find({}).toArray();
        console.log('\nContacts in database:');
        contacts.forEach(c => {
            console.log(`- ${c.firstName} ${c.lastName}`);
        });
        
        await client.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

seed();