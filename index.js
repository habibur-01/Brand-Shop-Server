const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())



// const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbqlcas.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db("productDB").collection('product');
    const cartCollection = client.db("productDB").collection('cart');
    

    // app.get('/users', async(req, res) => {
    //   const cursor = userCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result)
    // })
    app.get('/addproduct', async(req, res) => {
         const cursor = productCollection.find()
         const result = await cursor.toArray()
         res.send(result)
    })
    app.get('/addproduct/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result= await productCollection.findOne(query)
      res.send(result)
    })

    app.get('/cart', async(req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // app.get('/cart/:userName', async(req, res) => {
    //   const user = req.params.userName
    //   const query = {userName: new Object(user)}
    //   const cursor = cartCollection.find(query, options);
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })


    app.post('/addproduct', async(req, res) => {
      const newProduct = req.body;
      console.log( "new product :", newProduct )
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })
    app.post('/cart', async(req,res) => {
      // const id = req.params.id
      // const filter = {_id: new ObjectId(id)}
      const cartProduct = req.body
      console.log(cartProduct)
      const result = await cartCollection.insertOne(cartProduct)
      res.send(result)
    })

    // delete
    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result);
    })

    // update
    app.put('/addproduct/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedProduct = req.body
      const product = {
        $set: {
          image: updatedProduct.image, 
          name: updatedProduct.name, 
          brand: updatedProduct.brand, 
          price: updatedProduct.price, 
          rating: updatedProduct.rating,
          description: updatedProduct.description, 
          type: updatedProduct.type
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})