const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
// get a random id to save to note
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8080;

const readFromFile = util.promisify(fs.readFile);

// Establishes middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Displays homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Displays pathway to notes file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays the raw json file
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    //console.log('data is', data);
    try {
      const fileData = JSON.parse(data);
      res.json(fileData);
    } catch {
      return res.json([]);
    }
  });
});

// Creates new notes an add to the list of notes
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    // read the contents of your db.json file first
    readFromFile("./db/db.json").then((data) => {
      // then append or push the new note to our existing data object, which is already in json format
      const existingData = JSON.parse(data);
      existingData.push(newNote);
      fs.writeFileSync("./db/db.json", JSON.stringify(existingData));
      res.json("data saved successfully");
    });
  }
  // taking info sent in post, read database as it currently exists,
  // insert note into database, and then write back to the database
});


app.delete('/api/notes/:id', (req, res) => {
  const contentId = req.params.id 
  console.log(contentId)
  readFromFile('./db/db.json')
  .then((data)=>JSON.parse(data))
  .then((response) => {
    const answer = response.filter((content)=>content.id!=contentId)
    fs.writeFileSync("./db/db.json", JSON.stringify(answer));
    res.json("data has been deleted");
  })
}) 






app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

// To Do:
// 1. Create get requests for the index.html homepage
// 2. Create get requests for the notes.html secondary page
// 3. Create get request for the json of the notes the saved?
// 4.Create a app.listen for the port you listed
// 5. Create a middleware folder ???
// 6.
