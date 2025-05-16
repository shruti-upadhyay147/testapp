const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware to parse form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from public/
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URL);
let db;

// Connect to MongoDB once
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("apnacollege-db");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed", err);
  }
}

// Serve index.html on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Get all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await db.collection("user").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// Add new user
app.post("/addUser", async (req, res) => {
  const userObj = req.body;
  console.log("Received user:", userObj);

  try {
    const result = await db.collection("user").insertOne(userObj);
    console.log("Inserted:", result.insertedId);
    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

startServer();


  
