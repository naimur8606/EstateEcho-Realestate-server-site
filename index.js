const express = require('express');
const cors = require("cors");
// const jwt = require('jsonwebtoken'); 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kc6dmnx.mongodb.net/?retryWrites=true&w=majority`;

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

        const allProperties = client.db("EstateEcho").collection("Properties");
        const allReviews = client.db("EstateEcho").collection("Reviews");
        const allAdvertisement = client.db("EstateEcho").collection("Advertisement");
        const allUsers = client.db("EstateEcho").collection("Users");
        const allWishlist = client.db("EstateEcho").collection("Wishlist");
        const allBoughtProperties = client.db("EstateEcho").collection("BoughtProperties");


        app.get("/allProperties", async (req, res) => {
            const result = await allProperties.find().toArray();
            res.send(result);
        })
        app.get("/Properties", async (req, res) => {
            const query = { verificationStatus: "Verified" }
            const result = await allProperties.find(query).toArray();
            res.send(result);
        })

        app.get("/Properties/:id", async (req, res) => {
            const id = req.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await allProperties.findOne(query);
            res.send(result);
        })

        app.get("/Properties/myAdded/:email", async (req, res) => {
            const query = { agentEmail: req.params?.email }
            const result = await allProperties.find(query).toArray();
            res.send(result);
        })

        app.post('/Properties', async (req, res) => {
            const item = req.body;
            const result = await allProperties.insertOne(item);
            res.send(result);
        });

        app.patch('/updateProperty/:id', async (req, res) => {
            const property = req.body;
            const id = req?.params?.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    name: property.name,
                    category: property.category,
                    price: property.price,
                    recipe: property.recipe,
                    image: property.image
                }
            }
            const result = await allProperties.updateOne(filter, updatedDoc)
            res.send(result);
        });

        app.delete("/deleteProperty/:id", async (req, res) => {
            const id = req.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await allProperties.deleteOne(query);
            res.send(result);
        })

        app.get("/Advertisement", async (req, res) => {
            const result = await allAdvertisement.find().toArray();
            res.send(result);
        })

        app.get("/Reviews", async (req, res) => {
            const result = await allReviews.find().toArray();
            res.send(result);
        })
        app.get("/Reviews/:email", async (req, res) => {
            const query = { reviewerEmail: req.params?.email };
            const result = await allReviews.find(query).toArray();
            res.send(result);
        })

        app.post("/Reviews", async (req, res) => {
            const review = req.body;
            const result = await allReviews.insertOne(review);
            res.send(result);
        })

        app.delete("/Reviews/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params?.id) };
            const result = await allReviews.deleteOne(query);
            res.send(result);
        })

        app.get("/Users", async (req, res) => {
            const result = await allUsers.find().toArray();
            res.send(result);
        })
        app.get("/Users/:email", async (req, res) => {
            const query = { email: req.params?.email }
            const result = await allUsers.findOne(query);
            res.send(result)
        })

        app.post("/Users", async (req, res) => {
            const user = req?.body;
            const query = { email: req?.body?.email };
            const present = await allUsers.findOne(query)
            if (!present) {
                const result = await allUsers.insertOne(user);
                res.send(result);
            }
        })

        app.get("/Wishlist/:userEmail", async (req, res) => {
            const query = { userEmail: req.params?.userEmail }
            const result = await allWishlist.find(query).toArray();
            res.send(result)
        })
        app.get("/Wishlist/makeOffer/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params?.id) }
            const result = await allWishlist.findOne(query);
            res.send(result)
        })

        app.post('/Wishlist', async (req, res) => {
            const item = req.body;
            const query = { userEmail: req.body?.userEmail, PropertyId: req.body?.PropertyId }
            const present = await allWishlist.findOne(query);
            if (!present) {
                const result = await allWishlist.insertOne(item);
                res.send(result);
            }
            else {
                res.send({ message: 'Already added' })
            }
        });

        app.delete("/Wishlist/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params?.id) }
            const result = await allWishlist.deleteOne(query);
            res.send(result)
        })

        app.get("/boughtProperties", async (req, res) => {
            const result = await allBoughtProperties.find().toArray();
            res.send(result);
        })

        app.get("/boughtProperties/checkAgent/:email", async (req, res) => {
            const query = { agentEmail: req.params?.email }
            const result = await allBoughtProperties.find(query).toArray();
            res.send(result);
        })

        app.post("/boughtProperties", async (req, res) => {
            const review = req.body;
            const result = await allBoughtProperties.insertOne(review);
            res.send(result);
        })

        app.patch("/UpdateBoughtProperties/:id", async (req, res) => {
            const update = req.body;
            const id = req?.params?.id;
            const filter = { _id: new ObjectId(id) };
            const query= filter;
            const property = await allBoughtProperties.findOne(query);
            const updatedDoc = {
                $set: {
                    propertyLocation:property?.propertyLocation,
                    propertyTitle:property?.propertyTitle,
                    propertyImage:property?.propertyImage,
                    AgentName:property?.AgentName,
                    offeredAmount:property?.offeredAmount,
                    priceRange:property?.priceRange,
                    buyerName:property?.buyerName,
                    buyingDate:property?.buyingDate,
                    PropertyId:property?.PropertyId,
                    buyerEmail:property?.buyerEmail,
                    status:update?.status,
                    agentEmail:property?.agentEmail,
                    PropertyId:property?.PropertyId,
                    buyerEmail:property?.buyerEmail

                }
            }
            const result = await allBoughtProperties.updateOne(filter, updatedDoc)
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
    res.send('EstateEcho Server  is open...')
})

app.listen(port, () => {
    console.log(`EstateEcho Server is open on port ${port}`)
})