const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 8080;

const uri = "mongodb+srv://Sihle:7640@cluster0.ramgrbf.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("myDatabase"); // replace with your DB name
    const collection = db.collection("myCollection"); // replace with your collection name

    const data = await collection.find({}).toArray(); // get all documents
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
