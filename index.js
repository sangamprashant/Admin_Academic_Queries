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
app.use(require("./routes/type"));
app.use(require("./routes/course"));
app.use(require("./routes/email"));
app.use(require("./routes/notes"));
app.use(require("./routes/notesSubject"));
app.use(require("./routes/visitor"));
app.use(require("./routes/projects"));
app.use(require("./routes/ProjectsLanguages"));

mongoose.connect(process.env.MONGO_URL);
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
