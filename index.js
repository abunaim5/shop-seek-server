require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

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
        // await client.connect();

        const productCollection = client.db('shopSeekDB').collection('products');

        // products related apis
        app.get('/products', async (req, res) => {
            // pagination related queries
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const skip = page * size;

            // search related queries
            const search = req.query.search;

            // filter related queries
            const brand = req.query.brand;
            const category = req.query.category;
            const minPrice = req.query.min_price;
            const maxPrice = req.query.max_price;

            // sort related queries
            const sortByPrice = req.query.sortPrice;
            const sortByDate = req.query.sortDate;

            let query = {};
            
            // search by product name
            if (search) {
                query.name = {
                    $regex: search,
                    $options: 'i'
                }
            }

            // filter by brand
            if (brand && brand !== 'All') {
                query.brand = brand;
            };

            // filter by category
            if (category && category !== 'All') {
                query.category = category;
            };

            // filter by min and max price
            if (minPrice && maxPrice) {
                query.price = {
                    $gte: parseFloat(minPrice),
                    $lte: parseFloat(maxPrice)
                };
            } else if (minPrice) {
                query.price = {
                    $gte: parseFloat(minPrice)
                };
            } else if (maxPrice) {
                query.price = {
                    $lte: parseFloat(maxPrice)
                };
            }

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

            const products = await productCollection.find(query, options).toArray();
            res.send(products);
        });

        app.get('/popularProducts', async(req, res) => {
            const query = {}
            const options = {
                limit: 6,
                sort: {
                    ratings: -1
                }
            }

            const popularProducts = await productCollection.find(query, options).toArray();
            res.send(popularProducts);
        });

        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }

            const product = await productCollection.findOne(query);
            res.send(product);
        });

        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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