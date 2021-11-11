const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1z8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		const database = client.db("eliteCarz_db");
    const reviewsCollection = database.collection("reviews");
    const blogsCollection = database.collection("blogs");

		// get all reviews
		app.get('/reviews', async (req, res) => {
			const cursor = await reviewsCollection.find({}).toArray();
			res.json(cursor);
		});

		// get all blogs
		app.get('/blogs', async (req, res) => {
			const cursor = await blogsCollection.find({}).toArray();
			res.json(cursor);
		});

		// get single blog
		app.get('/blogs/:id', async (req, res) => {
			const id = req.params.id;
			const filter = {_id: ObjectId(id)};
			const result = await blogsCollection.findOne(filter);
			res.json(result);
		});
	} catch {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running Elite Carz server.');
});

app.listen(port, () => {
	console.log('Running Elite Carz server on port', port);
});