const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhwjvgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // crafts database
    const craftsCollection = client.db("craftsDB").collection('crafts');
    const subCategoryCollection = client.db("craftsDB").collection('SubCategory');
    
    app.get('/subCategory', async(req,res) =>{
        const cursor = subCategoryCollection.find();
        const result = await cursor.toArray();
  
        res.send(result)
    })

    app.get('/crafts', async(req,res) =>{
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();

      res.send(result)
  })
    
    app.get('/crafts/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftsCollection.findOne(query)
      res.send(result)
    })

    app.get('/crafts/:userName', async(req,res)=>{
      const user = req.params.userName;
      console.log(userName)
      const query = { userName: { $lt: user } };
      console.log(query)
      const result = await craftsCollection.find(query)
      res.send(result)
    })


    app.post('/crafts', async(req,res) =>{
      const newCraft = req.body;
      console.log(newCraft)
      const result = await craftsCollection.insertOne(newCraft);
      res.send(result)
  })

  app.put('/crafts/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true}
    const updatedCoffee = req.body
    const coffee={
      $set:{
        itemName: updatedCoffee.itemName,
        subCategory: updatedCoffee.subCategory,
        price: updatedCoffee.price,
        rating: updatedCoffee.rating,
        customization: updatedCoffee.customization,
        stockStatus: updatedCoffee.stockStatus,
        processingTime: updatedCoffee.processingTime,
        photo: updatedCoffee.photo,
        description: updatedCoffee.description
      }
    }

    const result = await craftsCollection.updateOne(filter, coffee,options)
    res.send(result)
  })

  app.delete('/crafts/:id', async(req,res)=>{
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await craftsCollection.deleteOne(query)
    res.send(result)
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


app.get('/', (req,res) =>{
    res.send("Art and Craft Website running ")
})

app.listen(port,() => {
    console.log(`Server Running on port: ${port}`)
})

