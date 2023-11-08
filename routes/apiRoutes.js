const path = require('path');
const router = require('express').Router();
const util = require("util");
const fs = require("fs");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Define a route to get all notes
router.get('/notes', (req, res) => {
  readFileAsync(path.join(__dirname, '../db/db.json'), "utf-8").then(function(data) {
      notes = [].concat(JSON.parse(data))
      res.json(notes);
  });
});

// Define a route to save a new note
router.post('/notes', (req, res) => {
  readFileAsync(path.join(__dirname, '../db/db.json'), 'utf-8')
      .then((data) => {
          const notes = JSON.parse(data);
          const newNote = req.body;

          // Generate a unique ID for the new note
          newNote.id = generateUniqueId(); // Implement the generateUniqueId function

          // Add the new note to the array of notes
          notes.push(newNote);

          // Write the updated notes array back to db.json
          return writeFileAsync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));
      })
      .then(() => {
          res.json(newNote);
      })
      .catch((err) => {
          res.status(500).json({ error: 'Failed to save the note' });
      });
});

// Define a route to delete a note
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  readFileAsync(path.join(__dirname, '../db/db.json'), 'utf-8')
      .then((data) => {
          let notes = JSON.parse(data);

          // Find the index of the note to delete
          const index = notes.findIndex((note) => note.id === noteId);

          if (index !== -1) {
              // Remove the note with the given ID
              notes.splice(index, 1);

              // Write the updated notes array back to db.json
              return writeFileAsync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));
          } else {
              res.status(404).json({ error: 'Note not found' });
          }
      })
      .then(() => {
          res.json({ message: 'Note deleted successfully' });
      })
      .catch((err) => {
          res.status(500).json({ error: 'Failed to delete the note' });
      });
});

function generateUniqueId() {
  // Generate a random number between 0 and 9999 (you can adjust the range as needed)
  const randomPart = Math.floor(Math.random() * 10000);

  // Get the current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Combine the timestamp and random number to create a unique ID
  const uniqueId = `${timestamp}-${randomPart}`;

  return uniqueId;
}

module.exports = router;