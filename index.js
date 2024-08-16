require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtia1kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const productCollection = client.db('shopSeekDB').collection('products');

        // products related apis
        app.get('/products', async (req, res) => {
            // pagination related queries
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const skip = page * size;

            // filter related queries
            const brand = req.query.brand;

            // sort related queries
            const sortByPrice = req.query.sortPrice;
            const sortByDate = req.query.sortDate;

            let query = {};

            // filter by brand
            if (brand) {
                if (brand === 'All') {
                    query = {};
                } else {
                    query.brand = brand;
                }
            };

            let options = {
                skip: skip,
                limit: size,
                sort: {}
            };

            // price related sorting
            if (sortByPrice === 'Default') {
                options.sort = {}
            } else if (sortByPrice === 'Low to High') {
                options.sort.price = 1;
            } else if (sortByPrice === 'High to Low') {
                options.sort.price = -1;
            }

            // date related sorting
            if (sortByDate === 'Newest') {
                options.sort.createdAt = -1;
            } else if (sortByDate === 'Oldest') {
                options.sort.createdAt = 1;
            }

            console.log(sortByDate);
            const products = await productCollection.find(query, options).toArray();
            res.send(products);
        });

        app.get('/product-count', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// basic server apis
app.get('/', (req, res) => {
    res.send('ShopSeek server is running.');
});

app.listen(port, () => {
    console.log(`ShopSeek server is running on PORT ${port}`);
});