
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function addContactsToAtlas() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas\n');
        
        const db = client.db('contactsdb');
        const collection = db.collection('contacts');
        
        // The 3 contacts that should be in your database
        const contacts = [
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
        
        // Check current count
        let count = await collection.countDocuments();
        console.log(`Current contacts in Atlas: ${count}`);
        
        if (count === 0) {
            // Add all 3 contacts
            const result = await collection.insertMany(contacts);
            console.log(`\n✅ Added ${result.insertedCount} contacts to Atlas:`);
            contacts.forEach(c => console.log(`  - ${c.firstName} ${c.lastName}`));
        } else {
            console.log('\nContacts already exist in Atlas');
            const existing = await collection.find({}).toArray();
            existing.forEach(c => console.log(`  - ${c.firstName} ${c.lastName}`));
        }
        
        // Verify final count
        const finalCount = await collection.countDocuments();
        console.log(`\n📊 Total contacts in Atlas: ${finalCount}`);
        
        await client.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

addContactsToAtlas();
