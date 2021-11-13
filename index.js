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
		const database = client.db('eliteCarz_db');
    const reviewsCollection = database.collection('reviews');
    const blogsCollection = database.collection('blogs');
    const usersCollection = database.collection('users');
		const productsCollection = database.collection('products');
		const ordersCollection = database.collection('orders');

		// add an order
		app.post('/orders', async (req, res) => {
			const order = req.body;
			const result = await ordersCollection.insertOne(order);
			res.json(result);
		});

		// get all orders
		app.get('/orders', async (req, res) => {
			const cursor = await ordersCollection.find({}).toArray();
			res.json(cursor);
		});

		// get single order
		app.get('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const filter = {_id: ObjectId(id)};
			const result = await ordersCollection.findOne(filter);
			res.json(result);
		});

		// get all products
		app.get('/products', async (req, res) => {
			const cursor = await productsCollection.find({}).toArray();
			res.json(cursor);
		});

		// get single product
		app.get('/products/:id', async (req, res) => {
			const id = req.params.id;
			const filter = {_id: ObjectId(id)};
			const result = await productsCollection.findOne(filter);
			res.json(result);
		});

		// add an user
		app.post('/users', async (req, res) => {
			const user = req.body;
			const result = await usersCollection.insertOne(user);
			res.json(result);
		});

		// upsert (insert or update) an user
		app.put('/users', async (req, res) => {
			const user = req.body;
			const filter = {email: user.email};
			const options = { upsert: true };
			const updateDoc = { $set: user };
			const result = await usersCollection.updateOne( filter, updateDoc, options);
			res.json(result); 
		});

		// update user to admin role
		app.put('/users/admin', async (req, res) => {
			const user = req.body;
			const filter = {email: user.email};
			const updateDoc = {$set: {role: 'admin'}};
			const result = await usersCollection.updateOne(filter, updateDoc);
			res.json(result);
		})

		// check an user if admin
		app.get('/users/:email', async (req, res) => {
			const email = req.params.email;
			const query = {email: email};
			const user = await usersCollection.findOne(query);
			let isAdmin = false;
			if (user?.role === 'admin') {
				isAdmin = true;
			}
			res.json({ admin: isAdmin });
		});

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