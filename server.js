// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static('public'));

// notes (DATA)
// =============================================================
var notes = readNote();

// ================================================== Routes ==================================================
//gets all notes
app.get('/api/notes', (req, res) => {
  let noteData = readNote();
  res.json(noteData);
});


//this function deletes notes
app.delete('/api/notes/:id', (req, res) => {
  var id = req.params.id;
  console.log(id);
  for (var i = 0; i < notes.length; i ++) {
    console.log(notes[i]['id']);
    if (notes[i]['id'] == id){
      console.log(notes[i]);
      notes.splice(i, 1);
      console.log(notes);
    }
  }
  var data = JSON.stringify(notes, null, 2);
  fs.writeFile('db/db.json', data, finished);

  function finished(err){
    console.log('write complete');
  }
  res.json(data);
});


// this function adds notes to db_js0n
app.post("/api/notes", function(req, res) {
  var newnotes = req.body;
  var id = notes.length + 1;
  console.log(id);
  newnotes['id'] = id;

  console.log(newnotes);
  notes.push(newnotes);
  res.json(newnotes);
  var data = JSON.stringify(notes, null, 2);
  fs.writeFile('db/db.json', data, finished);

  function finished(err){
    console.log('write complete');
  }
});


// this function displays content from db_json onto /api/notes
function readNote(){
  var data = JSON.parse(fs.readFileSync("db/db.json", function(err, data){
    console.log("inside readNote");
    console.log(data);
  }));
  return data;
}


//these load the html content from index.html and notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});