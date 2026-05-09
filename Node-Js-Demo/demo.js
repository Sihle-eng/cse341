const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Sihle:7640@cluster0.ramgrbf.mongodb.net/?appName=Cluster0";
     
    const client = new MongoClient(uri);
    
    try {
        await client.connect();

        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client) {
    const databases = await client.db().admin().listDatabases();
    console.log("Available databases:");
    databases.databases.forEach(db => {
        console.log(` - ${db.name}`);
    });
}