const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oclat4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db('careerCode').collection('jobs');
    const applicationsCollection = client.db('careerCode').collection('application')

    
    //jobs api
    app.get('/jobs', async(req, res) =>{
        const cursor = jobsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    //GET DATA
    app.get('/jobs/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await jobsCollection.findOne(query);
        res.send(result);
    })

    //job applications related apis
    app.post('/applications', async(req, res) => {
      const application =  req.body;
      console.log(application);
      const result = await applicationsCollection.insertOne(application);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Career Code is Cooking')
})

app.listen(port, () => {
    console.log(`Career Code Server is running on Port : ${port}`);
})