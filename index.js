const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Make App
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());


// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bvzh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todoApp").collection("allTask");

        // Post Api
        app.post('/add-task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        // Patch Api
        app.patch('/task/:id', async (req, res) => {
            const { id } = req.params;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    complete: true
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Delete Api
        app.delete('/task/:id', async (req, res) => {
            const { id } = req.params;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        });

        // Patch Api
        app.get('/task', async (req, res) => {
            const result = await taskCollection.find({}).toArray();
            res.send(result);
        });

    } finally { }
}
run().catch(console.dir);

// Test Api
app.get('/', (req, res) => {
    res.send('Running to do server');
});

// Listen App
app.listen(port, () => {
    console.log('Running server on', port);
});