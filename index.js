const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcocwar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();


        const userCollection = client.db('LandingPageDB').collection('users')
        const productCollection = client.db('LandingPageDB').collection('products')
        const orderCollection = client.db('LandingPageDB').collection('orders')
        const landingCollection = client.db('LandingPageDB').collection('landing')



        //USER COLLECTION;

        // save user to db;

        app.post('/users', async (req, res) => {
            const users = req.body;
            const query = { email: users.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(users);
            res.send(result)
        })

        //get users from db;

        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { 'user.adminEmail': email }
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        // save user role to db;

        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const query = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    user
                }
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        //get user via email from db;

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email };
            const result = await userCollection.findOne(query)
            res.send(result)
        })


        //PRODUCT COLLECTION;

        //save products to db;


        app.post('/products', async (req, res) => {
            const productData = req.body;
            const result = await productCollection.insertOne(productData);
            res.send(result)
        })


        //get product from db;

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await productCollection.find(query).toArray();
            res.send(result)
        })

        //delete product from db;

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        //get product from db to update;

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query)
            res.send(result)
        })


        // get product by title from db to view only;

        app.get('/products/item/:title', async (req, res) => {
            const productTitle = req.params.title;
            const query = { productTitle: productTitle };
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        // get product by category from db to view only (not working still);

        app.get('/products/category/:id', async (req, res) => {
            const productCategory = req.params.id;
            const query = { productCategory: productCategory };
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        //update product to db;

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedProductData = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedProductData
            }
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)

        })

        //ORDER COLLECTION;

        //save order to db;

        app.post('/orders', async (req, res) => {
            const orderData = req.body;
            const result = await orderCollection.insertOne(orderData);
            res.send(result)
        })

        //get order from db;

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

        //delete order from db;

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        //get order via id to update;

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderCollection.findOne(query)
            res.send(result)
        })


        // LANDING COLLECTION;

        //save landing data to db;
        app.post('/landing', async (req, res) => {
            const landingData = req.body;
            const result = await landingCollection.insertOne(landingData);
            res.send(result)
        })

        //get landing data from db by email;

        app.get('/landing', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await landingCollection.find(query).toArray();
            res.send(result);
        })


        // get product by title from db to view only;

        app.get('/landing/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await landingCollection.findOne(query)
            res.send(result)
        })

        // delete landing data from db;

        app.delete('/landing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await landingCollection.deleteOne(query);
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
    res.send('Your Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})