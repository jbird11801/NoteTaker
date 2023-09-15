//global variables / required files

const express = require('express');

const path = require('path');

const fs = require('fs');

const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// middlewear

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// url .../notes => ./public/notes.html

app.get('/notes', (req, res) =>

res.sendFile(path.join(__dirname, '/public/notes.html'))

);

// gets all saved notes

app.get('/api/notes', (req, res) =>

fs.readFile('./db/db.json', 'utf8', (err, data) => {

  if (err) {

    console.error(err);

  } else {

    // Convert string into JSON object

    const parsedNotes = JSON.parse(data);

    res.json(parsedNotes);

  }

}));

//adds new notes 

app.post('/api/notes', (req, res) => {

  var newNote = req.body;

  newNote.id = uuid.v4();

  // reads currently saved notes

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    if (err) {

      console.error(err);

    } else {

      // Convert string into JSON object

      const parsedNotes = JSON.parse(data);

      // Add a new note

      parsedNotes.push(newNote);

      // Write updated reviews back to the file

      fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),(writeErr) =>

          writeErr

            ? console.error(writeErr)

            : console.info('Successfully updated Notes!')


      );

    }

  })

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    if (err) {
  
      console.error(err);
  
    } else {
  
      // Convert string into JSON object
  
      const parsedNotes = JSON.parse(data);
  
      res.json(parsedNotes);
  
    }
  
  })

});

// delets old notes

app.delete('/api/notes/:id', (req, res) => {

  var parsedNotes;

  const { id } = req.params;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    if (err) {

      console.error(err);

    } else {

      // Convert string into JSON object

      parsedNotes = JSON.parse(data);

      //console.log(typeof(parsedNotes) + " " + parsedNotes);

      const index = parsedNotes.findIndex(data => data.id == id);

      parsedNotes.splice(index, 1);

        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),(writeErr) =>

          writeErr

            ? console.error(writeErr)

            : console.info('Successfully deleted a note!')

        );

    }

  });

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    if (err) {
  
      console.error(err);
  
    } else {
  
      // Convert string into JSON object
  
      const parsedNotes = JSON.parse(data);
  
      res.json(parsedNotes);
  
    }
  
  })

});

// any path goes to homepage

app.get('*', (req, res) =>

res.sendFile(path.join(__dirname, '/public/index.html'))

);

// listens to port

app.listen(PORT, () =>

  console.log(`App listening at http://localhost:${PORT}`)

);
