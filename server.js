const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.get('/notes', (req, res) =>

res.sendFile(path.join(__dirname, '/public/notes.html'))

);



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



app.post('/api/notes', (req, res) => {

  const newNote = req.body;

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


app.get('*', (req, res) =>

res.sendFile(path.join(__dirname, '/public/index.html'))

);



app.listen(PORT, () =>

  console.log(`App listening at http://localhost:${PORT}`)

);
