const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection details
const mongoUrl = "mongodb://uday:uday123@mongo:27017/user-account?authSource=admin";
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const databaseName = "user-account";

// Define a global `db` variable to use in routes
let db;

// Connect to MongoDB and log connection status
async function connectToMongo() {
    try {
        const client = new MongoClient(mongoUrl, mongoClientOptions);
        await client.connect();
        console.log("Connected to MongoDB successfully.");
        db = client.db(databaseName); // Set the database instance to `db`
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

connectToMongo();

// Route for serving the homepage
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for serving the profile picture
app.get('/profile-picture', async (req, res) => {
    try {
        let img = await fs.readFile(path.join(__dirname, 'images/profile-1.jpg'));
        res.writeHead(200, { 'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    } catch (err) {
        res.status(500).send('Error loading image');
    }
});

// Route for updating user profile
app.post('/update-profile', async (req, res) => {
    const userObj = req.body;
    try {
        userObj['userid'] = 1;
        const myquery = { userid: 1 };
        const newvalues = { $set: userObj };
        await db.collection("users").updateOne(myquery, newvalues, { upsert: true });
        res.send(userObj);
    } catch (err) {
        res.status(500).send('Error updating profile');
    }
});

// Route for fetching user profile
app.get('/get-profile', async (req, res) => {
    try {
        const myquery = { userid: 1 };
        const result = await db.collection("users").findOne(myquery);
        res.send(result ? result : {});
    } catch (err) {
        res.status(500).send('Error fetching profile');
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log("App listening on port 3000!");
});
