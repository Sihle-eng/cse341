
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function investigate() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to cluster\n');
        
        // List all databases
        const adminDb = client.db('admin');
        const dbs = await adminDb.admin().listDatabases();
        console.log('All databases in this cluster:');
        dbs.databases.forEach(db => console.log(`  - ${db.name}`));
        
        // Check each database for contacts
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            
            for (const coll of collections) {
                if (coll.name === 'contacts') {
                    const count = await db.collection('contacts').countDocuments();
                    console.log(`\n✅ Found 'contacts' in database: ${dbName}`);
                    console.log(`   Contacts count: ${count}`);
                    
                    const contacts = await db.collection('contacts').find({}).toArray();
                    contacts.forEach(c => {
                        console.log(`   - ${c.firstName} ${c.lastName}`);
                    });
                }
            }
        }
        
        await client.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

investigate();
