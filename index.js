const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xksggv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristSpotCollection = client
      .db('touristSpotDB')
      .collection('mySpot');

    app.get('/touristSpot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/touristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post('/touristSpot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await touristSpotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put('/touristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          photo: updatedSpot.photo,
          country: updatedSpot.country,
          time: updatedSpot.time,
          seasonality: updatedSpot.seasonality,
          cost: updatedSpot.cost,
          spot: updatedSpot.spot,
          visitor: updatedSpot.visitor,
        },
      };

      const result = await touristSpotCollection.updateOne(
        filter,
        spot,
        options
      );
      res.send(result);
    });

    app.delete('/touristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Travel Management website is running');
});

app.listen(port, () => {
  console.log(`Travel server is running or port : ${port}`);
});
