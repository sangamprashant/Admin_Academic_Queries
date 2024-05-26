const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

const http = require("http").createServer(app);

const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");

// Enable CORS
app.use(cors());

app.use(express.json());

require("./models/paper");
require("./models/Admin");
require("./models/appLinks");
require("./models/type");
require("./models/course");
require("./models/email");
require("./models/notes");
require("./models/notesSubject");
require("./models/visitors");
require("./models/projects");
require("./models/projectLanguage");
app.use(require("./routes/paper"));
app.use(require("./routes/admin"));
app.use(require("./routes/applinks"));
app.use(require("./routes/type"));
app.use(require("./routes/course"));
app.use(require("./routes/email"));
app.use(require("./routes/notes"));
app.use(require("./routes/notesSubject"));
app.use(require("./routes/visitor"));
app.use(require("./routes/projects"));
app.use(require("./routes/ProjectsLanguages"));

mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DATABASE,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo");
});
mongoose.connection.on("error", () => {
  console.log("Failed to connect to mongo");
});
// Serve the frontend
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

http.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT} `);
});

const { MongoClient } = require("mongodb");

async function migrateData() {
  const uri = process.env.MONGO_URL; // Change this if your MongoDB instance is different
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const sourceDb = client.db("test");
    const targetDb = client.db("academic_queries");

    // Fetch all collection names starting with "academicqueries"
    const collections = await sourceDb.listCollections().toArray();
    const academicQueriesCollections = collections
      .filter((col) => col.name.startsWith("academicqueries"))
      .map((col) => col.name);

    for (const collectionName of academicQueriesCollections) {
      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      const documents = await sourceCollection.find().toArray();
      if (documents.length > 0) {
        await targetCollection.insertMany(documents);
        console.log(
          `Migrated ${documents.length} documents from ${collectionName}`
        );
      } else {
        console.log(`No documents found in ${collectionName}`);
      }
    }

    console.log("Data migration completed successfully");
  } catch (error) {
    console.error("An error occurred during data migration:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// migrateData();
